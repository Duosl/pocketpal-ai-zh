// ModelsScreen.tsx
import React, {useState, useMemo, useContext, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  Platform,
  Alert,
  KeyboardAvoidingView,
  View,
} from 'react-native';

import {toJS} from 'mobx';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';
import {observer} from 'mobx-react-lite';
import * as RNFS from '@dr.pogodin/react-native-fs';
import DocumentPicker from 'react-native-document-picker';

import {useTheme} from '../../hooks';
import {FABGroup} from './FABGroup';
import {ModelCard} from './ModelCard';
import {createStyles} from './styles';
import {HFModelSearch} from './HFModelSearch';
import {ModelAccordion} from './ModelAccordion';

import {uiStore, modelStore, UIStore} from '../../store';
import {L10nContext} from '../../utils';
import {Model, ModelOrigin} from '../../utils/types';

// 扩展 GROUP_KEYS
const GROUP_KEYS = {
  ...UIStore.GROUP_KEYS,
  CURRENT_MODEL: 'CURRENT_MODEL',
  READY_TO_USE: 'READY_TO_USE',
  RECOMMENDED: 'RECOMMENDED',
};

// 默认模型 ID
const DEFAULT_MODEL_ID = 'unsloth/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf';

export const ModelsScreen: React.FC = observer(() => {
  const l10n = useContext(L10nContext);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hfSearchVisible, setHFSearchVisible] = useState(false);
  const [_, setTrigger] = useState<boolean>(false);
  const theme = useTheme();
  const styles = createStyles(theme);

  const filters = uiStore.pageStates.modelsScreen.filters;
  const expandedGroups = uiStore.pageStates.modelsScreen.expandedGroups;

  // 确保当前使用模型分组始终展开
  useEffect(() => {
    const initialExpandedGroups = {
      ...expandedGroups,
      [GROUP_KEYS.CURRENT_MODEL]: true,
    };
    uiStore.setValue('modelsScreen', 'expandedGroups', initialExpandedGroups);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await modelStore.refreshDownloadStatuses();
    setTrigger(prev => !prev);
    setRefreshing(false);
  };

  const handleAddLocalModel = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: Platform.OS === 'ios' ? 'public.data' : DocumentPicker.types.allFiles,
      });

      let [file] = res;
      if (file) {
        let fileName = file.name || file.uri.split('/').pop() || `file_${uuidv4()}`;
        const permanentDir = `${RNFS.DocumentDirectoryPath}/models/local`;
        let permanentPath = `${permanentDir}/${fileName}`;

        if (!(await RNFS.exists(permanentDir))) {
          await RNFS.mkdir(permanentDir);
        }

        if (await RNFS.exists(permanentPath)) {
          const choice = await new Promise<'replace' | 'keep' | 'cancel'>(resolve => {
            Alert.alert(
              l10n.fileAlreadyExists,
              l10n.fileAlreadyExistsMessage,
              [
                {
                  text: l10n.replace,
                  onPress: () => resolve('replace'),
                },
                {
                  text: l10n.keepBoth,
                  onPress: () => resolve('keep'),
                },
                {
                  text: l10n.cancel,
                  onPress: () => resolve('cancel'),
                  style: 'cancel',
                },
              ],
            );
          });

          switch (choice) {
            case 'replace':
              await RNFS.unlink(permanentPath);
              break;
            case 'keep':
              let counter = 1;
              const nameParts = fileName.split('.');
              const ext = nameParts.length > 1 ? nameParts.pop() : '';
              const name = nameParts.join('.');
              do {
                permanentPath = `${permanentDir}/${name}_${counter}.${ext}`;
                counter++;
              } while (await RNFS.exists(permanentPath));
              break;
            case 'cancel':
              return;
          }
        }

        await RNFS.copyFile(file.uri, permanentPath);
        await modelStore.addLocalModel(permanentPath);
        setTrigger(prev => !prev);
      }
    } catch (e) {
      console.log('No file picked or error:', e.message);
    }
  };

  const activeModelId = toJS(modelStore.activeModel?.id);
  const models = toJS(modelStore.models);

  const filteredAndSortedModels = useMemo(() => {
    let result = models;
    if (filters.includes('downloaded')) {
      result = result.filter(model => model.isDownloaded);
    }
    if (!filters.includes('grouped')) {
      result = result.sort((a, b) => {
        if (a.isDownloaded && !b.isDownloaded) return -1;
        if (!a.isDownloaded && b.isDownloaded) return 1;
        return 0;
      });
    }
    if (filters.includes('hf')) {
      result = result.filter(model => model.origin === ModelOrigin.HF);
    }
    return result;
  }, [models, filters]);

  const groupedModels = useMemo(() => {
    if (!filters.includes('grouped')) {
      const currentModel = models.find(m => m.id === activeModelId || m.id === DEFAULT_MODEL_ID);

      return {
        [GROUP_KEYS.CURRENT_MODEL]: currentModel ? [currentModel] : [],
        [GROUP_KEYS.READY_TO_USE]: filteredAndSortedModels.filter(
          model => model.isDownloaded && model.id !== currentModel?.id
        ),
        [GROUP_KEYS.RECOMMENDED]: filteredAndSortedModels.filter(
          model => !model.isDownloaded
        ),
      };
    }

    return filteredAndSortedModels.reduce((acc, item) => {
      const groupKey =
        item.origin === ModelOrigin.LOCAL || item.isLocal
          ? l10n.localModel
          : item.type || l10n.unknownGroup;

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, Model[]>);
  }, [filteredAndSortedModels, filters, activeModelId, models, l10n.localModel, l10n.unknownGroup]);

  const getGroupDisplayName = (key: string) => {
    switch (key) {
      case GROUP_KEYS.CURRENT_MODEL:
        return '当前使用模型';
      case GROUP_KEYS.READY_TO_USE:
        return '可立即使用';
      case GROUP_KEYS.RECOMMENDED:
        return '推荐下载';
      default:
        return key;
    }
  };

  const toggleGroup = (type: string) => {
    // 防止当前使用模型分组被折叠
    if (type === GROUP_KEYS.CURRENT_MODEL) {
      return;
    }

    const currentExpandedGroups = uiStore.pageStates.modelsScreen.expandedGroups;
    const updatedExpandedGroups = {
      ...currentExpandedGroups,
      [type]: !currentExpandedGroups[type],
      [GROUP_KEYS.CURRENT_MODEL]: true, // 确保当前使用模型分组保持展开
    };
    uiStore.setValue('modelsScreen', 'expandedGroups', updatedExpandedGroups);
  };

  const renderGroupHeader = ({item: group}) => {
    // 如果是当前使用模型分组,则强制展开
    const isExpanded = group.type === GROUP_KEYS.CURRENT_MODEL
      ? true
      : expandedGroups[group.type];

    const displayName = filters.includes('grouped')
      ? group.type
      : getGroupDisplayName(group.type);

    const description =
      !filters.includes('grouped') &&
      group.type === GROUP_KEYS.RECOMMENDED
        ? '点击 + 按钮可添加更多模型'
        : undefined;

    return (
      <ModelAccordion
        group={{...group, type: displayName}}
        expanded={isExpanded}
        description={description}
        onPress={group.type === GROUP_KEYS.CURRENT_MODEL ? undefined : () => toggleGroup(group.type)}>
        <FlatList
          data={group.items}
          keyExtractor={subItem => subItem.id}
          renderItem={({item: subItem}) => (
            <ModelCard
              model={subItem}
              activeModelId={activeModelId}
              onFocus={() => {}}
            />
          )}
        />
      </ModelAccordion>
    );
  };

  const flatListModels = Object.keys(groupedModels)
    .map(type => ({
      type,
      items: groupedModels[type],
    }))
    .filter(group => group.items.length > 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      style={styles.container}>
      <View style={styles.container}>
        <FlatList
          testID="flat-list"
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContainer}
          data={flatListModels}
          keyExtractor={item => item.type}
          extraData={activeModelId}
          renderItem={renderGroupHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />

        <HFModelSearch
          visible={hfSearchVisible}
          onDismiss={() => setHFSearchVisible(false)}
        />
        <FABGroup
          onAddHFModel={() => setHFSearchVisible(true)}
          onAddLocalModel={handleAddLocalModel}
        />
      </View>
    </KeyboardAvoidingView>
  );
});

export default ModelsScreen;