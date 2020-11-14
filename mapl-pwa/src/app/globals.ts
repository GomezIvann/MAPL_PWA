import { Injectable } from '@angular/core';

/**
 * Propiedades globales del sistema usadas en varios componentes y vistas.
 * Para su uso se ha de inyectar en el .ts del componente
 */
@Injectable({ providedIn: 'root' })
export class Globals {
    // Tiempo que tarda en mostrar los tooltip MAPL.
    toolTipDelay: number = 500;
}