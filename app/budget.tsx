import { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  List,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { supabase } from "../lib/supabase";

export default function Budget() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [formType, setFormType] = useState("out");
  const [formAmount, setformAmount] = useState("0");
  const [formDescription, setformDescription] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  async function fetchTransaction() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Gagal mengambil data transaksi", error.message);
    } else {
      setTransactions(data);
    }
  }

  useEffect(() => {
    fetchTransaction();
  }, []);

  const totalIn = transactions
    .filter((t) => t.type === "in")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter((t) => t.type === "out")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = totalIn - totalOut;

  function formatCurrency(amount: number) {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  }

  async function handleAdd() {
    if (!formAmount || formAmount <= "0") {
      return Alert.alert("Jumlah harus lebih besar dari 0");
    }
    if (!formDescription) {
      return Alert.alert("Deskripsi tidak boleh kosong");
    }

    const { error } = await supabase.from("transactions").insert({
      type: formType,
      amount: parseInt(formAmount),
      description: formDescription,
    });

    if (error) {
      Alert.alert("Gagal menambahkan transaksi", error.message);
    }

    setformAmount("0");
    setformDescription("");
    setFormType("out");
    setDialogVisible(false);
    fetchTransaction();
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      Alert.alert("Gagal menghapus transaksi", error.message);
    } else {
      fetchTransaction();
    }
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Budget" />
        <Appbar.Action icon="plus" onPress={() => setDialogVisible(true)} />
      </Appbar.Header>

      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Text variant="labelSmall">Sisa Saldo</Text>
          <Text variant="displaySmall" style={{ color: "green" }}>
            {" "}
            {formatCurrency(saldo)}
          </Text>

          <Divider style={{ marginVertical: 12 }} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <View style={{ alignItems: "center" }}>
              <Text variant="labelSmall">Pemasukan</Text>
              <Text variant="titleSmall"> {formatCurrency(totalIn)}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text variant="labelSmall">Pengeluaran</Text>
              <Text variant="titleSmall" style={{ color: "red" }}>
                {" "}
                {formatCurrency(totalOut)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={{ marginHorizontal: 16 }}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.description}
              description={new Date(item.created_at).toLocaleString()}
              left={() => (
                <List.Icon
                  icon={
                    item.type === "in" ? "arrow-up-circle" : "arrow-down-circle"
                  }
                  color={item.type === "in" ? "green" : "red"}
                />
              )}
              right={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text variant="labelLarge" style={{ color: "red" }}>
                    {item.type === "in" ? "+" : "-"}{" "}
                    {formatCurrency(item.amount)}
                  </Text>
                  <IconButton
                    icon="delete-outline"
                    size={18}
                    onPress={() => {
                      handleDelete(item.id);
                    }}
                  />
                </View>
              )}
            />
          )}
        />
      </View>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Tambah Transaksi</Dialog.Title>
          <Dialog.Content>
            <SegmentedButtons
              value={formType}
              onValueChange={(v) => {
                setFormType(v);
              }}
              buttons={[
                { value: "in", label: "Pemasukan", icon: "arrow-up-circle" },
                {
                  value: "out",
                  label: "Pengeluaran",
                  icon: "arrow-down-circle",
                },
              ]}
              style={{ marginBottom: 16 }}
            />

            <TextInput
              label={"Jumlah (Rp)"}
              keyboardType="numeric"
              value={formAmount}
              onChangeText={(v) => {
                setformAmount(v);
              }}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />

            <TextInput
              label={"Deskripsi"}
              value={formDescription}
              onChangeText={(v) => {
                setformDescription(v);
              }}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Batal</Button>
            <Button
              onPress={() => {
                handleAdd();
              }}
              mode="contained"
            >
              Simpan
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
