import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, Alert, Image } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { fetchMenuDetail, submitReview } from "../../lib/api";

interface MenuDetail {
  id: string;
  title: string;
  description: string | null;
  calories: number;
  protein: number | null;
  carbohydrate: number | null;
  fat: number | null;
  ingredients: string[];
  imageUrls: string[];
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchMenuDetail(id as string)
      .then((data) => {
        if (data.error) setMenu(null);
        else setMenu(data);
      })
      .catch(() => setMenu(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmitReview() {
    if (rating === 0) {
      Alert.alert("Info", "Pilih rating terlebih dahulu");
      return;
    }
    setSubmitting(true);
    try {
      await submitReview(id as string, rating, comment);
      Alert.alert("Sukses", "Ulasan terkirim");
      setRating(0);
      setComment("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Gagal mengirim ulasan");
    }
    setSubmitting(false);
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

  const displayImage = menu.imageUrls?.[0] || menu.imageUrl || null;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: menu.title }} />
      <View className="h-48 bg-green-100 items-center justify-center">
        {displayImage ? (
          <Image source={{ uri: displayImage }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Text className="text-7xl">{"\uD83C\uDF71"}</Text>
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
          {menu.protein ? (
            <View className="items-center">
              <Text className="text-xl font-bold text-blue-600">{menu.protein}g</Text>
              <Text className="text-xs text-gray-500">Protein</Text>
            </View>
          ) : null}
          {menu.carbohydrate ? (
            <View className="items-center">
              <Text className="text-xl font-bold text-orange-600">{menu.carbohydrate}g</Text>
              <Text className="text-xs text-gray-500">Karbo</Text>
            </View>
          ) : null}
          {menu.fat ? (
            <View className="items-center">
              <Text className="text-xl font-bold text-purple-600">{menu.fat}g</Text>
              <Text className="text-xs text-gray-500">Lemak</Text>
            </View>
          ) : null}
        </View>

        {menu.description ? (
          <Text className="text-gray-700 mb-4">{menu.description}</Text>
        ) : null}

        {menu.ingredients && menu.ingredients.length > 0 ? (
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
        ) : null}

        {menu.distributions && menu.distributions.length > 0 ? (
          <View className="mb-4">
            <Text className="font-semibold mb-2">Distribusi ke:</Text>
            {menu.distributions.map((d: any) => (
              <Text key={d.id} className="text-sm text-gray-600">- {d.school?.name}</Text>
            ))}
          </View>
        ) : null}

        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="font-semibold mb-3">Beri Ulasan</Text>
          <View className="flex-row gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Text className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>
                  {"\u2605"}
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
          <Pressable
            onPress={handleSubmitReview}
            disabled={submitting}
            className="bg-green-600 py-2 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              {submitting ? "Mengirim..." : "Kirim"}
            </Text>
          </Pressable>
        </View>

        {menu.reviews && menu.reviews.length > 0 ? (
          <View>
            <Text className="font-semibold mb-3">Ulasan ({menu.reviews.length})</Text>
            {menu.reviews.map((review: any) => (
              <View key={review.id} className="bg-gray-100 p-3 rounded-lg mb-2">
                <View className="flex-row justify-between mb-1">
                  <Text className="font-medium text-sm">{review.user?.fullName}</Text>
                  <Text className="text-yellow-500 text-sm">{"\u2605"} {review.rating}</Text>
                </View>
                {review.comment ? <Text className="text-sm text-gray-600">{review.comment}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
