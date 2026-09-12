export interface Route {
  /** Заголовок страницы */
  title: string
  /** Имя HTML-файла в src/pages/ */
  filename: string
}

const baseRoutes: Route[] = [
  {
    title: 'Главная страница',
    filename: 'index.html',
  },
  {
    title: 'Наши продукты',
    filename: 'products.html',
  },
  {
    title: 'Продукт',
    filename: 'product.html',
  },
  {
    title: 'Карьера',
    filename: 'career.html',
  },
]

export default [
  ...baseRoutes,
]
