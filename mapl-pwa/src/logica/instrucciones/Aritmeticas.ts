import { DataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { Instruccion } from './Instruccion';

export class Add extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let dt = new IntegerDataType(value2 + value1);
        stack.push(dt);
    }
}
export class Addf extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let dt = new FloatDataType(value2 + value1);
        stack.push(dt);
    }
}
export class Sub extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let dt = new IntegerDataType(value2 - value1);
        stack.push(dt);
    }
}
export class Subf extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let dt = new FloatDataType(value2 - value1);
        stack.push(dt);
    }
}
export class Mul extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let dt = new IntegerDataType(value2 * value1);
        stack.push(dt);
    }
}
export class Mulf extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let dt = new FloatDataType(value2 - value1);
        stack.push(dt);
    }
}
export class Div extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let dt = new IntegerDataType(value2 / value1);
        stack.push(dt);
    }
}
export class Divf extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let dt = new FloatDataType(value2 / value1);
        stack.push(dt);
    }
}
export class Mod extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let dt = new IntegerDataType(value2 % value1);
        stack.push(dt);
    }
}