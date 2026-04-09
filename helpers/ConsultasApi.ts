import axios from 'axios';
import { Mascota, Mascotas, Paseo, Paseos, Usuario, AdopcionTemporal } from '../model/Tipos';

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

// ===== ADOPCIONES / ALQUILERES =====

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
