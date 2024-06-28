import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebaseConfig"; // Assurez-vous d'importer votre configuration Firebase
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../navigationTypes";

const ExploreScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null); // Définir le type approprié pour user
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const stayLoggedIn = await AsyncStorage.getItem("stayLoggedIn");
      if (stayLoggedIn === "true") {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
          }
        });
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (stayLoggedIn) {
        await AsyncStorage.setItem("stayLoggedIn", "true");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to sign in");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      await AsyncStorage.removeItem("stayLoggedIn");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Se connecter</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setStayLoggedIn(!stayLoggedIn)}>
            <Text style={styles.checkbox}>{stayLoggedIn ? "☑" : "☐"}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Rester connecté</Text>
        </View>
        <Button title="Connexion" onPress={handleLogin} />
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.link}>Je m'inscris</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Mot de passe oublié</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espace Personnel</Text>
      {/* Ajoutez ici les sections de votre espace personnel */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  link: {
    color: "blue",
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    fontSize: 18,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ExploreScreen;
