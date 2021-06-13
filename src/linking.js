export default new class {

  capture(target) {
    if (!this.hunter) return

    this._ensureId(target)
    this.hunter.description = `см. ${target.id}`
    return true
  }

  _ensureId(target) {
    if (target.id) return
    var id, i = 0, prefix = target.name.substring(0,3)
    do {
      i++
      id = `${prefix}${i}`
    } while(target.root.find(id))
    target.id = id
  }

}