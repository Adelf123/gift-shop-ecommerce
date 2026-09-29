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
  renderCartPage();
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

function renderCartView(view, cart) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  view.itemsContainer.replaceChildren();
  if (view.countBadge) view.countBadge.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  if (view.emptyState) view.emptyState.classList.toggle("hidden", cart.length > 0);
  if (view.footer) view.footer.classList.toggle("hidden", cart.length === 0);

  cart.forEach((item) => {
    const row = document.createElement("article");
    row.className = "flex gap-3 border-b border-gray-200 py-4";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.className = "h-16 w-16 shrink-0 rounded object-cover";

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
    view.itemsContainer.append(row);
  });

  if (view.totalElement) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    view.totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

function getCartView(root, selectors) {
  const itemsContainer = root.querySelector(selectors.items);
  if (!itemsContainer) return null;

  return {
    itemsContainer,
    emptyState: root.querySelector(selectors.empty),
    footer: root.querySelector(selectors.footer),
    totalElement: root.querySelector(selectors.total),
    countBadge: root.querySelector(selectors.count),
  };
}

function renderCartPage() {
  const cart = getCart();
  const views = [
    getCartView(document, {
      items: "#cart-items",
      empty: "#cart-empty",
      footer: "#cart-footer",
      total: "#cart-total",
      count: "#cart-count-badge",
    }),
    getCartView(document, {
      items: "#cart-drawer-items",
      empty: "#cart-drawer-empty",
      footer: "#cart-drawer-footer",
      total: "#cart-drawer-total",
      count: "#cart-drawer-count",
    }),
  ];

  updateCartCount(cart);
  views.filter(Boolean).forEach((view) => renderCartView(view, cart));
}

function createCartDrawer() {
  const cartLink = document.querySelector('a[href="cart.html"]');
  if (!cartLink) return null;

  const backdrop = document.createElement("button");
  backdrop.type = "button";
  backdrop.id = "cart-drawer-backdrop";
  backdrop.className = "hidden fixed inset-0 z-[60] bg-black/40 opacity-0 transition-opacity duration-300";
  backdrop.setAttribute("aria-label", "Close shopping cart");

  const drawer = document.createElement("aside");
  drawer.id = "cart-drawer";
  drawer.className = "hidden fixed right-0 top-0 z-[61] flex h-full w-full translate-x-full flex-col bg-white shadow-2xl transition-transform duration-300 sm:w-1/2 lg:w-1/4";
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-modal", "true");
  drawer.setAttribute("aria-labelledby", "cart-drawer-title");
  drawer.innerHTML = `
    <header class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
      <div>
        <h2 id="cart-drawer-title" class="text-base font-semibold">Shopping Cart</h2>
        <span id="cart-drawer-count" class="text-xs text-gray-500">0 items</span>
      </div>
      <button type="button" data-cart-close aria-label="Close shopping cart" class="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
        <i data-lucide="x" class="h-5 w-5"></i>
      </button>
    </header>
    <div class="flex-1 overflow-y-auto px-5">
      <div id="cart-drawer-empty" class="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p class="text-sm text-gray-500">Your cart is empty</p>
        <button type="button" data-cart-close class="border border-gray-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50">Continue shopping</button>
      </div>
      <div id="cart-drawer-items"></div>
    </div>
    <footer id="cart-drawer-footer" class="hidden border-t border-gray-200 px-5 py-4">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-sm font-semibold">Total</span>
        <span id="cart-drawer-total" class="text-base font-bold">$0.00</span>
      </div>
      <a href="cart.html" class="block w-full rounded-md bg-gray-900 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800">View full cart</a>
    </footer>
  `;

  document.body.append(backdrop, drawer);
  if (window.lucide) window.lucide.createIcons({ root: drawer });

  let closeTimer;

  function openDrawer() {
    window.clearTimeout(closeTimer);
    renderCartPage();
    backdrop.classList.remove("hidden");
    drawer.classList.remove("hidden");
    requestAnimationFrame(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");
      drawer.classList.remove("translate-x-full");
      drawer.classList.add("translate-x-0");
    });
    document.body.classList.add("overflow-hidden");
    drawer.querySelector("[data-cart-close]").focus();
  }

  function closeDrawer() {
    backdrop.classList.add("opacity-0");
    backdrop.classList.remove("opacity-100");
    drawer.classList.add("translate-x-full");
    drawer.classList.remove("translate-x-0");
    document.body.classList.remove("overflow-hidden");
    cartLink.focus();
    closeTimer = window.setTimeout(() => {
      backdrop.classList.add("hidden");
      drawer.classList.add("hidden");
    }, 300);
  }

  cartLink.addEventListener("click", (event) => {
    event.preventDefault();
    openDrawer();
  });
  backdrop.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (event) => {
    if (event.target.closest("[data-cart-close]")) closeDrawer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !drawer.classList.contains("hidden")) closeDrawer();
  });

  return { open: openDrawer, close: closeDrawer };
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

createCartDrawer();

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