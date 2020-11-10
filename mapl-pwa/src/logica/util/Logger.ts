/**
 * SINGLETON: Logger con las incidencias de la ejecucion del programa.
 */
export class Logger {
    private static instance: Logger;
    private _messages: string[];

    /**
     * Constructor privado para evitar new Logger
     */
    private constructor() {
        this._messages = ["Fallo"];
    }

    /**
     * Metodo estatico que controla el acceso a la instancia del Singleton.
     *
     * Esta implementaciOn le permite subclasificar la clase Singleton mientras mantiene
     * solo una instancia de cada subclase alrededor.
     */
    public static getInstance(): Logger {
        if (!Logger.instance)
            Logger.instance = new Logger();
        
        return Logger.instance;
    }
    
    get messages(): string[] {
        return this._messages;
    }
    set messages(value: string[]) {
        this._messages = value;
    }

    /**
     * Añade una indicencia al registro.
     * @param message error
     */
    addMessage(message: string) {
        this._messages.push(message);
    }
}