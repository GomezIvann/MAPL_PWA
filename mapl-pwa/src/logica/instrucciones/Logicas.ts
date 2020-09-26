import { DataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { Instruccion } from './Instruccion';

export class And extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let res = (value1 && value2) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt);
    }
}
export class Or extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let res = (value1 || value2) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt);
    }
}
export class Not extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value = parseInt(stack.pop().value);
        let res = (!value) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt);
    }
}