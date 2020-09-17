import { StaticSymbolResolver } from '@angular/compiler';
import { Add, Sub, Mul, Div } from './instrucciones/Aritmeticas';
import { In, Out } from './instrucciones/EntradaSalida';
import { Language } from './Language';
import { Program } from './Program';

export class Parser {
    file: File;

    constructor(file: File) {
        this.file = file;
    }

    read(): Program {
        var program = new Program();
        let reader = new FileReader();
        reader.onload = (e) => {
            let content = reader.result.toString().trim();
            let lines = content.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
            lines.forEach(line => {
                switch (line.toUpperCase()) {
                    case Language.ADD:
                        program.codigo.push(new Add());
                        break;
                    case Language.SUB:
                        program.codigo.push(new Sub());
                        break;
                    case Language.DIV:
                        program.codigo.push(new Div());
                        break;
                    case Language.MUL:
                        program.codigo.push(new Mul());
                        break;
                    case Language.IN:
                        program.codigo.push(new In());
                        break;
                    case Language.OUT:
                        program.codigo.push(new Out());
                        break;
                    default:
                        console.log("No instruction found!");
                        break;
                }
            });
        }
        reader.readAsText(this.file);
        return program;
    }
}