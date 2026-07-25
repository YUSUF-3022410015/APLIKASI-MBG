import { useState, useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface UserData {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export default function ProfileTab() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  function handleLogout() {
    Alert.alert("Keluar", "Yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: () => {
        AsyncStorage.removeItem("user");
        setUser(null);
        router.replace("/");
      }},
    ]);
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Profil</Text>
      </View>

      <View className="px-4 pt-6">
        <View className="bg-white p-6 rounded-2xl border border-gray-100">
          {user ? (
            <>
              <View className="w-16 h-16 bg-green-100 rounded-2xl items-center justify-center mb-4">
                <Ionicons name="person" size={32} color="#16a34a" />
              </View>
              <Text className="font-bold text-xl text-gray-900 mb-1">{user.fullName}</Text>
              <Text className="text-gray-500 mb-1">{user.email}</Text>
              <View className="flex-row items-center gap-1 mb-6">
                <Ionicons name="shield-checkmark-outline" size={16} color="#16a34a" />
                <Text className="text-green-600 text-sm font-medium">{user.role}</Text>
              </View>
              <Pressable
                onPress={handleLogout}
                className="flex-row items-center justify-center gap-2 bg-red-500 py-3.5 rounded-xl active:opacity-80"
              >
                <Ionicons name="log-out-outline" size={20} color="white" />
                <Text className="text-white font-semibold">Keluar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View className="w-16 h-16 bg-gray-100 rounded-2xl items-center justify-center mx-auto mb-4">
                <Ionicons name="person-outline" size={32} color="#9ca3af" />
              </View>
              <Text className="text-gray-500 text-center mb-6">Anda belum login</Text>
              <Pressable
                onPress={() => router.push("/(auth)/login")}
                className="bg-green-600 py-3.5 rounded-xl active:opacity-80"
              >
                <Text className="text-white text-center font-semibold">Masuk</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
