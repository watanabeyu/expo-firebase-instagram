import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
  takeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeTabRounded: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 2,
    marginTop: Platform.OS === 'ios' ? 0 : 2,
  },
  takeTabIcon: {
    marginLeft: Platform.OS === 'ios' ? 1 : 0,
    marginTop: Platform.OS === 'ios' ? 1 : 0,
  },
});

export default styles;
