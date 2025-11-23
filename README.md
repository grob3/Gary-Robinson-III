# GR/// Portfolio Setup Guide

This project is a React-based photography portfolio that supports a Headless CMS (Contentful) for managing photos and blog posts. 

By default, the site runs in **Demo Mode**, displaying static placeholder content. To enable dynamic content management, follow the instructions below.

## 1. Create a Contentful Account

1.  Go to [Contentful.com](https://www.contentful.com/) and sign up for a free account.
2.  Create a new "Space" (e.g., `Portfolio`).

## 2. Define Content Models

You need to create two "Content Types" in Contentful to match the application's data structure.

### Content Type 1: `photo`
*   **Name**: `Photo`
*   **API Identifier**: `photo` (Important: must be exact)
*   **Fields**:
    1.  `title` (Text - Short text)
    2.  `location` (Text - Short text)
    3.  `image` (Media - One file)

### Content Type 2: `blogPost`
*   **Name**: `Blog Post`
*   **API Identifier**: `blogPost` (Important: must be exact)
*   **Fields**:
    1.  `title` (Text - Short text)
    2.  `excerpt` (Text - Long text, appearance: multiple lines)
    3.  `content` (Text - Long text). *Note: The app expects plain text with double line breaks for paragraphs.*
    4.  `date` (Date and time)
    5.  `readTime` (Text - Short text, e.g., "5 min read")
    6.  `coverImage` (Media - One file)
    7.  `gallery` (Media - Many files)
    8.  `tags` (Text - List)

## 3. Add Content

1.  Go to the **Content** tab.
2.  Add a few "Photo" entries and "Blog Post" entries.
3.  **Publish** them.

## 4. Connect the App

To connect your portfolio to Contentful, you need your API keys.

1.  In Contentful, go to **Settings > API keys**.
2.  Add a new API key.
3.  Copy the **Space ID** and **Content Delivery API - access token**.

Add these keys to your environment variables (e.g., in `.env` or your hosting provider's dashboard):

```bash
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
```

**Note:** If you are running this in a web container or playground that does not support custom `.env` files, the app will continue to show the Demo Mode data.
