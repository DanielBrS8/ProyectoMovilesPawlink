import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Mascota, Mascotas } from './model/Tipos';
import { consultarMascotas, buscarMascotas, borrarMascota } from './helpers/ConsultasApi';
import { colores } from './styles/GlobalStyles';
import ItemMascota from './components/ItemMascota';
import Cabecera from './components/Cabecera';
import BotonFlotante from './components/BotonFlotante';
import ListaVacia from './components/ListaVacia';
import SplashScreen from './components/SplashScreen';
import PantallaDetalle from './pantallas/PantallaDetalle';
import PantallaFormulario from './pantallas/PantallaFormulario';
import PantallaPaseo from './pantallas/PantallaPaseo';

export default function App() {
    const [listaMascotas, setListaMascotas] = useState<Mascotas>([]);
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [animacion, setAnimacion] = useState(true);
    const [pantallaActual, setPantallaActual] = useState<'home' | 'detalle' | 'formulario' | 'paseo'>('home');
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);

    // Cargar mascotas al iniciar
    useEffect(() => {
        cargarMascotas();
    }, []);

    // Buscar cuando cambia el texto
    useEffect(() => {
        if (textoBusqueda === '') {
            cargarMascotas();
        } else {
            accionBuscar();
        }
    }, [textoBusqueda]);

    function cargarMascotas() {
        consultarMascotas()
            .then((mascotas) => {
                setListaMascotas(mascotas);
                setCargando(false);
            })
            .catch((error) => {
                console.log('Error al cargar mascotas:', error.message);
                setCargando(false);
            });
    }

    function accionBuscar() {
        buscarMascotas(textoBusqueda)
            .then((mascotas) => setListaMascotas(mascotas))
            .catch((error) => console.log('Error en búsqueda:', error.message));
    }

    function handlePressMascota(mascota: Mascota) {
        setMascotaSeleccionada(mascota);
        setPantallaActual('detalle');
    }

    function handleVolver() {
        setPantallaActual('home');
        setMascotaSeleccionada(null);
    }

    function handleVolverDeFormulario() {
        if (mascotaSeleccionada) {
            setPantallaActual('detalle');
        } else {
            setPantallaActual('home');
        }
    }

    function handleVolverDePaseo() {
        setPantallaActual('detalle');
    }

    function handleEditar() {
        setPantallaActual('formulario');
    }

    function handleNuevaMascota() {
        setMascotaSeleccionada(null);
        setPantallaActual('formulario');
    }

    function handleGuardar() {
        cargarMascotas();
        setPantallaActual('home');
        setMascotaSeleccionada(null);
        Alert.alert('✅ Éxito', 'Mascota guardada correctamente');
    }

    function handlePaseo() {
        setPantallaActual('paseo');
    }

    function handleBorrar() {
        if (mascotaSeleccionada) {
            borrarMascota(mascotaSeleccionada.id)
                .then(() => {
                    cargarMascotas();
                    handleVolver();
                    Alert.alert('✅ Éxito', 'Mascota eliminada correctamente');
                })
                .catch((error) => console.log('Error al borrar:', error.message));
        }
    }

    // Splash screen - se muestra mientras cargando O animacion sean true
    if (cargando || animacion) {
        return (
            <>
                <StatusBar style="light" />
                <SplashScreen setAnimacion={setAnimacion} />
            </>
        );
    }

    // Pantalla de paseo
    if (pantallaActual === 'paseo' && mascotaSeleccionada) {
        return (
            <>
                <StatusBar style="light" />
                <PantallaPaseo
                    mascota={mascotaSeleccionada}
                    onVolver={handleVolverDePaseo}
                />
            </>
        );
    }

    // Pantalla de formulario
    if (pantallaActual === 'formulario') {
        return (
            <>
                <StatusBar style="light" />
                <PantallaFormulario
                    mascota={mascotaSeleccionada}
                    onVolver={handleVolverDeFormulario}
                    onGuardar={handleGuardar}
                />
            </>
        );
    }

    // Pantalla de detalle
    if (pantallaActual === 'detalle' && mascotaSeleccionada) {
        return (
            <>
                <StatusBar style="light" />
                <PantallaDetalle
                    mascota={mascotaSeleccionada}
                    onVolver={handleVolver}
                    onEditar={handleEditar}
                    onPaseo={handlePaseo}
                    onBorrar={handleBorrar}
                />
            </>
        );
    }

    // Pantalla home
    return (
        <View style={styles.contenedor}>
            <StatusBar style="light" />
            
            <Cabecera
                titulo="PawLink"
                subtitulo={`¡Hola! Tienes ${listaMascotas.length} mascotas`}
                mostrarBuscador={true}
                textoBusqueda={textoBusqueda}
                setTextoBusqueda={setTextoBusqueda}
            />

            <View style={styles.contenido}>
                <FlatList
                    data={listaMascotas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ItemMascota 
                            item={item} 
                            onPress={handlePressMascota} 
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<ListaVacia />}
                />
            </View>

            <BotonFlotante onPress={handleNuevaMascota} />
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
    contenido: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
});