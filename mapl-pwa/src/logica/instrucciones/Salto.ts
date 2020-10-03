import { Sizes } from './DataTypes';
import { Stack } from '../util/Stack';
import { InstruccionLabel } from './Instruccion';

export class Jmp extends InstruccionLabel {
    execute(stack: Stack) {
        let label = this.programa.getLabelByNombre(this.labelNombre);
        this.programa.iActual = label.primeraInstruccion;
    }
}
export class Jz extends InstruccionLabel {
    execute(stack: Stack) {
        let value = parseInt(stack.pop(Sizes.INTEGER).value);
        if (value === 0) {
            let label = this.programa.getLabelByNombre(this.labelNombre);
            this.programa.iActual = label.primeraInstruccion;
        }
    }
}
export class Jnz extends InstruccionLabel {
    execute(stack: Stack) {
        let value = parseInt(stack.pop(Sizes.INTEGER).value);
        if (value !== 0) {
            let label = this.programa.getLabelByNombre(this.labelNombre);
            this.programa.iActual = label.primeraInstruccion;
        }
    }
}