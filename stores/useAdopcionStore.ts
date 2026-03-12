import { create } from 'zustand';
import { Mascota } from '../model/Tipos';

export type MascotaEnProceso = {
  mascota: Mascota;
  fechaFin: string;
};

type AdopcionState = {
  mascotasEnAdopcion: Mascota[];
  mascotasEnProceso: MascotaEnProceso[];
  añadir: (mascota: Mascota) => void;
  quitar: (id: number) => void;
  vaciar: () => void;
  estaEnAdopcion: (id: number) => boolean;
  enviarSolicitud: () => void;
  estaEnProceso: (id: number) => boolean;
};

const useAdopcionStore = create<AdopcionState>((set, get) => ({
  mascotasEnAdopcion: [],
  mascotasEnProceso: [],

  añadir: (mascota: Mascota) => {
    const existe = get().mascotasEnAdopcion.some((m) => m.id === mascota.id);
    if (!existe) {
      set((state) => ({
        mascotasEnAdopcion: [...state.mascotasEnAdopcion, mascota],
      }));
    }
  },

  quitar: (id: number) => {
    set((state) => ({
      mascotasEnAdopcion: state.mascotasEnAdopcion.filter((m) => m.id !== id),
    }));
  },

  vaciar: () => set({ mascotasEnAdopcion: [] }),

  estaEnAdopcion: (id: number) => {
    return get().mascotasEnAdopcion.some((m) => m.id === id);
  },

  enviarSolicitud: () => {
    const hoy = new Date();
    const finDate = new Date(hoy);
    finDate.setDate(finDate.getDate() + 30);
    const fechaFin = `${String(finDate.getDate()).padStart(2, '0')}/${String(finDate.getMonth() + 1).padStart(2, '0')}/${finDate.getFullYear()}`;

    const nuevosEnProceso: MascotaEnProceso[] = get().mascotasEnAdopcion.map((m) => ({
      mascota: m,
      fechaFin,
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
