import {StyleSheet} from 'react-native';
import {Theme} from '../../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 20,
      backgroundColor: '#FFFFFF',
      shadowColor: '#8B5CF6',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
    },
    cardInner: {
      borderRadius: 20,
      overflow: 'hidden',
    },
    cardContent: {
      padding: 20,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    modelInfoContainer: {
      flex: 1,
      paddingRight: 12,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    modelName: {
      fontSize: 20,
      color: '#1F2937',
      fontFamily: 'Inter-SemiBold',
      letterSpacing: -0.5,
      marginBottom: 4,
    },
    modelStats: {
      fontSize: 15,
      color: '#6B7280',
      fontFamily: 'Inter-Regular',
      marginBottom: 12,
      letterSpacing: 0.2,
    },
    // 修改 styles.ts 中的相关样式
    skillsLabel: {
      fontSize: 15,
      color: '#8B5CF6', // 主紫色
      fontFamily: 'Inter-Medium',
      marginRight: 8, // 添加右边距
    },

    skillsContainer: {  // 新增
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },

    skillsText: {
      flex: 1,  // 让文字占据剩余空间
      fontSize: 15,
      color: '#4B5563',
      fontFamily: 'Inter-Regular',
      lineHeight: 20,
    },
    warningContainer: {
      marginTop: 12,
      backgroundColor: '#FEF2F2',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#FCA5A5',
    },
    warningContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
    },
    warningIcon: {
      marginRight: 8,
      margin: 0,
    },
    warningText: {
      flex: 1,
      fontSize: 14,
      color: '#EF4444',
      fontFamily: 'Inter-Medium',
    },
    progressBar: {
      marginTop: 16,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#F3F4F6',
    },
    downloadSpeed: {
      fontSize: 13,
      color: '#6B7280',
      marginTop: 8,
      textAlign: 'right',
      fontFamily: 'Inter-Regular',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#F9FAFB',
      gap: 8,
    },
    actionButton: {
      borderRadius: 12,
      minWidth: 88,
    },
    actionButtonContent: {
      height: 40,
    },
    settingsButton: {
      backgroundColor: '#F3F4F6',
    },
    loadingContainer: {
      padding: 16,
      alignItems: 'center',
    },
    deleteButton: {
      backgroundColor: '#FEE2E2',
    },
    deleteButtonLabel: {
      color: '#EF4444',
    },
    gradientHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      opacity: 0.05,
    },
    downloadActions: {
      flexDirection: 'row',
      gap: 8,
    },
    storageErrorText: {
      color: theme.colors.error,
      marginHorizontal: 16,
      marginTop: 8,
    },
    hfButton: {
      margin: 0,
      marginLeft: -4,
    },
  });