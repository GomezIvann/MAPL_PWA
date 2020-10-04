import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DataType } from '../instrucciones/DataTypes';

/**
 * Pila del programa donde se almacenan los datos necesarios para la ejecucion del programa.
 */
export class Stack {
    private stack: DataType[];

    /**
     * Objeto encargado de generar y emitir los eventos de actualización
     * del almacén de datos (esto es, la variable stack).
     * El sujeto se actualiza en todos los sitios donde se actualice la pila (push y pop)
     */
    private stack$: Subject<DataType[]>; 

    /**
     * Tamaño actual ocupado por los valores insertados en la pila.
     * Ej. Si tenemos un entero y un real, actualSize = 6;
     */
    private actualSize: number;
    private readonly maxSize: number = 1024;

    public constructor() {
        this.stack$ = new Subject<DataType[]>(); 
        this.actualSize = 0;
        this.stack = [];
    }

    /**
     * Devuelve un observable con los valores de la pila para el componente pila.component.
     * De esta forma, el receptor de este metodo estara pendiente de los cambios que se hagan sobre la pila
     * dinamicamente, por medio de una suscripcion.
     * Un observable es un objeto que permite observar los eventos emitidos por el subject.
     */
    public values(): Observable<DataType[]> {
        return this.stack$.asObservable();
    }

    public isEmpty(): boolean {
        return this.stack.length === 0; // equivalente a this.actualSize === 0;
    }

    public isFull(): boolean {
        return this.actualSize === this.maxSize;
    }

    /**
     * SP (segmento de datos). DirecciOn de la cima de la pila.
     */
    public getSPPosition(): number {
        return this.maxSize - this.actualSize;
    }

    /**
     * El tamaño actual de la pila aumenta en cada inserción de acuerdo 
     * al tamaño del dato insertado.
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

        dt.position = this.getSPPosition(); // Guardamos su posicion en la pila.
        this.stack.push(dt);
        this.stack$.next(this.stack);       // Actualizamos el sujeto.
    }

    /**
     * El tamaño actual de la pila decrementa en cada extraccion 
     * de acuerdo al tamaño del dato extraido.
     * 
     * @param instructionSize tamaño de la instruccion
     * @returns DataType que expulsa
     */
    public pop(instructionSize: number): DataType {
        if (this.isEmpty())
            throw new Error("No había suficientes bytes en la pila para ejecutar la instrucción.");
        else if (this.top().size > instructionSize)
            throw new Error("Los bytes retirados para la instrucción dejan en la pila los últimos bytes de valor sin retirar.");
        else if (this.top().size < instructionSize)
            throw new Error("Los bytes retirados para la instrucción son restos de un valor parcialmente retirado.");

        let retval = this.stack.pop();
        retval.position = 0; // Sale de la pila, su posicion es 0. Para evitar posibles problemas, aunque en el push se sobreescribiría.
        this.actualSize -= instructionSize;
        this.stack$.next(this.stack); // Actualizamos el sujeto.
        return retval;
    }

    /**
     * Devuelve el valor de la cima de la pila.
     * 
     * @returns DataType
     */
    public top(): DataType {
        if (this.isEmpty())
            throw new Error("No había suficientes bytes en la pila para ejecutar la instrucción.");

        return this.stack[this.stack.length-1];
    }

    public print(): string {
        var content = "";
        for (let i = 0; i < this.stack.length; ++i)
            content += `stack[${this.stack[i].position}]: ${this.stack[i].value}    `;
        
        return content;
    }
}