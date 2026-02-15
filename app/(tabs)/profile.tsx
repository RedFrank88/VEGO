import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../stores/authStore";
import { useStationStore } from "../../stores/stationStore";
import { signOut } from "../../services/auth";
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme";

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const { favoriteIds } = useStationStore();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: () => signOut().catch(console.error),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.name}>{user?.displayName || "Usuario"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={24} color={Colors.error} />
          <Text style={styles.statValue}>{favoriteIds.length}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Ionicons name="leaf" size={24} color={Colors.primary} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Eco-puntos</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Ionicons name="location" size={24} color={Colors.primary} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Check-ins</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <MenuItem
          icon="notifications-outline"
          label="Notificaciones"
          onPress={() => Alert.alert("Próximamente", "Esta función estará disponible pronto")}
        />
        <MenuItem
          icon="settings-outline"
          label="Configuración"
          onPress={() => Alert.alert("Próximamente", "Esta función estará disponible pronto")}
        />
        <MenuItem
          icon="help-circle-outline"
          label="Ayuda"
          onPress={() => Alert.alert("Próximamente", "Esta función estará disponible pronto")}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

function MenuItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon as any} size={22} color={Colors.text} />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.text,
  },
  email: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  menuLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.error,
  },
});
