import { Programa } from '../compilador/Programa';
import { Memory } from '../segmentoDatos/Memoria';
import { Stack } from '../segmentoDatos/Stack';
import { Instruccion } from './Instruccion';

/**
 * -----------------------------------------------------
 * -------------HALT (Fin de la ejecucion)--------------
 * -----------------------------------------------------
 * Si no aparece explicitamente en el programa, se añade.
 */
export class Halt extends Instruccion {
    private _programa: Programa;

    constructor(numeroInstruccion: number, programa: Programa){
        super(numeroInstruccion);
        this._programa = programa;
    }
    execute(stack: Stack, memory: Memory): void {
        this._programa.finDeEjecucion();
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