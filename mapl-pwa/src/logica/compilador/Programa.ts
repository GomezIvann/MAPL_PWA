import { CadenaInb } from '../instrucciones/EntradaSalida';
import { Instruccion } from '../instrucciones/Instruccion';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { Label } from './Label';

/**
 * Representa el codigo (instrucciones) del archivo cargado por el usuario.
 */
export class Programa {
    codigo: Instruccion[]; // conjunto de instrucciones que forman el programa
    labels: Label[]; // etiquetas del programa
    texto: Linea[]; // texto del programa
    pila: Stack; // pila del programa
    memoria: Memory; // memoria del programa

    /**
     * Propiedades relativas a la Ejecucion
     */
    private ip: number; // IP (segmento de código). Dirección de la instrucción actual.
    private finalizado: boolean;

    constructor() {
        this.codigo = [];
        this.labels = [];
        this.texto = [];
        this.pila = new Stack();
        this.memoria = new Memory();
        this.ip = 0;
        this.finalizado = false;
    }

    /** 
     * Ejecuta todo el codigo, desde la instruccion actual hasta el final del programa (halt).
     */
    ejecuccionCompleta() {
        while (!this.finalizado && this.isCodigo())
            this.ejecucion();

        this.finalizado = false;
    }

    /**
     * Ejecuta la instruccion actual, determinada por el segmento de codigo (IP).
     * Condiciones para la ejecucion:
     *      - No haber finalizado.
     *      - Haber codigo disponible para ejecutar.
     */
    ejecutarSiguienteInstruccion() {
        if (!this.finalizado && this.isCodigo()){
            this.ejecucion();
            if (this.finalizado)
                this.finalizado = false;
        }
    }

    /**
     * Ejecutar el codigo del programa hasta la instruccion actual seleccionada
     * por el usuario
     * 
     * @param linea linea limite de ejecucion (no incluida)
     */
    ejecutarHasta(linea: Linea){
        let indice = this.getInstruccionByLinea(linea);
        while (this.ip < indice)
            this.ejecucion();
    }

    /**
     * Logica comun de los metodos ejecutar:
     *      1. Ejecutar instruccion actual
     *      2. Apuntar a la siguiente
     *      si salta un error, pone la linea donde se produjo y lo lanza de nuevo
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
     * True si hay codigo para ejecutar
     */
    private isCodigo(): boolean {
        return this.codigo.length != 0;
    }

    /**
     * Codigo a ejecutar por la instruccion HALT para el fin del programa.
     */
    finDeEjecucion(): void {
        if (!this.pila.isEmpty())
            throw new Error("El programa finaliza dejando valores en la pila.");

        this.ip = -1; // -1 porque despues se ejecuta ip++ (similar al problema de las instrucciones de salto)   
        this.finalizado = true;
        CadenaInb.getInstance().clean(); // Limpiamos la cadena común de las instrucciones Inb
        alert("Fin de la ejecución del programa.");
    }

    /**
     * Busca una etiqueta por el nombre
     * @param nombre 
     */
    getLabelByNombre(nombre: string): Label {
        return this.labels.find(label => label.nombre === nombre);
    }

    /**
     * Devuelve el indice de la Linea correspondiente a la instruccion actual ejecutandose
     */
    getLineaByInstruccionActual(): number {
        return this.texto.findIndex(linea => linea.numeroInstruccion === this.codigo[this.ip].numero);
    }

    /**
     * Devuelve el indice de la Instruccion correspondiente a la linea pasada como parametro
     */
    private getInstruccionByLinea(linea: Linea): number {
        return this.codigo.findIndex(instruccion => instruccion.numero === linea.numeroInstruccion);
    }

    /**
     * Salta la ejecución del programa al numero de instruccion pasado como parametro.
     * @param nInstruccion
     */
    jumpTo(nInstruccion: number) {
        this.ip = nInstruccion;
    }
}

/**
 * Representa cada linea del fichero leido.
 */
export class Linea {
    contenido: string;
    numeroInstruccion: string;

    constructor(contenido: string, numeroInstruccion = "") {
        this.contenido = contenido;
        this.numeroInstruccion = numeroInstruccion;
    }
    print(): string {
        return this.numeroInstruccion + this.contenido + "\n";
    }
}