import { supabase } from "@/lib/db";
import { useEffect, useState } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { Text, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [savings, setSavings] = useState<any[]>([]);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async function fetchData() {
    const user = await getUser();
    if (!user) return;

    const { data: trx } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id);

    const { data: sav } = await supabase
      .from("savings")
      .select("*")
      .eq("user_id", user.id);

    setTransactions(trx || []);
    setSavings(sav || []);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // 📊 CALCULATIONS
  // =========================

  const totalIn = transactions
    .filter((t) => t.type === "in")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter((t) => t.type === "out")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIn - totalOut;

  // =========================
  // 🥧 CATEGORY BREAKDOWN
  // =========================

  const categoryMap: any = {};

  transactions
    .filter((t) => t.type === "out")
    .forEach((t) => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += t.amount;
    });

  const pieData = Object.keys(categoryMap).map((key, index) => ({
    name: key,
    amount: categoryMap[key],
    color: ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7"][index % 5],
    legendFontColor: "white",
    legendFontSize: 12,
  }));

  // =========================
  // 🎯 SAVINGS
  // =========================

  const totalSaved = savings.reduce((sum, s) => sum + s.saved, 0);
  const totalTarget = savings.reduce((sum, s) => sum + s.target, 0);
  const savingsPercent =
    totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const completedGoals = savings.filter((s) => s.is_reached).length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      {/* SUMMARY */}
      <View style={{ padding: 16 }}>
  <LinearGradient
    colors={["#6366f1", "#22d3ee"]} // ungu → cyan biar beda dari home
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      borderRadius: 24,
      padding: 16,
    }}>
    
    <Text style={{ color: "#e0f2fe" }}>Balance</Text>

    <Text
      style={{
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        marginVertical: 10,
      }}>
      Rp {balance.toLocaleString("id-ID")}
    </Text>

    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
      }}>
      
      <View>
        <Text style={{ color: "#e0f2fe" }}>Income</Text>
        <Text style={{ color: "white", fontWeight: "600" }}>
          + Rp {totalIn.toLocaleString("id-ID")}
        </Text>
      </View>

      <View>
        <Text style={{ color: "#e0f2fe" }}>Expense</Text>
        <Text style={{ color: "white", fontWeight: "600" }}>
          - Rp {totalOut.toLocaleString("id-ID")}
        </Text>
      </View>

    </View>
  </LinearGradient>
</View>

      {/* BAR CHART */}
      <Text style={{ color: "white", marginLeft: 16, marginBottom: 10 }}>
        Income vs Expense
      </Text>

      <BarChart
        data={{
          labels: ["Income", "Expense"],
          datasets: [
            {
              data: [totalIn, totalOut],
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisLabel="Rp "
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#1e293b",
          backgroundGradientFrom: "#1e293b",
          backgroundGradientTo: "#1e293b",
          decimalPlaces: 0,
          color: () => "#22c55e",
          labelColor: () => "#94a3b8",
        }}
        style={{
          marginVertical: 10,
          borderRadius: 20,
          alignSelf: "center",
        }}
      />

      {/* PIE CHART */}
      <Text style={{ color: "white", marginLeft: 16, marginTop: 20 }}>
        Spending by Category
      </Text>

      {pieData.length > 0 && (
        <PieChart
          data={pieData}
          width={screenWidth}
          height={220}
          chartConfig={{
            color: () => "white",
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      )}

      {/* SAVINGS */}
      <View style={{ padding: 16, marginBottom: 80 }}>
        <Card style={{ backgroundColor: "#1e293b", borderRadius: 20 }}>
          <Card.Content>
            <Text style={{ color: "#94a3b8" }}>Savings Progress</Text>
            <Text style={{ color: "#22c55e", fontSize: 24 }}>
              {savingsPercent.toFixed(0)}%
            </Text>

            <Text style={{ color: "white", marginTop: 6 }}>
              Rp {totalSaved.toLocaleString("id-ID")} /{" "}
              {totalTarget.toLocaleString("id-ID")}
            </Text>

            <Text style={{ color: "#94a3b8", marginTop: 6 }}>
              Goals Completed: {completedGoals}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}