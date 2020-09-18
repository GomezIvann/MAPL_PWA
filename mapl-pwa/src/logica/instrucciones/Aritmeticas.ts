import { Stack } from '../Stack';
import { Instruccion } from './Instruccion';

export class Add extends Instruccion {
    execute(stack: Stack<number>) {
        var value1 = stack.pop();
        var value2 = stack.pop();
        stack.push(value1 + value2);
    }
}
export class Sub extends Instruccion {
    execute(stack: Stack<number>) {
        var value1 = stack.pop();
        var value2 = stack.pop();
        stack.push(value2 - value1);
    }
}
export class Mul extends Instruccion {
    execute(stack: Stack<number>) {
        var value1 = stack.pop();
        var value2 = stack.pop();
        stack.push(value1 * value2);
    }
}
export class Div extends Instruccion {
    execute(stack: Stack<number>) {
        var value1 = stack.pop();
        var value2 = stack.pop();
        stack.push(value2 / value1);
    }
}