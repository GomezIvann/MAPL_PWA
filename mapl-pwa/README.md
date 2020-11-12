# Mapl-Pwa

Este proyecto ha sido generado con [Angular CLI](https://github.com/angular/angular-cli) version 10.1.0.

## Servidor de desarrollo

Ejecuta `ng serve` para un servidor de desarrollo. Se desplegará en la siguiente dirección: `http://localhost:4200/`. La aplicación se actualiza automáticamente cada vez que cambie un fichero fuente de esta.

## Build

Ejecuta `ng build --prod` para construir el proyecto. Este estará almacenado en el directorio `dist/`. Si además añades el flag `--prod` la versión construida será de producción, con la que podrás ver todas las ventajas de una PWA.

Después, ejecuta `http-server -p 8080 -c-1 dist/mapl-pwa` para poder ver la aplicación web desplegada en un servidor, pudiendo así descargarla o ver como su funcionamiento en un entorno real, como estaba pensada desde un principio. Se te proporcionarán dos URLs, solo `http://127.0.0.1:8080` es válido.

Si no tienes este comando, puedes descargarlo usando el instalador de paquetes de Node con el comando `npm install http-server -g`.
