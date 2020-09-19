import { Stack } from '../Stack';
import { Instruccion } from './Instruccion';

export class Push extends Instruccion {
    cte: number;

    constructor (cte: number){ 
        super();
        this.cte = cte;
    }
    execute(stack: Stack<number>) {
        stack.push(this.cte);
    }
}
export class Load extends Instruccion {
    execute(stack: Stack<number>, param?: number) {
    }
}
export class Store extends Instruccion {
    execute(stack: Stack<number>, param?: number) {
    }
}
export class Pop extends Instruccion {
    execute(stack: Stack<number>, param?: number) {
    }
}
export class Dup extends Instruccion {
    execute(stack: Stack<number>, param?: number) {
    }
}