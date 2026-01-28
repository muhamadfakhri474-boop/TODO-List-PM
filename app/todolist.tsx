import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodoListPage() {
    const [todos, setTodos] = useState<string[]>([]);
    const [inputText, setInputText] = useState("");

    const addTodo = () => {
        if (inputText.trim()) {
            const newTodos = [...todos, inputText.trim()];
            setTodos(newTodos);
            AsyncStorage.setItem("todos", JSON.stringify(newTodos));
            setInputText("");
        }
    };

    const deleteTodo = (index: number) => {
        const newTodos = todos.filter((_, i) => i !== index);
        setTodos(newTodos);
        AsyncStorage.setItem("todos", JSON.stringify(newTodos));
    };

    const loadTodos = async () => {
        const stored = await AsyncStorage.getItem("todos");
        if (stored) {
            setTodos(JSON.parse(stored));
        }
    };

    const clearAll = () => {
        setTodos([]);
        AsyncStorage.removeItem("todos");
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>Todo List</Text>
            
            <TextInput
                placeholder="Masukan"
                value={inputText}
                onChangeText={setInputText}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />
            
            <Button title="Tambah" onPress={addTodo} />
            <View style={{marginBottom: 10}}/>
            <Button title="Tambah Data" onPress={loadTodos} />
            <View style={{marginBottom: 10 }}/>
            <Button title="Hapus Semua" onPress={clearAll} />
            <View style={{marginBottom: 10 }}/>

            <View style={style.tableHeader}>
                        <Text style={style.headerNumber}>No</Text>
                        <Text style={style.headerText}>Todo</Text>
                        <Text style={style.headerAction}>Aksi</Text>
                    </View>

            <FlatList
                data={todos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={style.tableRow}>
                        <Text style={style.tableNumber}>{index + 1}</Text>
                        <Text style={style.tableText}>{item}</Text>
                        <TouchableOpacity 
                            style={style.tableDeleteButton}
                            onPress={() => deleteTodo(index)}
                        >
                            <Text style={style.deleteButtonText}>🗑</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
const style = StyleSheet.create({
    tableHeader: {
        flexDirection:'row',
        backgroundColor:'#a79e9e7b',
        padding:12,
        borderColor:'#ddd',
        borderTopLeftRadius:8,
        borderTopRightRadius:9,
    },
    headerNumber: {
        width: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    headerAction: {
        width: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
     tableRow: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#000000ff',
        alignItems: 'center',
    },
    tableNumber: {
        width: 40,
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
    },
    tableText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingHorizontal: 10,
    },
    tableDeleteButton: {
        width: 60,
        alignItems: 'center',
        padding: 5,
    },
    deleteButtonText: {
        fontSize: 18,
    },
    
    
})