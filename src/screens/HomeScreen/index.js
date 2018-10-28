import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Share,
  ActivityIndicator,
} from 'react-native';
import { WebBrowser } from 'expo';

/* from app */
import FlatList from 'app/src/components/FlatList';
import Item from 'app/src/components/Item';
import Text from 'app/src/components/Text';
import styles from './styles';

export default class HomeScreen extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'フィード',
  })

  constructor(props) {
    super(props);

    this.state = {
      posts: [
        {
          text: '1つ目の投稿です。 #tag1',
          fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post1',
          user: {
            uid: 1,
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
            name: 'User1',
          },
        },
      ],
      fetching: false,
      loading: false,
    };
  }

  onUserPress = (item) => {
    // ここにUserScreenに遷移する処理を書きます。
  }

  onMorePress = (item) => {
    // ここに投稿の共有をする処理を書きます。
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
    const {
      posts,
      fetching,
      loading,
    } = this.state;

    if (posts.length === 0) {
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.container, styles.empty]}
        >
          <Text font="noto-sans-bold" style={styles.emptyText}>投稿はありません</Text>
        </ScrollView>
      );
    }
    return (
      <View style={styles.container} testID="Home">
        <FlatList
          data={posts}
          keyExtractor={item => item.key}
          renderItem={({ item, index, viewableItemIndices }) => (
            <Item
              {...item}
              visible={viewableItemIndices.indexOf(index) > -1}
              onUserPress={this.onUserPress}
              onMorePress={this.onMorePress}
              onLikePress={this.onLikePress}
              onLinkPress={this.onLinkPress}
            />
          )}
          ListFooterComponent={() => (loading ? <View style={styles.loading}><ActivityIndicator size="small" /></View> : null)}
        />
      </View>
    );
  }
}
