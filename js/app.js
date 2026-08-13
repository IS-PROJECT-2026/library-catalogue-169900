const bookGrid = document.getElementById("book-grid");
const searchInput = document.getElementById("search-input");
const categoryFilters = document.getElementById("category-filters");

let activeCategory = "all";

function bookCardHTML(book) {
  const availability = book.available ? "Available" : "Checked out";
  const availabilityClass = book.available ? "status-available" : "status-unavailable";

  return `
    <article class="book-card" data-id="${book.id}">
      <div class="book-spine"></div>
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">${book.author}</p>
      <p class="book-category">${book.category}</p>
      <p class="book-availability ${availabilityClass}">${availability}</p>
    </article>
  `;
}

function renderBooks(books) {
  if (!bookGrid) return;

  bookGrid.innerHTML = books.length
    ? books.map(bookCardHTML).join("")
    : `<p class="empty-state">No books match your search.</p>`;
}

function getFilteredBooks() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  return BOOKS.filter((book) => {
    const matchesQuery =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);
    const matchesCategory = activeCategory === "all" || book.category === activeCategory;
    return matchesQuery && matchesCategory;
  });
}

function handleFilterChange() {
  renderBooks(getFilteredBooks());
}

function handleCategoryClick(event) {
  const chip = event.target.closest(".filter-chip");
  if (!chip) return;

  activeCategory = chip.dataset.category;

  categoryFilters
    .querySelectorAll(".filter-chip")
    .forEach((el) => el.classList.remove("active"));
  chip.classList.add("active");

  handleFilterChange();
}

if (!bookGrid || !searchInput || !categoryFilters) {
  console.warn("Missing required DOM elements: #book-grid, #search-input, or #category-filters.");
} else {
  searchInput.addEventListener("input", handleFilterChange);
  categoryFilters.addEventListener("click", handleCategoryClick);
  renderBooks(BOOKS);
}