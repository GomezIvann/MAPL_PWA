import { Consola } from '../compilador/Consola';
import { CadenaInb } from '../util/CadenaInb';
import { DataType } from '../util/DataTypes';
import { Stack } from '../segmentoDatos/Stack';
import { DataSegment } from '../segmentoDatos/SegmentoDatos';
import { Logger } from '../util/Logger';
import { Incidencia } from '../compilador/Incidencia';

/**
 * Clase encargada de grabar el estado del programa antes de la ejecuccion de la instruccion a la que esta asociada.
 * Grabar el estado del programa implica almacenar una copia de:
 *      1. La pila del programa (punteros SP y BP).
 *      2. El segmento de datos.
 *      3. El valor de la cadena comun a todas las instrucciones INB hasta el momento.
 *      4. La consola con las salidas registradas hasta el momento.
 *      5. Las incidencias registradas hasta el momento.
 *      6. La anterior instruccion ejecutada (para poder deshacer ejecuciones no lineales).
 * Con esta informacion seriamos capaces de deshacer lo realizado por una instruccion.
 */
export class Grabadora {
    pila: Stack;
    data: [DataType, boolean][];
    cadenaInb: string[];
    consola: string[];
    incidencias: Incidencia[];
    anteriorIp: number;

    constructor(pila: Stack, anteriorIp: number) {
        this.pila = pila;
        this.anteriorIp = anteriorIp;

        // Siempre se guarda una copia
        this.data = DataSegment.getInstance().data;
        this.cadenaInb = CadenaInb.getInstance().value;
        this.consola = Consola.getInstance().outputs;
        this.incidencias = Logger.getInstance().incidencias;
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
        Logger.getInstance().incidencias = this.incidencias.slice();
        return this.getPila();
    }

    /**
     * La pila es un caso especial, ya que se trata de un objeto mas complejo (contiene un array).
     * Object.assign copia propiedad por propiedad y devuelve un objeto identico al original, sin ser una referencia a este.
     * Dado que dentro de la pila hay un array, este si que lo pasa como referencia, al no ser un tipo primitivo y no saber copiarlo, 
     * por lo que tendremos que realizar la copia manualmente.
     */
    private getPila(): Stack {
        let copy: Stack = Object.assign(Object.create(Object.getPrototypeOf(this.pila)), this.pila);
        copy.allocates = this.pila.allocates.slice();
        return copy;
    }
}