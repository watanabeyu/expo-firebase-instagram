import AppNavigator from 'app/src/navigation/AppNavigator';

const initialState = null;

export default (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);

  return nextState || state;
};
