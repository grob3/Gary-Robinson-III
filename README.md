
# GR/// Portfolio - Hygraph Setup

This portfolio uses **Hygraph** (formerly GraphCMS) for content management. It includes a custom copyright protection layer.

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

Add the following to your environment (Web Container or `.env`):

```bash
HYGRAPH_ENDPOINT=https://api-us-east-1-shared-usea1-02.hygraph.com/v2/your_id/master
```

## 4. Copyright Protection

This site has active measures to prevent image theft:
- **Right-Click Disabled**: Intercepts `contextmenu` events.
- **Drag-and-Drop Blocked**: Images cannot be dragged to the desktop.
- **Visual Alert**: A toast notification appears when a user attempts to bypass protection.
- **Print Protection**: CSS `@media print` rules hide critical imagery.
