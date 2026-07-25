import { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/schools?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data);
    } catch {}
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="text-2xl font-bold mb-4">Cari Sekolah</Text>
      <View className="flex-row gap-2 mb-6">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-white"
          placeholder="Nama sekolah atau NPSN"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <Pressable
          onPress={handleSearch}
          disabled={loading}
          className="bg-green-600 px-6 rounded-lg items-center justify-center"
        >
          <Text className="text-white font-semibold">Cari</Text>
        </Pressable>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl mb-3 border border-gray-100">
            <Text className="font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-500">NPSN: {item.npsn}</Text>
            {item.address && (
              <Text className="text-sm text-gray-400">{item.address}</Text>
            )}
            {item.sppgMitra && (
              <Text className="text-sm text-green-600 mt-1">Mitra: {item.sppgMitra.name}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          query && !loading ? (
            <Text className="text-center text-gray-400 py-8">Sekolah tidak ditemukan</Text>
          ) : null
        }
      />
    </View>
  );
}
