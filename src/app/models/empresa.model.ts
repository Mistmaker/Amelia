export class Empresa {
    COMCODIGO: string;
    COMRUCI: string;
    COMNOMBRE: string;
    COMDIRECCION: string;
    COMTELEFONO1: string;
    COMTELEFONO2: string;
    COMFAX: string;
    COMMULTIBODEGA: string;
    COMREPRESENTANTE: string;
    COMCORREO: string;
    COMPROVINCIA: string;
    COMLOCALIZACION_RPT: string;
    COMAUTSRI_RET: string;
    COMSERIE_RET: string;
    COMNOMBREP: string;
    COMCOORDINADOR: string;
    COMCICOORDINADOR: string;
    COMCONTADOR: string;
    COMRUCCONTADOR: string;
    COMLOCALIZACION_FOR: string;
    COMNOMBRECORTO: string;
    COMACTIVACION: string;
    COMCANTIDAD: number;
    COMLOCALIZACIONLOG1: string;
    COMLOCALIZACIONLOG2: string;
    COMLOCALIZACIONARCHIVO: string;
    COM_TIPOAMBFACTELEC: string;
    COM_FEACTIVADA: string;
    COM_PRODACTIVADA: string;
    COMRESOLUCION: string;
    COMDIRECSUCURSAL: string;
    COM_CONTRIBUYENTEESP: string;
    COM_UBICACIONARCHIVOS: string;
    COM_CORREOCOPIAFAC: string;
    COM_CORREOCOPIANC: string;
    COM_CORREOCOPIAGRE: string;
    COM_CORREOCOPIAND: string;
    COM_CORREOCOPIARET: string;
    COM_OBLIGADOCONTABILIDAD: string;
    COM_CONTRIBUYENTEESPECIAL: string;
    COM_CONFORMACION: string;
    COM_FECHACADFIRMAELE: Date;
    COM_UBICACIONLOG: string;
    COM_SUBSIDIO: number;
    COM_UBICACIONXMLAUT: string;
    COM_TRANSPORTE: string;
    COM_MICROEMPRESA: string;
    PLACAS: EmpresaPlaca[];
}

export class EmpresaPlaca {
    COP_CODIGO: number;
    COP_PLACA: string;
    COP_OBSERVACION: string;
}