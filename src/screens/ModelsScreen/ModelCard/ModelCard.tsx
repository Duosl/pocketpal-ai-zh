import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Linking, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {
  Card,
  ProgressBar,
  Button,
  IconButton,
  Text,
  TouchableRipple,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';

import {Dialog, Divider} from '../../../components';
import {useTheme, useMemoryCheck, useStorageCheck} from '../../../hooks';
import {createStyles} from './styles';
import {ModelSettings} from '../ModelSettings';
import {uiStore, modelStore} from '../../../store';
import {chatTemplates} from '../../../utils/chat';
import {Model, ModelOrigin, RootDrawerParamList} from '../../../utils/types';
import {
  getModelDescription,
  L10nContext,
  checkModelFileIntegrity,
} from '../../../utils';
import {
  COMPLETION_PARAMS_METADATA,
  validateCompletionSettings,
} from '../../../utils/modelSettings';

type ChatScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

interface ModelCardProps {
  model: Model;
  activeModelId?: string;
  onFocus?: () => void;
}

export const ModelCard: React.FC<ModelCardProps> = observer(
  ({model, activeModelId, onFocus}) => {
    const l10n = React.useContext(L10nContext);
    const theme = useTheme();
    const styles = createStyles(theme);
    const navigation = useNavigation<ChatScreenNavigationProp>();

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [integrityError, setIntegrityError] = useState<string | null>(null);

    const {memoryWarning, shortMemoryWarning} = useMemoryCheck(model);
    const {isOk: storageOk, message: storageNOkMessage} = useStorageCheck(model);

    const isActiveModel = activeModelId === model.id;
    const isDownloaded = model.isDownloaded;
    const isDownloading = modelStore.isDownloading(model.id);
    const isHfModel = model.origin === ModelOrigin.HF;

    // temporary settings
    const [tempChatTemplate, setTempChatTemplate] = useState(model.chatTemplate);
    const [tempCompletionSettings, setTempCompletionSettings] = useState(
      model.completionSettings,
    );
    useEffect(() => {
      setTempChatTemplate(model.chatTemplate);
      setTempCompletionSettings(model.completionSettings);
    }, [model]);

    useEffect(() => {
      if (isDownloaded) {
        checkModelFileIntegrity(model, modelStore).then(({errorMessage}) => {
          setIntegrityError(errorMessage);
        });
      } else {
        setIntegrityError(null);
      }
    }, [isDownloaded, model]);

    const handleSettingsUpdate = useCallback((name: string, value: any) => {
      setTempChatTemplate(prev => {
        const newTemplate =
          name === 'name' ? chatTemplates[value] : {...prev, [name]: value};
        return newTemplate;
      });
    }, []);

    const handleCompletionSettingsUpdate = useCallback(
      (name: string, value: any) => {
        setTempCompletionSettings(prev => ({
          ...prev,
          [name]: value,
        }));
      },
      [],
    );

    const handleOpenSettings = useCallback(() => {
      setSettingsModalVisible(true);
    }, []);

    const handleCloseSettings = useCallback(() => {
      setSettingsModalVisible(false);
    }, []);

    const handleSaveSettings = useCallback(() => {
      const processedSettings = Object.entries(tempCompletionSettings).reduce(
        (acc, [key, value]) => {
          const metadata = COMPLETION_PARAMS_METADATA[key];
          if (metadata?.validation.type === 'numeric') {
            let numValue: number;
            if (typeof value === 'string') {
              numValue = Number(value);
            } else if (typeof value === 'number') {
              numValue = value;
            } else {
              acc.errors[key] = 'Must be a valid number';
              return acc;
            }

            if (Number.isNaN(numValue)) {
              acc.errors[key] = 'Must be a valid number';
            } else {
              acc.settings[key] = numValue;
            }
          } else {
            acc.settings[key] = value;
          }
          return acc;
        },
        {settings: {}, errors: {}} as {
          settings: typeof tempCompletionSettings;
          errors: Record<string, string>;
        },
      );

      const validationResult = validateCompletionSettings(
        processedSettings.settings,
      );
      const allErrors = {
        ...processedSettings.errors,
        ...validationResult.errors,
      };

      if (Object.keys(allErrors).length > 0) {
        Alert.alert(
          'Invalid Values',
          'Please correct the following:\n' +
            Object.entries(allErrors)
              .map(([key, msg]) => `• ${key}: ${msg}`)
              .join('\n'),
          [{text: 'OK'}],
        );
        return;
      }

      modelStore.updateModelChatTemplate(model.id, tempChatTemplate);
      modelStore.updateCompletionSettings(model.id, processedSettings.settings);
      handleCloseSettings();
    }, [model.id, tempChatTemplate, tempCompletionSettings, handleCloseSettings]);

    const handleDelete = useCallback(() => {
      if (model.isDownloaded) {
        Alert.alert('Delete Model', 'Are you sure you want to delete this model?', [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await modelStore.deleteModel(model);
            },
          },
        ]);
      }
    }, [model]);

    const handleLoadModel = useCallback(async () => {
      if (isActiveModel) {
        modelStore.manualReleaseContext();
      } else {
        try {
          // 先检查文件完整性
          const {errorMessage} = await checkModelFileIntegrity(model, modelStore);

          if (errorMessage) {
            // 如果检查到文件不完整，弹出提示
            Alert.alert(
              '模型文件不完整',
              '检测到模型文件可能不完整或已损坏，请删除后重新下载。',
              [
                {
                  text: '重新下载',
                  onPress: async () => {
                    await modelStore.deleteModel(model);
                    modelStore.checkSpaceAndDownload(model.id);
                  },
                },
                {
                  text: '取消',
                  style: 'cancel',
                },
              ],
            );
            return;
          }

          // 文件完整性检查通过，继续加载模型
          await modelStore.initContext(model);
          if (uiStore.autoNavigatetoChat) {
            navigation.navigate('Chat');
          }
        } catch (e) {
          console.log(`Error: ${e}`);
          // 可以添加错误提示
          Alert.alert(
            '加载失败',
            '模型加载过程中发生错误，请重试。',
            [{text: '确定'}],
          );
        }
      }
    }, [isActiveModel, model, navigation]);

    const dialogActions = [
      {
        label: 'Reset',
        onPress: () => {
          modelStore.resetModelChatTemplate(model.id);
          modelStore.resetCompletionSettings(model.id);
          setTempChatTemplate(model.chatTemplate);
          setTempCompletionSettings(model.completionSettings);
        },
      },
      {
        label: 'Cancel',
        onPress: handleCloseSettings,
      },
      {
        label: 'Save Changes',
        onPress: handleSaveSettings,
        mode: 'contained' as const,
      },
    ];

    // 添加格式化函数
    const formatModelStats = (size: number, params: number) => {
      // 转换字节到 GB
      const sizeInGB = (size / (1000 * 1000 * 1000)).toFixed(2);

      // 转换参数到十亿
      const paramsInB = (params / 1000000000).toFixed(1);

      return `大小：${sizeInGB} GB  |  参数量：${paramsInB}B`;
    };

    return (
          <>
            <Card
              style={[
                styles.card,
                isActiveModel && {borderColor: theme.colors.primary}
              ]}>
              <View style={[
                styles.gradientHeader,
                {backgroundColor: isActiveModel ? theme.colors.primary : theme.colors.surfaceVariant}
              ]} />

              <View style={styles.cardInner}>
                <View style={styles.cardContent}>
                  {/* Model Title & Info */}
                  <View style={styles.headerRow}>
                    <View style={styles.modelInfoContainer}>
                      <Text style={styles.modelName}>{model.name}</Text>
                      <Text style={styles.modelStats}>
                        {formatModelStats(model.size, model.params)}
                      </Text>
                      <View style={styles.skillsContainer}>
                        <Text style={styles.skillsLabel}>介绍：</Text>
                        <Text style={styles.skillsText}>{model.description}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Warning Messages */}
                  {shortMemoryWarning && (
                    <View style={styles.warningContainer}>
                      <View style={styles.warningContent}>
                        <IconButton
                          icon="alert-circle"
                          size={20}
                          iconColor={theme.colors.error}
                          style={styles.warningIcon}
                        />
                        <Text style={styles.warningText}>{shortMemoryWarning}</Text>
                      </View>
                    </View>
                  )}

                  {/* Download Progress */}
                  {isDownloading && (
                    <>
                      <ProgressBar
                        progress={modelStore.getDownloadProgress(model.id)}
                        color={theme.colors.primary}
                        style={styles.progressBar}
                      />
                      <Text style={styles.downloadSpeed}>{model.downloadSpeed}</Text>
                    </>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                  {isDownloaded ? (
                    <>
                      <Button
                        mode="outlined"
                        icon="delete"
                        onPress={handleDelete}
                        style={[styles.actionButton, styles.deleteButton]}
                        labelStyle={styles.deleteButtonLabel}
                        contentStyle={styles.actionButtonContent}>
                        删除
                      </Button>

                      <Button
                        mode="outlined"
                        icon="tune"
                        onPress={handleOpenSettings}
                        style={[styles.actionButton, styles.settingsButton]}
                        contentStyle={styles.actionButtonContent}>
                        设置
                      </Button>

                      {modelStore.isContextLoading &&
                       modelStore.loadingModel?.id === model.id ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator
                            animating={true}
                            color={theme.colors.primary}
                            size={24}
                          />
                        </View>
                      ) : (
                        <Button
                          mode="contained"
                          icon={isActiveModel ? "stop" : "play"}
                          onPress={handleLoadModel}
                          style={styles.actionButton}
                          contentStyle={styles.actionButtonContent}>
                          {isActiveModel ? "停止" : "加载"}
                        </Button>
                      )}
                    </>
                  ) : isDownloading ? (
                    <Button
                      mode="outlined"
                      icon="close"
                      onPress={() => modelStore.cancelDownload(model.id)}
                      style={[styles.actionButton, styles.deleteButton]}
                      labelStyle={styles.deleteButtonLabel}
                      contentStyle={styles.actionButtonContent}>
                      取消
                    </Button>
                  ) : (
                    <>
                      {!storageOk && (
                        <Text style={styles.storageErrorText}>
                          {storageNOkMessage}
                        </Text>
                      )}
                      <View style={styles.downloadActions}>
                        {isHfModel && (
                          <Button
                            mode="outlined"
                            icon="delete-outline"
                            onPress={() => modelStore.removeModelFromList(model)}
                            style={[styles.actionButton, styles.deleteButton]}
                            labelStyle={styles.deleteButtonLabel}
                            contentStyle={styles.actionButtonContent}>
                            移除
                          </Button>
                        )}
                        {storageOk && (
                          <Button
                            mode="contained"
                            icon="download"
                            onPress={() => modelStore.checkSpaceAndDownload(model.id)}
                            style={styles.actionButton}
                            contentStyle={styles.actionButtonContent}>
                            下载
                          </Button>
                        )}
                      </View>
                    </>
                  )}
                </View>
              </View>
            </Card>

            {/* Settings Modal */}
            <Dialog
              dismissable={false}
              visible={settingsModalVisible}
              onDismiss={handleCloseSettings}
              title="模型设置"
              scrollable
              avoidKeyboard
              actions={dialogActions}>
              <ModelSettings
                chatTemplate={tempChatTemplate}
                completionSettings={tempCompletionSettings}
                onChange={handleSettingsUpdate}
                onCompletionSettingsChange={handleCompletionSettingsUpdate}
                onFocus={onFocus}
              />
            </Dialog>

            {/* Warning Snackbar */}
            <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={Snackbar.DURATION_MEDIUM}
              action={{
                label: l10n.dismiss,
                onPress: () => setSnackbarVisible(false),
              }}>
              {memoryWarning}
            </Snackbar>
          </>
        );
      },
    );