// app/components/Collapsible.tsx
import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type CollapsibleProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function Collapsible({
  title,
  isOpen,
  onToggle,
  children,
}: CollapsibleProps) {
  return (
    <View>
      <TouchableOpacity onPress={onToggle} style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
  },
  content: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
  },
});
