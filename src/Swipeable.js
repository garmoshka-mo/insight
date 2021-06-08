import Swipeout from "react-native-swipeout";
import React, {Component} from "../utils/react-tuned";
import {colors} from "./styles";
import dashboard from "./dashboard";
import menuController from "./menuController";
import {swipeController} from "../utils/ComponentController";
import NodeMoving from "./menu/NodeMoving";


export default class Swipeable extends Component {

  state = {closeSwipe: false}

  render() {
    var {node, children} = this.props
    this.node = node

    var left = this.swipeButtons([{
      text: '🔥',
      selected: node.importance == 'important',
      onPress: _=> this.updateNode('importance', 'important', 'normal')
    },{
      text: '❔',
      selected: node.importance == 'guess',
      onPress: _=> this.updateNode('importance', 'guess', 'normal')
    },{
      text: '⏩',
      selected: node.alwaysExpanded,
      onPress: _=> this.updateNode('alwaysExpanded', true, false)
    },

    {
      text: '✐',
      onPress: this.edit
    }
    ])

    var right = this.swipeButtons([
      {
        text: '⇕',
        onPress: this.showNodeTools
      },
      {
      text: '🚮',
      type: 'delete',
      onPress: node.delete
    }])

    return <Swipeout backgroundColor={'transparent'}
                     sensitivity={2}
                     close={this.state.closeSwipe}
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
    this.setState({closeSwipe: false})
    swipeController.update({swipeStarted: true})
  }

  async handleGestureEnd() {
    swipeController.update({swipeStarted: false})
  }

  edit() {
    this.node.edit()
    this.setState({closeSwipe: true})
  }

  showNodeTools() {
    menuController.push(new NodeMoving(this.node))
    this.setState({closeSwipe: true})
  }

  updateNode(key, value, neutral) {
    this.node.updateFlag(key, value, neutral)
    dashboard.save()
  }

}