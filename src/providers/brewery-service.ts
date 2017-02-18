import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { SingletonService } from './singleton-service';
import { Beer } from '../models/beer';

/*
  Generated class for the BreweryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()

export class BreweryService {

  public data:any;
  public breweryDbAPI:any;
  public breweryDbUrl:any;

  constructor(public http: Http, public single:SingletonService) {
  	this.http = http;
  	this.data = null;

    this.breweryDbAPI = single.breweryDbAPIKey;
    this.breweryDbUrl = 'http://api.brewerydb.com/v2/';
  	console.log('Hello BreweryService Provider');
  }

  
  loadBeerByName(beerName): Observable<Beer[]>  {

    return this.http.get(this.breweryDbUrl + 'search/?key=' + this.breweryDbAPI + '&q=' + beerName +'&type=beer')
        .map(res => <Beer[]>res.json());
  }

  loadBeerById(beerId): Observable<Beer>  {

    return this.http.get(this.breweryDbUrl + 'beer/' + beerId + '/?key=' + this.breweryDbAPI)
        .map(res => <Beer>(res.json()));
  } 

}
