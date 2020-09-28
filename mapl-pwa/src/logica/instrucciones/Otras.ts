import { Stack } from '../util/Stack';
import { Instruccion } from './Instruccion';

export class Halt extends Instruccion {
    execute(stack: Stack) {}
}
export class Nop extends Instruccion {
    execute(stack: Stack) {}
}