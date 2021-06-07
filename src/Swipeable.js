import Swipeout from "react-native-swipeout";
import React, {Component} from "../utils/react-tuned";
import {colors} from "./styles";
import dashboard from "./dashboard";
import menuController from "./menuController";
import {swipeController} from "../utils/ComponentController";


export default class Swipeable extends Component {

  state = {closeSwipe: false}

  render() {
    var {node, children} = this.props
    this.node = node
    var left = [{
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
    }, {
      text: '⇕',
      onPress: this.edit
    },

    ].map(props => ({
      ...props,
      backgroundColor: props.selected ? colors.selected : 'transparent',
    }))

    var right = [{
      text: '🚮',
      type: 'delete',
      onPress: node.delete
    }]

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

  handleGestureStart() {
    swipeController.update({swipeStarted: true})
  }

  async handleGestureEnd() {
    swipeController.update({swipeStarted: false})
  }

  edit() {
    this.node.edit()
    this.setState({closeSwipe: true},
      _=> this.setState({closeSwipe: false})
    )
  }

  updateNode(key, value, neutral) {
    var state = {[key]: value}
    if (this.node[key] == value) state[key] = neutral
    if (state.alwaysExpanded) state.expanded = true
    this.node.update(state)
    dashboard.save()
    menuController.refresh()
  }

}