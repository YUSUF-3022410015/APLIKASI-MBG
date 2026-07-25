import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-center bg-green-50 px-6">
      <View className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <View className="items-center mb-6">
          <View className="w-14 h-14 bg-green-100 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="log-in-outline" size={28} color="#16a34a" />
          </View>
          <Text className="text-2xl font-bold text-gray-900">Masuk</Text>
          <Text className="text-gray-500 mt-1">Warung Nutrisi - MBG</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Email</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4">
              <Ionicons name="mail-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 py-3.5 ml-2 text-base"
                placeholder="contoh@email.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Password</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4">
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 py-3.5 ml-2 text-base"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="bg-green-600 py-3.5 rounded-xl items-center active:opacity-80 mt-2"
          >
            <Text className="text-white font-semibold text-base">
              {loading ? "Memproses..." : "Masuk"}
            </Text>
          </Pressable>
        </View>

        <Text className="text-center text-gray-500 mt-6">
          Belum punya akun?{" "}
          <Link href="/(auth)/register" className="text-green-600 font-semibold">
            Daftar
          </Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
