import { PrimitiveSizes } from '../util/DataTypes';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { InstruccionLabel } from './Instruccion';

/**
 * -----------------------------------------------------
 * ---------------------JMP (Jump)----------------------
 * -----------------------------------------------------
 */
export class Jmp extends InstruccionLabel {
    execute(stack: Stack, memory: Memory): void {
        let label = this.programa.getLabelByNombre(this.labelNombre);
        this.programa.jumpTo(label.primeraInstruccion);
    }
}
/**
 * -----------------------------------------------------
 * ------------------JZ (Jump if Zero)------------------
 * -----------------------------------------------------
 */
export class Jz extends InstruccionLabel {
    execute(stack: Stack, memory: Memory): void {
        let value = parseInt(stack.pop(PrimitiveSizes.INTEGER).value);
        if (value === 0) {
            let label = this.programa.getLabelByNombre(this.labelNombre);
            this.programa.jumpTo(label.primeraInstruccion);
        }
    }
}
/**
 * -----------------------------------------------------
 * ---------------JNZ (Jump if Not Zero)----------------
 * -----------------------------------------------------
 */
export class Jnz extends InstruccionLabel {
    execute(stack: Stack, memory: Memory): void {
        let value = parseInt(stack.pop(PrimitiveSizes.INTEGER).value);
        if (value !== 0) {
            let label = this.programa.getLabelByNombre(this.labelNombre);
            this.programa.jumpTo(label.primeraInstruccion);
        }
    }
}