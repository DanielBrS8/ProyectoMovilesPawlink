import { View, Text, StyleSheet, Pressable } from "react-native";
import { Card, Avatar, Button } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Mascota } from "../model/Tipos";

type CardMascotaProps = {
  mascota: Mascota;
  indice: number;
  onPress: (mascota: Mascota) => void;
  onAdoptar?: (mascota: Mascota) => void;
  enAdopcion?: boolean;
};

export default function CardMascota({
  mascota,
  indice,
  onPress,
  onAdoptar,
  enAdopcion = false,
}: CardMascotaProps) {
  const esSaludable = mascota.estado === "Saludable";
  const iconoEspecie = mascota.especie.toLowerCase() === "gato" ? "cat" : "dog";

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={indice * 100}
    >
      <Pressable onPress={() => onPress(mascota)}>
        <Card style={estilos.tarjeta} mode="elevated" elevation={2}>
          <Card.Cover
            source={{ uri: mascota.foto }}
            style={estilos.imagen}
            resizeMode="cover"
          />

          {/* Badge de estado superpuesto */}
          <View style={[estilos.badgeEstado, esSaludable ? estilos.badgeVerde : estilos.badgeNaranja]}>
            <MaterialCommunityIcons
              name={esSaludable ? "check-circle" : "alert-circle"}
              size={14}
              color="white"
            />
            <Text style={estilos.badgeTexto}>{mascota.estado}</Text>
          </View>

          <Card.Title
            title={mascota.nombre}
            subtitle={`${mascota.raza} · ${mascota.especie}`}
            titleStyle={estilos.titulo}
            subtitleStyle={estilos.subtitulo}
            left={() => (
              <Avatar.Icon
                size={40}
                icon={iconoEspecie}
                style={{ backgroundColor: "#A8E6D8" }}
                color="#2D3748"
              />
            )}
            right={() => (
              <View style={estilos.infoLado}>
                <Text style={estilos.edad}>{mascota.edad}</Text>
                <Text style={estilos.peso}>{mascota.peso}</Text>
              </View>
            )}
          />

          <Card.Content style={estilos.contenido}>
            <View style={estilos.detallesFila}>
              <View style={estilos.detalle}>
                <MaterialCommunityIcons name="gender-male-female" size={16} color="#718096" />
                <Text style={estilos.detalleTexto}>{mascota.sexo}</Text>
              </View>
              <View style={estilos.detalle}>
                <MaterialCommunityIcons name="needle" size={16} color="#718096" />
                <Text style={estilos.detalleTexto}>{mascota.proximaVacuna}</Text>
              </View>
            </View>
            {mascota.notas !== "" && (
              <Text style={estilos.notas} numberOfLines={2}>
                {mascota.notas}
              </Text>
            )}
          </Card.Content>

          <Card.Actions style={estilos.acciones}>
            <Button
              mode="text"
              textColor="#7DD3C0"
              icon="eye"
              onPress={() => onPress(mascota)}
              compact
            >
              Ver detalle
            </Button>
            {onAdoptar && (
              <Button
                mode="text"
                textColor={enAdopcion ? "#FC8181" : "#FFB366"}
                icon={enAdopcion ? "heart" : "heart-outline"}
                onPress={() => onAdoptar(mascota)}
                compact
              >
                {enAdopcion ? "Quitar" : "Adoptar"}
              </Button>
            )}
          </Card.Actions>
        </Card>
      </Pressable>
    </Animatable.View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  imagen: {
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  badgeEstado: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  badgeVerde: {
    backgroundColor: "rgba(104, 211, 145, 0.9)",
  },
  badgeNaranja: {
    backgroundColor: "rgba(246, 173, 85, 0.9)",
  },
  badgeTexto: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
  },
  subtitulo: {
    fontSize: 14,
    color: "#718096",
  },
  infoLado: {
    alignItems: "flex-end",
    marginRight: 16,
  },
  edad: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
  },
  peso: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
  contenido: {
    paddingTop: 0,
    paddingBottom: 4,
  },
  detallesFila: {
    flexDirection: "row",
    gap: 20,
  },
  detalle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detalleTexto: {
    fontSize: 13,
    color: "#718096",
  },
  notas: {
    fontSize: 13,
    color: "#718096",
    marginTop: 8,
    fontStyle: "italic",
    lineHeight: 18,
  },
  acciones: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
});
