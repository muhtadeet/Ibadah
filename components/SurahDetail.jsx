import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

const SurahDetail = ({ route }) => {
  const { surah } = route.params;
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahDetails();
  }, [surah.number]);

  const fetchSurahDetails = async () => {
    try {
      const response = await axios.get(`http://api.alquran.cloud/v1/surah/${surah.number}/en.asad`);
      setVerses(response.data.data.ayahs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surah details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 10 }}>
      <Text variant="headlineMedium">{surah.englishName}</Text>
      <Text variant="titleMedium" style={{ marginBottom: 20 }}>{surah.englishNameTranslation}</Text>
      {verses.map((verse) => (
        <View key={verse.number} style={{ marginBottom: 10 }}>
          <Text variant="bodyMedium">{verse.numberInSurah}. {verse.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default SurahDetail;