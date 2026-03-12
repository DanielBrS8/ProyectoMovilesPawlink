import { useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { TextInput, ActivityIndicator, FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import { useFocusEffect, DrawerActions, useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useMascotaStore from "../../../stores/useMascotaStore";
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
              {listaMascotas.length} mascota{listaMascotas.length !== 1 ? "s" : ""} registrada{listaMascotas.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

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
      </View>

      {cargando ? (
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
      )}

      <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={3000}>
        <FAB
          icon="plus"
          style={estilos.fab}
          color="white"
          onPress={() => router.push("/formulario")}
        />
      </Animatable.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  cabecera: {
    backgroundColor: "#7DD3C0",
    paddingTop: 52, paddingBottom: 24, paddingHorizontal: 20,
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
  buscador: { marginTop: 16, backgroundColor: "rgba(255,255,255,0.15)", fontSize: 14 },
  cargando: { flex: 1, alignItems: "center", justifyContent: "center" },
  cargandoTexto: { color: "#718096", marginTop: 12, fontSize: 15 },
  lista: { padding: 20, paddingBottom: 100 },
  vacio: { alignItems: "center", marginTop: 60, paddingHorizontal: 40 },
  vacioTitulo: { fontSize: 22, fontWeight: "700", color: "#2D3748", marginBottom: 8 },
  vacioSubtitulo: { fontSize: 15, color: "#718096", textAlign: "center", lineHeight: 22 },
  fab: { position: "absolute", bottom: 24, right: 24, backgroundColor: "#FFB366", borderRadius: 18 },
});
