import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Keyboard,
  Alert,
  TextInput,
} from 'react-native';
import { Video } from 'expo';

/* from app */
import IconButton from 'app/src/components/IconButton';
import styles from './styles';

export default class TakePublishScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <IconButton name="ios-arrow-back" onPress={() => navigation.goBack()} />,
    headerTitle: '投稿する',
    headerRight: navigation.getParam('headerRight', null),
  })

  constructor(props) {
    super(props);

    const { navigation } = this.props;

    this.state = {
      mode: navigation.getParam('mode', 'photo'),
      photo: navigation.getParam('photo', {}),
      movie: navigation.getParam('movie', {}),
      text: '',
    };
  }

  componentDidMount() {
    const { photo = {}, movie = {} } = this.state;
    const { navigation } = this.props;

    if (!photo.uri && !movie.uri) {
      navigation.goBack();
    }

    navigation.setParams({
      headerRight: <IconButton name="ios-send" onPress={this.onPublish} />,
    });
  }

  onChangeText = (text) => {
    this.setState({ text });
  }

  onPublish = async () => {
    // ここに投稿の処理を書きます。
  }

  render() {
    const {
      mode,
      photo,
      movie,
      text,
    } = this.state;

    return (
      <ScrollView scrollEnabled={false} style={styles.container} contentContainerstyle={styles.container}>
        <View style={styles.row}>
          {mode === 'photo' && <Image source={{ uri: photo.uri }} style={styles.photo} />}
          {mode === 'movie' && (
            <Video
              source={{ uri: movie.uri }}
              style={styles.photo}
              resizeMode="cover"
              shouldPlay
              isLooping
            />
          )}
          <TextInput
            multiline
            style={styles.textInput}
            placeholder="テキストを入力してください"
            underlineColorAndroid="transparent"
            textAlignVertical="top"
            value={text}
            onChangeText={this.onChangeText}
          />
        </View>
      </ScrollView>
    );
  }
}
