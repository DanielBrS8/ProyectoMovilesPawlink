import "../global.css";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { View, Text, StyleSheet } from "react-native";

const temaPawlink = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#7DD3C0",
    primaryContainer: "#A8E6D8",
    secondary: "#87CEEB",
    secondaryContainer: "#B8E2F2",
    tertiary: "#FFB366",
    background: "#F8FAFB",
    surface: "#FFFFFF",
    error: "#FC8181",
  },
};

export default function RootLayout() {
  const [splashVisible, setSplashVisible] = useState(true);

  if (splashVisible) {
    return (
      <View style={estilosSplash.contenedor}>
        <StatusBar style="light" />
        <LottieView
          source={require("../assets/pawlink.json")}
          autoPlay
          loop={false}
          speed={1.5}
          onAnimationFinish={() => setSplashVisible(false)}
          style={estilosSplash.lottie}
        />
        <Text style={estilosSplash.titulo}>PawLink</Text>
        <Text style={estilosSplash.subtitulo}>Cuidando a tus mascotas</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={temaPawlink}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(drawer)" />
          <Stack.Screen
            name="formulario"
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
          <Stack.Screen name="mascota/[id]" />
          <Stack.Screen name="paseo/[id]" />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const estilosSplash = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#7DD3C0",
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: { width: 250, height: 250 },
  titulo: {
    fontSize: 42,
    fontWeight: "700",
    color: "white",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitulo: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
  },
});
