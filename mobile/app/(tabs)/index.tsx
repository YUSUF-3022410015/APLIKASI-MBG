import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, Image } from "react-native";
import { Link } from "expo-router";

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

  useEffect(() => {
    fetch(`${API_URL}/api/menus`)
      .then((res) => res.json())
      .then((data) => setMenus(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Text className="text-2xl font-bold px-4 pt-6 pb-4">Menu MBG</Text>
      <FlatList
        data={menus}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6"
        renderItem={({ item }) => (
          <Link href={`/menu/${item.id}`} asChild>
            <Pressable className="bg-white rounded-xl mb-4 overflow-hidden shadow-sm border border-gray-100">
              <View className="h-36 bg-green-100 items-center justify-center">
                {(item.imageUrls && item.imageUrls[0]) || item.imageUrl ? (
                  <Image source={{ uri: item.imageUrls?.[0] || item.imageUrl! }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <Text className="text-5xl">🍱</Text>
                )}
              </View>
              <View className="p-4">
                <Text className="font-semibold text-lg">{item.title}</Text>
                <Text className="text-gray-500 text-sm">{item.sppg.name}</Text>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-green-600 font-medium">{item.calories} kkal</Text>
                  {item.avgRating && (
                    <Text className="text-yellow-500">★ {item.avgRating.toFixed(1)}</Text>
                  )}
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
