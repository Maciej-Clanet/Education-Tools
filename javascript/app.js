import { filterCatalogItems, formatResultsCopy } from "./core/search.js";
import { readStorage, removeStorage, writeStorage } from "./core/storage.js";
import { catalogItems } from "./data/course-catalog.js";

const SEARCH_KEY = "home-search-query";

const searchInput = document.querySelector("#search-input");
const clearSearchButton = document.querySelector("#clear-search");
const resultsCopy = document.querySelector("#results-copy");
const catalogGrid = document.querySelector("#catalog-grid");
const cardTemplate = document.querySelector("#catalog-card-template");
const suggestionButtons = document.querySelectorAll("[data-suggestion]");

function createInfoPill(label) {
  const pill = document.createElement("span");
  pill.className = "info-pill";
  pill.textContent = label;
  return pill;
}

function createEmptyState(query) {
  const wrapper = document.createElement("article");
  wrapper.className = "empty-state";

  const heading = document.createElement("h3");
  heading.textContent = "No matches yet";

  const copy = document.createElement("p");
  copy.textContent = query
    ? "Try a broader topic, unit number, or qualification name."
    : "More lessons, units, and topic pages will appear here as the library grows.";

  wrapper.append(heading, copy);
  return wrapper;
}

function renderCatalogItems(items, query) {
  catalogGrid.replaceChildren();
  resultsCopy.textContent = formatResultsCopy(
    catalogItems.length,
    items.length,
    query,
  );

  if (items.length === 0) {
    catalogGrid.append(createEmptyState(query));
    return;
  }

  items.forEach((item) => {
    const fragment = cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".catalog-card");
    const typePill = fragment.querySelector(".type-pill");
    const infoRow = fragment.querySelector(".info-row");
    const actionButton = fragment.querySelector(".card-button");

    card.classList.add(`catalog-card--${item.type}`);
    typePill.classList.add(`type-pill--${item.type}`);
    typePill.textContent = item.typeLabel;

    fragment.querySelector(".catalog-card-kicker").textContent = item.kicker;
    fragment.querySelector(".catalog-card-title").textContent = item.title;
    fragment.querySelector(".catalog-card-summary").textContent = item.summary;
    actionButton.textContent = item.actionLabel;

    item.badges.forEach((badgeLabel) => {
      infoRow.append(createInfoPill(badgeLabel));
    });

    if (item.href) {
      actionButton.addEventListener("click", () => {
        window.location.href = item.href;
      });
    } else {
      actionButton.disabled = true;
    }

    catalogGrid.append(fragment);
  });
}

function applySearch(query) {
  const filteredItems = filterCatalogItems(catalogItems, query);
  renderCatalogItems(filteredItems, query);
  writeStorage(SEARCH_KEY, query);
}

function hydrateSearch() {
  const savedQuery = readStorage(SEARCH_KEY, "");
  searchInput.value = savedQuery;
  applySearch(savedQuery);
}

searchInput.addEventListener("input", (event) => {
  applySearch(event.currentTarget.value);
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  removeStorage(SEARCH_KEY);
  applySearch("");
  searchInput.focus();
});

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const suggestedQuery = button.dataset.suggestion ?? "";
    searchInput.value = suggestedQuery;
    applySearch(suggestedQuery);
  });
});

hydrateSearch();
