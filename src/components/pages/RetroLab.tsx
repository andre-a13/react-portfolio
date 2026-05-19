import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router";
import retroLabStorage from "../../services/retro-lab-storage.service";
import type { StoredRomSummary } from "../../services/retro-lab-storage.service";
import { createEmulatorDocument } from "./retrolab/emulatorDocument";
import type { RetroLabLaunch } from "./retrolab/emulatorDocument";
import "./page.scss";

type SelectedRom = RetroLabLaunch & {
  launchKey: number;
};

type EmulatorMessage = {
  type?: string;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
}

function getStorageErrorMessage(action: string) {
  return `Unable to ${action}. Your browser storage may be full or unavailable.`;
}

export default function RetroLab() {
  const [selectedRom, setSelectedRom] = useState<SelectedRom | null>(null);
  const [romLibrary, setRomLibrary] = useState<StoredRomSummary[]>([]);
  const [isLibraryLoading, setIsLibraryLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const launchKeyRef = useRef(0);

  const emulatorDocument = useMemo(() => {
    if (!selectedRom) return "";
    return createEmulatorDocument(selectedRom);
  }, [selectedRom]);

  useEffect(() => {
    refreshLibrary();

    function handleEmulatorMessage(event: MessageEvent<EmulatorMessage>) {
      if (event.data?.type === "retrolab:load-state") {
        setStatusMessage("Progress state loaded.");
        return;
      }

      if (event.data?.type !== "retrolab:save-state") return;

      setStatusMessage("Progress state saved locally.");
      refreshLibrary();
    }

    window.addEventListener("message", handleEmulatorMessage);
    return () => window.removeEventListener("message", handleEmulatorMessage);
  }, []);

  async function refreshLibrary() {
    setIsLibraryLoading(true);
    setStorageError(null);

    try {
      setRomLibrary(await retroLabStorage.list());
    } catch (error) {
      console.error("Unable to load stored ROM library:", error);
      setStorageError("Unable to load your local ROM library.");
    } finally {
      setIsLibraryLoading(false);
    }
  }

  function launchRom(rom: RetroLabLaunch) {
    launchKeyRef.current += 1;
    setSelectedRom({ id: rom.id, name: rom.name, launchKey: launchKeyRef.current });
  }

  async function handleRomChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatusMessage(`Saving ${file.name} locally...`);
    setStorageError(null);

    try {
      const rom = await retroLabStorage.save(file);
      launchRom(rom);
      setRomLibrary(await retroLabStorage.list());
      setStatusMessage(`${file.name} is saved locally and ready to play.`);
    } catch (error) {
      console.error("Unable to save ROM locally:", error);
      setStorageError(getStorageErrorMessage("save this ROM locally"));
      setStatusMessage(null);
    } finally {
      event.target.value = "";
    }
  }

  async function launchStoredRom(id: string) {
    setStatusMessage("Loading stored ROM...");
    setStorageError(null);

    try {
      const rom = await retroLabStorage.touch(id);
      if (!rom) {
        setStorageError("That ROM is no longer available in local storage.");
        await refreshLibrary();
        return;
      }

      launchRom(rom);
      setRomLibrary(await retroLabStorage.list());
      setStatusMessage(`${rom.name} is ready to play.`);
    } catch (error) {
      console.error("Unable to launch stored ROM:", error);
      setStorageError("Unable to launch this stored ROM.");
      setStatusMessage(null);
    }
  }

  async function deleteStoredRom(id: string) {
    setStorageError(null);

    try {
      await retroLabStorage.remove(id);
      if (selectedRom?.id === id) setSelectedRom(null);

      setRomLibrary(await retroLabStorage.list());
      setStatusMessage("ROM removed from local storage.");
    } catch (error) {
      console.error("Unable to delete stored ROM:", error);
      setStorageError("Unable to delete this ROM from local storage.");
    }
  }

  return (
    <main className="page retrolab-page">
      <section className="retrolab">
        <header className="retrolab__header">
          <div>
            <p className="retrolab__eyebrow">EmulatorJS</p>
            <h1>RetroLab</h1>
            <p>Load a Game Boy Advance ROM from your computer and play it in the browser.</p>
          </div>
          <Link className="retrolab__home-link" to="/">
            Home
          </Link>
        </header>

        <RomControls selectedRom={selectedRom} onClear={() => setSelectedRom(null)} onRomChange={handleRomChange} />

        <StatusMessage error={storageError} message={statusMessage} />

        <RomLibrary
          isLoading={isLibraryLoading}
          roms={romLibrary}
          selectedRomId={selectedRom?.id}
          onDelete={deleteStoredRom}
          onLaunch={launchStoredRom}
          onRefresh={refreshLibrary}
        />

        <EmulatorStage emulatorDocument={emulatorDocument} selectedRom={selectedRom} />

        <p className="retrolab__note">
          ROM files are stored in this browser with IndexedDB. Nothing is uploaded by this page.
        </p>
      </section>
    </main>
  );
}

