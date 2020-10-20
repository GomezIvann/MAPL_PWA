import { Programa } from '../compilador/Programa';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { Instruccion } from './Instruccion';

/**
 * -----------------------------------------------------
 * -------------HALT (Fin de la ejecucion)--------------
 * -----------------------------------------------------
 * Si no aparece explicitamente en el programa, se añade.
 */
export class Halt extends Instruccion {
    programa: Programa;

    constructor(numeroInstruccion: number, programa: Programa){
        super(numeroInstruccion);
        this.programa = programa;
    }
    execute(stack: Stack, memory: Memory): void {
        this.programa.finDeEjecucion();
    }
}
/**
 * -----------------------------------------------------
 * ------------------NOP (Do nothing)-------------------
 * -----------------------------------------------------
 */
export class Nop extends Instruccion {
    execute(stack: Stack, memory: Memory): void {}
}