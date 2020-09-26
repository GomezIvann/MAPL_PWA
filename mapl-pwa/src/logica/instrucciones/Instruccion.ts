import { DataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';

export abstract class Instruccion {
	constructor(){}
	abstract execute(stack: Stack<DataType>);
}