import { Mascota, Mascotas, Paseo, Paseos, Usuario, AdopcionTemporal } from '../model/Tipos';

// ===================================================================
// FAKE API - Datos simulados en memoria (sin necesidad de servidor)
// Cuando tengas el backend real, cambia USE_FAKE_API a false
// ===================================================================
const USE_FAKE_API = true;
const URL_API = 'http://192.168.1.134:3000';

// --- Datos mock en memoria ---
let mockUsuarios: Usuario[] = [
  {
    id: 1,
    nombre: "Carlos García",
    email: "carlos@pawlink.com",
    password: "123456",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    telefono: "612345678",
    direccion: "Calle Gran Vía 15, Granada",
  },
  {
    id: 2,
    nombre: "María López",
    email: "maria@pawlink.com",
    password: "123456",
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    telefono: "698765432",
    direccion: "Avenida de la Constitución 8, Granada",
  },
];

let mockMascotas: Mascotas = [
  {
    id: 1, nombre: "Luna", especie: "Perro", raza: "Golden Retriever",
    edad: "3 años", peso: "28 kg", sexo: "Hembra",
    foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    estado: "Necesita atención", proximaVacuna: "06/01/2026",
    notas: "Le encanta jugar con pelotas",
  },
  {
    id: 2, nombre: "Michi", especie: "Gato", raza: "Europeo",
    edad: "2 años", peso: "4.5 kg", sexo: "Macho",
    foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
    estado: "Saludable", proximaVacuna: "06/01/2026",
    notas: "Muy cariñoso",
  },
  {
    id: 3, nombre: "Rocky", especie: "Perro", raza: "Bulldog Francés",
    edad: "5 años", peso: "12 kg", sexo: "Macho",
    foto: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400",
    estado: "Saludable", proximaVacuna: "20/03/2026",
    notas: "Ronca mucho cuando duerme",
  },
  {
    id: 4, nombre: "Nala", especie: "Perro", raza: "Labrador",
    edad: "1 año", peso: "25 kg", sexo: "Hembra",
    foto: "https://images.unsplash.com/photo-1579213838058-8d0e2e080e09?w=400",
    estado: "Saludable", proximaVacuna: "10/04/2026",
    notas: "Muy juguetona y activa",
  },
];

let mockPaseos: Paseos = [
  {
    id: 1, mascotaId: 1, fecha: "28/12/2025", duracion: "00:45:32",
    distancia: 2.3, ruta: [{ latitude: 37.1773, longitude: -3.5986 }, { latitude: 37.178, longitude: -3.599 }],
  },
  {
    id: 2, mascotaId: 3, fecha: "27/12/2025", duracion: "00:30:15",
    distancia: 1.5, ruta: [{ latitude: 37.1773, longitude: -3.5986 }, { latitude: 37.1768, longitude: -3.5995 }],
  },
];

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

let mockAdopciones: AdopcionTemporal[] = [];
let nextMascotaId = 5;
let nextPaseoId = 3;
let nextAdopcionId = 1;

// Simula latencia de red
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== USUARIOS =====

export async function loginUsuario(email: string, password: string): Promise<Usuario | null> {
  if (USE_FAKE_API) {
    await delay();
    return mockUsuarios.find((u) => u.email === email && u.password === password) || null;
  }
  const axios = (await import('axios')).default;
  const resp = await axios.get(`${URL_API}/usuarios?email=${email}&password=${password}`);
  const usuarios = resp.data as Usuario[];
  return usuarios.length > 0 ? usuarios[0] : null;
}

export async function consultarUsuario(id: number): Promise<Usuario> {
  if (USE_FAKE_API) {
    await delay();
    const u = mockUsuarios.find((u) => u.id === id);
    if (!u) throw new Error('Usuario no encontrado');
    return u;
  }
  const axios = (await import('axios')).default;
  return (await axios.get(`${URL_API}/usuarios/${id}`)).data;
}

export async function actualizarUsuario(id: number, datos: Partial<Usuario>): Promise<Usuario> {
  if (USE_FAKE_API) {
    await delay();
    const idx = mockUsuarios.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('Usuario no encontrado');
    mockUsuarios[idx] = { ...mockUsuarios[idx], ...datos };
    return mockUsuarios[idx];
  }
  const axios = (await import('axios')).default;
  return (await axios.put(`${URL_API}/usuarios/${id}`, datos)).data;
}

// ===== MASCOTAS =====

export async function consultarMascotasAdopcion(): Promise<Mascotas> {
  if (USE_FAKE_API) {
    await delay();
    return mockMascotasAdopcion.map((m) => ({ ...m, esMia: false }));
  }
  const axios = (await import('axios')).default;
  return (await axios.get(`${URL_API}/mascotas?adopcion=true`)).data;
}

