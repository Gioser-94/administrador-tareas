export interface Tarea {
    id: number;
    texto: string;
    prioridad:  'Baja' | 'Media' | 'Alta';
    estaCompletada: boolean;
    fechaCreacion: number;
    fechaLimite: number;
}