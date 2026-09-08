// Templates are inert in student content, navigation and read-aloud discovery.
export function initTeacherDividers(root = document) {
  root.querySelectorAll('template[data-teacher-divider]').forEach(template => {
    if (template.dataset.dividerReady) return
    const target = template.nextElementSibling
    if (!target?.matches('[data-lesson-section]')) return
    const section = document.createElement('section')
    section.className = 'lesson-section panel teacher-section-divider'
    section.dataset.teacherOnly = ''
    section.dataset.studentTarget = target.id
    section.id = `${target.id}--divider`
    section.hidden = true
    const eyebrow = document.createElement('p')
    eyebrow.className = 'eyebrow'
    eyebrow.textContent = 'Next'
    section.append(eyebrow, template.content.cloneNode(true))
    template.after(section)
    template.dataset.dividerReady = 'true'
  })
}

export function studentSlideTarget(section, sections) {
  return sections.find(item => item.id === section?.dataset.studentTarget) ?? section
}
