export interface Tarea {
    id: number;
    texto: string;
    prioridad:  'Baja' | 'Media' | 'Alta';
    estado: boolean;
}