import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Mascota, Paseos } from '../model/Tipos';
import { consultarPaseosMascota } from '../helpers/ConsultasApi';
import { colores } from '../styles/GlobalStyles';

type PantallaDetalleProps = {
    mascota: Mascota;
    onVolver: () => void;
    onEditar: () => void;
    onPaseo: () => void;
    onBorrar: () => void;
};

export default function PantallaDetalle({
    mascota,
    onVolver,
    onEditar,
    onPaseo,
    onBorrar,
}: PantallaDetalleProps) {
    const [paseos, setPaseos] = useState<Paseos>([]);

    useEffect(() => {
        cargarPaseos();
    }, []);

    function cargarPaseos() {
        consultarPaseosMascota(mascota.id)
            .then((data) => setPaseos(data))
            .catch((error) => console.log('Error al cargar paseos:', error.message));
    }

    function confirmarBorrar() {
        Alert.alert(
            '¿Eliminar mascota?',
            `¿Estás seguro de que quieres eliminar a ${mascota.nombre}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: onBorrar },
            ]
        );
    }

    return (
        <View style={styles.contenedor}>
            
            <View style={styles.header}>
                <Pressable style={styles.botonVolver} onPress={onVolver}>
                    <Text style={styles.iconoVolver}>←</Text>
                </Pressable>
                <View style={styles.avatarContenedor}>
                    <Image
                        source={{ uri: mascota.foto }}
                        style={styles.avatar}
                        contentFit="cover"
                    />
                </View>
                <Text style={styles.nombre}>{mascota.nombre}</Text>
                <Text style={styles.razaEspecie}>{mascota.raza} • {mascota.especie}</Text>
            </View>

            
            <View style={styles.statsContenedor}>
                <View style={styles.statCard}>
                    <Text style={styles.statValor}>{mascota.edad}</Text>
                    <Text style={styles.statEtiqueta}>Edad</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValor}>{mascota.peso}</Text>
                    <Text style={styles.statEtiqueta}>Peso</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValor}>{mascota.sexo === 'Hembra' ? '♀' : '♂'}</Text>
                    <Text style={styles.statEtiqueta}>Sexo</Text>
                </View>
            </View>

            <ScrollView style={styles.contenido} showsVerticalScrollIndicator={false}>
                <Text style={styles.seccionTitulo}>Próxima vacuna</Text>
                <View style={styles.card}>
                    <Text style={styles.cardIcono}>💉</Text>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardTitulo}>Vacuna programada</Text>
                        <Text style={styles.cardSubtitulo}>{mascota.proximaVacuna}</Text>
                    </View>
                </View>

                {mascota.notas && (
                    <>
                        <Text style={styles.seccionTitulo}>Notas</Text>
                        <View style={styles.cardNotas}>
                            <Text style={styles.textoNotas}>{mascota.notas}</Text>
                        </View>
                    </>
                )}

                
                <Text style={styles.seccionTitulo}>Historial de paseos</Text>
                {paseos.length > 0 ? (
                    paseos.map((paseo) => (
                        <View key={paseo.id} style={styles.card}>
                            <Text style={styles.cardIcono}>🚶</Text>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitulo}>{paseo.fecha}</Text>
                                <Text style={styles.cardSubtitulo}>
                                    {paseo.duracion} • {paseo.distancia} km
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.cardNotas}>
                        <Text style={styles.textoNotas}>Aún no hay paseos registrados 🐕</Text>
                    </View>
                )}

                <Pressable style={styles.botonPrimario} onPress={onPaseo}>
                    <Text style={styles.botonTexto}>🚶 Iniciar Paseo</Text>
                </Pressable>

                <Pressable style={styles.botonSecundario} onPress={onEditar}>
                    <Text style={styles.botonTextoSecundario}>✏️ Editar Mascota</Text>
                </Pressable>

                <Pressable style={styles.botonEliminar} onPress={confirmarBorrar}>
                    <Text style={styles.botonTextoEliminar}>🗑️ Eliminar Mascota</Text>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
    header: {
        backgroundColor: colores.secundario,
        paddingTop: 50,
        paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        alignItems: 'center',
    },
    botonVolver: {
        position: 'absolute',
        left: 20,
        top: 50,
        padding: 8,
    },
    iconoVolver: {
        color: 'white',
        fontSize: 28,
        fontWeight: '600',
    },
    avatarContenedor: {
        width: 120,
        height: 120,
        borderRadius: 35,
        borderWidth: 4,
        borderColor: 'white',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    nombre: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        marginTop: 16,
    },
    razaEspecie: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    statsContenedor: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginTop: -25,
    },
    statCard: {
        backgroundColor: colores.tarjeta,
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        minWidth: 90,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    statValor: {
        fontSize: 18,
        fontWeight: '700',
        color: colores.texto,
    },
    statEtiqueta: {
        fontSize: 11,
        color: colores.textoClaro,
        marginTop: 4,
    },
    contenido: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    seccionTitulo: {
        fontSize: 16,
        fontWeight: '600',
        color: colores.texto,
        marginTop: 10,
        marginBottom: 12,
    },
    card: {
        backgroundColor: colores.tarjeta,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardIcono: {
        fontSize: 28,
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitulo: {
        fontSize: 15,
        fontWeight: '600',
        color: colores.texto,
    },
    cardSubtitulo: {
        fontSize: 13,
        color: colores.textoClaro,
        marginTop: 2,
    },
    cardNotas: {
        backgroundColor: colores.tarjeta,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
    },
    textoNotas: {
        fontSize: 14,
        color: colores.texto,
        lineHeight: 20,
    },
    botonPrimario: {
        backgroundColor: colores.primario,
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: colores.primario,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
    },
    botonTexto: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    botonSecundario: {
        backgroundColor: colores.secundarioClaro,
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 12,
    },
    botonTextoSecundario: {
        color: colores.texto,
        fontSize: 16,
        fontWeight: '600',
    },
    botonEliminar: {
        backgroundColor: '#FED7D7',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 12,
    },
    botonTextoEliminar: {
        color: '#C53030',
        fontSize: 16,
        fontWeight: '600',
    },
});