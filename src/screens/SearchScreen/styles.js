import { StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.manifest.extra.backgroundColor,
  },
  header: {
    height: Platform.OS === 'ios' ? 44 : 56,
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 0 : 24,
  },
  search: {
    backgroundColor: '#efefef',
    fontSize: 16,
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 6 : 10,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    padding: 12,
  },
  rowText: {
    fontSize: 16,
  },
  searching: {
    padding: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default styles;
