import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Link, router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export default function RegisterScreen() {
  const [form, setForm] = useState({ email: "", password: "", fullName: "", role: "ORTU" });
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    const { email, password, fullName } = form;
    if (!email || !password || !fullName) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        Alert.alert("Sukses", "Akun berhasil dibuat", [
          { text: "OK", onPress: () => router.replace("/(auth)/login") },
        ]);
      } else {
        const data = await res.json();
        Alert.alert("Error", data.error || "Gagal mendaftar");
      }
    } catch {
      Alert.alert("Error", "Gagal terhubung ke server");
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center bg-green-50 px-6">
      <View className="bg-white p-8 rounded-2xl shadow">
        <Text className="text-2xl font-bold text-center mb-2">Daftar Akun</Text>
        <Text className="text-gray-500 text-center mb-6">Warung Nutrisi - MBG</Text>

        <TextInput
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Nama Lengkap"
          value={form.fullName}
          onChangeText={(v) => setForm({ ...form, fullName: v })}
        />
        <TextInput
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Email"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Password (min 6 karakter)"
          value={form.password}
          onChangeText={(v) => setForm({ ...form, password: v })}
          secureTextEntry
        />

        <Pressable
          onPress={handleRegister}
          disabled={loading}
          className="bg-green-600 py-3 rounded-lg mb-4"
        >
          <Text className="text-white text-center font-semibold">
            {loading ? "Memproses..." : "Daftar"}
          </Text>
        </Pressable>

        <Text className="text-center text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/(auth)/login" className="text-green-600 font-semibold">
            Masuk
          </Link>
        </Text>
      </View>
    </View>
  );
}
