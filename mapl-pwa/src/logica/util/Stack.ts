import { PrimitiveDataType } from './DataTypes';
import { AbstractDataSegmentZone, DataSegment } from './SegmentoDatos';

/**
 * Pila del programa donde se almacenan los datos necesarios para la ejecucion del programa.
 * SOLO TRABAJA CON TIPOS PRIMITIVOS (PrimitiveDataTypes)
 */
export class Stack extends AbstractDataSegmentZone {

    /**
     * SP (segmento de datos). Puntero a la cima de la pila.
     */
    private sp: number;

    public constructor() {
        super();
        this.sp = this.dataSegment.maxSize;
    }

    /**
     * Cuando el puntero de la pila esté abajo del todo del segmento de datos,
     * la pila esta vacia
     */
    isEmpty(): boolean {
        return this.sp == this.dataSegment.maxSize; 
    }

    /**
     * El puntero a la cima de la pila (SP) aumenta en cada inserción de acuerdo 
     * al tamaño del dato insertado.
     * 
     * @param dt 
     * @param instructionSize 
     */
    push(dt: PrimitiveDataType, instructionSize: number): void {
        if (dt.size !== instructionSize)
            throw new Error("Los bytes insertados no se corresponden con el tipo de la instrucción.");

        this.dataSegment.add(dt, this.sp);
        this.sp += dt.size; // Incrementamos el puntero de la pila.
    }

    /**
     * El puntero a la cima de la pila (SP) decrementa en cada extraccion 
     * de acuerdo al tamaño del dato extraido.
     * 
     * @param instructionSize tamaño de la instruccion
     * @returns DataType que expulsa
     */
    pop(instructionSize: number): PrimitiveDataType {
        if (this.isEmpty())
            throw new Error("No había suficientes bytes en la pila para ejecutar la instrucción.");
        else if (this.top().size > instructionSize)
            throw new Error("Los bytes retirados para la instrucción dejan en la pila los últimos bytes de valor sin retirar.");
        else if (this.top().size < instructionSize)
            throw new Error("Los bytes retirados para la instrucción son restos de un valor parcialmente retirado.");

        return this.dataSegment.remove(this.sp) as PrimitiveDataType;
    }

    /**
     * Devuelve el valor de la cima de la pila.
     * 
     * @returns DataType
     */
    top(): PrimitiveDataType {
        if (this.isEmpty())
            throw new Error("No había suficientes bytes en la pila para ejecutar la instrucción.");

        return this.dataSegment.get(this.sp) as PrimitiveDataType;
    }
}