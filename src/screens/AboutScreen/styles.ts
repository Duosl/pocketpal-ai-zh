import {StyleSheet} from 'react-native';
import {Theme} from 'react-native-paper';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    card: {
      marginBottom: 16,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    titleContainer: {
      marginLeft: 16,
    },
    title: {
      fontWeight: 'bold',
    },
    sectionContainer: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: 8,
    },
    text: {
      marginBottom: 4,
    },
    feature: {
      marginBottom: 4,
      lineHeight: 20,
    },
      copyrightContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
      },
      copyrightText: {
        opacity: 0.7,
        lineHeight: 20,
      },
  });