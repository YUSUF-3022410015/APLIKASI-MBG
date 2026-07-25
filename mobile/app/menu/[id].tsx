import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, Alert, Image } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchMenuDetail(id as string)
      .then((data) => { if (data.error) setMenu(null); else setMenu(data); })
      .catch(() => setMenu(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!menu?.imageUrls || menu.imageUrls.length < 2) return;
    const timer = setInterval(() => {
      setCurrentImage((p) => (p + 1) % menu.imageUrls.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [menu?.imageUrls?.length]);

  async function handleSubmitReview() {
    if (rating === 0) { Alert.alert("Info", "Pilih rating terlebih dahulu"); return; }
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
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!menu) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Ionicons name="alert-circle-outline" size={48} color="#d1d5db" />
        <Text className="text-gray-400 mt-4">Menu tidak ditemukan</Text>
      </View>
    );
  }

  const images = menu.imageUrls?.length ? menu.imageUrls : menu.imageUrl ? [menu.imageUrl] : [];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: menu.title, headerTintColor: "#16a34a" }} />

      {/* Image */}
      <View className="h-56 bg-green-100">
        {images.length > 0 ? (
          <Image source={{ uri: images[currentImage] }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="fast-food-outline" size={64} color="#86efac" />
          </View>
        )}
        {images.length > 1 && (
          <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-2">
            {images.map((_, i) => (
              <View key={i} className={`w-2.5 h-2.5 rounded-full ${i === currentImage ? "bg-white" : "bg-white/50"}`} />
            ))}
          </View>
        )}
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-1">{menu.title}</Text>
        <Text className="text-gray-500 mb-4">oleh {menu.sppg.name}</Text>

        {/* Nutrition */}
        <View className="flex-row justify-around bg-white p-5 rounded-2xl mb-5 shadow-sm border border-gray-100">
          <View className="items-center">
            <Ionicons name="flame" size={22} color="#16a34a" />
            <Text className="text-xl font-bold text-green-600 mt-1">{menu.calories}</Text>
            <Text className="text-xs text-gray-500">Kalori</Text>
          </View>
          {menu.protein ? (
            <View className="items-center">
              <Ionicons name="fitness" size={22} color="#3b82f6" />
              <Text className="text-xl font-bold text-blue-600 mt-1">{menu.protein}g</Text>
              <Text className="text-xs text-gray-500">Protein</Text>
            </View>
          ) : null}
          {menu.carbohydrate ? (
            <View className="items-center">
              <Ionicons name="leaf" size={22} color="#f97316" />
              <Text className="text-xl font-bold text-orange-600 mt-1">{menu.carbohydrate}g</Text>
              <Text className="text-xs text-gray-500">Karbo</Text>
            </View>
          ) : null}
          {menu.fat ? (
            <View className="items-center">
              <Ionicons name="water" size={22} color="#a855f7" />
              <Text className="text-xl font-bold text-purple-600 mt-1">{menu.fat}g</Text>
              <Text className="text-xs text-gray-500">Lemak</Text>
            </View>
          ) : null}
        </View>

        {menu.description ? <Text className="text-gray-700 mb-5">{menu.description}</Text> : null}

        {menu.ingredients?.length > 0 && (
          <View className="mb-5">
            <Text className="font-semibold text-gray-900 mb-3">Bahan Baku</Text>
            <View className="flex-row flex-wrap gap-2">
              {menu.ingredients.map((item, i) => (
                <View key={i} className="bg-green-50 px-3.5 py-1.5 rounded-full border border-green-200">
                  <Text className="text-green-700 text-sm">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {menu.distributions?.length > 0 && (
          <View className="mb-5">
            <Text className="font-semibold text-gray-900 mb-2">Distribusi ke:</Text>
            {menu.distributions.map((d: any) => (
              <Text key={d.id} className="text-sm text-gray-600 ml-2">• {d.school?.name}</Text>
            ))}
          </View>
        )}

        {/* Review Form */}
        <View className="bg-white p-5 rounded-2xl mb-5 shadow-sm border border-gray-100">
          <Text className="font-semibold text-gray-900 mb-4">Beri Ulasan</Text>
          <View className="flex-row gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Ionicons name={star <= rating ? "star" : "star-outline"} size={28} color={star <= rating ? "#eab308" : "#d1d5db"} />
              </Pressable>
            ))}
          </View>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 text-base"
            placeholder="Tulis ulasan..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <Pressable onPress={handleSubmitReview} disabled={submitting} className="bg-green-600 py-3 rounded-xl items-center active:opacity-80">
            <Text className="text-white font-semibold">{submitting ? "Mengirim..." : "Kirim Ulasan"}</Text>
          </Pressable>
        </View>

        {/* Reviews */}
        {menu.reviews?.length > 0 && (
          <View>
            <Text className="font-semibold text-gray-900 mb-3">Ulasan ({menu.reviews.length})</Text>
            {menu.reviews.map((review: any) => (
              <View key={review.id} className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm">
                <View className="flex-row justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="person-circle-outline" size={24} color="#9ca3af" />
                    <Text className="font-medium text-sm text-gray-900">{review.user?.fullName || "Anonymous"}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="star" size={14} color="#eab308" />
                    <Text className="text-yellow-500 text-sm font-medium">{review.rating}</Text>
                  </View>
                </View>
                {review.comment ? <Text className="text-sm text-gray-600 ml-8">{review.comment}</Text> : null}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
