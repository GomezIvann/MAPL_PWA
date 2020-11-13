import { Add, Sub, Mul, Div, Addf, Subf, Mod, Divf, Mulf } from '../instrucciones/Aritmeticas';
import { Eq, Eqf, Ge, Gef, Gt, Gtf, Le, Lef, Lt, Ltf, Ne, Nef } from '../instrucciones/Comparaciones';
import { B2i, F2i, I2b, I2f } from '../instrucciones/Conversiones';
import { In, Inb, Inf, Out, Outb, Outf } from '../instrucciones/EntradaSalida';
import { And, Not, Or } from '../instrucciones/Logicas';
import { Dup, Pop, Push, Pushf, Pushb, Popb, Popf, Dupb, Dupf, Load, Loadb, Loadf, Store, Storef, Storeb, Pusha } from '../instrucciones/ManipulacionPila';
import { Halt, Nop } from '../instrucciones/Otras';
import { Jmp, Jnz, Jz } from '../instrucciones/Salto';
import { Consola } from '../compilador/Consola';
import { Label } from '../compilador/Label';
import { Lenguaje, Tipos } from '../compilador/Lenguaje';
import { Programa } from '../compilador/Programa';
import { Linea } from '../compilador/Linea';
import { Call, Enter, Ret } from '../instrucciones/Funciones';
import { Instruccion } from '../instrucciones/Instruccion';
import { PrimitiveSizes, VariableDataType } from './DataTypes';
import { Funcion } from '../compilador/Funcion';
import { ParserIncidencia } from '../compilador/Incidencia';
import { Logger } from './Logger';

/**
 * Clase encargada de la lectura del fichero y generacion del programa a partir de este.
 */
export class Parser {
    private _file: File;             // Fichero de entrada
    private _programa: Programa;     // Programa obtenido de la lectura del fichero

    private _tiposUsuario: Struct[];   // Tipos de usuario declarados durante la lectura del programa  
    private _funciones: Funcion[];     // Funciones del programa

    /**
     * Todas estas variables son para deteccion de errores de programa que puedan ayudar al usuario a formarlo correctamente, dando un mensaje de error
     * lo mas personalizado posible.
     *      _finFuncion: True si finaliza la lectura de una funcion CORRECTAMENTE (HALT, y fuera de la funcion 'init').
     *      _finInit: True si finaliza la lectura de la funcion principal 'init' CORRECTAMENTE (HALT y bien formado).
     */
    private _finFuncion: boolean;
    private _finInit: boolean;

    private _contadorInstrucciones: number;  // Contador para el numero de instruccion. Aumenta en una unidad siempre que se lea una.

    constructor(file: File) {
        this._file = file;
        this._programa = new Programa();
        this._tiposUsuario = [];
        this._funciones = [];
        this._finFuncion = true; // Inicialmente no sabemos si abran funciones o no
        this._finInit = false;   // Inicialmente estamos dentro de la funcion 'init'
        this._contadorInstrucciones = 0;

        /**
         * Se han de limpiar aqui ya que el Parser es el primero en hacer uso de estas clases, antes que el programa.
         */
        Logger.getInstance().clean();       // Limpiamos el registro de incidencias
        Consola.getInstance().clean();      // Limpiamos la consola
    }

    /**
     * Metodo que lee el programa pasado como parametro en el constructor.
     * 
     * Resolve: Es la funcion que llamaremos si queremos resolver satisfactoriamente la promesa.
     * Reject: Es la funcion que llamaremos si queremos rechazar la promesa.
     */
    read(): Promise<Programa> {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Ha habido un problema parseando el archivo de entrada."));
            };

