import Swiper from 'swiper'
import { EffectCreative } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-creative'

export default {
  init() {
    const container = document.querySelector('.products__swiper')

    if (!container) return

    const description = document.querySelector('.products__description')
    const slides = container.querySelectorAll('.product-slide')
    const prevButton = document.querySelector('.products__nav-button--prev')
    const nextButton = document.querySelector('.products__nav-button--next')

    const isTabletLandscape = window.matchMedia('(min-width: 1024px)').matches
    const isTablet = window.matchMedia('(min-width: 768px)').matches

    let offsetX = '67%'
    let offsetY = '-10%'

    if (isTabletLandscape) {
      offsetX = '107%'
      offsetY = '-20%'
    } else if (isTablet) {
      offsetX = '87%'
    }

    const swiper = new Swiper(container, {
      modules: [EffectCreative],
      effect: 'creative',
      loop: false,
      creativeEffect: {
        limitProgress: 2,
        prev: {
          translate: ['-' + offsetX, offsetY, -1],
          scale: 0.75,
        },
        next: {
          translate: [offsetX, offsetY, -1],
          scale: 0.75,
        },
      },
    })

    prevButton.addEventListener('click', () => swiper.slidePrev())
    nextButton.addEventListener('click', () => swiper.slideNext())

    const updateState = () => {
      const activeSlide = container.querySelector('.swiper-slide-active')

      if (activeSlide && description) {
        description.textContent = activeSlide.dataset.description
      }

      prevButton.disabled = swiper.isBeginning
      nextButton.disabled = swiper.isEnd
    }

    swiper.on('slideChange', updateState)
    swiper.on('transitionEnd', updateState)
    swiper.on('reachBeginning', updateState)
    swiper.on('reachEnd', updateState)
    updateState()
  }
}
