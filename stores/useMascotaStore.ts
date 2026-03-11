import { create } from 'zustand';
import { Mascota, Mascotas } from '../model/Tipos';
import { consultarMascotas, buscarMascotas, borrarMascota } from '../helpers/ConsultasApi';

type MascotaState = {
  listaMascotas: Mascotas;
  cargando: boolean;
  textoBusqueda: string;
  setTextoBusqueda: (texto: string) => void;
  cargarMascotas: () => Promise<void>;
  buscar: (texto: string) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
};

const useMascotaStore = create<MascotaState>((set) => ({
  listaMascotas: [],
  cargando: true,
  textoBusqueda: '',

  setTextoBusqueda: (texto: string) => set({ textoBusqueda: texto }),

  cargarMascotas: async () => {
    set({ cargando: true });
    try {
      const mascotas = await consultarMascotas();
      set({ listaMascotas: mascotas, cargando: false });
    } catch (error) {
      console.log('Error al cargar mascotas:', error);
      set({ cargando: false });
    }
  },

  buscar: async (texto: string) => {
    try {
      const mascotas = await buscarMascotas(texto);
      set({ listaMascotas: mascotas });
    } catch (error) {
      console.log('Error en búsqueda:', error);
    }
  },

  eliminar: async (id: number) => {
    try {
      await borrarMascota(id);
      const mascotas = await consultarMascotas();
      set({ listaMascotas: mascotas });
    } catch (error) {
      console.log('Error al borrar:', error);
    }
  },
}));

export default useMascotaStore;
