import { useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Station } from "../../types";
import { StationCard } from "../Station/StationCard";
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const PEEK_HEIGHT = 180;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.55;

interface StationWithDistance {
  station: Station;
  distance: number;
}

interface Props {
  stations: StationWithDistance[];
  onStationPress: (station: Station) => void;
}

export function StationListPanel({ stations, onStationPress }: Props) {
  const panelHeight = useRef(new Animated.Value(PEEK_HEIGHT)).current;
  const currentHeight = useRef(PEEK_HEIGHT);
  const isExpanded = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {
        const newHeight = currentHeight.current - gesture.dy;
        const clamped = Math.max(PEEK_HEIGHT, Math.min(EXPANDED_HEIGHT, newHeight));
        panelHeight.setValue(clamped);
      },
      onPanResponderRelease: (_, gesture) => {
        const target = gesture.dy < -50 ? EXPANDED_HEIGHT : gesture.dy > 50 ? PEEK_HEIGHT : currentHeight.current;
        currentHeight.current = target;
        isExpanded.current = target === EXPANDED_HEIGHT;
        Animated.spring(panelHeight, {
          toValue: target,
          useNativeDriver: false,
          bounciness: 4,
        }).start();
      },
    })
  ).current;

  const togglePanel = () => {
    const target = isExpanded.current ? PEEK_HEIGHT : EXPANDED_HEIGHT;
    currentHeight.current = target;
    isExpanded.current = !isExpanded.current;
    Animated.spring(panelHeight, {
      toValue: target,
      useNativeDriver: false,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[styles.panel, { height: panelHeight }]}>
      <View {...panResponder.panHandlers}>
        <TouchableOpacity style={styles.handleArea} onPress={togglePanel} activeOpacity={0.7}>
          <View style={styles.handle} />
          <Text style={styles.title}>
            {stations.length} {stations.length === 1 ? "estación" : "estaciones"}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={stations}
        keyExtractor={(item) => item.station.id}
        renderItem={({ item }) => (
          <StationCard
            station={item.station}
            distance={item.distance}
            onPress={() => onStationPress(item.station)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  handleArea: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  list: {
    paddingBottom: Spacing.xl,
  },
});
