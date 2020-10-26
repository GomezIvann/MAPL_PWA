import { Observable, Subject } from 'rxjs';
import { DataType } from './DataTypes';

/**
 * Zona comun de memoria para los valores y variables de la pila y memoria, respectivamente, en la ejecucion de un
 * programa.
 * 
 * Implementado como un Singleton para facilitar el reinicio del segmento de datos al final de cada 
 * ejecucion y con la carga de un nuevo programa. La seccion de datos de la pila deberia quedar vacia (SP = 1024)
 * pero la seccion de la memoria se debe vaciar al final de la ejecucion manualmente.
 * Tiene sentido que solo haya una instancia del Segmento de datos usada indistintamente por la memoria y por la pila.
 */
export class DataSegment {
    /**
     * Instancia unica de DataSegment
     */
    private static instance: DataSegment;
    /**
     * La memoria se representara como pares de valores (array de tuplas), donde el primer valor representa el dato,
     * y el segundo determinara si la posicion de memoria esta ocupada o no por un dato previamente insertado.
     * Ejemplo:
     *      _data =   0  [new IntegerDataType(10), true]    (size = 2)
     *                1  [undefined, true]
     *                2  [new ByteDataType('a'), true]      (size = 1)
     *                3  [new FloatDataType(10), true]      (size = 4)
     *                4  [undefined, true]
     *                5  [undefined, true]
     *                6  [undefined, true]
     *                ...
     */
    private _data: [DataType, boolean][];

    /**
     * Objeto encargado de generar y emitir los eventos de actualizacion
     * del almacen de datos (esto es, la variable stack).
     * El sujeto se actualiza en todos los sitios donde se actualice el segmento de datos (add, remove y clean)
     */
    private data$: Subject<[DataType, boolean][]>;

    readonly SIZE: number = 1024;
    private _actualSize: number;

    private constructor() {
        this._data = new Array<[DataType, boolean]>(this.SIZE);
        this.data$ = new Subject<[DataType, boolean][]>();
        this.data$.next(this._data);
    }
    public static getInstance(): DataSegment {
        if (!DataSegment.instance)
            DataSegment.instance = new DataSegment();
        
        return DataSegment.instance;
    }

    /**
     * Inserta un valor en la memoria.
     * @param value
     * @param address 
     */
    add(value: DataType, address: number) {
        this._actualSize += value.size;
        if (this.isFull())
            throw new Error("Overflow del segmento de datos. No se pueden insertar más bytes.");
        
        this._data[address] = [value, true]; // Insertamos el valor
        for(let i = 1; i < value.size; i++)
            this._data[address+i] = [undefined, true]; // Marcamos como ocupadas las celdas de acuerdo a al tamaño del dato

        this.data$.next(this._data); // Actualizamos la suscripcion para la vista
    }
    /**
     * Elimina el elemento correspondiente a la direccion pasada como parametro.
     * @param address
     */
    remove(address: number): DataType {
        this._actualSize -= this._data[address][0].size;
        let returned = this._data[address];
        
        for(let i = 0; i < returned[0].size; i++)
            delete this._data[address+i]; // igual que this._data[address] = undefined
        
        this.data$.next(this._data);
        return returned[0];
    }
    get(address: number): [DataType, boolean] {
        return this._data[address];
    }
    /**
     * Limpia el segmento de datos para un posible reinicio del programa o carga de uno nuevo.
     */
    clean() {
        this._data = new Array<[DataType, boolean]>(this.SIZE);
        this.data$.next(this._data);
        this._actualSize = 0;
    }
    /**
     * No se pueden insertar mas datos cuando la suma de los tamaños de los datos ya insertados es 
     * igual o superior al tamaño maximo establecido.
     */
    isFull(): boolean {
        return this._actualSize >= this.SIZE;
    }
    /**
     * Devuelve true si el dato es insertable en la direccion de memoria pasada como parametro.
     * Para que un dato sea insertable ninguna de las posiciones que va a ocupar deben estarlo ya:
     *      1. [undefined, true] OCUPADA parcialmente
     *      2. undefined NO OCUPADA
     *      3. [new IntegerDataType(10), true] OCUPADA (posicion inicial, si coincide con address devolvemos true)
     * Sin embargo, si la direccion coincide con la posicion inicial de una variable ya almacenada, el nuevo dato debe sobreescribir
     * al antiguo, luego debe devolver true.
     * 
     * @param address 
     * @param size 
     */
    isInsertable(address: number, size: number): boolean {
        // 1º pos de nueva variable == 1º pos de una variable ya en memoria: true
        if (this._data[address] !== undefined && this._data[address][1] && this._data[address][0] !== undefined)
            return true;

        for(let i = 0; i < size; i++) {
            if (this._data[address+i] === undefined)
                continue;
            else if (this._data[address+i][1])
                return false;
        }
        return true;
    }
    /**
     * Devuelve un observable con los valores del segmento de datos para el componente visual que lo muestra.
     * De esta forma, el receptor de este metodo estara pendiente de los cambios que se hagan sobre la pila
     * dinamicamente, por medio de una suscripcion.
     * Un observable es un objeto que permite observar los eventos emitidos por el subject.
     */
    data(): Observable<[DataType, boolean][]> {
        return this.data$.asObservable();
    }
}

/**
 * Clase abstracta comun para las diferentes regiones del segmento de datos:
 *      1. Pila
 *      2. Memoria
 */
export abstract class AbstractDataSegmentZone {
    protected dataSegment: DataSegment;
	constructor() {
        this.dataSegment = DataSegment.getInstance();
    }
}