# GiftHub

A multi-page gift shop storefront built with HTML, Tailwind CSS, and vanilla JavaScript. Browse gifts by occasion, search products, and manage a shopping cart that persists between visits.

## Features

- **Category pages**: Birthday, Anniversary, Holiday, Personalized, Jewelry, and Home & Decor, plus an All Gifts home page
- **Live search**: filters the visible products as you type and updates the product count
- **Shopping cart**: add items, increase/decrease quantity, remove items, and see a running total
- **Cart drawer**: clicking the cart icon opens a slide-in drawer on any page, with a link to the full cart page
- **Persistent cart**: stored in the browser's `localStorage`, so it survives page reloads and navigation
- **Cart badge**: item count is kept in sync across every page
- **Sticky header** with logo, search bar, cart button, and category navigation

## Tech Stack

- HTML5
- [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- [Lucide](https://lucide.dev/) icons (via CDN)
- Vanilla JavaScript (no build step, no dependencies to install)

## Project Structure

```
gift-shop-ecommerce/
├── index.html          # All Gifts (home)
├── birthday.html       # Birthday gifts
├── anniversary.html    # Anniversary gifts
├── holiday.html        # Holiday gifts
├── personalized.html   # Personalized gifts
├── jewelry.html        # Jewelry gifts
├── homeanddecor.html   # Home & Decor gifts
├── cart.html           # Full shopping cart page
├── script.js           # Cart, drawer, and search logic
├── style.css           # Base styles (resets)
└── assets/
    └── images/         # Product and hero images
```

## Getting Started

No installation is needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/Adelf123/gift-shop-ecommerce.git
   cd gift-shop-ecommerce
   ```
2. Open `index.html` in your browser, or serve the folder with the VS Code **Live Server** extension.

An internet connection is required, since Tailwind and Lucide load from CDNs.

## How It Works

**Cart data** is saved in `localStorage` under the key `gifthub-cart` as a list of items:

```json
{ "id": "birthday-crown", "name": "Birthday Crown", "image": "assets/images/...", "price": 19.99, "quantity": 1 }
```

`script.js` reads the product name, price, and image directly from the product card when "Add to cart" is clicked, so new products only need to follow the existing card markup.

**Search** matches the query against all text in each product card (name, description, category tag).

## Adding a Product

Copy an existing product card inside the `grid grid-cols-4` container of a category page and update the image, name, description, price, and category tag. Update the product count above the grid.

## Contributing

1. Pull the latest changes: `git pull origin main`
2. Create a branch: `git checkout -b your-feature-name`
3. Make your changes and commit: `git add . && git commit -m "describe your change"`
4. Push: `git push origin your-feature-name`
5. Open a pull request on GitHub

## Contributors

- [Adelf123](https://github.com/Adelf123)
- [Praise-04-dev](https://github.com/Praise-04-dev)

## License
