import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IntegerDataType, PrimitiveDataType } from './DataTypes';
import { AbstractDataSegmentZone, DataSegment } from './SegmentoDatos';

/**
 * Pila del programa donde se almacenan los datos necesarios para la ejecucion del programa.
 * SOLO TRABAJA CON TIPOS PRIMITIVOS (PrimitiveDataType).
 */
export class Stack extends AbstractDataSegmentZone {
    /**
     * SP (segmento de datos). Puntero a la cima de la pila.
     */
    private _sp: number;
    /**
     * BP (segmento de datos). Direccion del stack frame (direccion de retorno y antiguo BP) de la funcion actual.
     */
    private _bp: number;

    constructor() {
        super();
        this._sp = this.dataSegment.SIZE;
        this._bp = this.dataSegment.SIZE;
    }

    /**
     * Cuando el puntero de la pila esté abajo del todo del segmento de datos,
     * la pila esta vacia
     */
    isEmpty(): boolean {
        return this._sp === this.dataSegment.SIZE;
    }

    /**
     * El puntero a la cima de la pila (SP) aumenta en cada inserción de acuerdo 
     * al tamaño del dato insertado.
     * 
     * @param pdt PrimitiveDataType
     * @param instructionSize 
     */
    push(pdt: PrimitiveDataType, instructionSize: number): void {
        if (pdt.size !== instructionSize)
            throw new Error("Los bytes insertados no se corresponden con el tipo de la instrucción.");

        this._sp -= pdt.size;
        this.dataSegment.add(pdt, this._sp);
    }

    /**
     * El puntero a la cima de la pila (SP) decrementa en cada extraccion 
     * de acuerdo al tamaño del dato extraido.
     * 
     * @param instructionSize tamaño de la instruccion
     * @returns PrimitiveDataType
     */
    pop(instructionSize: number): PrimitiveDataType {
        if (this.top().size > instructionSize)
            throw new Error("Los bytes retirados para la instrucción dejan en la pila los últimos bytes de valor sin retirar.");
        else if (this.top().size < instructionSize)
            throw new Error("Los bytes retirados para la instrucción son restos de un valor parcialmente retirado.");

        let removedValue = this.dataSegment.remove(this._sp) as PrimitiveDataType;
        this._sp += removedValue.size;
        return removedValue;
    }
    /**
     * Devuelve el dato ubicado la cima de la pila, sin sacarlo de esta.
     * 
     * @returns PrimitiveDataType
     */
    top(): PrimitiveDataType {
        if (this.isEmpty())
            throw new Error("No había suficientes bytes en la pila para ejecutar la instrucción.");

        return this.dataSegment.get(this._sp)[0] as PrimitiveDataType;
    }
    /**
     * Reinicia el puntero de la pila (para recargar() en Programa).
     */
    restaurar(): void {
        this._sp = this.dataSegment.SIZE;
    }
    getSP(): number {
        return this._sp;
    }
    getBP(): number {
        return this._bp;
    }
    pushBP(sf: StackFrame): void {
        this.push(sf.returnDir, sf.returnDir.size);
        this.push(sf.lastBP, sf.lastBP.size);
        this._bp = this._sp;
    }
    popBP(instructionSize: number): number {
        this._sp = this._bp;
        this._bp = this.pop(instructionSize).value;
        let returnDir = this.pop(instructionSize).value;
        return returnDir;
    }
}

/**
 * Stack frame: dirección de retorno y antiguo BP de una funcion.
 */
export class StackFrame {
    returnDir: IntegerDataType;
    lastBP: IntegerDataType;
    
    constructor(returnDir: IntegerDataType, lastBP: IntegerDataType) {
        this.returnDir = returnDir;
        this.lastBP = lastBP;
    }
}