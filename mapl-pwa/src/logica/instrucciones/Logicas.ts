import { Stack } from '../Stack';
import { Instruccion } from './Instruccion';

export class And extends Instruccion {
    execute(stack: Stack<number>) {
        let value1 = stack.pop();
        let value2 = stack.pop();
        let op = value1 && value2;
        let res = op ? 1 : 0;
        stack.push(res);
    }
}
export class Or extends Instruccion {
    execute(stack: Stack<number>) {
        let value1 = stack.pop();
        let value2 = stack.pop();
        let op = value1 || value2;
        let res = op ? 1 : 0;
        stack.push(res);
    }
}
export class Not extends Instruccion {
    execute(stack: Stack<number>) {
        let value = stack.pop();
        let res = (!value) ? 1 : 0;
        stack.push(res);
    }
}