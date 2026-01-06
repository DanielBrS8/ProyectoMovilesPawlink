import axios from 'axios';
import { Mascota, Mascotas, Paseo, Paseos } from '../model/Tipos';



const URL_API = 'http://192.168.1.134:3000';


//  CRUD MASCOTAS 

// Obtener todas las mascotas
export async function consultarMascotas(): Promise<Mascotas> {
    const endpoint = `${URL_API}/mascotas`;
    const respuesta = await axios.get(endpoint);
    return respuesta.data;
}

//mascota por ID
export async function consultarMascota(id: number): Promise<Mascota> {
    const endpoint = `${URL_API}/mascotas/${id}`;
    const respuesta = await axios.get(endpoint);
    return respuesta.data;
}

// nueva mascota
export async function crearMascota(mascota: Mascota): Promise<Mascota> {
    const endpoint = `${URL_API}/mascotas`;
    const respuesta = await axios.post(endpoint, mascota);
    return respuesta.data;
}

// Actualizar una mascota
export async function actualizarMascota(id: number, mascota: Mascota): Promise<Mascota> {
    const endpoint = `${URL_API}/mascotas/${id}`;
    const respuesta = await axios.put(endpoint, mascota);
    return respuesta.data;
}

// Borrar una mascota
export async function borrarMascota(id: number): Promise<void> {
    const endpoint = `${URL_API}/mascotas/${id}`;
    await axios.delete(endpoint);
}

// Buscar mascotas por texto
export async function buscarMascotas(texto: string): Promise<Mascotas> {
    const endpoint = `${URL_API}/mascotas?q=${texto}`;
    const respuesta = await axios.get(endpoint);
    return respuesta.data;
}

//CRUD PASEOS

export async function consultarPaseos(): Promise<Paseos> {
    const endpoint = `${URL_API}/paseos`;
    const respuesta = await axios.get(endpoint);
    return respuesta.data;
}

// paseos de una mascota específica
export async function consultarPaseosMascota(mascotaId: number): Promise<Paseos> {
    const endpoint = `${URL_API}/paseos?mascotaId=${mascotaId}`;
    const respuesta = await axios.get(endpoint);
    return respuesta.data;
}

//nuevo paseo
export async function crearPaseo(paseo: Paseo): Promise<Paseo> {
    const endpoint = `${URL_API}/paseos`;
    const respuesta = await axios.post(endpoint, paseo);
    return respuesta.data;
}