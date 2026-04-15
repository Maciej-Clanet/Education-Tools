function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function buildCourseIndex(course) {
  const parts = [
    course.title,
    course.shortLabel,
    course.level,
    course.summary,
    ...course.tags,
    ...course.units.map((unit) => unit.title),
    ...course.units.flatMap((unit) => unit.topics),
  ];

  return normalizeText(parts.join(" "));
}

export function filterCourses(courses, query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return courses;
  }

  return courses.filter((course) =>
    buildCourseIndex(course).includes(normalizedQuery),
  );
}

export function formatResultsCopy(totalCourses, visibleCourses, query) {
  if (!query.trim()) {
    return `Showing all ${totalCourses} placeholder course specs.`;
  }

  if (visibleCourses === 0) {
    return `No placeholder courses matched "${query.trim()}".`;
  }

  if (visibleCourses === 1) {
    return `1 placeholder course matched "${query.trim()}".`;
  }

  return `${visibleCourses} placeholder courses matched "${query.trim()}".`;
}
