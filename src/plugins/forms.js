import IMask from 'imask'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Правила валидации.
   Возвращают null, если поле корректно, иначе ключ сообщения:
   ищется data-error-<ключ>, с откатом на data-error. */
const RULES = {
  required(input) {
    if (input.type === 'checkbox') {
      return input.checked ? null : 'error'
    }

    if (input.type === 'file') {
      return input.files && input.files.length ? null : 'error'
    }

    return input.value.trim() ? null : 'error'
  },

  email(input) {
    const value = input.value.trim()

    // Пустое поле — забота правила required, если оно указано
    if (!value) return null

    return EMAIL_RE.test(value) ? null : 'email'
  },

  phone(input) {
    const mask = input._mask

    if (!input.value.trim()) return null
    if (mask && !mask.masked.isComplete) return 'phone'

    return null
  },

  file(input) {
    if (!input.files || !input.files.length) return null

    const file = input.files[0]

    const accept = (input.accept || '')
      .split(',')
      .map(ext => ext.trim().toLowerCase())
      .filter(Boolean)

    if (accept.length) {
      const name = file.name.toLowerCase()
      const matched = accept.some(ext => name.endsWith(ext))

      if (!matched) return 'format'
    }

    const maxSize = parseFloat(input.dataset.maxSize)

    if (maxSize && file.size > maxSize * 1024 * 1024) return 'size'

    return null
  },
}

const CONTROL_SELECTOR = [
  '.form-field__input',
  '.form-field__select',
  '.form-field__textarea',
  '.form-field__file',
  '.form-agreement__input',
].join(', ')

export default {
  init() {
    document.querySelectorAll('.js-form').forEach(form => this.initForm(form))

    this.initPhoneMasks()
    this.initFileInputs()
    this.initPopupTriggers()
  },

  /* Вспомогательное */

  // Обёртка поля: либо .form-field, либо .form-agreement у чекбокса согласия
  getField(input) {
    return input.closest('.form-field, .form-agreement')
  },

  getErrorModifier(field) {
    return field.classList.contains('form-agreement')
      ? 'form-agreement--error'
      : 'form-field--error'
  },

  setError(input, message) {
    const field = this.getField(input)
    if (!field) return

    field.classList.add(this.getErrorModifier(field))

    let errorEl = field.querySelector('.form-field__error')

    if (!errorEl) {
      errorEl = document.createElement('span')
      errorEl.className = 'form-field__error'
      field.appendChild(errorEl)
    }

    errorEl.textContent = message
  },

  clearError(input) {
    const field = this.getField(input)
    if (!field) return

    field.classList.remove(this.getErrorModifier(field))

    const errorEl = field.querySelector('.form-field__error')
    if (errorEl) errorEl.remove()
  },

  /* Валидация */

  validateInput(input) {
    const rules = (input.dataset.rule || '').split(/\s+/).filter(Boolean)

    for (const name of rules) {
      const rule = RULES[name]
      if (!rule) continue

      const key = rule(input)
      if (!key) continue

      const message = key === 'error'
        ? input.dataset.error
        : input.dataset[`error${key[0].toUpperCase()}${key.slice(1)}`] || input.dataset.error

      this.setError(input, message || 'Проверьте это поле')

      return false
    }

    return true
  },

  validateForm(form) {
    let isValid = true

    form.querySelectorAll(CONTROL_SELECTOR).forEach(input => {
      if (!this.validateInput(input)) isValid = false
    })

    return isValid
  },

  /* Инициализация формы */

  initForm(form) {
    form.querySelectorAll(CONTROL_SELECTOR).forEach(input => {
      const event = input.tagName === 'SELECT' || input.type === 'checkbox' || input.type === 'file'
        ? 'change'
        : 'input'

      input.addEventListener(event, () => this.clearError(input))
    })

    form.addEventListener('submit', e => this.onSubmit(e, form))
  },

  onSubmit(e, form) {
    e.preventDefault()
    e.stopImmediatePropagation()

    if (!this.validateForm(form)) return

    // Телефон уезжает на бэкенд без форматирования
    form.querySelectorAll('input[type="tel"]').forEach(input => {
      if (input._mask) input.value = input._mask.unmaskedValue
    })

    this.openSuccessPopup(form)
  },

  /* Маска телефона */

  initPhoneMasks() {
    document.querySelectorAll('.js-form input[type="tel"]').forEach(input => {
      input._mask = IMask(input, {
        mask: '+{7} (000) 000-00-00',
        lazy: false,
      })
    })
  },

  /* Имя выбранного файла */

  initFileInputs() {
    document.querySelectorAll('.js-form .form-field__file').forEach(input => {
      const field = input.closest('.form-field')
      if (!field) return

      const placeholder = field.querySelector('.form-field__file-placeholder')
      if (!placeholder) return

      input.addEventListener('change', () => {
        const file = input.files && input.files[0]

        placeholder.textContent = file ? file.name : placeholder.dataset.placeholder
        placeholder.classList.toggle('form-field__file-placeholder--filled', !!file)
      })
    })
  },

  /* Всплывающие окна */

  initPopupTriggers() {
    document.addEventListener('click', e => {
      const trigger = e.target.closest('[data-popup]')
      if (!trigger) return

      const popup = document.querySelector(`#${trigger.dataset.popup}`)
      if (!popup) return

      e.preventDefault()

      // Кнопка может лежать внутри другого попапа (например, в мобильном меню):
      // закрываем его, иначе блокировка скролла насчитает два активных окна
      const parentPopup = trigger.closest('c-popup')
      if (parentPopup && parentPopup !== popup) parentPopup.hide()

      popup.show()
    })

    // Попап открывается чистым: сбрасываем форму при закрытии
    document.querySelectorAll('c-popup').forEach(popup => {
      const form = popup.querySelector('.js-form')
      if (!form) return

      popup.addEventListener('hide', () => this.resetForm(form))
    })
  },

  resetForm(form) {
    form.querySelectorAll(CONTROL_SELECTOR).forEach(input => this.clearError(input))

    form.reset()

    form.querySelectorAll('input[type="tel"]').forEach(input => {
      if (input._mask) input._mask.value = ''
    })

    form.querySelectorAll('.form-field__file-placeholder').forEach(placeholder => {
      placeholder.textContent = placeholder.dataset.placeholder
      placeholder.classList.remove('form-field__file-placeholder--filled')
    })
  },

  openSuccessPopup(form) {
    // Если форма лежит в попапе — закрываем его, чтобы не копить слои
    const parentPopup = form.closest('c-popup')
    if (parentPopup) parentPopup.hide()

    const popup = document.querySelector('#success-popup')
    if (!popup) return

    popup.show()
  },
}
