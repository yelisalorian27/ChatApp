import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";

export const logoutUser = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem("user");
  } catch (err) {
    throw new Error(err.message);
  }
};
