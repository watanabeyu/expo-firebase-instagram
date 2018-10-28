import React from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Notifications, Video } from 'expo';

/* node_modules */
import { Image } from 'react-native-expo-image-cache';

/* from app */
import Avatar from 'app/src/components/Avatar';
import FlatList from 'app/src/components/FlatList';
import Text from 'app/src/components/Text';
import styles from './styles';

export default class NotificationScreen extends React.Component {
  static navigationOptions = () => ({
    headerTitle: '通知',
  })

  constructor(props) {
    super(props);

    this.state = {
      notifications: [
        {
          post: {
            type: 'photo',
            fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post1',
          },
          from: {
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
            name: 'User1',
          },
        },
        {
          post: {
            type: 'photo',
            fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post2',
          },
          from: {
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
            name: 'User1',
          },
        },
        {
          post: {
            type: 'photo',
            fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post3',
          },
          from: {
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
            name: 'User1',
          },
        },
      ],
      cursor: null,
      fetching: false,
      loading: false,
    };
  }

  onUserPress = (item) => {
    const { navigation } = this.props;

    navigation.push('User', { uid: item.from.uid });
  }

  onFilePress = (item) => {
    const { navigation } = this.props;

    navigation.push('Post', { pid: item.post.pid });
  }

  render() {
    const {
      notifications,
      fetching,
      loading,
    } = this.state;

    if (notifications.length === 0) {
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.container, styles.empty]}
        >
          <Text font="noto-sans-bold" style={styles.emptyText}>通知はありません</Text>
        </ScrollView>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <TouchableHighlight style={styles.rowContainer} underlayColor="rgba(0,0,0,0.1)" onPress={() => this.onFilePress(item)}>
              <View style={styles.row}>
                <TouchableOpacity style={styles.avatar} onPress={() => this.onUserPress(item)}>
                  <Avatar uri={item.from.img} />
                </TouchableOpacity>
                <Text style={styles.message}>{item.from.name}がいいねしました</Text>
                <TouchableOpacity onPress={() => this.onFilePress(item)}>
                  {item.post.type === 'photo' && <Image uri={item.post.fileUri} style={styles.file} resizeMode="cover" />}
                  {item.post.type === 'movie' && (
                    <Video
                      source={{ uri: item.post.fileUri }}
                      resizeMode="cover"
                      shouldPlay
                      isLooping
                      style={styles.file}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableHighlight>
          )}
          ListFooterComponent={() => (loading ? <View style={styles.loading}><ActivityIndicator size="small" /></View> : null)}
        />
      </View>
    );
  }
}
