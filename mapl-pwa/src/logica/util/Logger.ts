import { Observable, Subject } from 'rxjs';
import { Incidencia } from '../depurador/Incidencia';

/**
 * SINGLETON: Logger con las incidencias de la ejecucion del programa.
 */
export class Logger {
    private static instance: Logger;
    private _incidencias: Incidencia[];
    
    /**
     * Objeto encargado de generar y emitir los eventos de actualizacion.
     */
    private _data$: Subject<Incidencia[]>;

    /**
     * Constructor privado para evitar new Logger
     */
    private constructor() {
        this._data$ = new Subject<Incidencia[]>();
        this.incidencias = [];
    }

    /**
     * Metodo estatico que controla el acceso a la instancia del Singleton.
     *
     * Esta implementaciOn le permite subclasificar la clase Singleton mientras mantiene
     * solo una instancia de cada subclase alrededor.
     */
    static getInstance(): Logger {
        if (!Logger.instance)
            Logger.instance = new Logger();
        
        return Logger.instance;
    }
    get incidencias(): Incidencia[] {
        return this._incidencias.slice();
    }
    set incidencias(value: Incidencia[]) {
        this._incidencias = value;
        this._data$.next(this._incidencias);
    }

    /**
     * Devuelve un observable con los valores del segmento de datos para el componente visual que lo muestra.
     * De esta forma, el receptor de este metodo estara pendiente de los cambios que se hagan sobre la pila
     * dinamicamente, por medio de una suscripcion.
     * Un observable es un objeto que permite observar los eventos emitidos por el subject.
     */
    dataAsObservable(): Observable<Incidencia[]> {
        return this._data$.asObservable();
    }

    /**
     * Añade una indicencia al registro.
     * @param i Incidencia
     */
    addIncidencia(i: Incidencia): void {
        this._incidencias.push(i);
        this._data$.next(this._incidencias);
    }

    /**
     * @returns true si se han registrado incidencias
     */
    hasIncidencias(): boolean {
        return this._incidencias.length > 0;
    }

    /**
     * Limpia el registro de incidencias.
     */
    clean(): void {
        this.incidencias = [];
    }
}