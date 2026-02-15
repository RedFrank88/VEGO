import { Stack } from "expo-router";
import { Colors } from "../../constants/theme";

export default function StationLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.textLight,
        headerTitleStyle: { fontWeight: "700" },
      }}
    />
  );
}
