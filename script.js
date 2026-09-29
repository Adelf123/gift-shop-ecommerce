const cartStorageKey = "gifthub-cart";

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function updateCartCount(cart) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = itemCount;
  });
}

function saveCart(cart) {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  updateCartCount(cart);
}

function addToCart(button) {
  const card = button.closest(".border.rounded-lg");
  const image = card?.querySelector("img");
  const name = card?.querySelector(".p-4 > p")?.textContent.trim();
  const priceText = card?.querySelector("h5")?.textContent.trim();
  const price = Number(priceText?.replace(/[^\d.]/g, ""));

  if (!card || !image || !name || !Number.isFinite(price)) return;

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      image: image.getAttribute("src"),
      price,
      quantity: 1,
    });
  }

  saveCart(cart);
  const label = button.querySelector("span");
  if (label) {
    const previousText = label.textContent;
    label.textContent = "Added";
    window.setTimeout(() => {
      label.textContent = previousText;
    }, 900);
  }
}

function createCartButton(label, action, itemId) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.cartAction = action;
  button.dataset.itemId = itemId;
  button.className = "border border-gray-300 rounded px-2 py-1 text-sm hover:bg-gray-100";
  button.textContent = label;
  return button;
}

function renderCartPage() {
  const itemsContainer = document.querySelector("#cart-items");
  if (!itemsContainer) return;

  const cart = getCart();
  const emptyState = document.querySelector("#cart-empty");
  const footer = document.querySelector("#cart-footer");
  const totalElement = document.querySelector("#cart-total");
  const countBadge = document.querySelector("#cart-count-badge");
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  itemsContainer.replaceChildren();
  updateCartCount(cart);
  if (countBadge) countBadge.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  if (emptyState) emptyState.classList.toggle("hidden", cart.length > 0);
  if (footer) footer.classList.toggle("hidden", cart.length === 0);

  cart.forEach((item) => {
    const row = document.createElement("article");
    row.className = "flex gap-4 border-b border-gray-200 py-4";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.className = "h-20 w-20 rounded object-cover";

    const details = document.createElement("div");
    details.className = "min-w-0 flex-1";

    const name = document.createElement("h2");
    name.className = "text-sm font-semibold";
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "mt-1 text-sm text-gray-600";
    price.textContent = `$${item.price.toFixed(2)} each`;

    const controls = document.createElement("div");
    controls.className = "mt-3 flex items-center gap-2";
    const quantity = document.createElement("span");
    quantity.className = "min-w-6 text-center text-sm";
    quantity.textContent = item.quantity;
    controls.append(
      createCartButton("-", "decrease", item.id),
      quantity,
      createCartButton("+", "increase", item.id),
      createCartButton("Remove", "remove", item.id),
    );

    details.append(name, price, controls);
    row.append(image, details);
    itemsContainer.append(row);
  });

  if (totalElement) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

const searchInput = document.querySelector('input[placeholder="Search for gifts..."]');
const productGrid = document.querySelector("section .grid.grid-cols-4");

if (searchInput && productGrid) {
  const products = Array.from(productGrid.children);
  const productCount = productGrid.closest("section").querySelector("span");
  const emptyMessage = document.createElement("p");

  emptyMessage.className = "hidden col-span-full py-8 text-center text-sm text-gray-500";
  emptyMessage.textContent = "No gifts match your search.";
  emptyMessage.setAttribute("role", "status");
  productGrid.append(emptyMessage);

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    products.forEach((product) => {
      const matches = product.textContent.toLowerCase().includes(query);
      product.hidden = !matches;
      visibleCount += Number(matches);
    });

    if (productCount) {
      productCount.textContent = `${visibleCount} ${visibleCount === 1 ? "product" : "products"}`;
    }

    emptyMessage.classList.toggle("hidden", visibleCount > 0);
  });
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.textContent.toLowerCase().includes("add to cart")) {
    addToCart(button);
    return;
  }

  const action = button.dataset.cartAction;
  if (!action) return;

  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === button.dataset.itemId);
  if (action === "remove") {
    saveCart(cart.filter((cartItem) => cartItem.id !== button.dataset.itemId));
  } else if (item) {
    item.quantity += action === "increase" ? 1 : -1;
    saveCart(cart.filter((cartItem) => cartItem.quantity > 0));
  }
  renderCartPage();
});

updateCartCount(getCart());
renderCartPage();