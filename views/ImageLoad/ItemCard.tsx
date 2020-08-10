import * as React from "react";
import {
  Dimensions,
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SHADOW_STYLES } from "../../utils/styleUtils";
import { AppText } from "../../components/AppText";

// Util
type State = "LOADING" | "LOADED";
const { width } = Dimensions.get("screen");
const ITEM_SIZE = width / 3;

/**
 * Item Card
 */
export const ItemCard: React.FC<{ num: number }> = ({ num }) => {
  // Local state
  const [loadState, setLoadState] = React.useState<State>("LOADING");
  const animValue = React.useRef(new Animated.Value(0)).current;
  const stamp = React.useRef(Number(new Date()));

  // When image loaded, animate value in.
  React.useEffect(() => {
    if (loadState === "LOADED") {
      Animated.timing(animValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 300,
      }).start();
    } else {
      animValue.setValue(0);
    }
  }, [loadState]);

  // Generate new image
  const getNewImage = React.useCallback(() => {
    stamp.current = Number(new Date());
    setLoadState("LOADING");
  }, [stamp]);

  // Styles
  const opacity = animValue;
  // Start at a 0.2 (20%) scale and animate up to 1 (100%) scale
  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });
  // Border radius: circular image that animates to square one.
  const borderRadius = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [ITEM_SIZE / 2, ITEM_SIZE / 2, 0],
  });

  return (
    <View style={SHADOW_STYLES.default}>
      <TouchableOpacity style={styles.cardContainer} onPress={getNewImage}>
        <View>
          <View style={styles.activityIndicatorContainer}>
            {loadState === "LOADING" && <ActivityIndicator />}
          </View>
          <Animated.Image
            source={{
              uri: `https://picsum.photos/200/300?rd=${num}-${stamp.current}`,
            }}
            resizeMode="cover"
            style={{
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              opacity,
              borderRadius,
              transform: [{ scale }],
            }}
            onLoad={() => setLoadState("LOADED")}
          />
        </View>
        <View style={styles.contentContainer}>
          <AppText style={styles.descriptionText}>Item number {num}</AppText>
          <AppText>Tap me for new image!</AppText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    borderColor: "grey",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
  },
  activityIndicatorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
  descriptionText: { fontSize: 16, fontWeight: "800", marginBottom: 10 },
});
