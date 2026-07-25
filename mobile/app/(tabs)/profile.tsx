import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function ProfileTab() {
  function handleLogout() {
    router.replace("/");
  }

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="text-2xl font-bold mb-6">Profil</Text>
      <View className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
        <Text className="text-gray-500 text-center mb-4">Anda belum login</Text>
        <Pressable
          onPress={() => router.push("/(auth)/login")}
          className="bg-green-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Masuk</Text>
        </Pressable>
      </View>
      <Pressable onPress={handleLogout}>
        <Text className="text-red-500 text-center">Keluar</Text>
      </Pressable>
    </View>
  );
}
