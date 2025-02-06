import React, {useContext} from 'react';
import {observer} from 'mobx-react';
import {Portal, Dialog, Button, Text, Paragraph} from 'react-native-paper';
import {View} from 'react-native';
import {styles} from './styles';
import {L10nContext} from '../../utils';

type ModelsResetDialogProps = {
  testID?: string;
  visible: boolean;
  onDismiss: () => void;
  onReset: () => void;
};

export const ModelsResetDialog: React.FC<ModelsResetDialogProps> = observer(
  ({testID, visible, onDismiss, onReset}) => {
    const l10n = useContext(L10nContext);

    return (
      <Portal>
        <Dialog
          testID={testID}
          visible={visible}
          onDismiss={onDismiss}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.title}>重置模型设置</Dialog.Title>
          <Dialog.Content>
            <View style={styles.contentWrapper}>
              <Paragraph style={styles.mainText}>
                此操作将把模型设置恢复为默认配置，包括：
              </Paragraph>

              <View style={styles.settingsList}>
                <Text style={styles.settingsItem}>• 系统提示词</Text>
                <Text style={styles.settingsItem}>• 对话模板</Text>
                <Text style={styles.settingsItem}>• 温度参数</Text>
                <Text style={styles.settingsItem}>• 其他相关配置</Text>
              </View>

              <View style={styles.noticeContainer}>
                <Text style={styles.noticeTitle}>注意事项：</Text>
                <Text style={styles.noticeItem}>
                  ✓ 已下载的模型文件将<Text style={styles.highlight}>不会</Text>被删除
                </Text>
                <Text style={styles.noticeItem}>
                  ✓ "本地模型"配置将保持不变
                </Text>
              </View>
            </View>
          </Dialog.Content>

          <Dialog.Actions style={styles.actions}>
            <Button
              testID="cancel-reset-button"
              mode="outlined"
              onPress={onDismiss}
              style={styles.cancelButton}
              labelStyle={styles.buttonLabel}
            >
              取消
            </Button>
            <Button
              testID="proceed-reset-button"
              mode="contained"
              onPress={onReset}
              style={styles.confirmButton}
              labelStyle={styles.buttonLabel}
            >
              确认重置
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  },
);