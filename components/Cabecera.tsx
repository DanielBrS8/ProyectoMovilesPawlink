import { StyleSheet, View, Text, TextInput } from 'react-native';
import { colores } from '../styles/GlobalStyles';

type CabeceraProps = {
    titulo: string;
    subtitulo?: string;
    mostrarBuscador?: boolean;
    textoBusqueda?: string;
    setTextoBusqueda?: (texto: string) => void;
};

export default function Cabecera({
    titulo,
    subtitulo,
    mostrarBuscador = false,
    textoBusqueda = '',
    setTextoBusqueda,
}: CabeceraProps) {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>🐾 {titulo}</Text>
            {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
            {mostrarBuscador && setTextoBusqueda && (
                <TextInput
                    style={styles.buscador}
                    placeholder="Buscar mascota..."
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={textoBusqueda}
                    onChangeText={setTextoBusqueda}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: colores.primario,
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    titulo: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
    },
    subtitulo: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 4,
    },
    buscador: {
        marginTop: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: 'white',
    },
});