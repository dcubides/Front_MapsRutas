import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  url = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
  origenes = 'origins={ORIGENES}';
  destinatario = '&destinations={DESTINATARIOS}';
  complemento = '&traffic_model(pessimistic)';
  key = '&key=AIzaSyDCBkMxNaBxFZNcQ8TPEVWUoTlpFhRonRQ';

  constructor(
    private http: HttpClient
  ) { }

  getData(coord: any) {
    this.origenes = this.origenes.replace('{ORIGENES}', coord.origen);
    this.destinatario = this.destinatario.replace('{DESTINATARIOS}', coord.destinos);

    const urlfinal = this.url + this.origenes + this.destinatario + this.complemento + this.key;
    return this.http.get(urlfinal);
  }

}
