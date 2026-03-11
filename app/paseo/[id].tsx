import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { Button, Card, ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Coordenada } from "../../model/Tipos";
import { consultarMascota, crearPaseo } from "../../helpers/ConsultasApi";

export default function PantallaPaseo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [nombreMascota, setNombreMascota] = useState("");
  const [ubicacionActual, setUbicacionActual] = useState<Coordenada | null>(null);
  const [ruta, setRuta] = useState<Coordenada[]>([]);
  const [paseando, setPaseando] = useState(false);
  const [tiempoSegundos, setTiempoSegundos] = useState(0);
  const [distanciaKm, setDistanciaKm] = useState(0);

  const suscripcionUbicacion = useRef<Location.LocationSubscription | null>(null);
  const intervaloTiempo = useRef<NodeJS.Timeout | null>(null);
  const mapaRef = useRef<MapView | null>(null);

  useEffect(() => {
    consultarMascota(parseInt(id))
      .then((m) => setNombreMascota(m.nombre))
      .catch(() => {});
    obtenerUbicacionInicial();
    return () => {
      if (suscripcionUbicacion.current) suscripcionUbicacion.current.remove();
      if (intervaloTiempo.current) clearInterval(intervaloTiempo.current);
    };
  }, []);

  async function obtenerUbicacionInicial() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tu ubicación");
      return;
    }
    const ubicacion = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setUbicacionActual({
      latitude: ubicacion.coords.latitude,
      longitude: ubicacion.coords.longitude,
    });
  }

  function iniciarPaseo() {
    if (!ubicacionActual) { Alert.alert("Error", "Esperando GPS..."); return; }
    setPaseando(true);
    setRuta([ubicacionActual]);
    setTiempoSegundos(0);
    setDistanciaKm(0);

    intervaloTiempo.current = setInterval(() => setTiempoSegundos((p) => p + 1), 1000);

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 3000 },
      (ubicacion) => {
        const nueva: Coordenada = { latitude: ubicacion.coords.latitude, longitude: ubicacion.coords.longitude };
        setUbicacionActual(nueva);
        setRuta((rutaActual) => {
          const nuevaRuta = [...rutaActual, nueva];
          if (rutaActual.length > 0) {
            const ultima = rutaActual[rutaActual.length - 1];
            setDistanciaKm((p) => p + calcularDistancia(ultima, nueva));
          }
          return nuevaRuta;
        });
        mapaRef.current?.animateToRegion({ ...nueva, latitudeDelta: 0.005, longitudeDelta: 0.005 });
      }
    ).then((s) => { suscripcionUbicacion.current = s; });
  }

  function detenerPaseo() {
    if (intervaloTiempo.current) { clearInterval(intervaloTiempo.current); intervaloTiempo.current = null; }
    if (suscripcionUbicacion.current) { suscripcionUbicacion.current.remove(); suscripcionUbicacion.current = null; }
    setPaseando(false);

    if (ruta.length > 1) {
      const tf = tiempoSegundos;
      const df = distanciaKm;
      crearPaseo({
        id: 0, mascotaId: parseInt(id), fecha: obtenerFechaActual(),
        duracion: formatearTiempo(tf), distancia: Math.round(df * 100) / 100, ruta,
      })
        .then(() => Alert.alert("Paseo guardado", `Duración: ${formatearTiempo(tf)}\nDistancia: ${df.toFixed(2)} km`))
        .catch((e) => console.log("Error:", e.message));
    }
  }

  function calcularDistancia(c1: Coordenada, c2: Coordenada): number {
    const R = 6371;
    const dLat = ((c2.latitude - c1.latitude) * Math.PI) / 180;
    const dLon = ((c2.longitude - c1.longitude) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((c1.latitude * Math.PI) / 180) * Math.cos((c2.latitude * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function formatearTiempo(s: number): string {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const seg = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${seg}`;
  }

  function obtenerFechaActual(): string {
    const f = new Date();
    return `${f.getDate().toString().padStart(2, "0")}/${(f.getMonth() + 1).toString().padStart(2, "0")}/${f.getFullYear()}`;
  }

  function handleVolver() {
    if (paseando) {
      Alert.alert("Paseo en curso", "¿Detener paseo?", [
        { text: "Seguir", style: "cancel" },
        { text: "Detener y salir", onPress: () => { detenerPaseo(); router.back(); } },
      ]);
    } else {
      router.back();
    }
  }

  return (
    <View style={estilos.contenedor}>
      {/* Header */}
      <View style={estilos.header}>
        <Pressable style={estilos.botonVolver} onPress={handleVolver}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </Pressable>
        <View style={estilos.headerTextos}>
          <Text style={estilos.headerTitulo}>Paseo con {nombreMascota}</Text>
          <Text style={estilos.headerSubtitulo}>Registra tu recorrido</Text>
        </View>
      </View>

      {/* Mapa */}
      <View style={estilos.mapaContenedor}>
        {ubicacionActual ? (
          <MapView
            ref={mapaRef}
            style={estilos.mapa}
            initialRegion={{ ...ubicacionActual, latitudeDelta: 0.005, longitudeDelta: 0.005 }}
            showsUserLocation showsMyLocationButton
          >
            {ruta.length > 1 && <Polyline coordinates={ruta} strokeColor="#FFB366" strokeWidth={4} />}
            {ruta.length > 0 && (
              <Marker coordinate={ruta[0]} title="Inicio">
                <View style={estilos.marcador}><Text>🏁</Text></View>
              </Marker>
            )}
          </MapView>
        ) : (
          <View style={estilos.mapaCargando}>
            <ActivityIndicator size="large" color="#7DD3C0" />
            <Text style={estilos.cargandoTexto}>Obteniendo ubicación...</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <Animatable.View animation="fadeInUp" style={estilos.statsRow}>
        <Card style={estilos.statCard}>
          <Card.Content style={estilos.statContenido}>
            <MaterialCommunityIcons name="timer-outline" size={28} color="#7DD3C0" />
            <Text style={estilos.statValor}>{formatearTiempo(tiempoSegundos)}</Text>
            <Text style={estilos.statEtiqueta}>Tiempo</Text>
          </Card.Content>
        </Card>
        <Card style={estilos.statCard}>
          <Card.Content style={estilos.statContenido}>
            <MaterialCommunityIcons name="map-marker-distance" size={28} color="#FFB366" />
            <Text style={estilos.statValor}>{distanciaKm.toFixed(2)} km</Text>
            <Text style={estilos.statEtiqueta}>Distancia</Text>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* Botón */}
      {paseando ? (
        <Button
          mode="contained"
          icon="stop"
          buttonColor="#FC8181"
          textColor="white"
          style={estilos.botonAccion}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{ fontSize: 18, fontWeight: "700" }}
          onPress={detenerPaseo}
        >
          Detener Paseo
        </Button>
      ) : (
        <Animatable.View animation="pulse" iterationCount={3}>
          <Button
            mode="contained"
            icon="play"
            buttonColor="#FFB366"
            textColor="white"
            style={estilos.botonAccion}
            contentStyle={{ paddingVertical: 10 }}
            labelStyle={{ fontSize: 18, fontWeight: "700" }}
            onPress={iniciarPaseo}
          >
            Comenzar Paseo
          </Button>
        </Animatable.View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  header: {
    backgroundColor: "#7DD3C0", paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexDirection: "row", alignItems: "center",
  },
  botonVolver: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  headerTextos: { marginLeft: 14 },
  headerTitulo: { color: "white", fontSize: 20, fontWeight: "700" },
  headerSubtitulo: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  mapaContenedor: {
    margin: 16, height: 280, borderRadius: 22, overflow: "hidden", backgroundColor: "#B8E2F2",
  },
  mapa: { flex: 1 },
  mapaCargando: { flex: 1, alignItems: "center", justifyContent: "center" },
  cargandoTexto: { color: "#718096", marginTop: 12, fontSize: 15 },
  marcador: { backgroundColor: "white", padding: 4, borderRadius: 20 },
  statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 12 },
  statCard: { flex: 1, borderRadius: 18, backgroundColor: "white" },
  statContenido: { alignItems: "center", paddingVertical: 16 },
  statValor: { fontSize: 22, fontWeight: "700", color: "#2D3748", marginTop: 6 },
  statEtiqueta: { fontSize: 12, color: "#718096", marginTop: 2 },
  botonAccion: { marginHorizontal: 16, marginTop: 20, borderRadius: 18 },
});
