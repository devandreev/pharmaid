import { html } from 'lit-html'
import { fadeIn } from '@/directives/fade'
import debounce from '@/utils/debounce.js'
import styles from './c-burger-button.css'

import CElement from '@/components/c-element/c-element'

export default class CBurgerButton extends CElement {
  constructor() {
    super()

    this.$render()
  }

  static get observedAttributes() {
    return ['opened']
  } 

  attributeChangedCallback(name, oldValue, newValue) {
    this._toggleClass(!!newValue)
  }

  connectedCallback() {
    const button = this.$find('.c-burger-button')

    button.addEventListener('click', debounce(() => {
      this.opened = !this.opened
    }))
  }

  toggle(value) {
    if (typeof value === 'undefined') {
      this.opened = !this.opened
    } else {
      this.opened = value === true
    }
  }

  _toggleClass(value) {
    const button = this.$find('.c-burger-button')
    button.classList.toggle('c-burger-button--active', value === true)
  }

  get opened() {
    return this.$get('opened', true)
  }

  set opened(value = false) {
    this.$set('opened', value, true)
  }

  get styles() {
    return styles
  }

  get template() {
    return html`
      <button class="c-burger-button">
        <svg 
          class="c-burger-button__burger" 
          height="24" 
          width="24" 
          viewBox="0 0 24 24"
          fill="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line class="c-burger-button__line" x1="0" y1="8" x2="24" y2="8" />
          <line class="c-burger-button__line" x1="0" y1="16" x2="24" y2="16" />
        </svg>

        <svg
          class="c-burger-button__close"
          height="20"
          width="20"
          viewBox="0 0 20 20"
          fill="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="c-burger-button__close-path"
            d="M12.0833 7.91667L7.91665 12.0833M7.91663 7.91665L12.0833 12.0833"
          />
          <path
            class="c-burger-button__close-path"
            d="M5.83333 2.78152C7.05906 2.07248 8.48214 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 8.48214 2.07248 7.05906 2.78152 5.83333"
          />
        </svg>
      </button>
    `
  }
}
