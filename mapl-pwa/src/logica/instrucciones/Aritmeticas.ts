import { FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { InstruccionFloat, InstruccionInteger } from './Instruccion';

/**
 * -----------------------------------------------------
 * ----------------------ADD----------------------------
 * -----------------------------------------------------
 */
export class Add extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let dt = new IntegerDataType(value2 + value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Addf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let dt = new FloatDataType(value2 + value1);
        stack.push(dt, this.getInstructionSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------SUB----------------------------
 * -----------------------------------------------------
 */
export class Sub extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let dt = new IntegerDataType(value2 - value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Subf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let dt = new FloatDataType(value2 - value1);
        stack.push(dt, this.getInstructionSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------MUL----------------------------
 * -----------------------------------------------------
 */
export class Mul extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let dt = new IntegerDataType(value2 * value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Mulf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let dt = new FloatDataType(value2 - value1);
        stack.push(dt, this.getInstructionSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------DIV----------------------------
 * -----------------------------------------------------
 */
export class Div extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let dt = new IntegerDataType(Math.trunc(value2 / value1));
        stack.push(dt, this.getInstructionSize());
    }
}
export class Divf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let dt = new FloatDataType(value2 / value1);
        stack.push(dt, this.getInstructionSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------MOD----------------------------
 * -----------------------------------------------------
 */
export class Mod extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let dt = new IntegerDataType(value2 % value1);
        stack.push(dt, this.getInstructionSize());
    }
}