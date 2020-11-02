import { Programa } from '../compilador/Programa';
import { IntegerDataType, PrimitiveSizes } from '../util/DataTypes';
import { Stack, StackFrame } from '../segmentoDatos/Stack';
import { Memory } from '../segmentoDatos/Memoria';
import { Instruccion, InstruccionLabel } from './Instruccion';

/**
 * -----------------------------------------------------
 * ------------------------CALL-------------------------
 * -----------------------------------------------------
 */
export class Call extends InstruccionLabel {
    execute(stack: Stack, memory: Memory): void {
        let returnDir: IntegerDataType  = new IntegerDataType(+this.numero);
        let lastBP: IntegerDataType  = new IntegerDataType(+stack.getBP());
        let sf: StackFrame = new StackFrame(returnDir, lastBP);
        stack.pushStackFrame(sf);
        this.programa.jumpTo(this.label.primeraInstruccion);
    }
}
/**
 * -----------------------------------------------------
 * -----------------------ENTER-------------------------
 * -----------------------------------------------------
 */
export class Enter extends Instruccion {
    execute(stack: Stack, memory: Memory): void {
    }
}
/**
 * -----------------------------------------------------
 * ------------------------RET--------------------------
 * -----------------------------------------------------
 */
export class Ret extends Instruccion {
    protected programa: Programa;

    constructor(numeroInstruccion: number, programa: Programa){
		super(numeroInstruccion);
		this.programa = programa;
    }
    execute(stack: Stack, memory: Memory): void {
        this.programa.jumpTo(stack.popStackFrame(PrimitiveSizes.INTEGER));
    }
}