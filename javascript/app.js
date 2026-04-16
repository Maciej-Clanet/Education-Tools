import { filterCatalogItems, formatResultsCopy } from "./core/search.js";
import { catalogItems } from "./data/course-catalog.js";

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
  resultsCopy.textContent = formatResultsCopy(catalogItems, items.length, query);

  if (items.length === 0) {
    catalogGrid.append(createEmptyState(query));
    return;
  }

  items.forEach((item) => {
    const fragment = cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".catalog-card");
    const typePill = fragment.querySelector(".type-pill");
    const titleElement = fragment.querySelector(".catalog-card-title");
    const infoRow = fragment.querySelector(".info-row");
    const actionRow = fragment.querySelector(".catalog-card-actions");

    card.classList.add(`catalog-card--${item.type}`);
    typePill.classList.add(`type-pill--${item.type}`);
    typePill.textContent = item.typeLabel;

    fragment.querySelector(".catalog-card-kicker").textContent = item.kicker;
    fragment.querySelector(".catalog-card-summary").textContent = item.summary;

    item.badges.forEach((badgeLabel) => {
      infoRow.append(createInfoPill(badgeLabel));
    });

    if (item.href) {
      const titleLink = document.createElement("a");
      titleLink.className = "catalog-card-title-link";
      titleLink.href = item.href;
      titleLink.textContent = item.title;
      titleElement.replaceChildren(titleLink);

      const actionLink = document.createElement("a");
      actionLink.className = "primary-link card-button";
      actionLink.href = item.href;
      actionLink.textContent = item.actionLabel;
      actionRow.append(actionLink);
    } else {
      titleElement.textContent = item.title;

      const statusLabel = document.createElement("span");
      statusLabel.className = "card-button card-button-muted";
      statusLabel.textContent = item.actionLabel;
      actionRow.append(statusLabel);
    }

    catalogGrid.append(fragment);
  });
}

function applySearch(query) {
  const filteredItems = filterCatalogItems(catalogItems, query);
  renderCatalogItems(filteredItems, query);
}

searchInput.addEventListener("input", (event) => {
  applySearch(event.currentTarget.value);
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
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

applySearch("");
