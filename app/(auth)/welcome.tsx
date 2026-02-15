import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="flash" size={64} color={Colors.textLight} />
        </View>
        <Text style={styles.title}>VEGO</Text>
        <Text style={styles.subtitle}>
          Encontrá cargadores para tu vehículo eléctrico en Uruguay
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.primaryButtonText}>Comenzar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.secondaryButtonText}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingTop: 120,
    paddingBottom: Spacing.xxl,
  },
  logoContainer: {
    alignItems: "center",
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "800",
    color: Colors.textLight,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginTop: Spacing.md,
    lineHeight: 24,
  },
  actions: {
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.textLight,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.primary,
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  secondaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textLight,
  },
});
