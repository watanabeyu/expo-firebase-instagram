import { createStackNavigator } from 'react-navigation';

/* screen */
import MainTabNavigator from 'app/src/navigation/MainTabNavigator';
import UserScreen from 'app/src/screens/UserScreen';
import TagScreen from 'app/src/screens/TagScreen';
import PostScreen from 'app/src/screens/PostScreen';
import TakeScreen from 'app/src/screens/TakeScreen';
import TakePublishScreen from 'app/src/screens/TakePublishScreen';

/* from app */
import IconButton from 'app/src/components/IconButton';

const TakeStack = createStackNavigator(
  {
    Take: { screen: TakeScreen },
    TakePublish: { screen: TakePublishScreen },
  },
  {
    headerMode: 'screen',
  },
);

const CardNavigator = createStackNavigator(
  {
    Main: { screen: MainTabNavigator, navigationOptions: { header: null } },
    User: { screen: UserScreen },
    Tag: { screen: TagScreen },
    Post: { screen: PostScreen },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        color: '#333',
      },
      headerLeft: IconButton,
    }),
  },
);

const AppNavigator = createStackNavigator(
  {
    MainStack: {
      screen: CardNavigator,
      navigationOptions: {
        header: null,
      },
    },
    TakeModal: {
      screen: TakeStack,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: () => ({
      headerTitleStyle: {
        color: '#333',
      },
    }),
  },
);

export default AppNavigator;
