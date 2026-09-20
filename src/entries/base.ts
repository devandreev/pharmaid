import App from '@/app/App'
// @ts-ignore
import CBurgerButton from '@/components/c-burger-button/c-burger-button.js'
// @ts-ignore
import CPopup from '@/components/c-popup/c-popup.js'
// @ts-ignore
import header from '@/plugins/header.js'
// @ts-ignore
import headerSearch from '@/plugins/header-search.js'
// @ts-ignore
import products from '@/plugins/products.js'
// @ts-ignore
import forms from '@/plugins/forms.js'
// @ts-ignore
import productDisclaimer from '@/plugins/product-disclaimer.js'
// @ts-ignore
import contactsMaps from '@/plugins/contacts-maps.js'
// @ts-ignore
import heroVideo from '@/plugins/hero-video.js'
// @ts-ignore
import select from '@/plugins/select.js'
// @ts-ignore
import otherNews from '@/plugins/other-news.js'

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
    headerSearch.init()
    heroVideo.init()
    products.init()
    forms.init()
    productDisclaimer.init()
    contactsMaps.init()
    select.init()
    otherNews.init()

    this.initScrollBehavior()
    this.initCookieAgreement()
  }

  onresize(): void {
    select.onResize()
  }
}

const app = new MyApp({
  components: { CBurgerButton, CPopup },
})
