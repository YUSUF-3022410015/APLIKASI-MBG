import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, Image, RefreshControl } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

interface Menu {
  id: string;
  title: string;
  calories: number;
  imageUrls?: string[];
  imageUrl?: string;
  sppg: { name: string };
  avgRating?: number;
}

export default function HomeTab() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchMenus() {
    try {
      const res = await fetch(`${API_URL}/api/menus`);
      const data = await res.json();
      setMenus(data);
    } catch {}
  }

  useEffect(() => {
    fetchMenus().finally(() => setLoading(false));
  }, []);

  function onRefresh() {
    setRefreshing(true);
    fetchMenus().finally(() => setRefreshing(false));
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-12 pb-2 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Menu MBG</Text>
        <Text className="text-gray-500 mt-1">Jelajahi menu bergizi terbaru</Text>
      </View>
      <FlatList
        data={menus}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16a34a" />}
        renderItem={({ item }) => (
          <Link href={`/menu/${item.id}`} asChild>
            <Pressable className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm border border-gray-100 active:opacity-80">
              <View className="h-40 bg-green-100 items-center justify-center">
                {(item.imageUrls && item.imageUrls[0]) || item.imageUrl ? (
                  <Image source={{ uri: item.imageUrls?.[0] || item.imageUrl! }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <Ionicons name="fast-food-outline" size={48} color="#86efac" />
                )}
              </View>
              <View className="p-4">
                <Text className="font-semibold text-lg text-gray-900">{item.title}</Text>
                <Text className="text-gray-500 text-sm">{item.sppg.name}</Text>
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="flame-outline" size={16} color="#16a34a" />
                    <Text className="text-green-600 font-medium">{item.calories} kkal</Text>
                  </View>
                  {item.avgRating && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="star" size={16} color="#eab308" />
                      <Text className="text-yellow-500 font-medium">{item.avgRating.toFixed(1)}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Ionicons name="fast-food-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-400 mt-4">Belum ada menu tersedia</Text>
          </View>
        }
      />
    </View>
  );
}
