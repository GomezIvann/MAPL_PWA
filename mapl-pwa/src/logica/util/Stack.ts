import { DataType } from './DataTypes';

/**
 * Pila del programa donde se almacenan los datos de las instrucciones
 */
export class Stack {
    private stack: DataType[];
    private pointer: number;
    private readonly maxSize: number = 1024;
    private actualSize: number;

    public constructor() {
        this.pointer = 0;
        this.actualSize = 0;
        this.stack = [];
    }

    public isEmpty(): boolean {
        return this.pointer === 0;
    }

    public isFull(): boolean {
        return this.actualSize === this.maxSize;
    }

    /**
     * El tamaño actual de la pila aumenta en cada inserción de acuerdo 
     * al tamaño del dato insertado
     * 
     * @param dt 
     * @param instructionSize 
     */
    public push(dt: DataType, instructionSize: number): void {
        this.actualSize += dt.size;

        if (this.isFull())
            throw new Error("Overflow de la pila. No se pueden insertar más bytes");
        else if (dt.size !== instructionSize)
            throw new Error("Los bytes insertados no se corresponden con el tipo de la instrucción.");

        this.stack[this.pointer++] = dt;
    }

    /**
     * El tamaño actual de la pila decrementa en cada extraccion 
     * de acuerdo al tamaño del dato extraido
     * 
     * @param instructionSize tamanio de la instruccion
     */
    public pop(instructionSize: number): DataType {
        if (this.isEmpty())
            throw new Error("No había suficientes bytes en la pila para ejecutar la instrucción.");
        else if (this.top().size > instructionSize)
            throw new Error("Los bytes retirados para la instrucción dejan en la pila los últimos bytes de valor sin retirar.");
        else if (this.top().size < instructionSize)
            throw new Error("Los bytes retirados para la instrucción son restos de un valor parcialmente retirado.");

        const retval = this.stack[--this.pointer];
        this.actualSize -= instructionSize;
        return retval;
    }

    public top(): DataType {
        if (this.isEmpty())
            throw new Error("No había suficientes bytes en la pila para ejecutar la instrucción.");

        return this.stack[this.pointer-1];
    }

    public print(): string {
        var content = "";
        for (let i = 0; i < this.pointer; ++i)
            content += `stack[${this.stack[i].size}]: ${this.stack[i].toString()}    `;
        
        return content;
    }
}