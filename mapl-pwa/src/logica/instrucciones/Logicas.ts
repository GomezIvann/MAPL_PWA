import { IntegerDataType } from '../util/DataTypes';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { InstruccionInteger } from './Instruccion';

/**
 * -----------------------------------------------------
 * ----------------------AND----------------------------
 * -----------------------------------------------------
 */
export class And extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let res = (value1 && value2) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------OR-----------------------------
 * -----------------------------------------------------
 */
export class Or extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getInstructionSize()).value;
        let value2 = stack.pop(this.getInstructionSize()).value;
        let res = (value1 || value2) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------NOT----------------------------
 * -----------------------------------------------------
 */
export class Not extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getInstructionSize()).value;
        let res = (!value) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}