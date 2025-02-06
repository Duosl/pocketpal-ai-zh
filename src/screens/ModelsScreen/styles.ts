// styles.ts
import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 80, // 为 FAB 腾出空间
    },
    headerTitle: {
      ...theme.fonts.titleMedium,
      color: theme.colors.onBackground,
    },
    headerSubtitle: {
      ...theme.fonts.bodySmall,
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      ...theme.fonts.titleSmall,
      color: theme.colors.onBackground,
      marginBottom: 8,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: 8,
      elevation: 1,
      overflow: 'hidden',
    },
    activeCard: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    cardContent: {
      padding: 16,
    },
    modelName: {
      ...theme.fonts.titleMedium,
      color: theme.colors.onSurface,
    },
    modelDescription: {
      ...theme.fonts.bodyMedium,
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    modelStats: {
      flexDirection: 'row',
      marginTop: 8,
      alignItems: 'center',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    statText: {
      ...theme.fonts.labelSmall,
      color: theme.colors.onSurfaceVariant,
      marginLeft: 4,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.outlineVariant,
      marginVertical: 8,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    fabContainer: {
      position: 'absolute',
      right: 16,
      bottom: 16,
    },
  });