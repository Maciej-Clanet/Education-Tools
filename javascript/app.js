import { filterCourses, formatResultsCopy } from "./core/search.js";
import { readStorage, removeStorage, writeStorage } from "./core/storage.js";
import { courseCatalog } from "./data/course-catalog.js";

const SEARCH_KEY = "home-search-query";

const searchInput = document.querySelector("#search-input");
const clearSearchButton = document.querySelector("#clear-search");
const resultsCopy = document.querySelector("#results-copy");
const courseGrid = document.querySelector("#course-grid");
const cardTemplate = document.querySelector("#course-card-template");
const suggestionButtons = document.querySelectorAll("[data-suggestion]");

function createTopicBadge(label) {
  const badge = document.createElement("span");
  badge.className = "topic-badge";
  badge.textContent = label;
  return badge;
}

function createEmptyState(query) {
  const wrapper = document.createElement("article");
  wrapper.className = "empty-state";

  const heading = document.createElement("h3");
  heading.textContent = "No placeholder matches yet";

  const copy = document.createElement("p");
  copy.textContent = query
    ? `Try a broader search term, or add more unit ideas to the course data file when you're ready.`
    : "Add courses or topics to the local catalogue to fill out the home page.";

  wrapper.append(heading, copy);
  return wrapper;
}

function renderCourses(courses, query) {
  courseGrid.replaceChildren();
  resultsCopy.textContent = formatResultsCopy(
    courseCatalog.length,
    courses.length,
    query,
  );

  if (courses.length === 0) {
    courseGrid.append(createEmptyState(query));
    return;
  }

  courses.forEach((course) => {
    const fragment = cardTemplate.content.cloneNode(true);

    fragment.querySelector(".course-kicker").textContent = course.shortLabel;
    fragment.querySelector(".course-title").textContent = course.title;
    fragment.querySelector(".course-summary").textContent = course.summary;
    fragment.querySelector(".course-level").textContent = course.level;
    fragment.querySelector(".course-storage").textContent = course.storageMode;

    const unitList = fragment.querySelector(".unit-list");
    course.units.forEach((unit) => {
      const listItem = document.createElement("li");
      listItem.textContent = unit.title;
      unitList.append(listItem);
    });

    const topicList = fragment.querySelector(".topic-list");
    const uniqueTopics = [...new Set(course.units.flatMap((unit) => unit.topics))];
    uniqueTopics.forEach((topic) => {
      topicList.append(createTopicBadge(topic));
    });

    const specLink = fragment.querySelector(".spec-link");
    specLink.href = course.specUrl;

    courseGrid.append(fragment);
  });
}

function applySearch(query) {
  const filteredCourses = filterCourses(courseCatalog, query);
  renderCourses(filteredCourses, query);
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
