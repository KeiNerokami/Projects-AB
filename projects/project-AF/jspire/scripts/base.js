const tileMap = {
    patient0: { name: "test", age: "Age: 32", date: "2026-09-06", description: "Notes: Routine cleaning", image: "#" },
    patient1: { name: "tset1", age: "Age: 45", date: "2026-09-07", description: "Notes: Cavity check", image: "#" }
};

function tileValue(tile, field) {
    return tile?.nodeType === 1
        ? tile.dataset[field] || tile.getAttribute(`data-${field}`) || tile.textContent
        : tile?.[field];
}

function searchTiles(tiles, query, field = "name") {
    const list = Array.isArray(tiles) ? tiles : Object.values(tiles || {});
    const value = String(query ?? "").trim().toLowerCase();
    if (!value) return list;

    return list
        .map(tile => {
            const name = String(tileValue(tile, field) ?? "").toLowerCase();
            const score = name === value ? 100 : name.startsWith(value) ? 80 : name.includes(value) ? 50 : 0;
            return { tile, score };
        })
        .filter(result => result.score)
        .sort((a, b) => b.score - a.score)
        .map(result => result.tile);
}

function createTile(data, id = `tile-${Date.now()}`) {
    const tile = document.createElement("section");
    tile.className = "tile";
    tile.id = id;
    tile.dataset.name = data.name;
    tile.dataset.description = data.description;
    tile.dataset.date = data.date || "";
    tile.innerHTML = `<img src="${data.image || "#"}" alt="img"><p></p><p></p><p></p><p></p>`;

    [data.name, data.age, data.date, data.description].forEach((value, index) => {
        tile.querySelectorAll("p")[index].textContent = value || "";
    });
    return tile;
}

function createTileGroup(container) {
    const group = document.querySelector("menu.tile-group") || document.createElement("menu");
    group.className = "tile-group";
    if (group.children.length) return group;

    Object.entries(tileMap).forEach(([id, data]) => group.append(createTile(data, id)));
    if (!group.parentElement) container.after(group);
    return group;
}

function createSearchbar(container) {
    container.innerHTML = `
        <label for="tile-search" hidden>Search</label>
        <div class="search-row">
            <input id="tile-search" name="name[search]" class="search" type="search" placeholder="Search tiles..." autocomplete="off">
            <button id="filter" class="filter" type="button" aria-controls="filter-modal" aria-haspopup="dialog">Filter</button>
            <button class="add-tile" type="button" aria-controls="add-tile-modal" aria-haspopup="dialog">Add tile</button>
            <button id="tile-view" class="tile-view" type="button" aria-label="Switch to list view" title="Tile view" aria-pressed="false">&#9776;</button>
        </div>
        <dialog id="filter-modal" class="filter-modal" aria-labelledby="filter-title">
            <form method="dialog" class="filter-form">
                <h2 id="filter-title">Filter search</h2>
                <label for="filter-field">Search field</label>
                <select id="filter-field"><option value="name">Name</option><option value="description">Description</option><option value="date">Date</option></select>
                <label class="date-filter" for="filter-date" hidden>Date</label>
                <input class="date-filter" id="filter-date" type="date" hidden>
                <div class="modal-actions"><button value="cancel">Cancel</button><button class="filter" value="default">Apply</button></div>
            </form>
        </dialog>
        <dialog id="add-tile-modal" class="add-tile-modal" aria-labelledby="add-tile-title">
            <form id="add-tile-form" class="add-tile-form">
                <h2 id="add-tile-title">Add tile</h2>
                <label for="tile-image">Image URL</label><input id="tile-image" name="image" type="url" placeholder="https://...">
                <label for="tile-name">Name</label><input id="tile-name" name="name" type="text" required>
                <label for="tile-age">Age</label><input id="tile-age" name="age" type="text" required>
                <label for="tile-date">Date</label><input id="tile-date" name="date" type="date" required>
                <label for="tile-note">Notes</label><textarea id="tile-note" name="description" rows="5" required></textarea>
                <div class="add-tile-actions"><button value="cancel" formmethod="dialog" formnovalidate>Cancel</button><button class="save-tile" value="save">Save</button></div>
            </form>
        </dialog>`;

    return {
        input: container.querySelector(".search"),
        button: container.querySelector("#filter"),
        modal: container.querySelector(".filter-modal"),
        field: container.querySelector("#filter-field"),
        date: container.querySelector("#filter-date"),
        dateLabel: container.querySelector('label[for="filter-date"]'),
        addButton: container.querySelector(".add-tile"),
        addModal: container.querySelector(".add-tile-modal"),
        addForm: container.querySelector("#add-tile-form"),
        viewButton: container.querySelector("#tile-view")
    };
}

function initTileSearch() {
    // Browser check
    if (typeof document === "undefined") return;

    // Setup searchbar
    const container = document.querySelector(".searchbar");
    if (!container) return;

    const controls = createSearchbar(container);
    const tileGroup = createTileGroup(container);
    const defaultOrder = new Map(
        [...document.querySelectorAll("menu.tile-group")].map(group => [group, [...group.children]])
    );
    let activeField = controls.field.value;

    // Update tiles
    const updateTiles = () => {
        const query = activeField === "date" && controls.date.value ? controls.date.value : controls.input.value;
        const hasQuery = Boolean(query.trim());

        document.querySelectorAll("menu.tile-group").forEach(group => {
            const tiles = [...group.children].filter(tile => tile.matches(".tile, [data-tile]"));
            const matches = searchTiles(tiles, query, activeField);
            const matched = new Set(matches);
            const order = hasQuery ? [...matches, ...tiles.filter(tile => !matched.has(tile))] : (defaultOrder.get(group) || tiles).filter(tile => tiles.includes(tile));
            group.append(...order);
            tiles.forEach(tile => { tile.hidden = hasQuery && !matched.has(tile); });
        });
    };

    // Search events
    controls.input.addEventListener("input", updateTiles);
    controls.date.addEventListener("input", updateTiles);
    controls.button.addEventListener("click", () => controls.modal.showModal?.());
    controls.viewButton.addEventListener("click", () => {
        const listView = controls.viewButton.getAttribute("aria-pressed") !== "true";
        document.querySelectorAll("menu.tile-group").forEach(group => group.classList.toggle("list-view", listView));
        controls.viewButton.setAttribute("aria-pressed", String(listView));
        controls.viewButton.setAttribute("aria-label", listView ? "Switch to tile view" : "Switch to list view");
        controls.viewButton.title = listView ? "List view" : "Tile view";
    });
    controls.field.addEventListener("change", () => {
        const showDate = controls.field.value === "date";
        controls.date.hidden = !showDate;
        controls.dateLabel.hidden = !showDate;
    });
    controls.modal.addEventListener("close", () => {
        if (controls.modal.returnValue === "default") {
            activeField = controls.field.value;
            updateTiles();
        }
    });

    [controls.modal, controls.addModal].forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) modal.close();
        });
    });

    // Add tile
    controls.addButton.addEventListener("click", () => controls.addModal.showModal?.());
    controls.addForm.addEventListener("submit", event => {
        if (event.submitter?.value !== "save") return;
        event.preventDefault();
        const tile = createTile(Object.fromEntries(new FormData(controls.addForm)));
        tileGroup.append(tile);
        defaultOrder.get(tileGroup).push(tile);
        controls.addForm.reset();
        controls.addModal.close();
    });
}

if (typeof document !== "undefined") {
    document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", initTileSearch, { once: true })
        : initTileSearch();
}

export { searchTiles, initTileSearch, createTileGroup, createTile, tileMap };
