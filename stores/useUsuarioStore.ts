import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../model/Tipos';
import { loginUsuario } from '../helpers/ConsultasApi';

type UsuarioState = {
  usuario: Usuario | null;
  cargandoSesion: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  cargarSesion: () => Promise<boolean>;
};

const useUsuarioStore = create<UsuarioState>((set) => ({
  usuario: null,
  cargandoSesion: true,

  login: async (email: string, password: string) => {
    const usuario = await loginUsuario(email, password);
    if (usuario) {
      await AsyncStorage.setItem('sesion_usuario', JSON.stringify(usuario));
      set({ usuario });
      return true;
    }
    return false;
  },

  logout: async () => {
    await AsyncStorage.removeItem('sesion_usuario');
    set({ usuario: null });
  },

  cargarSesion: async () => {
    const datos = await AsyncStorage.getItem('sesion_usuario');
    if (datos) {
      const usuario: Usuario = JSON.parse(datos);
      set({ usuario, cargandoSesion: false });
      return true;
    }
    set({ cargandoSesion: false });
    return false;
  },
}));

export default useUsuarioStore;
