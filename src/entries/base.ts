import App from '@/app/App'
// @ts-ignore
import CBurgerButton from '@/components/c-burger-button/c-burger-button.js'
// @ts-ignore
import header from '@/plugins/header.js'
// @ts-ignore
import products from '@/plugins/products.js'
// @ts-ignore
import forms from '@/plugins/forms.js'

class MyApp extends App {
  initScrollBehavior(): void {
    const html = document.querySelector('html')

    if (!html) return

    setTimeout(() => {
      html.style.scrollBehavior = 'smooth'
    }, 500)
  }

  initCookieAgreement(): void {
    if (localStorage.getItem('cookie-agreement')) return

    const banner = document.querySelector('.cookie-agreement')
    const button = banner?.querySelector('.cookie-agreement__button')

    if (!banner || !button) return

    banner.classList.add('is-visible')

    button.addEventListener('click', () => {
      localStorage.setItem('cookie-agreement', '1')
      banner.classList.remove('is-visible')
    })
  }

  onload(): void {
    header.init()
    products.init()
    forms.init()

    this.initScrollBehavior()
    this.initCookieAgreement()
  }
}

const app = new MyApp({
  components: { CBurgerButton },
})
