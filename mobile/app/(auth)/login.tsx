import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mobileLogin } from "../../lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const data = await mobileLogin(email, password);
      if (data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Gagal terhubung ke server");
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center bg-green-50 px-6">
      <View className="bg-white p-8 rounded-2xl shadow">
        <Text className="text-2xl font-bold text-center mb-2">Masuk</Text>
        <Text className="text-gray-500 text-center mb-6">Warung Nutrisi - MBG</Text>

        <TextInput
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="bg-green-600 py-3 rounded-lg mb-4"
        >
          <Text className="text-white text-center font-semibold">
            {loading ? "Memproses..." : "Masuk"}
          </Text>
        </Pressable>

        <Text className="text-center text-gray-500">
          Belum punya akun?{" "}
          <Link href="/(auth)/register" className="text-green-600 font-semibold">
            Daftar
          </Link>
        </Text>
      </View>
    </View>
  );
}
