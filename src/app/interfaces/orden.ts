export interface CriterioOrden {
    nombre: 'Prioridad' | 'Fecha creación' | 'Fecha límite';
    campo: 'prioridad' | 'fecha-creacion' | 'fecha-limite';
    direccion: 'asc' | 'desc';
    activo: boolean;
}