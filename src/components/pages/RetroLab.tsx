import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router";
import "./page.scss";

type SelectedRom = {
  name: string;
  url: string;
};

const EMULATOR_DATA_URL = "https://cdn.emulatorjs.org/stable/data/";

function scriptValue(value: string) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function createEmulatorDocument(rom: SelectedRom) {
  const gameName = rom.name.replace(/\.[^/.]+$/, "") || "GBA game";

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
    </style>
  </head>
  <body>
    <div id="game"></div>
    <script>
      window.EJS_player = "#game";
      window.EJS_core = "gba";
      window.EJS_gameUrl = ${scriptValue(rom.url)};
      window.EJS_gameName = ${scriptValue(gameName)};
      window.EJS_biosUrl = "";
      window.EJS_pathtodata = ${scriptValue(EMULATOR_DATA_URL)};
      window.EJS_startOnLoaded = false;
      window.EJS_startButtonName = "Start " + ${scriptValue(gameName)};
    </script>
    <script src="${EMULATOR_DATA_URL}loader.js"></script>
  </body>
</html>`;
}

export default function RetroLab() {
  const [selectedRom, setSelectedRom] = useState<SelectedRom | null>(null);
  const selectedRomUrlRef = useRef<string | null>(null);

  const emulatorDocument = useMemo(() => {
    if (!selectedRom) return "";
    return createEmulatorDocument(selectedRom);
  }, [selectedRom]);

  useEffect(() => {
    return () => {
      if (selectedRomUrlRef.current) URL.revokeObjectURL(selectedRomUrlRef.current);
    };
  }, []);

  function handleRomChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (selectedRomUrlRef.current) URL.revokeObjectURL(selectedRomUrlRef.current);

    const url = URL.createObjectURL(file);
    selectedRomUrlRef.current = url;
    setSelectedRom({ name: file.name, url });
    event.target.value = "";
  }

  function clearRom() {
    if (selectedRomUrlRef.current) URL.revokeObjectURL(selectedRomUrlRef.current);
    selectedRomUrlRef.current = null;
    setSelectedRom(null);
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

        <div className="retrolab__controls" aria-label="ROM loader">
          <label className="retrolab__file-picker">
            <span>Choose GBA ROM</span>
            <input accept=".gba,.zip" type="file" onChange={handleRomChange} />
          </label>

          {selectedRom && (
            <>
              <p className="retrolab__rom-name">{selectedRom.name}</p>
              <button className="retrolab__clear" type="button" onClick={clearRom}>
                Clear
              </button>
            </>
          )}
        </div>

        <div className="retrolab__stage">
          {selectedRom ? (
            <iframe
              key={selectedRom.url}
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

        <p className="retrolab__note">
          ROM files are loaded locally from your browser session. Nothing is uploaded by this page.
        </p>
      </section>
    </main>
  );
}
