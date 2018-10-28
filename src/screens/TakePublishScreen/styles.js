import { StyleSheet } from 'react-native';
import { Constants } from 'expo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.manifest.extra.backgroundColor,
  },
  row: {
    flexDirection: 'row',
    padding: 8,
  },
  photo: {
    width: 100,
    height: 100,
  },
  textInput: {
    padding: 8,
    flex: 1,
    fontFamily: 'noto-sans-regular',
    fontSize: 16,
    maxHeight: 16 * 8,
  },
});

export default styles;
