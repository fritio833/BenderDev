import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';

import { Observable } from 'rxjs/Observable';
import { SingletonService } from './singleton-service';
import { Beer } from '../models/beer';
import { Platform } from 'ionic-angular';

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

  constructor(public http: Http, public single:SingletonService, public platform:Platform) {
  	this.http = http;
  	this.data = null;

    this.breweryDbAPI = single.breweryDbAPIKey;

    if (this.platform.is('cordova')) {       
      this.breweryDbUrl = 'http://api.brewerydb.com/v2/';   
    } else {
      this.breweryDbUrl = 'v2/';
    }

  	console.log('Hello BreweryService Provider');
  }

  
  loadBeerByName(beerName,page?,filter?)  {

    let _page = '';
    let _filter = '';

    if (page!=null)
      _page = '&p=' + page;

    //console.log('filter',filter);
    
    if (filter!=null) {

      if (filter.styleId!=null)
        _filter += '&styleId=' + filter.styleId;

      if (filter.isOrganic!=null && filter.isOrganic)
        _filter += '&isOrganic=Y';

      if (filter.minABV!=null)
        _filter += '&abv=' + filter.minABV + ',20';

      if (filter.minIBU!=null)
        _filter += '&ibu=' + filter.minIBU + ',100';

      if (filter.showLabels!=null && filter.showLabels)
        _filter += '&hasLabels=Y';

      if (filter.sortBy!=null)
        _filter += '&sort=' + filter.sortBy;

      if (beerName!=null)
        _filter += '&name=*' + beerName + '*';

      return this.http.get(this.breweryDbUrl 
           + 'beers/?key=' 
           + this.breweryDbAPI 
           + _page
           + _filter 
           +'&withBreweries=Y')
           .retry(2)
           .timeout(5000,new Error('Error connecting'))
           .map(res => res.json());
    } else {
      return this.http.get(this.breweryDbUrl 
           + 'search/?key=' 
           + this.breweryDbAPI 
           + '&q=' + beerName
           + _page 
           +'&type=beer&withBreweries=Y')
           .retry(2)
           .timeout(5000,new Error('Error connecting'))           
           .map(res => res.json());
    }
  }

  findBreweriesByName(name) {
    return this.http.get(this.breweryDbUrl 
           + 'search/?key=' 
           + this.breweryDbAPI 
           + '&q=' + name
           + '&type=brewery')
           .retry(2)
           .timeout(5000)
           .map(res => res.json());    
  }

  findBreweriesByCity(city) {
    return this.http.get(this.breweryDbUrl 
           + 'locations/?key=' 
           + this.breweryDbAPI 
           + '&locality=' + city)
           .map(res => res.json());
  }

  findBreweriesByGeo(lat,lng,radius?) {
    let _radius = 25;

    if (radius != null) {
      _radius = radius;
    }

    return this.http.get(this.breweryDbUrl 
           + 'search/geo/point?lat='
           + lat
           + '&lng='
           + lng
           + "&radius=" + _radius 
           + '&key='           
           + this.breweryDbAPI)
           .retry(2)
           .timeout(5000,new Error('Error connecting'))           
           .map(res => res.json());
  }

  loadBreweryById(breweryId) {
    return this.http.get(this.breweryDbUrl 
         + 'brewery/' 
         + breweryId 
         + '/?key=' + this.breweryDbAPI)
        .map(res => res.json());    
  }

  loadBreweryLocations(breweryId) {
    return this.http.get(this.breweryDbUrl 
         + 'brewery/'+breweryId+'/locations'
         + '/?key=' + this.breweryDbAPI)
        .map(res => res.json());
  }

  loadLocationById(locationId) {
    return this.http.get(this.breweryDbUrl 
         + 'location/'+locationId
         + '/?key=' + this.breweryDbAPI)
        .map(res => res.json());
  }  

  loadBreweryBeers(breweryId) {
    return this.http.get(this.breweryDbUrl 
         + 'brewery/' 
         + breweryId 
         + '/beers?key=' + this.breweryDbAPI)
        .map(res => res.json());    
  }

  loadBeerById(beerId)  {

    return this.http.get(this.breweryDbUrl 
         + 'beer/' 
         + beerId 
         + '/?key=' + this.breweryDbAPI
         + '&type=beer&withBreweries=Y')
        .map(res => res.json());
  } 

  loadBeerCategories() {
    return this.http.get(this.breweryDbUrl 
         + 'categories/'
         + '?key=' + this.breweryDbAPI)
        .map(res => res.json());
  }

  loadBeerStyles() {

    let categoryId = '';

    return this.http.get(this.breweryDbUrl 
         + 'styles/'
         + '?key=' + this.breweryDbAPI)
        .map(res => res.json());    
  }

  loadBeerGlassware() {
    return this.http.get(this.breweryDbUrl 
         + 'glassware/'
         + '?key=' + this.breweryDbAPI)
        .map(res => res.json());    
  }

}
