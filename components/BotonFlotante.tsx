import { StyleSheet, Pressable, Text } from 'react-native';
import { colores } from '../styles/GlobalStyles';

type BotonFlotanteProps = {
    onPress: () => void;
};

export default function BotonFlotante({ onPress }: BotonFlotanteProps) {
    return (
        <Pressable style={styles.boton} onPress={onPress}>
            <Text style={styles.icono}>+</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    boton: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: colores.acento,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colores.acento,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    icono: {
        color: 'white',
        fontSize: 32,
        fontWeight: '600',
    },
});