export async function consultarMascotas(): Promise<Mascotas> {
  if (USE_FAKE_API) {
    await delay();
    return mockMascotas.map((m) => ({ ...m, esMia: true }));
  }
  const axios = (await import('axios')).default;
  return (await axios.get(`${URL_API}/mascotas`)).data;
}

export async function consultarMascota(id: number): Promise<Mascota> {
  if (USE_FAKE_API) {
    await delay();
    const propia = mockMascotas.find((m) => m.id === id);
    if (propia) return { ...propia, esMia: true };
    const adopcion = mockMascotasAdopcion.find((m) => m.id === id);
    if (adopcion) return { ...adopcion, esMia: false };
    throw new Error('Mascota no encontrada');
  }
  const axios = (await import('axios')).default;
  return (await axios.get(`${URL_API}/mascotas/${id}`)).data;
}

export async function crearMascota(mascota: Mascota): Promise<Mascota> {
  if (USE_FAKE_API) {
    await delay();
    const nueva = { ...mascota, id: nextMascotaId++ };
    mockMascotas.push(nueva);
    return nueva;
  }
  const axios = (await import('axios')).default;
  return (await axios.post(`${URL_API}/mascotas`, mascota)).data;
}

export async function actualizarMascota(id: number, mascota: Mascota): Promise<Mascota> {
  if (USE_FAKE_API) {
    await delay();
    const idx = mockMascotas.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Mascota no encontrada');
    mockMascotas[idx] = { ...mascota, id };
    return mockMascotas[idx];
  }
  const axios = (await import('axios')).default;
  return (await axios.put(`${URL_API}/mascotas/${id}`, mascota)).data;
}

export async function borrarMascota(id: number): Promise<void> {
  if (USE_FAKE_API) {
    await delay();
    mockMascotas = mockMascotas.filter((m) => m.id !== id);
    return;
  }
  const axios = (await import('axios')).default;
  await axios.delete(`${URL_API}/mascotas/${id}`);
}

export async function buscarMascotas(texto: string): Promise<Mascotas> {
  if (USE_FAKE_API) {
    await delay(200);
    const t = texto.toLowerCase();
    return mockMascotas
      .filter(
        (m) =>
          m.nombre.toLowerCase().includes(t) ||
          m.raza.toLowerCase().includes(t) ||
          m.especie.toLowerCase().includes(t)
      )
      .map((m) => ({ ...m, esMia: true }));
  }
  const axios = (await import('axios')).default;
  return (await axios.get(`${URL_API}/mascotas?q=${texto}`)).data;
}

// ===== ADOPCIONES =====

export async function consultarAdopciones(usuarioId: number): Promise<AdopcionTemporal[]> {
  if (USE_FAKE_API) {
    await delay();
    return mockAdopciones.filter((a) => a.usuarioId === usuarioId);
  }
  const axios = (await import('axios')).default;
  return (await axios.get(`${URL_API}/adopciones?usuarioId=${usuarioId}`)).data;
}

export async function crearAdopcion(adopcion: AdopcionTemporal): Promise<AdopcionTemporal> {
  if (USE_FAKE_API) {
    await delay();
    const nueva = { ...adopcion, id: nextAdopcionId++ };
    mockAdopciones.push(nueva);
    return nueva;
  }
  const axios = (await import('axios')).default;
  return (await axios.post(`${URL_API}/adopciones`, adopcion)).data;
}

export async function eliminarAdopcion(id: number): Promise<void> {
  if (USE_FAKE_API) {
    await delay();
    mockAdopciones = mockAdopciones.filter((a) => a.id !== id);
    return;
  }
  const axios = (await import('axios')).default;
  await axios.delete(`${URL_API}/adopciones/${id}`);
}

// ===== PASEOS =====

export async function consultarPaseos(): Promise<Paseos> {
  if (USE_FAKE_API) {
    await delay();
    return [...mockPaseos];
  }
  const axios = (await import('axios')).default;
  return (await axios.get(`${URL_API}/paseos`)).data;
}

export async function consultarPaseosMascota(mascotaId: number): Promise<Paseos> {
  if (USE_FAKE_API) {
    await delay();
    return mockPaseos.filter((p) => p.mascotaId === mascotaId);
  }
  const axios = (await import('axios')).default;
  return (await axios.get(`${URL_API}/paseos?mascotaId=${mascotaId}`)).data;
}

export async function crearPaseo(paseo: Paseo): Promise<Paseo> {
  if (USE_FAKE_API) {
    await delay();
    const nuevo = { ...paseo, id: nextPaseoId++ };
    mockPaseos.push(nuevo);
    return nuevo;
  }
  const axios = (await import('axios')).default;
  return (await axios.post(`${URL_API}/paseos`, paseo)).data;
}
