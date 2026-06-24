# Contributing to BootForge

We love contributions! Whether you want to add a new boot animation preset, optimize the simulation player, or fix a bug in the client-side video converter, here is how you can help.

## How to Add a Presetted Boot Animation

Adding a new boot animation is simple. Contributors do **not** need access to the production Cloudflare R2 bucket; you will build and test everything locally, and the project maintainer will handle the final CDN sync.

### Step 1: Extract & Generate Previews
1. Save your custom Android boot animation `.zip` archive inside `source-zips/` (located in the project root directory).
   * Ensure it contains standard part folders (`part0`, `part1`, etc.) and a valid `desc.txt` configuration at the root.
2. Extract the animation frames and generate the web-optimized GIF preview by running the local script from the project root:
   ```bash
   bash gallery.sh
   ```
   * This automatically processes the images, creates the preview GIF, and appends a new entry to your local database index.

### Step 2: Test Locally
1. Run the local Next.js development server:
   ```bash
   cd web
   npm run dev
   ```
2. Open `http://localhost:3000` in your browser. The app will detect that R2 is not configured locally, fallback to reading your local filesystem folders, and let you test the animation playback simulator locally.

### Step 3: Submit Your Pull Request (PR)
1. Commit the following files to your fork and submit a PR:
   * The new `.zip` file in `source-zips/`
   * The generated preview `.gif` file in `previews/`
   * The generated frames folder in `extracted/`
   * The updated `web/src/data/animations.json` entry
2. The project maintainer will verify your PR locally. If accepted, they will run `bash scripts/upload-to-r2.sh` to sync the static assets to the official Cloudflare R2 bucket and merge the changes into production!

## Code Contribution Workflow

1. Fork the repository and create your branch from `main`.
2. Install dependencies: `npm install`
3. Run in development mode: `npm run dev`
4. Ensure files format correctly: lint checks should pass cleanly.
5. Create a pull request explaining your changes.

Thanks for keeping BootForge the best boot animation toolkit on the web!
