export interface Tarea {
    id: number;
    texto: string;
    prioridad:  'Baja' | 'Media' | 'Alta';
    estado: 'backlog' | 'to-do' | 'doing' | 'done';
    fechaCreacion: number;
    fechaLimite: number;
}