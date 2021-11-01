import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  Vibration,
  StatusBar,
  TextInput,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { useSelectTheme } from "../../styles";
import { gql, useMutation } from "@apollo/client";
import {
  updateTime,
  updateTimeVariables,
} from "../../__generated__/updateTime";
import { updateExp, updateExpVariables } from "../../__generated__/updateExp";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../../navigation/Router";
import {
  registerForPushNotificationsAsnyc,
  schedulePushNotification,
  sendPushNotification,
} from "../../components/PushNotification";
import {
  pushNotification,
  pushNotificationVariables,
} from "../../__generated__/pushNotification";
import * as Notifications from "expo-notifications";
import useUser from "../../hooks/useUser";

const { width, height } = Dimensions.get("screen");
const minTimers = [...Array(24).keys()].map((i) => i);
const timers = [...Array(60).keys()].map((i) => (i === 0 ? 1 : i + 1));
const ITEM_SIZE = width * 0.4;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

const UPDATE_TIME_MUTATION = gql`
  mutation updateTime($time: Int!) {
    updateTime(time: $time) {
      ok
      error
    }
  }
`;

const UPDATE_EXP_MUTATION = gql`
  mutation updateExp($exp: Int!) {
    updateExp(exp: $exp) {
      ok
      error
    }
  }
`;

const PUSH_NOTIFICATION = gql`
  mutation pushNotification($username: String) {
    pushNotification(username: $username) {
      ok
      message
      error
    }
  }
`;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

