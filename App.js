import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({}); // toDos[Date.now()] = {text: "sth", work: true}
  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  useEffect(() => {
    LoadTodos();
  }, [])

  const LoadTodos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
    } catch (e) {
      console.log(e);
    }
  }

  const saveTodos = async (toSave) => {
    // asyncStorage 
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  }

  const addTodo = async () => {
    if (text === "") {
      return;
    } else {
      // const newToDos = Object.assign({}, toDos, {[Date.now()]: {text, work: working}});
      const newToDos = {
        ...toDos,
        [Date.now()]: { text, working },
      };
      setToDos(newToDos);
      await saveTodos(newToDos);
      setText("");
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.text : theme.gray,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.gray : theme.text,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={(payload) => setText(payload)}
        onSubmitEditing={addTodo}
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
      ></TextInput>
      <ScrollView>
        {Object.keys(toDos).map(key => 
        toDos[key].working === working ?
        (<View style={styles.toDo} key={key}>
          <Text style={styles.toDoText}>{toDos[key].text}</Text>
        </View>): null)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  btnText: {
    color: theme.text,
    fontSize: 44,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  toDoText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