type RomControlsProps = {
  selectedRom: SelectedRom | null;
  onClear: () => void;
  onRomChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function RomControls({ selectedRom, onClear, onRomChange }: RomControlsProps) {
  return (
    <div className="retrolab__controls" aria-label="ROM loader">
      <label className="retrolab__file-picker">
        <span>Import GBA ROM</span>
        <input accept=".gba,.zip" type="file" onChange={onRomChange} />
      </label>

      {selectedRom && (
        <>
          <p className="retrolab__rom-name">{selectedRom.name}</p>
          <button className="retrolab__clear" type="button" onClick={onClear}>
            Clear
          </button>
        </>
      )}
    </div>
  );
}

type StatusMessageProps = {
  error: string | null;
  message: string | null;
};

function StatusMessage({ error, message }: StatusMessageProps) {
  if (!error && !message) return null;

  return <p className={error ? "retrolab__status retrolab__status--error" : "retrolab__status"}>{error ?? message}</p>;
}

type RomLibraryProps = {
  isLoading: boolean;
  roms: StoredRomSummary[];
  selectedRomId?: string;
  onDelete: (id: string) => void;
  onLaunch: (id: string) => void;
  onRefresh: () => void;
};

function RomLibrary({ isLoading, roms, selectedRomId, onDelete, onLaunch, onRefresh }: RomLibraryProps) {
  return (
    <section className="retrolab__library" aria-labelledby="retrolab-library-title">
      <div className="retrolab__library-header">
        <h2 id="retrolab-library-title">Local ROM Library</h2>
        <button type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {isLoading && <p className="retrolab__library-empty">Loading library...</p>}

      {!isLoading && roms.length === 0 && (
        <p className="retrolab__library-empty">Imported ROMs will stay here for future sessions.</p>
      )}

      {!isLoading && roms.length > 0 && (
        <div className="retrolab__rom-list">
          {roms.map((rom) => (
            <RomCard
              key={rom.id}
              isSelected={selectedRomId === rom.id}
              rom={rom}
              onDelete={onDelete}
              onLaunch={onLaunch}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type RomCardProps = {
  isSelected: boolean;
  rom: StoredRomSummary;
  onDelete: (id: string) => void;
  onLaunch: (id: string) => void;
};

function RomCard({ isSelected, rom, onDelete, onLaunch }: RomCardProps) {
  const savedStateText = rom.saveStateUpdatedAt ? ` - Saved state ${formatDate(rom.saveStateUpdatedAt)}` : "";

  return (
    <article className="retrolab__rom-card">
      <div>
        <h3>{rom.name}</h3>
        <p>
          {formatBytes(rom.size)} - Last played {formatDate(rom.lastPlayedAt)}
          {savedStateText}
        </p>
      </div>
      <div className="retrolab__rom-actions">
        <button type="button" onClick={() => onLaunch(rom.id)}>
          {isSelected ? "Restart" : "Launch"}
        </button>
        <button type="button" onClick={() => onDelete(rom.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

type EmulatorStageProps = {
  emulatorDocument: string;
  selectedRom: SelectedRom | null;
};

function EmulatorStage({ emulatorDocument, selectedRom }: EmulatorStageProps) {
  return (
    <div className="retrolab__stage">
      {selectedRom ? (
        <iframe
          key={selectedRom.launchKey}
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          className="retrolab__emulator"
          srcDoc={emulatorDocument}
          title={`RetroLab emulator running ${selectedRom.name}`}
        />
      ) : (
        <div className="retrolab__empty">
          <h2>No ROM selected</h2>
          <p>Select a `.gba` or zipped GBA ROM to start the EmulatorJS player.</p>
        </div>
      )}
    </div>
  );
}
