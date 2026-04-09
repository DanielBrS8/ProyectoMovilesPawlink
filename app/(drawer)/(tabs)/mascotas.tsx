import { useEffect, useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, useWindowDimensions, SectionList } from "react-native";
import { TextInput, ActivityIndicator, FAB, Card, Avatar, Chip } from "react-native-paper";
import { useRouter } from "expo-router";
import { useFocusEffect, DrawerActions, useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useMascotaStore from "../../../stores/useMascotaStore";
import useAdopcionStore from "../../../stores/useAdopcionStore";
import CardMascota from "../../../components/CardMascota";
import { Mascota } from "../../../model/Tipos";

export default function Mascotas() {
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const {
    listaMascotas,
    cargando,
    textoBusqueda,
    setTextoBusqueda,
    cargarMascotas,
    buscar,
  } = useMascotaStore();

  const { mascotasEnProceso } = useAdopcionStore();

  const [vista, setVista] = useState<"mascotas" | "adopciones">("mascotas");

  useFocusEffect(
    useCallback(() => {
      cargarMascotas();
    }, [])
  );

  useEffect(() => {
    if (textoBusqueda === "") {
      cargarMascotas();
    } else {
      const timeout = setTimeout(() => buscar(textoBusqueda), 300);
      return () => clearTimeout(timeout);
    }
  }, [textoBusqueda]);

  function handlePressMascota(mascota: Mascota) {
    router.push(`/mascota/${mascota.id}`);
  }

  const totalItems = vista === "mascotas" ? listaMascotas.length : mascotasEnProceso.length;

  return (
    <View style={estilos.contenedor}>
      {/* Cabecera */}
      <View style={estilos.cabecera}>
        <View style={estilos.cabeceraFila}>
          <Pressable
            onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
            style={estilos.menuBoton}
          >
            <MaterialCommunityIcons name="menu" size={width < 380 ? 22 : 26} color="white" />
          </Pressable>
          <View style={estilos.cabeceraTextos}>
            <Text style={estilos.cabeceraTitulo}>Mis Mascotas</Text>
            <Text style={estilos.cabeceraSubtitulo}>
              {vista === "mascotas"
                ? `${listaMascotas.length} mascota${listaMascotas.length !== 1 ? "s" : ""} registrada${listaMascotas.length !== 1 ? "s" : ""}`
                : `${mascotasEnProceso.length} adopcion${mascotasEnProceso.length !== 1 ? "es" : ""} activa${mascotasEnProceso.length !== 1 ? "s" : ""}`}
            </Text>
          </View>
        </View>

        {/* Toggle Mis Mascotas / Mis Adopciones */}
        <View style={estilos.vistaToggle}>
          <Pressable
            style={[estilos.vistaBtn, vista === "mascotas" && estilos.vistaBtnActivo]}
            onPress={() => setVista("mascotas")}
          >
            <MaterialCommunityIcons
              name="paw"
              size={16}
              color={vista === "mascotas" ? "#7DD3C0" : "rgba(255,255,255,0.7)"}
              style={{ marginRight: 4 }}
            />
            <Text style={[estilos.vistaBtnTexto, vista === "mascotas" && estilos.vistaBtnTextoActivo]}>
              Propias ({listaMascotas.length})
            </Text>
          </Pressable>
          <Pressable
            style={[estilos.vistaBtn, vista === "adopciones" && estilos.vistaBtnActivo]}
            onPress={() => setVista("adopciones")}
          >
            <MaterialCommunityIcons
              name="home-heart"
              size={16}
              color={vista === "adopciones" ? "#7DD3C0" : "rgba(255,255,255,0.7)"}
              style={{ marginRight: 4 }}
            />
            <Text style={[estilos.vistaBtnTexto, vista === "adopciones" && estilos.vistaBtnTextoActivo]}>
              Adopciones ({mascotasEnProceso.length})
            </Text>
          </Pressable>
        </View>

        {/* Buscador solo para mascotas propias */}
        {vista === "mascotas" && (
          <TextInput
            mode="outlined"
            placeholder="Buscar mascota..."
            value={textoBusqueda}
            onChangeText={setTextoBusqueda}
            left={<TextInput.Icon icon="magnify" color="rgba(255,255,255,0.7)" />}
            right={
              textoBusqueda !== "" ? (
                <TextInput.Icon icon="close" onPress={() => setTextoBusqueda("")} color="rgba(255,255,255,0.7)" />
              ) : undefined
            }
            outlineColor="rgba(255,255,255,0.3)"
            activeOutlineColor="rgba(255,255,255,0.6)"
            textColor="white"
            placeholderTextColor="rgba(255,255,255,0.5)"
            outlineStyle={{ borderRadius: 14 }}
            style={estilos.buscador}
          />
        )}
      </View>

      {/* Contenido */}
      {vista === "mascotas" ? (
        // --- MIS MASCOTAS ---
        cargando ? (
          <View style={estilos.cargando}>
            <ActivityIndicator size="large" color="#7DD3C0" />
            <Text style={estilos.cargandoTexto}>Cargando mascotas...</Text>
          </View>
        ) : (
          <FlatList
            data={listaMascotas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <CardMascota
                mascota={item}
                indice={index}
                onPress={handlePressMascota}
              />
            )}
            contentContainerStyle={estilos.lista}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={estilos.vacio}>
                <Animatable.Text animation="bounceIn" style={{ fontSize: 80, marginBottom: 20 }}>
                  🐕
                </Animatable.Text>
                <Text style={estilos.vacioTitulo}>Sin mascotas</Text>
                <Text style={estilos.vacioSubtitulo}>
                  Pulsa + para añadir tu primera mascota
                </Text>
              </View>
            }
          />
        )
      ) : (
        // --- MIS ADOPCIONES ---
        mascotasEnProceso.length === 0 ? (
          <View style={estilos.vacio}>
            <Animatable.Text animation="bounceIn" style={{ fontSize: 80, marginBottom: 20 }}>
              🏠
            </Animatable.Text>
            <Text style={estilos.vacioTitulo}>Sin adopciones</Text>
            <Text style={estilos.vacioSubtitulo}>
              Cuando adoptes mascotas temporalmente, aparecerán aquí
            </Text>
            <Pressable
              style={estilos.botonIrAdopcion}
              onPress={() => router.push("/(drawer)/(tabs)/adopcion")}
            >
              <MaterialCommunityIcons name="heart-outline" size={18} color="white" />
              <Text style={estilos.botonIrAdopcionTexto}>Explorar adopciones</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={mascotasEnProceso}
            keyExtractor={(item) => item.mascota.id.toString()}
            contentContainerStyle={estilos.lista}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Animatable.View animation="fadeInUp" delay={index * 80}>
                <Card style={[estilos.tarjetaAdopcion]} mode="elevated" elevation={2}>
                  <Card.Cover source={{ uri: item.mascota.foto }} style={estilos.tarjetaFoto} resizeMode="cover" />

                  {/* Badge de adopción */}
                  <View style={estilos.badgeAdopcion}>
                    <MaterialCommunityIcons name="home-heart" size={13} color="white" />
                    <Text style={estilos.badgeAdopcionTexto}>Adopción temporal</Text>
                  </View>

                  <Card.Title
                    title={item.mascota.nombre}
                    subtitle={`${item.mascota.raza} · ${item.mascota.especie}`}
                    titleStyle={estilos.tarjetaNombre}
                    subtitleStyle={estilos.tarjetaSubtitulo}
                    left={() => (
                      <Avatar.Icon
                        size={40}
                        icon={item.mascota.especie.toLowerCase() === "gato" ? "cat" : "dog"}
                        style={{ backgroundColor: "#A8E6D8" }}
                        color="#2D3748"
                      />
                    )}
                  />

                  <Card.Content>
                    {/* Fechas de adopción */}
                    <View style={estilos.fechasRow}>
                      <View style={estilos.fechaItem}>
                        <MaterialCommunityIcons name="calendar-start" size={16} color="#7DD3C0" />
                        <View>
                          <Text style={estilos.fechaLabel}>Desde</Text>
                          <Text style={estilos.fechaValor}>{item.fechaInicio}</Text>
                        </View>
                      </View>
                      <View style={estilos.fechaSeparador} />
                      <View style={estilos.fechaItem}>
                        <MaterialCommunityIcons name="calendar-end" size={16} color="#FFB366" />
                        <View>
                          <Text style={estilos.fechaLabel}>Hasta</Text>
                          <Text style={estilos.fechaValor}>{item.fechaFin}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Estado */}
                    <View style={estilos.estadoRow}>
                      <Chip
                        icon="clock-check-outline"
                        style={estilos.chipActiva}
                        textStyle={estilos.chipActivaTexto}
                        compact
                      >
                        En curso
                      </Chip>
                      <View style={[
                        estilos.badgeEstado,
                        item.mascota.estado === "Saludable" ? estilos.badgeVerde : estilos.badgeNaranja,
                      ]}>
                        <Text style={estilos.badgeEstadoTexto}>{item.mascota.estado}</Text>
                      </View>
                    </View>
                  </Card.Content>

                  <Card.Actions style={estilos.acciones}>
                    <Pressable
                      style={estilos.botonDetalle}
                      onPress={() => router.push(`/mascota/${item.mascota.id}`)}
                    >
                      <MaterialCommunityIcons name="eye" size={18} color="#7DD3C0" />
                      <Text style={estilos.botonDetalleTexto}>Ver detalle</Text>
                    </Pressable>
                    <Pressable
                      style={estilos.botonPaseo}
                      onPress={() => router.push(`/paseo/${item.mascota.id}`)}
                    >
                      <MaterialCommunityIcons name="walk" size={18} color="white" />
                      <Text style={estilos.botonPaseoTexto}>Paseo</Text>
                    </Pressable>
                  </Card.Actions>
                </Card>
              </Animatable.View>
            )}
          />
        )
      )}

      {/* FAB solo en vista de mascotas propias */}
      {vista === "mascotas" && (
        <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={3000}>
          <FAB
            icon="plus"
            style={estilos.fab}
            color="white"
            onPress={() => router.push("/formulario")}
          />
        </Animatable.View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  cabecera: {
    backgroundColor: "#7DD3C0",
    paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  cabeceraFila: { flexDirection: "row", alignItems: "center" },
  menuBoton: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  cabeceraTextos: { marginLeft: 14, flex: 1 },
  cabeceraTitulo: { color: "white", fontSize: 24, fontWeight: "700" },
  cabeceraSubtitulo: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 2 },

  // Toggle
  vistaToggle: {
    flexDirection: "row", marginTop: 16, backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12, padding: 3,
  },
  vistaBtn: {
    flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10,
    flexDirection: "row", justifyContent: "center",
  },
  vistaBtnActivo: { backgroundColor: "white" },
  vistaBtnTexto: { fontSize: 13, fontWeight: "600", color: "rgba(255,255,255,0.8)" },
  vistaBtnTextoActivo: { color: "#7DD3C0" },

  buscador: { marginTop: 12, backgroundColor: "rgba(255,255,255,0.15)", fontSize: 14 },
  cargando: { flex: 1, alignItems: "center", justifyContent: "center" },
  cargandoTexto: { color: "#718096", marginTop: 12, fontSize: 15 },
  lista: { padding: 20, paddingBottom: 100 },

  // Vacio
  vacio: { alignItems: "center", marginTop: 60, paddingHorizontal: 40 },
  vacioTitulo: { fontSize: 22, fontWeight: "700", color: "#2D3748", marginBottom: 8 },
  vacioSubtitulo: { fontSize: 15, color: "#718096", textAlign: "center", lineHeight: 22 },
  botonIrAdopcion: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FFB366", paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 14, marginTop: 24,
  },
  botonIrAdopcionTexto: { color: "white", fontSize: 15, fontWeight: "600" },

  // Tarjeta adopción
  tarjetaAdopcion: {
    marginBottom: 20, borderRadius: 20, backgroundColor: "white", overflow: "hidden",
    borderLeftWidth: 4, borderLeftColor: "#7DD3C0",
  },
  tarjetaFoto: { height: 160, borderRadius: 0 },
  badgeAdopcion: {
    position: "absolute", top: 12, left: 12,
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(125, 211, 192, 0.92)",
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  badgeAdopcionTexto: { color: "white", fontSize: 12, fontWeight: "600" },
  tarjetaNombre: { fontSize: 18, fontWeight: "700", color: "#2D3748" },
  tarjetaSubtitulo: { fontSize: 13, color: "#718096" },

  // Fechas
  fechasRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F8FAFB", borderRadius: 14, padding: 12, marginBottom: 10,
  },
  fechaItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  fechaSeparador: { width: 1, height: 30, backgroundColor: "#E2E8F0", marginHorizontal: 8 },
  fechaLabel: { fontSize: 11, color: "#718096" },
  fechaValor: { fontSize: 14, fontWeight: "600", color: "#2D3748" },

  // Estado
  estadoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  chipActiva: { backgroundColor: "#E6FAF7" },
  chipActivaTexto: { color: "#7DD3C0", fontSize: 12, fontWeight: "600" },
  badgeEstado: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeVerde: { backgroundColor: "#C6F6D5" },
  badgeNaranja: { backgroundColor: "#FEEBC8" },
  badgeEstadoTexto: { fontSize: 12, fontWeight: "600", color: "#2D3748" },

  // Acciones
  acciones: { justifyContent: "space-between", paddingHorizontal: 12, paddingBottom: 12 },
  botonDetalle: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    backgroundColor: "#E6FAF5",
  },
  botonDetalleTexto: { color: "#7DD3C0", fontSize: 13, fontWeight: "600" },
  botonPaseo: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    backgroundColor: "#7DD3C0",
  },
  botonPaseoTexto: { color: "white", fontSize: 13, fontWeight: "600" },

  fab: { position: "absolute", bottom: 24, right: 24, backgroundColor: "#FFB366", borderRadius: 18 },
});
