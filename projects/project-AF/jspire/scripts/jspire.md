# Jspire UI reference

- CSS classes used by the package:
  - `.searchbar` — required mount point for the generated search and filter controls.
  - `.search-row` — wrapper for the search input and filter button.
  - `.search` — search textbox.
  - `.filter` — filter button and filter modal apply button.
  - `.add-tile` — button that opens the add-tile dialog.
  - `.tile-view` — button that switches between tile and list layouts.
  - `.save-tile` — save button inside the add-tile dialog.
  - `.filter-modal` — filter dialog container.
  - `.filter-form` — contents of the filter dialog.
  - `.date-filter` — date label and interactive calendar input; hidden until Date is selected.
  - `.modal-actions` — Cancel and Apply button wrapper.
  - `.tile-group` — menu containing searchable tiles.
  - `.tile` — individual searchable tile.

- IDs generated or used by the package:
  - `#tile-search` — generated search input.
  - `#filter` — generated filter button.
  - `#tile-view` — generated tile/list view button; its `aria-pressed` state tracks list view.
  - `#filter-modal` — generated filter dialog.
  - `#filter-title` — filter dialog heading.
  - `#filter-field` — Name, Description, or Date selector.
  - `#filter-date` — generated interactive date calendar.
  - `#add-tile-modal` — generated add-tile dialog.
  - `#add-tile-title` — add-tile dialog heading.
  - `#add-tile-form` — add-tile form.
  - `#tile-image`, `#tile-name`, `#tile-age`, `#tile-date`, and `#tile-note` — add-tile form fields.
  - Tile IDs such as `#patient0` and `#patient1` come from the demo data and may be replaced.

- Add the searchbar with one element:
  - `<div class="searchbar"></div>`
  - Load `scripts/base.js` as a module after the element or at the end of the document.
  - The script generates the textbox, filter button, filter dialog, and date calendar inside the element.
  - The script also generates the Add tile and Tile view buttons inside the element.

- Add a tile group at the location where it should appear:
  - `<menu class="tile-group"></menu>`
  - The script uses an existing `.tile-group` and does not move it.
  - If no tile group exists, the demo script creates one after `.searchbar`.

- Add tiles inside the menu using a `section` with the `.tile` class:
  - `<section class="tile" data-name="John Doe" data-description="Routine cleaning" data-date="2026-09-06">`
  - Include the tile image and patient information inside the section.
  - Use `data-name`, `data-description`, and `data-date` so the corresponding filter options can search the tile.
  - Example structure:
    - `<menu class="tile-group">`
    - `<section class="tile" data-name="John Doe" data-description="Routine cleaning" data-date="2026-09-06">`
    - `<img src="patient.jpg" alt="John Doe">`
    - `<p>John Doe</p>`
    - `<p>Age: 32</p>`
    - `<p>2026-09-06</p>`
    - `<p>Notes: Routine cleaning</p>`
    - `</section>`
    - `</menu>`

- The searchbar only filters `.tile` and `[data-tile]` elements inside `.tile-group`.
- Clicking `#tile-view` adds or removes `.list-view` on each `.tile-group`.
