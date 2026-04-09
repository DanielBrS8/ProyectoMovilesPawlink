import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../model/Tipos';
import { loginUsuario, registrarUsuario, actualizarUsuario } from '../helpers/ConsultasApi';

type UsuarioState = {
  usuario: Usuario | null;
  cargandoSesion: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  registro: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  cargarSesion: () => Promise<boolean>;
  actualizarPerfil: (datos: Partial<Usuario>) => Promise<void>;
};

const useUsuarioStore = create<UsuarioState>((set) => ({
  usuario: null,
  cargandoSesion: true,

  login: async (email: string, password: string) => {
    try {
      const usuario = await loginUsuario(email, password);
      await AsyncStorage.setItem('sesion_usuario', JSON.stringify(usuario));
      set({ usuario });
      return true;
    } catch {
      return false;
    }
  },

  registro: async (nombre: string, email: string, password: string) => {
    try {
      const usuario = await registrarUsuario(nombre, email, password);
      await AsyncStorage.setItem('sesion_usuario', JSON.stringify(usuario));
      set({ usuario });
      return true;
    } catch {
      return false;
    }
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

  actualizarPerfil: async (datos: Partial<Usuario>) => {
    const { usuario } = useUsuarioStore.getState();
    if (!usuario) return;
    const actualizado = await actualizarUsuario(usuario.id, datos);
    await AsyncStorage.setItem('sesion_usuario', JSON.stringify(actualizado));
    set({ usuario: actualizado });
  },
}));

export default useUsuarioStore;
