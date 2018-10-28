import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';

/* from app */
import styles from './styles';

export default class IconButton extends React.Component {
  static defaultProps = {
    name: 'ios-arrow-back',
    size: 32,
    color: Constants.manifest.extra.textColor,
    style: null,
    onPress: () => { },
  }

  render() {
    const {
      name,
      size,
      color,
      style,
      onPress,
    } = this.props;

    return (
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Ionicons name={name} size={size} color={color} />
      </TouchableOpacity>
    );
  }
}
