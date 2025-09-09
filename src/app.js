// variables
const navMenu = document.querySelector('[data-nav]');
const categoriesContainer = document.querySelector('[data-categories-container]');
const plantsContainer = document.querySelector('[data-plants-container]');
const categoryModal = document.querySelector('[data-category-modal]');
const cartModal = document.querySelector('[data-cart-modal]');
const descriptionModal = document.querySelector('[data-description-modal]');
const descriptionModalContentContainer = document.querySelector('[data-description-modal-content-container]');

// svg's
const svg = {
  close: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>',
  closeLarge: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>',
};

// data fetching
let plants = [];
let categories = ['all'];

function renderCategories() {
  categoriesContainer.innerHTML = categories.map((category, index) => `<button data-category-btn data-category-id="${index}" class="category-select-btn ${index == 0 ? 'active' : ''}">${category}</button>`).join('');
}

function eachPlantCard(eachPlant) {
  const { id, category, name, description, price, image } = eachPlant;
  return `
    <div class="each-plant-card">
      <div data-description-trigger data-plant-id="${id}" class="pointer-fine:cursor-pointer group space-y-2">
        <div class="each-plant-card-img-container relative overflow-hidden">
          <span class="absolute inset-0 z-5"></span>
          <div class="img-loader absolute inset-0 z-2"></div>
          <img data-plant-img class="size-full object-cover object-center block pointer-fine:group-hover:scale-[1.2]" src="${image}" alt="${name}" loading="lazy"/>
        </div>
        <div class="each-plant-card-text-container">
          <h5>${name}</h5>
          <p>${description}</p>
        </div>
      </div>
      <div class="each-plant-card-category-container">
        <span>${category}</span>
        <span>৳${price}</span>
      </div>
      <button data-plant-id="${id}" data-cart-btn class="add-to-cart-btn">Add to Cart</button>
    </div>
  `;
}

plantsContainer.addEventListener(
  'load',
  (e) => {
    const img = e.target.closest('[data-plant-img]');
    if (img) {
      img.previousElementSibling.classList.add('hide');
      img.classList.add('show');
    }
  },
  true,
);

function renderPlants(plantsData) {
  plantsContainer.innerHTML = plantsData.map((eachPlant) => eachPlantCard(eachPlant)).join('');
}

let timeout;

async function renderPlantsByCategory(categoryId = '0') {
  plantsContainer.innerHTML = `
    <div class="rounded-lg bg-white p-4 shadow-sm">
      <div class="flex justify-center h-[300px] items-center gap-1">
        <div class="animate-[ping_1s_infinite] size-[8px] rounded-full bg-zinc-600"></div>
        <div class="animate-[ping_1s_100ms_infinite] size-[8px] rounded-full bg-zinc-600"></div>
        <div class="animate-[ping_1s_200ms_infinite] size-[8px] rounded-full bg-zinc-600"></div>
        <div class="animate-[ping_1s_300ms_infinite] size-[8px] rounded-full bg-zinc-600"></div>
      </div>
    </div>`;
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(async () => {
    if (categoryId == 0) {
      try {
        const plantsUrl = 'https://openapi.programming-hero.com/api/plants';
        const res = await fetch(plantsUrl);
        const data = await res.json();
        renderPlants(data.plants);
      } catch (err) {
        console.error(err);
      }
      return;
    }

    try {
      const categoryUrl = `https://openapi.programming-hero.com/api/category/${categoryId}`;
      const res = await fetch(categoryUrl);
      const data = await res.json();
      renderPlants(data.plants);
    } catch (err) {
      console.error(err);
    }
  }, 500);
}

//! --- Base function ---
(async () => {
  try {
    const url = 'https://openapi.programming-hero.com/api/plants';
    const res = await fetch(url);
    const data = await res.json();

    plants = data.plants;

    plants.forEach((eachPlant) => {
      const category = eachPlant.category;
      if (!categories.includes(category)) {
        categories.push(category);
      }
    });

    renderCategories();
    setTimeout(() => {
      renderPlants(plants);
    }, 500);
  } catch (err) {
    console.error(err);
  }
})();

// add to cart
const cartList = [];
const cartContainer = document.querySelector('[data-cart-container]');
const totalPriceContainer = document.querySelector('[data-total-cost]');

function renderCartContainer() {
  cartContainer.innerHTML = cartList
    .map((eachPlant) => {
      const { name, id, price } = eachPlant;
      return `
     <div class="flex items-center justify-between bg-(--main-bg) p-3 rounded-md">
      <div class="grid">
        <span>${name}</span>
        <span class="flex items-center">৳${price} ${svg.close} 1</span>
      </div>
      <button data-cart-remove-btn data-plant-id="${id}" class="relative">
        ${svg.closeLarge}
        <span class="absolute -inset-2 pointer-fine:hidden"></span>
      </button>
     </div>
    `;
    })
    .join('');

  totalPriceContainer.innerHTML = `৳${cartList.reduce((acc, eachPlant) => acc + eachPlant.price, 0)}`;
}

