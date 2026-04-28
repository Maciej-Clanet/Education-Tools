import { readStorage, removeStorage, writeStorage } from "./storage.js"

export const LESSON_PROGRESS_STORAGE_KEY = "lesson-progress:v1"

export function getQuizId(lessonId, quizId) {
  return quizId ?? lessonId
}

export function readAllLessonProgress() {
  return readStorage(LESSON_PROGRESS_STORAGE_KEY, {})
}

export function readLessonQuizProgress(quizId) {
  const progress = readAllLessonProgress()

  return progress?.[quizId] ?? null
}

export function writeLessonQuizProgress(summary) {
  const quizId = summary?.quizId

  if (!quizId) {
    return
  }

  const progress = readAllLessonProgress()
  progress[quizId] = {
    ...summary,
    updatedAt: new Date().toISOString(),
  }

  writeStorage(LESSON_PROGRESS_STORAGE_KEY, progress)
}

export function removeLessonQuizProgress(quizId) {
  if (!quizId) {
    return
  }

  const progress = readAllLessonProgress()

  if (!Object.prototype.hasOwnProperty.call(progress, quizId)) {
    return
  }

  delete progress[quizId]

  if (Object.keys(progress).length === 0) {
    removeStorage(LESSON_PROGRESS_STORAGE_KEY)
    return
  }

  writeStorage(LESSON_PROGRESS_STORAGE_KEY, progress)
}
