import { readStorage } from "./storage.js"

const keyFor = (id) => `code-playground-challenge-v1:${id}`

export function readChallenge(id) {
  const saved = readStorage(keyFor(id), null)
  return saved?.schemaVersion === 1 && saved.snapshot && Array.isArray(saved.snapshot.sources)
    ? saved : null
}

export function saveChallenge(id, snapshot) {
  try {
    window.localStorage.setItem(`education-tools:${keyFor(id)}`, JSON.stringify({
      schemaVersion: 1, updatedAt: new Date().toISOString(), snapshot
    }))
    return true
  } catch {
    return false
  }
}
