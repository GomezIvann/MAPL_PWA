/**
 * SINGLETON: Logger con las incidencias de la ejecución del programa
 */
export class Logger {
    private static instance: Logger;
    private _messages: string[];

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
    public static getInstance(): Logger {
        if (!Logger.instance){
            Logger.instance = new Logger();
            Logger.instance._messages = [];
        }
        return Logger.instance;
    }
    addMessage(message: string) {
        this._messages.push(message);
    }
}