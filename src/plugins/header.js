import Headroom from 'headroom.js'

export default {
  init() {
    this.initHeadroom()
    this.initBurgerMenu()
  },

  initHeadroom() {
    const header = document.querySelector('#header')
    const options = {
      offset: 10
    }

    this.headroom = new Headroom(header, options)
    this.headroom.init()

    requestAnimationFrame(() => {
      header.classList.remove('headroom--faded')
    })
  },

  initBurgerMenu() {
    const menu = document.querySelector('#mobile-menu'),
        burger = document.querySelector('#burger-button'),
        header = document.querySelector('#header')

    burger.addEventListener('click', () => {
      // menu.toggle(burger.opened)

      header.classList.toggle('page-header--fixed', burger.opened)
    })

    menu.addEventListener('hide', () => {
      burger.toggle(false)

      header.classList.toggle('page-header--fixed', false)
    })
  },
}
