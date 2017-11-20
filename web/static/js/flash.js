const flashHolder = document.getElementById('flash-holder')

const delayedClear = (element) => {
  if (!element) return

  setTimeout(
    element.remove.bind(element),
    2000
  )
}

delayedClear(flashHolder)
