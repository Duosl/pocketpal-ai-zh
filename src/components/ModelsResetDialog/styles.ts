import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    dialog: {
      borderRadius: 16,
      backgroundColor: theme.colors.elevation.level1,
    },
    title: {
      fontSize: 20,
      color: theme.colors.onSurface,
      textAlign: 'center',
      marginBottom: 8,
      ...theme.fonts.titleLarge,
    },
    contentWrapper: {
      paddingVertical: 8,
    },
    mainText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 16,
      ...theme.fonts.bodyLarge,
    },
    settingsList: {
      marginLeft: 16,
      marginBottom: 24,
    },
    settingsItem: {
      fontSize: 15,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
      ...theme.fonts.bodyMedium,
    },
    noticeContainer: {
      backgroundColor: theme.colors.elevation.level3,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
    },
    noticeTitle: {
      fontSize: 15,
      color: theme.colors.onSurface,
      marginBottom: 12,
      ...theme.fonts.labelLarge,
    },
    noticeItem: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
      ...theme.fonts.bodyMedium,
    },
    highlight: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    actions: {
      paddingHorizontal: 16,
      paddingBottom: 8,
      justifyContent: 'space-between',
    },
    cancelButton: {
      marginRight: 12,
      borderColor: theme.colors.outline,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonLabel: {
      fontSize: 15,
      ...theme.fonts.labelLarge,
    },
  });

export const styles = createStyles({
  colors: {
    primary: '#8B5CF6',
    onSurface: '#1F2937',
    onSurfaceVariant: '#4B5563',
    elevation: {
      level1: '#FFFFFF',
      level3: '#F3F4F6',
    },
    outline: '#E5E7EB',
  },
  fonts: {
    titleLarge: {
      fontWeight: '600',
    },
    labelLarge: {
      fontWeight: '500',
    },
    bodyLarge: {
      fontWeight: '400',
    },
    bodyMedium: {
      fontWeight: '400',
    },
  },
});