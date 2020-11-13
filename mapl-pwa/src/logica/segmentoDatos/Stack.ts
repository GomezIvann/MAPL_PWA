import { IntegerDataType, ParametroVariable, PrimitiveDataType, VariableDataType } from '../util/DataTypes';
import { AbstractDataSegmentZone } from './SegmentoDatos';

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
    /**
     * Listado que contiene la dir de comienzo y la dir de fin de cada una de las zonas de variables locales de
     * las funciones de un programa.
     */
    allocates: [number, number][];

    constructor() {
        super();
        this._sp = this.dataSegment.SIZE;
        this._bp = this.dataSegment.SIZE;
        this.allocates = [];
    }

    /**
     * Cuando el puntero de la pila esté abajo del todo del segmento de datos,
     * la pila esta vacia.
     */
    isEmpty(): boolean {
        return this.getSize() === 0;
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
        if (this.getSize() < instructionSize)
            throw new Error("No había suficientes bytes en la pila para ejecutar la instrucción.");
        else if (this.top().size > instructionSize)
            throw new Error("Los bytes retirados para la instrucción dejan en la pila los últimos bytes del valor sin retirar.");
        else if (this.top().size < instructionSize)
            throw new Error("Los bytes retirados para la instrucción no corresponden a un único valor.");

        let removedValue = this.dataSegment.remove(this._sp) as PrimitiveDataType;
        this._sp += removedValue.size;
        return removedValue;
    }

    /**
     * Devuelve el dato ubicado la cima de la pila, sin sacarlo de esta.
     * Lanza error si:
     *      - La pila esta vacia.
     *      - La cima de la pila esta vacia (variables locales sin inicializar).
     *      - En la cima de la pila hay una variable (variables locales 
     *        o variable almacenada en algun punto de cruce pila-memoria).
     * 
     * @returns PrimitiveDataType
     */
    top(): PrimitiveDataType {
        if (this.isEmpty())
            throw new Error("No había suficientes bytes en la pila para ejecutar la instrucción.");
        else if (this.dataSegment.get(this._sp) === undefined || this.dataSegment.get(this._sp)[0] instanceof VariableDataType)
            throw new Error("Los bytes retirados no son del tipo esperado.");

        return this.dataSegment.get(this._sp)[0] as PrimitiveDataType;
    }

    /**
     * Reinicia el puntero de la pila (para recargar() en Programa).
     */
    restaurar(): void {
        this._sp = this.dataSegment.SIZE;
    }

    /**
     * @returns registro SP
     */
    getSP(): number {
        return this._sp;
    }

    /**
     * @returns registro BP
     */
    getBP(): number {
        return this._bp;
    }

    /**
     * @returns number tamaño total de los datos almacenados en la pila.
     */
    getSize(): number {
        return this.dataSegment.SIZE - this._sp;
    }

    /**
     * Introduce en memoria el StackFrame de una funcion.
     * @param sf 
     */
    pushStackFrame(sf: StackFrame): void {
        this.push(sf.returnDir, sf.returnDir.size);
        this.push(sf.lastBP, sf.lastBP.size);
        this._bp = this._sp;
    }

    /**
     * Extrae de la pila el stack frame de la funcion, actualiza el registro BP y devuelve la direccion de retorno de la funcion.
     * @param instructionSize ENTERO
     */
    popStackFrame(instructionSize: number): number {
        this._sp = this._bp;
        this._bp = this.pop(instructionSize).value;
        let returnDir = this.pop(instructionSize).value;
        return returnDir;
    }

    /**
     * Reserva una zona de la pila para las variables locales de una funcion (ENTER <cte>)
     * @param cte sumatorio del tamaño de las variables locales de la funcion
     */
    allocateLocalVariables(cte: number): void {
        this._sp -= cte;
        this.allocates.push([this._sp, this._sp + cte]);
    }

    /**
     * Elimina la zona de la pila reservada por la funcion para las variables locales (ENTER <cte> === RET <cte1>, ..., ...)
     * @param cte sumatorio del tamaño de las variables locales de la funcion
     */
    eraseLocalVariables(cte: number): void {
        this.dataSegment.deleteDataZone(this._sp, cte);
        this._sp += cte;
        this.allocates.pop();
    }

    /**
     * Usado por CALL para convertir los valores almacenados en la cima de la pila en parametros para la funcion, 
     * de acuerdo al valor de cte3.
     * 
     * @param pdt PrimitiveDataType
     * @param instructionSize 
     */
    allocateParameters(sizeParams: number): void {
        let cte3 = sizeParams;
        let pdt: PrimitiveDataType;
        let parametros: ParametroVariable[] = [];

        while (cte3 !== 0) {
            if (cte3 < 0)
                throw new Error("Se esperaban en la cima de la pila " + sizeParams + " bytes." +
                    "Sin embargo, ese valor no retira de la pila valores completos.");

            pdt = this.pop(this.top().size); // Sacamos el valor en la cima
            parametros.push(new ParametroVariable("Param", pdt, pdt.size)); // lo convertimos a parametro
            cte3 -= pdt.size;
        }

        // Insertamos de nuevo los parametros (OJO, hay que conservar el orden inicial)
        let i = 1;
        parametros.reverse().forEach(p => {
            this._sp -= p.size;
            p.name += i;
            this.dataSegment.add(p, this._sp);
            i++;
        });
    }

    /**
     * Elimina la zona de la pila reservada por la funcion para los parametros de esta (RET ..., ..., <cte3>).
     * @param cte 
     */
    eraseParameters(cte: number): void {
        this.dataSegment.deleteDataZone(this._sp, cte);
        this._sp += cte;
    }

    /**
     * @param address 
     * @returns true si la address pasada como parametro esta contenida en una zona de variables locales.
     */
    isLocalVariablesAddress(address: number): boolean {
        return this.allocates.find(tuple => address >= tuple[0] && address <= tuple[1]) !== undefined;
    }
    
    /**
     * @param address 
     * @returns true si la address pasada como parametro coincide con alguna de las dir de fin de alguna 
     *          zona de variables locales.
     */
    isLocalVariablesEndAddress(address: number): boolean {
        return this.allocates.find(tuple => address === tuple[0]) !== undefined;
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