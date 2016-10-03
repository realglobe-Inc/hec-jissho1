/**
 * Drone area in controll panel
 */
import React from 'react'
import { connect } from 'react-redux'
import MODE from '../constants/drone_mode'
import actions from '../actions'
import { ApButton } from 'apeman-react-button'

const debug = require('debug')('hec:container:area_drone')
const LOG_ERR_COLOR = '#FF5722'

let AreaDrone = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    storeState: React.PropTypes.object
  },

  render () {
    const s = this
    let { props } = s
    let {dispatch, storeState} = props
    let { droneState, droneActor } = storeState
    let { mode, key } = droneState
    return (
      <div className='area-drone' style={{ textAlign: 'center' }}>
        <div className='upper'>
          <h4>Drone</h4>
          <ApButton className='drone-set-destination-button'
                    primary={mode === MODE.PREPARING}
                    disabled={mode === MODE.MOVING}
                    onClick={() => {
                      if (mode === MODE.PREPARING) {
                        dispatch(actions.cancelSettingDestination())
                      } else {
                        dispatch(actions.startSettingDestination(key))
                      }
                    }}
                    wide
          >目的地をセット</ApButton>
          <ApButton className='drone-cancel-destination-button'
                    disabled={mode !== MODE.PREPARED}
                    onClick={() => {
                      dispatch(actions.cancelDestination())
                    }}
                    wide
          >目的地をリセット</ApButton>
          <ApButton className='drone-start-moving-button'
                    disabled={mode !== MODE.PREPARED}
                    onClick={() => {
                      let { destination } = storeState.droneState
                      let dispatchStart = () => {
                        debug('start moving')
                        dispatch(actions.addDroneLog('移動開始しました'))
                        dispatch(actions.startMoving())
                        droneActor.off('start', dispatchStart)
                      }
                      let dispatchFinish = () => {
                        debug('finish moving')
                        dispatch(actions.addDroneLog('到着しました'))
                        dispatch(actions.finishMoving())
                        droneActor.off('finish', dispatchFinish)
                      }
                      let abort = () => {
                        debug('abort moving')
                        dispatch(actions.addDroneLog({
                          text: '移動中止しました',
                          color: LOG_ERR_COLOR
                        }))
                        droneActor.off('start', dispatchStart)
                        droneActor.off('finish', dispatchFinish)
                        droneActor.off('abort', abort)
                      }
                      droneActor.on('start', dispatchStart)
                      droneActor.on('finish', dispatchFinish)
                      droneActor.on('abort', abort)
                      droneActor.moveTo(destination)
                        .catch((err) => dispatch(actions.addDroneLog({ text: err.message, color: LOG_ERR_COLOR })))
                    }}
                    wide
          >移動開始</ApButton>
          <ApButton className='drone-abort-moving-button'
                    disabled={mode !== MODE.MOVING}
                    onClick={() => {
                      droneActor.abortMoving()
                        .catch((err) => dispatch(actions.addDroneLog({ text: err.message, color: LOG_ERR_COLOR })))
                      let dispatchAbort = () => {
                        dispatch(actions.abortMoving())
                        droneActor.off('abort', dispatchAbort)
                      }
                      droneActor.on('abort', dispatchAbort)
                    }}
                    wide
          >移動を中止</ApButton>
        </div>
        <div className='drone-log'>
          {storeState.droneLog.map((log, i) => {
            let style = { color: log.color }
            return <div style={style} key={log.text}>{log.text}</div>
          }).reverse()}
        </div>
      </div>
    )
  }
})

const mapStateToProps = (storeState) => ({ storeState })
const mapDispatchToProps = (dispatch) => ({ dispatch })

AreaDrone = connect(mapStateToProps, mapDispatchToProps)(AreaDrone)

export default AreaDrone
