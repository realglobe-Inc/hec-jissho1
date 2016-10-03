/**
 * Action of drone log
 */
import appUtil from '../utils/app_util'
const defaultColor = '#666'

const addDroneLog = (arg) => {
  let text
  let color
  if (typeof arg === 'object') {
    text = arg.text
    color = arg.color
  } else if (typeof arg === 'string') {
    text = arg
    color = defaultColor
  } else {
    throw new Error('wrong argument type: ' + typeof arg)
  }
  let time = appUtil.formatTime(new Date())
  return {
    type: 'ADD_LOG',
    text: time + ' ' + text,
    color
  }
}

export default addDroneLog
