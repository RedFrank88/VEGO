import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { CAR_COLORS, ANIMAL_EMOJIS, DEFAULT_AVATAR_ID } from "../../constants/avatars";

interface Props {
  latitude: number;
  longitude: number;
  heading: number | null;
  avatarId: string;
}

export function UserLocationMarker({ latitude, longitude, heading, avatarId }: Props) {
  if (avatarId === DEFAULT_AVATAR_ID) return null;

  const car = CAR_COLORS.find((c) => c.id === avatarId);
  const animal = ANIMAL_EMOJIS.find((a) => a.id === avatarId);

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      flat
      rotation={heading ?? 0}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
    >
      {car && (
        <View style={[styles.carCircle, { backgroundColor: car.color }]}>
          <Ionicons name="car" size={20} color="#fff" />
        </View>
      )}
      {animal && (
        <View style={styles.animalCircle}>
          <Text style={styles.emoji}>{animal.emoji}</Text>
        </View>
      )}
    </Marker>
  );
}

const styles = StyleSheet.create({
  carCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  animalCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  emoji: {
    fontSize: 20,
  },
});
