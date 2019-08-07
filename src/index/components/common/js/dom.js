export function hasClass (el, className) {
  // 开始或空白字符+类名+空白字符或结束
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  // 测试元素是否有该类名，返回布尔值
  return reg.test(el.className)
}

export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
// 以空白符为切割位置切割生成新数组
  let newClass = el.className.split(' ')
// 数组中加入新类名
  newClass.push(className)
// 将数组元素放入一个字符串，以空白符间隔
  el.className = newClass.join(' ')
}
// export function hasClass(el, className) {
//   let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
//   return reg.test(el.className)
// }

// export function addClass(el, className) {
//   if (hasClass(el, className)) {
//     return
//   }

//   let newClass = el.className.split(' ')
//   newClass.push(className)
//   el.className = newClass.join(' ')
// }

export function removeClass(el, className) {
  if (!hasClass(el, className)) {
    return
  }

  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
  el.className = el.className.replace(reg, ' ')
}

export function getData(el, name, val) {
  let prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}

export function getRect(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}
