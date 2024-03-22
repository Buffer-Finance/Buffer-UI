const removeRightmargin = (selector: string) => {
  const ele: HTMLDivElement = document.querySelector('#' + selector)
  ele.style.marginRight = '0px'
}
const setTopMargin = (selector: string, margin: number) => {
  const ele: HTMLDivElement = document.querySelector('#' + selector)
  const oldMargin = ele.style.marginTop
  ele.style.marginTop = `${oldMargin + margin}px`
}
const setRightMargin = (selector: string, margin: string) => {
  const ele: HTMLDivElement = document.querySelector('#' + selector)
  ele.style.marginRight = margin
}
const setOpacity = (selector: string, opacity: string) => {
  const ele: HTMLDivElement = document.querySelector('#' + selector)
  ele.style.opacity = opacity

  if (opacity === '0') {
    ele.style.display = 'none'
  }
  if (opacity === '1') {
    ele.style.display = 'block'
  }
}

const addClass = (selector: string, className: string) => {
  const ele: HTMLDivElement = document.querySelector('#' + selector)
  ele?.classList?.add(className)
}
const removeClass = (selector: string, className: string) => {
  const ele: HTMLDivElement = document.querySelector('#' + selector)
  ele?.classList?.remove(className)
}
export { removeRightmargin, setTopMargin, setRightMargin, setOpacity, addClass, removeClass }
