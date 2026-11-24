"use strict";

(() => {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const announcement = document.getElementById("announcement");
  const announcementClose = document.getElementById("announcement-close");
  const mobileMenuButton = document.getElementById("mobile-menu-btn");
  const mobileNav = document.getElementById("mobile-nav");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const filterButtons = Array.from(document.querySelectorAll("[data-category].filter-btn"));
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const resultsStatus = document.getElementById("results-status");
  const noResults = document.getElementById("no-results");
  const cartButton = document.getElementById("cart-btn");
  const cartPanel = document.getElementById("cart-panel");
  const cartClose = document.getElementById("cart-close");
  const cartBackdrop = document.getElementById("drawer-backdrop");
  const cartItemsList = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartCount = document.getElementById("cart-count");
  const cartNote = document.querySelector(".cart-note");
  const cartTotal = document.getElementById("cart-total");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterStatus = document.getElementById("newsletter-status");
  const quickViewDialog = document.getElementById("quick-view-dialog");
  const quickViewContent = document.getElementById("quick-view-content");
  const cart = new Map();
  let selectedCategory = "all";
  let previousFocus = null;

  function hasVerifiedPrice(card) {
    const price = Number(card.dataset.price);
    return card.dataset.price !== undefined && Number.isFinite(price) && price > 0;
  }

  function hasVerifiedPopularity(card) {
    const popularity = Number(card.dataset.popularity);
    return card.dataset.popularity !== undefined && Number.isFinite(popularity);
  }

  productCards.forEach((card) => {
    const addButton = card.querySelector(".btn-card");
    const hasCartDetails = Boolean(
      card.dataset.productId &&
      card.dataset.currency &&
      hasVerifiedPrice(card)
    );
    if (addButton && hasCartDetails) addButton.disabled = false;
  });

  if (sortSelect) {
    const hasPrices = productCards.some(hasVerifiedPrice);
    const hasPopularity = productCards.some(hasVerifiedPopularity);
    const priceLowOption = sortSelect.querySelector('option[value="price-low"]');
    const priceHighOption = sortSelect.querySelector('option[value="price-high"]');
    const popularityOption = sortSelect.querySelector('option[value="popularity"]');
    if (priceLowOption) priceLowOption.disabled = !hasPrices;
    if (priceHighOption) priceHighOption.disabled = !hasPrices;
    if (popularityOption) popularityOption.disabled = !hasPopularity;
  }

  function readTheme() {
    try {
      const savedTheme = window.localStorage.getItem("richi-theme");
      return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
    } catch (error) {
      console.warn("Richi could not read the saved theme preference.", error);
      return "dark";
    }
  }

  function applyTheme(theme) {
    const isLight = theme === "light";
    body.classList.toggle("light", isLight);

    if (themeToggle) {
      const nextTheme = isLight ? "dark" : "light";
      themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      themeToggle.title = `Switch to ${nextTheme} theme`;
    }
  }

  applyTheme(readTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = body.classList.contains("light") ? "dark" : "light";
      applyTheme(nextTheme);

      try {
        window.localStorage.setItem("richi-theme", nextTheme);
      } catch (error) {
        console.warn("Richi could not save the theme preference.", error);
      }
    });
  }

  if (announcementClose && announcement) {
    announcementClose.addEventListener("click", () => {
      announcement.hidden = true;
    });
  }

  function setMobileMenuOpen(isOpen) {
    if (!mobileMenuButton || !mobileNav) return;

    mobileNav.hidden = !isOpen;
    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

    if (isOpen) {
      const firstLink = mobileNav.querySelector("a");
      if (firstLink) firstLink.focus();
    } else {
      mobileMenuButton.focus();
    }
  }

  if (mobileMenuButton && mobileNav) {
    mobileMenuButton.addEventListener("click", () => {
      const isOpen = mobileMenuButton.getAttribute("aria-expanded") !== "true";
      setMobileMenuOpen(isOpen);
    });

    mobileNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMobileMenuOpen(false);
    });
  }

  function categoryForCard(card) {
    const category = card.querySelector(".product-category");
    if (!category) return "all";

    const value = category.textContent.trim().toLowerCase();
    if (value === "gaming accessories") return "accessories";
    if (value === "pc components") return "all";
    return value.replace(/\s+/g, "-");
  }

  function filterProducts() {
    const query = searchInput ? searchInput.value.trim().toLocaleLowerCase() : "";
    let visibleCount = 0;

    productCards.forEach((card) => {
      const matchesCategory = selectedCategory === "all" || categoryForCard(card) === selectedCategory;
      const matchesSearch = !query || card.textContent.toLocaleLowerCase().includes(query);
      const isVisible = matchesCategory && matchesSearch;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (noResults) noResults.hidden = visibleCount > 0;
    if (resultsStatus) {
      const itemLabel = visibleCount === 1 ? "catalog item" : "catalog items";
      resultsStatus.textContent = `${visibleCount} ${itemLabel} shown`;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category || "all";
      filterButtons.forEach((filterButton) => {
        const isSelected = filterButton === button;
        filterButton.classList.toggle("is-active", isSelected);
        filterButton.setAttribute("aria-pressed", String(isSelected));
      });
      filterProducts();
    });
  });

  if (searchInput) searchInput.addEventListener("input", filterProducts);
  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      filterProducts();
      document.getElementById("components")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const sortValue = sortSelect.value;
      const grid = document.getElementById("products-grid");
      if (!grid) return;

      let sortedCards = productCards.slice();
      if (sortValue === "price-low" || sortValue === "price-high") {
        const direction = sortValue === "price-low" ? 1 : -1;
        sortedCards = sortedCards.filter(hasVerifiedPrice).sort((first, second) => {
          return (Number(first.dataset.price) - Number(second.dataset.price)) * direction;
        });
        sortedCards.push(...productCards.filter((card) => !hasVerifiedPrice(card)));
      } else if (sortValue === "popularity") {
        sortedCards = sortedCards.filter(hasVerifiedPopularity).sort((first, second) => {
          return Number(second.dataset.popularity) - Number(first.dataset.popularity);
        });
        sortedCards.push(...productCards.filter((card) => !hasVerifiedPopularity(card)));
      }

      sortedCards.forEach((card) => grid.appendChild(card));
    });
  }

  document.querySelectorAll("[data-category-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const categoryButton = filterButtons.find((button) => button.dataset.category === link.dataset.categoryLink);
      if (!categoryButton) return;
      categoryButton.click();
    });
  });

  document.querySelectorAll('a[href="#gaming"], a[href="#new-arrivals"]').forEach((link) => {
    link.addEventListener("click", () => {
      const allCategoriesButton = filterButtons.find((button) => button.dataset.category === "all");
      if (allCategoriesButton && selectedCategory !== "all") allCategoriesButton.click();
    });
  });

  function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => !element.hidden);
  }

  function openCart() {
    if (!cartPanel || !cartBackdrop) return;
    previousFocus = document.activeElement;
    cartPanel.hidden = false;
    cartPanel.setAttribute("aria-hidden", "false");
    cartBackdrop.hidden = false;
    body.classList.add("drawer-open");
    cartPanel.focus();
  }

  function closeCart() {
    if (!cartPanel || !cartBackdrop || cartPanel.hidden) return;
    cartPanel.hidden = true;
    cartPanel.setAttribute("aria-hidden", "true");
    cartBackdrop.hidden = true;
    body.classList.remove("drawer-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    } else if (cartButton) {
      cartButton.focus();
    }
  }

  if (cartButton) cartButton.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

  function formatCurrency(amount, currency) {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  }

  function renderCart() {
    if (!cartItemsList || !cartCount || !cartEmpty || !cartTotal || !cartSubtotal) return;

    cartItemsList.replaceChildren();
    let itemCount = 0;
    let subtotal = 0;
    let currency = null;

    cart.forEach((item, id) => {
      itemCount += item.quantity;
      subtotal += item.price * item.quantity;
      currency = item.currency;

      const row = document.createElement("li");
      row.className = "cart-item";
      const info = document.createElement("div");
      const title = document.createElement("h3");
      const details = document.createElement("p");
      title.textContent = item.name;
      details.textContent = formatCurrency(item.price, item.currency);
      info.append(title, details);

      const quantityControls = document.createElement("div");
      quantityControls.className = "quantity-controls";
      quantityControls.setAttribute("aria-label", `Quantity for ${item.name}`);

      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.dataset.cartAction = "decrease";
      decrease.dataset.productId = id;
      decrease.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
      decrease.textContent = "−";

      const quantity = document.createElement("span");
      quantity.textContent = String(item.quantity);
      quantity.setAttribute("aria-live", "polite");

      const increase = document.createElement("button");
      increase.type = "button";
      increase.dataset.cartAction = "increase";
      increase.dataset.productId = id;
      increase.setAttribute("aria-label", `Increase quantity of ${item.name}`);
      increase.textContent = "+";
      quantityControls.append(decrease, quantity, increase);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-item";
      remove.dataset.cartAction = "remove";
      remove.dataset.productId = id;
      remove.setAttribute("aria-label", `Remove ${item.name} from cart`);
      remove.textContent = "Remove";
      row.append(info, quantityControls, remove);
      cartItemsList.appendChild(row);
    });

    cartCount.textContent = String(itemCount);
    if (cartButton) {
      const itemLabel = itemCount === 1 ? "item" : "items";
      cartButton.setAttribute("aria-label", `Open shopping cart, ${itemCount} ${itemLabel}`);
    }
    cartEmpty.hidden = itemCount > 0;
    cartTotal.hidden = itemCount === 0;
    if (itemCount > 0 && currency) cartSubtotal.textContent = formatCurrency(subtotal, currency);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const item = cart.get(button.dataset.productId);
    if (!item) return;

    if (button.dataset.cartAction === "increase") {
      item.quantity += 1;
    } else if (button.dataset.cartAction === "decrease") {
      item.quantity -= 1;
      if (item.quantity <= 0) cart.delete(button.dataset.productId);
    } else if (button.dataset.cartAction === "remove") {
      cart.delete(button.dataset.productId);
    }
    renderCart();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-card:not([disabled])");
    if (!button) return;

    const card = button.closest(".product-card");
    if (!card) return;
    const id = card.dataset.productId;
    const price = Number(card.dataset.price);
    const currency = card.dataset.currency;
    const name = card.querySelector("h3")?.textContent.trim();

    if (!id || !name || !Number.isFinite(price) || price <= 0 || !currency) {
      console.error("A catalog item needs a verified product ID, price, and currency before it can be added to the cart.");
      return;
    }

    try {
      formatCurrency(price, currency);
    } catch (error) {
      console.error("A catalog item has an invalid currency code and cannot be added to the cart.", error);
      return;
    }

    const hasDifferentCurrency = Array.from(cart.values()).some((item) => item.currency !== currency);
    if (hasDifferentCurrency) {
      if (cartNote) cartNote.textContent = "Items with different currencies cannot be combined in one cart.";
      return;
    }
    if (cartNote) cartNote.textContent = "Checkout is not available yet.";

    const existing = cart.get(id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.set(id, { name, price, currency, quantity: 1 });
    }
    renderCart();
    openCart();
  });

  function handleEscape(event) {
    if (event.key !== "Escape") return;
    if (cartPanel && !cartPanel.hidden) {
      closeCart();
    } else if (mobileNav && !mobileNav.hidden) {
      setMobileMenuOpen(false);
    }
  }

  document.addEventListener("keydown", (event) => {
    handleEscape(event);

    if (!cartPanel || cartPanel.hidden || event.key !== "Tab") return;
    const focusable = getFocusableElements(cartPanel);
    if (focusable.length === 0) {
      event.preventDefault();
      cartPanel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === cartPanel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (newsletterForm && newsletterEmail && newsletterStatus) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      newsletterStatus.classList.remove("is-error");
      newsletterEmail.removeAttribute("aria-invalid");

      if (!newsletterEmail.value.trim() || !newsletterEmail.validity.valid) {
        newsletterStatus.textContent = "Enter a valid email address.";
        newsletterStatus.classList.add("is-error");
        newsletterEmail.setAttribute("aria-invalid", "true");
        newsletterEmail.focus();
        return;
      }

      newsletterStatus.textContent = "Thanks! Newsletter sign-up is a demo and is not connected yet.";
      newsletterForm.reset();
    });
  }

  if (quickViewDialog && quickViewContent) {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".quick-view-btn");
      if (!button) return;

      const card = button.closest(".product-card");
      if (!card) return;
      const title = card.querySelector("h3")?.textContent.trim() || "Product details";
      const category = card.querySelector(".product-category")?.textContent.trim() || "Catalog";
      quickViewContent.replaceChildren();

      const categoryLabel = document.createElement("p");
      categoryLabel.className = "eyebrow";
      categoryLabel.textContent = category;
      const heading = document.createElement("h2");
      heading.id = "quick-view-heading";
      heading.textContent = title;
      const message = document.createElement("p");
      message.textContent = "Verified product information is not available yet. Details coming soon.";
      quickViewContent.append(categoryLabel, heading, message);

      if (typeof quickViewDialog.showModal === "function") {
        quickViewDialog.showModal();
      }
    });
  }

  const quickViewClose = document.getElementById("quick-view-close");
  if (quickViewClose && quickViewDialog) {
    quickViewClose.addEventListener("click", () => quickViewDialog.close());
  }

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  renderCart();
  filterProducts();
})();
