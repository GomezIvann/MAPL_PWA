import { Programa } from '../compilador/Programa';
import { Sizes } from './DataTypes';
import { Stack } from '../util/Stack';

export abstract class Instruccion {
	numero: string; // Numero de instruccion (mismo que en Linea, 0001, 0002, ..., 000N).
	constructor(numeroInstruccion: string){
		this.numero = numeroInstruccion;
	}

	abstract execute(stack: Stack);
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
export abstract class InstruccionLabel extends Instruccion {
	protected programa: Programa;
	/**
	 * Nombre de la etiqueta que en la ejecucion sera usado para encontrar el objeto Label correspondiente
	 */
	protected labelNombre: string;

	constructor(numeroInstruccion: string, labelNombre: string, programa: Programa){
		super(numeroInstruccion);
		this.labelNombre = labelNombre;
		this.programa = programa;
	}
}