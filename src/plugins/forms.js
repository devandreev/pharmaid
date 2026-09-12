import IMask from 'imask'

export default {
  init() {
    this.initForm()
    this.initPhoneMask()
    this.initFileInput()
  },

  setError(inputEl, message) {
    const label = inputEl.closest('.career-form__label')
    if (!label) return

    label.classList.add('career-form__label--error')

    let errorSpan = label.querySelector('.career-form__label-error')
    if (!errorSpan) {
      errorSpan = document.createElement('span')
      errorSpan.className = 'career-form__label-error'
      label.appendChild(errorSpan)
    }

    errorSpan.textContent = message
  },

  clearError(inputEl) {
    const label = inputEl.closest('.career-form__label')
    if (!label) return

    label.classList.remove('career-form__label--error')

    const errorSpan = label.querySelector('.career-form__label-error')
    if (errorSpan) {
      errorSpan.remove()
    }
  },

  initPhoneMask() {
    const inputs = document.querySelectorAll('.career-form__phone')
    if (!inputs.length) return

    inputs.forEach(input => {
      const mask = IMask(input, {
        mask: '+{7} (000) 000-00-00',
        lazy: false,
      })

      input._mask = mask
    })
  },

  initFileInput() {
    const fileInputs = document.querySelectorAll('.career-form__resume')
    if (!fileInputs.length) return

    fileInputs.forEach(input => {
      input.addEventListener('change', () => {
        const label = input.closest('.career-form__label')
        if (!label) return

        const placeholder = label.querySelector('.js-file-placeholder')
        if (!placeholder) return

        if (input.files && input.files.length > 0) {
          const file = input.files[0]
          placeholder.textContent = file.name
          placeholder.style.color = 'var(--color-blue)'
          this.clearError(input)
        } else {
          placeholder.textContent = 'Word или PDF до 20 мб'
          placeholder.style.color = ''
        }
      })
    })
  },

  initForm() {
    const forms = document.querySelectorAll('.js-career-form')
    if (!forms.length) return

    forms.forEach(form => {
      const nameInput = form.querySelector('.career-form__name')
      const phoneInput = form.querySelector('.career-form__phone')
      const cityInput = form.querySelector('.career-form__city')
      const emailInput = form.querySelector('.career-form__email')

      if (nameInput) {
        nameInput.addEventListener('input', () => this.clearError(nameInput))
      }

      if (phoneInput) {
        phoneInput.addEventListener('input', () => this.clearError(phoneInput))
      }

      if (cityInput) {
        cityInput.addEventListener('input', () => this.clearError(cityInput))
      }

      if (emailInput) {
        emailInput.addEventListener('input', () => this.clearError(emailInput))
      }

      form.addEventListener('submit', e => this.onFormSubmit(e, form))
    })
  },

  checkFormValidation(form) {
    let isValid = true

    const nameInput = form.querySelector('.career-form__name')
    if (nameInput && !nameInput.value.trim()) {
      this.setError(nameInput, 'Пожалуйста, введите ваше имя')
      isValid = false
    }

    const phoneInput = form.querySelector('.career-form__phone')
    if (phoneInput) {
      const mask = phoneInput._mask
      if (!phoneInput.value.trim() || (mask && !mask.masked.isComplete)) {
        this.setError(phoneInput, 'Пожалуйста, введите номер телефона')
        isValid = false
      }
    }

    const cityInput = form.querySelector('.career-form__city')
    if (cityInput && !cityInput.value.trim()) {
      this.setError(cityInput, 'Пожалуйста, введите город')
      isValid = false
    }

    const emailInput = form.querySelector('.career-form__email')
    if (emailInput) {
      const emailValue = emailInput.value.trim()
      if (emailValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailValue)) {
          this.setError(emailInput, 'Неверный формат почты')
          isValid = false
        }
      }
    }

    const fileInput = form.querySelector('.career-form__resume')
    if (fileInput) {
      if (!fileInput.files || !fileInput.files.length) {
        this.setError(fileInput, 'Пожалуйста, прикрепите резюме')
        isValid = false
      } else {
        const file = fileInput.files[0]
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        const maxSize = 20 * 1024 * 1024

        if (!allowedTypes.includes(file.type)) {
          this.setError(fileInput, 'Допустимые форматы: Word или PDF')
          isValid = false
        } else if (file.size > maxSize) {
          this.setError(fileInput, 'Максимальный размер файла — 20 МБ')
          isValid = false
        }
      }
    }

    return isValid
  },

  onFormSubmit(e, form) {
    e.preventDefault()
    e.stopImmediatePropagation()

    const isValid = this.checkFormValidation(form)
    if (!isValid) return

    const phoneInput = form.querySelector('.career-form__phone')
    if (phoneInput && phoneInput._mask) {
      phoneInput.value = phoneInput._mask.unmaskedValue
    }

    form.classList.add('career-form__form--success')
    form.innerHTML = '<p class="career-form__success">Спасибо! Ваше резюме отправлено. Мы свяжемся с вами при появлении подходящей вакансии.</p>'
  },
}
