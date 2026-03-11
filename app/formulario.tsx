import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Pressable, Platform } from "react-native";
import { TextInput, Button, ActivityIndicator, SegmentedButtons } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Animatable from "react-native-animatable";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Mascota } from "../model/Tipos";
import { crearMascota, actualizarMascota, consultarMascota } from "../helpers/ConsultasApi";
import useMascotaStore from "../stores/useMascotaStore";

export default function Formulario() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const esEdicion = !!id;
  const cargarMascotas = useMascotaStore((state) => state.cargarMascotas);

  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [sexo, setSexo] = useState("Macho");
  const [foto, setFoto] = useState("");
  const [notas, setNotas] = useState("");
  const [estado, setEstado] = useState("Saludable");
  const [proximaVacuna, setProximaVacuna] = useState("Por programar");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(esEdicion);

  const [errores, setErrores] = useState({ nombre: "", especie: "" });
  const nombreRef = useRef<Animatable.View & View>(null);
  const especieRef = useRef<Animatable.View & View>(null);

  useEffect(() => {
    if (esEdicion && id) {
      consultarMascota(parseInt(id))
        .then((m) => {
          setNombre(m.nombre);
          setEspecie(m.especie);
          setRaza(m.raza);
          setEdad(m.edad);
          setPeso(m.peso);
          setSexo(m.sexo);
          setFoto(m.foto);
          setNotas(m.notas);
          setEstado(m.estado);
          setProximaVacuna(m.proximaVacuna);
          setCargandoDatos(false);
        })
        .catch(() => setCargandoDatos(false));
    }
  }, [id]);

  useEffect(() => {
    setProximaVacuna(dayjs(fechaSeleccionada).format("DD/MM/YYYY"));
  }, [fechaSeleccionada]);

  function ponerFecha(event: DateTimePickerEvent, date: Date | undefined) {
    if (event.type === "set" && date) setFechaSeleccionada(date);
    setPickerVisible(false);
  }

  async function seleccionarFoto() {
    Alert.alert("Foto de mascota", "Elige una opción", [
      {
        text: "Cámara",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") return Alert.alert("Permiso denegado");
          const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!r.canceled) setFoto(r.assets[0].uri);
        },
      },
      {
        text: "Galería",
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") return Alert.alert("Permiso denegado");
          const r = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!r.canceled) setFoto(r.assets[0].uri);
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  function validar(): boolean {
    const e = { nombre: "", especie: "" };
    let ok = true;
    if (nombre.trim() === "") { e.nombre = "El nombre es obligatorio"; ok = false; }
    if (especie.trim() === "") { e.especie = "La especie es obligatoria"; ok = false; }
    setErrores(e);
    if (!ok) {
      if (e.nombre) nombreRef.current?.shake?.(800);
      if (e.especie) especieRef.current?.shake?.(800);
    }
    return ok;
  }

  async function guardar() {
    if (!validar()) return;
    setGuardando(true);

    const datos: Mascota = {
      id: esEdicion ? parseInt(id!) : 0,
      nombre: nombre.trim(),
      especie: especie.trim(),
      raza: raza.trim() || "Sin especificar",
      edad: edad.trim() || "Desconocida",
      peso: peso.trim() || "Desconocido",
      sexo,
      foto: foto || "https://via.placeholder.com/200",
      estado,
      proximaVacuna,
      notas: notas.trim(),
    };

    try {
      if (esEdicion) {
        await actualizarMascota(parseInt(id!), datos);
      } else {
        await crearMascota(datos);
      }
      await cargarMascotas();
      Alert.alert("Guardado", "Mascota guardada correctamente");
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la mascota");
      setGuardando(false);
    }
  }

  if (cargandoDatos) {
    return (
      <View style={estilos.contenedor}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#7DD3C0" />
        </View>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      {/* Header */}
      <View style={estilos.header}>
        <Pressable style={estilos.botonVolver} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </Pressable>
        <Text style={estilos.headerTitulo}>
          {esEdicion ? "Editar Mascota" : "Nueva Mascota"}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={estilos.scroll} contentContainerStyle={{ padding: 20 }}>
        {/* Foto */}
        <Animatable.View animation="fadeInUp" delay={100}>
          <Pressable style={estilos.selectorFoto} onPress={seleccionarFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={estilos.fotoPreview} contentFit="cover" />
            ) : (
              <>
                <MaterialCommunityIcons name="camera-plus" size={36} color="#7DD3C0" />
                <Text style={estilos.textoFoto}>Añadir foto</Text>
              </>
            )}
          </Pressable>
        </Animatable.View>

        {/* Campos */}
        <Animatable.View ref={nombreRef}>
            <TextInput
              mode="outlined"
              label="Nombre *"
              value={nombre}
              onChangeText={(t) => { setNombre(t); if (errores.nombre) setErrores((p) => ({ ...p, nombre: "" })); }}
              error={errores.nombre !== ""}
              outlineColor="#E2E8F0"
              activeOutlineColor="#7DD3C0"
              outlineStyle={{ borderRadius: 14 }}
              style={estilos.input}
            />
            {errores.nombre !== "" && <Text style={estilos.errorTexto}>{errores.nombre}</Text>}
          </Animatable.View>

          <Animatable.View ref={especieRef}>
            <TextInput
              mode="outlined"
              label="Especie *"
              value={especie}
              onChangeText={(t) => { setEspecie(t); if (errores.especie) setErrores((p) => ({ ...p, especie: "" })); }}
              error={errores.especie !== ""}
              outlineColor="#E2E8F0"
              activeOutlineColor="#7DD3C0"
              outlineStyle={{ borderRadius: 14 }}
              style={estilos.input}
            />
            {errores.especie !== "" && <Text style={estilos.errorTexto}>{errores.especie}</Text>}
          </Animatable.View>

          <TextInput mode="outlined" label="Raza" value={raza} onChangeText={setRaza}
            outlineColor="#E2E8F0" activeOutlineColor="#7DD3C0" outlineStyle={{ borderRadius: 14 }} style={estilos.input} />

          <View style={estilos.filaDoble}>
            <TextInput mode="outlined" label="Edad" value={edad} onChangeText={setEdad}
              outlineColor="#E2E8F0" activeOutlineColor="#7DD3C0" outlineStyle={{ borderRadius: 14 }}
              style={[estilos.input, { flex: 1, marginRight: 8 }]} />
            <TextInput mode="outlined" label="Peso" value={peso} onChangeText={setPeso}
              outlineColor="#E2E8F0" activeOutlineColor="#7DD3C0" outlineStyle={{ borderRadius: 14 }}
              style={[estilos.input, { flex: 1, marginLeft: 8 }]} />
          </View>

          {/* Sexo */}
          <Text style={estilos.etiqueta}>Sexo</Text>
          <SegmentedButtons
            value={sexo}
            onValueChange={setSexo}
            buttons={[
              { value: "Macho", label: "♂ Macho", checkedColor: "white", uncheckedColor: "#2D3748" },
              { value: "Hembra", label: "♀ Hembra", checkedColor: "white", uncheckedColor: "#2D3748" },
            ]}
            style={estilos.segmented}
            theme={{ colors: { secondaryContainer: "#7DD3C0" } }}
          />

          {/* Estado */}
          <Text style={estilos.etiqueta}>Estado de Salud</Text>
          <SegmentedButtons
            value={estado}
            onValueChange={setEstado}
            buttons={[
              { value: "Saludable", label: "Saludable", checkedColor: "white", uncheckedColor: "#2D3748" },
              { value: "Necesita atención", label: "Atención", checkedColor: "white", uncheckedColor: "#2D3748" },
            ]}
            style={estilos.segmented}
            theme={{ colors: { secondaryContainer: estado === "Saludable" ? "#68D391" : "#F6AD55" } }}
          />

          {/* Vacuna */}
          <Pressable onPress={() => setPickerVisible(true)}>
            <TextInput
              mode="outlined"
              label="Próxima Vacuna"
              value={proximaVacuna}
              editable={false}
              right={<TextInput.Icon icon="calendar" onPress={() => setPickerVisible(true)} />}
              outlineColor="#E2E8F0"
              activeOutlineColor="#7DD3C0"
              outlineStyle={{ borderRadius: 14 }}
              style={estilos.input}
            />
          </Pressable>

          <TextInput
            mode="outlined"
            label="Notas"
            value={notas}
            onChangeText={setNotas}
            multiline
            numberOfLines={3}
            outlineColor="#E2E8F0"
            activeOutlineColor="#7DD3C0"
            outlineStyle={{ borderRadius: 14 }}
            style={[estilos.input, { minHeight: 80 }]}
          />

          {/* Botón guardar */}
          <Button
            mode="contained"
            onPress={guardar}
            disabled={guardando}
            buttonColor="#7DD3C0"
            textColor="white"
            icon={guardando ? undefined : "content-save"}
            style={estilos.botonGuardar}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: "700" }}
          >
            {guardando ? <ActivityIndicator color="white" size={20} /> : "Guardar Mascota"}
          </Button>

          <Button
            mode="text"
            textColor="#718096"
            onPress={() => router.back()}
            style={{ marginTop: 8, marginBottom: 20 }}
          >
            Cancelar
          </Button>
      </ScrollView>

      {pickerVisible && (
        <DateTimePicker mode="date" value={fechaSeleccionada} onChange={ponerFecha} minimumDate={new Date()} />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  header: {
    backgroundColor: "#7DD3C0",
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  botonVolver: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitulo: { color: "white", fontSize: 20, fontWeight: "700" },
  scroll: {
    flex: 1,
  },
  selectorFoto: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: "#F8FAFB",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#7DD3C0",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  fotoPreview: { width: "100%", height: "100%" },
  textoFoto: { fontSize: 12, color: "#718096", marginTop: 4 },
  input: { backgroundColor: "white", marginBottom: 12 },
  filaDoble: { flexDirection: "row" },
  etiqueta: {
    fontSize: 13,
    fontWeight: "600",
    color: "#718096",
    marginBottom: 8,
    marginTop: 4,
  },
  segmented: { marginBottom: 16 },
  errorTexto: { color: "#FC8181", fontSize: 13, marginTop: -8, marginBottom: 8, marginLeft: 4 },
  botonGuardar: { marginTop: 16, borderRadius: 14 },
});
