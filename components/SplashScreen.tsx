import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { colores } from '../styles/GlobalStyles';

type SplashScreenProps = {
    setAnimacion: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SplashScreen({ setAnimacion }: SplashScreenProps) {
    return (
        <View style={styles.contenedor}>
            <LottieView
                source={require('../assets/pawlink.json')}
                autoPlay={true}
                loop={false}
                speed={1.5}
                onAnimationFinish={() => setAnimacion(false)}
                style={styles.lottie}
            />
            <Text style={styles.titulo}>🐾 PawLink</Text>
            <Text style={styles.subtitulo}>Cuidando a tus mascotas</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: colores.primario,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        width: 250,
        height: 250,
    },
    titulo: {
        fontSize: 42,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    subtitulo: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 8,
    },
});