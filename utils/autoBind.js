/**@providesModule autoBind
 */

var REACT_METHODS = [
  'constructor',
  'render',
  'forceUpdate',
  'isMounted',
  'replaceState',
  'hasOwnProperty',
  'componentWillMount',
  'UNSAFE_componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
]

export default (self) => {

  for (const key of getAllPropertyNames(self)) {
    let val = null

    if (REACT_METHODS.includes(key) ||
      key.startsWith('__') ) continue

    try {
      val = self[key]
    } catch (err) {
      continue
    }

    var doBind = typeof val === 'function' &&
      !self[key].name.startsWith('bound ')
    if (doBind) {
      self[key] = val.bind(self)
      //console.log(`  --- bind '${key}' as '${self[key].name}'`)
    }
  }



  /**
   * Get all property names by walking up prototype chain
   * @param {*} obj
   * @return {array}
   */
  function getAllPropertyNames( obj ) {
    let props = [];

    do {
      Object.getOwnPropertyNames( obj )
        .forEach(( prop ) => {
          if ( props.indexOf( prop ) === -1 ) {props.push( prop );}
        });
    } while ( (obj = Object.getPrototypeOf( obj )) )

    return props;
  }

  return self
}
