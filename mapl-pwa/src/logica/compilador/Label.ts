/**
 * Ej. inicio: <Label>
 *      dup    <primeraInstruccion>     
 *      ...
 *      jmp inicio
 */
export class Label {
    nombre: string;
    /**
     * Numero que determina cual es la siguiente 
     * instruccion tras el Label
     */ 
    primeraInstruccion: number;

    constructor(nombre: string, primeraInstruccion: number) {
        this.nombre = nombre;

        /**
         * Ej. '0001'   push 20
         *              etiqueta:
         *     '0002'     push 2
         *                ...
         *     '000N'   halt 'N es el numero de instrucciones
         * 
         * Recibe el numero de instruccion de la primera instruccion posterior a la etiqueta, como un number, es decir,
         * suponiendo el codigo de arriba el constructor recibira el valor 2 ya que la instruccion posterior es la '0002'.
         * 
         * Pero, el valor ha de reducirse en una unidad ya que esta propiedad se asignara al puntero del programa que determina
         * la instruccion actual (propiedad ip de Programa) a ejecutarse, y que se ve modificado su valor en la ejecucion
         * de las instrucciones de salto. Despues de cada Intruccion.execute(...) se aumenta el valor de ese puntero en una unidad 
         * para apuntar a la siguiente (this.ip++;) sea cual sea la instruccion, entonces, si dejasemos el valor 2, 
         * en el ejemplo de arriba, acabaria apuntando a la instruccion '0003' y no a la '0002' como queremos, ya que su valor aumenta
         * en una unidad despues de cada execute(), de ahi el decremento en una unidad.
         */
        this.primeraInstruccion = primeraInstruccion - 1;
    }
}