import { Linea } from './Linea';

/**
 * Clase abstracta que deben extender las incidencias del sistema.
 *      - Identificador: numero de linea si del parser, numero de instruccion si es de ejecucion.
 *      - Tipo: de Parser o de Ejecucion.
 *      - Descripcion: mensaje de error.
 *      - Linea: contenido de la linea que provoca el error.
 */
export abstract class Incidencia {
    identificador: string;
    descripcion: string;
    tipo: TiposError;
    linea: string;

    constructor(descripcion: string, identificador: string, linea: string) {
        this.descripcion = descripcion;
        this.identificador = identificador;
        this.linea = linea;
    }
    getContenido(): string {
        return this.linea;
    }
}

/**
 * Errores surgidos durante el parseo del fichero.
 */
export class ParserIncidencia extends Incidencia {
    constructor(descripcion: string) {
        super(descripcion, "", "");
        this.tipo = TiposError.Parser;
    }
    getContenido(): string {
        if (this.linea !== "")
            return "'" + this.linea + "'";
        return this.linea;
    }
}

/**
 * Errores de ejecucion.
 */
export class EjecucionIncidencia extends Incidencia {
    constructor(descripcion: string, linea: Linea) {
        super(descripcion, linea.numeroInstruccion, linea.contenido);
        this.tipo = TiposError.Ejecucion;
    }
}

export enum TiposError {
    Parser = "Parser",
    Ejecucion = "Ejecución"
}