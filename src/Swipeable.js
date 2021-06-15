import Swipeout from "react-native-swipeout";
import React, {Component} from "../utils/react-tuned";
import {colors} from "./styles";
import dashboard from "./dashboard";
import {Text} from "react-native";
import menuController from "./menu/menuController";
import {swipeController} from "../utils/ComponentController";
import NodeMoving from "./menu/NodeMoving";
import Icon from "react-native-vector-icons/FontAwesome"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"

const iconProps = {
  color: "white", size: 20,
  style: {textAlign: 'center'}
}

export default class Swipeable extends Component {

  render() {
    var {node, children} = this.props
    this.node = node

    var left = this.swipeButtons([{
      component: this.emoji('🔥', node.importance == 'important'),
      onPress: _=> this.updateNode('importance', 'important', 'normal')
    },{
      component: this.emoji('❔', node.importance == 'guess'),
      onPress: _=> this.updateNode('importance', 'guess', 'normal')
    },{
      component: this.emoji('⏩', node.alwaysExpanded),
      onPress: _=> this.updateNode('alwaysExpanded', true, false)
    },

    {
      component: <Icon name='pencil-square' {...iconProps}/>,
      onPress: this.edit
    }
    ])

    var right = this.swipeButtons([
      {
        component: <MaterialIcon name='table-row-plus-after' {...iconProps}/>,
        onPress: node.editSibling
      },
      {
        component: <Icon name='child' {...iconProps}/>,
        onPress: node.editChild
      },
      {
        component: <Icon name='arrows' {...iconProps}/>,
        onPress: this.showNodeTools
      },
      {
      text: '🚮',
      type: 'delete',
      onPress: node.delete
    }])

    return <Swipeout backgroundColor={'transparent'}
                     autoClose={true}
                     sensitivity={2}
                     onGestureStart={this.handleGestureStart}
                     onGestureEnd={this.handleGestureEnd}
                     buttonWidth={40}
                     style={{width: '100%'}}
                     right={right} left={left}>
      {children}
    </Swipeout>
  }

  swipeButtons(buttons) {
    return buttons.map(props => ({
      ...props,
      backgroundColor: props.selected ? colors.selected : 'transparent',
    }))
  }

  handleGestureStart() {
    swipeController.update({swipeStarted: true})
  }

  emoji(emoji, selected) {
    var color = '#000'
    if (!selected) color = 'rgba(0,0,0,.2)'
    return <Text style={{color, textAlign: 'center'}}>
      {emoji}
    </Text>
  }

  async handleGestureEnd() {
    swipeController.update({swipeStarted: false})
  }

  edit() {
    this.node.edit()
  }

  showNodeTools() {
    menuController.push(new NodeMoving(this.node))
  }

  updateNode(key, value, neutral) {
    this.node.updateFlag(key, value, neutral)
    dashboard.save()
  }

}