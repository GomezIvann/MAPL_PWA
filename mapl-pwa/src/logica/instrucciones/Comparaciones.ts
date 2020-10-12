import { IntegerDataType, PrimitiveSizes } from '../util/DataTypes';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { InstruccionInteger, InstruccionFloat } from './Instruccion';

/**
 * Independientemente del tipo de datos que se comparen (integer o float) o la instruccion usada,
 * en la pila siempre dejan un entero.
 */
/**
 * -----------------------------------------------------
 * ----------------GT (Greater than)--------------------
 * -----------------------------------------------------
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
/**
 * -----------------------------------------------------
 * -----------------LT (Less than)----------------------
 * -----------------------------------------------------
 */
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
/**
 * -----------------------------------------------------
 * -----------------GE (Great or Equal)-----------------
 * -----------------------------------------------------
 */
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
/**
 * -----------------------------------------------------
 * ----------------LE (Less or Equal)-------------------
 * -----------------------------------------------------
 */
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
/**
 * -----------------------------------------------------
 * ---------------------EQ (Equal)----------------------
 * -----------------------------------------------------
 */
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
/**
 * -----------------------------------------------------
 * -------------------NE (Not equal)--------------------
 * -----------------------------------------------------
 */
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
