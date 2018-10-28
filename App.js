import React from 'react';
import { View, Text } from 'react-native';
import {
  AppLoading,
  Asset,
  Font,
} from 'expo';
/* from app */
import fonts from 'app/src/fonts';
import images from 'app/src/images';
import AppNavigator from 'app/src/navigation/AppNavigator';

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
    /* asset */
    await Asset.loadAsync(Object.keys(images).map(key => images[key]));
    /* font */
    await Font.loadAsync(fonts);

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
      <AppNavigator />
    );
  }
}
