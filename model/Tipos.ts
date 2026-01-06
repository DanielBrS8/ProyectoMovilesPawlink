export type Mascota={

    id:number
    nombre:string
    especie:string
    raza:string
    edad:string
    peso:string
    sexo:string
    foto:string
    estado:string
    proximaVacuna:string
    notas:string

}

export type Mascotas= Array<Mascota>

export type Coordenada={

    latitude:number
    longitude:number

}

export type Paseo={

    id:number
    mascotaId:number
    fecha:string
    duracion:string
    distancia:number
    ruta:Array<Coordenada>

}

export type Paseos= Array<Paseo>

