import React, {Component} from "../../utils/react-tuned";
import {colors} from "../styles";
import dashboard from "../dashboard";
import {Text, View, TouchableOpacity, Clipboard} from "react-native";
import menuController from "../menu/menuController";
import MovingMenu from "../menu/MovingMenu";
import Icon from "react-native-vector-icons/FontAwesome"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import actionsSheetController from "../actionsSheetController";

const iconProps = {
  color: "white", size: 20,
  style: {textAlign: 'center'}
}

export default class NodeTools extends Component {

  constructor(props) {
    super(props)
    actionsSheetController.onClose = props.onHide
  }

  render() {
    var {node} = this.props
    this.node = node

    var left = [{
      component: this.emoji('🔥', node.importance == 'important'),
      onPress: _=> this.updateNode('importance', 'important', 'normal')
    },{
      component: this.emoji('❔', node.importance == 'guess'),
      onPress: _=> this.updateNode('importance', 'guess', 'normal')
    },{
      component: this.emoji('⏩', node.alwaysExpanded),
      onPress: _=> this.updateNode('alwaysExpanded', true, false)
    }]

    var right = [{
        component: <Icon name='copy' {...iconProps}/>,
        onPress: this.copy
      }, {
        component: <MaterialIcon name='table-row-plus-before' {...iconProps}/>,
        onPress: () => node.editSibling(-1)
      }, {
        component: <MaterialIcon name='table-row-plus-after' {...iconProps}/>,
        onPress: node.editSibling
      }, {
        component: <Icon name='child' {...iconProps}/>,
        onPress: node.editChild
      }, {
        component: <Icon name='arrows' {...iconProps}/>,
        onPress: this.showNodeTools
      }, {
        component: this.emoji('🚮'),
        onPress: node.delete
      }]

    return <View style={{}}>
      <View style={{flexDirection: 'row', justifyContent: "flex-end", marginBottom: 40}}>
        {this.buttons(left)}
      </View>
      <View style={{flexDirection: 'row', justifyContent: "flex-end"}}>
        {this.buttons(right)}
      </View>
    </View>
  }

  buttons(buttons) {
    return buttons.map(b => this.button(b))
  }

  button(b) {
    var style = {
      width: 40,
      backgroundColor: b.selected ? colors.selected : 'transparent'
    }
    return <TouchableOpacity key={b.onPress} onPress={_ => {
      actionsSheetController.close()
      this.props.onHide()
      b.onPress()
    }}>
      <View style={style}>{b.component}</View>
    </TouchableOpacity>
  }

  emoji(emoji, selected) {
    var color = '#000'
    if (selected === false) color = 'rgba(0,0,0,.2)'
    return <Text style={{color, textAlign: 'center'}}>
      {emoji}
    </Text>
  }

  copy() {
    Clipboard.setString(this.node.name)
  }

  showNodeTools() {
    menuController.push(new MovingMenu(this.node))
  }

  updateNode(key, value, neutral) {
    this.node.updateFlag(key, value, neutral)
    dashboard.save()
  }

}