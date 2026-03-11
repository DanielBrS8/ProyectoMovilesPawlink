import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Mascota } from "../model/Tipos";
import { crearMascota, actualizarMascota } from "../helpers/ConsultasApi";
import { colores } from "../styles/GlobalStyles";

type PantallaFormularioProps = {
  mascota: Mascota | null;
  onVolver: () => void;
  onGuardar: () => void;
};

export default function PantallaFormulario({
  mascota,
  onVolver,
  onGuardar,
}: PantallaFormularioProps) {
  const esEdicion = mascota !== null;

  // Estados del formulario
  const [nombre, setNombre] = useState(mascota?.nombre || "");
  const [especie, setEspecie] = useState(mascota?.especie || "");
  const [raza, setRaza] = useState(mascota?.raza || "");
  const [edad, setEdad] = useState(mascota?.edad || "");
  const [peso, setPeso] = useState(mascota?.peso || "");
  const [sexo, setSexo] = useState(mascota?.sexo || "Macho");
  const [foto, setFoto] = useState(mascota?.foto || "");
  const [notas, setNotas] = useState(mascota?.notas || "");
  const [guardando, setGuardando] = useState(false);
  const [estado, setEstado] = useState(mascota?.estado || "Saludable");

  // Estados para el DateTimePicker de vacunas
  const [pickerVisible, setPickerVisible] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [proximaVacuna, setProximaVacuna] = useState(
    mascota?.proximaVacuna || "Por programar"
  );

  // Actualizar proximaVacuna cuando cambia fechaSeleccionada
  useEffect(() => {
    setProximaVacuna(dayjs(fechaSeleccionada).format("DD/MM/YYYY"));
  }, [fechaSeleccionada]);

  // Función para procesar la fecha elegida
  function ponerFecha(event: DateTimePickerEvent, date: Date | undefined) {
    if (event.type === "set" && date !== undefined) {
      setFechaSeleccionada(date);
    }
    setPickerVisible(false);
  }

  // Función para abrir la cámara
  async function abrirCamara() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a la cámara para tomar fotos"
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      setFoto(resultado.assets[0].uri);
    }
  }

  // Función para abrir galería
  async function abrirGaleria() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la galería");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      setFoto(resultado.assets[0].uri);
    }
  }

  // Mostrar opciones de foto
  function seleccionarFoto() {
    Alert.alert("Seleccionar foto", "¿De dónde quieres obtener la foto?", [
      { text: "Cámara", onPress: abrirCamara },
      { text: "Galería", onPress: abrirGaleria },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  // Validar y guardar
  function guardar() {
    if (nombre.trim() === "") {
      Alert.alert("Campo requerido", "El nombre es obligatorio");
      return;
    }
    if (especie.trim() === "") {
      Alert.alert("Campo requerido", "La especie es obligatoria");
      return;
    }

    setGuardando(true);

    const datosMascota: Mascota = {
      id: mascota?.id || 0,
      nombre: nombre.trim(),
      especie: especie.trim(),
      raza: raza.trim() || "Sin especificar",
      edad: edad.trim() || "Desconocida",
      peso: peso.trim() || "Desconocido",
      sexo,
      foto: foto || "https://via.placeholder.com/200?text=🐾",
      estado: estado,
      proximaVacuna: proximaVacuna,
      notas: notas.trim(),
    };

    if (esEdicion && mascota) {
      actualizarMascota(mascota.id, datosMascota)
        .then(() => {
          onGuardar();
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
          setGuardando(false);
        });
    } else {
      crearMascota(datosMascota)
        .then(() => {
          onGuardar();
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
          setGuardando(false);
        });
    }
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.header}>
        <View style={styles.headerFila}>
          <Pressable onPress={onVolver}>
            <Text style={styles.iconoVolver}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>
            {esEdicion ? "Editar Mascota" : "Nueva Mascota"}
          </Text>
          <View style={{ width: 30 }} />
        </View>
      </View>

      <ScrollView
        style={styles.formulario}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.selectorFoto} onPress={seleccionarFoto}>
          {foto ? (
            <Image
              source={{ uri: foto }}
              style={styles.fotoPreview}
              contentFit="cover"
            />
          ) : (
            <>
              <Text style={styles.iconoFoto}>📷</Text>
              <Text style={styles.textoFoto}>Añadir foto</Text>
            </>
          )}
        </Pressable>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>NOMBRE *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de tu mascota"
            placeholderTextColor={colores.textoClaro}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>ESPECIE *</Text>
          <TextInput
            style={styles.input}
            placeholder="Perro, Gato, etc."
            placeholderTextColor={colores.textoClaro}
            value={especie}
            onChangeText={setEspecie}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>RAZA</Text>
          <TextInput
            style={styles.input}
            placeholder="Raza de tu mascota"
            placeholderTextColor={colores.textoClaro}
            value={raza}
            onChangeText={setRaza}
          />
        </View>

        <View style={styles.filaDoble}>
          <View style={[styles.campo, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.etiqueta}>EDAD</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 3 años"
              placeholderTextColor={colores.textoClaro}
              value={edad}
              onChangeText={setEdad}
            />
          </View>
          <View style={[styles.campo, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.etiqueta}>PESO</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 12 kg"
              placeholderTextColor={colores.textoClaro}
              value={peso}
              onChangeText={setPeso}
            />
          </View>
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>SEXO</Text>
          <View style={styles.selectorSexo}>
            <Pressable
              style={[
                styles.opcionSexo,
                sexo === "Macho" && styles.opcionSexoActiva,
              ]}
              onPress={() => setSexo("Macho")}
            >
              <Text
                style={[
                  styles.textoOpcionSexo,
                  sexo === "Macho" && styles.textoOpcionSexoActiva,
                ]}
              >
                ♂ Macho
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.opcionSexo,
                sexo === "Hembra" && styles.opcionSexoActiva,
              ]}
              onPress={() => setSexo("Hembra")}
            >
              <Text
                style={[
                  styles.textoOpcionSexo,
                  sexo === "Hembra" && styles.textoOpcionSexoActiva,
                ]}
              >
                ♀ Hembra
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>ESTADO DE SALUD</Text>
          <View style={styles.selectorSexo}>
            <Pressable
              style={[
                styles.opcionSexo,
                estado === "Saludable" && styles.opcionEstadoSaludable,
              ]}
              onPress={() => setEstado("Saludable")}
            >
              <Text
                style={[
                  styles.textoOpcionSexo,
                  estado === "Saludable" && styles.textoOpcionSexoActiva,
                ]}
              >
                Saludable
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.opcionSexo,
                estado === "Necesita atención" && styles.opcionEstadoAtencion,
              ]}
              onPress={() => setEstado("Necesita atención")}
            >
              <Text
                style={[
                  styles.textoOpcionSexo,
                  estado === "Necesita atención" &&
                    styles.textoOpcionSexoActiva,
                ]}
              >
                Atención
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>PRÓXIMA VACUNA 💉</Text>
          <Pressable
            style={styles.input}
            onPress={() => setPickerVisible(true)}
          >
            <Text style={styles.textoFechaVacuna}>{proximaVacuna}</Text>
          </Pressable>
        </View>

        <View style={styles.campo}>
          <Text style={styles.etiqueta}>NOTAS</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinea]}
            placeholder="Información adicional..."
            placeholderTextColor={colores.textoClaro}
            value={notas}
            onChangeText={setNotas}
            multiline
            numberOfLines={3}
          />
        </View>

        <Pressable
          style={[styles.botonGuardar, guardando && styles.botonDeshabilitado]}
          onPress={guardar}
          disabled={guardando}
        >
          <Text style={styles.textoBotonGuardar}>
            {guardando ? "Guardando..." : "Guardar Mascota"}
          </Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>

      {pickerVisible && (
        <DateTimePicker
          mode="date"
          value={fechaSeleccionada}
          onChange={ponerFecha}
          minimumDate={new Date()}
        />
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
  headerTitulo: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  formulario: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  selectorFoto: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: colores.secundarioClaro,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: colores.primario,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  fotoPreview: {
    width: "100%",
    height: "100%",
  },
  iconoFoto: {
    fontSize: 36,
    color: colores.primario,
  },
  textoFoto: {
    fontSize: 12,
    color: colores.textoClaro,
    marginTop: 8,
  },
  campo: {
    marginBottom: 20,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: "600",
    color: colores.textoClaro,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colores.tarjeta,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colores.secundarioClaro,
    padding: 16,
    fontSize: 16,
    color: colores.texto,
  },
  inputMultilinea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  filaDoble: {
    flexDirection: "row",
  },
  selectorSexo: {
    flexDirection: "row",
    gap: 12,
  },
  opcionSexo: {
    flex: 1,
    backgroundColor: colores.tarjeta,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colores.secundarioClaro,
    padding: 16,
    alignItems: "center",
  },
  opcionSexoActiva: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  textoOpcionSexo: {
    fontSize: 16,
    color: colores.texto,
    fontWeight: "500",
  },
  textoOpcionSexoActiva: {
    color: "white",
  },
  textoFechaVacuna: {
    fontSize: 16,
    color: colores.texto,
  },
  botonGuardar: {
    backgroundColor: colores.primario,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    shadowColor: colores.primario,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBotonGuardar: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  opcionEstadoSaludable: {
    backgroundColor: "#68D391",
    borderColor: "#68D391",
  },
  opcionEstadoAtencion: {
    backgroundColor: "#F6AD55",
    borderColor: "#F6AD55",
  },
});
