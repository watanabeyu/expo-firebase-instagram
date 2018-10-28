import { StyleSheet, Dimensions } from 'react-native';
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
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  take: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 10,
    borderColor: '#ccc',
  },
  takeButtonRecording: {
    borderRadius: 4,
    width: 40,
    height: 40,
    borderWidth: 20,
    borderColor: '#f99',
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
  },
  tabText: {
    textAlign: 'center',
    color: '#999',
  },
  tabTextActive: {
    color: Constants.manifest.extra.textColor,
  },
});

export default styles;
