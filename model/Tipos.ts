// === USUARIOS ===
export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  password: string;
  foto: string;
  telefono: string;
  direccion: string;
};

// === MASCOTAS ===
export type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  peso: string;
  sexo: string;
  foto: string;
  estado: string;
  proximaVacuna: string;
  notas: string;
  esMia?: boolean; // true = mascota propia, false = mascota de adopción
};

export type Mascotas = Array<Mascota>;

// === ADOPCION TEMPORAL ===
export type AdopcionTemporal = {
  id: number;
  usuarioId: number;
  mascotaId: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  notas: string;
};

// === PASEOS ===
export type Coordenada = {
  latitude: number;
  longitude: number;
};

export type Paseo = {
  id: number;
  mascotaId: number;
  fecha: string;
  duracion: string;
  distancia: number;
  ruta: Array<Coordenada>;
};

export type Paseos = Array<Paseo>;
