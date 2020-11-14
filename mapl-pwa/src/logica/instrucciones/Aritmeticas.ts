import { Memory } from '../segmentoDatos/Memoria';
import { Stack } from '../segmentoDatos/Stack';
import { FloatDataType, IntegerDataType } from '../util/DataTypes';
import { InstruccionFloat, InstruccionInteger } from './Instruccion';

/**
 * -----------------------------------------------------
 * ----------------------ADD----------------------------
 * -----------------------------------------------------
 */
export class Add extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getSize()).value;
        let value2 = stack.pop(this.getSize()).value;
        let dt = new IntegerDataType(value2 + value1);
        stack.push(dt, this.getSize());
    }
}
export class Addf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getSize()).value;
        let value2 = stack.pop(this.getSize()).value;
        let dt = new FloatDataType(value2 + value1);
        stack.push(dt, this.getSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------SUB----------------------------
 * -----------------------------------------------------
 */
export class Sub extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getSize()).value;
        let value2 = stack.pop(this.getSize()).value;
        let dt = new IntegerDataType(value2 - value1);
        stack.push(dt, this.getSize());
    }
}
export class Subf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getSize()).value;
        let value2 = stack.pop(this.getSize()).value;
        let dt = new FloatDataType(value2 - value1);
        stack.push(dt, this.getSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------MUL----------------------------
 * -----------------------------------------------------
 */
export class Mul extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getSize()).value;
        let value2 = stack.pop(this.getSize()).value;
        let dt = new IntegerDataType(value2 * value1);
        stack.push(dt, this.getSize());
    }
}
export class Mulf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value1 = stack.pop(this.getSize()).value;
        let value2 = stack.pop(this.getSize()).value;
        let dt = new FloatDataType(value2 * value1);
        stack.push(dt, this.getSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------DIV----------------------------
 * -----------------------------------------------------
 */
export class Div extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let divisor = stack.pop(this.getSize()).value;
        let dividendo = stack.pop(this.getSize()).value;
        if (divisor === 0)
            throw new Error("División por 0.");

        let dt = new IntegerDataType(Math.trunc(dividendo / divisor));
        stack.push(dt, this.getSize());
    }
}
export class Divf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let divisor = stack.pop(this.getSize()).value;
        let dividendo = stack.pop(this.getSize()).value;
        if (divisor === 0)
            throw new Error("División por 0.");

        let dt = new FloatDataType(dividendo / divisor);
        stack.push(dt, this.getSize());
    }
}
/**
 * -----------------------------------------------------
 * ----------------------MOD----------------------------
 * -----------------------------------------------------
 */
export class Mod extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let divisor = stack.pop(this.getSize()).value;
        let dividendo = stack.pop(this.getSize()).value;
        if (divisor === 0)
            throw new Error("División por 0.");
            
        let dt = new IntegerDataType(dividendo % divisor);
        stack.push(dt, this.getSize());
    }
}