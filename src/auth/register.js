import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};
