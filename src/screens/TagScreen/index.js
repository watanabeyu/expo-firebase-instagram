import React from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Video } from 'expo';

/* node_modules */
import { Image } from 'react-native-expo-image-cache';

/* from app */
import FlatList from 'app/src/components/FlatList';
import Text from 'app/src/components/Text';
import firebase from 'app/src/firebase';
import GA from 'app/src/analytics';
import I18n from 'app/src/i18n';
import styles from './styles';

export default class UserScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('tag', null),
  })

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const tag = navigation.getParam('tag', null);

    this.state = {
      tag,
      posts: [],
      cursor: null,
      fetching: false,
      loading: false,
    };

    GA.ScreenHit(`Tag/${tag}`);
  }

  async componentDidMount() {
    await this.getTagPosts();
  }

  onThumbnailPress = (item) => {
    const { navigation } = this.props;

    navigation.push('Post', { pid: item.pid });
  }

  getTagPosts = async (cursor = null) => {
    const { tag } = this.state;

    this.setState({ fetching: true });

    const response = await firebase.getThumbnails({ tag }, cursor);

    if (!response.error) {
      const { posts } = this.state;

      this.setState({
        posts: cursor ? posts.concat(response.data) : response.data,
        cursor: response.cursor,
      });
    }

    this.setState({ fetching: false });
  }

  onRefresh = async () => {
    this.setState({ cursor: null });

    await this.getTagPosts();
  }

  onEndReached = async () => {
    const { cursor, loading } = this.state;

    if (!loading && cursor) {
      this.setState({ loading: true });
      await this.getTagPosts(cursor);
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      tag,
      posts,
      fetching,
      loading,
    } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.thumbnails}
          numColumns={3}
          data={posts}
          keyExtractor={item => item.key}
          refreshControl={(
            <RefreshControl
              refreshing={fetching}
              onRefresh={this.onRefresh}
            />
          )}
          onEndReachedThreshold={0.1}
          onEndReached={this.onEndReached}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text font="noto-sans-medium" style={styles.name}>{`${tag}${I18n.t('Tag.text')}`}</Text>
            </View>
          )}
          renderItem={({ item, index, viewableItemIndices }) => {
            if (viewableItemIndices.indexOf(index) === -1) {
              return <View style={styles.file} />;
            }

            return (
              <TouchableOpacity onPress={() => this.onThumbnailPress(item)}>
                {item.type === 'photo' && <Image uri={item.thumbnail} style={styles.file} />}
                {item.type === 'movie' && (
                  <Video
                    source={{ uri: item.thumbnail }}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.file}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={() => (loading ? <View style={styles.loading}><ActivityIndicator size="small" /></View> : null)}
        />
      </View>
    );
  }
}
