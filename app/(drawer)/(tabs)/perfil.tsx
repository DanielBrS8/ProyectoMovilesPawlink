import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Avatar, Card, Button, List } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import useUsuarioStore from "../../../stores/useUsuarioStore";
import useAdopcionStore from "../../../stores/useAdopcionStore";
import useMascotaStore from "../../../stores/useMascotaStore";

export default function Perfil() {
  const router = useRouter();
  const navigation = useNavigation();
  const usuario = useUsuarioStore((state) => state.usuario);
  const logout = useUsuarioStore((state) => state.logout);
  const totalMascotas = useMascotaStore((state) => state.listaMascotas.length);
  const totalAdopciones = useAdopcionStore((state) => state.mascotasEnAdopcion.length);

  async function handleCerrarSesion() {
    await logout();
    router.replace("/login");
  }

  return (
    <View style={estilos.contenedor}>
      {/* Cabecera */}
      <View style={estilos.cabecera}>
        <View style={estilos.cabeceraFila}>
          <Pressable
            style={estilos.menuBoton}
            onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
          >
            <MaterialCommunityIcons name="menu" size={24} color="white" />
          </Pressable>
          <Text style={estilos.cabeceraTitulo}>Mi Perfil</Text>
        </View>

        <Animatable.View animation="bounceIn" delay={200} style={estilos.avatarSeccion}>
          <Avatar.Image
            size={90}
            source={{ uri: usuario?.foto || "https://via.placeholder.com/200" }}
            style={estilos.avatar}
          />
          <Text style={estilos.nombre}>{usuario?.nombre || "Usuario"}</Text>
          <Text style={estilos.email}>{usuario?.email || ""}</Text>
        </Animatable.View>
      </View>

      <ScrollView style={estilos.contenido} showsVerticalScrollIndicator={false}>
        {/* Stats rápidos */}
        <Animatable.View animation="fadeInUp" delay={300} style={estilos.statsRow}>
          <Card style={estilos.statCard}>
            <Card.Content style={estilos.statContenido}>
              <MaterialCommunityIcons name="paw" size={28} color="#7DD3C0" />
              <Text style={estilos.statValor}>{totalMascotas}</Text>
              <Text style={estilos.statEtiqueta}>Mascotas</Text>
            </Card.Content>
          </Card>
          <Card style={estilos.statCard}>
            <Card.Content style={estilos.statContenido}>
              <MaterialCommunityIcons name="heart" size={28} color="#FFB366" />
              <Text style={estilos.statValor}>{totalAdopciones}</Text>
              <Text style={estilos.statEtiqueta}>Adopciones</Text>
            </Card.Content>
          </Card>
        </Animatable.View>

        {/* Info personal */}
        <Animatable.View animation="fadeInUp" delay={400}>
          <Card style={estilos.tarjeta} mode="elevated" elevation={1}>
            <List.Section>
              <List.Subheader style={estilos.seccionTitulo}>Información Personal</List.Subheader>
              <List.Item
                title="Teléfono"
                description={usuario?.telefono || "No configurado"}
                left={() => <List.Icon icon="phone" color="#7DD3C0" />}
                titleStyle={estilos.itemTitulo}
                descriptionStyle={estilos.itemDescripcion}
              />
              <List.Item
                title="Dirección"
                description={usuario?.direccion || "No configurada"}
                left={() => <List.Icon icon="map-marker" color="#7DD3C0" />}
                titleStyle={estilos.itemTitulo}
                descriptionStyle={estilos.itemDescripcion}
              />
              <List.Item
                title="Email"
                description={usuario?.email || ""}
                left={() => <List.Icon icon="email" color="#7DD3C0" />}
                titleStyle={estilos.itemTitulo}
                descriptionStyle={estilos.itemDescripcion}
              />
            </List.Section>
          </Card>
        </Animatable.View>

        {/* Acciones */}
        <Animatable.View animation="fadeInUp" delay={500}>
          <Card style={estilos.tarjeta} mode="elevated" elevation={1}>
            <List.Section>
              <List.Subheader style={estilos.seccionTitulo}>Acciones</List.Subheader>
              <List.Item
                title="Mis Mascotas"
                left={() => <List.Icon icon="paw" color="#7DD3C0" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => router.push("/(drawer)/(tabs)")}
                titleStyle={estilos.itemTitulo}
              />
              <List.Item
                title="Adopción Temporal"
                left={() => <List.Icon icon="heart-outline" color="#FFB366" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => router.push("/(drawer)/(tabs)/adopcion")}
                titleStyle={estilos.itemTitulo}
              />
            </List.Section>
          </Card>
        </Animatable.View>

        {/* Cerrar sesión */}
        <Animatable.View animation="fadeInUp" delay={600}>
          <Button
            mode="outlined"
            icon="logout"
            textColor="#FC8181"
            style={estilos.botonLogout}
            contentStyle={{ paddingVertical: 6 }}
            onPress={handleCerrarSesion}
          >
            Cerrar Sesión
          </Button>
        </Animatable.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  cabecera: {
    backgroundColor: "#87CEEB",
    paddingTop: 52,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  cabeceraFila: { flexDirection: "row", alignItems: "center" },
  menuBoton: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  cabeceraTitulo: { color: "white", fontSize: 20, fontWeight: "700", marginLeft: 14 },
  avatarSeccion: { alignItems: "center", marginTop: 20 },
  avatar: { backgroundColor: "rgba(255,255,255,0.3)" },
  nombre: { color: "white", fontSize: 24, fontWeight: "700", marginTop: 14 },
  email: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 },
  contenido: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 18, backgroundColor: "white" },
  statContenido: { alignItems: "center", paddingVertical: 18 },
  statValor: { fontSize: 24, fontWeight: "700", color: "#2D3748", marginTop: 6 },
  statEtiqueta: { fontSize: 12, color: "#718096", marginTop: 2 },
  tarjeta: { marginBottom: 16, borderRadius: 18, backgroundColor: "white" },
  seccionTitulo: { fontSize: 15, fontWeight: "600", color: "#2D3748" },
  itemTitulo: { fontSize: 15, color: "#2D3748" },
  itemDescripcion: { fontSize: 13, color: "#718096" },
  botonLogout: { borderColor: "#FC8181", borderRadius: 14, marginTop: 8 },
});
