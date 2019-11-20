import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-cargar-archivo',
  templateUrl: './cargar-archivo.component.html',
  styleUrls: ['./cargar-archivo.component.css']
})
export class CargarArchivoComponent implements OnInit {

  @ViewChild('inputFile') inputFile;
  @ViewChild('container') container: ElementRef;
  archivo: any;
  nombreArchivo = 'Archivo no seleccionado...';
  info: any;
  resultados = [];
  iteraciones = [];

  constructor( ) { }

  ngOnInit() {
  }

  leerArchivo(event: any) {
   // this.cleanContent();
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

    this.cleanLocalStorage();

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

      const arr = this.obtenerOrigenesAPI(data);

      arr.forEach((coord: any, index: number) => {
        this.iteraciones.push(index);
        this.getDistancia([ coord.origen ], coord.destinos.split('|'));
      });
    }
  }

  private obtenerOrigenesAPI(lineas: any[]) {
    const arr = [];
    let o: any = {};
    let add = false;

    lineas.forEach((value) => {
      if (value) {
        const linea = value.split('\t');

        if (!o.origen) {
          o.origen = linea[0];
          o.destinos = linea[1];
          add = true;
        } else {
          if (o.origen === linea[0]) {
            o.destinos = o.destinos + '|' + linea[1];
            add = false;
          } else {
            o = {};
            o.origen = linea[0];
            o.destinos = linea[1];
            add = true;
          }
        }

        if (add) {
          arr.push(o);
        }
      }
    });

    return arr;
  }

  getDistancia(origen: any[], destinos: any[]) {
    new google.maps.DistanceMatrixService()
      .getDistanceMatrix({origins: origen, destinations: destinos, travelMode: google.maps.TravelMode.DRIVING }, (results: any) => {
        this.resultados.push(results);
    });
  }

  cleanContent() {
    if (this.container !== undefined) {
      this.container.nativeElement.innerHTML = '';
    }
  }
}
