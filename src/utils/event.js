const addEventListener = (target, eventName, listener) => {
  if (target.addEventListener) {
    target.addEventListener(eventName, listener, false)
  } else if (target.attachEvent) {
    target.attachEvent('on' + eventName, listener, false)
  } else {
    target['on' + eventName] = listener
  }
}

const removeEventListener = (target, eventName, listener) => {
  if (target.removeEventListener) {
    target.removeEventListener(eventName, listener, false)
  } else if (target.detachEvent) {
    target.detachEvent('on' + eventName, listener)
  } else {
    target['on' + eventName] = null
  }
}

export {
  addEventListener,
  removeEventListener
}
