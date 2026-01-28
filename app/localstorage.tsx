import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function LocalStorage() {
    const [name, setName] = useState('');
    const [kelas, setKelas] = useState('');
    const [jurusan, setJurusan] = useState('');
    const [umur, setUmur] = useState('');

    const storeData = async () => {
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('kelas', kelas);
        await AsyncStorage.setItem('jurusan', jurusan);
        await AsyncStorage.setItem('umur', umur);
    }

    const getData = async () => {
        const storedName = await AsyncStorage.getItem('name');
        const storedKelas = await AsyncStorage.getItem('kelas');
        const storedJurusan = await AsyncStorage.getItem('jurusan');
        const storedUmur = await AsyncStorage.getItem('umur');

        if (storedName) {
            setName(storedName);
        }
        if (storedKelas) {
            setKelas(storedKelas);
        }
        if (storedJurusan) {    
            setJurusan(storedJurusan);
        }
        if (storedUmur) {
            setUmur(storedUmur);
        }
    }

    const removeData = async () => {
        await AsyncStorage.removeItem('name');
        setName('');
        await AsyncStorage.removeItem('kelas');
        setKelas('');
        await AsyncStorage.removeItem('jurusan');
        setJurusan('');
        await AsyncStorage.removeItem('umur');
        setUmur('');
    }

    useEffect(() => {
        getData();
    }, []);

    return(
        <SafeAreaView>
            <Text style={{color: 'white'}}>Nama : {name}</Text>
            <Text style={{color: 'white'}}>Kelas : {kelas}</Text>
            <Text style={{color: 'white'}}>Jurusan : {jurusan}</Text>
            <Text style={{color: 'white'}}>Umur : {umur}</Text>
            <TextInput placeholder="masukkan nama" onChangeText={setName} style={{borderColor: 'white', borderWidth: 1, padding: 10, color: 'white'}}></TextInput>
            <TextInput placeholder="masukkan kelas" onChangeText={setKelas} style={{borderColor: 'white', borderWidth: 1, padding: 10, color: 'white'}}></TextInput>
            <TextInput placeholder="masukkan jurusan" onChangeText={setJurusan} style={{borderColor: 'white', borderWidth: 1, padding: 10, color: 'white'}}></TextInput>
            <TextInput placeholder="masukkan umur" onChangeText={setUmur} style={{borderColor: 'white', borderWidth: 1, padding: 10, color: 'white'}}></TextInput>
            <Button title="Simpan" onPress={storeData}></Button>
            <Button title="Hapus" onPress={removeData}></Button>
            <Button title="Ambil" onPress={getData}></Button>
        </SafeAreaView>
    )
}