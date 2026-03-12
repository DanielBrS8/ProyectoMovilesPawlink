import { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView, Alert } from "react-native";
import { Card, Button, Avatar, Chip } from "react-native-paper";
import { useRouter } from "expo-router";
import { useFocusEffect, DrawerActions, useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAdopcionStore from "../../../stores/useAdopcionStore";
import { consultarMascotasAdopcion } from "../../../helpers/ConsultasApi";
import { Mascota } from "../../../model/Tipos";

export default function Adopcion() {
  const router = useRouter();
  const navigation = useNavigation();
  const {
    mascotasEnAdopcion,
    mascotasEnProceso,
    añadir,
    quitar,
    estaEnAdopcion,
    vaciar,
    enviarSolicitud,
    estaEnProceso,
  } = useAdopcionStore();
  const [disponibles, setDisponibles] = useState<Mascota[]>([]);
  const [vista, setVista] = useState<"disponibles" | "carrito">("disponibles");

  useFocusEffect(
    useCallback(() => {
      consultarMascotasAdopcion().then(setDisponibles).catch(() => {});
    }, [])
  );

  function toggleAdopcion(mascota: Mascota) {
    if (estaEnAdopcion(mascota.id)) {
      quitar(mascota.id);
    } else {
      añadir(mascota);
    }
  }

  function handleEnviarSolicitud() {
    enviarSolicitud();
    Alert.alert(
      "Solicitud enviada ✓",
      "Tu solicitud de adopción temporal ha sido registrada. Te contactaremos pronto."
    );
  }

  function renderDisponible({ item, index }: { item: Mascota; index: number }) {
    const enCarrito = estaEnAdopcion(item.id);
    const enProceso = estaEnProceso(item.id);
    return (
      <Animatable.View animation="fadeInUp" delay={index * 80}>
        <Card style={estilos.tarjeta} mode="elevated" elevation={2}>
          <Card.Cover source={{ uri: item.foto }} style={estilos.tarjetaFoto} resizeMode="cover" />
          <View style={[estilos.badgeEstado, item.estado === "Saludable" ? estilos.badgeVerde : estilos.badgeNaranja]}>
            <Text style={estilos.badgeTexto}>{item.estado}</Text>
          </View>
          <Card.Title
            title={item.nombre}
            subtitle={`${item.raza} · ${item.edad}`}
            titleStyle={estilos.nombre}
            subtitleStyle={estilos.subtitulo}
          />
          <Card.Content>
            <Text style={estilos.notas} numberOfLines={2}>{item.notas}</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="text" textColor="#7DD3C0" icon="eye" onPress={() => router.push(`/mascota/${item.id}`)}>
              Ver
            </Button>
            {enProceso ? (
              <Chip
                icon="clock-check-outline"
                style={estilos.chipProceso}
                textStyle={estilos.chipProcesoTexto}
                compact
              >
                En proceso
              </Chip>
            ) : (
              <Button
                mode={enCarrito ? "contained" : "outlined"}
                buttonColor={enCarrito ? "#FC8181" : undefined}
                textColor={enCarrito ? "white" : "#FFB366"}
                icon={enCarrito ? "heart" : "heart-outline"}
                style={enCarrito ? {} : { borderColor: "#FFB366" }}
                onPress={() => toggleAdopcion(item)}
              >
                {enCarrito ? "Añadido" : "Adoptar"}
              </Button>
            )}
          </Card.Actions>
        </Card>
      </Animatable.View>
    );
  }

  const hayCarrito = mascotasEnAdopcion.length > 0;
  const hayEnProceso = mascotasEnProceso.length > 0;

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
          <View style={estilos.cabeceraTextos}>
            <Text style={estilos.cabeceraTitulo}>Adopción</Text>
            <Text style={estilos.cabeceraSubtitulo}>
              {vista === "disponibles"
                ? `${disponibles.length} mascotas disponibles`
                : `${mascotasEnAdopcion.length} en lista · ${mascotasEnProceso.length} en proceso`}
            </Text>
          </View>
        </View>

        {/* Toggle disponibles / carrito */}
        <View style={estilos.vistaToggle}>
          <Pressable
            style={[estilos.vistaBtn, vista === "disponibles" && estilos.vistaBtnActivo]}
            onPress={() => setVista("disponibles")}
          >
            <Text style={[estilos.vistaBtnTexto, vista === "disponibles" && estilos.vistaBtnTextoActivo]}>
              Disponibles
            </Text>
          </Pressable>
          <Pressable
            style={[estilos.vistaBtn, vista === "carrito" && estilos.vistaBtnActivo]}
            onPress={() => setVista("carrito")}
          >
            <Text style={[estilos.vistaBtnTexto, vista === "carrito" && estilos.vistaBtnTextoActivo]}>
              Mi lista ({mascotasEnAdopcion.length + mascotasEnProceso.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Contenido */}
      {vista === "disponibles" ? (
        <FlatList
          data={disponibles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDisponible}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={estilos.vacio}>
              <MaterialCommunityIcons name="paw" size={60} color="#E2E8F0" />
              <Text style={estilos.vacioTexto}>No hay mascotas disponibles ahora</Text>
            </View>
          }
        />
      ) : !hayCarrito && !hayEnProceso ? (
        /* Lista vacía */
        <View style={estilos.vacio}>
          <Animatable.Text animation="bounceIn" style={{ fontSize: 72, marginBottom: 16 }}>
            💛
          </Animatable.Text>
          <Text style={estilos.vacioTitulo}>Lista vacía</Text>
          <Text style={estilos.vacioSubtitulo}>
            Explora las mascotas disponibles y pulsa "Adoptar" para añadirlas
          </Text>
          <Button
            mode="contained"
            icon="paw"
            buttonColor="#FFB366"
            textColor="white"
            style={{ marginTop: 24, borderRadius: 14 }}
            onPress={() => setVista("disponibles")}
          >
            Ver Disponibles
          </Button>
        </View>
      ) : (
        /* Secciones carrito + en proceso */
        <ScrollView contentContainerStyle={estilos.lista} showsVerticalScrollIndicator={false}>

          {/* Sección: solicitudes en proceso */}
          {hayEnProceso && (
            <>
              <View style={estilos.seccionHeader}>
                <MaterialCommunityIcons name="clock-check-outline" size={18} color="#7DD3C0" />
                <Text style={estilos.seccionTitulo}>Solicitudes enviadas</Text>
              </View>
              {mascotasEnProceso.map((mp, index) => (
                <Animatable.View key={mp.mascota.id} animation="fadeInUp" delay={index * 80}>
                  <Card style={[estilos.tarjeta, estilos.tarjetaProceso]} mode="elevated" elevation={1}>
                    <Card.Title
                      title={mp.mascota.nombre}
                      subtitle={`${mp.mascota.raza} · ${mp.mascota.especie}`}
                      titleStyle={estilos.nombre}
                      subtitleStyle={estilos.subtitulo}
                      left={() => <Avatar.Image size={50} source={{ uri: mp.mascota.foto }} style={{ backgroundColor: "#B8E2F2" }} />}
                      right={() => (
                        <View style={estilos.badgeProcesoCont}>
                          <View style={estilos.badgeProcesoInner}>
                            <MaterialCommunityIcons name="clock-check-outline" size={12} color="#7DD3C0" />
                            <Text style={estilos.badgeProcesoTexto}>En proceso</Text>
                          </View>
                          <Text style={estilos.fechaFin}>Hasta {mp.fechaFin}</Text>
                        </View>
                      )}
                    />
                  </Card>
                </Animatable.View>
              ))}
            </>
          )}

          {/* Sección: pendiente de enviar */}
          {hayCarrito && (
            <>
              <View style={estilos.seccionHeader}>
                <MaterialCommunityIcons name="heart-outline" size={18} color="#FFB366" />
                <Text style={[estilos.seccionTitulo, { color: "#FFB366" }]}>Pendiente de enviar</Text>
              </View>
              {mascotasEnAdopcion.map((item, index) => (
                <Animatable.View key={item.id} animation="fadeInUp" delay={index * 80}>
                  <Card style={estilos.tarjeta} mode="elevated" elevation={2}>
                    <Card.Title
                      title={item.nombre}
                      subtitle={`${item.raza} · ${item.especie}`}
                      titleStyle={estilos.nombre}
                      subtitleStyle={estilos.subtitulo}
                      left={() => <Avatar.Image size={50} source={{ uri: item.foto }} style={{ backgroundColor: "#B8E2F2" }} />}
                    />
                    <Card.Actions>
                      <Button mode="text" textColor="#7DD3C0" icon="eye" onPress={() => router.push(`/mascota/${item.id}`)}>
                        Ver
                      </Button>
                      <Button mode="text" textColor="#FC8181" icon="heart-remove" onPress={() => quitar(item.id)}>
                        Quitar
                      </Button>
                    </Card.Actions>
                  </Card>
                </Animatable.View>
              ))}

              <View style={estilos.footerBotonesInline}>
                <Button
                  mode="contained"
                  icon="send"
                  buttonColor="#7DD3C0"
                  textColor="white"
                  style={estilos.botonFooter}
                  contentStyle={{ paddingVertical: 6 }}
                  labelStyle={{ fontSize: 15, fontWeight: "700" }}
                  onPress={handleEnviarSolicitud}
                >
                  Enviar Solicitud
                </Button>
                <Button
                  mode="outlined"
                  icon="delete-sweep"
                  textColor="#FC8181"
                  style={[estilos.botonFooter, { borderColor: "#FC8181" }]}
                  onPress={vaciar}
                >
                  Vaciar lista
                </Button>
              </View>
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  cabecera: {
    backgroundColor: "#FFB366",
    paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  cabeceraFila: { flexDirection: "row", alignItems: "center" },
  menuBoton: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  cabeceraTextos: { marginLeft: 14, flex: 1 },
  cabeceraTitulo: { color: "white", fontSize: 24, fontWeight: "700" },
  cabeceraSubtitulo: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 2 },
  vistaToggle: {
    flexDirection: "row", marginTop: 16, backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12, padding: 3,
  },
  vistaBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  vistaBtnActivo: { backgroundColor: "white" },
  vistaBtnTexto: { fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.8)" },
  vistaBtnTextoActivo: { color: "#FFB366" },
  lista: { padding: 16, paddingBottom: 40 },
  tarjeta: { marginBottom: 16, borderRadius: 18, backgroundColor: "white", overflow: "hidden" },
  tarjetaProceso: { borderLeftWidth: 4, borderLeftColor: "#7DD3C0" },
  tarjetaFoto: { height: 160, borderRadius: 0 },
  badgeEstado: {
    position: "absolute", top: 12, right: 12,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  badgeVerde: { backgroundColor: "rgba(104,211,145,0.9)" },
  badgeNaranja: { backgroundColor: "rgba(246,173,85,0.9)" },
  badgeTexto: { color: "white", fontSize: 12, fontWeight: "600" },
  nombre: { fontSize: 17, fontWeight: "700", color: "#2D3748" },
  subtitulo: { fontSize: 13, color: "#718096" },
  notas: { fontSize: 13, color: "#718096", fontStyle: "italic", lineHeight: 18 },
  chipProceso: { backgroundColor: "#E6FAF7", marginRight: 8 },
  chipProcesoTexto: { color: "#7DD3C0", fontSize: 12, fontWeight: "600" },
  seccionHeader: {
    flexDirection: "row", alignItems: "center", gap: 6,
    marginBottom: 12, marginTop: 4,
  },
  seccionTitulo: { fontSize: 15, fontWeight: "700", color: "#7DD3C0" },
  badgeProcesoCont: { alignItems: "flex-end", marginRight: 12, gap: 2 },
  badgeProcesoInner: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#E6FAF7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  badgeProcesoTexto: { color: "#7DD3C0", fontSize: 11, fontWeight: "600" },
  fechaFin: { fontSize: 11, color: "#718096" },
  footerBotonesInline: { marginTop: 8, gap: 8 },
  botonFooter: { borderRadius: 14 },
  vacio: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, marginTop: 60 },
  vacioTitulo: { fontSize: 22, fontWeight: "700", color: "#2D3748", marginBottom: 8 },
  vacioSubtitulo: { fontSize: 15, color: "#718096", textAlign: "center", lineHeight: 22 },
  vacioTexto: { fontSize: 15, color: "#718096", marginTop: 12 },
});
