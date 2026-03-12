import { Tag } from "./tag";

export interface Tarea {
    id: string;
    texto: string;
    prioridad:  'Baja' | 'Media' | 'Alta';
    estado: 'backlog' | 'to-do' | 'doing' | 'done';
    orden: number;
    fechaCreacion: number;
    fechaLimite: number;
    tags: Tag[];
}