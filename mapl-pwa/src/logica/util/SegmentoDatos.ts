import { Observable, Subject } from 'rxjs';
import { DataType } from './DataTypes';

/**
 * Zona comun de memoria para los valores y variables de la pila y memoria, respectivamente, en la ejecucion de un
 * programa.
 * 
 * Implementado como un Singleton para facilitar el reinicio del segmento de datos al final de cada 
 * ejecucion y con la carga de un nuevo programa. La seccion de datos de la pila deberia quedar vacia (SP = 1024)
 * pero la seccion de la memoria se debe vaciar al final de la ejecucion manualmente.
 * Tiene sentido que solo haya una instancia del Segmento de datos usada indistintamente por la memoria y por la pila-
 */
export class DataSegment {
    /**
     * Instancia unica de DataSegment
     */
    private static instance: DataSegment;
    private _data: DataType[];
    /**
     * Objeto encargado de generar y emitir los eventos de actualizacion
     * del almacen de datos (esto es, la variable stack).
     * El sujeto se actualiza en todos los sitios donde se actualice el segmento de datos (add, remove y clean)
     */
    private data$: Subject<DataType[]>;

    readonly maxSize: number = 1024;
    private _actualSize: number;

    private constructor() {
        this._data = new Array<DataType>(this.maxSize);
        this.data$ = new Subject<DataType[]>();
        this.data$.next(this._data);
    }

    public static getInstance(): DataSegment {
        if (!DataSegment.instance)
            DataSegment.instance = new DataSegment();
        
        return DataSegment.instance;
    }


    /**
     * Inserta un valor en la memoria
     * @param value
     * @param address 
     */
    add(value: DataType, address: number) {
        this._actualSize += value.size;
        if (this.isFull())
            throw new Error("Overflow del segmento de datos. No se pueden insertar más bytes.");
        
        this._data[address] = value;
        this.data$.next(this._data);
    }
    /**
     * Elimina el elemento correspondiente a la direccion pasada como parametro
     * @param address
     */
    remove(address: number): DataType {
        this._actualSize -= this._data[address].size;
        let returned = this._data[address];
        delete this._data[address]; // igual que this._data[address] = undefined
        this.data$.next(this._data);
        return returned;
    }
    get(address: number): DataType {
        return this._data[address];
    }
    clean() {
        this._data = new Array<DataType>(this.maxSize);
        this.data$.next(this._data);
        this._actualSize = 0;
    }
    /**
     * No se pueden insertar mas datos cuando la suma de los tamaños de los datos ya insertados es 
     * igual o superior al tamaño maximo establecido
     */
    isFull(): boolean {
        return this._actualSize >= this.maxSize;
    }
    /**
     * Devuelve un observable con los valores del segmento de datos para el componente visual que lo muestra.
     * De esta forma, el receptor de este metodo estara pendiente de los cambios que se hagan sobre la pila
     * dinamicamente, por medio de una suscripcion.
     * Un observable es un objeto que permite observar los eventos emitidos por el subject.
     */
    data(): Observable<DataType[]> {
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