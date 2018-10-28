import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  file: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  buttons: {
    padding: 12,
    paddingBottom: 4,
  },
  icon: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  text: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  time: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    color: '#999',
  },
});

export default styles;
