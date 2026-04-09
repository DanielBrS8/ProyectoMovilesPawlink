import { useState, useRef } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import useUsuarioStore from "../stores/useUsuarioStore";

export default function Registro() {
  const router = useRouter();
  const registro = useUsuarioStore((state) => state.registro);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({ nombre: "", email: "", password: "", general: "" });
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const formRef = useRef<Animatable.View & View>(null);
  const nombreRef = useRef<Animatable.View & View>(null);
  const emailRef = useRef<Animatable.View & View>(null);
  const passwordRef = useRef<Animatable.View & View>(null);

  function validar(): boolean {
    const nuevosErrores = { nombre: "", email: "", password: "", general: "" };
    let valido = true;

    if (nombre.trim() === "") {
      nuevosErrores.nombre = "El nombre es obligatorio";
      valido = false;
    }

    if (email.trim() === "") {
      nuevosErrores.email = "El email es obligatorio";
      valido = false;
    } else if (!email.includes("@")) {
      nuevosErrores.email = "Introduce un email valido";
      valido = false;
    }

    if (password.trim() === "") {
      nuevosErrores.password = "La contrasena es obligatoria";
      valido = false;
    } else if (password.length < 4) {
      nuevosErrores.password = "Minimo 4 caracteres";
      valido = false;
    }

    setErrores(nuevosErrores);

    if (!valido) {
      if (nuevosErrores.nombre) nombreRef.current?.shake?.(800);
      if (nuevosErrores.email) emailRef.current?.shake?.(800);
      if (nuevosErrores.password) passwordRef.current?.shake?.(800);
    }

    return valido;
  }

  async function handleRegistro() {
    if (!validar()) return;

    setCargando(true);
    setErrores({ nombre: "", email: "", password: "", general: "" });

    try {
      const exito = await registro(nombre.trim(), email.trim(), password);
      if (exito) {
        router.replace("/(drawer)/(tabs)");
      } else {
        setErrores((prev) => ({
          ...prev,
          general: "No se pudo crear la cuenta. Intentalo de nuevo.",
        }));
        formRef.current?.shake?.(800);
      }
    } catch {
      setErrores((prev) => ({
        ...prev,
        general: "Error de conexion. Verifica que el servidor este activo.",
      }));
      formRef.current?.shake?.(800);
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo animado */}
        <Animatable.View animation="fadeIn" duration={1000} style={estilos.logoSeccion}>
          <Text style={estilos.logoEmoji}>🐾</Text>
          <Text style={estilos.logoTexto}>PawLink</Text>
          <Text style={estilos.logoSubtitulo}>Crea tu cuenta</Text>
        </Animatable.View>

        {/* Formulario */}
        <Animatable.View
          ref={formRef}
          animation="fadeInUp"
          duration={800}
          delay={300}
          style={estilos.formulario}
        >
          {errores.general !== "" && (
            <Animatable.View animation="fadeIn" style={estilos.errorGeneral}>
              <Text style={estilos.errorGeneralTexto}>{errores.general}</Text>
            </Animatable.View>
          )}

          <Animatable.View ref={nombreRef}>
            <TextInput
              mode="outlined"
              label="Nombre"
              placeholder="Tu nombre completo"
              value={nombre}
              onChangeText={(t) => {
                setNombre(t);
                if (errores.nombre) setErrores((p) => ({ ...p, nombre: "" }));
              }}
              autoCapitalize="words"
              left={<TextInput.Icon icon="account-outline" />}
              error={errores.nombre !== ""}
              outlineColor="#E2E8F0"
              activeOutlineColor="#7DD3C0"
              outlineStyle={{ borderRadius: 14 }}
              style={estilos.input}
            />
            {errores.nombre !== "" && (
              <Text style={estilos.errorTexto}>{errores.nombre}</Text>
            )}
          </Animatable.View>

          <Animatable.View ref={emailRef} style={{ marginTop: 16 }}>
            <TextInput
              mode="outlined"
              label="Email"
              placeholder="tu@email.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errores.email) setErrores((p) => ({ ...p, email: "" }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email-outline" />}
              error={errores.email !== ""}
              outlineColor="#E2E8F0"
              activeOutlineColor="#7DD3C0"
              outlineStyle={{ borderRadius: 14 }}
              style={estilos.input}
            />
            {errores.email !== "" && (
              <Text style={estilos.errorTexto}>{errores.email}</Text>
            )}
          </Animatable.View>

          <Animatable.View ref={passwordRef} style={{ marginTop: 16 }}>
            <TextInput
              mode="outlined"
              label="Contrasena"
              placeholder="Tu contrasena"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errores.password) setErrores((p) => ({ ...p, password: "" }));
              }}
              secureTextEntry={!mostrarPassword}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={mostrarPassword ? "eye-off" : "eye"}
                  onPress={() => setMostrarPassword(!mostrarPassword)}
                />
              }
              error={errores.password !== ""}
              outlineColor="#E2E8F0"
              activeOutlineColor="#7DD3C0"
              outlineStyle={{ borderRadius: 14 }}
              style={estilos.input}
            />
            {errores.password !== "" && (
              <Text style={estilos.errorTexto}>{errores.password}</Text>
            )}
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={600}>
            <Button
              mode="contained"
              onPress={handleRegistro}
              disabled={cargando}
              buttonColor="#7DD3C0"
              textColor="white"
              contentStyle={estilos.botonContenido}
              labelStyle={estilos.botonLabel}
              style={estilos.boton}
            >
              {cargando ? (
                <ActivityIndicator color="white" size={20} />
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={800} style={estilos.enlace}>
            <Text style={estilos.enlaceTexto}>
              Ya tienes cuenta?{" "}
            </Text>
            <Text
              style={estilos.enlaceAccion}
              onPress={() => router.replace("/login")}
            >
              Inicia sesion
            </Text>
          </Animatable.View>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F8FAFB",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoSeccion: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 72,
  },
  logoTexto: {
    fontSize: 38,
    fontWeight: "700",
    color: "#7DD3C0",
    marginTop: 8,
    letterSpacing: 1,
  },
  logoSubtitulo: {
    fontSize: 15,
    color: "#718096",
    marginTop: 8,
  },
  formulario: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 5,
  },
  errorGeneral: {
    backgroundColor: "#FED7D7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorGeneralTexto: {
    color: "#C53030",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  errorTexto: {
    color: "#FC8181",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
  boton: {
    marginTop: 24,
    borderRadius: 14,
  },
  botonContenido: {
    paddingVertical: 8,
  },
  botonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  enlace: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  enlaceTexto: {
    fontSize: 14,
    color: "#718096",
  },
  enlaceAccion: {
    fontSize: 14,
    color: "#7DD3C0",
    fontWeight: "700",
  },
});
