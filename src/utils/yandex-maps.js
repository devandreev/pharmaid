let loadPromise = null

function loadYandexMaps3(apiKey) {
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    if (window.ymaps3) {
      window.ymaps3.ready.then(() => resolve(window.ymaps3))
      return
    }

    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/3.0/?apikey=${apiKey}&lang=ru_RU`
    script.async = true
    script.onload = () => {
      window.ymaps3.ready.then(() => resolve(window.ymaps3))
    }
    script.onerror = () => {
      loadPromise = null
      reject(new Error('Failed to load Yandex Maps API 3.0'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}

export async function createMap(container, center, zoom = 16) {
  const ymaps3 = await loadYandexMaps3(process.env.YANDEX_MAPS_API_KEY)

  const {
    YMapControls,
  } = ymaps3

  const {
    YMapZoomControl,
    YMapGeolocationControl,
  } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1')

  const map = new ymaps3.YMap(container, {
    location: {
      center,
      zoom,
    },
    behaviors: ['drag', 'pinchZoom'],
    mode: 'vector',
  })

  map.addChild(new ymaps3.YMapDefaultSchemeLayer({}))
  map.addChild(new ymaps3.YMapDefaultFeaturesLayer({}))

  // Контейнер с кнопками справа, вертикально
  const controls = new YMapControls({ position: 'right', orientation: 'vertical' })
  controls.addChild(new YMapZoomControl({}))
  controls.addChild(new YMapGeolocationControl({}))

  map.addChild(controls)

  return map
}

export async function addPlacemark(map, coords, title = '') {
  const ymaps3 = await loadYandexMaps3(process.env.YANDEX_MAPS_API_KEY)

  // Кастомный маркер с логотипом вместо дефолтной метки Яндекса
  const element = document.createElement('div')
  element.className = 'contacts-map__marker'
  if (title) element.title = title

  const marker = new ymaps3.YMapMarker({ coordinates: coords }, element)

  map.addChild(marker)
  return marker
}
