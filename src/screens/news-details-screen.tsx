/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import WebView from 'react-native-webview';

type NewsDetailsScreenRouteProp = RouteProp<RootStackParamList, 'NewsDetails'>;

type Props = {
  route: NewsDetailsScreenRouteProp;
};

const NewsDetailsScreen: React.FC<Props> = ({ route }) => {
  const { articleUrl } = route.params;

  return <WebView source={{ uri: articleUrl }} style={{ flex: 1 }} />;
};

export default NewsDetailsScreen;
