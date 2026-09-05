import App from '@/app/App'
// @ts-ignore
import CBurgerButton from '@/components/c-burger-button/c-burger-button.js'
// @ts-ignore
import header from '@/plugins/header.js'
// @ts-ignore
import products from '@/plugins/products.js'

class MyApp extends App {
  initScrollBehavior(): void {
    const html = document.querySelector('html')

    if (!html) return

    setTimeout(() => {
      html.style.scrollBehavior = 'smooth'
    }, 500)
  }

  onload(): void {
    header.init()
    products.init()
    this.initScrollBehavior()
  }
}

const app = new MyApp({
  components: { CBurgerButton },
})
