// ../utils/fetchMahasiswa.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js"; // pastikan path benar

export const fetchMahasiswa = async () => {
  console.log("[fetchMahasiswa] dipanggil");
  try {
    const colRef = collection(db, "Mahasiswa"); // pastikan "Mahasiswa" persis seperti di console
    console.log("[fetchMahasiswa] collection ref:", !!colRef);

    const snapshot = await getDocs(colRef);
    console.log("[fetchMahasiswa] getDocs berhasil. snapshot.size =", snapshot.size);

    const data = [];
    if (snapshot.empty) {
      console.log("[fetchMahasiswa] snapshot kosong (snapshot.empty === true)");
    }

    snapshot.forEach((doc) => {
      console.log("[fetchMahasiswa] doc.id:", doc.id, "doc.data():", doc.data());
      data.push({ id: doc.id, ...doc.data() });
    });

    console.log("[fetchMahasiswa] data array length:", data.length);
    return data;
  } catch (err) {
    console.error("[fetchMahasiswa] ERROR:", err);
    // kembalikan array kosong supaya UI tetap aman
    return [];
  }
};
