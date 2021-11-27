export class AgendaActividad {
    id: number;
    ruc: string;
    id_actividad: number;
    creado: string;
    vence: string;
    mes: string;
    estado: string;
    fecha_finalizacion: string;
    fecha_aviso: string;
    usuario: string;
    periodo: string;
    periodo_calculo: string;
    actividad: string;
    ESCAT: string;
    cliente: string;
    comentarios: number;
    documentos: number;
}

export class AgendaActividadAdmin {
    usuario: string;
    colapsado: boolean;
    page: number;
    actividades: AgendaActividad[];
}