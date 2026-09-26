export default {
  instances: [],

  async init() {
    const selects = document.querySelectorAll('.js-select')
    if (!selects.length) return

    // Кастомные селекты есть не на каждой странице — грузим библиотеку отдельным чанком
    const { default: SlimSelect } = await import(/* webpackChunkName: "slim-select" */ 'slim-select')

    this.instances = [...selects].map((select) => {
      this.setCurrentOption(select)

      const instance = new SlimSelect({
        select,
        settings: {
          showSearch: false,
        },
        events: {
          afterChange: (values) => {
            const url = values[0]?.value

            if (url) location.assign(url)
          },
        },
      })

      this.updateWidth(instance)

      return instance
    })
  },

  // Отметить пункт, соответствующий текущему адресу страницы
  setCurrentOption(select) {
    const current = location.pathname.split('/').pop() + location.search

    const options = [...select.options]
    const matched = options.find((option) => option.value.endsWith(current))

    if (!matched) return

    options.forEach((option) => {
      option.selected = option === matched
    })
  },

  // Подогнать ширину кнопки под ширину раскрытого списка
  updateWidth(instance) {
    if (!instance) return

    setTimeout(() => {
      const main = instance.render.main.main
      const content = instance.render.content.main

      // Сбросить проставленные ранее ширины, чтобы померить естественную.
      // Ширину списка библиотека заново выставляет при каждом открытии
      main.style.width = ''
      content.style.width = ''

      // При открытии библиотека приравнивает ширину списка к ширине кнопки,
      // поэтому кнопка должна быть не уже, чем нужно самому длинному пункту
      const contentWidth = parseFloat(getComputedStyle(content).width)
      const mainWidth = parseFloat(getComputedStyle(main).width)

      if (contentWidth > mainWidth) {
        main.style.width = contentWidth + 'px'
      }
    }, 100)
  },

  // Пересчитать ширину при смене брейкпоинта — размер шрифта кнопки меняется
  onResize() {
    this.instances.forEach((instance) => this.updateWidth(instance))
  },
}
