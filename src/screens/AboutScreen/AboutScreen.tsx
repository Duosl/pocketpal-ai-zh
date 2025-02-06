import React from 'react';
import {ScrollView, View, Linking, StyleSheet} from 'react-native';
import {Text, Card, Avatar, useTheme, List, Button, Divider} from 'react-native-paper';
import packageInfo from '../../../package.json';

const AboutScreen = () => {
  const theme = useTheme();

  const COMMUNITY_URL = 'https://langgptai.feishu.cn/wiki/RXdbwRyASiShtDky381ciwFEnpe';
  const UPDATE_URL = 'https://yzliu-generic.pkg.coding.net/pocketai/android/PocketAI-by-LangGPT.apk?version=latest';

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Error opening link:', err));
  };

  const formatReleaseDate = (dateStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}年${parseInt(month)}月${parseInt(day)}日`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* App Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Avatar.Icon
              size={72}
              icon="robot"
              style={{backgroundColor: theme.colors.primary}}
            />
            <View style={styles.titleContainer}>
              <Text variant="headlineMedium" style={styles.title}>
                口袋AI
              </Text>
              <Text variant="bodyMedium" style={styles.slogan}>
                将世界知识装进口袋
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Update Card - 高亮显示更新相关信息 */}
      <Card style={[styles.card, {backgroundColor: theme.colors.primaryContainer}]}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.updateTitle}>
            当前版本
          </Text>
          <Text variant="bodyMedium" style={styles.versionInfo}>
            版本号：{packageInfo.version}
          </Text>
          <Text variant="bodyMedium" style={styles.versionInfo}>
            发布日期：{formatReleaseDate(packageInfo.date)}
          </Text>
          <View style={styles.updateNotes}>
            <Text variant="bodyMedium" style={styles.updateItem}>• 新增 Deepseek R1 模型支持</Text>
            <Text variant="bodyMedium" style={styles.updateItem}>• 优化中文对话体验</Text>
            <Text variant="bodyMedium" style={styles.updateItem}>• 性能提升与界面优化</Text>
          </View>
        </Card.Content>
      </Card>

      {/* 关注公众号 */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            关注获取更新
          </Text>
          <List.Item
            title="微信公众号「云中江树」"
            description="获取最新版本和使用教程"
            left={props => <List.Icon {...props} icon="wechat" color={theme.colors.primary} />}
            style={styles.listItem}
          />
        <Button
          mode="contained"
          onPress={() => openLink(UPDATE_URL)}
          style={styles.updateButton}
          icon="download">
          获取最新版本
        </Button>
        </Card.Content>
      </Card>

      {/* 联系方式 */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            联系与支持
          </Text>
          <List.Item
            title="微信"
            description="1796060717"
            left={props => <List.Icon {...props} icon="account" />}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="GitHub"
            description="langgptai"
            left={props => <List.Icon {...props} icon="github" />}
            onPress={() => openLink('https://github.com/langgptai')}
          />
          <List.Item
            title="邮箱反馈"
            description="ethereal_ai@hotmail.com"
            left={props => <List.Icon {...props} icon="email" />}
            onPress={() => openLink('mailto:ethereal_ai@hotmail.com')}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  titleContainer: {
    marginLeft: 16,
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  slogan: {
    marginTop: 4,
    opacity: 0.7,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  updateTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a237e',
  },
  versionInfo: {
    marginBottom: 4,
    opacity: 0.8,
  },
  updateNotes: {
    marginVertical: 12,
    paddingLeft: 8,
  },
  updateItem: {
    marginBottom: 6,
    lineHeight: 20,
  },
  updateButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  listItem: {
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 8,
  },
});

export default AboutScreen;