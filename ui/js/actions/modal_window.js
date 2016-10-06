/**
 * Action of modal window.
 */
const toggleModal = (key) => {
  return {
    type: 'TOGGLE_MODAL_DISPLAY',
    key
  }
}

export default {
  toggleModal
}
