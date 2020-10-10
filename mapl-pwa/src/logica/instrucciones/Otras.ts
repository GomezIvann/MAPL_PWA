import { Programa } from '../compilador/Programa';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { Instruccion } from './Instruccion';

export class Halt extends Instruccion {
    programa: Programa;

    constructor(numeroInstruccion: string, programa: Programa){
        super(numeroInstruccion);
        this.programa = programa;
    }
    
    execute(stack: Stack, memory: Memory): void {
        this.programa.finDeEjecucion();
    }
}
export class Nop extends Instruccion {
    execute(stack: Stack, memory: Memory): void {}
}