            reader.onload = (e) => {
                let lineas = reader.result.toString().split("\n"); // Fichero divido en lineas
                let linea = "";
                let lineaSinComentarios = "";
                let palabrasLinea = [];
                let primeraPalabra = "";
                let funcionActual: Funcion;

                // LECTURA LINEA A LINEA
                for (let index = 0; index < lineas.length; index++) {
                    linea = lineas[index];
                    /**
                     * Elimina los posibles comentarios de la linea para facilitar la labor de parseo 
                     * (se siguen mostrando por pantalla, solo es interno).
                     */
                    lineaSinComentarios = linea.split("'")[0].trim();

                    /**
                     * Descompone la linea en palabras. Usa como separador cualquier tipo de espacio
                     * No funcionaria con los espacios al principio y al final, pero de eso se encarga trim()
                     * en lineaSinComentarios.
                     */
                    palabrasLinea = lineaSinComentarios.split(/\s+/);
                    primeraPalabra = palabrasLinea[0];

                    try {
                        /** 
                         * Cuando dos cases se comportan igual, como es el caso de las instrucciones XXX y XXX(I)
                         * los cases se colocan de seguido y ambas ejecutan el mismo codigo:
                         *      case XXX:
                         *      case XXX(I):
                         *          ...                     (exclusivo de Javascript)
                         */
                        switch (primeraPalabra.toUpperCase()) {
                            case Lenguaje.PUSH:
                            case Lenguaje.PUSHI:
                                this.checkParametrosLinea(palabrasLinea);
                                var cte = palabrasLinea[1];
                                this.addInstruccion(new Push(this._contadorInstrucciones, cte), linea);
                                break;
                            case Lenguaje.PUSHF:
                                this.checkParametrosLinea(palabrasLinea);
                                var cte = palabrasLinea[1];
                                this.addInstruccion(new Pushf(this._contadorInstrucciones, cte), linea);
                                break;
                            case Lenguaje.PUSHB:
                                this.checkParametrosLinea(palabrasLinea);
                                var cte = palabrasLinea[1];
                                this.addInstruccion(new Pushb(this._contadorInstrucciones, cte), linea);
                                break;
                            case Lenguaje.PUSHA:
                                this.checkParametrosLinea(palabrasLinea);
                                var cte = palabrasLinea[1];
                                this.addInstruccion(new Pusha(this._contadorInstrucciones, cte), linea);
                                break;
                            case Lenguaje.POP:
                            case Lenguaje.POPI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Pop(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.POPF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Popf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.POPB:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Popb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LOAD:
                            case Lenguaje.LOADI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Load(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LOADF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Loadf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LOADB:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Loadb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.STORE:
                            case Lenguaje.STOREI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Store(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.STOREF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Storef(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.STOREB:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Storeb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DUP:
                            case Lenguaje.DUPI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Dup(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DUPF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Dupf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DUPB:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Dupb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.ADD:
                            case Lenguaje.ADDI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Add(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.ADDF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Addf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.SUB:
                            case Lenguaje.SUBI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Sub(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.SUBF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Subf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DIV:
                            case Lenguaje.DIVI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Div(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DIVF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Divf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.MUL:
                            case Lenguaje.MULI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Mul(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.MULF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Mulf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.MOD:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Mod(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.IN:
                            case Lenguaje.INI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new In(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.INF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Inf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.INB:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Inb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.OUT:
                            case Lenguaje.OUTI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Out(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.OUTF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Outf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.OUTB:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Outb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.AND:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new And(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.OR:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Or(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.NOT:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Not(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.GT:
                            case Lenguaje.GTI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Gt(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.GTF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Gtf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LT:
                            case Lenguaje.LTI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Lt(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LTF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Ltf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.GE:
                            case Lenguaje.GEI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Ge(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.GEF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Gef(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LE:
                            case Lenguaje.LEI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Le(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LEF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Lef(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.EQ:
                            case Lenguaje.EQI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Eq(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.EQF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Eqf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.NE:
                            case Lenguaje.NEI:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Ne(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.NEF:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Nef(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.B2I:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new B2i(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.I2B:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new I2b(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.I2F:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new I2f(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.F2I:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new F2i(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.JMP:
                                this.checkParametrosLinea(palabrasLinea);
                                var label = palabrasLinea[1];
                                this.addInstruccion(new Jmp(this._contadorInstrucciones, label, this._programa), linea);
                                break;
                            case Lenguaje.JZ:
                                this.checkParametrosLinea(palabrasLinea);
                                var label = palabrasLinea[1];
                                this.addInstruccion(new Jz(this._contadorInstrucciones, label, this._programa), linea);
                                break;
                            case Lenguaje.JNZ:
                                this.checkParametrosLinea(palabrasLinea);
                                var label = palabrasLinea[1];
                                this.addInstruccion(new Jnz(this._contadorInstrucciones, label, this._programa), linea);
                                break;
                            case Lenguaje.CALL:
                                this.checkParametrosLinea(palabrasLinea);
                                var label = palabrasLinea[1];
                                this.addInstruccion(new Call(this._contadorInstrucciones, label, this._programa), linea);
                                break;
                            case Lenguaje.RET:
                                if (!this._finInit)
                                    throw new Error("La función 'init' no puede contener otra función.");

                                let params = lineaSinComentarios.replace(primeraPalabra, "").trim().split(","); // params = ['<cte1>', '<cte2>', '<cte3>']
                                let ret = new Ret(this._contadorInstrucciones, this._programa, params);
                                this.addInstruccion(ret, linea);
                                this._finFuncion = true; // Fin de la funcion actual leida
                                funcionActual.sizeParams = ret.cte3;
                                this._funciones.push(funcionActual); // La insertamos en las funciones del programa
                                break;
                            case Lenguaje.ENTER:
                                if (!this._finInit)
                                    throw new Error("La función 'init' no puede contener otra función.");

                                this.checkParametrosLinea(palabrasLinea);
                                var cte = palabrasLinea[1];
                                this.addInstruccion(new Enter(this._contadorInstrucciones, cte), linea);
                                break;
                            case Lenguaje.NOP:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Nop(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.HALT:
                                this.checkLineaSinParametros(palabrasLinea);
                                this.addInstruccion(new Halt(this._contadorInstrucciones, this._programa), linea);
                                this._finInit = true; // Fin de la funcion principal 'init'
                                break;
                            case Lenguaje.WHITE_LINE:
                                // Al hacer trim() cualquier linea vacia (por muchos espacios que la formen) se convierte en ""
                                // asi se conserva la linea vacia y se interpretan todas igual.
                                // Los comentarios tambien entran por aquí, ya que se eliminan al comienzo de la iteracion (variable 'lineaSinComentarios')
                                this._programa.texto.push(new Linea(linea));
                                break;
                            case Lenguaje.VAR:
                            case Lenguaje.DATA:
                            case Lenguaje.GLOBAL:
                                // #global a:int ---> a:int (elimina la directiva)
                                let definicion = lineaSinComentarios.replace(primeraPalabra, "").trim();

                                if (definicion.includes(":")) {
                                    let nombre = definicion.split(":")[0].trim();
                                    let tipo = definicion.split(":")[1].trim();

                                    this.definirVariableGlobal(tipo, nombre).forEach(variable => this._programa.memoria.storeGlobalVariable(variable));
                                    this._programa.texto.push(new Linea(linea));
                                }
                                else
                                    throw new Error("La declaración de la variable global está mal formada.");
                                break;
                            case Lenguaje.TYPE:
                            case Lenguaje.STRUCT:
                                // Busca el indice de la linea que contiene la primera llave de cierre del struct.
                                let end = lineas.findIndex(linea => linea.trim().split("'")[0].includes("}"));
                                if (end === -1)
                                    throw new Error("Se declara una estructura pero no se llega a cerrar nunca (falta una llave de cierre '}').");

                                let definicionStruct = lineas.slice(index, end + 1);
                                this._tiposUsuario.push(this.definirTipoUsuario(definicionStruct, primeraPalabra));
                                index = end + 1; // Saltamos la definicion de la estructura ya que ya ha sido leida.
                                break;
                            default:
                                if (this.isValidLabel(lineaSinComentarios)) { // Es una etiqueta (o de funcion o de salto)
                                    this._programa.labels.push(new Label(lineaSinComentarios, this._contadorInstrucciones));
                                    this._programa.texto.push(new Linea(linea));

                                    // Si leemos un Label fuera de la funcion principal 'init' es que es una declaracion de una
                                    // funcion. Fin de funcion pasa a ser false ya que estamos dentro de una funcion.
                                    if (this._finInit) {
                                        // NO se puede declarar una funcion dentro de otra.
                                        if (!this._finFuncion)
                                            throw new Error("No se puede declarar una función dentro de otra.");

                                        this._finFuncion = false;
                                        funcionActual = new Funcion(lineaSinComentarios); // Creamos la funcion
                                    }
                                }
                                else
                                    throw new Error("¡Ninguna intrucción o comentario legible para MAPL!.");
                        }
                    }
                    catch (err) {
                        let incidencia = new ParserIncidencia(err.message);
                        incidencia.identificador = "Línea " + (index + 1);
                        incidencia.linea = linea.trim();
                        Logger.getInstance().addIncidencia(incidencia);
                        break; // Si hay una incidencia dejamos de leer el fichero
                    }
                }

                /**
                 * Si no hay errores lexicos en las instrucciones pasamos a realizar mas comprobaciones 
                 * y finalizar la elaboracion del programa.
                 */
                if (!this._programa.hasIncidencias()) {
                    // Si no se ha leido ninguna instruccion...
                    if (!this._programa.hasCodigo()) {
                        let incidencia = new ParserIncidencia("El fichero no contiene ninguna instrucción ejecutable.");
                        Logger.getInstance().addIncidencia(incidencia);
                    }
                    else {
                        /**
                         * Si la lectura del programa finaliza sin HALT, lo añade el sistema automaticamente,
                         * siempre y cuando no haya funciones de por medio. En tal caso su ausencia es un error de formacion del usuario.
                         */
                        if (!this._finInit && this._funciones.length === 0) {
                            this.addInstruccion(new Halt(this._contadorInstrucciones, this._programa), Lenguaje.HALT.toLowerCase());
                            this._finInit = true; // Fin de la funcion principal 'init'
                        }
                        /**
                         * Si el parser lanza este error quiere decir que o la funcion principal no se cerro (falta un HALT y no se puede
                         * añadir automaticamente al haber funciones de por medio) o alguna de las funciones
                         * secundarias no se cerro (falta al menos un RET) y por tanto, la ejecución nunca finalizaria.
                         */
                        if (!this._finInit || !this._finFuncion) {
                            let incidencia = new ParserIncidencia("La ejecución del programa nunca finaliza. Esto puede deberse a la falta de un HALT o RET en la función principal 'init' o"
                                + " en otra función, respectivamente.");
                            Logger.getInstance().addIncidencia(incidencia);
                        }
                        else {
                            this._programa.labelForInstruction();
                            this.functionForCall();
                        }
                    }
                }
                resolve(this._programa);
            };
            reader.readAsText(this._file);
            Consola.getInstance().addNewFileOutput(this._file.name); // Mostramos el nombre del fichero por consola.
        });
    }

    /**
     * Comprueba que la instruccion tiene solo un parametro (PUSH (i,f,a,b), JMP, JZ, JNZ, CALL y ENTER).
     * @param lineaSinInstruccion 
     */
    private checkParametrosLinea(lineaSinInstruccion: string[]): void {
        if (lineaSinInstruccion.length > 2)
            throw new Error("Se esperaba que la instrucción tuviera un parámetro. Sin embargo, se obtuvieron más.");
    }

    /**
     * Comprueba que la instruccion no tiene parametros (Aritmeticas, Logicas, Comparaciones, E/S, Conversiones y Otras).
     * @param lineaSinInstruccion 
     */
    private checkLineaSinParametros(lineaSinInstruccion: string[]): void {
        if (lineaSinInstruccion.length > 1)
            throw new Error("Se esperaba que la instrucción no tuviera parámetros. Sin embargo, se ha leído al menos uno.");
    }

    /**
     * Asocia a las instrucciones Call su correspondiente funcion gracias a la etiqueta.
     */
    private functionForCall(): void {
        this._programa.codigo.forEach(i => {
            if (i instanceof Call) {
                let iCall = i as Call;
                let funcion = this._funciones.find(f => f.nombre === iCall.labelNombre);
                iCall.funcion = funcion;
            }
        });
    }

    /**
     * Recibe la definicion de un nuevo tipo de usuario y lo guarda para posibles declaraciones de variables de este nuevo tipo.
     * 
     * @param definicion ej. #type Persona: { sueldo:int } ESTRUCTURA COMPLETA
     * @param primeraPalabra ej. #type
     * @returns estructura resultante de la lectura
     */
    private definirTipoUsuario(definicion: string[], primeraPalabra: string): Struct {
        this.estructuraBienFormada(definicion);

        // Declaracion Struct: "#type Persona:"
        let declaracion = definicion[0].replace(primeraPalabra, "").trim(); // Elimina la directiva: "#type Persona: {" ---> "Persona: {"
        let nombreStruct = declaracion.split(":")[0].trim();
        let struct = new Struct(nombreStruct);
        this._programa.texto.push(new Linea(definicion[0]));

        // Cuerpo del struct: { ... }
        let cuerpo = definicion.join("\n").split("{")[1].replace("}", "").split("\n");
        let lineaCuerpo = "";
        for (let i = 0; i < cuerpo.length; i++) {
            lineaCuerpo = cuerpo[i].trim().split("'")[0]; // Eliminamos los comentarios para facilitar la lectura del cuerpo

            if (lineaCuerpo !== "") { // Si no es una linea vacia
                if (lineaCuerpo.includes(":")) {
                    let nombrePropiedad = lineaCuerpo.split(":")[0].trim();
                    let tipoPropiedad = lineaCuerpo.split(":")[1].trim();
                    struct.variables = [...struct.variables, ...this.definirVariableGlobal(tipoPropiedad, nombrePropiedad)]; // Destructuring assignment (mas optimo que concat)
                }
                else
                    throw new Error("La estructura '" + nombreStruct + "' contiene una propiedad (declaración de variable) mal formada: '" + lineaCuerpo + "'.");
            }
            this._programa.texto.push(new Linea(definicion[i + 1]));
        }
        return struct;
    }

    /**
     * Comprueba que la definicion de la estructura esta bien formada. En caso contrario, lanza
     * @param definicionStruct ej. #type Persona: { sueldo:int } ESTRUCTURA COMPLETA
     */
    private estructuraBienFormada(definicionStruct: string[]) {
        if (!definicionStruct[0].includes(":"))
            throw new Error("La declaración de la estructura está mal formada. Falta un ':' que separe el cuerpo del nombre de esta.");
        else if (!definicionStruct.join("\n").includes("{"))
            throw new Error("Se declara una estructura pero no se llega a abrir nunca (falta una llave de apertura '{').");
    }

    /**
     * Devuelve la variable asociada a la definicion y nombre pasados como parametro.
     * 
     * Dadas las declaraciones: a:int, array:10*char y p:Persona:
     * @param definicion int, 10*char, Persona, etc
     * @param nombre a, array, p
     */
    private definirVariableGlobal(definicion: string, nombre: string): VariableDataType[] {
        let variables = [];

        if (definicion.includes("*")) { // Es de tipo array
            let length = +definicion.split("*")[0].trim();
            let tipoArray = definicion.split("*")[1].trim();
            let struct = this._tiposUsuario.find(s => s.nombre === tipoArray);

            if (Number.isSafeInteger(length)) {
                for (let i = 0; i < length; i++) {
                    if (struct !== undefined)
                        variables = [...variables, ...struct.getVariables(nombre + "[" + i + "]")];
                    else
                        variables.push(new VariableDataType(nombre + "[" + i + "]", undefined, this.getPrimitiveDataType(tipoArray)));
                }
            }
            else
                throw new Error("No es posible determinar el tamaño del Array (este debe ser un entero).")
        }
        else {
            let struct = this._tiposUsuario.find(s => s.nombre === definicion);
            if (struct !== undefined) // Es de tipo Struct
                variables = struct.getVariables(nombre);
            else // Es de tipo primitivo
                variables.push(new VariableDataType(nombre, undefined, this.getPrimitiveDataType(definicion)));
        }
        return variables;
    }

    /**
     * Devuelve un dato primitivo vacio en funcion del tipo leido (int devuelve un IntegerDataType y viceversa).
     * @param tipo string
     */
    private getPrimitiveDataType(tipo: string): number {
        switch (tipo.toUpperCase()) {
            case Tipos.INTEGER:
                return PrimitiveSizes.INTEGER;
            case Tipos.REAL:
            case Tipos.FLOAT:
                return PrimitiveSizes.FLOAT;
            case Tipos.CHAR:
            case Tipos.BYTE:
                return PrimitiveSizes.BYTE;
            case Tipos.ADDRESS:
                return PrimitiveSizes.ADDRESS;
            default:
                throw Error("No existe en MAPL el tipo de la variable declarada '" + tipo + "'.");
        }
    }

    /**
     * Añade una instruccion al programa y aumenta el contador de instruccion.
     * @param i Instruccion
     * @param linea Linea
     */
    private addInstruccion(i: Instruccion, linea: string) {
        if (this._finInit && this._finFuncion)
            throw new Error("No puede haber una instruccion que no forme parte de una función.");

        this._programa.codigo.push(i);
        this._programa.texto.push(new Linea(linea, this._contadorInstrucciones));
        this._contadorInstrucciones++;
    }

    /**
     * True si la linea es una etiqueta y no existe ninguna con ese nombre ya en el programa.
     * @param linea 
     */
    private isValidLabel(linea: string): boolean {
        let label = this._programa.getLabelByNombre(linea);
        if (label !== undefined)
            throw new Error("Etiqueta repetida.");

        return linea.endsWith(":");
    }
}

/**
 * Clase estructura para la definicion de Tipos de Usuario
 */
export class Struct {
    private _nombre: string;
    variables: VariableDataType[];

    constructor(nombre: string) {
        this.nombre = nombre;
        this.variables = [];
    }
    get nombre(): string {
        return this._nombre;
    }
    set nombre(value: string) {
        if ((<any>Object).values(Tipos).includes(value.toUpperCase()))
            throw new Error("No se puede definir un nuevo tipo usando el nombre de un tipo predefinido.");

        this._nombre = value;
    }

    /**
     * Devuelve un array de copias con el nombre de las variables adaptado al de la variable declarada del tipo
     * de este Struct.
     * @param nombreVariable nombre de la variable de tipo Struct
     */
    getVariables(nombreVariable: string): VariableDataType[] {
        return this.variables.map(v => {
            let copy = Object.assign(Object.create(Object.getPrototypeOf(v)), v);
            copy.name = nombreVariable + "." + copy.name;
            return copy;
        });
    }
}