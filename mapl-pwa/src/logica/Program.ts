import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Instruccion } from './instrucciones/Instruccion';
import { Stack } from './Stack';

/**
 * Representa el codigo (instrucciones) del archivo cargado por el usuario
 */
export class Program {
    codigo: Instruccion[] = [];
    programStack: Stack<number>;

    run() {
        this.codigo.forEach(i => i.execute());
    }
}