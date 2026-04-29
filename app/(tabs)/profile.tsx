import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text, Card } from "react-native-paper";
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
    {
      label: "Income History",
      icon: "arrow-down-circle",
      color: "#22c55e",
    },
    {
      label: "Expense History",
      icon: "arrow-up-circle",
      color: "#ef4444",
    },
  ];

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f172a",
        }}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      
      {/* HEADER */}
      <View style={{ padding: 20 }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          Profile
        </Text>
        <Text style={{ color: "#94a3b8" }}>
          Manage your account
        </Text>
      </View>

      <View style={{ padding: 16 }}>

        {/* USER CARD */}
        <Card
          style={{
            backgroundColor: "#1e293b",
            borderRadius: 24,
            marginBottom: 20,
          }}>
          <Card.Content
            style={{
              alignItems: "center",
              paddingVertical: 24,
            }}>
            
            {/* Avatar */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#0f172a",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}>
              <Text
                style={{
                  color: "#22c55e",
                  fontSize: 32,
                  fontWeight: "bold",
                }}>
                {initials}
              </Text>
            </View>

            <Text style={{ color: "white", fontSize: 16 }}>
              {email}
            </Text>
          </Card.Content>
        </Card>

        {/* MENU */}
        <View style={{ gap: 12 }}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1e293b",
                borderRadius: 16,
                padding: 16,
              }}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
              
              <Text
                style={{
                  color: "white",
                  marginLeft: 12,
                  flex: 1,
                }}>
                {item.label}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={async () => {
            await supabase.auth.signOut();
            router.replace("/");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1e293b",
            borderRadius: 16,
            padding: 16,
            marginTop: 20,
          }}>
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text style={{ color: "#ef4444", marginLeft: 12, flex: 1 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}