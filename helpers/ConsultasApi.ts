<<<<<<< HEAD
import { Mascota, Mascotas, Paseo, Paseos, Usuario, AdopcionTemporal, CentroVeterinario, CentrosVeterinarios } from '../model/Tipos';
=======
import axios from 'axios';
import { Mascota, Mascotas, Paseo, Paseos, Usuario, AdopcionTemporal } from '../model/Tipos';
>>>>>>> 438c015a3f5844ab3fb112790da8b81dec8ab342

// URL base para el emulador de Android.
// NOTA: Si usas un dispositivo físico, cambia '10.0.2.2' por la IP local de tu ordenador (ej: '192.168.1.X').
const BASE_URL = 'http://10.0.2.2:8080/api';

// Configuración global de Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para guardar el token JWT e inyectarlo automáticamente en cada petición posterior
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ===== USUARIOS Y AUTENTICACIÓN =====

<<<<<<< HEAD
// Mascotas disponibles para adoptar (diferentes a las del usuario)
let mockMascotasAdopcion: Mascotas = [
  {
    id: 100, nombre: "Canela", especie: "Perro", raza: "Pastor Alemán",
    edad: "4 años", peso: "30 kg", sexo: "Hembra",
    foto: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400",
    estado: "Saludable", proximaVacuna: "15/04/2026",
    notas: "Muy protectora y leal. Busca un hogar con jardín.",
  },
  {
    id: 101, nombre: "Simba", especie: "Gato", raza: "Persa",
    edad: "1 año", peso: "3.5 kg", sexo: "Macho",
    foto: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400",
    estado: "Saludable", proximaVacuna: "20/05/2026",
    notas: "Tranquilo y cariñoso. Ideal para pisos.",
  },
  {
    id: 102, nombre: "Thor", especie: "Perro", raza: "Husky Siberiano",
    edad: "2 años", peso: "22 kg", sexo: "Macho",
    foto: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400",
    estado: "Saludable", proximaVacuna: "01/06/2026",
    notas: "Muy energético, necesita paseos largos.",
  },
  {
    id: 103, nombre: "Mia", especie: "Gato", raza: "Siamés",
    edad: "3 años", peso: "4 kg", sexo: "Hembra",
    foto: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400",
    estado: "Necesita atención", proximaVacuna: "10/04/2026",
    notas: "Necesita tratamiento dental. Muy juguetona.",
  },
  {
    id: 104, nombre: "Max", especie: "Perro", raza: "Beagle",
    edad: "6 meses", peso: "8 kg", sexo: "Macho",
    foto: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400",
    estado: "Saludable", proximaVacuna: "25/05/2026",
    notas: "Cachorro muy activo y sociable con otros perros.",
  },
];

let mockCentros: CentrosVeterinarios = [
  {
    idCentro: 1,
    nombre: "Clínica Veterinaria Albayzín",
    ciudad: "Granada",
    direccion: "Calle Elvira 42, Granada",
    telefono: "958123456",
    especialidad: "Medicina General",
    foto: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400",
    horario: "Lun-Vie 9:00-20:00 | Sáb 10:00-14:00",
    latitud: 37.1818,
    longitud: -3.5993,
  },
  {
    idCentro: 2,
    nombre: "Hospital Veterinario Granada Sur",
    ciudad: "Granada",
    direccion: "Av. de Andalucía 120, Granada",
    telefono: "958654321",
    especialidad: "Urgencias 24h",
    foto: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400",
    horario: "Abierto 24 horas todos los días",
    latitud: 37.1530,
    longitud: -3.6068,
  },
  {
    idCentro: 3,
    nombre: "Centro Veterinario Zaidín",
    ciudad: "Granada",
    direccion: "Calle Arabial 15, Granada",
    telefono: "958789012",
    especialidad: "Dermatología y Nutrición",
    foto: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400",
    horario: "Lun-Vie 8:30-21:00 | Sáb 9:00-13:00",
    latitud: 37.1647,
    longitud: -3.5940,
  },
  {
    idCentro: 4,
    nombre: "Veterinaria Fauna",
    ciudad: "Granada",
    direccion: "Plaza de Gracia 5, Granada",
    telefono: "958345678",
    especialidad: "Animales Exóticos",
    foto: "https://images.unsplash.com/photo-1559163499-413811fb2344?w=400",
    horario: "Lun-Vie 10:00-19:00",
    latitud: 37.1756,
    longitud: -3.5869,
  },
  {
    idCentro: 5,
    nombre: "Clínica Veterinaria Campus",
    ciudad: "Granada",
    direccion: "Calle Recogidas 8, Granada",
    telefono: "958901234",
    especialidad: "Cirugía y Ortopedia",
    foto: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    horario: "Lun-Sáb 9:00-21:00",
    latitud: 37.1697,
    longitud: -3.6006,
  },
];

