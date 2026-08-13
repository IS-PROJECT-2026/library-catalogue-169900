const bookGrid = document.getElementById("book-grid");
const searchInput = document.getElementById("search-input");
const categoryFilters = document.getElementById("category-filters");

const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const modalAvailability = document.getElementById("modal-availability");

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

function openModal(book) {
  if (
    !modalOverlay ||
    !modalTitle ||
    !modalAuthor ||
    !modalCategory ||
    !modalDescription ||
    !modalAvailability
  ) {
    return;
  }

  modalTitle.textContent = book.title;
  modalAuthor.textContent = book.author;
  modalCategory.textContent = book.category;
  modalDescription.textContent = book.description;
  modalAvailability.textContent = book.available ? "Available" : "Checked out";
  modalAvailability.className = `modal-availability ${book.available ? "status-available" : "status-unavailable"}`;

  modalOverlay.hidden = false;
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.hidden = true;
}

function handleCategoryClick(event) {
  const chip = event.target.closest(".filter-chip");
  if (!chip || !categoryFilters) return;

  activeCategory = chip.dataset.category || "all";

  categoryFilters
    .querySelectorAll(".filter-chip")
    .forEach((el) => el.classList.remove("active"));

  chip.classList.add("active");
  handleFilterChange();
}

function handleGridClick(event) {
  const card = event.target.closest(".book-card");
  if (!card) return;

  const book = BOOKS.find((b) => String(b.id) === card.dataset.id);
  if (book) openModal(book);
}

function init() {
  if (!bookGrid || !searchInput || !categoryFilters) {
    console.warn("Missing required DOM elements: #book-grid, #search-input, or #category-filters.");
    return;
  }

  searchInput.addEventListener("input", handleFilterChange);
  categoryFilters.addEventListener("click", handleCategoryClick);
  bookGrid.addEventListener("click", handleGridClick);

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  renderBooks(BOOKS);
}

init();