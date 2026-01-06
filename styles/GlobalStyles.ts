import { StyleSheet } from 'react-native';

// Paleta de colores PawLink
export const colores = {
  primario: '#7DD3C0',         
  primarioOscuro: '#5BBAA8',   
  secundario: '#87CEEB',       
  secundarioClaro: '#B8E2F2',  
  acento: '#FFB366',           
  acentoOscuro: '#E6994D',    
  fondo: '#F8FAFB',            
  tarjeta: '#FFFFFF',          
  texto: '#2D3748',            
  textoClaro: '#718096',       
  exito: '#68D391',            
  advertencia: '#F6AD55',      
  peligro: '#FC8181',          
  borde: '#E2E8F0',            
};

// Estilos globales reutilizables
export const estilosGlobales = StyleSheet.create({
  // Contenedores
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenedorCentrado: {
    flex: 1,
    backgroundColor: colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tarjeta (card)
  tarjeta: {
    backgroundColor: colores.tarjeta,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },

  // Textos
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: colores.texto,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: colores.texto,
  },
  textoNormal: {
    fontSize: 16,
    color: colores.texto,
  },
  textoPequeño: {
    fontSize: 14,
    color: colores.textoClaro,
  },

  // Botones
  botonPrimario: {
    backgroundColor: colores.primario,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonAcento: {
    backgroundColor: colores.acento,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonSecundario: {
    backgroundColor: colores.secundarioClaro,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Inputs
  input: {
    backgroundColor: colores.tarjeta,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colores.secundarioClaro,
    padding: 16,
    fontSize: 16,
    color: colores.texto,
  },
  etiquetaInput: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoClaro,
    marginBottom: 8,
  },

  // Filas
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filaEspaciada: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Badges de estado
  badgeExito: {
    backgroundColor: '#C6F6D5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeExitoTexto: {
    color: '#276749',
    fontSize: 11,
    fontWeight: '600',
  },
  badgeAdvertencia: {
    backgroundColor: '#FEEBC8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeAdvertenciaTexto: {
    color: '#C05621',
    fontSize: 11,
    fontWeight: '600',
  },

  // Sombra reutilizable
  sombra: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});
