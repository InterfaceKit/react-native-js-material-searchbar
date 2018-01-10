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

type Props = {
  containerStyle: Object | number,
  styleInput: Object | number,
  searchIcon: Node,
  closeIcon: Node,
  onChangeText: Function
}
type State = {
  isEmpty: boolean
}

class MaterialSearchBar extends React.Component<Props, State> {
  _textInput: TextInput
  static defaultProps = {}

  constructor(props: Props) {
    super(props)
    this.state = {
      isEmpty: true
    }
  }

  _onPressButton = () => {
    this._textInput.clear()
    this.setState({ isEmpty: true }, () => {
      this.props.onChangeText('')
    })
  }

  _onChangeText = (value: string) => {
    this.props.onChangeText(value)
    if (value) {
      this.setState({ isEmpty: false })
    } else {
      this.setState({ isEmpty: true })
    }
  }

  render() {
    const { isEmpty } = this.state
    if (Platform.OS !== 'android') {
      console.warn('MaterialSearchBar is only available on Android.')
      return null
    }
    const isLowAPI: boolean = Platform.Version < 21
    return (
      <View style={this.props.containerStyle}>
        <TextInput
          {...this.props}
          ref={(ref: any) => {
            this._textInput = ref
          }}
          style={this.props.styleInput}
          onChangeText={this._onChangeText}
        />
        <TouchableNativeFeedback
          onPress={this._onPressButton}
          background={
            isLowAPI
              ? TouchableNativeFeedback.SelectableBackground()
              : TouchableNativeFeedback.SelectableBackgroundBorderless()
          }>
          <Animated.View
          // style={{
          //   transform: [
          //     { scale: this.state.scale },
          //     { perspective: 1000 } // without this line this Animation will not render on Android while working fine on iOS
          //   ]
          // }}
          >
            {isEmpty ? this.props.searchIcon : this.props.closeIcon}
          </Animated.View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

MaterialSearchBar.defaultProps = {
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 8,
    paddingHorizontal: 12
  },
  styleInput: {
    flex: 1,
    height: 56,
    color: 'black',
    fontSize: 20,
    fontFamily: 'Roboto'
  },
  placeholderTextColor: 'grey'
}

MaterialSearchBar.propTypes = {
  /** Override the inline-styles of the root element. */
  containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  styleInput: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  searchIcon: PropTypes.node,
  closeIcon: PropTypes.node,
  onChangeText: PropTypes.func.isRequired
}

export default MaterialSearchBar
