/**
 * SINGLETON: Logger con las incidencias de la ejecución del programa
 */
export class Consola {
    private static instance: Consola;
    private _outputs: string[];

    /**
     * Constructor privado para evitar new CadenaInb
     */
    private constructor() { }

    /**
     * Metodo estatico que controla el acceso a la instancia del Singleton.
     *
     * Esta implementaciOn le permite subclasificar la clase Singleton mientras mantiene
     * solo una instancia de cada subclase alrededor.
     */
    public static getInstance(): Consola {
        if (!Consola.instance){
            Consola.instance = new Consola();
            Consola.instance._outputs = [];
        }
        return Consola.instance;
    }
    addOutput(message: string) {
        this._outputs.push("> " + message);
    }
    outputs(): string {
        return this._outputs.join("\n");
    }
    clean() {
        this._outputs = [];
    }
}