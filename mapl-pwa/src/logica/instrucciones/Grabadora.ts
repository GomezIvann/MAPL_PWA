import { Consola } from '../compilador/Consola';
import { CadenaInb } from '../util/CadenaInb';
import { DataType } from '../util/DataTypes';
import { Stack } from '../segmentoDatos/Stack';
import { DataSegment } from '../segmentoDatos/SegmentoDatos';

/**
 * Clase encargada de grabar el estado del programa antes de la ejecuccion de la instruccion a la que esta asociada.
 * Grabar el estado del programa implica almacenar una copia de:
 *      1. La pila del programa (punteros SP y BP).
 *      2. El segmento de datos.
 *      3. El valor de la cadena comun a todas las instrucciones INB hasta el momento.
 *      4. La consola con las salidas registradas hasta el momento.
 * Con esta informacion seriamos capaces de deshacer lo realizado por una instruccion.
 */
export class Grabadora {
    pila: Stack;
    data: [DataType, boolean][];
    cadenaInb: string[];
    consola: string[];
    anteriorIp: number

    constructor(pila: Stack, anteriorIp: number) {
        this.pila = pila;
        this.anteriorIp = anteriorIp;
        this.data = DataSegment.getInstance().copy();
        this.cadenaInb = CadenaInb.getInstance().copy();
        this.consola = Consola.getInstance().copy();
    }
    
    /**
     * Restablece los valores previos a la ejecucion de la instruccion.
     * 
     * IMPORTANTE: Se deben devolver copias para que el programa no modifique los valores de la Grabadora durante la ejecucion
     * del programa y guarde estados inconsistentes (recordar que Javascript trabaja con referencias, no con copias).
     * Sin slice() estariamos devolviendo, por ejemplo, al segmento de datos una referencia y no una copia. Si despues de
     * desgrabar se modificase el segmento de datos, tambien se modificaria en esta grabadora, lo que no queremos, 
     * ya que los valores aqui almacenados son invariables.
     */
    desgrabar(): Stack {
        DataSegment.getInstance().data = this.data.slice();
        CadenaInb.getInstance().value = this.cadenaInb.slice();
        Consola.getInstance().outputs = this.consola.slice();
        return this.getPila();
    }
    private getPila(): Stack {
        let copy = Object.assign(Object.create(Object.getPrototypeOf(this.pila)), this.pila);
        return copy;
    }
}