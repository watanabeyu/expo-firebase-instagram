import React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { Constants, Video } from 'expo';

/* node_modules */
import { Image } from 'react-native-expo-image-cache';
import Hyperlink from 'react-native-hyperlink';
import LinkifyIt from 'linkify-it';

/* from app */
import Avatar from 'app/src/components/Avatar';
import IconButton from 'app/src/components/IconButton';
import Text from 'app/src/components/Text';
import styles from './styles.js';

const linkify = new LinkifyIt();
linkify.add('#', {
  validate: (text, pos) => {
    const tail = text.slice(pos);

    if (!linkify.re.hashtag) {
      linkify.re.hashtag = new RegExp(/^[#]{0,2}?(w*[一-龠_ぁ-ん_ァ-ヴーａ-ｚＡ-Ｚa-zA-Z0-9]+|[a-zA-Z0-9_]+|[a-zA-Z0-9_]w*)/gi);
    }

    if (linkify.re.hashtag.test(tail)) {
      return tail.match(linkify.re.hashtag)[0].trim().length;
    }

    return 0;
  },
  normalize: (match) => {
    match.index += match.url.lastIndexOf('#');
    match.url = match.url.replace(/^#{0,}/, '#');
  },
});

export default class Item extends React.Component {
  static defaultProps = {
    type: 'photo',
    text: '',
    fileUri: null,
    fileWidth: null,
    fileHeight: null,
    user: {
      uid: null,
      img: null,
      name: null,
    },
    timestamp: null,
    visible: true,
    onUserPress: () => { },
    onMorePress: () => { },
    onLikePress: () => { },
  }

  constructor(props) {
    super(props);

    this.state = {
      height: 0,
    };
  }

  onLayout = ({ nativeEvent }) => {
    const { height } = nativeEvent.layout;
    this.setState({ height });
  }

  getRelativeTime = (timestamp) => {
    const created = new Date(timestamp);
    const diff = Math.floor((new Date().getTime() - created.getTime()) / 1000);

    if (diff < 60) {
      return `${diff}s`;
    } if (diff < 3600) {
      return `${Math.floor(diff / 60)}m`;
    } if (diff < 86400) {
      return `${Math.floor(diff / 3600)}h`;
    }

    return `${created.getFullYear()}/${(`00${created.getMonth() + 1}`).slice(-2)}/${(`00${created.getDate()}`).slice(-2)}`;
  }

  render() {
    const {
      type,
      text,
      fileUri,
      user,
      timestamp,
      liked,
      visible,
      onUserPress,
      onMorePress,
      onLikePress,
      onLinkPress,
    } = this.props;
    const { height = 0 } = this.state;

    if (!visible && height > 0) {
      return <View style={{ height }} />;
    }

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <View style={styles.header}>
          <View style={styles.headerUser}>
            <TouchableOpacity style={styles.avatar} onPress={() => onUserPress(this.props)}>
              <Avatar uri={user.img} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onUserPress(this.props)}>
              <Text font="noto-sans-medium">{user.name}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <IconButton name="ios-more" size={26} style={styles.icon} onPress={() => onMorePress(this.props)} />
          </View>
        </View>
        {type === 'photo' && <Image uri={fileUri} style={styles.file} />}
        {type === 'movie' && (
          <Video
            source={{ uri: fileUri }}
            resizeMode="cover"
            useNativeControls
            style={styles.file}
          />
        )}
        <View style={styles.buttons}>
          <IconButton
            name={liked ? 'ios-heart' : 'ios-heart-outline'}
            size={26}
            style={styles.icon}
            color={liked ? '#ed4956' : Constants.manifest.extra.textColor}
            onPress={() => onLikePress(this.props)}
          />
        </View>
        {text !== '' && (
          <Hyperlink onPress={onLinkPress} linkify={linkify} linkStyle={{ color: '#2980b9' }}>
            <Text style={styles.text}>{text}</Text>
          </Hyperlink>
        )}
        <Text style={styles.time}>{this.getRelativeTime(timestamp)}</Text>
      </View>
    );
  }
}
