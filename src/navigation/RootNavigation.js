
import React from 'react';
import { BackHandler, Alert } from 'react-native';
import { Permissions, Notifications } from 'expo';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';

/* from app */
import AppNavigator from 'app/src/navigation/AppNavigator';
import firebase from 'app/src/firebase';
import I18n from 'app/src/i18n';

const App = reduxifyNavigator(AppNavigator, 'root');

@connect(state => ({
  nav: state.nav,
}))
export default class AppWithNavigationState extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

    const me = await firebase.getUser();

    const { dispatch } = this.props;
    dispatch({ type: 'ME_SET', payload: me });
    this.setState({ loading: false });

    await this.getDeviceToken();

    Notifications.addListener(this.subscribeNotification);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  getDeviceToken = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      // パーミッションダイアログを表示します
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    const deviceToken = await Notifications.getExpoPushTokenAsync();
    if (deviceToken) {
      firebase.updateUserToken(deviceToken);
    }
  }

  subscribeNotification = (notification) => {
    const { dispatch } = this.props;
    const { data = {} } = notification;
    const { screen = null } = data;

    if (notification.origin === 'selected') {
      if (screen) {
        dispatch(NavigationActions.navigate({ routeName: screen }));
      }
    } else if (notification.origin === 'received') {
      Alert.alert(
        I18n.t('Root.notification'),
        I18n.t('Root.message'),
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              if (screen) {
                dispatch(NavigationActions.navigate({ routeName: screen }));
              }
            },
          },
        ],
      );
    }
  }

  onBackPress = () => {
    const { nav, dispatch } = this.props;

    if (nav.routes[nav.index].index === 0) {
      return false;
    }

    dispatch(NavigationActions.back());

    return true;
  };

  render() {
    const { loading } = this.state;
    const { nav, dispatch } = this.props;

    if (loading) {
      return null;
    }

    return <App dispatch={dispatch} state={nav} />;
  }
}
