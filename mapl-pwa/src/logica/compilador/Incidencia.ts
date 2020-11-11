import { Instruccion } from '../instrucciones/Instruccion';
import { Linea } from './Linea';

export abstract class Incidencia {
    identificador: string;
    message: string;
    tipo: TiposError;
    linea: string;

    constructor(message: string, identificador: string, linea: string) {
        this.message = message;
        this.identificador = identificador;
        this.linea = linea;
    }
    getContenido(): string {
        return this.linea;
    }
}

export class ParserIncidencia extends Incidencia {
    constructor(message: string) {
        super(message, "", "");
        this.tipo = TiposError.Parser;
    }
    getContenido(): string {
        return "'" + this.linea + "'";
    }
}

export class EjecucionIncidencia extends Incidencia {
    constructor(message: string, linea: Linea) {
        super(message, linea.numeroInstruccion, linea.contenido);
        this.tipo = TiposError.Ejecucion;
    }
}

export enum TiposError {
    Parser = "Parser",
    Ejecucion = "Ejecución"
}