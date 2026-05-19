import { RETROLAB_DATABASE } from "../../../services/retro-lab-storage.service";
import type { StoredRomSummary } from "../../../services/retro-lab-storage.service";

export type RetroLabLaunch = Pick<StoredRomSummary, "id" | "name">;

const EMULATOR_DATA_URL = "https://cdn.emulatorjs.org/stable/data/";

function scriptValue(value: string) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function gameNameFromRom(romName: string) {
  return romName.replace(/\.[^/.]+$/, "") || "GBA game";
}

export function createEmulatorDocument(rom: RetroLabLaunch) {
  const gameName = gameNameFromRom(rom.name);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        background: #11131a;
        color: #f8fafc;
        overflow: hidden;
      }

      #game {
        width: 100%;
        height: 100%;
      }

      #message {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        padding: 2rem;
        color: #cbd5e1;
        font-family: system-ui, sans-serif;
        text-align: center;
      }

      #message.error {
        color: #fecaca;
      }
    </style>
  </head>
  <body>
    <div id="game"></div>
    <div id="message">Loading ROM from local storage...</div>
    <script>
      (() => {
        const romId = ${scriptValue(rom.id)};
        const databaseName = ${scriptValue(RETROLAB_DATABASE.name)};
        const databaseVersion = ${RETROLAB_DATABASE.version};
        const romStore = ${scriptValue(RETROLAB_DATABASE.stores.roms)};
        const saveStateStore = ${scriptValue(RETROLAB_DATABASE.stores.saveStates)};
        const message = document.getElementById("message");

        function openDatabase() {
          return new Promise((resolve, reject) => {
            const request = indexedDB.open(databaseName, databaseVersion);

            request.onupgradeneeded = () => {
              const database = request.result;

              if (!database.objectStoreNames.contains(romStore)) {
                const store = database.createObjectStore(romStore, { keyPath: "id" });
                store.createIndex("lastPlayedAt", "lastPlayedAt");
              }

              if (!database.objectStoreNames.contains(saveStateStore)) {
                const store = database.createObjectStore(saveStateStore, { keyPath: "romId" });
                store.createIndex("updatedAt", "updatedAt");
              }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
        }

        function readRecord(storeName, key) {
          return openDatabase().then((database) => new Promise((resolve, reject) => {
            const transaction = database.transaction(storeName, "readonly");
            const request = transaction.objectStore(storeName).get(key);

            request.onsuccess = () => {
              database.close();
              resolve(request.result);
            };
            request.onerror = () => {
              database.close();
              reject(request.error);
            };
          }));
        }

        function writeRecord(storeName, value) {
          return openDatabase().then((database) => new Promise((resolve, reject) => {
            const transaction = database.transaction(storeName, "readwrite");
            const request = transaction.objectStore(storeName).put(value);

            request.onsuccess = () => resolve(value);
            request.onerror = () => reject(request.error);
            transaction.oncomplete = () => database.close();
            transaction.onerror = () => {
              database.close();
              reject(transaction.error);
            };
          }));
        }

        function toBlob(value) {
          if (!value) return null;
          if (value instanceof Blob) return value;
          if (value instanceof ArrayBuffer) return new Blob([value], { type: "application/octet-stream" });
          if (ArrayBuffer.isView(value)) {
            return new Blob([value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength)], {
              type: "application/octet-stream"
            });
          }
          return null;
        }

        function toUint8Array(value) {
          if (!value) return Promise.resolve(null);
          if (value instanceof Uint8Array) return Promise.resolve(value);
          if (value instanceof ArrayBuffer) return Promise.resolve(new Uint8Array(value));
          if (ArrayBuffer.isView(value)) {
            const buffer = value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
            return Promise.resolve(new Uint8Array(buffer));
          }
          if (value instanceof Blob) {
            return value.arrayBuffer().then((buffer) => new Uint8Array(buffer));
          }
          return Promise.resolve(null);
        }

        function getRom() {
          return readRecord(romStore, romId);
        }

        function getSaveState() {
          return readRecord(saveStateStore, romId);
        }

        function saveProgress(payload) {
          const state = toBlob(payload && payload.state);
          if (!state) return Promise.resolve(null);

          const now = Date.now();
          const record = {
            romId,
            state,
            screenshot: toBlob(payload && payload.screenshot) || undefined,
            createdAt: now,
            updatedAt: now
          };

          return writeRecord(saveStateStore, record).then(() => now);
        }

        function loadProgress() {
          return getSaveState()
            .then((record) => {
              if (!record || !record.state) throw new Error("No progress state has been saved for this ROM.");
              return toUint8Array(record.state);
            })
            .then((stateBytes) => {
              if (!stateBytes) throw new Error("Stored progress state uses an unsupported data type.");

              window.EJS_emulator.gameManager.loadState(stateBytes);
              showEmulatorMessage("Loaded RetroLab progress", 2500);
            });
        }

        function showEmulatorMessage(text, duration) {
          if (window.EJS_emulator && window.EJS_emulator.displayMessage) {
            window.EJS_emulator.displayMessage(text, duration);
          }
        }

        function loadEmulatorScript() {
          const loader = document.createElement("script");
          loader.src = ${scriptValue(`${EMULATOR_DATA_URL}loader.js`)};
          document.body.appendChild(loader);
        }

        function configureEmulator(romUrl, stateUrl) {
          window.EJS_player = "#game";
          window.EJS_core = "gba";
          window.EJS_gameUrl = romUrl;
          window.EJS_loadStateURL = stateUrl;
          window.EJS_gameName = ${scriptValue(gameName)};
          window.EJS_biosUrl = "";
          window.EJS_pathtodata = ${scriptValue(EMULATOR_DATA_URL)};
          window.EJS_fixedSaveInterval = 10000;
          window.EJS_defaultOptions = {
            "save-state-slot": 1,
            "save-state-location": "browser"
          };
          window.EJS_Buttons = {
            saveState: {
              visible: true,
              displayName: "Save Progress"
            },
            loadState: {
              visible: true,
              displayName: "Load Progress"
            },
            quickSave: false,
            quickLoad: false
          };
          window.EJS_onSaveState = (payload) => {
            saveProgress(payload)
              .then((updatedAt) => {
                if (!updatedAt) return;
                showEmulatorMessage("Saved RetroLab progress", 2500);
                window.parent.postMessage({ type: "retrolab:save-state", romId, updatedAt }, "*");
              })
              .catch((error) => console.error("Unable to save progress state:", error));
          };
          window.EJS_onLoadState = () => {
            loadProgress()
              .then(() => window.parent.postMessage({ type: "retrolab:load-state", romId }, "*"))
              .catch((error) => {
                console.error("Unable to load progress state:", error);
                showEmulatorMessage(error.message || "Unable to load RetroLab progress", 3000);
              });
          };
          window.EJS_startOnLoaded = false;
          window.EJS_startButtonName = "Start " + ${scriptValue(gameName)};
        }

        Promise.all([getRom(), getSaveState()])
          .then(([rom, savedState]) => {
            if (!rom || !rom.blob) throw new Error("ROM not found in local storage.");

            const romUrl = URL.createObjectURL(rom.blob);
            const stateUrl = savedState && savedState.state ? URL.createObjectURL(savedState.state) : "";

            window.addEventListener("pagehide", () => {
              URL.revokeObjectURL(romUrl);
              if (stateUrl) URL.revokeObjectURL(stateUrl);
            }, { once: true });

            configureEmulator(romUrl, stateUrl);
            if (message) message.remove();
            loadEmulatorScript();
          })
          .catch((error) => {
            console.error("Unable to load ROM from IndexedDB:", error);

            if (message) {
              message.className = "error";
              message.textContent = "Unable to load this ROM from local storage. Try deleting and importing it again.";
            }
          });
      })();
    </script>
  </body>
</html>`;
}
