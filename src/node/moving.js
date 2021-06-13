
export function move(node, dir = -1) {
  var ch = node.parent.children
  var from = ch.indexOf(node)
  var to = from + dir
  if (to >= 0 && to < ch.length) {
    ch.move(from, to)
  } else if (node.parent.parent) {
    ch.delete(node)
    var exParent = node.parent
    node.parent = node.parent.parent
    node.level--
    ch = node.parent.children
    var at = ch.indexOf(exParent)
    if (dir > 0) at++
    ch.insert(at, node)
  }
  node.parent.refresh()
}

export function moveToChild(node, dir = -1) {
  var ch = node.parent.children
  var i = ch.indexOf(node)
  var to = i + dir
  if (!(to >= 0 && to < ch.length)) return

  var oldParent = node.parent
  var newParent = ch[to]
  node.parent = newParent
  ch.delete(node)
  newParent.addChild(node, dir == -1)
  oldParent.refresh()
  newParent.refresh()
  node.level++
}