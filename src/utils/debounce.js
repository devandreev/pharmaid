// Декоратор debounce
export default function (func, delay = 250, immediate = true) {
  let timerId

  return (...args) => {
    const boundFunc = func.bind(this, ...args)
    clearTimeout(timerId)
    if (immediate && !timerId) {
      boundFunc()
    }
    const calleeFunc = immediate ? () => { timerId = null } : boundFunc
    timerId = setTimeout(calleeFunc, delay)
  }
}
