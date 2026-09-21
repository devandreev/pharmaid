import Swiper from 'swiper'
import 'swiper/css'

export default {
  init() {
    const block = document.querySelector('.other-news')

    if (!block) return

    const container = block.querySelector('.other-news__swiper')
    const prevButton = block.querySelector('.slider-nav__button--prev')
    const nextButton = block.querySelector('.slider-nav__button--next')

    if (!container || !prevButton || !nextButton) return

    // Брейкпоинты Swiper — min-width, совпадают с --tablet / --laptop / --desktop
    const swiper = new Swiper(container, {
      slidesPerView: 'auto',
      spaceBetween: 12,
      breakpoints: {
        768: { slidesPerView: 3, spaceBetween: 12 },
        1280: { slidesPerView: 3, spaceBetween: 16 },
        1380: { slidesPerView: 4, spaceBetween: 16 },
      },
    })

    // Кнопки листают по две новости, на мобильном — по одной. slidesPerGroup здесь
    // не подходит: он не работает вместе со slidesPerView: 'auto' на мобильном
    const tabletMedia = window.matchMedia('(min-width: 768px)')
    const slidesPerClick = () => (tabletMedia.matches ? 2 : 1)

    prevButton.addEventListener('click', () => swiper.slideTo(swiper.activeIndex - slidesPerClick()))
    nextButton.addEventListener('click', () => swiper.slideTo(swiper.activeIndex + slidesPerClick()))

    const updateState = () => {
      prevButton.disabled = swiper.isBeginning
      nextButton.disabled = swiper.isEnd
    }

    swiper.on('slideChange', updateState)
    swiper.on('transitionEnd', updateState)
    swiper.on('reachBeginning', updateState)
    swiper.on('reachEnd', updateState)
    swiper.on('breakpoint', updateState)
    updateState()
  }
}
