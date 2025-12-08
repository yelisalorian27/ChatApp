// chatpbp/App.tsx

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screens/LoginScreen";
import ChatScreen from "./screens/ChatScreen";

import { auth, onAuthStateChanged, User } from "./firebase";

export type RootStackParamList = {
  Login: undefined;
  Chat: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [storedName, setStoredName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadLocalName = async () => {
      try {
        const name = await AsyncStorage.getItem("chatpbp_username");
        if (name) {
          setStoredName(name);
        }
      } catch (e) {
        console.log("Error load chatpbp_username:", e);
      }
    };

    loadLocalName();

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {user && storedName ? (
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            initialParams={{ name: storedName }}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}