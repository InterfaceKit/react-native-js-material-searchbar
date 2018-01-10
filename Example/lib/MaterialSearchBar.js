/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  TextInput,
  TouchableNativeFeedback,
  Platform,
  View
} from 'react-native'

class MaterialSearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      close: false,
      bubbleAnim: new Animated.Value(0)
    }
  }

  onChangeText = (value: string) => {
    if (value) {
      // TODO: Set state and change icon properly with smooth animations
      this.setState({ close: true, scale: 10 })
    } else {
      this.setState({ close: false })
    }
  }

  render() {
    const { bubbleAnim } = this.state
    if (Platform.OS !== 'android') {
      console.warn('MaterialSearchBar is only available on Android.')
      return null
    }
    return (
      <View style={this.props.containerStyle}>
        <TextInput
          {...this.props}
          style={this.props.styleInput}
          onChangeText={this.onChangeText}
        />
        <TouchableNativeFeedback
          onPress={this.onPressButton}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
          <Animated.View
          // style={{
          //   transform: [
          //     { scale: this.state.scale },
          //     { perspective: 1000 } // without this line this Animation will not render on Android while working fine on iOS
          //   ]
          // }}
          >
            {this.state.close ? this.props.closeButton : this.props.rightElement}
          </Animated.View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

MaterialSearchBar.defaultProps = {}

MaterialSearchBar.propTypes = {
  /** Override the inline-styles of the root element. */
  containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  styleInput: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  rightElement: PropTypes.element,
  onChangeText: PropTypes.func
}

export default MaterialSearchBar
