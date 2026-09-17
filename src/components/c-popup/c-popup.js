import { html } from 'lit-html'
import { fadeIn, fadeOut } from '@/directives/fade'
import { toggleBodyLock } from '@/directives/body-lock'

import styles from './c-popup.css'
import CElement from '@/components/c-element/c-element'

const EVENTS = {
  SHOW: 'show',
  HIDE: 'hide',
}

export default class CPopup extends CElement {
  constructor() {
    super()

    if (!this.id) {
      console.error('CPopup: id attribute required', this)
    }

    this.$render()

    this.scrollWrapper = this.$find('.c-popup__wrapper')
    this.slotContent = this.children[0]

    if (!this.slotContent) return

    const cross = this.$find('.c-popup__cross')
    if (cross) {
      cross.addEventListener('click', () => this.hide())
    }

    this.root.addEventListener('click', (e) => {
      const container = this.$find('.c-popup__container')

      if (container && !container.contains(e.target)) {
        this.hide()
      }
    })

    this._onKeyDown = (e) => {
      if (e.key === 'Escape') {
        this.hide()
      }
    }

    document.addEventListener('keydown', this._onKeyDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    if (this._onKeyDown) {
      document.removeEventListener('keydown', this._onKeyDown)
    }
  }

  static get observedAttributes() {
    return ['opened']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._togglePopup(!!newValue)
  }

  _togglePopup(value) {
    const popup = this.$find('.c-popup')
    if (!popup) return

    const eventName = value ? EVENTS.SHOW : EVENTS.HIDE
    const params = { value }

    const callback = () => {
      const event = new CustomEvent(eventName, { detail: params })
      this.dispatchEvent(event)
    }

    toggleBodyLock(this.id, value)

    if (value) {
      fadeIn(popup, callback)
    } else {
      fadeOut(popup, callback)
    }
  }

  toggle(value) {
    if (typeof value === 'undefined') {
      this.opened = !this.opened
    } else {
      this.opened = value === true
    }
  }

  show() {
    this.toggle(true)
  }

  hide() {
    this.toggle(false)
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
      <div class="c-popup" style="display: none; opacity: 0;">
        <div class="c-popup__overlay"></div>
        <div class="c-popup__wrapper">
          <div class="c-popup__container">
            <button class="c-popup__cross"></button>
            <slot></slot>
          </div>
        </div>
      </div>
    `
  }
}
