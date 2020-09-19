import { Stack } from '../Stack';
import { Instruccion } from './Instruccion';

export class Gt extends Instruccion {
    execute(stack: Stack<number>) {
        let value1 = stack.pop();
        let value2 = stack.pop();
        let res = (value2 > value1) ? 1 : 0;
        stack.push(res);
    }
}
export class Lt extends Instruccion {
    execute(stack: Stack<number>) {
        let value1 = stack.pop();
        let value2 = stack.pop();
        let res = (value2 < value1) ? 1 : 0;
        stack.push(res);
    }
}
export class Ge extends Instruccion {
    execute(stack: Stack<number>) {
        let value1 = stack.pop();
        let value2 = stack.pop();
        let res = (value2 >= value1) ? 1 : 0;
        stack.push(res);
    }
}
export class Le extends Instruccion {
    execute(stack: Stack<number>) {
        let value1 = stack.pop();
        let value2 = stack.pop();
        let res = (value2 <= value1) ? 1 : 0;
        stack.push(res);
    }
}
export class Eq extends Instruccion {
    execute(stack: Stack<number>) {
        let value1 = stack.pop();
        let value2 = stack.pop();
        let res = (value2 == value1) ? 1 : 0;
        stack.push(res);
    }
}
export class Ne extends Instruccion {
    execute(stack: Stack<number>) {
        let value1 = stack.pop();
        let value2 = stack.pop();
        let res = (value2 != value1) ? 1 : 0;
        stack.push(res);
    }
}
