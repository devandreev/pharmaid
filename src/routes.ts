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
    title: 'Контакты',
    filename: 'contacts.html',
  },
  {
    title: 'Новости',
    filename: 'news.html',
  },
  {
    title: 'Новости — вариант с баннером',
    filename: 'news-banner.html',
  },
  {
    title: 'Новость',
    filename: 'news-detail.html',
  },
  {
    title: 'Новость — вариант с фотоблоками',
    filename: 'news-detail-media.html',
  },
  {
    title: 'Новость — вариант без фото',
    filename: 'news-detail-text.html',
  },
  {
    title: 'Результаты поиска',
    filename: 'search.html',
  },
  {
    title: 'Карта сайта',
    filename: 'sitemap.html',
  },
  {
    title: 'Страница не найдена',
    filename: '404.html',
  },
  {
    title: 'Текстовая страница',
    filename: 'text.html',
  },
]

export default [
  ...baseRoutes,
]
