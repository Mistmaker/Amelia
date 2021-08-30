export class Actividades {
    id_actividad: number;
    entidad: string;
    actividad: string;
    condicion: string;
    condicion_dos: string;
    parametro_inicio: string;
    parametro_fin: string;
    dias: string;
    frecuencia: string;
    vence: string;
    pn_obligado: string;
    pn_no_obligado: string;
    pj_sin_fin_lucro: string;
    pj_con_fin_lucro: string;
    editable: string;
    nombreEntidad: string;
    constructor() {
        this.id_actividad = 0;
    }
}
