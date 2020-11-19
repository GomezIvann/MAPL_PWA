/**
 * SINGLETON: Consola con las salidas de la ejecución del programa
 */
export class Consola {
    private static instance: Consola;
    private _salidas: string[];

    /**
     * Constructor privado para evitar new Consola.
     */
    private constructor() {
        this._salidas = [];
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
    set salidas(value: string[]) {
        this._salidas = value;
    }
    get salidas(): string[] {
        return this._salidas.slice();
    }

    /**
     * Añade una nueva salida a la consola.
     * @param message salida
     */
    addSalida(message: string): void {
        this._salidas.push(message);
    }
    /**
     * Añade a la consola una nueva salida y un salto de linea.
     * @param message salida
     */
    addSalidaConNuevaLinea(message: string): void {
        if (this._salidas.length >= 1 && !this._salidas[this._salidas.length-1].endsWith("\n"))
            this._salidas.push("\n>"+message+"\n");
        else
            this._salidas.push(">"+message+"\n");
    }
    /**
     * Añade el nombre del fichero leido.
     * @param message 
     */
    addNewFileSalida(message: string): void {
        this._salidas.push("c:\\>"+message+"\n");
    }
    /**
     * Devuelve todas las salidas registradas por consola.
     * @param message salida
     */
    salidasAsString(): string {
        return this._salidas.join("");
    }
    /**
     * Limpia la consola para un nuevo programa.
     */
    clean(): void {
        this._salidas = [];
    }
    /**
     * Limpia la consola para una nueva ejecucion del programa.
     * Esto es, vaciar todo menos el nombre del archivo
     */
    reiniciar(): void {
        let file = this._salidas[0];
        this._salidas = [file];
    }
}