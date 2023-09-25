const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const pagination = document.getElementById("pagination");
const loadingSpinner = document.getElementById("loadingSpinner");

const API_URL = "https://makeup-api.herokuapp.com/api/v1/products.json";
const ITEMS_PER_PAGE = 4;

let currentPage = 1;
let filteredProducts = [];
let originalData = [];

async function fetchData() {
  try {
    loadingSpinner.style.display = "block";
    const response = await fetch(API_URL);
    const responseData = await response.json();

    if (Array.isArray(responseData)) {
      originalData = responseData; // Store the original data
      filteredProducts = originalData; // Initialize filteredProducts with the original data
      displayProducts(currentPage);
    } else {
      console.error("Invalid data format received from the API.");
    }
    loadingSpinner.style.display = "none";
  } catch (error) {
    console.error("Error fetching data:", error);
    loadingSpinner.style.display = "none";
  }
}
function shortenDescription(description) {
  const words = description.split(" ");
  if (words.length <= 30) {
    return description; // Return the original description if it has 30 words or fewer.
  } else {
    const shortenedWords = words.slice(0, 15);
    return shortenedWords.join(" ") + "..."; // Return the first 30 words followed by ellipsis.
  }
}
function displayProducts(page) {
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

  productList.innerHTML = "";

  displayedProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("col-md-3", "mb-3");
    const shortDescription = shortenDescription(product.description);
    productCard.innerHTML = `
      <div class="card">
        <img src="${product.image_link}" class="card-img-top" style="max-height:250px;" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.brand} - ${product.name}</h5>
          <p class="card-text"><strong>Price:</strong> $${product.price}</p>
          <p class="card-text"><strong>Description:</strong>  ${shortDescription}</p>
          <a href="${product.product_link}" class="btn btn-primary" target="_blank">Product Link</a>
        </div>
      </div>
    `;

    productList.appendChild(productCard);
  });

  updatePagination();
}

// ...

function updatePagination() {
  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  pagination.innerHTML = "";

  // Calculate the range of page numbers to display
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(pageCount, startPage + 4);

  // "Previous" button
  const prevPageItem = document.createElement("li");
  prevPageItem.classList.add("page-item");

  // Disable the "Previous" button if on the first page
  if (currentPage === 1) {
    prevPageItem.classList.add("disabled");
  }

  const prevPageLink = document.createElement("a");
  prevPageLink.classList.add("page-link");
  prevPageLink.textContent = "Previous";
  prevPageLink.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayProducts(currentPage);
    }
  });
  prevPageItem.appendChild(prevPageLink);
  pagination.appendChild(prevPageItem);

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    const pageLink = document.createElement("a");
    pageLink.classList.add("page-link");
    pageLink.textContent = i;
    pageLink.addEventListener("click", () => {
      currentPage = i;
      displayProducts(currentPage);
    });
    pageItem.appendChild(pageLink);
    pagination.appendChild(pageItem);
  }

  // "Next" button
  const nextPageItem = document.createElement("li");
  nextPageItem.classList.add("page-item");

  // Disable the "Next" button if on the last page
  if (currentPage === pageCount) {
    nextPageItem.classList.add("disabled");
  }

  const nextPageLink = document.createElement("a");
  nextPageLink.classList.add("page-link");
  nextPageLink.textContent = "Next";
  nextPageLink.addEventListener("click", () => {
    if (currentPage < pageCount) {
      currentPage++;
      displayProducts(currentPage);
    }
  });
  nextPageItem.appendChild(nextPageLink);
  pagination.appendChild(nextPageItem);
}

fetchData();

// Search functionality
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value ? searchInput.value.toLowerCase() : "";

    // Filter the products based on the search term using the originalData
    filteredProducts = originalData.filter((product) => {
      const brandLowerCase = product?.brand?.toLowerCase();
      const nameLowerCase = product?.name?.toLowerCase();
      console.log(brandLowerCase, nameLowerCase);
      return (
        brandLowerCase?.includes(searchTerm) ||
        nameLowerCase?.includes(searchTerm)
      );
    });
    console.log(originalData, filteredProducts);
    currentPage = 1;
    displayProducts(currentPage);
  }
});
