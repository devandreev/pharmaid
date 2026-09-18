export default {
  breakpoints: [1920, 1280, 1024, 768, 390],

  init() {
    const videos = document.querySelectorAll('.js-hero-video')
    if (!videos.length) return

    videos.forEach(video => this.loadVideo(video))
  },

  loadVideo(video) {
    const width = window.innerWidth
    const src = this.getSourceForWidth(video, width)
    if (!src) return

    video.src = src
    video.load()

    video.addEventListener('canplay', () => {
      video.play().catch(() => {})
    }, { once: true })
  },

  getSourceForWidth(video, width) {
    let selectedBp

    if (width >= 1380) {
      selectedBp = 1920
    } else if (width >= 1280) {
      selectedBp = 1280
    } else if (width >= 1024) {
      selectedBp = 1024
    } else if (width >= 768) {
      selectedBp = 768
    } else {
      selectedBp = 390
    }

    const src = video.dataset[`src-${selectedBp}`]
    if (src) return src

    // Fallback к ближайшему меньшему доступному брейкпоинту
    for (const bp of this.breakpoints) {
      if (bp <= selectedBp && video.dataset[`src-${bp}`]) {
        return video.dataset[`src-${bp}`]
      }
    }

    return null
  },
}
