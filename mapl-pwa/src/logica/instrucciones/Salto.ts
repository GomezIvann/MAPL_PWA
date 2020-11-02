import { PrimitiveSizes } from '../util/DataTypes';
import { Memory } from '../segmentoDatos/Memoria';
import { Stack } from '../segmentoDatos/Stack';
import { InstruccionLabel } from './Instruccion';

/**
 * -----------------------------------------------------
 * ---------------------JMP (Jump)----------------------
 * -----------------------------------------------------
 */
export class Jmp extends InstruccionLabel {
    execute(stack: Stack, memory: Memory): void {
        this.programa.jumpTo(this.label.primeraInstruccion);
    }
}
/**
 * -----------------------------------------------------
 * ------------------JZ (Jump if Zero)------------------
 * -----------------------------------------------------
 */
export class Jz extends InstruccionLabel {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(PrimitiveSizes.INTEGER).value;
        if (value === 0)
            this.programa.jumpTo(this.label.primeraInstruccion);
    }
}
/**
 * -----------------------------------------------------
 * ---------------JNZ (Jump if Not Zero)----------------
 * -----------------------------------------------------
 */
export class Jnz extends InstruccionLabel {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(PrimitiveSizes.INTEGER).value;
        if (value !== 0)
            this.programa.jumpTo(this.label.primeraInstruccion);
    }
}