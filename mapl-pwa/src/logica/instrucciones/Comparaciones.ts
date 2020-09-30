import { FloatDataType, IntegerDataType, Sizes } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { InstruccionInteger, InstruccionFloat } from './Instruccion';

/**
 * Independientemente del tipo de datos que se comparen (integer o float)
 * en la pila siempre dejan un entero
 */
export class Gt extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 > value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}
export class Gtf extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 > value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}

export class Lt extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 < value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}
export class Ltf extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 < value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}

export class Ge extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 >= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}
export class Gef extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 >= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}

export class Le extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 <= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}
export class Lef extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 <= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}

export class Eq extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 === value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}
export class Eqf extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 === value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}

export class Ne extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 !== value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}
export class Nef extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 !== value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, Sizes.INTEGER);
    }
}
