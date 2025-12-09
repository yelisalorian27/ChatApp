import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Simpan data user di AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify(userCredential.user));

    return userCredential.user;
  } catch (err) {
    throw new Error(err.message);
  }
};
