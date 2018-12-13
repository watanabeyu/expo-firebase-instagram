import React from 'react';
import {
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';

/* from app */
import FlatList from 'app/src/components/FlatList';
import Text from 'app/src/components/Text';
import firebase from 'app/src/firebase';
import GA from 'app/src/analytics';
import I18n from 'app/src/i18n';
import styles from './styles';

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      keyword: null,
      tags: [],
      searching: false,
    };

    GA.ScreenHit('Search');
  }

  getTags = async () => {
    const { keyword } = this.state;

    const response = await firebase.getTags(keyword.replace(/^#/, ''));

    if (!response.error) {
      this.setState({
        tags: response,
      });
    }
  }

  onChangeText = (text) => {
    clearTimeout(this.interval);

    this.setState({ keyword: text.replace(/^#/, ''), searching: true });

    this.interval = setTimeout(async () => {
      this.setState({ searching: false });
      await this.getTags();
    }, 1500);
  }

  onRowPress = (item) => {
    const { navigation } = this.props;
    navigation.push('Tag', { tag: `#${item.name}` });
  }

  render() {
    const {
      keyword,
      tags,
      searching,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={tags}
            keyExtractor={item => item.key}
            ListHeaderComponent={(
              <View style={styles.header}>
                <TextInput
                  style={styles.search}
                  value={keyword}
                  placeholder={I18n.t('Search.placeholder')}
                  underlineColorAndroid="transparent"
                  onChangeText={this.onChangeText}
                  clearButtonMode="while-editing"
                />
              </View>
            )}
            renderItem={({ item }) => {
              if (searching) {
                return null;
              }

              return (
                <TouchableHighlight underlayColor="rgba(0,0,0,0.1)" style={styles.row} onPress={() => this.onRowPress(item)}>
                  <Text font="noto-sans-medium" style={styles.rowText}>#{item.name}</Text>
                </TouchableHighlight>
              );
            }}
            ListFooterComponent={() => ((searching && keyword) ? <Text font="noto-sans-medium" style={styles.searching}>#{keyword}{I18n.t('Search.searching')}</Text> : null)}
          />
        </View>
      </SafeAreaView>
    );
  }
}
