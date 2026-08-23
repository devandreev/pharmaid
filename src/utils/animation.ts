export function restartTargetAnimation(target: HTMLElement) {
  if (!target?.getAnimations) {
    console.log('getAnimations unavailable', target)
    return
  }

  const animations = target.getAnimations()
  const animation = animations[animations.length - 1]

  if (animation) {
    requestAnimationFrame(() => {
      animation.cancel()
      animation.play()
    })
  }
}
