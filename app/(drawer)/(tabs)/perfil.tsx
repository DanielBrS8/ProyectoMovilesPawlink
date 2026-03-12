import { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, Modal, Alert, Platform,
} from "react-native";
import { Avatar, Card, Button, List, TextInput, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import useUsuarioStore from "../../../stores/useUsuarioStore";
import useAdopcionStore from "../../../stores/useAdopcionStore";
import useMascotaStore from "../../../stores/useMascotaStore";

export default function Perfil() {
  const router = useRouter();
  const navigation = useNavigation();
  const usuario = useUsuarioStore((state) => state.usuario);
  const logout = useUsuarioStore((state) => state.logout);
  const actualizarPerfil = useUsuarioStore((state) => state.actualizarPerfil);
  const totalMascotas = useMascotaStore((state) => state.listaMascotas.length);
  const totalAdopciones = useAdopcionStore((state) => state.mascotasEnAdopcion.length);

  const [modalVisible, setModalVisible] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Campos del formulario de edición
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [foto, setFoto] = useState("");

  function abrirEdicion() {
    setNombre(usuario?.nombre || "");
    setEmail(usuario?.email || "");
    setTelefono(usuario?.telefono || "");
    setDireccion(usuario?.direccion || "");
    setFoto(usuario?.foto || "");
    setModalVisible(true);
  }

  async function seleccionarFoto() {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Se necesita acceso a la galería.");
        return;
      }
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!resultado.canceled && resultado.assets[0]) {
      setFoto(resultado.assets[0].uri);
    }
  }

  async function guardarCambios() {
    if (!nombre.trim()) {
      Alert.alert("Campo requerido", "El nombre no puede estar vacío.");
      return;
    }
    setGuardando(true);
    try {
      await actualizarPerfil({ nombre, email, telefono, direccion, foto });
      setModalVisible(false);
    } catch {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleCerrarSesion() {
    await logout();
    router.replace("/login");
  }

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
          <Text style={estilos.cabeceraTitulo}>Mi Perfil</Text>
          <Pressable style={estilos.editarBoton} onPress={abrirEdicion}>
            <MaterialCommunityIcons name="pencil" size={20} color="white" />
          </Pressable>
        </View>

        <Animatable.View animation="bounceIn" delay={200} style={estilos.avatarSeccion}>
          <Avatar.Image
            size={90}
            source={{ uri: usuario?.foto || "https://via.placeholder.com/200" }}
            style={estilos.avatar}
          />
          <Text style={estilos.nombre}>{usuario?.nombre || "Usuario"}</Text>
          <Text style={estilos.email}>{usuario?.email || ""}</Text>
        </Animatable.View>
      </View>

      <ScrollView style={estilos.contenido} showsVerticalScrollIndicator={false}>
        {/* Stats rápidos */}
        <Animatable.View animation="fadeInUp" delay={300} style={estilos.statsRow}>
          <Card style={estilos.statCard}>
            <Card.Content style={estilos.statContenido}>
              <MaterialCommunityIcons name="paw" size={28} color="#7DD3C0" />
              <Text style={estilos.statValor}>{totalMascotas}</Text>
              <Text style={estilos.statEtiqueta}>Mascotas</Text>
            </Card.Content>
          </Card>
          <Card style={estilos.statCard}>
            <Card.Content style={estilos.statContenido}>
              <MaterialCommunityIcons name="heart" size={28} color="#FFB366" />
              <Text style={estilos.statValor}>{totalAdopciones}</Text>
              <Text style={estilos.statEtiqueta}>Adopciones</Text>
            </Card.Content>
          </Card>
        </Animatable.View>

        {/* Info personal */}
        <Animatable.View animation="fadeInUp" delay={400}>
          <Card style={estilos.tarjeta} mode="elevated" elevation={1}>
            <List.Section>
              <List.Subheader style={estilos.seccionTitulo}>Información Personal</List.Subheader>
              <List.Item
                title="Teléfono"
                description={usuario?.telefono || "No configurado"}
                left={() => <List.Icon icon="phone" color="#7DD3C0" />}
                titleStyle={estilos.itemTitulo}
                descriptionStyle={estilos.itemDescripcion}
              />
              <List.Item
                title="Dirección"
                description={usuario?.direccion || "No configurada"}
                left={() => <List.Icon icon="map-marker" color="#7DD3C0" />}
                titleStyle={estilos.itemTitulo}
                descriptionStyle={estilos.itemDescripcion}
              />
              <List.Item
                title="Email"
                description={usuario?.email || ""}
                left={() => <List.Icon icon="email" color="#7DD3C0" />}
                titleStyle={estilos.itemTitulo}
                descriptionStyle={estilos.itemDescripcion}
              />
            </List.Section>
          </Card>
        </Animatable.View>

        {/* Acciones */}
        <Animatable.View animation="fadeInUp" delay={500}>
          <Card style={estilos.tarjeta} mode="elevated" elevation={1}>
            <List.Section>
              <List.Subheader style={estilos.seccionTitulo}>Acciones</List.Subheader>
              <List.Item
                title="Mis Mascotas"
                left={() => <List.Icon icon="paw" color="#7DD3C0" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => router.push("/(drawer)/(tabs)")}
                titleStyle={estilos.itemTitulo}
              />
              <List.Item
                title="Adopción Temporal"
                left={() => <List.Icon icon="heart-outline" color="#FFB366" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => router.push("/(drawer)/(tabs)/adopcion")}
                titleStyle={estilos.itemTitulo}
              />
            </List.Section>
          </Card>
        </Animatable.View>

        {/* Cerrar sesión */}
        <Animatable.View animation="fadeInUp" delay={600}>
          <Button
            mode="outlined"
            icon="logout"
            textColor="#FC8181"
            style={estilos.botonLogout}
            contentStyle={{ paddingVertical: 6 }}
            onPress={handleCerrarSesion}
          >
            Cerrar Sesión
          </Button>
        </Animatable.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de edición */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContenedor}>
            <View style={estilos.modalCabecera}>
              <Text style={estilos.modalTitulo}>Editar Perfil</Text>
              <Pressable onPress={() => setModalVisible(false)} style={estilos.modalCerrar}>
                <MaterialCommunityIcons name="close" size={22} color="#718096" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Foto */}
              <View style={estilos.fotoContenedor}>
                <Pressable onPress={seleccionarFoto} style={estilos.fotoPressable}>
                  <Avatar.Image
                    size={90}
                    source={{ uri: foto || "https://via.placeholder.com/200" }}
                    style={{ backgroundColor: "#E2E8F0" }}
                  />
                  <View style={estilos.fotoOverlay}>
                    <MaterialCommunityIcons name="camera" size={22} color="white" />
                  </View>
                </Pressable>
                <Text style={estilos.fotoTexto}>Cambiar foto</Text>
              </View>

              <TextInput
                mode="outlined"
                label="Nombre"
                value={nombre}
                onChangeText={setNombre}
                left={<TextInput.Icon icon="account" />}
                style={estilos.campo}
                outlineColor="#E2E8F0"
                activeOutlineColor="#7DD3C0"
              />
              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                style={estilos.campo}
                outlineColor="#E2E8F0"
                activeOutlineColor="#7DD3C0"
              />
              <TextInput
                mode="outlined"
                label="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone" />}
                style={estilos.campo}
                outlineColor="#E2E8F0"
                activeOutlineColor="#7DD3C0"
              />
              <TextInput
                mode="outlined"
                label="Dirección"
                value={direccion}
                onChangeText={setDireccion}
                left={<TextInput.Icon icon="map-marker" />}
                style={estilos.campo}
                outlineColor="#E2E8F0"
                activeOutlineColor="#7DD3C0"
              />

              <View style={estilos.modalBotones}>
                <Button
                  mode="outlined"
                  textColor="#718096"
                  style={[estilos.modalBoton, { borderColor: "#E2E8F0" }]}
                  onPress={() => setModalVisible(false)}
                  disabled={guardando}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  buttonColor="#87CEEB"
                  textColor="white"
                  icon="content-save"
                  style={estilos.modalBoton}
                  onPress={guardarCambios}
                  disabled={guardando}
                >
                  {guardando ? <ActivityIndicator size={16} color="white" /> : "Guardar"}
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F8FAFB" },
  cabecera: {
    backgroundColor: "#87CEEB",
    paddingTop: 52,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  cabeceraFila: { flexDirection: "row", alignItems: "center" },
  menuBoton: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  cabeceraTitulo: { color: "white", fontSize: 20, fontWeight: "700", marginLeft: 14, flex: 1 },
  editarBoton: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  avatarSeccion: { alignItems: "center", marginTop: 20 },
  avatar: { backgroundColor: "rgba(255,255,255,0.3)" },
  nombre: { color: "white", fontSize: 24, fontWeight: "700", marginTop: 14 },
  email: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 },
  contenido: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 18, backgroundColor: "white" },
  statContenido: { alignItems: "center", paddingVertical: 18 },
  statValor: { fontSize: 24, fontWeight: "700", color: "#2D3748", marginTop: 6 },
  statEtiqueta: { fontSize: 12, color: "#718096", marginTop: 2 },
  tarjeta: { marginBottom: 16, borderRadius: 18, backgroundColor: "white" },
  seccionTitulo: { fontSize: 15, fontWeight: "600", color: "#2D3748" },
  itemTitulo: { fontSize: 15, color: "#2D3748" },
  itemDescripcion: { fontSize: 13, color: "#718096" },
  botonLogout: { borderColor: "#FC8181", borderRadius: 14, marginTop: 8 },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContenedor: {
    backgroundColor: "white",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, maxHeight: "90%",
  },
  modalCabecera: {
    flexDirection: "row", alignItems: "center", marginBottom: 20,
  },
  modalTitulo: { flex: 1, fontSize: 20, fontWeight: "700", color: "#2D3748" },
  modalCerrar: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: "#F0F4F8",
    alignItems: "center", justifyContent: "center",
  },
  fotoContenedor: { alignItems: "center", marginBottom: 20 },
  fotoPressable: { position: "relative" },
  fotoOverlay: {
    position: "absolute", bottom: 0, right: 0,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#87CEEB", alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "white",
  },
  fotoTexto: { fontSize: 13, color: "#718096", marginTop: 8 },
  campo: { backgroundColor: "white", marginBottom: 12 },
  modalBotones: { flexDirection: "row", gap: 10, marginTop: 8, marginBottom: 16 },
  modalBoton: { flex: 1, borderRadius: 12 },
});