type PlanScreenProps = StackScreenProps<LoggedInNavStackParamList, "Plan">;
export default function Plan({ route, navigation }: PlanScreenProps) {
  const theme = useSelectTheme();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const timerAnimation = useRef(new Animated.Value(height)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const textInputAnimation = useRef(new Animated.Value(timers[0])).current;
  const [duration, setDuration] = useState(timers[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const { data: userData, loading: userLoading, refetch } = useUser();
  const [updateTime, { data, loading }] = useMutation<
    updateTime,
    updateTimeVariables
  >(UPDATE_TIME_MUTATION);

  const [updateExp] = useMutation<updateExp, updateExpVariables>(
    UPDATE_EXP_MUTATION
  );
  const [pushNotification, { data: pushData }] = useMutation<
    pushNotification,
    pushNotificationVariables
  >(PUSH_NOTIFICATION, {
    onCompleted: (data) => {
      const {
        pushNotification: { ok, message, error },
      } = data;
      console.log("ok:", ok);
      console.log("error:", error);
      if (ok) {
        sendPushNotification(message);
      }
    },
  });

  const randNum = Math.random() * duration * 60000 + 500;
  const [failTest, setFailTest] = useState(0);
  const [testVar, setTestVar] = useState(false);
  const failTimer = () => {
    console.log("start");
    const fail = setTimeout(async () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Result", params: { duration: 0 } }],
      });
      // const token: any = await registerForPushNotificationsAsnyc();
      // console.log("token", token);
      await pushNotification({
        variables: {
          username: userData?.isMe.username,
        },
      });
    }, 6000);
    setTestVar(true);
    //@ts-ignore
    setFailTest(fail);
    console.log("next", fail);
  };

  useEffect(() => {
    const listener = textInputAnimation.addListener(({ value }) => {
      inputRef?.current?.setNativeProps({
        text: Math.ceil(value).toString(),
      });
    });
    if (route.params?.faceDetected) {
      setIsRunning(true);
      if (!route.params?.second) {
        console.log(randNum);
        setTimeout(() => {
          setIsStop(true);
          setIsRunning(false);
          console.log("Fail Timer Start.");
          console.log("isRunning", isRunning);
          console.log("stopstop");
          navigation.navigate("CameraScreen", { second: true });
          console.log("route:", route.params.second);
          failTimer();
        }, randNum);
      }
      if (route.params?.second) {
        clearTimeout(failTest);
      }
    } else {
      null;
    }
    return () => {
      textInputAnimation.removeListener(listener);
      textInputAnimation.removeAllListeners();
    };
  }, [route.params?.faceDetected, route.params?.second]);

  useEffect(() => {
    textInputAnimation.setValue(duration);
  }, [duration]);

  const anime = Animated.sequence([
    Animated.timing(buttonAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(timerAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.parallel([
      Animated.timing(textInputAnimation, {
        toValue: 0,
        duration: duration * 60000,
        useNativeDriver: true,
      }),
      Animated.timing(timerAnimation, {
        toValue: height,
        duration: duration * 60000,
        useNativeDriver: true,
      }),
    ]),
  ]);

  const animation = useCallback(async () => {
    // console.log(parseFloat(JSON.stringify(textInputAnimation)));
    textInputAnimation.setValue(parseFloat(JSON.stringify(textInputAnimation)));
    // console.log(isStop);
    if (isRunning && !isStop) {
      // console.log("11111");
      anime.start(() => {
        Vibration.cancel();
        Vibration.vibrate();
        // console.log("t2:", textInputAnimation);

        if (parseFloat(JSON.stringify(textInputAnimation)) === 0) {
          // console.log("In");
          textInputAnimation.setValue(duration);

          (async () => {
            await updateTime({ variables: { time: duration } });
            await updateExp({ variables: { exp: duration } });
            await navigation.replace("Result", { duration: duration });
          })();
          Animated.timing(buttonAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          });
        }
      });
    } else if (isRunning && isStop) {
      console.log("22222");
      console.log(isRunning);
      Animated.parallel([
        Animated.timing(textInputAnimation, {
          toValue: 0,
          duration: parseFloat(JSON.stringify(textInputAnimation)) * 60000,
          useNativeDriver: true,
        }),
        Animated.timing(timerAnimation, {
          toValue: height,
          duration: parseFloat(JSON.stringify(textInputAnimation)) * 60000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Vibration.cancel();
        Vibration.vibrate();
        // console.log("t2:", textInputAnimation);

        if (parseFloat(JSON.stringify(textInputAnimation)) === 0) {
          // console.log("In");
          textInputAnimation.setValue(duration);
          (async () => {
            await updateTime({ variables: { time: duration } });
          })();
          (async () => {
            await updateExp({ variables: { exp: duration } });
            await refetch();
          })();
          navigation.replace("Result", { duration: duration });
          Animated.timing(buttonAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          });
        }
      });
    } else if (!isRunning) {
      // console.log("33333");
      textInputAnimation.stopAnimation((e) => console.log("text", e));
      timerAnimation.stopAnimation((e) => console.log("timer", e));
    }
  }, [duration, isRunning]);

  useEffect(() => {
    // console.log("t1:", textInputAnimation);
    animation();
  }, [isRunning, duration]);

  const onStart = () => {
    navigation.navigate("CameraScreen", { second: false });
    navigation.setOptions({
      //@ts-ignore
      tabBarStyle: { display: "none" },
    });
  };

  const opacity = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const translateY = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const textOpacity = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  return (
    <Container>
      <StatusBar />
      {/* <TouchableOpacity
        onPress={() => {
          setIsRunning(!isRunning);
          setIsStop(true);
        }}
        style={{ alignItems: "center", top: 50 }}
      >
        <Text
          style={{
            fontSize: 50,
          }}
        >
          pause
        </Text>
      </TouchableOpacity> */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            height,
            width,
            backgroundColor: theme.txtColor,
            transform: [{ translateY: timerAnimation }],
          },
        ]}
      ></Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            flex: 1,
            justifyContent: "flex-end",
            top: height * 0.75,
            alignItems: "center",
            paddingBottom: 100,
            opacity,
            transform: [
              {
                translateY,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={() => onStart()}>
          <StartButton />
        </TouchableOpacity>
      </Animated.View>
      <View
        style={{
          position: "absolute",
          top: height / 3,
          left: 0,
          right: 0,
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            width: ITEM_SIZE,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            opacity: textOpacity,
          }}
        >
          <TextInput
            style={{
              fontSize: ITEM_SIZE * 0.8,
              color: `${theme.activeColor}`,
            }}
            ref={inputRef}
            defaultValue={duration.toString()}
          />
        </Animated.View>
        <Animated.FlatList
          data={timers}
          keyExtractor={(item) => item.toString()}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_SIZE);
            setDuration(timers[index]);
            textInputAnimation.setValue(duration);
          }}
          contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          style={{ flexGrow: 0, opacity }}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
            });
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
            });
            return (
              <Animated.View
                style={{
                  width: ITEM_SIZE,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Animated.Text
                  style={{
                    fontSize: ITEM_SIZE * 0.8,
                    color: `${theme.txtColor}`,
                    opacity,
                    transform: [{ scale }],
                  }}
                >
                  {item}
                </Animated.Text>
              </Animated.View>
            );
          }}
        />
      </View>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const StartButton = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 80px;
  background-color: ${(props) => props.theme.activeColor};
`;
