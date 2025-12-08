// screens/ChatScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  auth,
  messagesCollection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  signOut,
} from "../firebase"; // HAPUS storage dari import
import { launchImageLibrary } from "react-native-image-picker";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ route, navigation }: Props) {
  const userName = route?.params?.name || "User";
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [uid, setUid] = useState("guest");
  const flatListRef = useRef<FlatList>(null);

  // SETUP HEADER
  useEffect(() => {
    navigation.setOptions({
      headerTitle: userName,
      headerBackVisible: false,
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            try {
              await signOut(auth);
              await AsyncStorage.removeItem("chatpbp_username");
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } catch (e) {
              Alert.alert("Error", "Gagal logout");
            }
          }}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, userName]);

  // LOAD MESSAGES
  useEffect(() => {
    const user = auth.currentUser;
    const currentUid = user?.uid ?? "guest";
    setUid(currentUid);

    const q = query(messagesCollection, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => {
        const data = doc.data();
        list.push({ id: doc.id, ...data });
      });
      setMessages(list);
    });

    return () => unsub();
  }, []);

  // SEND TEXT MESSAGE
  const sendMessage = async () => {
    const messageText = message.trim();
    
    if (!messageText) return;

    setMessage("");

    try {
      await addDoc(messagesCollection, {
        text: messageText,
        user: userName,
        userId: uid,
        imageUrl: null,
        createdAt: serverTimestamp(),
      });

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Gagal mengirim pesan");
      setMessage(messageText);
    }
  };

  // SEND IMAGE - SIMPLE VERSION (TANPA UPLOAD KE STORAGE)
  const sendImage = () => {
    launchImageLibrary({ 
      mediaType: "photo", 
      quality: 0.7,
      selectionLimit: 1 
    }, async (res) => {
      if (res.didCancel) return;
      
      if (res.errorCode) {
        Alert.alert("Error", res.errorMessage || "Gagal memilih gambar");
        return;
      }

      const asset = res.assets?.[0];
      if (!asset?.uri) return;

      try {
        // SIMPAN URI LOKAL LANGSUNG KE FIRESTORE
        await addDoc(messagesCollection, {
          text: "",
          user: userName,
          userId: uid,
          imageUrl: asset.uri, // ← URI LOKAL SAJA
          createdAt: serverTimestamp(),
        });

        Alert.alert("Success", "Gambar berhasil dikirim!");
      } catch (error) {
        console.error("Error sending image:", error);
        Alert.alert("Error", "Gagal mengirim gambar");
      }
    });
  };

  // RENDER MESSAGE
  const renderItem = ({ item }: any) => {
    const isMe = item.userId === uid;

    return (
      <View style={[styles.row, isMe ? styles.right : styles.left]}>
        <View style={[styles.bubble, isMe ? styles.me : styles.other]}>
          {!!item.text && (
            <Text style={[styles.text, isMe && styles.textMe]}>
              {item.text}
            </Text>
          )}

          {!!item.imageUrl && (
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
          )}
          
          {item.createdAt?.toDate && (
            <Text style={styles.time}>
              {item.createdAt.toDate().toLocaleTimeString([], { 
                hour: "2-digit", 
                minute: "2-digit" 
              })}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={sendImage} style={styles.addBtn}>
          <Text style={styles.addBtnText}>📷</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
          disabled={!message.trim()}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  messagesList: {
    padding: 12,
    paddingBottom: 20,
  },
  row: {
    marginBottom: 12,
  },
  right: {
    alignItems: "flex-end",
  },
  left: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    padding: 12,
    paddingBottom: 8,
  },
  me: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  other: {
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  textMe: {
    color: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 6,
  },
  time: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
    textAlign: "right",
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  addBtn: {
    padding: 10,
    marginRight: 8,
  },
  addBtnText: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: "#c7c7cc",
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});