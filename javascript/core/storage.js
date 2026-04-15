const APP_PREFIX = "education-tools";

function buildKey(key) {
  return `${APP_PREFIX}:${key}`;
}

export function readStorage(key, fallbackValue) {
  try {
    const storedValue = window.localStorage.getItem(buildKey(key));

    if (storedValue === null) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.warn(`Unable to read local storage key "${key}".`, error);
    return fallbackValue;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(buildKey(key), JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to write local storage key "${key}".`, error);
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(buildKey(key));
  } catch (error) {
    console.warn(`Unable to remove local storage key "${key}".`, error);
  }
}
