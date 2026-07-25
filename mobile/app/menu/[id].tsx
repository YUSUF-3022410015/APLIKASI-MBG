import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, Alert, Image } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

interface MenuDetail {
  id: string;
  title: string;
  description: string | null;
  calories: number;
  protein: number | null;
  carbohydrate: number | null;
  fat: number | null;
  ingredients: string[];
  imageUrl: string | null;
  sppg: { name: string };
  dateServed: string;
  avgRating: number | null;
  reviews: any[];
  distributions: any[];
}

export default function MenuDetailScreen() {
  const { id } = useLocalSearchParams();
  const [menu, setMenu] = useState<MenuDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/menus/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setMenu(null);
        else setMenu(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function submitReview() {
    if (rating === 0) {
      Alert.alert("Info", "Pilih rating terlebih dahulu");
      return;
    }
    try {
      await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId: id, rating, comment }),
      });
      Alert.alert("Sukses", "Ulasan terkirim");
      setRating(0);
      setComment("");
    } catch {
      Alert.alert("Error", "Gagal mengirim ulasan");
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!menu) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Menu tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: menu.title }} />
      <View className="h-48 bg-green-100 items-center justify-center">
        {menu.imageUrl ? (
          <Image source={{ uri: menu.imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Text className="text-7xl">🍱</Text>
        )}
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold mb-1">{menu.title}</Text>
        <Text className="text-gray-500 mb-4">oleh {menu.sppg.name}</Text>

        <View className="flex-row justify-around bg-white p-4 rounded-xl mb-4">
          <View className="items-center">
            <Text className="text-xl font-bold text-green-600">{menu.calories}</Text>
            <Text className="text-xs text-gray-500">Kalori</Text>
          </View>
          {menu.protein && (
            <View className="items-center">
              <Text className="text-xl font-bold text-blue-600">{menu.protein}g</Text>
              <Text className="text-xs text-gray-500">Protein</Text>
            </View>
          )}
          {menu.carbohydrate && (
            <View className="items-center">
              <Text className="text-xl font-bold text-orange-600">{menu.carbohydrate}g</Text>
              <Text className="text-xs text-gray-500">Karbo</Text>
            </View>
          )}
          {menu.fat && (
            <View className="items-center">
              <Text className="text-xl font-bold text-purple-600">{menu.fat}g</Text>
              <Text className="text-xs text-gray-500">Lemak</Text>
            </View>
          )}
        </View>

        {menu.description && (
          <Text className="text-gray-700 mb-4">{menu.description}</Text>
        )}

        {menu.ingredients && menu.ingredients.length > 0 && (
          <View className="mb-4">
            <Text className="font-semibold mb-2">Bahan Baku</Text>
            <View className="flex-row flex-wrap gap-2">
              {menu.ingredients.map((item, i) => (
                <View key={i} className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <Text className="text-green-700 text-sm">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {menu.distributions && menu.distributions.length > 0 && (
          <View className="mb-4">
            <Text className="font-semibold mb-2">Distribusi ke:</Text>
            {menu.distributions.map((d: any) => (
              <Text key={d.id} className="text-sm text-gray-600">- {d.school?.name}</Text>
            ))}
          </View>
        )}

        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="font-semibold mb-3">Beri Ulasan</Text>
          <View className="flex-row gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Text className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>
                  ★
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
            placeholder="Tulis ulasan..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <Pressable onPress={submitReview} className="bg-green-600 py-2 rounded-lg">
            <Text className="text-white text-center font-semibold">Kirim</Text>
          </Pressable>
        </View>

        {menu.reviews && menu.reviews.length > 0 && (
          <View>
            <Text className="font-semibold mb-3">Ulasan ({menu.reviews.length})</Text>
            {menu.reviews.map((review: any) => (
              <View key={review.id} className="bg-gray-100 p-3 rounded-lg mb-2">
                <View className="flex-row justify-between mb-1">
                  <Text className="font-medium text-sm">{review.user?.fullName}</Text>
                  <Text className="text-yellow-500 text-sm">★ {review.rating}</Text>
                </View>
                {review.comment && <Text className="text-sm text-gray-600">{review.comment}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
