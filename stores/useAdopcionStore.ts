import { create } from 'zustand';
import { Mascota } from '../model/Tipos';

type AdopcionState = {
  mascotasEnAdopcion: Mascota[];
  añadir: (mascota: Mascota) => void;
  quitar: (id: number) => void;
  vaciar: () => void;
  estaEnAdopcion: (id: number) => boolean;
};

const useAdopcionStore = create<AdopcionState>((set, get) => ({
  mascotasEnAdopcion: [],

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
}));

export default useAdopcionStore;
