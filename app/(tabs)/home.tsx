import { supabase } from "@/lib/db";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";

export default function Budget() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [formType, setFormType] = useState("out");
  const [formAmount, setFormAmount] = useState("0");
  const [formDescription, setFormDescription] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState("food");

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async function handleAdd() {
    if (!formAmount || formAmount <= "0") {
      return Alert.alert("Jumlah harus lebih dari 0");
    }

    if (!formDescription) {
      return Alert.alert("Deskripsi tidak boleh kosong");
    }

    const user = await getUser();
    if (!user) {
      return Alert.alert("User tidak ditemukan");
    }

    const { error } = await supabase.from("transactions").insert({
      type: formType,
      amount: parseInt(formAmount),
      description: formDescription,
      category: categories,
      user_id: user.id,
    });

    if (error) {
      Alert.alert("gagal menambahkan transaksi", error.message);
    }

    setFormAmount("0");
    setFormDescription("");
    setFormType("out");
    setDialogVisible(false);
    fetchTransactions();
  }

  async function fetchTransactions() {
    const user = await getUser();
    if (!user) {
      return Alert.alert("User tidak ditemukan");
    }
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Gagal Memngambil data", error.message);
    } else {
      setTransactions(data);
    }
  }

  async function handleDelete(id: number) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);
    if (error) {
      Alert.alert("Gagal menghapus transaksi", error.message);
    } else {
      fetchTransactions();
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIn = transactions
    .filter((t) => t.type === "in")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions
    .filter((t) => t.type === "out")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = totalIn - totalOut;

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <Appbar.Header style={{ backgroundColor: "#0f172a" }}>
        <Appbar.Content title="Finance" titleStyle={{ color: "white" }} />
        <Appbar.Action icon="plus" color="white" onPress={() => setDialogVisible(true)} />
      </Appbar.Header>

      {/* SALDO CARD */}
      <View style={{ padding: 16 }}>
        <Card
          style={{
            borderRadius: 24,
            backgroundColor: "#1e293b",
            padding: 10,
          }}>
          <Card.Content>
            <Text style={{ color: "#94a3b8" }}>Total Balance</Text>
            <Text
              style={{
                color: "#22c55e",
                fontSize: 32,
                fontWeight: "bold",
                marginVertical: 10,
              }}>
              Rp {saldo.toLocaleString("id-ID")}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <View>
                <Text style={{ color: "#94a3b8" }}>Income</Text>
                <Text style={{ color: "#22c55e" }}>
                  + Rp {totalIn.toLocaleString("id-ID")}
                </Text>
              </View>

              <View>
                <Text style={{ color: "#94a3b8" }}>Expense</Text>
                <Text style={{ color: "#ef4444" }}>
                  - Rp {totalOut.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* LIST */}
      <FlatList
        data={transactions}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={{
              marginBottom: 12,
              borderRadius: 20,
              backgroundColor: "#1e293b",
            }}>
            <Card.Content
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <View>
                <Text style={{ color: "white", fontWeight: "600", marginBottom:4 }}>
                  {item.description}
                </Text>
                <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: item.type === "in" ? "#22c55e" : "#ef4444",
                    marginRight: 6,
                    fontWeight: "bold",
                  }}>
                  {item.type === "in" ? "+" : "-"}Rp
                  {item.amount.toLocaleString("id-ID")}
                </Text>

                <IconButton
                  icon="trash-can-outline"
                  iconColor="#94a3b8"
                  size={18}
                  onPress={() => handleDelete(item.id)}
                />
              </View>
            </Card.Content>
          </Card>
        )}
      />

      {/* DIALOG */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Tambah</Dialog.Title>
          <Dialog.Content>
            <SegmentedButtons
              value={formType}
              onValueChange={setFormType}
              buttons={[
                { value: "in", label: "Income" },
                { value: "out", label: "Expense" },
              ]}
              style={{ marginBottom: 16 }}
            />

            <TextInput
              label="Amount"
              keyboardType="numeric"
              value={formAmount}
              onChangeText={setFormAmount}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />

            <Picker
              selectedValue={categories}
              onValueChange={(v) => setCategories(v)}>
              <Picker.Item label="Food" value="food" />
              <Picker.Item label="Shopping" value="shopping" />
              <Picker.Item label="Transport" value="transportation" />
              <Picker.Item label="Other" value="others" />
            </Picker>

            <TextInput
              label="Description"
              value={formDescription}
              onChangeText={setFormDescription}
              mode="outlined"
              style={{ marginTop: 12 }}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleAdd}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
