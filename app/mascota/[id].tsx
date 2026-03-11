import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Pressable, useWindowDimensions } from "react-native";
import { Button, Card, Avatar, ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Mascota, Paseos } from "../../model/Tipos";
import { consultarMascota, consultarPaseosMascota } from "../../helpers/ConsultasApi";
import useMascotaStore from "../../stores/useMascotaStore";
import useAdopcionStore from "../../stores/useAdopcionStore";

export default function DetalleMascota() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const eliminar = useMascotaStore((state) => state.eliminar);
  const { añadir, quitar, estaEnAdopcion } = useAdopcionStore();

  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [paseos, setPaseos] = useState<Paseos>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      const idNum = parseInt(id);
      const [datosMascota, datosPaseos] = await Promise.all([
        consultarMascota(idNum),
        consultarPaseosMascota(idNum),
      ]);
      setMascota(datosMascota);
      setPaseos(datosPaseos);
    } catch (error) {
      console.log("Error cargando detalle:", error);
    } finally {
      setCargando(false);
    }
  }

  function confirmarBorrar() {
    if (!mascota) return;
    Alert.alert(
      "Eliminar mascota",
      `¿Seguro que quieres eliminar a ${mascota.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await eliminar(mascota.id);
            Alert.alert("Eliminada", `${mascota.nombre} ha sido eliminada`);
            router.back();
          },
        },
      ]
    );
  }

  function handleAdoptar() {
    if (!mascota) return;
    if (estaEnAdopcion(mascota.id)) {
      quitar(mascota.id);
    } else {
      añadir(mascota);
    }
  }

  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color="#7DD3C0" />
      </View>
    );
  }

  if (!mascota) {
    return (
      <View style={estilos.cargando}>
        <Text style={{ color: "#718096", fontSize: 16 }}>Mascota no encontrada</Text>
      </View>
    );
  }

  const esSaludable = mascota.estado === "Saludable";
  const enAdopcion = estaEnAdopcion(mascota.id);
  const avatarSize = width < 380 ? 100 : 130;

  return (
    <View style={estilos.contenedor}>
      {/* Header con foto */}
      <View style={estilos.header}>
        <Pressable style={estilos.botonVolver} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
        </Pressable>

        <Animatable.View animation="bounceIn" duration={800} style={estilos.avatarContenedor}>
          <Image
            source={{ uri: mascota.foto }}
            style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 3 }}
            contentFit="cover"
          />
        </Animatable.View>

        <Animatable.Text animation="fadeIn" delay={200} style={estilos.nombre}>
          {mascota.nombre}
        </Animatable.Text>
        <Text style={estilos.razaEspecie}>
          {mascota.raza} · {mascota.especie}
        </Text>
      </View>

      {/* Stats */}
      <View style={estilos.statsRow}>
        {[
          { valor: mascota.edad, etiqueta: "Edad", icono: "calendar" as const },
          { valor: mascota.peso, etiqueta: "Peso", icono: "scale" as const },
          { valor: mascota.sexo === "Hembra" ? "♀" : "♂", etiqueta: "Sexo", icono: "gender-male-female" as const },
        ].map((stat, i) => (
          <Animatable.View key={i} animation="fadeInUp" delay={300 + i * 100} style={estilos.statCard}>
            <MaterialCommunityIcons name={stat.icono} size={20} color="#7DD3C0" />
            <Text style={estilos.statValor}>{stat.valor}</Text>
            <Text style={estilos.statEtiqueta}>{stat.etiqueta}</Text>
          </Animatable.View>
        ))}
      </View>

      <ScrollView style={estilos.contenido} showsVerticalScrollIndicator={false}>
        {/* Estado de salud */}
        <Animatable.View animation="fadeInUp" delay={500}>
          <Card style={estilos.tarjeta} mode="elevated" elevation={1}>
            <Card.Title
              title="Estado de Salud"
              titleStyle={estilos.seccionTitulo}
              left={() => (
                <Avatar.Icon
                  size={40}
                  icon={esSaludable ? "heart-pulse" : "alert-circle"}
                  style={{ backgroundColor: esSaludable ? "#C6F6D5" : "#FEEBC8" }}
                  color={esSaludable ? "#276749" : "#C05621"}
                />
              )}
              right={() => (
                <View style={[estilos.badge, esSaludable ? estilos.badgeVerde : estilos.badgeNaranja]}>
                  <Text style={estilos.badgeTexto}>{mascota.estado}</Text>
                </View>
              )}
            />
          </Card>
        </Animatable.View>

        {/* Vacuna */}
        <Animatable.View animation="fadeInUp" delay={600}>
          <Card style={estilos.tarjeta} mode="elevated" elevation={1}>
            <Card.Title
              title="Próxima Vacuna"
              subtitle={mascota.proximaVacuna}
              titleStyle={estilos.seccionTitulo}
              subtitleStyle={estilos.seccionSubtitulo}
              left={() => (
                <Avatar.Icon size={40} icon="needle" style={{ backgroundColor: "#B8E2F2" }} color="#2D3748" />
              )}
            />
          </Card>
        </Animatable.View>

        {/* Notas */}
        {mascota.notas !== "" && (
          <Animatable.View animation="fadeInUp" delay={700}>
            <Card style={estilos.tarjeta} mode="elevated" elevation={1}>
              <Card.Title
                title="Notas"
                titleStyle={estilos.seccionTitulo}
                left={() => (
                  <Avatar.Icon size={40} icon="note-text" style={{ backgroundColor: "#FFD4A3" }} color="#2D3748" />
                )}
              />
              <Card.Content>
                <Text style={estilos.textoNotas}>{mascota.notas}</Text>
              </Card.Content>
            </Card>
          </Animatable.View>
        )}

        {/* Paseos */}
        <Animatable.View animation="fadeInUp" delay={800}>
          <Text style={estilos.seccionHeader}>Historial de Paseos</Text>
          {paseos.length > 0 ? (
            paseos.map((paseo) => (
              <Card key={paseo.id} style={estilos.tarjeta} mode="elevated" elevation={1}>
                <Card.Title
                  title={paseo.fecha}
                  subtitle={`${paseo.duracion} · ${paseo.distancia} km`}
                  titleStyle={estilos.seccionTitulo}
                  subtitleStyle={estilos.seccionSubtitulo}
                  left={() => (
                    <Avatar.Icon size={40} icon="walk" style={{ backgroundColor: "#A8E6D8" }} color="#2D3748" />
                  )}
                />
              </Card>
            ))
          ) : (
            <Card style={estilos.tarjeta}>
              <Card.Content>
                <Text style={estilos.textoNotas}>Aún no hay paseos registrados</Text>
              </Card.Content>
            </Card>
          )}
        </Animatable.View>

        {/* Botones de acción */}
        <View style={estilos.botonesSeccion}>
          <Animatable.View animation="pulse" iterationCount={1} delay={1000}>
            <Button
              mode="contained"
              icon="walk"
              buttonColor="#7DD3C0"
              textColor="white"
              style={estilos.botonAccion}
              contentStyle={estilos.botonContenido}
              labelStyle={estilos.botonLabel}
              onPress={() => router.push(`/paseo/${mascota.id}`)}
            >
              Iniciar Paseo
            </Button>
          </Animatable.View>

          <Button
            mode="contained"
            icon={enAdopcion ? "heart" : "heart-outline"}
            buttonColor={enAdopcion ? "#FC8181" : "#FFB366"}
            textColor="white"
            style={estilos.botonAccion}
            contentStyle={estilos.botonContenido}
            labelStyle={estilos.botonLabel}
            onPress={handleAdoptar}
          >
            {enAdopcion ? "Quitar Adopción" : "Solicitar Adopción"}
          </Button>

          <Button
            mode="outlined"
            icon="pencil"
            textColor="#7DD3C0"
            style={[estilos.botonAccion, { borderColor: "#7DD3C0" }]}
            contentStyle={estilos.botonContenido}
            labelStyle={estilos.botonLabel}
            onPress={() => router.push(`/formulario?id=${mascota.id}`)}
          >
            Editar Mascota
          </Button>

          <Button
            mode="outlined"
            icon="delete"
            textColor="#FC8181"
            style={[estilos.botonAccion, { borderColor: "#FC8181" }]}
            contentStyle={estilos.botonContenido}
            labelStyle={estilos.botonLabel}
            onPress={confirmarBorrar}
          >
            Eliminar Mascota
          </Button>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  cargando: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFB" },
  header: {
    backgroundColor: "#87CEEB",
    paddingTop: 52,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  botonVolver: {
    position: "absolute",
    left: 20,
    top: 52,
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContenedor: {
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 45,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  nombre: { color: "white", fontSize: 28, fontWeight: "700", marginTop: 16 },
  razaEspecie: { color: "rgba(255,255,255,0.8)", fontSize: 15, marginTop: 4 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginTop: -25,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    minWidth: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statValor: { fontSize: 16, fontWeight: "700", color: "#2D3748", marginTop: 4 },
  statEtiqueta: { fontSize: 11, color: "#718096", marginTop: 2 },
  contenido: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  tarjeta: { marginBottom: 12, borderRadius: 16, backgroundColor: "white" },
  seccionTitulo: { fontSize: 15, fontWeight: "600", color: "#2D3748" },
  seccionSubtitulo: { fontSize: 13, color: "#718096" },
  seccionHeader: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 4,
  },
  textoNotas: { fontSize: 14, color: "#718096", lineHeight: 20, paddingBottom: 8 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 16,
  },
  badgeVerde: { backgroundColor: "#C6F6D5" },
  badgeNaranja: { backgroundColor: "#FEEBC8" },
  badgeTexto: { fontSize: 12, fontWeight: "600", color: "#2D3748" },
  botonesSeccion: { marginTop: 16, gap: 12 },
  botonAccion: { borderRadius: 14 },
  botonContenido: { paddingVertical: 6 },
  botonLabel: { fontSize: 15, fontWeight: "600" },
});
