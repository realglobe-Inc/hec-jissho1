/**
 * Action of drone map
 */

const changeMapCenter = ({lat, lng}) => {
  return {
    type: 'CHANGE_MAP_CENTER',
    lat,
    lng
  }
}

export default changeMapCenter
