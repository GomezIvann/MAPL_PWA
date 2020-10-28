/**
 * SINGLETON: Consola con las salidas de la ejecución del programa
 */
export class Consola {
    private static instance: Consola;
    private _outputs: string[];

    /**
     * Constructor privado para evitar new Consola.
     */
    private constructor() { }

    /**
     * Metodo estatico que controla el acceso a la instancia del Singleton.
     *
     * Esta implementacion permite subclasificar la clase Singleton mientras mantiene
     * solo una instancia de cada subclase alrededor.
     */
    public static getInstance(): Consola {
        if (!Consola.instance){
            Consola.instance = new Consola();
            Consola.instance._outputs = [];
        }
        return Consola.instance;
    }
    set outputs(value: string[]) {
        this._outputs = value;
    }

    
    /**
     * Devuelve una copia de las salidas registradas por consola.
     */
    copy(): string[] {
        return this._outputs.slice();
    }
    /**
     * Añade una salida a la consola.
     * @param message salida
     */
    addOutput(message: string) {
        this._outputs.push("> " + message);
    }
    /**
     * Devuelve todas las salidas registradas por consola.
     * @param message salida
     */
    outputsAsString(): string {
        return this._outputs.join("\n");
    }
    /**
     * Limpia la consola.
     */
    clean() {
        this._outputs = [];
    }
}