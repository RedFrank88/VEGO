export const DEFAULT_AVATAR_ID = "default";

export const CAR_COLORS = [
  { id: "car-red", color: "#F44336" },
  { id: "car-pink", color: "#E91E63" },
  { id: "car-purple", color: "#9C27B0" },
  { id: "car-blue", color: "#2196F3" },
  { id: "car-cyan", color: "#00BCD4" },
  { id: "car-teal", color: "#009688" },
  { id: "car-green", color: "#4CAF50" },
  { id: "car-lime", color: "#8BC34A" },
  { id: "car-yellow", color: "#FFEB3B" },
  { id: "car-orange", color: "#FF9800" },
  { id: "car-brown", color: "#795548" },
  { id: "car-grey", color: "#607D8B" },
] as const;

export const ANIMAL_EMOJIS = [
  { id: "animal-dog", emoji: "🐶" },
  { id: "animal-cat", emoji: "🐱" },
  { id: "animal-bear", emoji: "🐻" },
  { id: "animal-panda", emoji: "🐼" },
  { id: "animal-fox", emoji: "🦊" },
  { id: "animal-lion", emoji: "🦁" },
  { id: "animal-frog", emoji: "🐸" },
  { id: "animal-penguin", emoji: "🐧" },
  { id: "animal-owl", emoji: "🦉" },
  { id: "animal-unicorn", emoji: "🦄" },
] as const;

export type AvatarId =
  | typeof DEFAULT_AVATAR_ID
  | (typeof CAR_COLORS)[number]["id"]
  | (typeof ANIMAL_EMOJIS)[number]["id"];
