import { supabase } from "@/lib/db";
import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import {
  Appbar,
  Card,
  Text,
  Button,
  Portal,
  Dialog,
  TextInput,
  IconButton,
} from "react-native-paper";

export default function Savings() {
  const [goals, setGoals] = useState<any[]>([]);
  const [dialogAdd, setDialogAdd] = useState(false);
  const [dialogPay, setDialogPay] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [amount, setAmount] = useState("");

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async function fetchGoals() {
    const user = await getUser();
    if (!user) return;
    const { data } = await supabase
      .from("savings")
      .select("*")
      .eq("user_id", user.id);

    setGoals(data || []);
  }

  async function handleAddGoal() {
    const user = await getUser();

    await supabase.from("savings").insert({
      name,
      target: parseInt(target),
      saved: 0,
      user_id: user?.id,
    });

    setDialogAdd(false);
    setName("");
    setTarget("");
    fetchGoals();
  }

  async function handlePayGoal() {
  if (!selectedGoal) return;

  const user = await getUser();
  if (!user) return;

  const parsedAmount = parseInt(amount);

  // 1. Update savings
  await supabase
    .from("savings")
    .update({
      saved: selectedGoal.saved + parsedAmount,
    })
    .eq("id", selectedGoal.id);

  // 2. Insert ke transactions (IMPORTANT)
  await supabase.from("transactions").insert({
    type: "out",
    amount: parsedAmount,
    description: `Nabung: ${selectedGoal.name}`,
    category: "savings",
    user_id: user.id,
  });

  setDialogPay(false);
  setAmount("");
  setSelectedGoal(null);
  fetchGoals();
}

  useEffect(() => {
    fetchGoals();
  }, []);

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const percentage = (totalSaved / totalTarget) * 100 || 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <Appbar.Header style={{ backgroundColor: "#0f172a" }}>
        <Appbar.Content title="Savings Goals" titleStyle={{ color: "white" }} />
        <Appbar.Action icon="plus" color="white" onPress={() => setDialogAdd(true)} />
      </Appbar.Header>

      {/* OVERALL */}
      <View style={{ padding: 16 }}>
        <Card style={{ backgroundColor: "#1e293b", borderRadius: 20 }}>
          <Card.Content>
            <Text style={{ color: "#94a3b8" }}>Overall Progress</Text>

            <View
              style={{
                height: 10,
                backgroundColor: "#334155",
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <View
                style={{
                  width: `${percentage}%`,
                  backgroundColor: "#22c55e",
                  height: 10,
                  borderRadius: 10,
                }}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "#22c55e" }}>
                Rp {totalSaved.toLocaleString("id-ID")}
              </Text>
              <Text style={{ color: "white" }}>
                Rp {totalTarget.toLocaleString("id-ID")}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* GOALS LIST */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const progress = (item.saved / item.target) * 100;

          return (
            <Card
              style={{
                marginBottom: 12,
                backgroundColor: "#1e293b",
                borderRadius: 20,
              }}>
              <Card.Content>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                  {item.name}
                </Text>

                <View
                  style={{
                    height: 8,
                    backgroundColor: "#334155",
                    borderRadius: 10,
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      width: `${progress}%`,
                      backgroundColor: "#22c55e",
                      height: 8,
                      borderRadius: 10,
                    }}
                  />
                </View>

                <View
                  style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: "#22c55e" }}>
                    Rp {item.saved.toLocaleString("id-ID")}
                  </Text>
                  <Text style={{ color: "white" }}>
                    Rp {item.target.toLocaleString("id-ID")}
                  </Text>
                </View>

                <Button
                  mode="contained"
                  style={{ marginTop: 10, backgroundColor: "#22c55e" }}
                  onPress={() => {
                    setSelectedGoal(item);
                    setDialogPay(true);
                  }}>
                  Nabung
                </Button>
              </Card.Content>
            </Card>
          );
        }}
      />

      {/* ADD GOAL */}
      <Portal>
        <Dialog visible={dialogAdd} onDismiss={() => setDialogAdd(false)}>
          <Dialog.Title>Add Goal</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Nama" value={name} onChangeText={setName} />
            <TextInput
              label="Target"
              keyboardType="numeric"
              value={target}
              onChangeText={setTarget}
              style={{ marginTop: 10 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogAdd(false)}>Cancel</Button>
            <Button onPress={handleAddGoal}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* PAY GOAL */}
      <Portal>
        <Dialog visible={dialogPay} onDismiss={() => setDialogPay(false)}>
          <Dialog.Title>Tambah Tabungan</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Jumlah"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogPay(false)}>Cancel</Button>
            <Button onPress={handlePayGoal}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}