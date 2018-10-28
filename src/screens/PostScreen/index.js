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
import firebase from 'app/src/firebase';
import styles from './styles';

export default class PostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('title', '読み込み中'),
  })

  constructor(props) {
    super(props);

    this.state = {
      liked: false,
      error: false,
      fetching: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;

    this.setState({ fetching: true });

    const response = await firebase.getPost(navigation.getParam('pid', 0));

    if (!response.error) {
      this.setState({ ...response });
      navigation.setParams({ title: '投稿' });
    } else {
      this.setState({ error: true });
      navigation.setParams({ title: '投稿が見つかりません。' });
    }

    this.setState({ fetching: false });
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
    const response = await firebase.likePost(item);
    if (!response.error) {
      this.setState({
        liked: response,
      });
    }
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
          {...this.state}
          onUserPress={this.onUserPress}
          onMorePress={this.onMorePress}
          onLikePress={this.onLikePress}
          onLinkPress={this.onLinkPress}
        />
      </ScrollView>
    );
  }
}
