import { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${API_URL}/api/schools?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch {}
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-1">Cari Sekolah</Text>
        <Text className="text-gray-500">Temukan sekolah mitra MBG</Text>
      </View>

      <View className="px-4 pt-4">
        <View className="flex-row gap-2 mb-6">
          <TextInput
            className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder="Nama sekolah atau NPSN"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <Pressable
            onPress={handleSearch}
            disabled={loading}
            className="bg-green-600 px-5 rounded-xl items-center justify-center active:opacity-80"
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="search" size={22} color="white" />
            )}
          </Pressable>
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6"
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-3 border border-gray-100">
            <View className="flex-row gap-3">
              <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center">
                <Ionicons name="school-outline" size={22} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">{item.name}</Text>
                <Text className="text-sm text-gray-500">NPSN: {item.npsn}</Text>
                {item.address && <Text className="text-sm text-gray-400 mt-0.5">{item.address}</Text>}
                {item.sppgMitra && (
                  <Text className="text-sm text-green-600 font-medium mt-1">Mitra: {item.sppgMitra.name}</Text>
                )}
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          searched && !loading ? (
            <View className="items-center py-16">
              <Ionicons name="search-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-400 mt-4">Sekolah tidak ditemukan</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
