// Templates are inert in student content, navigation and read-aloud discovery.
export function initTeacherDividers(root = document) {
  let openerCreated = false
  // Build dividers first so an opener cannot interrupt a template/target pair.
  const templates = Array.from(root.querySelectorAll('template[data-teacher-divider], template[data-teacher-opener]'))
  templates.sort((a, b) => Number('teacherOpener' in a.dataset) - Number('teacherOpener' in b.dataset))
  templates.forEach(template => {
    const isOpener = 'teacherOpener' in template.dataset
    if (isOpener && openerCreated) return
    if (isOpener) openerCreated = true
    if (template.dataset.dividerReady) return
    const target = isOpener ? root.querySelector('[data-lesson-section]') : template.nextElementSibling
    if (!target?.matches('[data-lesson-section]')) return
    const section = document.createElement('section')
    section.className = `lesson-section panel teacher-section-divider${isOpener ? ' teacher-lesson-opener' : ''}`
    if (isOpener) section.dataset.teacherOpenerSlide = ''
    section.dataset.teacherOnly = ''
    section.dataset.studentTarget = target.id
    section.id = `${target.id}--${isOpener ? "opener" : "divider"}`
    section.hidden = true
    const eyebrow = document.createElement('p')
    eyebrow.className = 'eyebrow'
    eyebrow.textContent = isOpener ? 'Today' : 'Next'
    section.append(eyebrow, template.content.cloneNode(true))
    if (isOpener) {
      const first = root.querySelector('[data-teacher-only], [data-lesson-section]')
      first.before(section)
    } else template.after(section)
    template.dataset.dividerReady = 'true'
  })
}

export function studentSlideTarget(section, sections) {
  return sections.find(item => item.id === section?.dataset.studentTarget) ?? section
}
