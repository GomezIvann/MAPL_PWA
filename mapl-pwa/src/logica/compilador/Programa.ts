import { Grabadora } from '../instrucciones/Grabadora';
import { Instruccion, InstruccionLabel } from '../instrucciones/Instruccion';
import { CadenaInb } from '../util/CadenaInb';
import { Stack } from '../segmentoDatos/Stack';
import { Consola } from './Consola';
import { Label } from './Label';
import { Linea } from './Linea';
import { Memory } from '../segmentoDatos/Memoria';
import { DataSegment } from '../segmentoDatos/SegmentoDatos';

/**
 * Representa el programa asociado al archivo cargado por el usuario.
 */
export class Programa {
    codigo: Instruccion[];  // Conjunto de instrucciones que forman el programa
    labels: Label[];        // Etiquetas del programa
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
    private _finalizado: boolean;    // true -> ejecucion del programa ha finalizado

    constructor() {
        this.codigo = [];
        this.labels = [];
        this.texto = [];
        this.pila = new Stack();
        this.memoria = new Memory();
        CadenaInb.getInstance().clean();    // Limpiamos la cadena comun de las instrucciones Inb.
        DataSegment.getInstance().clean();  // Limpiamos el segmento de datos.
        this._ip = 0;
        this._finalizado = false;
    }
    get ip(): number {
        return this._ip;
    }
    get finalizado(): boolean {
        return this._finalizado;
    }


    /** 
     * Ejecuta todo el codigo, desde la instruccion actual hasta el final del programa (halt).
     * Condiciones para la ejecucion:
     *      - No haber finalizado.
     *      - Haber codigo disponible para ejecutar.
     */
    ejecuccionCompleta(): void {
        while (!this._finalizado && this.hasCodigo())
            this.ejecucion();
    }

    /**
     * Ejecuta la instruccion actual, determinada por el segmento de codigo (IP).
     * Condiciones para la ejecucion:
     *      - No haber finalizado.
     *      - Haber codigo disponible para ejecutar.
     */
    ejecutarSiguienteInstruccion(): void {
        if (!this._finalizado && this.hasCodigo())
            this.ejecucion();
    }

    /**
     * Logica comun de los metodos ejecutar:
     *      0. Cuando el programa apunte a la instruccion inicial guardar su estado (puesto que grabamos siempre despues 
     *         de ejecutar empezamos desde ip=1, se hace necesario meterla manualmente).
     *      1. Ejecutar instruccion actual.
     *      2. Apuntar a la siguiente instruccion.
     *      3. Guardar el estado actual del programa tras la ejecucion, que representa el estado previo a la ejecucion
     *         de la siguiente instruccion.
     * Si salta un error en la ejecucion de la instruccion, indica la linea donde se produjo y lo lanza de nuevo.
     */
    private ejecucion() {
        try {
            if (this._ip === 0)
                this.codigo[this._ip].grabadoras.push(new Grabadora(this.getPila(), this._ip));

            let anteriorIp = this._ip;
            this.codigo[this._ip].execute(this.pila, this.memoria);
            this._ip++;
            this.codigo[this._ip].grabadoras.push(new Grabadora(this.getPila(), anteriorIp));
        }
        catch (err) {
            throw new Error("Línea " + this.codigo[this._ip].numero + ". " + err.message);
        }
    }

    /**
     * Retrocede la ejecucion del programa en una instruccion. Esta accion implica:
     *      1. Apuntar a la anterior instruccion.
     *          a. Eliminando la grabadora de la instruccion actual (pop).
     *      2. Obtener la ultima grabadora de la nueva instruccion.
     *      3. Desgrabar su ultima ejecucion (sin eliminarla).
     * 
     * Se puede retroceder hasta la instruccion 0 y siempre y cuando el programa no haya finalizado.
     */
    retrocederUnaInstruccion(): void {
        if (this._ip > 0 && !this._finalizado) {
            let grabActual = this.codigo[this._ip].grabadoras.pop();
            this._ip = grabActual.anteriorIp;
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
     * (la instruccion tiene varias grabadoras). Este caso se suele dar en instrucciones de salto. Ej. 3 Relaciones Logicas y Saltos).
     * 
     * @param indice
     */
    retrocederHasta(linea: Linea): void {
        var indice = parseInt(linea.numeroInstruccion);
        if (!this._finalizado && linea.numeroInstruccion !== "" && this.codigo[indice].hasGrabadoras()) {

            if (this._ip === indice) {
                if (this.codigo[indice].grabadoras.length > 1) {
                    let grabActual = this.codigo[indice].grabadoras.pop();
                    var i = grabActual.anteriorIp;
                    while (i !== indice) // Limpiamos las instrucciones entre las dos ejecuciones de una misma instruccion (bucles)
                        i = this.codigo[i].grabadoras.pop().anteriorIp;

                    this.pila = this.codigo[indice].grabadoras[this.codigo[indice].grabadoras.length-1].desgrabar();
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
     * Ejecutar el codigo del programa hasta la instruccion especificada por parametro.
     * Si es una instruccion anterior a la actual, ejecuta el programa hasta el final.
     * 
     * @param indice de la instruccion hasta la que ejecutar (no incluida).
     */
    ejecutarHasta(linea: Linea): void {
        if (!this._finalizado && linea.numeroInstruccion !== "") {
            var indice = parseInt(linea.numeroInstruccion);
            this.ejecucion();
            while (this._ip !== indice && !this._finalizado)
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
     * Reinicia el programa para que pueda ser ejecutado de nuevo.
     * Reiniciar el programa implica:
     *      1. Vaciar el segmento de datos.
     *      2. Vaciar la cadena comun de las instrucciones Inb.
     *      3. Limpiar la consola (menos el nombre del fichero).
     *      4. Reubicar el puntero de la pila al fondo del segmento de datos.
     *      5. Apuntar a la primera instruccion.
     *      6. Desmarcar el programa como finalizado (vuelve a ser ejecutable).
     */
    reiniciar(): void {
        CadenaInb.getInstance().clean();
        DataSegment.getInstance().clean();
        Consola.getInstance().reiniciar();
        this.pila.restaurar();
        this._ip = 0;
        this._finalizado = false;
        this.codigo.forEach(i => i.limpiarGrabadoras());
    }

    /**
     * Busca una etiqueta por el nombre.
     * @param nombre 
     */
    getLabelByNombre(nombre: string): Label {
        return this.labels.find(label => label.nombre === nombre);
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
     * Asocia a las instrucciones que usan etiquetas el objeto asociado al nombre leido por el parser.
     * Este metodo se llama al finalizar la lectura del fichero en el parser.
     * Controla los errores de etiquetas inexistentes referenciadas en instrucciones ya que,
     * llegados a este punto, la etiqueta deberia de existir.
     */
    labelForInstruction(): void {
        this.codigo.forEach(i => {
            if (i instanceof InstruccionLabel) {
                let nombreLabel = i as InstruccionLabel;
                let label = this.labels.find(label => label.nombre === nombreLabel.labelNombre);

                if (label === undefined)
                    throw new Error("La etiqueta '" + nombreLabel.labelNombre + "' no se ha encontrado en el fichero.");

                nombreLabel.label = label;
            }
        });
    }

    /**
     * Devuelve una copia del objeto Pila. 
     * Explicacion de que se hace en el fichero ManipulacionPila > Instruccion DUP.
     * 
     * @returns copia de la pila
     */
    getPila(): Stack {
        let copy = Object.assign(Object.create(Object.getPrototypeOf(this.pila)), this.pila);
        return copy;
    }
}