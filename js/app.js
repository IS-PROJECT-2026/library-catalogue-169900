// app.js — owns the DOM. Reads from BOOKS (data.js), renders + filters,
// handles the details modal, and the in-memory reading list.

const bookGrid = document.getElementById("book-grid");
const searchInput = document.getElementById("search-input");
const categoryFilters = document.getElementById("category-filters");
const readingListItems = document.getElementById("reading-list-items");
const readingListEmpty = document.getElementById("reading-list-empty");

const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const modalAvailability = document.getElementById("modal-availability");

let activeCategory = "all";
const READING_LIST_KEY = "library-catalogue:reading-list";

// ---------- Reading list persistence ----------

function loadReadingList() {
  try {
    const raw = localStorage.getItem(READING_LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (err) {
    console.error("Could not read reading list, resetting.", err);
    return [];
  }
}

function saveReadingList() {
  localStorage.setItem(READING_LIST_KEY, JSON.stringify(readingList));
}

let readingList = loadReadingList();

// ---------- Rendering ----------

function bookCardHTML(book) {
  const availability = book.available ? "Available" : "Checked out";
  const availabilityClass = book.available ? "status-available" : "status-unavailable";
  const bookId = String(book.id);
  const onList = readingList.includes(bookId);

  return `
    <article class="book-card" data-id="${bookId}">
      <div class="book-spine"></div>
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">${book.author}</p>
      <p class="book-category">${book.category}</p>
      <p class="book-availability ${availabilityClass}">${availability}</p>

      <button type="button" class="reading-list-btn" data-add="${bookId}">
        ${onList ? "✓ On your list" : "+ Add to reading list"}
      </button>

      <button type="button" class="availability-btn" data-toggle="${bookId}">
        ${book.available ? "Mark as checked out" : "Mark as returned"}
      </button>
    </article>
  `;
}

function renderBooks(books) {
  if (!bookGrid) return;

  bookGrid.innerHTML = books.length
    ? books.map(bookCardHTML).join("")
    : `<p class="empty-state">No books match your search.</p>`;
}

function renderReadingList() {
  if (!readingListItems) return;

  if (!readingList.length) {
    readingListItems.innerHTML = "";
    if (readingListEmpty) readingListEmpty.hidden = false;
    return;
  }

  if (readingListEmpty) readingListEmpty.hidden = true;
  readingListItems.innerHTML = readingList
    .map((id) => {
      const book = BOOKS.find((b) => String(b.id) === id);
      if (!book) return "";
      return `
        <li class="reading-list-item">
          <span>${book.title} — ${book.author}</span>
          <button type="button" data-remove="${id}">Remove</button>
        </li>
      `;
    })
    .join("");
}

// ---------- Filtering ----------

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
  if (!chip || !categoryFilters) return;

  activeCategory = chip.dataset.category || "all";

  categoryFilters.querySelectorAll(".filter-chip").forEach((el) => {
    el.classList.remove("active");
  });
  chip.classList.add("active");

  handleFilterChange();
}

// ---------- Modal ----------

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
  modalAvailability.className = `modal-availability ${
    book.available ? "status-available" : "status-unavailable"
  }`;

  modalOverlay.hidden = false;
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.hidden = true;
}

// ---------- Actions ----------

function toggleAvailability(bookId) {
  const targetId = String(bookId);
  const book = BOOKS.find((b) => String(b.id) === targetId);
  if (!book) return;

  book.available = !book.available;
  renderBooks(getFilteredBooks());

  if (modalOverlay && !modalOverlay.hidden && modalTitle && modalTitle.textContent === book.title) {
    openModal(book);
  }
}

function toggleReadingList(bookId) {
  const normalizedId = String(bookId);
  const index = readingList.indexOf(normalizedId);

  if (index === -1) {
    readingList.push(normalizedId);
  } else {
    readingList.splice(index, 1);
  }

  saveReadingList();
  renderReadingList();
  renderBooks(getFilteredBooks());
}

// ---------- Events ----------

function handleGridClick(event) {
  const toggleBtn = event.target.closest("[data-toggle]");
  if (toggleBtn) {
    toggleAvailability(toggleBtn.dataset.toggle);
    return;
  }

  const addBtn = event.target.closest("[data-add]");
  if (addBtn) {
    toggleReadingList(addBtn.dataset.add);
    return;
  }

  const card = event.target.closest(".book-card");
  if (!card) return;

  const book = BOOKS.find((b) => String(b.id) === card.dataset.id);
  if (book) openModal(book);
}

// ---------- Init ----------

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

  if (readingListItems) {
    readingListItems.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-remove]");
      if (removeBtn) toggleReadingList(removeBtn.dataset.remove);
    });
  }

  renderBooks(BOOKS);
  renderReadingList();
}

init();