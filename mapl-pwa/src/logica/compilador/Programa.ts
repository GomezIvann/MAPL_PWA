import { Instruccion, InstruccionLabel } from '../instrucciones/Instruccion';
import { CadenaInb } from '../util/CadenaInb';
import { Memory } from '../util/Memoria';
import { DataSegment } from '../util/SegmentoDatos';
import { Stack } from '../util/Stack';
import { Label } from './Label';
import { Linea } from './Linea';

/**
 * Representa el programa asociado al archivo cargado por el usuario.
 */
export class Programa {
    codigo: Instruccion[];  // Conjunto de instrucciones que forman el programa.
    labels: Label[];        // Etiquetas del programa.
    texto: Linea[];         // Texto del programa.
    pila: Stack;            // Pila del programa.
    memoria: Memory;        // Memoria del programa.

    /**
     * Propiedades relativas a la ejecucion.
     */
    private ip: number;             // IP (segmento de código). Dirección de la instrucción actual.
    private finalizado: boolean;    // true -> ejecucion del programa ha finalizado.

    constructor() {
        this.codigo = [];
        this.labels = [];
        this.texto = [];
        this.pila = new Stack();
        this.memoria = new Memory();
        CadenaInb.getInstance().clean();    // Limpiamos la cadena comun de las instrucciones Inb.
        DataSegment.getInstance().clean();  // Limpiamos el segmento de datos.
        this.ip = 0;
        this.finalizado = false;
    }


    /**
     * Logica comun de los metodos ejecutar:
     *      1. Ejecutar instruccion actual.
     *      2. Apuntar a la siguiente instruccion.
     *      Si salta un error en la ejecucion de la instruccion, 
     *      indica la linea donde se produjo y lo lanza de nuevo.
     */
    private ejecucion() {
        try {
            this.codigo[this.ip].execute(this.pila, this.memoria);
            this.ip++;
        }
        catch (err) {
            throw new Error("Línea " + this.codigo[this.ip].numero + ". " + err);
        }
    }

    /** 
     * Ejecuta todo el codigo, desde la instruccion actual hasta el final del programa (halt).
     * Condiciones para la ejecucion:
     *      - No haber finalizado.
     *      - Haber codigo disponible para ejecutar.
     */
    ejecuccionCompleta(): void  {
        while (!this.finalizado && this.isCodigo())
            this.ejecucion();
    }

    /**
     * Ejecuta la instruccion actual, determinada por el segmento de codigo (IP).
     * Condiciones para la ejecucion:
     *      - No haber finalizado.
     *      - Haber codigo disponible para ejecutar.
     */
    ejecutarSiguienteInstruccion(): void  {
        if (!this.finalizado && this.isCodigo())
            this.ejecucion();
    }

    /**
     * Ejecutar el codigo del programa hasta la instruccion actual seleccionada
     * por el usuario.
     * Condiciones para la ejecucion:
     *      - La linea pulsada es posterior a la instruccion actual (IP).
     * 
     * @param linea linea limite de ejecucion (no incluida).
     */
    ejecutarHasta(linea: Linea): void {
        let indice = this.getInstruccionByLinea(linea);
        while (this.ip < indice)
            this.ejecucion();
    }

    /**
     * Devuelve el indice de la Instruccion correspondiente a la linea pasada como parametro.
     */
    private getInstruccionByLinea(linea: Linea): number {
        return this.codigo.findIndex(instruccion => instruccion.numero === linea.numeroInstruccion);
    }

    /**
     * Codigo a ejecutar por la instruccion HALT para el fin del programa.
     */
    finDeEjecucion(): void {
        if (!this.pila.isEmpty())
            throw new Error("El programa finaliza dejando valores en la pila.");
 
        this.finalizado = true;
        this.ip--; // -1 para que cuando finalice el programa ip quede apuntando a halt
        alert("Fin de la ejecución del programa.");
    }

    /**
     * Reinicia el programa para que pueda ser ejecutado de nuevo.
     * Reiniciar el programa implica:
     *      1. Vaciar el segmento de datos.
     *      2. Vaciar la cadena comun de las instrucciones Inb.
     *      3. Reubicar el puntero de la pila al fondo del segmento de datos.
     *      4. Apuntar a la primera instruccion.
     *      5. Desmarcar el programa como finalizado.
     */
    recargar(): void {
        CadenaInb.getInstance().clean();
        DataSegment.getInstance().clean();
        this.pila.restaurar();
        this.ip = 0;
        this.finalizado = false;
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
     */
    getLineaByInstruccionActual(): number {
        return this.texto.findIndex(linea => linea.numeroInstruccion === this.codigo[this.ip].numero);
    }

    /**
     * Salta la ejecución del programa al numero de instruccion pasado como parametro.
     * Metodo usado por las instrucciones de salto.
     * 
     * @param nInstruccion
     */
    jumpTo(nInstruccion: number): void {
        this.ip = nInstruccion;
    }

    /**
     * True si hay codigo para ejecutar.
     */
    private isCodigo(): boolean {
        return this.codigo.length != 0;
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
                let iLabel = i as InstruccionLabel;
                let label = this.labels.find(label => label.nombre === iLabel.labelNombre);

                if (label === undefined)
                    throw new Error("La etiqueta '"+ iLabel.labelNombre +"' no se ha encontrado en el fichero.");

                iLabel.label = this.labels.find(label => label.nombre === iLabel.labelNombre);
            }
        });
    }
}