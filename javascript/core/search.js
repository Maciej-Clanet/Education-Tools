function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const STATUS_PRIORITY = {
  live: 0,
  planned: 1,
};

const TYPE_PRIORITY = {
  unit: 0,
  topic: 1,
  spec: 2,
};

function buildCatalogIndex(item) {
  const parts = [
    item.type,
    item.typeLabel,
    item.kicker,
    item.title,
    item.summary,
    ...item.badges,
    ...item.keywords,
  ];

  return normalizeText(parts.join(" "));
}

function isLiveItem(item) {
  return item.status === "live";
}

function sortCatalogItems(items) {
  return [...items].sort((left, right) => {
    const statusDifference =
      (STATUS_PRIORITY[left.status] ?? Number.MAX_SAFE_INTEGER) -
      (STATUS_PRIORITY[right.status] ?? Number.MAX_SAFE_INTEGER);

    if (statusDifference !== 0) {
      return statusDifference;
    }

    const typeDifference =
      (TYPE_PRIORITY[left.type] ?? Number.MAX_SAFE_INTEGER) -
      (TYPE_PRIORITY[right.type] ?? Number.MAX_SAFE_INTEGER);

    if (typeDifference !== 0) {
      return typeDifference;
    }

    return left.title.localeCompare(right.title);
  });
}

export function filterCatalogItems(items, query) {
  const normalizedQuery = normalizeText(query);
  const filteredItems = normalizedQuery
    ? items.filter((item) => buildCatalogIndex(item).includes(normalizedQuery))
    : items.filter(isLiveItem);

  return sortCatalogItems(filteredItems);
}

export function formatResultsCopy(items, visibleItems, query) {
  const liveItemCount = items.filter(isLiveItem).length;

  if (!query.trim()) {
    return `Showing ${liveItemCount} live page${liveItemCount === 1 ? "" : "s"}.`;
  }

  if (visibleItems === 0) {
    return `No results for "${query.trim()}".`;
  }

  if (visibleItems === 1) {
    return `1 result for "${query.trim()}".`;
  }

  return `${visibleItems} results for "${query.trim()}".`;
}
