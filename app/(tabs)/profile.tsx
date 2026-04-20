import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  const initials = email ? email[0].toUpperCase() : "?";

  const menuItems = [
    { label: "Favorite", icon: "heart-outline", color: "#e24b4a", route: "/favorite" },
    { label: "Watchlist", icon: "bookmark-outline", color: "#00b7ff", route: "/watchlist" },
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#02041a" }}>
        <ActivityIndicator size="large" color="#00b7ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#02041a" }}>

      {/* Header */}
      <View style={{ padding: 16, backgroundColor: "#061a31", borderBottomColor: "#00b7ff", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", height: 60 }}>
        <Text variant="headlineMedium" style={{ color: "#fff", fontWeight: "bold" }}>
          Profile
        </Text>
      </View>

      <View style={{ padding: 24 }}>

        {/* Avatar + email */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#061a31", borderWidth: 2, borderColor: "#00b7ff44", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Text style={{ color: "#00b7ff", fontSize: 32, fontWeight: "700" }}>{initials}</Text>
          </View>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{email}</Text>
        </View>

        {/* Menu list */}
        <View style={{ gap: 10 }}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => router.push(item.route as any)}
              style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#061a31", borderWidth: 1, borderColor: "#0d2a4a", borderRadius: 12, padding: 16, gap: 14 }}
            >
              <Ionicons name={item.icon as any} size={22} color={item.color} />
              <Text style={{ color: "#fff", fontSize: 15, flex: 1 }}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#555" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
<TouchableOpacity
  onPress={async () => {
    await supabase.auth.signOut();
    router.replace("/");
  }}
  style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#1a0606", borderWidth: 1, borderColor: "#e24b4a33", borderRadius: 12, padding: 16, gap: 14, marginTop: 16 }}
>
  <Ionicons name="log-out-outline" size={22} color="#e24b4a" />
  <Text style={{ color: "#e24b4a", fontSize: 15, flex: 1 }}>Logout</Text>
</TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}