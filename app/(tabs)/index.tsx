import React from "react";
import { Image, StyleSheet, Platform, Button, Text } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigationTypes";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          Bienvenue!
        </ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Text style={styles.explanatoryText}>
          Cette application vous permet de scanner des aliments et de vérifier
          leurs composition.{"\n"}
          <Text style={styles.emoji}>📸</Text> {"\n"}Grâce à la création d'un
          espace personnel, vous pourrez sélectionner votre régime alimentaire
          et lors du scan, {"\n"}une alerte <Text style={styles.emoji}>⚠️</Text>{" "}
          vous informera si un ingrédient non souhaité se trouve dedans!
        </Text>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Étape 1 : {"\n"}Créez votre espace !
        </ThemedText>
        <ThemedText>
          Cliquez sur{" "}
          <ThemedText type="defaultSemiBold">Espace Personnel</ThemedText> pour
          créer votre compte. {"\n"}Vous aurez alors accès à la liste de vos
          aliments favoris et bien plus encore!{" "}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Étape 2: {"\n"}Scannez !</ThemedText>
        <ThemedText>
          <Button
            title="Scannez un nouvel aliment"
            onPress={() => navigation.navigate("ScanScreen")}
          />
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Étape 3: {"\n"}Swippez !</ThemedText>
        <ThemedText>
          Swippez vers la <Text style={styles.greenText}>gauche</Text> pour
          ajouter au <Text style={styles.greenText}>favoris</Text> et vers la{" "}
          <Text style={styles.redText}>droite</Text> pour{" "}
          <Text style={styles.redText}>supprimer</Text> l'aliment scanné!
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    textAlign: "center",
    flex: 1,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  explanatoryText: {
    fontSize: 16,
    color: "#4A90E2",
    marginVertical: 10,
    textAlign: "center",
  },
  emoji: {
    fontSize: 20,
  },
  redText: {
    fontWeight: "bold",
    color: "red",
  },
  greenText: {
    fontWeight: "bold",
    color: "green",
  },
});
