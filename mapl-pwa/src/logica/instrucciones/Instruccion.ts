import { Stack } from '../Stack';

export abstract class Instruccion {
	constructor(){}
	abstract execute(stack: Stack<number>);
}