const bookGrid = document.getElementById("book-grid");
const searchInput = document.getElementById("search-input");

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
  if (!searchInput) return BOOKS;

  const query = searchInput.value.trim().toLowerCase();
  if (!query) return BOOKS;

  return BOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
  );
}

function handleSearch() {
  renderBooks(getFilteredBooks());
}

if (!bookGrid || !searchInput) {
  console.warn("Missing required DOM elements: #book-grid or #search-input.");
} else {
  searchInput.addEventListener("input", handleSearch);
  renderBooks(BOOKS);
}