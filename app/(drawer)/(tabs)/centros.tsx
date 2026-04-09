import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Linking,
  Alert,
  useWindowDimensions,
} from "react-native";
import { Card, Avatar, Button, ActivityIndicator } from "react-native-paper";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CentroVeterinario } from "../../../model/Tipos";
import { consultarCentros } from "../../../helpers/ConsultasApi";

export default function Centros() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [centros, setCentros] = useState<CentroVeterinario[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCentros();
  }, []);

  async function cargarCentros() {
    try {
      setCargando(true);
      const datos = await consultarCentros();
      setCentros(datos);
    } catch (error) {
      Alert.alert(
        "Error de conexión",
        "No se pudo cargar la lista de centros veterinarios. Comprueba tu conexión e inténtalo de nuevo.",
        [{ text: "Reintentar", onPress: cargarCentros }, { text: "Cancelar" }]
      );
    } finally {
      setCargando(false);
    }
  }

  function handleLlamar(telefono: string) {
    Linking.openURL(`tel:${telefono}`).catch(() =>
      Alert.alert("Error", "No se puede realizar la llamada en este dispositivo.")
    );
  }

  function handleComoLlegar(centro: CentroVeterinario) {
    const url = `geo:${centro.latitud},${centro.longitud}?q=${centro.latitud},${centro.longitud}(${encodeURIComponent(centro.nombre)})`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "No se pudo abrir el mapa. Asegúrate de tener una app de mapas instalada.")
    );
  }

  function renderCentro({ item, index }: { item: CentroVeterinario; index: number }) {
    return (
      <Animatable.View animation="fadeInUp" duration={500} delay={index * 80}>
        <Card style={estilos.tarjeta} mode="elevated" elevation={2}>
          {/* Foto del centro */}
          {item.foto ? (
            <View style={estilos.fotoContenedor}>
              <Image
                source={{ uri: item.foto }}
                style={estilos.foto}
                contentFit="cover"
              />
              {/* Badge especialidad sobre la foto */}
              <View style={estilos.badgeEspecialidad}>
                <MaterialCommunityIcons name="stethoscope" size={13} color="white" />
                <Text style={estilos.badgeTexto}>{item.especialidad}</Text>
              </View>
            </View>
          ) : null}

          <Card.Title
            title={item.nombre}
            subtitle={item.ciudad}
            titleStyle={estilos.cardTitulo}
            subtitleStyle={estilos.cardSubtitulo}
            titleNumberOfLines={2}
            left={() => (
              <Avatar.Icon
                size={44}
                icon="hospital-building"
                style={{ backgroundColor: "#A8E6D8" }}
                color="#2D3748"
              />
            )}
          />

          <Card.Content style={estilos.cardContenido}>
            {/* Horario */}
            <View style={estilos.filaInfo}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#7DD3C0" />
              <Text style={estilos.textoInfo}>{item.horario}</Text>
            </View>

            {/* Dirección */}
            <View style={estilos.filaInfo}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#7DD3C0" />
              <Text style={estilos.textoInfo}>{item.direccion}</Text>
            </View>

            {/* Teléfono */}
            <View style={estilos.filaInfo}>
              <MaterialCommunityIcons name="phone-outline" size={16} color="#7DD3C0" />
              <Text style={estilos.textoInfo}>{item.telefono}</Text>
            </View>
          </Card.Content>

          <Card.Actions style={estilos.cardAcciones}>
            <Button
              mode="contained"
              icon="phone"
              buttonColor="#7DD3C0"
              textColor="white"
              style={estilos.botonAccion}
              contentStyle={estilos.botonContenido}
              labelStyle={estilos.botonLabel}
              compact
              onPress={() => handleLlamar(item.telefono)}
            >
              Llamar
            </Button>
            <Button
              mode="outlined"
              icon="map-marker"
              textColor="#7DD3C0"
              style={[estilos.botonAccion, { borderColor: "#7DD3C0" }]}
              contentStyle={estilos.botonContenido}
              labelStyle={estilos.botonLabel}
              compact
              onPress={() => handleComoLlegar(item)}
            >
              Cómo llegar
            </Button>
          </Card.Actions>
        </Card>
      </Animatable.View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      {/* Cabecera */}
      <View style={estilos.cabecera}>
        <View style={estilos.cabeceraFila}>
          <Pressable
            onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
            style={estilos.menuBoton}
          >
            <MaterialCommunityIcons
              name="menu"
              size={width < 380 ? 22 : 26}
              color="white"
            />
          </Pressable>
          <View style={estilos.cabeceraTextos}>
            <Text style={estilos.cabeceraTitulo}>Centros Veterinarios</Text>
            <Text style={estilos.cabeceraSubtitulo}>
              {centros.length} centro{centros.length !== 1 ? "s" : ""} disponible{centros.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      </View>

      {cargando ? (
        <View style={estilos.cargando}>
          <ActivityIndicator size="large" color="#7DD3C0" />
          <Text style={estilos.cargandoTexto}>Cargando centros...</Text>
        </View>
      ) : (
        <FlatList
          data={centros}
          keyExtractor={(item) => item.idCentro.toString()}
          renderItem={renderCentro}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={estilos.vacio}>
              <Animatable.View animation="bounceIn">
                <MaterialCommunityIcons name="hospital-building" size={80} color="#CBD5E0" />
              </Animatable.View>
              <Text style={estilos.vacioTitulo}>Sin centros disponibles</Text>
              <Text style={estilos.vacioSubtitulo}>
                No hay centros veterinarios registrados aún
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  cabecera: {
    backgroundColor: "#7DD3C0",
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  cabeceraFila: { flexDirection: "row", alignItems: "center" },
  menuBoton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cabeceraTextos: { marginLeft: 14, flex: 1 },
  cabeceraTitulo: { color: "white", fontSize: 24, fontWeight: "700" },
  cabeceraSubtitulo: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 2 },
  cargando: { flex: 1, alignItems: "center", justifyContent: "center" },
  cargandoTexto: { color: "#718096", marginTop: 12, fontSize: 15 },
  lista: { padding: 20, paddingBottom: 30 },
  tarjeta: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  fotoContenedor: {
    position: "relative",
  },
  foto: {
    width: "100%",
    height: 170,
  },
  badgeEspecialidad: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
    backgroundColor: "rgba(125, 211, 192, 0.92)",
  },
  badgeTexto: { color: "white", fontSize: 12, fontWeight: "600" },
  cardTitulo: { fontSize: 17, fontWeight: "700", color: "#2D3748" },
  cardSubtitulo: { fontSize: 13, color: "#718096" },
  cardContenido: { paddingTop: 4, paddingBottom: 8, gap: 8 },
  filaInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  textoInfo: {
    fontSize: 13,
    color: "#4A5568",
    flex: 1,
    lineHeight: 18,
  },
  cardAcciones: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  botonAccion: { flex: 1, borderRadius: 12 },
  botonContenido: { paddingVertical: 2 },
  botonLabel: { fontSize: 13, fontWeight: "600" },
  vacio: { alignItems: "center", marginTop: 80, paddingHorizontal: 40 },
  vacioTitulo: { fontSize: 20, fontWeight: "700", color: "#2D3748", marginTop: 16, marginBottom: 8 },
  vacioSubtitulo: { fontSize: 14, color: "#718096", textAlign: "center", lineHeight: 20 },
});
