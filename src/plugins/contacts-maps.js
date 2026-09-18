import { createMap, addPlacemark } from '@/utils/yandex-maps.js'

function createOverlay(container, map) {
  const overlay = document.createElement('div')
  overlay.className = 'contacts-map-overlay'
  container.appendChild(overlay)

  overlay.addEventListener('click', () => {
    overlay.remove()
    map.update({ behaviors: ['drag', 'pinchZoom', 'scrollZoom'] })
  })

  container.addEventListener('mouseleave', () => {
    if (!container.querySelector('.contacts-map-overlay')) {
      container.appendChild(overlay)
      map.update({ behaviors: ['drag', 'pinchZoom'] })
    }
  })
}

export default {
  init() {
    const containers = document.querySelectorAll('.contacts-map')
    if (!containers.length) return

    containers.forEach(async (container) => {
      const lat = parseFloat(container.dataset.lat)
      const lng = parseFloat(container.dataset.lng)
      if (isNaN(lat) || isNaN(lng)) return

      const map = await createMap(container, [lat, lng], 16)
      addPlacemark(map, [lat, lng], container.dataset.title || '')
      createOverlay(container, map)
    })
  },
}
