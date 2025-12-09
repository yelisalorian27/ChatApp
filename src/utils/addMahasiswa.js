import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const addMahasiswa = async (nama, nim, prodi, fotoBase64 = null) => {
  if (!nama || !nim || !prodi) throw new Error("Semua field harus diisi!");

  const docRef = await addDoc(collection(db, "mahasiswa"), {
    nama,
    nim,
    prodi,
  });

  return docRef.id;
};