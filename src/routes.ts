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
  {
    title: 'О компании',
    filename: 'about.html',
  },
  {
    title: 'Партнерам',
    filename: 'partners.html',
  },
  {
    title: 'Фармаконадзор',
    filename: 'pharmacovigilance.html',
  },
  {
    title: 'Карта сайта',
    filename: 'sitemap.html',
  },
]

export default [
  ...baseRoutes,
]
