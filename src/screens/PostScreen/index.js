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
import GA from 'app/src/analytics';
import I18n from 'app/src/i18n';
import styles from './styles';

export default class PostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('title', I18n.t('Post.loading')),
  })

  constructor(props) {
    super(props);

    this.state = {
      liked: false,
      error: false,
      fetching: false,
    };

    const { navigation } = this.props;

    GA.ScreenHit(`Post/${navigation.getParam('pid', 0)}`);
  }

  async componentDidMount() {
    const { navigation } = this.props;

    this.setState({ fetching: true });

    const response = await firebase.getPost(navigation.getParam('pid', 0));

    if (!response.error) {
      this.setState({ ...response });
      navigation.setParams({ title: I18n.t(`Post.${response.type}`) });
    } else {
      this.setState({ error: true });
      navigation.setParams({ title: I18n.t('Post.noPost') });
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
          <Text font="noto-sans-bold" style={styles.emptyText}>{I18n.t('Post.loading')}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.cjontainer, styles.empty]}>
          <Text font="noto-sans-bold" style={styles.emptyText}>{I18n.t('Post.noPost')}</Text>
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
