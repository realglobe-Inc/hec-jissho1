const hitoeCallers = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_HITOE_CALLER':
      {
        let next = Object.assign({
          [action.key]: action.hitoe
        }, state)
        return next
      }
    case 'REMOVE_HITOE_CALLER':
      {
        let next = Object.assign({}, state)
        delete next[action.key]
        return next
      }
    default:
      return state
  }
}

export default hitoeCallers
