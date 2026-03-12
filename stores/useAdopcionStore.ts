import { create } from 'zustand';
import { Mascota } from '../model/Tipos';

export type MascotaEnCarrito = {
  mascota: Mascota;
  fechaInicio: string;
  fechaFin: string;
};

export type MascotaEnProceso = {
  mascota: Mascota;
  fechaInicio: string;
  fechaFin: string;
};

type AdopcionState = {
  mascotasEnAdopcion: MascotaEnCarrito[];
  mascotasEnProceso: MascotaEnProceso[];
  añadir: (mascota: Mascota, fechaInicio: string, fechaFin: string) => void;
  quitar: (id: number) => void;
  vaciar: () => void;
  estaEnAdopcion: (id: number) => boolean;
  enviarSolicitud: () => void;
  estaEnProceso: (id: number) => boolean;
};

const useAdopcionStore = create<AdopcionState>((set, get) => ({
  mascotasEnAdopcion: [],
  mascotasEnProceso: [],

  añadir: (mascota: Mascota, fechaInicio: string, fechaFin: string) => {
    const existe = get().mascotasEnAdopcion.some((m) => m.mascota.id === mascota.id);
    if (!existe) {
      set((state) => ({
        mascotasEnAdopcion: [...state.mascotasEnAdopcion, { mascota, fechaInicio, fechaFin }],
      }));
    }
  },

  quitar: (id: number) => {
    set((state) => ({
      mascotasEnAdopcion: state.mascotasEnAdopcion.filter((m) => m.mascota.id !== id),
    }));
  },

  vaciar: () => set({ mascotasEnAdopcion: [] }),

  estaEnAdopcion: (id: number) => {
    return get().mascotasEnAdopcion.some((m) => m.mascota.id === id);
  },

  enviarSolicitud: () => {
    const nuevosEnProceso: MascotaEnProceso[] = get().mascotasEnAdopcion.map((m) => ({
      mascota: m.mascota,
      fechaInicio: m.fechaInicio,
      fechaFin: m.fechaFin,
    }));

    set((state) => ({
      mascotasEnProceso: [...state.mascotasEnProceso, ...nuevosEnProceso],
      mascotasEnAdopcion: [],
    }));
  },

  estaEnProceso: (id: number) => {
    return get().mascotasEnProceso.some((mp) => mp.mascota.id === id);
  },
}));

export default useAdopcionStore;
