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
      </button>
    `
  }
}
