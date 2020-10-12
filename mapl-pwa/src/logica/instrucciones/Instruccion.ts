import { Programa } from '../compilador/Programa';
import { PrimitiveSizes } from '../util/DataTypes';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';

/**
 * Representa una instruccion de codigo del programa.
 * 
 * En TypeScript las clases abstractas son tanto un contrato (concepto clasico de Interfaz, a costa de un fuerte 
 * acoplamiento entre las clases hijas y la padre) como una implementacion parcial de una clase
 * (vision tradicional de clase Abstracta). 
 */
export abstract class Instruccion {
	numero: string; // Numero de instruccion (mismo que en la clase Linea, 0001, 0002, ..., 000N).

	constructor(numeroInstruccion: string){
		this.numero = numeroInstruccion;
	}

	abstract execute(stack: Stack, memory: Memory): void;
    getInstructionSize(): number { return 0; } // Implementacion generica para Otras instrucciones (Halt y nop)
}


/**
 * Implementacion generica para instrucciones que trabajan con datos
 * de tipo entero (pop, popi, push, push, out, outi...)
 */
export abstract class InstruccionInteger extends Instruccion {
	getInstructionSize(): number {
		return PrimitiveSizes.INTEGER;
	}
}
/**
 * Implementacion generica para instrucciones que trabajan con datos
 * de tipo float (popf, pushf, outf, addf, gtf...).
 */
export abstract class InstruccionFloat extends Instruccion {
	getInstructionSize(): number {
		return PrimitiveSizes.FLOAT;
	}
}
/**
 * Implementacion generica para instrucciones que trabajan con datos
 * de tipo address (pusha cte, pusha bp...).
 */
export abstract class InstruccionAddress extends Instruccion {
	getInstructionSize(): number {
		return PrimitiveSizes.ADDRESS;
	}
}
/**
 * Implementacion generica para instrucciones que trabajan con datos
 * de tipo byte (popb, pushb, outb, inb...).
 */
export abstract class InstruccionByte extends Instruccion {
	getInstructionSize(): number {
		return PrimitiveSizes.BYTE;
	}
}
/**
 * Implementacion generica para instrucciones que trabajan con etiquetas (Label)
 * (call, jmp, jnz, jz).
 */
export abstract class InstruccionLabel extends Instruccion {
	protected programa: Programa;
	/**
	 * Nombre de la etiqueta usada durante la ejecucion para encontrar el Label. 
	 * Usamos un string en vez del propio objeto Label debido a que puede darse el caso de que la etiqueta 
	 * sea posterior a la instruccion en la lectura del fichero, haciendo imposible crear el objeto label en ese momento.
	 * Ejemplo:
	 * 			inicio:
	 *				...
	 *				jz fin	'La label <fin> es posterior a la instruccion que la necesita
	 *				...
	 *				jmp inicio
	 *
	 *			fin:
	 *				jnz inicio
	 * 
	 */
	protected labelNombre: string;

	constructor(numeroInstruccion: string, labelNombre: string, programa: Programa){
		super(numeroInstruccion);
		this.labelNombre = labelNombre;
		this.programa = programa;
	}
}