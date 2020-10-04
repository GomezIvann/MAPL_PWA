import { ByteDataType, DataType, FloatDataType, IntegerDataType } from './DataTypes';
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
 * En javascript los objetos se pasan por referencia, es decir:
 *      let dt = stack.pop(this.getInstructionSize());
 *      let copy = dt;
 * si modificamos un valor de copy (ej. copy.size = 200) tambien se modificaría en dt.
 * Para que dup funcione correctamente y no tengamos guardadas dos referencias al mismo objeto
 * se hace necesario clonar el primero de ellos, de lo cual se encarga Object.assign({}, dt);
 */
export class Dup extends InstruccionInteger {
    execute(stack: Stack) {
        let dt = stack.pop(this.getInstructionSize());
        let copy = Object.assign({}, dt);
        stack.push(dt, this.getInstructionSize());
        stack.push(copy, this.getInstructionSize());
    }
}
export class Dupf extends InstruccionFloat {
    execute(stack: Stack) {
        let dt = stack.pop(this.getInstructionSize());
        let copy = Object.assign({}, dt);
        stack.push(dt, this.getInstructionSize());
        stack.push(copy, this.getInstructionSize());
    }
}
export class Dupb extends InstruccionByte {
    execute(stack: Stack) {
        let dt = stack.pop(this.getInstructionSize());
        let copy = Object.assign({}, dt);
        stack.push(dt, this.getInstructionSize());
        stack.push(copy, this.getInstructionSize());
    }
}