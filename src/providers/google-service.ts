import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SingletonService } from './singleton-service';
import 'rxjs/add/operator/map';

/*
  Generated class for the GoogleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GoogleService {

  public googleGeocodeAPIKey:string;

  constructor(public http: Http,public sing:SingletonService) {
    //console.log('Hello GoogleService Provider');
    this.googleGeocodeAPIKey = sing.googleGeocodeAPIKey;
  }

}
