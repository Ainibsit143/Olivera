# OLIVÉRA — Botanical Skincare

A responsive e-commerce storefront for a botanical skincare brand, built with HTML, Tailwind CSS and vanilla JavaScript.

> **Note:** This is a frontend practice project. The brand, products, testimonials and contact details are sample content. There is no backend: checkout, payments and the newsletter form do not process real orders or store emails.

## Features

- Sticky navigation with a mobile hamburger menu
- Product search
- Shopping bag drawer: add items, change quantity, remove items, live subtotal
- Cart saved in `localStorage`
- Free-shipping progress message
- Newsletter form with email validation
- Smooth scrolling and subtle scroll animations
- Keyboard-friendly interactions (Escape closes the bag, search and menu)
- Fully responsive layout

## Tech Stack

- HTML5
- Tailwind CSS v4
- Vanilla JavaScript
- Google Fonts: Cormorant Garamond and DM Sans

## Project Structure

```
Olivera/
├── index.html
├── package.json
├── assets/
│   └── images/
├── js/
│   └── script.js
└── src/
    ├── input.css
    └── output.css
```

## Run Locally

1. Install [Node.js](https://nodejs.org).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Tailwind watcher:

   ```bash
   npm run dev
   ```

4. Open `index.html` with a local server (for example, the VS Code "Live Server" extension).

To create a minified production stylesheet:

```bash
npm run build
```

## Color Palette

| Name | Hex |
|---|---|
| Forest Green | `#263B30` |
| Olive Sage | `#87977B` |
| Soft Olive | `#B8B99A` |
| Warm Ivory | `#F7F6EF` |
| Stone Beige | `#E9E4D8` |
| Deep Charcoal | `#303B32` |