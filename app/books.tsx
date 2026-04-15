// import { Alert, FlatList, Image, Text, View } from "react-native";
// import { Appbar, Button, Card, Dialog, Portal, TextInput } from "react-native-paper";
// import { useEffect, useState } from "react";

// import * as ImagePicker from 'expo-image-picker';
// import * as SQLite from 'expo-sqlite';
// import { SafeAreaView } from "react-native-safe-area-context";


// const db = SQLite.openDatabaseSync("books.db", {
//   useNewConnection: true,
// });
// export default function BooksPage() {
//   const [visible, setVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     writer: "",
//     yearPublished: "",
//     category: "",
//     description: "",
//     image: "",
//   });

//   const [books, setBooks] = useState<any[]>([]);
//   const [editBooksId, setEditBooksId] = useState(null);


//   async function initDatabase() {
//     try {
//       await db.execAsync(
//         `CREATE TABLE IF NOT EXISTS books (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT,
//         writer TEXT,
//         yearPublished TEXT,
//         category TEXT,
//         description TEXT,
//         image TEXT
//       );`
//       );
//     }
//     catch (e) { }
//   }

//   useEffect(() => {
//     initDatabase();
//     fetchBooks();
//   }, []);

//   async function fetchBooks() {
//     try {
//       const result = await db.getAllAsync(`SELECT * FROM books ORDER BY id DESC`);
//       setBooks(result);
//     } catch (error) {
//       Alert.alert("Error", "Failed to fetch books.");
//       console.error(error);
//     }
//   }

//   async function pickImage() {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images"],
//         allowsEditing: true,
//         aspect: [3, 4],
//         quality: 0.8,
//       });
//       if (!result.canceled) {
//         setFormData({ ...formData, image: result.assets[0].uri });
//       }
//     } catch (e) {
//       console.log(e);
//       alert("Failed to pick image.");
//     }
//     }
 

//   async function AddBook() {
//     try {
//       await db.runAsync(
//         `INSERT INTO BOOKS (title, writer, yearPublished, category, description, image) VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           formData.title,
//           formData.writer,
//           formData.yearPublished,
//           formData.category,
//           formData.description,
//           formData.image,
//         ]
//       );


//       const newBooks = {
//         id: Date.now(),
//         title: formData.title,
//         writer: formData.writer,
//         yearPublished: formData.yearPublished,
//         category: formData.category,
//         description: formData.description,
//         image: formData.image,
//       };

//       setBooks([...books, newBooks]);
//       setVisible(false);
//       setFormData({
//         title: "",
//         writer: "",
//         yearPublished: "",
//         category: "",
//         description: "",
//         image: "",

//       })


//     } catch (erorr) {
//       Alert.alert("Erorr", "Gagal Menambahkan Buku");
//       console.error(erorr);
//     }
//   }

//   async function deleteBook(id: string) {
//     try {

//       await db.runAsync(`DELETE FROM books WHERE id = ?`, [id]);
//       const updatedBooks = books.filter((book) => book.id !== id);
//       setBooks(updatedBooks);

//     } catch (error) {
//      Alert.alert("Error", "Failed to delete book.");
//      console.error(error); 
//     }
//   }
  

//   async function editBook() {
//     try {
//       await db.runAsync(`UPDATE books SET title = ?, writer = ?, yearPublished = ?, category = ?, description = ?, image = ? WHERE id = ?`,
//       [
//         formData.title,
//         formData.writer,
//         formData.yearPublished,
//         formData.category,
//         formData.description,
//         formData.image,
//         editBooksId
//       ]
//       );
//       const updatedBooks = books.map((book) => {
//         if (book.id === editBooksId) {
//           return {
//             ...book,
//             title: formData.title,
//             writer: formData.writer,
//             yearPublished: formData.yearPublished,
//             category: formData.category,
//             description: formData.description,
//             image: formData.image, 
//           }
//         }
//         return book;
//       })
//       setBooks(updatedBooks);
//       setVisible(false);
//       setEditBooksId(null);
//       setFormData({
//         title: "",
//         writer: "",
//         yearPublished: "",
//         category: "",
//         description: "",
//         image: "",
//       });
//     } catch (error) {
//       Alert.alert("Error", "Failed to edit book.");
//       console.error(error);
//     }
//   }

//     return (
//       <SafeAreaView>
//         <View>
//           <Appbar.Header>
//             <Appbar.Content title="Books" />
//             <Appbar.Action
//               icon="plus"
//               onPress={() => {
//                 setVisible(true);
//               }}
//             />
//           </Appbar.Header>

//           <View>
//             <View
//               style={{
//                 padding: 8,
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 justifyContent: "space-between",
//                 gap: 12,
//               }}
//             >

