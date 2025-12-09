import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
// Pastikan CardText diimport jika itu adalah komponen terpisah
// import CardText from '../components/CardText'; 
import { fetchMahasiswa } from '../utils/fetchMahasiswa'; // Untuk mengambil data

export default function MahasiswaScreen() {
  const [list, setList] = useState([]); // State untuk menyimpan daftar mahasiswa

  // Fungsi untuk memuat data
  const loadData = async () => {
    // Memanggil fungsi fetchMahasiswa (dari ../utils/fetchMahasiswa.js)
    const data = await fetchMahasiswa();
    setList(data);
  };

  useEffect(() => {
    // Memuat data saat komponen dipasang
    loadData();
  }, []);

  // Komponen yang merender setiap item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Menggunakan Text biasa sebagai CardText seperti yang terlihat di SS HomeScreen */}
      <Text style={styles.cardText}>
        <Text style={{ fontWeight: "bold" }}>{item.nama}</Text>
        <Text>NIM: {item.nim}</Text>
        <Text>Fakultas: {item.fakultas}</Text>
        <Text>Program Studi: {item.prodi}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Judul Tampilan */}
      <Text style={styles.title}>Data Mahasiswa</Text>
      
      {/* Menggunakan FlatList untuk menampilkan data */}
      <FlatList
        data={list} // Data yang akan dirender
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

// Style yang diambil dari MahasiswaScreen.js dan LoginScreen.js (untuk card)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    // Style title yang sering terlihat di ss
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#f7f7f7", // Background yang terlihat abu-abu muda
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 12, // Margin bawah untuk pemisah antar kartu
    // Tambahan style dari SS (misal LoginScreen)
    borderWidth: 1, // Jika ada border
    borderColor: '#eee', // Warna border
  },
  cardText: {
    // Style text di dalam card
    fontSize: 16,
    // Mengacu pada potongan code Home/Mahasiswa screen
    fontWeight: "bold", // Hanya untuk beberapa bagian text
  }
});