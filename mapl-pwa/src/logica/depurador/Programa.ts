import { Grabadora } from '../instrucciones/Grabadora';
import { Instruccion, InstruccionLabel } from '../instrucciones/Instruccion';
import { CadenaInb } from '../util/CadenaInb';
import { Stack } from '../segmentoDatos/Stack';
import { Label } from './Label';
import { Linea } from './Linea';
import { Memory } from '../segmentoDatos/Memoria';
import { DataSegment } from '../segmentoDatos/SegmentoDatos';
import { Logger } from '../util/Logger';
import { EjecucionIncidencia, ParserIncidencia } from './Incidencia';

/**
 * Representa el programa asociado al archivo cargado por el usuario.
 */
export class Programa {
    codigo: Instruccion[];  // Conjunto de instrucciones que forman el programa
    texto: Linea[];         // Texto del programa

    /**
     * Segmento de datos.
     */
    pila: Stack;            // Pila del programa
    memoria: Memory;        // Memoria del programa

    /**
     * Propiedades relativas a la ejecucion.
     */
    private _ip: number;             // IP (segmento de código). Dirección de la instrucción actual
    private _finalizado: boolean;    // true -> ejecucion del programa ha finalizado, solo es reiniciable

    constructor() {
        this.codigo = [];
        this.texto = [];
        this.pila = new Stack();
        this.memoria = new Memory();
        this._ip = 0;
        this._finalizado = false;
        this.prepararEntorno();
    }
    get ip(): number {
        return this._ip;
    }
    get finalizado(): boolean {
        return this._finalizado;
    }

    /**
     * Prepara todo lo necesario para una correcta ejecucion del programa.
     */
    private prepararEntorno(): void {
        CadenaInb.getInstance().clean();    // Limpiamos la cadena comun de las instrucciones Inb
        DataSegment.getInstance().clean();  // Limpiamos el segmento de datos
    }

    /** 
     * Ejecuta todo el codigo, desde la instruccion actual hasta el final del programa (halt).
     * Condiciones para la ejecucion:
     *      - No haber finalizado.
     *      - Haber codigo disponible para ejecutar.
     */
    ejecuccionCompleta(): void {
        while (this.isEjecutable())
            this.ejecucion();
    }

    /**
     * Ejecuta la instruccion actual, determinada por el segmento de codigo (IP).
     * Condiciones para la ejecucion:
     *      - No haber finalizado.
     *      - Haber codigo disponible para ejecutar.
     */
    ejecutarSiguienteInstruccion(): void {
        if (this.isEjecutable())
            this.ejecucion();
    }

    /**
     * Ejecutar el codigo del programa hasta la instruccion especificada como parametro.
     * Si es una instruccion anterior a la actual o la actual, ejecuta el programa hasta el final, o hasta que salte 
     * una incidencia.
     * 
     * @param indice de la instruccion hasta la que ejecutar (no incluida).
     */
    ejecutarHasta(indice: number): void {
        if (this.isEjecutable()) {
            this.ejecucion();
            while (this._ip !== indice && this.isEjecutable())
                this.ejecucion();
        }
    }

    /**
     * Codigo a ejecutar por la instruccion HALT para el fin del programa.
     */
    finDeEjecucion(): void {
        if (!this.pila.isEmpty())
            throw new Error("El programa finaliza dejando valores en la pila.");

        this._finalizado = true;
        this._ip--; // -1 para que cuando finalice el programa ip quede apuntando a halt
        alert("Fin de la ejecución del programa.");
    }

    /**
     * Logica comun de los metodos ejecutar:
     *      0. Cuando el programa apunte a la instruccion inicial guardar su estado (puesto que grabamos siempre despues 
     *         de ejecutar empezamos desde ip=1, se hace necesario meterla manualmente).
     *      1. Ejecutar instruccion actual.
     *      2. Apuntar a la siguiente instruccion.
     *      3. Guardar el estado actual del programa tras la ejecucion, que representa el estado previo a la ejecucion
     *         de la siguiente instruccion.
     * Si salta un error en la ejecucion de la instruccion, añade informacion util como la linea donde se produjo.
     */
    private ejecucion(): void {
        try {
            if (this._ip === 0)
                this.codigo[this._ip].grabadoras.push(new Grabadora(this.getPila(), this._ip));

            let anteriorIp = this._ip;
            this.codigo[this._ip].execute(this.pila, this.memoria);
            this._ip++;
            this.codigo[this._ip].grabadoras.push(new Grabadora(this.getPila(), anteriorIp));
        }
        catch (err) {
            let incidencia = new EjecucionIncidencia(err.message, this.texto[this.getLineaByInstruccionActual()]);
            Logger.getInstance().addIncidencia(incidencia);
        }
    }

    /**
     * Un programa es ejecutable siempre y cuando no tenga incidencias y este finalizado.
     */
    isEjecutable(): boolean {
        return !this.hasIncidencias() && !this._finalizado && this.hasCodigo();
    }

