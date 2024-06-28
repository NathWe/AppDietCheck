import React from "react";
import { Linking, Platform, Text, TouchableOpacity, Alert } from "react-native";
import { openBrowserAsync } from "expo-web-browser";

type Props = {
  href: string;
  children: React.ReactNode;
  style?: any;
};

export function ExternalLink({ href, children, style }: Props) {
  const handlePress = async () => {
    if (Platform.OS !== "web") {
      try {
        await openBrowserAsync(href);
      } catch (error) {
        Alert.alert("Erreur", "Impossible d'ouvrir le lien.");
      }
    } else {
      Linking.openURL(href);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
}
