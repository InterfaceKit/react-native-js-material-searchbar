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
  searchIcon: Object,
  closeIcon: Object,
  onChangeText: Function
}
type State = {
  isEmpty: boolean,
  scale: number,
  value: string
}

class MaterialSearchBar extends React.Component<Props, State> {
  _textInput: TextInput

  static defaultProps = {
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

  static propTypes = {
    /** Override the inline-styles of the root element */
    containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Override the inline-styles of the style input */
    styleInput: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** The displayed search icon on the right of the input text */
    searchIcon: PropTypes.element,
    /** The displayed close icon on the right of the input text */
    closeIcon: PropTypes.element,
    /** A function to execute when field's value is changed */
    onChangeText: PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      isEmpty: true,
      scale: new Animated.Value(1),
      value: ''
    }
  }

  _onPressButton = () => {
    this.setState({ isEmpty: true, value: '' }, () => {
      this.props.onChangeText('')
    })
  }

  /**
   * Starts a sequenced animation on close/search button
   */
  startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(this.state.scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start()
  }

  _onChangeText = (value: string) => {
    this.props.onChangeText(value)
    if (value) {
      this.setState({ isEmpty: false, value })
    } else {
      this.setState({ isEmpty: true, value })
    }

    if (this.state.value.length === 0) {
      this.startAnimation()
    }
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (nextState.value.length === 0) {
      this.startAnimation()
    }
  }

  render() {
    const { isEmpty } = this.state
    if (Platform.OS !== 'android') {
      console.warn('MaterialSearchBar is only available on Android.')
      return null
    }
    return (
      <View style={this.props.containerStyle}>
        <TextInput
          {...this.props}
          ref={(ref: any) => {
            this._textInput = ref
          }}
          value={this.state.value}
          style={this.props.styleInput}
          onChangeText={this._onChangeText}
        />
        <TouchableNativeFeedback
          onPress={this._onPressButton}
          background={
            Platform.Version < 21
              ? TouchableNativeFeedback.SelectableBackground()
              : TouchableNativeFeedback.SelectableBackgroundBorderless()
          }>
          <Animated.View
            style={[
              {
                transform: [
                  {
                    scale: this.state.scale
                  }
                ]
              }
            ]}>
            {isEmpty ? this.props.searchIcon : this.props.closeIcon}
          </Animated.View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

export default MaterialSearchBar
