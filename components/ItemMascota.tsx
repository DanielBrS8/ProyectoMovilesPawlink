import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Mascota } from '../model/Tipos';
import { colores } from '../styles/GlobalStyles';

type ItemMascotaProps = {
    item: Mascota;
    onPress: (mascota: Mascota) => void;
};

export default function ItemMascota({ item, onPress }: ItemMascotaProps) {
    
    const estiloEstado = item.estado === 'Saludable' 
        ? styles.badgeExito 
        : styles.badgeAdvertencia;
    
    const estiloTextoEstado = item.estado === 'Saludable'
        ? styles.textoExito
        : styles.textoAdvertencia;

    return (
        <Pressable style={styles.contenedor} onPress={() => onPress(item)}>
            <Image
                source={{ uri: item.foto }}
                style={styles.foto}
                contentFit="cover"
            />
            <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.raza}>{item.raza}</Text>
                <View style={estiloEstado}>
                    <Text style={estiloTextoEstado}>{item.estado}</Text>
                </View>
            </View>
            <View style={styles.ladoDerecho}>
                <Text style={styles.edad}>{item.edad}</Text>
                <Text style={styles.flecha}>›</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flexDirection: 'row',
        backgroundColor: colores.tarjeta,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
    },
    foto: {
        width: 70,
        height: 70,
        borderRadius: 20,
        backgroundColor: colores.secundarioClaro,
    },
    info: {
        flex: 1,
        marginLeft: 16,
    },
    nombre: {
        fontSize: 18,
        fontWeight: '700',
        color: colores.texto,
    },
    raza: {
        fontSize: 13,
        color: colores.textoClaro,
        marginTop: 2,
    },
    badgeExito: {
        backgroundColor: '#C6F6D5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    badgeAdvertencia: {
        backgroundColor: '#FEEBC8',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    textoExito: {
        color: '#276749',
        fontSize: 11,
        fontWeight: '600',
    },
    textoAdvertencia: {
        color: '#C05621',
        fontSize: 11,
        fontWeight: '600',
    },
    ladoDerecho: {
        alignItems: 'flex-end',
    },
    edad: {
        fontSize: 13,
        color: colores.textoClaro,
    },
    flecha: {
        fontSize: 24,
        color: colores.textoClaro,
        marginTop: 4,
    },
});