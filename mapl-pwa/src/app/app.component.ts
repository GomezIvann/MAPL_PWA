import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MAPL';
  version = 'v0.0.1';

  ngOnInit(): void {
    this.soportaApiFile();
  }
  
  soportaApiFile() {
    var pTexto = "";
    var soporta = false;

    if (window.File && window.FileReader && window.FileList && window.Blob) {
      soporta = true;
      pTexto = "- Este navegador soporta API File.";
    }
    else
      pTexto = "- Este navegador no soporta API File."
        + " El programa no puede funcionar correctamente.";

    console.log(pTexto);
    return soporta;
  }
}
