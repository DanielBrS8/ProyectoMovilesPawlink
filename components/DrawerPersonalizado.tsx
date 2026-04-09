import { View, Text, StyleSheet, Pressable } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUsuarioStore from "../stores/useUsuarioStore";

type ItemDrawerProps = {
  icono: keyof typeof MaterialCommunityIcons.glyphMap;
  etiqueta: string;
  onPress: () => void;
  color?: string;
};

function ItemDrawer({ icono, etiqueta, onPress, color = "#2D3748" }: ItemDrawerProps) {
  return (
    <Pressable style={estilos.item} onPress={onPress}>
      <MaterialCommunityIcons name={icono} size={24} color={color} />
      <Text style={[estilos.itemTexto, { color }]}>{etiqueta}</Text>
    </Pressable>
  );
}

export default function DrawerPersonalizado(props: any) {
  const router = useRouter();
  const usuario = useUsuarioStore((state) => state.usuario);
  const logout = useUsuarioStore((state) => state.logout);

  async function handleCerrarSesion() {
    await logout();
    router.replace("/login");
  }

  return (
    <DrawerContentScrollView {...props} style={estilos.contenedor}>
      {/* Cabecera con logo */}
      <View style={estilos.cabecera}>
        <View style={estilos.logoContenedor}>
          <Text style={estilos.logoEmoji}>🐾</Text>
          <Text style={estilos.logoTexto}>PawLink</Text>
        </View>
        {usuario && (
          <View style={estilos.perfilContenedor}>
            <Avatar.Image
              size={50}
              source={{ uri: usuario.foto }}
              style={estilos.avatar}
            />
            <View style={estilos.perfilInfo}>
              <Text style={estilos.perfilNombre}>{usuario.nombre}</Text>
              <Text style={estilos.perfilEmail}>{usuario.email}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Separador */}
      <View style={estilos.separador} />

      {/* Items de navegación */}
      <View style={estilos.seccion}>
        <ItemDrawer
          icono="home"
          etiqueta="Inicio"
          onPress={() => router.push("/(drawer)/(tabs)")}
        />
        <ItemDrawer
          icono="paw"
          etiqueta="Mis Mascotas"
          onPress={() => router.push("/(drawer)/(tabs)/mascotas")}
        />
        <ItemDrawer
          icono="heart"
          etiqueta="Adopción"
          onPress={() => router.push("/(drawer)/(tabs)/adopcion")}
        />
        <ItemDrawer
          icono="hospital-building"
          etiqueta="Centros Veterinarios"
          onPress={() => router.push("/(drawer)/(tabs)/centros")}
        />
        <ItemDrawer
          icono="account"
          etiqueta="Mi Perfil"
          onPress={() => router.push("/(drawer)/(tabs)/perfil")}
        />
      </View>

      <View style={estilos.separador} />

      <View style={estilos.seccion}>
        <ItemDrawer
          icono="logout"
          etiqueta="Cerrar Sesión"
          onPress={handleCerrarSesion}
          color="#FC8181"
        />
      </View>
    </DrawerContentScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  cabecera: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  logoContenedor: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 32,
  },
  logoTexto: {
    fontSize: 26,
    fontWeight: "700",
    color: "#7DD3C0",
    marginLeft: 8,
  },
  perfilContenedor: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#B8E2F2",
  },
  perfilInfo: {
    marginLeft: 14,
    flex: 1,
  },
  perfilNombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  perfilEmail: {
    fontSize: 13,
    color: "#718096",
    marginTop: 2,
  },
  separador: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
    marginVertical: 8,
  },
  seccion: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  itemTexto: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 16,
  },
});
