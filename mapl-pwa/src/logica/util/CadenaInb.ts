
/**
 * SINGLETON: Cadena comun para las instrucciones Inb (una unica instancia)
 * Se hace necesario un singleton debido a que la cadena se debe reiniciar al final de la ejecucion
 * completa del programa. Si pasasemos esta variable por referencia, como todo en TypeScript, funcionaria tambien, 
 * pero solo una iteracion, ya que en la siguiente seguirian usando las instrucciones Inb esa instancia, que podria 
 * contener un valor de la anterior ejecucion, y que para reiniciar seria mucho mas costoso que usando un singleton,
 * ya que habria que buscar todas las instrucciones Inb y pasarles una nueva referencia a un nuevo objeto CadenaInb
 */
export class CadenaInb {
    private static instance: CadenaInb;
    private _value: string[];

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
    public static getInstance(): CadenaInb {
        if (!CadenaInb.instance){
            CadenaInb.instance = new CadenaInb();
            CadenaInb.instance._value = [];
        }
        return CadenaInb.instance;
    }
    set value(value: string[]) {
        this._value = value;
    }
    get value(): string[] {
        return this._value.slice();
    }

    getChar(): string {
        return this._value.pop();
    }
    isVacia(): boolean {
        return this._value.length === 0;
    }
    clean() {
        this._value = [];
    }
}