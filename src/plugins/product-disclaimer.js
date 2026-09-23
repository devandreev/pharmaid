// Класс на <html>, снимающий паузу с анимаций, которые ждут решения по дисклеймеру
const PASSED_CLASS = 'is-disclaimer-passed'

function markPassed() {
  document.documentElement.classList.add(PASSED_CLASS)
}

export default {
  init() {
    const popup = document.querySelector('#product-disclaimer')

    // Дисклеймера на странице нет или выбор уже сделан в этой сессии
    if (!popup || sessionStorage.getItem('product-disclaimer')) {
      markPassed()
      return
    }

    popup.show()

    // Событие приходит после того, как окно полностью исчезло
    popup.addEventListener('hide', markPassed, { once: true })

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
