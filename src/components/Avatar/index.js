import React from 'react';
import { View } from 'react-native';

/* node_modules */
import { Image } from 'react-native-expo-image-cache';

/* from app */
import styles from './styles';

export default class Avatar extends React.Component {
  static defaultProps = {
    uri: null,
    style: null,
    size: 36,
  }

  render() {
    const { uri, style, size } = this.props;

    const avatarStyle = [
      styles.image,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#eee',
      },
      style,
    ];

    if (!uri) {
      return (
        <View style={avatarStyle} />
      );
    }

    return <Image uri={uri} style={avatarStyle} resizeMode="cover" />;
  }
}