let mockAdopciones: AdopcionTemporal[] = [];
let nextMascotaId = 5;
let nextPaseoId = 3;
let nextAdopcionId = 1;

// Simula latencia de red
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
=======
export async function loginUsuario(email: string, password: string): Promise<Usuario> {
  try {
    const response = await api.post('/auth/login', { email, password });
    // Guardamos el token en la configuración global de axios
    setAuthToken(response.data.token);
    return response.data;
  } catch (error: any) {
    // Manejo de errores simplificado
    if (error.response?.status === 401) {
      throw new Error('Email o contraseña incorrectos');
    }
    throw new Error('Error al conectar con el servidor');
  }
>>>>>>> 438c015a3f5844ab3fb112790da8b81dec8ab342
}

export async function registrarUsuario(nombre: string, email: string, password: string): Promise<Usuario> {
  try {
    const response = await api.post('/auth/registro', { nombre, email, password });
    setAuthToken(response.data.token);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('Ya existe una cuenta con este email');
    }
    throw new Error('Error al registrar el usuario');
  }
}

export async function consultarUsuario(id: number): Promise<Usuario> {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

export async function actualizarUsuario(id: number, datos: Partial<Usuario>): Promise<Usuario> {
  const response = await api.put(`/usuarios/${id}`, datos);
  return response.data;
}

// ===== MASCOTAS =====

export async function consultarMascotasAdopcion(): Promise<Mascotas> {
  // El backend usa '?disponible=1' en lugar de '?adopcion=true' (según la auditoría previa)
  const response = await api.get(`/mascotas?disponible=1`);
  return response.data;
}

export async function consultarMascotas(): Promise<Mascotas> {
  const response = await api.get(`/mascotas`);
  return response.data;
}

export async function consultarMascota(id: number): Promise<Mascota> {
  const response = await api.get(`/mascotas/${id}`);
  return response.data;
}

export async function crearMascota(mascota: Mascota): Promise<Mascota> {
  const response = await api.post(`/mascotas`, mascota);
  return response.data;
}

export async function actualizarMascota(id: number, mascota: Mascota): Promise<Mascota> {
  const response = await api.put(`/mascotas/${id}`, mascota);
  return response.data;
}

export async function borrarMascota(id: number): Promise<void> {
  await api.delete(`/mascotas/${id}`);
}

export async function buscarMascotas(texto: string): Promise<Mascotas> {
  const response = await api.get(`/mascotas?q=${texto}`);
  return response.data;
}

<<<<<<< HEAD
// ===== CENTROS VETERINARIOS =====

export async function consultarCentros(): Promise<CentrosVeterinarios> {
  if (USE_FAKE_API) {
    await delay();
    return [...mockCentros];
  }
  const axios = (await import('axios')).default;
  return (await axios.get(`${URL_API}/centros`)).data;
}

// ===== ADOPCIONES =====
=======
// ===== ADOPCIONES / ALQUILERES =====
>>>>>>> 438c015a3f5844ab3fb112790da8b81dec8ab342

export async function consultarAdopciones(usuarioId: number): Promise<AdopcionTemporal[]> {
  // El backend usa '?voluntario=X' para buscar por usuario (según la auditoría previa)
  const response = await api.get(`/alquileres?voluntario=${usuarioId}`);
  return response.data;
}

export async function crearAdopcion(adopcion: AdopcionTemporal): Promise<AdopcionTemporal> {
  const response = await api.post(`/alquileres`, adopcion);
  return response.data;
}

export async function eliminarAdopcion(id: number): Promise<void> {
  await api.delete(`/alquileres/${id}`);
}

// ===== PASEOS (Endpoints pendientes de implementar en el backend) =====

export async function consultarPaseos(): Promise<Paseos> {
  const response = await api.get(`/paseos`);
  return response.data;
}

export async function consultarPaseosMascota(mascotaId: number): Promise<Paseos> {
  const response = await api.get(`/paseos?mascotaId=${mascotaId}`);
  return response.data;
}

export async function crearPaseo(paseo: Paseo): Promise<Paseo> {
  const response = await api.post(`/paseos`, paseo);
  return response.data;
}
