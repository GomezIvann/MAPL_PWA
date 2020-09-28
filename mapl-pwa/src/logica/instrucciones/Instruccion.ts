import { Sizes } from '../util/DataTypes';
import { Stack } from '../util/Stack';

export abstract class Instruccion {
	numero: string;
	constructor(numeroInstruccion: string){
		this.numero = numeroInstruccion;
	}
	abstract execute(stack: Stack): void;
    getInstructionSize(): number {return 0;}
}
export abstract class InstruccionFloat extends Instruccion {
	getInstructionSize(): number {
		return Sizes.FLOAT;
	}
}
export abstract class InstruccionInteger extends Instruccion {
	getInstructionSize(): number {
		return Sizes.INTEGER;
	}
}
export abstract class InstruccionByte extends Instruccion {
	getInstructionSize(): number {
		return Sizes.BYTE;
	}
}