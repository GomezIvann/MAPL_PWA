import { StaticSymbolResolver } from '@angular/compiler';
import { ɵConsole } from '@angular/core';
import { Add, Sub, Mul, Div } from './instrucciones/Aritmeticas';
import { Eq, Ge, Gt, Le, Lt, Ne } from './instrucciones/Comparaciones';
import { In, Out } from './instrucciones/EntradaSalida';
import { And, Not, Or } from './instrucciones/Logicas';
import { Dup, Pop, Push } from './instrucciones/ManipulacionPila';
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
                lineas.some(line => {
                    // Expresion regular reemplaza todo un string por "" salvo la primera palabra que encuentra
                    // trim() elimina los espacios y terminadores de linea de un string
                    primeraPalabra = line.replace(/ .*/, "").trim().toUpperCase();
                    numeroLinea = ("000" + i).slice(-4); // [0000, 0001, ..., 0010, ..., 0199, 9999]

                    switch (primeraPalabra) {
                        case Lenguaje.PUSH:
                            var cte = line.replace(/^\D+/g, "");
                            programa.codigo.push(new Push(parseInt(cte)));
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.POP:
                            programa.codigo.push(new Pop());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.DUP:
                            programa.codigo.push(new Dup());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.ADD:
                            programa.codigo.push(new Add());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.SUB:
                            programa.codigo.push(new Sub());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.DIV:
                            programa.codigo.push(new Div());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.MUL:
                            programa.codigo.push(new Mul());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.IN:
                            programa.codigo.push(new In());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.OUT:
                            programa.codigo.push(new Out());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.AND:
                            programa.codigo.push(new And());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.OR:
                            programa.codigo.push(new Or());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.NOT:
                            programa.codigo.push(new Not());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.GT:
                            programa.codigo.push(new Gt());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.LT:
                            programa.codigo.push(new Lt());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.GE:
                            programa.codigo.push(new Ge());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.LE:
                            programa.codigo.push(new Le());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.EQ:
                            programa.codigo.push(new Eq());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.NE:
                            programa.codigo.push(new Ne());
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.NOP:
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        case Lenguaje.WHITE_LINE:
                            // al hacer trim() cualquier linea vacia (por muchos espacios que la formen) se convierte en ""
                            // asi se conserva la linea vacia y se interpretan todas igual
                            programa.texto.push(new Linea(line));
                            break;
                        case Lenguaje.HALT:
                            // finaliza la ejecucion del programa (no hace falta seguir leyendo)
                            finalBucle = true;
                            programa.texto.push(new Linea(line, numeroLinea));
                            i++;
                            break;
                        default:
                            if (!this.isComment(line))
                                throw new Error("No instruction or comment found!\n" + line);
                            programa.texto.push(new Linea(line));
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