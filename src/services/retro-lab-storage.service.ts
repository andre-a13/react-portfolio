export type StoredRom = {
  id: string;
  name: string;
  size: number;
  lastModified: number;
  createdAt: number;
  lastPlayedAt: number;
  blob: Blob;
};

export type StoredSaveState = {
  romId: string;
  state: Blob;
  screenshot?: Blob;
  createdAt: number;
  updatedAt: number;
};

export type StoredRomSummary = Omit<StoredRom, "blob"> & {
  saveStateUpdatedAt?: number;
};

export const RETROLAB_DATABASE = {
  name: "retrolab",
  version: 2,
  stores: {
    roms: "roms",
    saveStates: "saveStates",
  },
} as const;

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(RETROLAB_DATABASE.name, RETROLAB_DATABASE.version);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(RETROLAB_DATABASE.stores.roms)) {
        const store = database.createObjectStore(RETROLAB_DATABASE.stores.roms, { keyPath: "id" });
        store.createIndex("lastPlayedAt", "lastPlayedAt");
      }

      if (!database.objectStoreNames.contains(RETROLAB_DATABASE.stores.saveStates)) {
        const store = database.createObjectStore(RETROLAB_DATABASE.stores.saveStates, { keyPath: "romId" });
        store.createIndex("updatedAt", "updatedAt");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>
) {
  return new Promise<T>((resolve, reject) => {
    openDatabase()
      .then((database) => {
        const transaction = database.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = action(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => {
          database.close();
          reject(transaction.error);
        };
      })
      .catch(reject);
  });
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function createRomId(file: File) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return toHex(hashBuffer);
}

function summarizeRom(rom: StoredRom, state?: StoredSaveState): StoredRomSummary {
  return {
    id: rom.id,
    name: rom.name,
    size: rom.size,
    lastModified: rom.lastModified,
    createdAt: rom.createdAt,
    lastPlayedAt: rom.lastPlayedAt,
    saveStateUpdatedAt: state?.updatedAt,
  };
}

async function list() {
  const [roms, states] = await Promise.all([
    withStore<StoredRom[]>(RETROLAB_DATABASE.stores.roms, "readonly", (store) => store.getAll()),
    withStore<StoredSaveState[]>(RETROLAB_DATABASE.stores.saveStates, "readonly", (store) => store.getAll()),
  ]);
  const statesByRomId = new Map(states.map((state) => [state.romId, state]));

  return roms
    .map((rom) => summarizeRom(rom, statesByRomId.get(rom.id)))
    .sort((first, second) => second.lastPlayedAt - first.lastPlayedAt);
}

async function save(file: File) {
  const id = await createRomId(file);
  const now = Date.now();
  const existingRom = await get(id);

  const rom: StoredRom = {
    id,
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    createdAt: existingRom?.createdAt ?? now,
    lastPlayedAt: now,
    blob: file,
  };

  await withStore<IDBValidKey>(RETROLAB_DATABASE.stores.roms, "readwrite", (store) => store.put(rom));
  return rom;
}

async function get(id: string) {
  const rom = await withStore<StoredRom | undefined>(RETROLAB_DATABASE.stores.roms, "readonly", (store) =>
    store.get(id)
  );
  return rom ?? null;
}

async function touch(id: string) {
  const rom = await get(id);
  if (!rom) return null;

  const updatedRom = {
    ...rom,
    lastPlayedAt: Date.now(),
  };

  await withStore<IDBValidKey>(RETROLAB_DATABASE.stores.roms, "readwrite", (store) => store.put(updatedRom));
  return updatedRom;
}

async function remove(id: string) {
  await Promise.all([
    withStore<undefined>(RETROLAB_DATABASE.stores.roms, "readwrite", (store) => store.delete(id)),
    withStore<undefined>(RETROLAB_DATABASE.stores.saveStates, "readwrite", (store) => store.delete(id)),
  ]);
}

const retroLabStorage = {
  get,
  list,
  remove,
  save,
  touch,
};

export default retroLabStorage;
