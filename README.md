# City Library Catalogue

A client-side library catalogue for browsing, searching, and tracking books.
Users can search by title/author, filter by category, view full book details
in a modal, check availability, and build a personal reading list persisted
with `localStorage`.

**Live site:** https://IS-PROJECT-2026.github.io/library-catalogue-169900/

## Features

- **Catalogue browsing** — responsive grid of book cards
- **Live search** — filters by title or author as you type
- **Category filtering** — All, Fiction, Science, History, Technology
- **Book details modal** — description, author, category, availability
- **Availability toggle** — mark books as checked out / returned
- **Reading list** — add/remove books, persisted with `localStorage`
- **Accessibility improvements** — labeled search input, ARIA live updates, keyboard close (Esc), focus-visible styles
- **Responsive layout** — mobile to desktop

## Tech stack

- HTML5, CSS3
- Vanilla JavaScript (ES6+)
  - `js/data.js` for catalogue seed data
  - `js/app.js` for rendering, filtering, modal, availability, reading list
- Google Fonts: Playfair Display, Source Sans 3, IBM Plex Mono
- GitHub Pages deployment from `main`

## Running locally

No build step required.

### Windows (PowerShell / CMD)

```
py -m http.server 8000
```

### macOS / Linux

```
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

## Persistence

Reading list is saved in browser storage using key:

- `library-catalogue:reading-list`

## Project management

Development tracked using GitHub Milestones, Issues, and a Kanban project board.
See the repository **Issues** and **Projects** tabs for history.