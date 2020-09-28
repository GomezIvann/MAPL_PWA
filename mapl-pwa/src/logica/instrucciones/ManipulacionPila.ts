import { ByteDataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { InstruccionByte, InstruccionFloat, InstruccionInteger } from './Instruccion';

/**
 *  ----------------------PUSH---------------------------
 */
export class Push extends InstruccionInteger {
    cte: string;

    constructor(numeroLinea: string, cte: string){ 
        super(numeroLinea);
        this.cte = cte;
    }
    execute(stack: Stack) {
        // +cadena --> para convertir una cadena que contiene un número en un número
        // Solo funciona si la cadena solo contiene caracteres numéricos, de lo contrario, devuelve NaN
        let dt = new IntegerDataType(+this.cte);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Pushf extends InstruccionFloat {
    cte: string;

    constructor(numeroLinea: string, cte: string){ 
        super(numeroLinea);
        this.cte = cte;
    }
    execute(stack: Stack) {
        let dt = new FloatDataType(+this.cte);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Pushb extends InstruccionByte {
    cte: string;

    constructor(numeroLinea: string, cte: string){ 
        super(numeroLinea);
        this.cte = cte;
    }
    execute(stack: Stack) {
        let dt = new ByteDataType(+this.cte); 
        stack.push(dt, this.getInstructionSize());
    }
}

/**
 *  ----------------------POP---------------------------
 */
export class Pop extends InstruccionInteger {
    execute(stack: Stack) {
        stack.pop(this.getInstructionSize());
    }
}
export class Popf extends InstruccionFloat {
    execute(stack: Stack) {
        stack.pop(this.getInstructionSize());
    }
}
export class Popb extends InstruccionByte {
    execute(stack: Stack) {
        stack.pop(this.getInstructionSize());
    }
}

/**
 *  ----------------------DUP---------------------------
 */
export class Dup extends InstruccionInteger {
    execute(stack: Stack) {
        let dt = stack.pop(this.getInstructionSize());
        stack.push(dt, this.getInstructionSize());
        stack.push(dt, this.getInstructionSize());
    }
}
export class Dupf extends InstruccionFloat {
    execute(stack: Stack) {
        let dt = stack.pop(this.getInstructionSize());
        stack.push(dt, this.getInstructionSize());
        stack.push(dt, this.getInstructionSize());
    }
}
export class Dupb extends InstruccionByte {
    execute(stack: Stack) {
        let dt = stack.pop(this.getInstructionSize());
        stack.push(dt, this.getInstructionSize());
        stack.push(dt, this.getInstructionSize());
    }
}