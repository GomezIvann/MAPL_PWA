import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Instruccion } from './instrucciones/Instruccion';
import { Stack } from './Stack';

/**
 * Representa el codigo (instrucciones) del archivo cargado por el usuario
 */
export class Program {
    code: Instruccion[];
    content: Linea[];
    stack: Stack<number>;

    constructor() {
        this.code = [];
        this.content = [];
        this.stack = new Stack<number>(1000);
    }

    run() {
        this.code.forEach(i => i.execute(this.stack));
    }
}

/**
 * Representa cada linea del fichero leido
 */
export class Linea {
    contenido: string;
    numeroInstruccion: string;

	constructor(contenido: string, numeroInstruccion = ""){
        this.contenido = contenido;
        this.numeroInstruccion = numeroInstruccion;
    }
    print(): string {
        return this.numeroInstruccion + this.contenido + "\n";
    }
}