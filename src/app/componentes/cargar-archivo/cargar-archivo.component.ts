import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglemapsService } from 'src/app/servicios';

@Component({
  selector: 'app-cargar-archivo',
  templateUrl: './cargar-archivo.component.html',
  styleUrls: ['./cargar-archivo.component.css']
})
export class CargarArchivoComponent implements OnInit {

  @ViewChild('inputFile') inputFile;
  archivo: any;
  nombreArchivo = 'Archivo no seleccionado...';
  info: any;
  constructor(
    private googlemapsService: GooglemapsService
  ) { }

  ngOnInit() {
  }

  leerArchivo(event: any) {
    if (!event.target.files) {
      alert('No se ha seleccionado archivo');
    }

    const ArchivosPermitidos = ['text/plain'];
    this.archivo = event.target.files[0];
    this.nombreArchivo = this.archivo.name;

    if (ArchivosPermitidos.indexOf(this.archivo.type) === -1) {
      alert('El tipo de archivo no es permitido');
      this.nombreArchivo = 'Archivo no seleccionado...';
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const lineas = e.target.result.split('\n');
      this.setLocalStorage(lineas);
    };

    reader.readAsText(this.archivo);

  }

  setLocalStorage(arrayLineas: any[]) {
    localStorage.setItem('coordenadas', JSON.stringify(arrayLineas));
    this.obtenerDatosApi();
  }

  cleanLocalStorage() {
    localStorage.removeItem('coordenadas');
  }

  getDataLocalStorage() {
     return JSON.parse(localStorage.getItem('coordenadas'));
  }

  obtenerDatosApi() {
    const data = this.getDataLocalStorage();
    if (Array.isArray(data)) {
      let valorLinea: any[];

      const origen = data[1].split('\t')[0];
      let destinos = '';

      data.forEach((linea, indice) => {
        valorLinea = linea.split('\t');

        if (indice > 0) {
            destinos += valorLinea[1] + '|';
        }
      });

      destinos = destinos.substring(0, (destinos.length - 1));
      this.googlemapsService.getData(origen, destinos)
        .subscribe((coordenadas: any) => {
          console.log(coordenadas);
        }, (err: any) => {
          console.error(err);
        }, () => {
          console.log('Fin');
        } );
    }
  }



}
