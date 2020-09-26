import { Add, Sub, Mul, Div, Addf, Subf, Mod, Divf, Mulf } from '../instrucciones/Aritmeticas';
import { Eq, Eqf, Ge, Gef, Gt, Gtf, Le, Lef, Lt, Ltf, Ne, Nef } from '../instrucciones/Comparaciones';
import { In, Inb, Inf, Out } from '../instrucciones/EntradaSalida';
import { And, Not, Or } from '../instrucciones/Logicas';
import { Dup, Pop, Push, Pushf, Pushb, Popb, Popf } from '../instrucciones/ManipulacionPila';
import { Lenguaje } from './Lenguaje';
import { Linea, Programa } from './Programa';

export class Parser {
    file: File;

    constructor(file: File) {
        this.file = file;
    }

    /**
     * Resolve: Es la función que llamaremos si queremos resolver satisfactoriamente la promesa.
     * Reject: Es la función que llamaremos si queremos rechazar la promesa.
     */
    read(): Promise<Programa> {
        var programa = new Programa();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Problema parseando el archivo de entrada."));
            };

            reader.onload = (e) => {
                let lineas = reader.result.toString().split("\n");
                var finalBucle = false;
                var primeraPalabra = "";
                var numeroLinea = "";
                var i = 0;

                // el metodo some se comporta igual que forEach, salvo que este se puede parar su ejecucion
                // para ello basta con retornar true cuando queramos pararla
                lineas.some(linea => {
                    // Expresion regular reemplaza todo un string por "" salvo la primera palabra que encuentra
                    // trim() elimina los espacios y terminadores de linea de un string (ubicados ante y despues del texto)
                    // ej. "       hello  world       " --trim()--> "hello  world"
                    primeraPalabra = linea.trim().replace(/ .*/, "").toUpperCase();
                    numeroLinea = ("000" + i).slice(-4); // [0000, 0001, ..., 0010, ..., 0199, 9999]

                    switch (primeraPalabra) {
                        case Lenguaje.PUSH:
                        case Lenguaje.PUSHI:
                            // Divide la linea con cualquier caracter de espacio en blanco (igual a [\r\n\t\f\v])
                            var cte = linea.trim().split(/\s+/)[1];
                            programa.codigo.push(new Push(cte));
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.PUSHF:
                            var cte = linea.trim().split(/\s+/)[1];
                            programa.codigo.push(new Pushf(cte));
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.PUSHB:
                            var cte = linea.trim().split(/\s+/)[1];
                            programa.codigo.push(new Pushb(cte));
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.POP:
                        case Lenguaje.POPI:
                            programa.codigo.push(new Pop());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.POPF:
                            programa.codigo.push(new Popf());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.POPB:
                            programa.codigo.push(new Popb());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.DUP:
                        case Lenguaje.DUPI:
                        case Lenguaje.DUPF:
                        case Lenguaje.DUPB:
                            programa.codigo.push(new Dup());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.ADD:
                        case Lenguaje.ADDI:
                            programa.codigo.push(new Add());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.ADDF:
                            programa.codigo.push(new Addf());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.SUB: 
                        case Lenguaje.SUBI:
                            programa.codigo.push(new Sub());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.SUBF:
                            programa.codigo.push(new Subf());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.DIV:
                        case Lenguaje.DIVI:
                            programa.codigo.push(new Div());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.DIVF:
                            programa.codigo.push(new Divf());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.MUL:
                        case Lenguaje.MULI:
                            programa.codigo.push(new Mul());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.MULF:
                            programa.codigo.push(new Mulf());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.MOD:
                            programa.codigo.push(new Mod());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.IN: 
                        case Lenguaje.INI:
                            programa.codigo.push(new In());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.INF:
                            programa.codigo.push(new Inf());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.INB:
                            programa.codigo.push(new Inb());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.OUT:
                        case Lenguaje.OUTI:
                        case Lenguaje.OUTB:
                        case Lenguaje.OUTF:
                            programa.codigo.push(new Out());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.AND:
                            programa.codigo.push(new And());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.OR:
                            programa.codigo.push(new Or());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.NOT:
                            programa.codigo.push(new Not());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.GT:
                        case Lenguaje.GTI:
                            programa.codigo.push(new Gt());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.GTF:
                            programa.codigo.push(new Gtf());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.LT:
                        case Lenguaje.LTI:
                            programa.codigo.push(new Lt());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.LTF:
                            programa.codigo.push(new Ltf());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.GE:
                        case Lenguaje.GEI:
                            programa.codigo.push(new Ge());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.GEF:
                            programa.codigo.push(new Gef());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.LE:
                        case Lenguaje.LEI:
                            programa.codigo.push(new Le());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.LEF:
                            programa.codigo.push(new Lef());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.EQ:
                        case Lenguaje.EQI:
                            programa.codigo.push(new Eq());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.EQF:
                            programa.codigo.push(new Eqf());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.NE:
                        case Lenguaje.NEI:
                            programa.codigo.push(new Ne());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.NEF:
                            programa.codigo.push(new Nef());
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.NOP:
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.WHITE_LINE:
                            // al hacer trim() cualquier linea vacia (por muchos espacios que la formen) se convierte en ""
                            // asi se conserva la linea vacia y se interpretan todas igual
                            programa.texto.push(new Linea(linea));
                            break;
                        case Lenguaje.HALT:
                            // finaliza la ejecucion del programa (no hace falta seguir leyendo)
                            finalBucle = true;
                            programa.texto.push(new Linea(linea, numeroLinea));
                            i++;
                            break;
                        default:
                            if (!this.isComment(linea))
                                throw new Error("No instruction or comment found!\n" + linea);
                            programa.texto.push(new Linea(linea));
                    }
                    return finalBucle;
                });
                resolve(programa);
            };
            reader.readAsText(this.file);
        });
    }

    private isComment(line: string): boolean {
        return /^\'/.test(line);
    }
}