function addToCart(btn) {
  const id = btn.dataset.plantId;
  const selectedPlant = plants.find((eachPlant) => eachPlant.id == id);
  if (selectedPlant && !cartList.find((eachPlant) => eachPlant.id == id)) {
    cartList.push(selectedPlant);
    renderCartContainer();
  }
}

function removeFromCart(btn) {
  const id = btn.dataset.plantId;
  const removingItemIndex = cartList.findIndex((eachPlant) => eachPlant.id == id);
  if (removingItemIndex !== -1) {
    cartList.splice(removingItemIndex, 1);
    renderCartContainer();
  }
}

// show description modal
function showDescriptionModal(id) {
  const expectedPlant = plants.find((eachPlant) => eachPlant.id == id);
  if (expectedPlant) {
    const { category, name, description, price, image } = expectedPlant;
    descriptionModalContentContainer.innerHTML = `
      <h3 class="text-2xl font-bold">${name}</h3>
      <div class="aspect-3/2 overflow-hidden rounded-lg">
        <img class="size-full object-cover object-center" src="${image}" alt="${name}"/>
      </div>
      <p><span class="font-bold">Category:</span> <span>${category}</span></p>
      <p><span class="font-bold">Price:</span> ৳${price}</p>
      <p><span class="font-bold">Description:</span> ${description}</p>
    `;
  }
}

//! listeners
document.addEventListener('click', (e) => {
  // navigation menu functionality
  const navOpenBtn = e.target.closest('[data-nav-open-btn]');
  if (navOpenBtn) {
    navMenu.classList.add('show');
    return;
  }
  const navCloseBtn = e.target.closest('[data-nav-close-btn]');
  if (navCloseBtn) {
    navMenu.classList.remove('show');
    return;
  }
  const navContainer = e.target.closest('[data-nav-container]');
  if (navContainer) return;
  const nav = e.target.closest('[data-nav]');
  if (nav) {
    navMenu.classList.remove('show');
    return;
  }

  // load plants by category
  const categoryBtn = e.target.closest('[data-category-btn]');
  if (categoryBtn) {
    document.querySelectorAll('[data-category-btn]').forEach((btn) => btn.classList.remove('active'));
    categoryBtn.classList.add('active');
    categoryModal.classList.remove('show');
    renderPlantsByCategory(categoryBtn.dataset.categoryId);
    return;
  }

  // add to cart
  const addToCartBtn = e.target.closest('[data-cart-btn]');
  if (addToCartBtn) {
    addToCart(addToCartBtn);
    return;
  }
  // remove from cart
  const removeFromCartBtn = e.target.closest('[data-cart-remove-btn]');
  if (removeFromCartBtn) {
    removeFromCart(removeFromCartBtn);
    return;
  }

  // category modal
  const categoryModalBtn = e.target.closest('[data-category-modal-btn]');
  if (categoryModalBtn) {
    categoryModal.classList.add('show');
    return;
  }
  const categoryModalContainer = e.target.closest('[data-category-modal-container]');
  if (categoryModalContainer) return;
  const categoryModalMain = e.target.closest('[data-category-modal]');
  if (categoryModalMain) {
    categoryModal.classList.remove('show');
    return;
  }
  // cart modal
  const cartModalBtn = e.target.closest('[data-cart-modal-btn]');
  if (cartModalBtn) {
    cartModal.classList.add('show');
    return;
  }
  const cartModalContainer = e.target.closest('[data-cart-modal-container]');
  if (cartModalContainer) return;
  const cartModalMain = e.target.closest('[data-cart-modal]');
  if (cartModalMain) {
    cartModal.classList.remove('show');
    return;
  }

  // description modal
  const descriptionToggler = e.target.closest('[data-description-trigger]');
  if (descriptionToggler) {
    descriptionModal.classList.add('show');
    showDescriptionModal(descriptionToggler.dataset.plantId);
    document.body.style.overflow = 'hidden';
    return;
  }
  const descriptionCloseBtn = e.target.closest('[data-description-modal-close-btn]');
  if (descriptionCloseBtn) {
    descriptionModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    return;
  }
  const descriptionModalContainer = e.target.closest('[data-description-modal-container]');
  if (descriptionModalContainer) return;
  const descriptionModalMain = e.target.closest('[data-description-modal]');
  if (descriptionModalMain) {
    document.body.style.overflow = 'auto';
    descriptionModal.classList.remove('show');
    return;
  }

  // reload page
  const reloadBtn = e.target.closest('[data-page-reload-button]');
  if (reloadBtn) window.location.reload();
});