    /**
     * Retrocede la ejecucion del programa en una instruccion. Esta accion implica:
     *      1. Apuntar a la anterior instruccion.
     *          a. Eliminando la grabadora de la instruccion actual (pop).
     *      2. Obtener la ultima grabadora de la nueva instruccion.
     *      3. Desgrabar su ultima ejecucion (sin eliminarla).
     * 
     * Se puede retroceder, como límite, hasta la primera instruccion siempre y cuando el programa no haya finalizado.
     * En caso de que el programa tenga errores de ejecucion, no se retrocede a la anterior instruccion, si no que se deshace la
     * grabacion actual (ultimo punto sin errores del programa), ya que es la actual instruccion la que provoca el error, y por tanto
     * el momento clave a analizar por el usuario.
     */
    retrocederUnaInstruccion(): void {
        if (this.hasIncidencias()) {
            let length = this.codigo[this._ip].grabadoras.length;
            let grabPrevia = this.codigo[this._ip].grabadoras[length - 1];
            this.pila = grabPrevia.desgrabar();
        }
        else if (this._ip > 0 && !this._finalizado) {
            let grabActual = this.codigo[this._ip].grabadoras.pop();
            this._ip = grabActual.anteriorIp;

            // No se saca la grabacion del listado para que, si vuelve a retroceder, se pueda obtener la anteriorIp
            let length = this.codigo[this._ip].grabadoras.length;
            let grabPrevia = this.codigo[this._ip].grabadoras[length - 1];
            this.pila = grabPrevia.desgrabar();
        }
    }

    /**
     * Retrocede la ejecucion hasta la instruccion especificada, limpiando las grabadoras de todas las instrucciones
     * comprendidas entre la actual hasta la que se retrocede.
     * 
     * Si selecciona la misma instruccion que a la que apunta actualmente IP solo se retrocedera en caso de que sea un bucle 
     * (la instruccion tiene varias grabadoras). Este caso se suele dar en instrucciones de salto. Ej. 3 Relaciones Logicas y Saltos.
     * 
     * Si selecciona la misma instruccion que a la que apunta actualmente IP solo se retrocedera en dos casos:
     *      - Es un bucle y por tanto tiene varias grabaciones (se ejecuta varias veces en el programa). 
     *        Este caso se suele dar en instrucciones de salto. Ej. 3 Relaciones Logicas y Saltos.
     *      - La instruccion actual es la causante de una incidencia, y por tanto, el momento previo al error es la ultima
     *        grabacion de esta.
     * 
     * @param indice
     */
    retrocederHasta(indice: number): void {
        if (this._ip === indice && this.codigo[indice].hasGrabadoras() && this.hasIncidencias()) {
            let length = this.codigo[this._ip].grabadoras.length;
            let grabPrevia = this.codigo[this._ip].grabadoras[length - 1];
            this.pila = grabPrevia.desgrabar();
        }
        else if (!this._finalizado && this.codigo[indice].hasGrabadoras()) {
            if (this._ip === indice) {
                if (this.codigo[indice].grabadoras.length > 1) {
                    let grabActual = this.codigo[indice].grabadoras.pop();
                    var i = grabActual.anteriorIp;
                    while (i !== indice) // Limpiamos las instrucciones entre las dos ejecuciones de una misma instruccion (bucles)
                        i = this.codigo[i].grabadoras.pop().anteriorIp;

                    this.pila = this.codigo[indice].grabadoras[this.codigo[indice].grabadoras.length - 1].desgrabar();
                }
            }
            else {
                var i = this._ip;
                while (i !== indice) // Limpiamos las grabadoras posteriores a la nueva instruccion a la que se retrocede
                    i = this.codigo[i].grabadoras.pop().anteriorIp;

                this._ip = indice;
                let length = this.codigo[this._ip].grabadoras.length;
                let grabPrevia = this.codigo[this._ip].grabadoras[length - 1];
                this.pila = grabPrevia.desgrabar();
            }
        }
    }

    /**
     * Reinicia el programa para que pueda ser ejecutado de nuevo.
     * Para reiniciar el programa bastaria con retroceder hasta antes de la ejecucion primera instruccion.
     */
    reiniciar(): void {
        this._finalizado = false;
        this.retrocederHasta(0);
    }

    /**
     * Devuelve el indice de la Linea correspondiente a la instruccion actual ejecutandose.
     * 
     * @returns index de la instruccion actual
     */
    getLineaByInstruccionActual(): number {
        return this.texto.findIndex(linea => linea.numeroInstruccion === this.codigo[this._ip].numero);
    }

    /**
     * Salta la ejecución del programa al numero de instruccion pasado como parametro.
     * Metodo usado por las instrucciones de salto.
     * 
     * @param nInstruccion
     */
    jumpTo(nInstruccion: number): void {
        this._ip = nInstruccion;
    }

    /**
     * @returns true si hay codigo para ejecutar.
     */
    hasCodigo(): boolean {
        return this.codigo.length !== 0;
    }

    /**
     * @returns true si hay incidencias registradas por el logger
     */
    hasIncidencias(): boolean {
        return Logger.getInstance().hasIncidencias();
    }

    /**
     * Devuelve una copia del objeto Pila. 
     * Explicacion del porque se hace asi esta en el fichero ManipulacionPila > Instruccion DUP.
     * @returns copia de la pila
     */
    getPila(): Stack {
        let copy: Stack = Object.assign(Object.create(Object.getPrototypeOf(this.pila)), this.pila);
        copy.allocates = this.pila.allocates.slice();
        return copy;
    }
}