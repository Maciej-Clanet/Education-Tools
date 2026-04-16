function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

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

export function filterCatalogItems(items, query) {
  const normalizedQuery = normalizeText(query);
  const filteredItems = normalizedQuery
    ? items.filter((item) => buildCatalogIndex(item).includes(normalizedQuery))
    : items;

  return [...filteredItems].sort(
    (left, right) =>
      (TYPE_PRIORITY[left.type] ?? Number.MAX_SAFE_INTEGER) -
      (TYPE_PRIORITY[right.type] ?? Number.MAX_SAFE_INTEGER),
  );
}

export function formatResultsCopy(totalItems, visibleItems, query) {
  if (!query.trim()) {
    return `Showing all ${totalItems} pages.`;
  }

  if (visibleItems === 0) {
    return `No pages matched "${query.trim()}".`;
  }

  if (visibleItems === 1) {
    return `1 page matched "${query.trim()}".`;
  }

  return `${visibleItems} pages matched "${query.trim()}".`;
}
