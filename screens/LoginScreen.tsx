// chatpbp/screens/LoginScreen.tsx

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "../firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    } catch (e: any) {
      try {
        await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      } catch (regErr: any) {
        alert(regErr.message);
        return;
      }
    }

    await AsyncStorage.setItem("chatpbp_username", name.trim());

    navigation.replace("Chat", { name: name.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama tampilan"
        value={name}
        onChangeText={setName}
      />

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
        placeholder="Password (min 6 karakter)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Masuk Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25 },
  title: { fontSize: 30, fontWeight: "600", textAlign: "center", marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#ff5c7a",
    padding: 14,
    borderRadius: 10,
    marginTop: 5,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
