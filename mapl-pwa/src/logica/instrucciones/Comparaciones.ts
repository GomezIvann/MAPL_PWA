import { FloatDataType, IntegerDataType, PrimitiveSizes } from '../util/DataTypes';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { InstruccionInteger, InstruccionFloat } from './Instruccion';

/**
 * Independientemente del tipo de datos que se comparen (integer o float)
 * en la pila siempre dejan un entero
 */
export class Gt extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 > value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}
export class Gtf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 > value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}

export class Lt extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 < value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}
export class Ltf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 < value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}

export class Ge extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 >= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}
export class Gef extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 >= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}

export class Le extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 <= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}
export class Lef extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 <= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}

export class Eq extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 === value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}
export class Eqf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 === value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}

export class Ne extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 !== value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}
export class Nef extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 !== value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, PrimitiveSizes.INTEGER);
    }
}
