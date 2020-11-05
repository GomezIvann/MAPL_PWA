/**
 * SINGLETON: Consola con las salidas de la ejecución del programa
 */
export class Consola {
    private static instance: Consola;
    private _outputs: string[];

    /**
     * Constructor privado para evitar new Consola.
     */
    private constructor() {
        this._outputs = [];
    }

    /**
     * Metodo estatico que controla el acceso a la instancia del Singleton.
     *
     * Esta implementacion permite subclasificar la clase Singleton mientras mantiene
     * solo una instancia de cada subclase alrededor.
     */
    public static getInstance(): Consola {
        if (!Consola.instance)
            Consola.instance = new Consola();
        
        return Consola.instance;
    }
    set outputs(value: string[]) {
        this._outputs = value;
    }
    get outputs(): string[] {
        return this._outputs.slice();
    }

    /**
     * Añade una nueva salida a la consola.
     * @param message salida
     */
    addOutput(message: string) {
        this._outputs.push(message);
    }
    /**
     * Añade a la consola una nueva salida y un salto de linea.
     * @param message salida
     */
    addOutputAndNewLine(message: string) {
        if (!this._outputs[this._outputs.length-1].endsWith("\n"))
            this._outputs.push("\n>"+message+"\n");
        else
            this._outputs.push(">"+message+"\n");
    }
    /**
     * Añade el nombre del fichero leido.
     * @param message 
     */
    addNewFileOutput(message: string) {
        this._outputs.push("c:\\>"+message+"\n");
    }
    /**
     * Devuelve todas las salidas registradas por consola.
     * @param message salida
     */
    outputsAsString(): string {
        return this._outputs.join("");
    }
    /**
     * Limpia la consola para un nuevo programa.
     */
    clean() {
        this._outputs = [];
    }
    /**
     * Limpia la consola para una nueva ejecucion del programa.
     * Esto es, vaciar todo menos el nombre del archivo
     */
    reiniciar() {
        let file = this._outputs[0];
        this._outputs = [file];
    }
}