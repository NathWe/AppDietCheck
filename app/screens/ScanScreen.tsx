import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState<any>(null);

  const fetchProductData = async (barcode: string) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();
      setProductInfo(data.product);
    } catch (error) {
      Alert.alert("Error", "Unable to fetch product data.");
    }
  };

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    fetchProductData(data);
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleSwipeRight = async () => {
    try {
      if (auth.currentUser) {
        await addDoc(collection(db, "favorites"), {
          userId: auth.currentUser.uid,
          product: productInfo,
        });
        Alert.alert("Success", "Produit ajouté aux favoris!");
      } else {
        Alert.alert("Error", "User not logged in.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to add to favorites.");
    }
  };

  const handleSwipeLeft = () => {
    Alert.alert("Info", "Produit rejeté!");
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const translateAllergens = (allergens: string) => {
    const translations: { [key: string]: string } = {
      "en:gluten": "Gluten",
      "en:milk": "Lait",
      "en:eggs": "Œufs",
      "en:peanuts": "Arachides",
      "en:nuts": "Fruits à coque",
      "en:soy": "Soja",
      "en:soybeans": "Soja",
      "en:fish": "Poisson",
      "en:shellfish": "Crustacés",
      "en:molluscs": "Mollusques",
      "en:sesame": "Sésame",
      "en:celery": "Céleri",
      "en:mustard": "Moutarde",
      "en:lupin": "Lupin",
      "en:sulphite": "Sulfites",
      "en:wheat": "Blé",
      "en:barley": "Orge",
      "en:rye": "Seigle",
      "en:oats": "Avoine",
      // Ajoutez d'autres traductions si nécessaire
    };
    return allergens
      .split(",")
      .map((allergen) => translations[allergen.trim()] || allergen.trim());
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && productInfo && (
        <Swipeable
          renderLeftActions={() => (
            <View style={styles.leftAction}>
              <Text style={styles.actionText}>Ajouter aux favoris</Text>
            </View>
          )}
          renderRightActions={() => (
            <View style={styles.rightAction}>
              <Text style={styles.actionText}>Rejeter</Text>
            </View>
          )}
          onSwipeableLeftWillOpen={handleSwipeRight}
          onSwipeableRightWillOpen={handleSwipeLeft}
        >
          <ScrollView contentContainerStyle={styles.productInfo}>
            {productInfo.image_url && (
              <Image
                source={{ uri: productInfo.image_url }}
                style={styles.productImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Nom de l'article :</Text>
              <Text style={styles.value}>{productInfo.product_name}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Marque :</Text>
              <Text style={styles.value}>{productInfo.brands}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Ingrédients :</Text>
              <Text style={styles.value}>{productInfo.ingredients_text}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Allergènes :</Text>
              <View style={styles.allergensContainer}>
                {translateAllergens(productInfo.allergens).map(
                  (allergen, index) => (
                    <Text key={index} style={styles.allergenItem}>
                      {allergen}
                    </Text>
                  )
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.scanButtonText}>
                Cliquez ici pour scanner un nouvel article
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Swipeable>
      )}
      {scanned && (
        <Button
          title={"Cliquez ici pour scanner un nouvel article"}
          onPress={() => setScanned(false)}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  productInfo: {
    padding: 20,
    backgroundColor: "white",
    alignItems: "center", // Centrer le contenu horizontalement
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  leftAction: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 20,
  },
  rightAction: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 20,
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
  },
  infoContainer: {
    marginVertical: 8,
    alignSelf: "stretch",
  },
  label: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  value: {
    fontWeight: "normal",
    textDecorationLine: "none",
  },
  allergensContainer: {
    marginTop: 4,
    paddingLeft: 16,
  },
  allergenItem: {
    fontSize: 14,
    color: "darkred",
  },
  scanButton: {
    marginTop: 20,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  scanButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ScanScreen;
