import React from 'react';
import {
  View,
  ScrollView,
  Share,
} from 'react-native';
import { WebBrowser } from 'expo';

/* from app */
import Item from 'app/src/components/Item';
import Text from 'app/src/components/Text';
import styles from './styles';

export default class PostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('title', '読み込み中'),
  })

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      fetching: false,
    };
  }

  onUserPress = (item) => {
    const { navigation } = this.props;

    navigation.push('User', { uid: item.uid });
  }

  onMorePress = (item) => {
    Share.share({
      message: item.fileUri,
    });
  }

  onLikePress = async (item) => {
    // ここにいいねの処理を書きます。
  }

  onLinkPress = (url, txt) => {
    const { navigation } = this.props;

    switch (txt[0]) {
      case '#':
        navigation.push('Tag', { tag: txt });
        break;
      default:
        WebBrowser.openBrowserAsync(url);
        break;
    }
  }

  render() {
    const { error, fetching } = this.state;

    if (fetching) {
      return (
        <View style={[styles.container, styles.empty]}>
          <Text font="noto-sans-bold" style={styles.emptyText}>読み込み中</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.cjontainer, styles.empty]}>
          <Text font="noto-sans-bold" style={styles.emptyText}>投稿はありません</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.container}>
        <Item
          // TODO: Firestoreから受け取る値と入れ替える
          // {...this.state}
          text="投稿です。"
          fileUri="https://dummyimage.com/400x400/000/fff.png&text=Post1"
          user={{
            uid: 1,
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
            name: 'User1',
          }}
          onUserPress={this.onUserPress}
          onMorePress={this.onMorePress}
          onLikePress={this.onLikePress}
          onLinkPress={this.onLinkPress}
        />
      </ScrollView>
    );
  }
}
