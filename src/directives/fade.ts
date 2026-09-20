// Длительность перехода элемента в миллисекундах
function getTransitionDuration(element: HTMLElement): number {
  const styles = window.getComputedStyle(element)

  const toMs = (value: string): number => {
    const parsed = parseFloat(value)

    if (!parsed) return 0

    return value.includes('ms') ? parsed : parsed * 1000
  }

  return toMs(styles.transitionDuration) + toMs(styles.transitionDelay)
}

// Плавное скрытие
export function fadeOut(element: HTMLElement, callback?: () => void): void {
  let timer: ReturnType<typeof setTimeout>
  let isDone = false

  const finish = () => {
    if (isDone) return
    isDone = true

    clearTimeout(timer)
    element.removeEventListener('transitionend', finish)
    element.style.display = 'none'

    if (callback) callback()
  }

  element.style.opacity = '0'
  element.addEventListener('transitionend', finish)

  // transitionend не придёт, если элемент скрыт (например, display: none у хоста),
  // и попап остался бы растянутым на весь экран, перехватывая клики
  timer = setTimeout(finish, getTransitionDuration(element) + 50)
}

// Плавное появление
export function fadeIn(element: HTMLElement, callback?: () => void): void {
  let timer: ReturnType<typeof setTimeout>
  let isDone = false

  const finish = () => {
    if (isDone) return
    isDone = true

    clearTimeout(timer)
    element.removeEventListener('transitionend', finish)

    if (callback) callback()
  }

  element.style.removeProperty('display')

  setTimeout(() => {
    element.style.opacity = '1'
    element.addEventListener('transitionend', finish)

    timer = setTimeout(finish, getTransitionDuration(element) + 50)
  }, 100)
}
