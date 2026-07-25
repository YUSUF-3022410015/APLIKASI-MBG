import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    AsyncStorage.removeItem("user");
    setUser(null);
    router.replace("/");
  }

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="text-2xl font-bold mb-6">Profil</Text>
      <View className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
        {user ? (
          <>
            <Text className="font-semibold text-lg mb-1">{user.fullName}</Text>
            <Text className="text-gray-500 text-sm mb-1">{user.email}</Text>
            <Text className="text-green-600 text-sm font-medium mb-4">
              Role: {user.role}
            </Text>
            <Pressable
              onPress={handleLogout}
              className="bg-red-500 py-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">Keluar</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text className="text-gray-500 text-center mb-4">Anda belum login</Text>
            <Pressable
              onPress={() => router.push("/(auth)/login")}
              className="bg-green-600 py-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">Masuk</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
