/**
 * Application util functions
 */

export default {
  /**
   * Date のインスタンスをいい感じにフォーマットした文字列にして返す
   */
  formatTime (date) {
    let padding = number => ('0' + number).slice(-2)
    let hours = padding(date.getHours())
    let minutes = padding(date.getMinutes())
    let seconds = padding(date.getSeconds())
    let timeStr = `${hours}:${minutes}:${seconds}`
    return timeStr
  }
}
