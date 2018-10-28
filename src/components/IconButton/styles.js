import { StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
  },
  icon: {
    color: Constants.manifest.extra.textColor,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Constants.manifest.primaryColor,
  },
  search: {
    paddingVertical: Platform.OS === 'ios' ? 6 : 10,
    paddingHorizontal: 12,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchActive: {
    paddingRight: 0,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(142,142,142,0.12)',
  },
  searchIcon: {
    color: '#9b9b9b',
    paddingLeft: 2,
    paddingRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Constants.manifest.extra.textColor,
  },
  searchClearIcon: {
    color: '#aaa',
  },
  searchCaneclButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  searchCaneclButtonText: {
    color: Constants.manifest.extra.textColor,
    fontWeight: 'bold',
  },
});

export default styles;
