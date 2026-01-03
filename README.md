
# GR/// Portfolio - Hygraph Setup

This portfolio uses **Hygraph** (formerly GraphCMS) for content management. It includes a custom copyright protection layer.

## Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Getting Started

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd Gary-Robinson-III
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```bash
   HYGRAPH_ENDPOINT=https://api-us-east-1-shared-usea1-02.hygraph.com/v2/your_id/master
   GEMINI_API_KEY=your_gemini_api_key_here  # Optional, if using Gemini features
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   The site will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server (runs on port 3000)
- `npm run build` - Build for production (outputs to `dist/` folder)
- `npm run preview` - Preview the production build locally

### Verifying Changes Locally

Before pushing changes to the repository:

1. **Run the development server**:
   ```bash
   npm run dev
   ```

2. **Test all features**:
   - Navigate through the gallery
   - Check blog/journal section
   - Test theme toggle (dark/light mode)
   - Verify responsive design on different screen sizes
   - Test image protection features (right-click, drag)

3. **Build and preview production version**:
   ```bash
   npm run build
   npm run preview
   ```
   This will show you exactly how the site will look when deployed.

4. **Check the browser console** for any errors or warnings

## 1. Setup Hygraph

1. Sign up at [Hygraph.com](https://hygraph.com/).
2. Create a new Project from scratch.
3. In the **Schema** section, create two models:

### Model 1: `Photo`
*   **Display Name**: Photo
*   **API ID**: `Photo`
*   **Fields**:
    *   `Title` (Single line text)
    *   `Location` (Single line text)
    *   `Image` (Asset - Required)

### Model 2: `BlogPost`
*   **Display Name**: Blog Post
*   **API ID**: `BlogPost`
*   **Fields**:
    *   `Title` (Single line text)
    *   `Excerpt` (Multi-line text)
    *   `Content` (Markdown or Multi-line text)
    *   `Date` (Date)
    *   `ReadTime` (Single line text, e.g. "4 min read")
    *   `CoverImage` (Asset - Required)
    *   `Gallery` (Asset - Multi-select)
    *   `Tags` (Single line text - Multi-select / String Array)

## 2. API Configuration

1. Go to **Project Settings > API Access**.
2. Under **Public Content API**, ensure "Read" permissions are enabled for everyone (or create a Permanent Auth Token).
3. Copy the **Content API Endpoint URL**.

## 3. Environment Variable

Add the following to your `.env` file for local development:

```bash
HYGRAPH_ENDPOINT=https://api-us-east-1-shared-usea1-02.hygraph.com/v2/your_id/master
```

**For production deployment**, make sure to set this environment variable in your hosting platform's settings (Vercel, Netlify, etc.).

## 4. Copyright Protection

This site has active measures to prevent image theft:
- **Right-Click Disabled**: Intercepts `contextmenu` events.
- **Drag-and-Drop Blocked**: Images cannot be dragged to the desktop.
- **Visual Alert**: A toast notification appears when a user attempts to bypass protection.
- **Print Protection**: CSS `@media print` rules hide critical imagery.

## Deployment Notes

- The site uses Vite for building. Make sure your hosting platform supports Node.js builds.
- Ensure `HYGRAPH_ENDPOINT` is set as an environment variable in your hosting platform.
- The build output is in the `dist/` directory.
- If deploying to a subdirectory, update the `base` property in `vite.config.ts`.
