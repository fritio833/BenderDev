import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SingletonService } from './singleton-service';
import { Platform } from 'ionic-angular';

/*
  Generated class for the LocationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationService {

  public beermappingURL = "webservice/";
  public beermappingAPIKey = "";

  constructor(public http: Http,public sing:SingletonService, public platform:Platform) {
    console.log('Hello LocationService Provider');

    this.beermappingAPIKey = sing.beermappingAPIKey;

    if (this.platform.is('cordova')) {
      this.beermappingURL = 'http://beermapping.com/webservice/';         
    } else {
      this.beermappingURL = 'webservice/';      
    }    

  }

  getLocationsByName(name) {
    return this.http.get(this.beermappingURL+'locquery/'+this.beermappingAPIKey+'/'+name+'&s=json')
        .map(res => res.json());
  }

  getLocationScore(id) {
    return this.http.get(this.beermappingURL+'locscore/'+this.beermappingAPIKey+'/'+id+'&s=json')
        .map(res => res.json());
  }

  getLocationMap(id) {
    return this.http.get(this.beermappingURL+'locmap/'+this.beermappingAPIKey+'/'+id+'&s=json')
        .map(res => res.json());
  }

  getLocationImages(id) {
    return this.http.get(this.beermappingURL+'locimage/'+this.beermappingAPIKey+'/'+id+'&s=json')
        .map(res => res.json());
  }

  getLocationCityState(city,state) {
    return this.http.get(this.beermappingURL+'loccity/'+this.beermappingAPIKey+'/'+city+','+state+'&s=json')
        .map(res => res.json());
  }      

}
