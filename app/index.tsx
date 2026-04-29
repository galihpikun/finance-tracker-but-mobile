import { supabase } from "@/lib/db";
import { useState } from "react";
import { Alert, View } from "react-native";
import {
  Button,
  Card,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { useRouter } from "expo-router";

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("register");

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password ga boleh kosong");
      return;
    }

    if (mode === "register") {
        const {error} = await supabase.auth.signUp({
            email,
            password
        });
        if (error) {
            Alert.alert("Error", error.message);
            return;
        }
        setMode("login");
        setEmail("");
        setPassword("");
        Alert.alert("Success", "Registrasi berhasil, silahkan login");
    } else {
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            Alert.alert("Error", error.message);
            return;
        }
    }

    router.replace("/(tabs)/home");
    setEmail("");
    setPassword("");
  }

  return (
   <View style={{ flex: 1, backgroundColor: "#0f172a", justifyContent: "center", padding: 20 }}>
  
  {/* HEADER */}
  <View style={{ marginBottom: 30 }}>
    <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
      Welcum Back 👋
    </Text>
    <Text style={{ color: "#94a3b8", marginTop: 4 }}>
      Manage your finance easily
    </Text>
  </View>

  {/* CARD */}
  <Card
    style={{
      borderRadius: 24,
      backgroundColor: "#1e293b",
      padding: 10,
    }}>
    <Card.Content>

      {/* MODE SWITCH */}
      <SegmentedButtons
        value={mode}
        onValueChange={setMode}
        buttons={[
          { value: "login", label: "Login" },
          { value: "register", label: "Register" },
        ]}
        style={{ marginBottom: 20 }}
      />

      {/* EMAIL */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        outlineColor="#334155"
        activeOutlineColor="#22c55e"
        textColor="white"
        style={{ marginBottom: 16, backgroundColor: "#0f172a" }}
      />

      {/* PASSWORD */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        outlineColor="#334155"
        activeOutlineColor="#22c55e"
        textColor="white"
        style={{ marginBottom: 20, backgroundColor: "#0f172a" }}
      />

      {/* BUTTON */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{
          borderRadius: 12,
          paddingVertical: 6,
          backgroundColor: "#22c55e",
        }}
        labelStyle={{ fontWeight: "bold" }}>
        {mode === "register" ? "Create Account" : "Login"}
      </Button>

    </Card.Content>
  </Card>

  {/* FOOTER */}
  <Text
    style={{
      color: "#64748b",
      textAlign: "center",
      marginTop: 20,
      fontSize: 12,
    }}>
    Secure • Simple • Fast
  </Text>
</View>
  );
}
