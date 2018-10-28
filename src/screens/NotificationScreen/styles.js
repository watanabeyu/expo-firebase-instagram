import { StyleSheet } from 'react-native';
import { Constants } from 'expo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.manifest.extra.backgroundColor,
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
  },
  rowContainer: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 12,
  },
  file: {
    width: 44,
    height: 44,
    marginLeft: 8,
  },
});

export default styles;
