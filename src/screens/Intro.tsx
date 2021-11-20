import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, FlatList, Animated } from "react-native";

import slides from "../../assets/slides";
import IntroItem from "../components/IntroItem";
import IntroNavigator from "../components/IntroNavigator";
import IntroNextButton from "../components/IntroNextBtn";
import { LoggedOutNavStackParamList } from "../navigation/Router";
import { StackScreenProps } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type IntroProps = StackScreenProps<LoggedOutNavStackParamList, "Intro">;
export default function Intro({ navigation }: IntroProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<any>(null);
  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem("@viewedIntro", "true");
        navigation.replace("Login", {});
      } catch (e) {
        console.log("Error @setItem: ", e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <IntroItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </View>
      <IntroNavigator data={slides} scrollX={scrollX} />

      <IntroNextButton
        percentage={(currentIndex + 1) * (100 / slides.length)}
        scrollTo={scrollTo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
