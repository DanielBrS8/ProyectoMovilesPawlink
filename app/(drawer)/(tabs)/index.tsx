import { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useFocusEffect, DrawerActions, useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import useUsuarioStore from "../../../stores/useUsuarioStore";
import useMascotaStore from "../../../stores/useMascotaStore";
import useAdopcionStore from "../../../stores/useAdopcionStore";
import { consultarPaseos } from "../../../helpers/ConsultasApi";
import { Paseo } from "../../../model/Tipos";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const iconoAccion = width < 380 ? 28 : 34;

  const usuario = useUsuarioStore((state) => state.usuario);
  const { listaMascotas, cargarMascotas } = useMascotaStore();
  const totalAdopciones = useAdopcionStore((state) => state.mascotasEnAdopcion.length);
  const [paseos, setPaseos] = useState<Paseo[]>([]);

  useFocusEffect(
    useCallback(() => {
      cargarMascotas();
      consultarPaseos().then(setPaseos).catch(() => {});
    }, [])
  );

  const acciones = [
    { icono: "paw" as const, label: "Mis Mascotas", color: "#7DD3C0", bg: "#E6FAF5", ruta: "/(drawer)/(tabs)/mascotas" },
    { icono: "heart-outline" as const, label: "Adoptar", color: "#FFB366", bg: "#FFF3E0", ruta: "/(drawer)/(tabs)/adopcion" },
    { icono: "plus-circle" as const, label: "Añadir", color: "#87CEEB", bg: "#E3F2FD", ruta: "/formulario" },
    { icono: "account" as const, label: "Perfil", color: "#B39DDB", bg: "#EDE7F6", ruta: "/(drawer)/(tabs)/perfil" },
  ];

  const ultimosPaseos = paseos.slice(-3).reverse();

  return (
    <View style={estilos.contenedor}>
      {/* Cabecera */}
      <View style={estilos.cabecera}>
        <View style={estilos.cabeceraFila}>
          <Pressable
            onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
            style={estilos.menuBoton}
          >
            <MaterialCommunityIcons name="menu" size={24} color="white" />
          </Pressable>
          <View style={estilos.cabeceraTextos}>
            <Animatable.Text animation="fadeIn" style={estilos.saludo}>
              Hola, {usuario?.nombre?.split(" ")[0] || "amigo"} 👋
            </Animatable.Text>
            <Text style={estilos.cabeceraSubtitulo}>Bienvenido a PawLink</Text>
          </View>
          <Avatar.Image
            size={44}
            source={{ uri: usuario?.foto || "https://via.placeholder.com/100" }}
            style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
          />
        </View>
      </View>

      <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <Animatable.View animation="fadeInUp" delay={100} style={estilos.statsRow}>
          <Card style={estilos.statCard}>
            <Card.Content style={estilos.statContenido}>
              <MaterialCommunityIcons name="paw" size={26} color="#7DD3C0" />
              <Text style={estilos.statValor}>{listaMascotas.length}</Text>
              <Text style={estilos.statEtiqueta}>Mascotas</Text>
            </Card.Content>
          </Card>
          <Card style={estilos.statCard}>
            <Card.Content style={estilos.statContenido}>
              <MaterialCommunityIcons name="walk" size={26} color="#FFB366" />
              <Text style={estilos.statValor}>{paseos.length}</Text>
              <Text style={estilos.statEtiqueta}>Paseos</Text>
            </Card.Content>
          </Card>
          <Card style={estilos.statCard}>
            <Card.Content style={estilos.statContenido}>
              <MaterialCommunityIcons name="heart" size={26} color="#FC8181" />
              <Text style={estilos.statValor}>{totalAdopciones}</Text>
              <Text style={estilos.statEtiqueta}>Adopción</Text>
            </Card.Content>
          </Card>
        </Animatable.View>

        {/* Acciones rápidas */}
        <Animatable.View animation="fadeInUp" delay={200}>
          <Text style={estilos.seccionTitulo}>Acciones rápidas</Text>
          <View style={estilos.accionesGrid}>
            {acciones.map((a, i) => (
              <Pressable
                key={i}
                style={[estilos.accionCard, { backgroundColor: a.bg }]}
                onPress={() => router.push(a.ruta as any)}
              >
                <MaterialCommunityIcons name={a.icono} size={iconoAccion} color={a.color} />
                <Text style={estilos.accionLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animatable.View>

        {/* Mascotas destacadas */}
        {listaMascotas.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={300}>
            <View style={estilos.seccionHeader}>
              <Text style={estilos.seccionTitulo}>Tus mascotas</Text>
              <Pressable onPress={() => router.push("/(drawer)/(tabs)/mascotas")}>
                <Text style={estilos.verTodo}>Ver todas</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.mascotasScroll}>
              {listaMascotas.map((m, i) => (
                <Pressable
                  key={m.id}
                  style={estilos.miniCard}
                  onPress={() => router.push(`/mascota/${m.id}`)}
                >
                  <Image
                    source={{ uri: m.foto }}
                    style={estilos.miniCardFoto}
                    contentFit="cover"
                  />
                  <Text style={estilos.miniCardNombre} numberOfLines={1}>{m.nombre}</Text>
                  <Text style={estilos.miniCardRaza} numberOfLines={1}>{m.raza}</Text>
                  <View style={[estilos.miniCardBadge, m.estado === "Saludable" ? estilos.badgeVerde : estilos.badgeNaranja]}>
                    <Text style={estilos.miniCardBadgeTexto}>{m.estado === "Saludable" ? "Sano" : "Atención"}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </Animatable.View>
        )}

        {/* Últimos paseos */}
        <Animatable.View animation="fadeInUp" delay={400}>
          <Text style={estilos.seccionTitulo}>Últimos paseos</Text>
          {ultimosPaseos.length > 0 ? (
            ultimosPaseos.map((p) => {
              const mascotaNombre = listaMascotas.find((m) => m.id === p.mascotaId)?.nombre || "Mascota";
              return (
                <Card key={p.id} style={estilos.paseoCard} mode="elevated" elevation={1}>
                  <Card.Title
                    title={`Paseo con ${mascotaNombre}`}
                    subtitle={`${p.fecha} · ${p.duracion} · ${p.distancia} km`}
                    titleStyle={estilos.paseoTitulo}
                    subtitleStyle={estilos.paseoSubtitulo}
                    left={() => (
                      <Avatar.Icon size={42} icon="walk" style={{ backgroundColor: "#E6FAF5" }} color="#7DD3C0" />
                    )}
                  />
                </Card>
              );
            })
          ) : (
            <Card style={estilos.paseoCard}>
              <Card.Content style={{ alignItems: "center", paddingVertical: 20 }}>
                <MaterialCommunityIcons name="map-marker-path" size={40} color="#E2E8F0" />
                <Text style={estilos.paseoVacioTexto}>Aún no hay paseos registrados</Text>
              </Card.Content>
            </Card>
          )}
        </Animatable.View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  cabecera: {
    backgroundColor: "#7DD3C0",
    paddingTop: 52, paddingBottom: 28, paddingHorizontal: 20,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  cabeceraFila: { flexDirection: "row", alignItems: "center" },
  menuBoton: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  cabeceraTextos: { marginLeft: 14, flex: 1 },
  saludo: { color: "white", fontSize: 24, fontWeight: "700" },
  cabeceraSubtitulo: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 2 },
  scroll: { flex: 1 },

  // Stats
  statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 10, marginTop: 20 },
  statCard: { flex: 1, borderRadius: 18, backgroundColor: "white" },
  statContenido: { alignItems: "center", paddingVertical: 14 },
  statValor: { fontSize: 22, fontWeight: "700", color: "#2D3748", marginTop: 4 },
  statEtiqueta: { fontSize: 11, color: "#718096", marginTop: 2 },

  // Acciones
  seccionTitulo: { fontSize: 18, fontWeight: "700", color: "#2D3748", marginLeft: 20, marginTop: 24, marginBottom: 14 },
  seccionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 20 },
  verTodo: { color: "#7DD3C0", fontSize: 14, fontWeight: "600" },
  accionesGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 12 },
  accionCard: {
    width: "47%" as any,
    borderRadius: 18, padding: 20, alignItems: "center", gap: 10,
    flexGrow: 1,
  },
  accionLabel: { fontSize: 14, fontWeight: "600", color: "#2D3748" },

  // Mini cards mascotas
  mascotasScroll: { paddingHorizontal: 16, gap: 14 },
  miniCard: {
    width: 130, backgroundColor: "white", borderRadius: 18, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  miniCardFoto: { width: "100%", height: 100 },
  miniCardNombre: { fontSize: 15, fontWeight: "700", color: "#2D3748", marginTop: 10, marginHorizontal: 10 },
  miniCardRaza: { fontSize: 12, color: "#718096", marginHorizontal: 10, marginTop: 2 },
  miniCardBadge: { marginHorizontal: 10, marginTop: 8, marginBottom: 12, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeVerde: { backgroundColor: "#C6F6D5" },
  badgeNaranja: { backgroundColor: "#FEEBC8" },
  miniCardBadgeTexto: { fontSize: 10, fontWeight: "600", color: "#2D3748" },

  // Paseos
  paseoCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 16, backgroundColor: "white" },
  paseoTitulo: { fontSize: 15, fontWeight: "600", color: "#2D3748" },
  paseoSubtitulo: { fontSize: 12, color: "#718096" },
  paseoVacioTexto: { fontSize: 14, color: "#718096", marginTop: 8 },
});
