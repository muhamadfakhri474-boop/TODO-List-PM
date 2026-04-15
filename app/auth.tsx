import { Alert, View } from "react-native";
import { useState } from "react";
import { Card, SegmentedButtons, Text, TextInput, Button } from "react-native-paper";
import { supabase } from "@/lib/supabase";


export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Mode, setMode] = useState("login");


    async function handleSubmit() {
        if (email === null || password === null) {
            alert("Email dan password tidak boleh kosong");
            return;
        }

        if (Mode === "login") {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) {
              Alert.alert("Error", error.message);
              return;
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
              Alert.alert("Error", error.message);
              return;
            }
        }

    }
    
  return (
    <View style={{ flex: 1, justifyContent: "center"}}>
        <Card>
            <Card.Content>
                <Text variant="headlineMedium"> Authentication</Text>
                <Text variant="bodyMedium">Masuk atau buat akun baru untuk melanjutkan</Text>
                <SegmentedButtons
                    value="login"
                    onValueChange={() => console.log()}
                    buttons={[
                        {
                            value: "login",
                            label: "Masuk", 
                        },
                        {
                            value: "register",
                            label: "Daftar",
                        },
                    ]}
                    style={{ marginBottom: 16 }}
                />  

                    <TextInput
                        label={"Email"}
                        placeholder="Masukan email Anda"
                        keyboardType="email-address"
                        style={{ marginBottom: 12 }}
                        onChangeText={() => {}}
                        value={""}
                    />
                        
                    <TextInput
                        label={"Password"}
                        placeholder="Masukan Password"
                        keyboardType="email-address"
                        secureTextEntry
                        style={{ marginBottom: 12 }}
                        onChangeText={() => {}}
                        value={""}
                    />
                    
                 <Button mode="contained" onPress={() => {}}>
                   Masuk
                 </Button>
            </Card.Content>
        </Card>
    </View> 
  );
}