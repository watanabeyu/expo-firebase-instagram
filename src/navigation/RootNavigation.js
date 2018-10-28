
import React from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';

/* from app */
import AppNavigator from 'app/src/navigation/AppNavigator';

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
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
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
