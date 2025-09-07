// variables
const navMenu = document.querySelector('[data-nav]');
const categoriesContainer = document.querySelector('[data-categories-container]');
const plantsContainer = document.querySelector('[data-plants-container]');

// svg's
const svg = {
  close: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>',
  closeLarge: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>',
};

// data fetching
let plants = [];
let categories = ['all'];

function renderCategories() {
  categoriesContainer.innerHTML = categories.map((eachCategory) => `<button data-category-btn="${eachCategory}" class="category-select-btn ${eachCategory == 'all' ? 'active' : ''}">${eachCategory}</button>`).join('');
}

function eachPlantCard(eachPlant) {
  const { id, category, name, description, price, image } = eachPlant;
  return `
    <div class="each-plant-card">
      <div class="each-plant-card-img-container">
        <img class="size-full object-cover object-center" src="${image}" alt="${name}" loading="lazy"/>
      </div>
      <div class="each-plant-card-text-container">
        <h5>${name}</h5>
        <p>${description}</p>
      </div>
      <div class="each-plant-card-category-container">
        <span>${category}</span>
        <span>৳${price}</span>
      </div>
      <button data-plant-id="${id}" data-cart-btn class="add-to-cart-btn">Add to Cart</button>
    </div>
  `;
}

function renderPlants(category = 'all') {
  plantsContainer.innerHTML =
    category === 'all'
      ? plants.map((eachPlant) => eachPlantCard(eachPlant)).join('')
      : plants
          .filter((eachPlant) => eachPlant.category == category)
          .map((eachPlant) => eachPlantCard(eachPlant))
          .join('');
}

function renderWithFetchedData(data) {
  plants = data.plants;

  plants.forEach((eachPlant) => {
    const category = eachPlant.category;
    if (!categories.includes(category)) {
      categories.push(category);
    }
  });

  renderCategories();
  renderPlants();
}

async function fetchPlantsData() {
  const url = 'https://openapi.programming-hero.com/api/plants';
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  renderWithFetchedData(data);
}

fetchPlantsData();

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

// listener
document.addEventListener('click', (e) => {
  // navigation menu functionality
  const navOpenBtn = e.target.closest('[data-nav-open-btn]');
  if (navOpenBtn) {
    navMenu.classList.remove('hide');
    return;
  }

  const navCloseBtn = e.target.closest('[data-nav-close-btn]');
  if (navCloseBtn) {
    navMenu.classList.add('hide');
    return;
  }

  const navContainer = e.target.closest('[data-nav-container]');
  if (navContainer) return;

  const nav = e.target.closest('[data-nav]');
  if (nav) {
    navMenu.classList.add('hide');
    return;
  }

  // load plants by category
  const categoryBtn = e.target.closest('[data-category-btn]');
  if (categoryBtn) {
    document.querySelectorAll('[data-category-btn]').forEach((btn) => btn.classList.remove('active'));
    categoryBtn.classList.add('active');
    renderPlants(categoryBtn.dataset.categoryBtn);
  }

  // add to cart
  const addToCartBtn = e.target.closest('[data-cart-btn]');
  if (addToCartBtn) {
    addToCart(addToCartBtn);
  }
  // remove from cart
  const removeFromCartBtn = e.target.closest('[data-cart-remove-btn]');
  if (removeFromCartBtn) {
    removeFromCart(removeFromCartBtn);
  }
});