//               <FlatList
//                 data={books}
//                 keyExtractor={(item, index) => index.toString()}
//                 numColumns={2}
                
//                 renderItem={({ item }) => (
//                    <Card style={{ width: "48%", padding: 8, marginBottom: 12 }}>
//                 <Card.Cover
//                 style={{ margin:5 }}
//                   source={{
//                     uri: item.image,                  }}
//                 />
//                 <View style={{ marginTop: 8, marginBottom: 4 }}>
//                   <Text style={{ fontSize: 20, fontWeight: "bold",color: 'white' }}>
//                     {item.title}
//                   </Text>
//                       <Text style={{ fontSize: 11, color: "white" }}>{item.writer}-{item.yearPublished}-{item.category}</Text>
//                   <Text style={{ fontSize: 11, color: "white" }}>
//                    {item.description}
//                   </Text>
//                 </View>
//                 <View style={{flexDirection:"column", gap:8}}>
//                   <Button mode="contained" onPress={() => {
//                     setEditBooksId(item.id);
//                     setVisible(true);
//                     setFormData({
//                       title: item.title,
//                       writer: item.writer,
//                       yearPublished: item.yearPublished,
//                       category: item.category,
//                       description: item.description,
//                       image: item.image
//                     })
//                   }}>Edit</Button>
//                   <Button mode="contained" buttonColor="red" onPress={() => deleteBook(item.id)}>Delete</Button>
//                 </View>
//               </Card>
//                 )}
//               />
              
//             </View>
//           </View>
//         </View>
//         <Portal>
//           <Dialog
//             visible={visible}
//             onDismiss={() => {
//               setVisible(false);
//             }}
//           >
//             <Dialog.Title>{editBooksId ? "Edit Book" : "Add New Book"}</Dialog.Title>
//             <Dialog.Content>
//               <View style={{ marginBottom: 16 }}>
//                 <View style={{ alignItems: "center" }}>
//                   {formData.image ? (
//                     <View
//                       style={{
//                         width: 120,
//                         height: 160,
//                         backgroundColor: "#f0f0f0",
//                         borderRadius: 8,
//                         overflow: "hidden",
//                         marginBottom: 8,
//                       }}
//                     >
//                       <Image
//                         source={{ uri: formData.image }}
//                         style={{ width: "100%", height: "100%" }}
//                       />
//                     </View>
//                   ) : (
//                     <View
//                       style={{
//                         width: 120,
//                         height: 160,
//                         backgroundColor: "#f0f0f0",
//                         borderRadius: 8,
//                         justifyContent: "center",
//                         alignItems: "center",
//                         overflow: "hidden",
//                         marginBottom: 8,
//                       }}
//                     >
//                       <Text style={{ textAlign: "center" }}>
//                         tidak ada gambar{" "}
//                       </Text>
//                     </View>
//                   )}
//                 </View>

//                 <Button onPress={pickImage} mode="outlined">
//                   Pick an image
//                 </Button>
//                 <TextInput
//                   mode="outlined"
//                   label="Book Title"
//                   onChangeText={(text: any) => {
//                     setFormData({ ...formData, title: text });
//                   }}
//                   style={{ marginBottom: 12 }}
//                 />

//                 <TextInput
//                   mode="outlined"
//                   label="Writer"
//                   onChangeText={(text: any) => {
//                     setFormData({ ...formData, writer: text });
//                   }}
//                   style={{ marginBottom: 12 }}
//                 />

//                 <TextInput
//                   mode="outlined"
//                   label="Year Published"
//                   onChangeText={(text: any) => {
//                     setFormData({ ...formData, yearPublished: text });
//                   }}
//                   keyboardType="number-pad"
//                   style={{ marginBottom: 12 }}
//                 />

//                 <TextInput
//                   mode="outlined"
//                   label="Category"
//                   style={{ marginBottom: 12 }}
//                 />

//                 <TextInput
//                   mode="outlined"
//                   label="Description"
//                   onChangeText={(text: any) => {
//                     setFormData({ ...formData, description: text });
//                   }}
//                   multiline
//                   numberOfLines={4}
//                   style={{ marginBottom: 12 }}
//                 />
//               </View>
//             </Dialog.Content>

//             <Dialog.Actions>
//               <Button
//                 onPress={() => {
//                   setVisible(false);

//                 }}
//               >Close</Button>
//               <Button onPress={() => {if (editBooksId) {editBook();} else {AddBook();}}}>{editBooksId ? "Edit" : "Add"}</Button>
//             </Dialog.Actions>


//           </Dialog>
//         </Portal>
//       </SafeAreaView>
//     );
//   }