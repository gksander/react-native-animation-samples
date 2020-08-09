import * as React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Image,
  View,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AppText } from "../../components/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import { SHADOW_STYLES } from "../../utils/styleUtils";

// Util
type State = "LOADING" | "LOADED";
const { width } = Dimensions.get("screen");
const ITEM_SIZE = width / 3;

const ITEMS = Array.from({ length: 25 }).map((_, i) => i + 1);

/**
 * Item Card
 */
const Item: React.FC<{ num: number }> = ({ num }) => {
  const [loadState, setLoadState] = React.useState<State>("LOADING");
  const animValue = React.useRef(new Animated.Value(0)).current;
  const stamp = React.useRef(Number(new Date()));

  // When image loaded, animate value in.
  React.useEffect(() => {
    if (loadState === "LOADED") {
      Animated.timing(animValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 350,
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
  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });
  const borderRadius = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [ITEM_SIZE / 2, ITEM_SIZE / 2, 0],
  });

  return (
    <View style={SHADOW_STYLES.default}>
      <TouchableOpacity
        style={[
          {
            flexDirection: "row",
            borderColor: "grey",
            borderRadius: 5,
            overflow: "hidden",
            backgroundColor: "white",
          },
        ]}
        onPress={getNewImage}
      >
        <View>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "lightgrey",
              },
            ]}
          >
            {loadState === "LOADING" && <ActivityIndicator />}
          </Animated.View>
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
            key={stamp.current}
          />
        </View>
        <View style={{ padding: 10, flex: 1 }}>
          <AppText
            style={{ fontSize: 16, fontWeight: "800", marginBottom: 10 }}
          >
            Item number {num}
          </AppText>
          <AppText numberOfLines={3}>Tap me for new image!</AppText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const ImageLoadView: React.FC = () => {
  return (
    <SafeAreaView>
      <FlatList
        data={ITEMS}
        renderItem={({ item }) => <Item num={item} />}
        keyExtractor={(item) => String(item)}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        windowSize={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "grey",
    ...Platform.select({
      ios: {},
      android: {
        elevation: 2,
      },
    }),
  },
  imageContainer: {
    width: width / 2,
    height: width / 2,
  },
  activityIndicatorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    padding: 8,
  },
});
