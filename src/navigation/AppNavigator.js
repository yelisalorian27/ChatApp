// src/navigation/AppNavigator.js (REVISI)

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import MahasiswaScreen from "../screens/MahasiswaScreen";
import AddMahasiswaScreen from "../screens/AddMahasiswaScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLogin, setIsLogin] = useState(null);

  useEffect(() => {
    const cekUser = async () => {
      // Ambil data user dari AsyncStorage
      const data = await AsyncStorage.getItem("user");
      // Jika data ada, user dianggap sudah login (true).
      setIsLogin(data ? true : false);
    };
    cekUser();
  }, []);

  if (isLogin === null) return null; // Loading state

  // Tentukan nama rute awal berdasarkan status login
  const initialRouteName = isLogin ? "Home" : "Login";

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }} 
        // Mengatur rute awal secara kondisional
        initialRouteName={initialRouteName} 
      >
        {/* DAFTARKAN SEMUA SCREENS AGAR SELALU TERSEDIA UNTUK DINAVIGASI */}
        
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* App Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mahasiswa" component={MahasiswaScreen} />
        <Stack.Screen name="AddMahasiswa" component={AddMahasiswaScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}