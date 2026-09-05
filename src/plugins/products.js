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

    const swiper = new Swiper(container, {
      modules: [EffectCreative],
      effect: 'creative',
      loop: true,
      creativeEffect: {
        limitProgress: 2,
        prev: {
          translate: ['-67%', '-10%', -1],
          scale: 0.75,
        },
        next: {
          translate: ['67%', '-10%', -1],
          scale: 0.75,
        },
      },
    })

    prevButton.addEventListener('click', () => swiper.slidePrev())
    nextButton.addEventListener('click', () => swiper.slideNext())

    const updateDescription = () => {
      const activeSlide = container.querySelector('.swiper-slide-active')

      if (activeSlide && description) {
        description.textContent = activeSlide.dataset.description
      }
    }

    swiper.on('slideChange', updateDescription)
    updateDescription()
  }
}
