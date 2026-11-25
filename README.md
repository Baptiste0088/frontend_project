# React + Vite

## Office practice

Open `/compiler/` for a blank document. The file selector also opens spreadsheets, presentations and the academy's three exercise templates. Editing and conversion run on the learner's device. **Download copy** exports the current practice file. **Open file** reopens a DOCX, XLSX or PPTX from the device.

The Vite plugin in `scripts/onlyoffice-runtime.mjs` prepares a pinned community browser build of ONLYOFFICE. The first build or local editor visit uses Git to fetch the runtime at the specified commit. Subsequent builds reuse it from the system cache. For an offline build, point `GCA_ONLYOFFICE_SOURCE_DIR` at a local copy of the same revision. Publish the entire `dist` directory, including `compiler/runtime`, and serve `.wasm` as `application/wasm`. The editor's license and source reference ship in the runtime directory.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
