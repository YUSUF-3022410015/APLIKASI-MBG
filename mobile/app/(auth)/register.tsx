import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-center bg-green-50 px-6">
      <ScrollView className="flex-1" contentContainerClassName="py-12">
        <View className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          <View className="items-center mb-6">
            <View className="w-14 h-14 bg-green-100 rounded-2xl items-center justify-center mb-4">
              <Ionicons name="person-add-outline" size={28} color="#16a34a" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">Daftar Akun</Text>
            <Text className="text-gray-500 mt-1">Warung Nutrisi - MBG</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4">
                <Ionicons name="person-outline" size={20} color="#9ca3af" />
                <TextInput className="flex-1 py-3.5 ml-2 text-base" placeholder="Nama Lengkap" value={form.fullName} onChangeText={(v) => setForm({ ...form, fullName: v })} />
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1.5">Email</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4">
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                <TextInput className="flex-1 py-3.5 ml-2 text-base" placeholder="contoh@email.com" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} autoCapitalize="none" keyboardType="email-address" />
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1.5">Password</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4">
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                <TextInput className="flex-1 py-3.5 ml-2 text-base" placeholder="Minimal 6 karakter" value={form.password} onChangeText={(v) => setForm({ ...form, password: v })} secureTextEntry />
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Daftar Sebagai</Text>
              <View className="flex-row gap-3">
                {[
                  { value: "ORTU", label: "Orang Tua / Murid", icon: "people-outline" as const },
                  { value: "SEKOLAH", label: "Pihak Sekolah", icon: "school-outline" as const },
                ].map((opt) => (
                  <Pressable key={opt.value} onPress={() => setForm({ ...form, role: opt.value })}
                    className={`flex-1 py-3.5 rounded-xl border-2 items-center ${form.role === opt.value ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                  >
                    <Ionicons name={opt.icon} size={20} color={form.role === opt.value ? "#16a34a" : "#9ca3af"} />
                    <Text className={`text-xs font-medium mt-1 ${form.role === opt.value ? "text-green-700" : "text-gray-500"}`}>{opt.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable onPress={handleRegister} disabled={loading} className="bg-green-600 py-3.5 rounded-xl items-center active:opacity-80 mt-2">
              <Text className="text-white font-semibold text-base">{loading ? "Memproses..." : "Daftar"}</Text>
            </Pressable>
          </View>

          <Text className="text-center text-gray-500 mt-6">
            Sudah punya akun?{" "}
            <Link href="/(auth)/login" className="text-green-600 font-semibold">Masuk</Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
