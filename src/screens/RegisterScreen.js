import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
// Assuming registerUser is a function handling registration logic (e.g., using createUserWithEmailAndPassword)
import { registerUser } from "../auth/register"; 

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (password !== confirm) {
      Alert.alert("Peringatan", "Password dan konfirmasi password tidak sama!");
      return;
    }

    try {
      // Assuming registerUser uses Firebase Auth
      await registerUser(email, password); 
      Alert.alert("Sukses", "Registrasi berhasil, silakan login");
      navigation.navigate("Login");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={[styles.input, { marginTop: 10, padding: 10 }]} // Adjusting style based on screenshot
        placeholder="Konfirmasi Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      <Button title="Register" onPress={handleRegister} />
      
      {/* Tombol yang mengarahkan ke halaman login */}
      <Button 
        title="Sudah punya akun? Login" 
        onPress={() => navigation.navigate("Login")} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  }
});