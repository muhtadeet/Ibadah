import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Text } from "react-native-paper";

const Quran = () => {
  const [quran, setQuran] = useState();
  const getQuran = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://api.alquran.cloud/v1/quran/en.asad`
      );

      if (response.data.data) {
        setQuran(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getQuran();
  }, [getQuran]);

  console.log(quran.surahs[0].ayahs);
  return (
    <>
      {/* <Text>{quran[0].ayahs[0].text}</Text>
      <Text>{quran[0].ayahs[1].text}</Text>
      <Text>{quran[0].ayahs[2].text}</Text>
      <Text>{quran[0].ayahs[3].text}</Text>
      <Text>{quran[0].ayahs[4].text}</Text>
      <Text>{quran[0].ayahs[5].text}</Text>
      <Text>{quran[0].ayahs[6].text}</Text>
      <Text>{quran[0].ayahs[7].text}</Text> */}
    </>
  );
};

export default Quran;
