import { FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { InstruccionInteger, InstruccionFloat } from './Instruccion';

export class Gt extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 > value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Gtf extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 > value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}

export class Lt extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 < value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Ltf extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 < value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}

export class Ge extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 >= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Gef extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 >= value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}

export class Le extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 <= value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Lef extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 <= value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}

export class Eq extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 === value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Eqf extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 === value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}

export class Ne extends InstruccionInteger {
    execute(stack: Stack) {
        let value1 = parseInt(stack.pop(this.getInstructionSize()).value);
        let value2 = parseInt(stack.pop(this.getInstructionSize()).value);
        let res = (value2 !== value1) ? 1 : 0;
        let dt = new IntegerDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Nef extends InstruccionFloat {
    execute(stack: Stack) {
        let value1 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let value2 = parseFloat(stack.pop(this.getInstructionSize()).value);
        let res = (value2 !== value1) ? 1 : 0;
        let dt = new FloatDataType(res);
        stack.push(dt, this.getInstructionSize());
    }
}
