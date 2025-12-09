import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkSession = async () => {
  try {
    const data = await AsyncStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.log("Error checking session:", err);
    return null;
  }
};
