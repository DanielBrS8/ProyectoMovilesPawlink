import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import useUsuarioStore from "../stores/useUsuarioStore";

export default function Index() {
  const router = useRouter();
  const cargarSesion = useUsuarioStore((state) => state.cargarSesion);

  useEffect(() => {
    async function verificarSesion() {
      const haySession = await cargarSesion();
      if (haySession) {
        router.replace("/(drawer)/(tabs)");
      } else {
        router.replace("/login");
      }
    }
    verificarSesion();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-fondo">
      <ActivityIndicator size="large" color="#7DD3C0" />
    </View>
  );
}
