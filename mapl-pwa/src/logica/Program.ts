import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Instruccion } from './instrucciones/Instruccion';
import { Stack } from './Stack';

/**
 * Representa el codigo (instrucciones) del archivo cargado por el usuario
 */
export class Program {
    codigo: Instruccion[];
    content: Linea[];
    stack: Stack<number>;

    constructor() {
        this.codigo = [];
        this.content = [];
        this.stack = new Stack<number>(1000);
    }

    run() {
        this.codigo.forEach(i => i.execute(this.stack));
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
        this.numeroInstruccion = numeroInstruccion

        if (numeroInstruccion != "")
            this.numeroInstruccion += " ";
    }

    print(): string {
        return this.numeroInstruccion + this.contenido + "\n";
    }
}