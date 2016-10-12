import React, { PropTypes as types } from 'react'
import {connect} from 'react-redux'

module.exports = {
  /**
   * props に storeState と dispatch を持つ React クラスをつくる
   */
  createReduxClass (ReactObject) {
    let ReactClass = React.createClass(ReactObject)
    const mapStateToProps = (storeState) => ({ storeState })
    const mapDispatchToProps = (dispatch) => ({ dispatch })
    Object.assign(ReactClass.propTypes || {}, {
      storeState: types.object,
      dispatch: types.func
    })
    ReactClass = connect(mapStateToProps, mapDispatchToProps)(ReactClass)
    return ReactClass
  }
}
