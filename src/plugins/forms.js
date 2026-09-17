import IMask from 'imask'

export default {
  init() {
    this.initCareerForm()
    this.initPharmacovigilanceForm()
    this.initPhoneMask()
    this.initFileInput()
  },

  setError(inputEl, message, prefix) {
    const label = inputEl.closest(`.${prefix}__label`)
    if (!label) return

    label.classList.add(`${prefix}__label--error`)

    let errorSpan = label.querySelector(`.${prefix}__label-error`)
    if (!errorSpan) {
      errorSpan = document.createElement('span')
      errorSpan.className = `${prefix}__label-error`
      label.appendChild(errorSpan)
    }

    errorSpan.textContent = message
  },

  clearError(inputEl, prefix) {
    const label = inputEl.closest(`.${prefix}__label`)
    if (!label) return

    label.classList.remove(`${prefix}__label--error`)

    const errorSpan = label.querySelector(`.${prefix}__label-error`)
    if (errorSpan) {
      errorSpan.remove()
    }
  },

  initPhoneMask() {
    const inputs = document.querySelectorAll('.career-form__phone, .pharmacovigilance-form__phone')
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
    const fileInputs = document.querySelectorAll('.career-form__resume, .pharmacovigilance-form__file')
    if (!fileInputs.length) return

    fileInputs.forEach(input => {
      const isPV = input.classList.contains('pharmacovigilance-form__file')
      const prefix = isPV ? 'pharmacovigilance-form' : 'career-form'
      const placeholderSel = isPV ? '.js-pv-file-placeholder' : '.js-file-placeholder'
      const defaultText = isPV ? 'до 20 мб' : 'Word или PDF до 20 мб'

      input.addEventListener('change', () => {
        const label = input.closest(`.${prefix}__label`)
        if (!label) return

        const placeholder = label.querySelector(placeholderSel)
        if (!placeholder) return

        if (input.files && input.files.length > 0) {
          const file = input.files[0]
          placeholder.textContent = file.name
          placeholder.style.color = 'var(--color-blue)'
          this.clearError(input, prefix)
        } else {
          placeholder.textContent = defaultText
          placeholder.style.color = ''
        }
      })
    })
  },

  /* Карьера */

  initCareerForm() {
    const forms = document.querySelectorAll('.js-career-form')
    if (!forms.length) return

    forms.forEach(form => {
      const nameInput = form.querySelector('.career-form__name')
      const phoneInput = form.querySelector('.career-form__phone')
      const cityInput = form.querySelector('.career-form__city')
      const emailInput = form.querySelector('.career-form__email')

      if (nameInput) {
        nameInput.addEventListener('input', () => this.clearError(nameInput, 'career-form'))
      }

      if (phoneInput) {
        phoneInput.addEventListener('input', () => this.clearError(phoneInput, 'career-form'))
      }

      if (cityInput) {
        cityInput.addEventListener('input', () => this.clearError(cityInput, 'career-form'))
      }

      if (emailInput) {
        emailInput.addEventListener('input', () => this.clearError(emailInput, 'career-form'))
      }

      form.addEventListener('submit', e => this.onCareerFormSubmit(e, form))
    })
  },

  checkCareerFormValidation(form) {
    let isValid = true

    const nameInput = form.querySelector('.career-form__name')
    if (nameInput && !nameInput.value.trim()) {
      this.setError(nameInput, 'Пожалуйста, введите ваше имя', 'career-form')
      isValid = false
    }

    const phoneInput = form.querySelector('.career-form__phone')
    if (phoneInput) {
      const mask = phoneInput._mask
      if (!phoneInput.value.trim() || (mask && !mask.masked.isComplete)) {
        this.setError(phoneInput, 'Пожалуйста, введите номер телефона', 'career-form')
        isValid = false
      }
    }

    const cityInput = form.querySelector('.career-form__city')
    if (cityInput && !cityInput.value.trim()) {
      this.setError(cityInput, 'Пожалуйста, введите город', 'career-form')
      isValid = false
    }

    const emailInput = form.querySelector('.career-form__email')
    if (emailInput) {
      const emailValue = emailInput.value.trim()
      if (emailValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailValue)) {
          this.setError(emailInput, 'Неверный формат почты', 'career-form')
          isValid = false
        }
      }
    }

    const fileInput = form.querySelector('.career-form__resume')
    if (fileInput) {
      if (!fileInput.files || !fileInput.files.length) {
        this.setError(fileInput, 'Пожалуйста, прикрепите резюме', 'career-form')
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
          this.setError(fileInput, 'Допустимые форматы: Word или PDF', 'career-form')
          isValid = false
        } else if (file.size > maxSize) {
          this.setError(fileInput, 'Максимальный размер файла — 20 МБ', 'career-form')
          isValid = false
        }
      }
    }

    return isValid
  },

  openSuccessPopup() {
    const popup = document.querySelector('#success-popup')
    if (!popup) return

    popup.show()
  },

  onCareerFormSubmit(e, form) {
    e.preventDefault()
    e.stopImmediatePropagation()

    const isValid = this.checkCareerFormValidation(form)
    if (!isValid) return

    const phoneInput = form.querySelector('.career-form__phone')
    if (phoneInput && phoneInput._mask) {
      phoneInput.value = phoneInput._mask.unmaskedValue
    }

    this.openSuccessPopup()
  },

  /* Фармаконадзор */

  initPharmacovigilanceForm() {
    const forms = document.querySelectorAll('.js-pharmacovigilance-form')
    if (!forms.length) return

    const prefix = 'pharmacovigilance-form'

    forms.forEach(form => {
      const inputs = form.querySelectorAll(`.${prefix}__input, .${prefix}__select, .${prefix}__textarea`)
      inputs.forEach(input => {
        const event = input.tagName === 'SELECT' ? 'change' : 'input'
        input.addEventListener(event, () => this.clearError(input, prefix))
      })

      form.addEventListener('submit', e => this.onPharmacovigilanceFormSubmit(e, form))
    })
  },

  checkPharmacovigilanceFormValidation(form) {
    const prefix = 'pharmacovigilance-form'
    let isValid = true

    const typeSelect = form.querySelector(`.${prefix}__type`)
    if (typeSelect && !typeSelect.value) {
      this.setError(typeSelect, 'Пожалуйста, выберите тип заявителя', prefix)
      isValid = false
    }

    const nameInput = form.querySelector(`.${prefix}__name`)
    if (nameInput && !nameInput.value.trim()) {
      this.setError(nameInput, 'Пожалуйста, введите ФИО заявителя', prefix)
      isValid = false
    }

    const phoneInput = form.querySelector(`.${prefix}__phone`)
    if (phoneInput) {
      const mask = phoneInput._mask
      if (!phoneInput.value.trim() || (mask && !mask.masked.isComplete)) {
        this.setError(phoneInput, 'Пожалуйста, введите номер телефона', prefix)
        isValid = false
      }
    }

    const emailInput = form.querySelector(`.${prefix}__email`)
    if (emailInput) {
      const emailValue = emailInput.value.trim()
      if (!emailValue) {
        this.setError(emailInput, 'Пожалуйста, введите электронную почту', prefix)
        isValid = false
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailValue)) {
          this.setError(emailInput, 'Неверный формат почты', prefix)
          isValid = false
        }
      }
    }

    const patientName = form.querySelector(`.${prefix}__patient-name`)
    if (patientName && !patientName.value.trim()) {
      this.setError(patientName, 'Пожалуйста, введите ФИО пациента', prefix)
      isValid = false
    }

    const drug = form.querySelector(`.${prefix}__drug`)
    if (drug && !drug.value.trim()) {
      this.setError(drug, 'Пожалуйста, введите название препарата', prefix)
      isValid = false
    }

    const manufacturer = form.querySelector(`.${prefix}__manufacturer`)
    if (manufacturer && !manufacturer.value.trim()) {
      this.setError(manufacturer, 'Пожалуйста, введите производителя', prefix)
      isValid = false
    }

    const batch = form.querySelector(`.${prefix}__batch`)
    if (batch && !batch.value.trim()) {
      this.setError(batch, 'Пожалуйста, введите номер серии', prefix)
      isValid = false
    }

    const reaction = form.querySelector(`.${prefix}__reaction`)
    if (reaction && !reaction.value.trim()) {
      this.setError(reaction, 'Пожалуйста, опишите нежелательную реакцию', prefix)
      isValid = false
    }

    const fileInput = form.querySelector(`.${prefix}__file`)
    if (fileInput) {
      if (!fileInput.files || !fileInput.files.length) {
        this.setError(fileInput, 'Пожалуйста, прикрепите файл', prefix)
        isValid = false
      } else {
        const file = fileInput.files[0]
        const maxSize = 20 * 1024 * 1024

        if (file.size > maxSize) {
          this.setError(fileInput, 'Максимальный размер файла — 20 МБ', prefix)
          isValid = false
        }
      }
    }

    return isValid
  },

  onPharmacovigilanceFormSubmit(e, form) {
    e.preventDefault()
    e.stopImmediatePropagation()

    const prefix = 'pharmacovigilance-form'
    const isValid = this.checkPharmacovigilanceFormValidation(form)
    if (!isValid) return

    const phoneInput = form.querySelector(`.${prefix}__phone`)
    if (phoneInput && phoneInput._mask) {
      phoneInput.value = phoneInput._mask.unmaskedValue
    }

    this.openSuccessPopup()
  },
}
