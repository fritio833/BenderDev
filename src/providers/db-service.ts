import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

let databaseServiceUrl = 'http://192.168.1.100/bender/';

/*
  Generated class for the DbService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DbService {

  constructor(public http: Http) {
     //console.log('Hello DbService Provider');
  }

  public setLikeBeer(beerId) {

    return this.http.get(databaseServiceUrl + 'likes/?action=set' + '&beerid=' + beerId)
        .map(res => res.json());
  }

  public getLikeBeer(beerId) {

    return this.http.get(databaseServiceUrl + 'likes/?action=get' + '&beerid=' + beerId)
        .map(res => res.json());
  }  
}
