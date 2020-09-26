import { DataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { Instruccion } from './Instruccion';

export class Gt extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let res = (value2 > value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt);
    }
}
export class Gtf extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let res = (value2 > value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt);
    }
}
export class Lt extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let res = (value2 < value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt);
    }
}
export class Ltf extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let res = (value2 < value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt);
    }
}
export class Ge extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let res = (value2 >= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt);
    }
}
export class Gef extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let res = (value2 >= value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt);
    }
}
export class Le extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let res = (value2 <= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt);
    }
}
export class Lef extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let res = (value2 <= value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt);
    }
}
export class Eq extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let res = (value2 === value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt);
    }
}
export class Eqf extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let res = (value2 === value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt);
    }
}
export class Ne extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseInt(stack.pop().value);
        let value2 = parseInt(stack.pop().value);
        let res = (value2 !== value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt);
    }
}
export class Nef extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value1 = parseFloat(stack.pop().value);
        let value2 = parseFloat(stack.pop().value);
        let res = (value2 !== value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt);
    }
}
