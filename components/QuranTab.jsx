import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

const QuranTab = ({ navigation }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await axios.get('http://api.alquran.cloud/v1/surah');
      setSurahs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surahs:', error);
      setLoading(false);
    }
  };

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('SurahDetail', { surah: item })}>
      <Card style={{ margin: 5 }}>
        <Card.Content>
          <Text variant="titleMedium">{item.number}. {item.englishName}</Text>
          <Text variant="bodyMedium">{item.englishNameTranslation}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={surahs}
      renderItem={renderSurahItem}
      keyExtractor={(item) => item.number.toString()}
    />
  );
};

export default QuranTab;