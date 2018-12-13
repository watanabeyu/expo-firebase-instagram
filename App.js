import React from 'react';
import {
  AppLoading,
  Constants,
  Asset,
  Font,
} from 'expo';
/* from app */
import fonts from 'app/src/fonts';
import images from 'app/src/images';
import firebase from 'app/src/firebase';
import Navigation from 'app/src';
import Analytics from 'app/src/analytics';

export default class App extends React.Component {
  static defaultProps = {
    skipLoadingScreen: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
    };
  }

  loadResourcesAsync = async () => {
    await firebase.init();

    /* asset */
    await Asset.loadAsync(Object.keys(images).map(key => images[key]));

    /* font */
    await Font.loadAsync(fonts);

    /* analytics */
    Analytics.init(Constants.deviceId);

    return true;
  }

  render() {
    const { isLoadingComplete } = this.state;
    const { skipLoadingScreen } = this.props;

    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={error => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      );
    }
    return (
      <Navigation />
    );
  }
}
