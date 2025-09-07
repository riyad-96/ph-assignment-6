// variables
const navMenu = document.querySelector('[data-nav]');
const categoriesContainer = document.querySelector('[data-categories-container]');
const plantsContainer = document.querySelector('[data-plants-container]');

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
      <button data-plant-id="${id}" class="add-to-cart-btn">Add to Cart</button>
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
});
