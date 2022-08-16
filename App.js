import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
// import Title from "./components/Title";  // for test

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({}); // toDos[Date.now()] = {text: "sth", work: true}
  const play = () => setWorking(false);
  const work = () => setWorking(true);

  useEffect(() => {
    LoadTodos();
  }, []);

  const clearAll = async () => {
    Alert.alert("Delete All", "정말로 모든 항목을 삭제하시겠습나까?", [
      { text: "아니오" },
      {
        text: "예",
        style: "destructive",
        onPress: async () => {
          try {
            setToDos({});
            await AsyncStorage.clear();
          } catch (e) {
            Alert("실패");
          }
        },
      },
    ]);
  };

  const LoadTodos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
    } catch (e) {
      console.log(e);
    }
  };

  const saveTodos = async (toSave) => {
    // asyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };

  const addTodo = async () => {
    if (text === "") {
      return;
    } else {
      // const newToDos = Object.assign({}, toDos, {[Date.now()]: {text, working}});
      const newToDos = {
        ...toDos,
        [Date.now()]: { text, working, done: false },
      };
      setToDos(newToDos);
      await saveTodos(newToDos);
      setText("");
    }
  };

  const deleteTodo = (key) => {
    Alert.alert("Delete To Do", "정말로 삭제하시겠습나까?", [
      { text: "취소" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveTodos(newToDos);
        },
      },
    ]);
  };

  const checkTodo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].done = !newToDos[key].done;
    setToDos(newToDos);
    saveTodos(newToDos);
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
            WORK
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={play}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.gray : theme.text,
            }}
          >
            PLAY
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
        {toDos &&
          Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <TouchableWithoutFeedback onPress={() => checkTodo(key)}>
                    {!toDos[key].done ? (
                      <Fontisto
                        name="checkbox-passive"
                        size={20}
                        color={theme.text}
                        style={styles.icon}
                      />
                    ) : (
                      <Fontisto
                        name="checkbox-active"
                        size={18}
                        color={theme.gray}
                        style={styles.icon}
                      />
                    )}
                  </TouchableWithoutFeedback>
                  <Text
                    style={
                      !toDos[key].done ? styles.toDoText : styles.toDoTextDone
                    }
                  >
                    {toDos[key].text}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <AntDesign
                    name="delete"
                    size={24}
                    color={theme.gray}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            ) : null
          )}
        {toDos && Object.keys(toDos).length !== 0 && (
          <Text style={styles.smallText} onPress={clearAll}>
            전체 삭제
          </Text>
        )}
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toDoText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "500",
  },
  toDoTextDone: {
    color: theme.gray,
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "line-through",
  },
  icon: {
    paddingHorizontal: 5,
  },
  smallText: {
    fontSize: 10,
    color: theme.text,
    marginLeft: "auto",
    marginRight: 20,
  },
});
