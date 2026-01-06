import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Mascota, Coordenada } from "../model/Tipos";
import { crearPaseo } from "../helpers/ConsultasApi";
import { colores } from "../styles/GlobalStyles";

type PantallaPaseoProps = {
  mascota: Mascota;
  onVolver: () => void;
};

export default function PantallaPaseo({
  mascota,
  onVolver,
}: PantallaPaseoProps) {
  const [ubicacionActual, setUbicacionActual] = useState<Coordenada | null>(
    null
  );
  const [ruta, setRuta] = useState<Coordenada[]>([]);
  const [paseando, setPaseando] = useState(false);
  const [tiempoSegundos, setTiempoSegundos] = useState(0);
  const [distanciaKm, setDistanciaKm] = useState(0);

  const suscripcionUbicacion = useRef<Location.LocationSubscription | null>(
    null
  );
  const intervaloTiempo = useRef<NodeJS.Timeout | null>(null);
  const mapaRef = useRef<MapView | null>(null);

  useEffect(() => {
    obtenerUbicacionInicial();
    return () => {
      if (suscripcionUbicacion.current) {
        suscripcionUbicacion.current.remove();
      }
      if (intervaloTiempo.current) {
        clearInterval(intervaloTiempo.current);
      }
    };
  }, []);

  async function obtenerUbicacionInicial() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tu ubicación para rastrear el paseo"
      );
      return;
    }

    const ubicacion = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const coord: Coordenada = {
      latitude: ubicacion.coords.latitude,
      longitude: ubicacion.coords.longitude,
    };
    setUbicacionActual(coord);
  }

  function iniciarPaseo() {
    if (!ubicacionActual) {
      Alert.alert("Error", "Esperando ubicación GPS...");
      return;
    }

    setPaseando(true);
    setRuta([ubicacionActual]);
    setTiempoSegundos(0);
    setDistanciaKm(0);

    intervaloTiempo.current = setInterval(() => {
      setTiempoSegundos((prev) => prev + 1);
    }, 1000);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
        timeInterval: 3000,
      },
      (ubicacion) => {
        const nuevaCoordenada: Coordenada = {
          latitude: ubicacion.coords.latitude,
          longitude: ubicacion.coords.longitude,
        };

        setUbicacionActual(nuevaCoordenada);
        setRuta((rutaActual) => {
          const nuevaRuta = [...rutaActual, nuevaCoordenada];
          if (rutaActual.length > 0) {
            const ultimaPosicion = rutaActual[rutaActual.length - 1];
            const distanciaAdicional = calcularDistancia(
              ultimaPosicion,
              nuevaCoordenada
            );
            setDistanciaKm((prev) => prev + distanciaAdicional);
          }
          return nuevaRuta;
        });

        mapaRef.current?.animateToRegion({
          ...nuevaCoordenada,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    ).then((suscripcion) => {
      suscripcionUbicacion.current = suscripcion;
    });
  }

  function detenerPaseo() {
    // Parar timer PRIMERO
    if (intervaloTiempo.current) {
      clearInterval(intervaloTiempo.current);
      intervaloTiempo.current = null;
    }

    // Parar tracking
    if (suscripcionUbicacion.current) {
      suscripcionUbicacion.current.remove();
      suscripcionUbicacion.current = null;
    }

    setPaseando(false);

    // Guardar el paseo si hay ruta
    if (ruta.length > 1) {
      // Guardar el tiempo actual antes de que cambie
      const tiempoFinal = tiempoSegundos;
      const distanciaFinal = distanciaKm;

      const paseoData = {
        id: 0,
        mascotaId: mascota.id,
        fecha: obtenerFechaActual(),
        duracion: formatearTiempo(tiempoFinal),
        distancia: Math.round(distanciaFinal * 100) / 100,
        ruta: ruta,
      };

      crearPaseo(paseoData)
        .then(() => {
          Alert.alert(
            "¡Paseo guardado!",
            `Duración: ${formatearTiempo(
              tiempoFinal
            )}\nDistancia: ${distanciaFinal.toFixed(2)} km`,
            [{ text: "OK" }]
          );
        })
        .catch((error) =>
          console.log("Error al guardar paseo:", error.message)
        );
    }
  }

  function calcularDistancia(coord1: Coordenada, coord2: Coordenada): number {
    const R = 6371;
    const dLat = aRadianes(coord2.latitude - coord1.latitude);
    const dLon = aRadianes(coord2.longitude - coord1.longitude);
    const lat1 = aRadianes(coord1.latitude);
    const lat2 = aRadianes(coord2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function aRadianes(grados: number): number {
    return (grados * Math.PI) / 180;
  }

  function formatearTiempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos
      .toString()
      .padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  }

  function obtenerFechaActual(): string {
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  function handleVolver() {
    if (paseando) {
      Alert.alert(
        "Paseo en curso",
        "¿Quieres detener el paseo antes de salir?",
        [
          { text: "Continuar paseando", style: "cancel" },
          {
            text: "Detener y salir",
            onPress: () => {
              detenerPaseo();
              onVolver();
            },
          },
        ]
      );
    } else {
      onVolver();
    }
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.header}>
        <View style={styles.headerFila}>
          <Pressable onPress={handleVolver}>
            <Text style={styles.iconoVolver}>←</Text>
          </Pressable>
          <View style={styles.headerTextos}>
            <Text style={styles.headerTitulo}>Paseo con {mascota.nombre}</Text>
            <Text style={styles.headerSubtitulo}>Registra tu recorrido</Text>
          </View>
          <View style={{ width: 30 }} />
        </View>
      </View>

      <View style={styles.mapaContenedor}>
        {ubicacionActual ? (
          <MapView
            ref={mapaRef}
            style={styles.mapa}
            initialRegion={{
              latitude: ubicacionActual.latitude,
              longitude: ubicacionActual.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {ruta.length > 1 && (
              <Polyline
                coordinates={ruta}
                strokeColor={colores.acento}
                strokeWidth={4}
              />
            )}

            {ruta.length > 0 && (
              <Marker coordinate={ruta[0]} title="Inicio">
                <View style={styles.marcadorInicio}>
                  <Text>🏁</Text>
                </View>
              </Marker>
            )}
          </MapView>
        ) : (
          <View style={styles.mapaCargando}>
            <Text style={styles.textoCargando}>📍 Obteniendo ubicación...</Text>
          </View>
        )}
      </View>

      <View style={styles.statsContenedor}>
        <View style={styles.statCard}>
          <Text style={styles.statIcono}>⏱️</Text>
          <Text style={styles.statValor}>
            {formatearTiempo(tiempoSegundos)}
          </Text>
          <Text style={styles.statEtiqueta}>Tiempo</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcono}>📏</Text>
          <Text style={styles.statValor}>{distanciaKm.toFixed(2)} km</Text>
          <Text style={styles.statEtiqueta}>Distancia</Text>
        </View>
      </View>

      {paseando ? (
        <Pressable style={styles.botonDetener} onPress={detenerPaseo}>
          <Text style={styles.textoBoton}>⏹️ Detener Paseo</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.botonIniciar} onPress={iniciarPaseo}>
          <Text style={styles.textoBoton}>▶️ Comenzar Paseo</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  header: {
    backgroundColor: colores.primario,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconoVolver: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
  },
  headerTextos: {
    alignItems: "center",
  },
  headerTitulo: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtitulo: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  mapaContenedor: {
    margin: 20,
    height: 300,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: colores.secundarioClaro,
  },
  mapa: {
    flex: 1,
  },
  mapaCargando: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textoCargando: {
    fontSize: 16,
    color: colores.texto,
  },
  marcadorInicio: {
    backgroundColor: "white",
    padding: 4,
    borderRadius: 20,
  },
  statsContenedor: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: colores.tarjeta,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcono: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValor: {
    fontSize: 24,
    fontWeight: "700",
    color: colores.texto,
  },
  statEtiqueta: {
    fontSize: 12,
    color: colores.textoClaro,
    marginTop: 4,
  },
  botonIniciar: {
    backgroundColor: colores.acento,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
    shadowColor: colores.acento,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  botonDetener: {
    backgroundColor: colores.peligro,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
    shadowColor: colores.peligro,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  textoBoton: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
