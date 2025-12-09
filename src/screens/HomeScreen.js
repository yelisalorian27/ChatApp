import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { fetchMahasiswa } from "../utils/fetchMahasiswa"; // ← FIX IMPORT

export default function HomeScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchMahasiswa();
        console.log("HASIL FETCH:", result); // debug
        setData(result);
      } catch (error) {
        console.log("Error fetch:", error);
      }
    };

    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {data.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Tidak ada data mahasiswa
        </Text>
      ) : (
        data.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.title}>{item.NIM}</Text>
            <Text>Nama: {item.Nama}</Text>
            <Text>Fakultas: {item.Fakultas}</Text>
            <Text>Program Studi: {item.Program_Studi}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
