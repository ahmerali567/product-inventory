// ✅ Base Class: Product
class Product {
  constructor(name, price, category) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.id = Date.now() + Math.random(); // unique ID
  }
  getDetails() {
    return `Product: ${this.name}, Category: ${this.category}, Price: $${this.price}`;
  }
}

// ✅ Subclasses
class ElectronicProduct extends Product {
  constructor(name, price, warranty) {
    super(name, price, "Electronics");
    this.warranty = warranty;
  }
  getDetails() {
    return `${super.getDetails()}, Warranty: ${this.warranty}`;
  }
}

class GroceryProduct extends Product {
  constructor(name, price, expiryDate) {
    super(name, price, "Grocery");
    this.expiryDate = expiryDate;
  }
  getDetails() {
    return `${super.getDetails()}, Expiry Date: ${this.expiryDate}`;
  }
}

// ========================
// Elements
// ========================
const form = document.getElementById('productForm');
const productList = document.getElementById('productList');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const selectiveModeBtn = document.getElementById('selectiveModeBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

let products = [];
let selectiveMode = false;

// ========================
// Add Product
// ========================
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const category = document.getElementById('category').value;
  const extra = document.getElementById('extraField').value.trim();

  let product;

  if (category === "Electronics") {
    product = new ElectronicProduct(name, price, extra || "No warranty");
  } else if (category === "Grocery") {
    product = new GroceryProduct(name, price, extra || "N/A");
  } else {
    product = new Product(name, price, category);
  }

  products.push(product);
  renderProducts();
  form.reset();
});

// ========================
// Delete All
// ========================
deleteAllBtn.addEventListener('click', () => {
  products = [];
  renderProducts();
});

// ========================
// Toggle Selective Mode
// ========================
selectiveModeBtn.addEventListener('click', () => {
  selectiveMode = !selectiveMode;
  deleteSelectedBtn.classList.toggle('hidden', !selectiveMode);
  renderProducts();
});

// ========================
// Delete Selected
// ========================
deleteSelectedBtn.addEventListener('click', () => {
  const selectedIds = [...document.querySelectorAll('.select-checkbox:checked')].map(cb => cb.dataset.id);
  products = products.filter(p => !selectedIds.includes(String(p.id)));
  renderProducts();
});

// ========================
// UI Rendering
// ========================
function renderProducts() {
  productList.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = "product-card bg-white rounded-2xl p-5 shadow-lg relative";

    card.innerHTML = `
      ${selectiveMode ? `<input type="checkbox" data-id="${product.id}" class="select-checkbox absolute top-3 left-3 w-5 h-5">` : ""}
      <button class="delete-btn absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center" data-id="${product.id}">
        ✕
      </button>
      <h3 class="text-xl font-bold text-indigo-700 mb-2">${product.name}</h3>
      <p class="text-gray-700 mb-1"><strong>Category:</strong> ${product.category}</p>
      <p class="text-gray-700 mb-1"><strong>Price:</strong> $${product.price}</p>
      ${product instanceof ElectronicProduct ? `<p class="text-gray-700"><strong>Warranty:</strong> ${product.warranty}</p>` : ""}
      ${product instanceof GroceryProduct ? `<p class="text-gray-700"><strong>Expiry:</strong> ${product.expiryDate}</p>` : ""}
    `;

    productList.appendChild(card);
  });

  // attach individual delete events
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteProduct(id);
    });
  });
}

function deleteProduct(id) {
  products = products.filter(p => p.id != id);
  renderProducts();
}
