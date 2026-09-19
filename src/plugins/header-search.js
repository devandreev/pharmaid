const STORAGE_KEY = 'search-history'
const HISTORY_LIMIT = 10
const SUGGESTIONS_LIMIT = 5
const SEARCH_URL = 'search.html'

// до десктопной раскладки поле занимает всю шапку, и там же работает экранная клавиатура
const COMPACT_QUERY = '(max-width: 1023px)'

export default {
  init() {
    this.header = document.querySelector('#header')
    this.button = this.header?.querySelector('.page-header__search')
    this.form = this.header?.querySelector('.page-header__search-form')

    if (!this.header || !this.button || !this.form) return

    this.input = this.form.querySelector('.page-header__search-input')
    this.list = this.form.querySelector('.page-header__search-suggestions')
    this.closeButton = this.header.querySelector('.page-header__search-close')

    this.compactMedia = window.matchMedia(COMPACT_QUERY)

    // на таче программное выделение части текста ломает предиктивный ввод
    this.isTouch = 'ontouchstart' in document.documentElement

    this.suggestions = []
    this.activeIndex = -1

    this.button.addEventListener('click', () => this.open())

    this.closeButton.addEventListener('click', () => this.close())

    this.input.addEventListener('input', (e) => this._onInput(e))
    this.input.addEventListener('keydown', (e) => this._onKeyDown(e))

    this.list.addEventListener('click', (e) => {
      const button = e.target.closest('.page-header__search-suggestion-button')
      if (!button) return

      this.input.value = button.dataset.value
      this.submit()
    })

    this.form.addEventListener('submit', (e) => {
      const value = this.input.value.trim()

      if (!value) {
        e.preventDefault()
        return
      }

      this._pushHistory(value)
    })

    document.addEventListener('click', (e) => {
      if (!this.opened) return
      if (this.form.contains(e.target)) return
      if (this.button.contains(e.target) || this.closeButton.contains(e.target)) return

      this.close()
    })

    document.addEventListener('scroll', () => {
      if (!this.opened) return
      // экранная клавиатура дёргает скролл — от этого поиск закрываться не должен
      if (this.compactMedia.matches) return
      if (!this.header.classList.contains('headroom--unpinned')) return

      this.close()
    }, { passive: true })
  },

  get opened() {
    return this.header.classList.contains('page-header--search-open')
  },

  open() {
    this.header.classList.add('page-header--search-open')
    this.input.focus()
  },

  close() {
    this.header.classList.remove('page-header--search-open')
    this.input.value = ''
    this._renderSuggestions([], '')
    this.input.blur()
  },

  submit() {
    const value = this.input.value.trim()
    if (!value) return

    this._pushHistory(value)
    window.location.href = `${SEARCH_URL}?query=${encodeURIComponent(value)}`
  },

  _onInput(e) {
    const typed = this.input.value
    const matches = this._findMatches(typed)

    this._renderSuggestions(matches, typed)

    // дописываем остаток только при наборе — на удалении текст не возвращаем
    const isInsert = e.inputType === 'insertText' || e.inputType === 'insertFromPaste'

    if (this.isTouch || !isInsert || !matches.length) return

    this._complete(matches[0], typed.length)
    this._setActive(0)
  },

  _onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      this.close()
      return
    }

    if (e.key === 'Enter') {
      return
    }

    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    if (!this.suggestions.length) return

    e.preventDefault()

    const last = this.suggestions.length - 1
    const step = e.key === 'ArrowDown' ? 1 : -1
    let index = this.activeIndex + step

    if (index > last) index = 0
    if (index < 0) index = last

    this._setActive(index)
    this._complete(this.suggestions[index], this.typedLength)
  },

  _complete(value, from) {
    this.input.value = value

    if (this.isTouch) return

    this.input.setSelectionRange(Math.min(from, value.length), value.length)
  },

  _setActive(index) {
    this.activeIndex = index

    this.list.querySelectorAll('.page-header__search-suggestion').forEach((item, i) => {
      item.classList.toggle('page-header__search-suggestion--active', i === index)
    })
  },

  _findMatches(typed) {
    const query = typed.trim().toLowerCase()
    if (!query) return []

    return this._readHistory()
      .filter((item) => {
        const value = item.toLowerCase()
        return value.startsWith(query) && value !== query
      })
      .slice(0, SUGGESTIONS_LIMIT)
  },

  _renderSuggestions(items, typed) {
    this.suggestions = items
    this.activeIndex = -1
    this.typedLength = typed.trim().length

    this.list.innerHTML = ''
    this.list.hidden = !items.length

    if (!items.length) return

    const fragment = document.createDocumentFragment()

    items.forEach((value) => {
      const item = document.createElement('li')
      item.className = 'page-header__search-suggestion'

      const button = document.createElement('button')
      button.className = 'page-header__search-suggestion-button'
      button.type = 'button'
      button.dataset.value = value

      const icon = document.createElement('span')
      icon.className = 'page-header__search-suggestion-icon'

      const text = document.createElement('span')
      text.className = 'page-header__search-suggestion-text'

      const match = document.createElement('span')
      match.className = 'page-header__search-suggestion-match'
      match.textContent = value.slice(0, this.typedLength)

      const rest = document.createElement('span')
      rest.className = 'page-header__search-suggestion-rest'
      rest.textContent = value.slice(this.typedLength)

      text.append(match, rest)
      button.append(icon, text)
      item.append(button)
      fragment.append(item)
    })

    this.list.append(fragment)
  },

  _readHistory() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (!Array.isArray(raw)) return []

      return raw.filter((item) => typeof item === 'string' && item)
    } catch (e) {
      return []
    }
  },

  _pushHistory(value) {
    const history = this._readHistory()
      .filter((item) => item.toLowerCase() !== value.toLowerCase())

    history.unshift(value)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)))
    } catch (e) {
      // приватный режим — история просто не сохранится
    }
  },
}
