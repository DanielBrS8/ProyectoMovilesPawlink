import { StyleSheet, View, Text } from 'react-native';
import { colores } from '../styles/GlobalStyles';

export default function ListaVacia() {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.emoji}>🐕</Text>
            <Text style={styles.titulo}>¡Sin mascotas!</Text>
            <Text style={styles.subtitulo}>Pulsa el botón + para añadir tu primera mascota</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        marginTop: 60,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: '700',
        color: colores.texto,
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 15,
        color: colores.textoClaro,
        textAlign: 'center',
        lineHeight: 22,
    },
});