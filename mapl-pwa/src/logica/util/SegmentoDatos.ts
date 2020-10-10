import { DataType, PrimitiveDataType } from './DataTypes';

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
    readonly maxSize: number = 1024;
    private actualSize: number;

    private constructor() {
        this._data = [];
    }

    public static getInstance(): DataSegment {
        if (!DataSegment.instance)
            DataSegment.instance = new DataSegment();
        
        return DataSegment.instance;
    }

    add(value: DataType, address: number) {
        this.actualSize += value.size;
        if (this.isFull())
            throw new Error("Overflow del segmento de datos. No se pueden insertar más bytes.");
        
        this._data[address] = value;
    }
    remove(address: number): DataType {
        this.actualSize -= this._data[address].size;
        let returned = this._data[address];
        delete this._data[address]; // igual que this._data[address] = undefined
        return returned;
    }
    get(address: number): DataType {
        return this._data[address];
    }

    /**
     * No se pueden insertar mas datos cuando la suma de los tamaños de los datos ya insertados es 
     * igual o superior al tamaño maximo establecido
     */
    isFull(): boolean {
        return this.actualSize >= this.maxSize;
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