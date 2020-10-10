import { FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { InstruccionFloat, InstruccionInteger } from './Instruccion';

export class Add extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let dt = new IntegerDataType(value2 + value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Addf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let dt = new FloatDataType(value2 + value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Sub extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let dt = new IntegerDataType(value2 - value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Subf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let dt = new FloatDataType(value2 - value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Mul extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let dt = new IntegerDataType(value2 * value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Mulf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let dt = new FloatDataType(value2 - value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Div extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let dt = new IntegerDataType(Math.trunc(value2 / value1));
        stack.push(dt, this.getInstructionSize());
    }
}
export class Divf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let dt = new FloatDataType(value2 / value1);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Mod extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let dt = new IntegerDataType(value2 % value1);
        stack.push(dt, this.getInstructionSize());
    }
}