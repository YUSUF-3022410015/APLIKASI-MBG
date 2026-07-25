import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-green-50 p-8">
      <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
        <Text className="text-4xl">🍱</Text>
      </View>
      <Text className="text-3xl font-bold text-green-700 mb-2">Warung Nutrisi</Text>
      <Text className="text-base text-gray-600 text-center mb-8">
        Platform Makan Bergizi Gratis
      </Text>
      <Link href="/(auth)/login" asChild>
        <Pressable className="w-full bg-green-600 py-3 rounded-xl mb-3">
          <Text className="text-white text-center font-semibold">Masuk</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/register" asChild>
        <Pressable className="w-full border-2 border-green-600 py-3 rounded-xl">
          <Text className="text-green-600 text-center font-semibold">Daftar</Text>
        </Pressable>
      </Link>
    </View>
  );
}
