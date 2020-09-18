import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Instruccion } from './instrucciones/Instruccion';
import { Stack } from './Stack';

/**
 * Representa el codigo (instrucciones) del archivo cargado por el usuario
 */
export class Program {
    codigo: Instruccion[] = [];
    stack: Stack<number> = new Stack<number>(1000);

    constructor() {
        this.codigo = [];
        this.stack = new Stack<number>(1000);
    }

    run() {
        this.codigo.forEach(i => i.execute(this.stack));
    }
}