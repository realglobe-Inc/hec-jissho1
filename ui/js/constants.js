module.exports = {
  /* Marker 関係 */
  MARKER_TYPE: {
    DEFAULT: 1,
    DRONE: 2,
    REPORT: 3,
    PERSON: 4
  },
  MARKER_NAME: {
    REPORTER: '通報'
  },

  /* Hitoe 関係 */
  HITOE_MODULE_NAME: 'hitoe',
  HITOE_EVENT: {
    EMERGENCY: 'emergency',
    WARNING: 'warning'
  },
  HITOE_ACTORKEY_PREFIX: 'qq:hitoe',
  OBSERVER_EVENT: {
    ACTOR_CONNECT: 'actor:update',
    ACTOR_TEARDOWN: 'actor:teardown'
  },

  /* その他 */
  MODAL: {
    CONFIRM_CLOSE: 1
  }
}
