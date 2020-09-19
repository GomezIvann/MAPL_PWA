import { Stack } from '../Stack';
import { Instruccion } from './Instruccion';

export class Push extends Instruccion {
    execute(stack: Stack<number>) {
    }
}
export class Load extends Instruccion {
    execute(stack: Stack<number>) {
    }
}
export class Store extends Instruccion {
    execute(stack: Stack<number>) {
    }
}
export class Pop extends Instruccion {
    execute(stack: Stack<number>) {
    }
}
export class Dup extends Instruccion {
    execute(stack: Stack<number>) {
        var value1 = stack.pop();
        var value2 = stack.pop();
        stack.push(value1 + value2);
    }
}