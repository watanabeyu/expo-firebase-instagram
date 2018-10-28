import React from 'react';
import { Text as RNText } from 'react-native';
import { Constants } from 'expo';

export default class Text extends React.Component {
  static defaultProps = {
    font: 'noto-sans-regular',
  }

  render() {
    const { font, style } = this.props;

    const textStyle = {
      fontFamily: font,
      color: Constants.manifest.extra.textColor,
    };

    return <RNText {...this.props} style={[textStyle, style]} />;
  }
}
