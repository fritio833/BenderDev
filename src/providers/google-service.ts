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
  public googleGeocodeURL:string;
  public googlePlacesURL:string;
  public googlePlacesAPIKey:string;
  public lat:number;
  public lng:number;


  constructor(public http: Http,public sing:SingletonService) {
    //console.log('Hello GoogleService Provider');
    this.googleGeocodeAPIKey = sing.googleGeocodeAPIKey;
    this.googleGeocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    this.googlePlacesAPIKey = sing.googlePlacesAPIKey;
    this.googlePlacesURL = 'https://maps.googleapis.com/maps/api/place/';
    
    // https://maps.googleapis.com/maps/api/place/autocomplete/output?parameters
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyA4dIwMeqXekFajK1uIesJn53LzkyZ_kU4
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json/location=?30.464081,-84.298049&radius=100&key=AIzaSyA4dIwMeqXekFajK1uIesJn53LzkyZ_kU4

  }

  reverseGeocodeLookup(lat,lng) {
    return this.http.get(this.googleGeocodeURL 
    	  + 'latlng=' + lat + ',' + lng + '&sensor=false&key=' + this.googleGeocodeAPIKey)
        .map(res => res.json());  	
  }

  placesNearByMe(lat,lng) {

    return this.http.get(this.googlePlacesURL + 'nearbysearch/json?location='
    	  + lat + ',' + lng + '&radius=100&key=' + this.googlePlacesAPIKey)
        .map(res => res.json());

  }

  placesAutocomplete(locationName) {

    return this.http.get(this.googlePlacesURL + 'autocomplete/json?input='
    	  + locationName + "&location=" + this.lat + ',' + this.lng + '&types=establishment&radius=500&key=' + this.googlePlacesAPIKey)
        .map(res => res.json());

  }



}
