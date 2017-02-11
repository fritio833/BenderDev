import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

import { Beer } from '../models/beer';

let breweryDbUrl = 'http://api.brewerydb.com/v2/';
let breweryDbAPI = 'key=3c7ec73417afb44ae7a4450482f99d70';

/*
  Generated class for the BreweryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()

export class BreweryService {

  public data:any;

  constructor(public http: Http) {
  	this.http = http;
  	this.data = null;
  	console.log('Hello BreweryService Provider');
  }

  
  loadBeerByName(beerName): Observable<Beer[]>  {

    return this.http.get(breweryDbUrl + 'search/?' + breweryDbAPI + '&q=' + beerName +'&type=beer')
        .map(res => <Beer[]>res.json());
  }

  loadBeerById(beerId): Observable<Beer>  {

    return this.http.get(breweryDbUrl + 'beer/' + beerId + '/?' + breweryDbAPI)
        .map(res => <Beer>(res.json()));
  } 

}
