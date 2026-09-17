export default {
  init() {
    const popup = document.querySelector('#product-disclaimer')
    if (!popup) return

    if (sessionStorage.getItem('product-disclaimer')) return

    popup.show()

    popup.querySelector('.product-disclaimer__button--yes')
      ?.addEventListener('click', () => {
        sessionStorage.setItem('product-disclaimer', '1')
        popup.hide()
      })

    popup.querySelector('.product-disclaimer__button--no')
      ?.addEventListener('click', () => {
        window.location.href = '/'
      })
  }
}
