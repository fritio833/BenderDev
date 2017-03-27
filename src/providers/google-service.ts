import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { SingletonService } from './singleton-service';
import { Platform } from 'ionic-angular';
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


  constructor(public http: Http,public sing:SingletonService, public platform:Platform) {
    //console.log('Hello GoogleService Provider');
    this.googleGeocodeAPIKey = sing.googleGeocodeAPIKey;
    this.googlePlacesAPIKey = sing.googlePlacesAPIKey;

    if (this.platform.is('cordova')) {
      this.googlePlacesURL = 'https://maps.googleapis.com/maps/api/place/';
      this.googleGeocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    } else {
      this.googlePlacesURL = 'maps/api/place/';
      this.googleGeocodeURL = 'maps/api/geocode/json?';
    }


    

    //
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyA4dIwMeqXekFajK1uIesJn53LzkyZ_kU4
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json/location=?30.464081,-84.298049&radius=100&key=AIzaSyA4dIwMeqXekFajK1uIesJn53LzkyZ_kU4
    // works => https://maps.googleapis.com/maps/api/place/search/json?location=34.0522222,-118.2427778&radius=500&types=museum|art_gallery&sensor=false&key=AIzaSyA4dIwMeqXekFajK1uIesJn53LzkyZ_kU4
  }

  reverseGeocodeLookup(lat,lng) {
    return this.http.get(this.googleGeocodeURL 
    	  + 'latlng=' + lat + ',' + lng + '&sensor=false&key=' + this.googleGeocodeAPIKey)
        .map(this.getCityState);  	
  }

  getCityState(res:Response) {
    let loc = res.json();
    let location = {
                      address:'',
                      street_number:'',
                      route:'',city:'',
                      state:'',
                      zip:'',
                      county:'',
                      country:''
    };

    for (let i = 0; i < loc.results[0].address_components.length; i++) {

      // Get street number
      if (loc.results[0].address_components[i].types[0] == "street_number")
        location.street_number = loc.results[0].address_components[i].short_name;

      // Get street number
      if (loc.results[0].address_components[i].types[0] == "route")
        location.route = loc.results[0].address_components[i].short_name;      

      // Get City
      if (loc.results[0].address_components[i].types[0] == "locality")
        location.city = loc.results[0].address_components[i].short_name;

      // Get State
      if (loc.results[0].address_components[i].types[0] == "administrative_area_level_1")
        location.state = loc.results[0].address_components[i].short_name;

      // Get zip
      if (loc.results[0].address_components[i].types[0] == "postal_code")
        location.zip = loc.results[0].address_components[i].short_name;

      // Get county
      if (loc.results[0].address_components[i].types[0] == "administrative_area_level_2")
        location.county = loc.results[0].address_components[i].short_name;

      // Get country
      if (loc.results[0].address_components[i].types[0] == "country")
        location.country = loc.results[0].address_components[i].short_name;

    }
    location.address = location.street_number + ' ' + location.route;

    return location;
  }

  fixCityState(loc) {
    let location = {
                      address:'',
                      street_number:'',
                      route:'',city:'',
                      state:'',
                      zip:'',
                      county:'',
                      country:''
    };

    for (let i = 0; i < loc.result.address_components.length; i++) {

      // Get street number
      if (loc.result.address_components[i].types[0] == "street_number")
        location.street_number = loc.results.address_components[i].short_name;

      // Get street number
      if (loc.result.address_components[i].types[0] == "route")
        location.route = loc.result.address_components[i].short_name;      

      // Get City
      if (loc.result.address_components[i].types[0] == "locality")
        location.city = loc.result.address_components[i].short_name;

      // Get State
      if (loc.result.address_components[i].types[0] == "administrative_area_level_1")
        location.state = loc.result.address_components[i].short_name;

      // Get zip
      if (loc.result.address_components[i].types[0] == "postal_code")
        location.zip = loc.result.address_components[i].short_name;

      // Get county
      if (loc.result.address_components[i].types[0] == "administrative_area_level_2")
        location.county = loc.result.address_components[i].short_name;

      // Get country
      if (loc.result.address_components[i].types[0] == "country")
        location.country = loc.result.address_components[i].short_name;

    }
    location.address = location.street_number + ' ' + location.route;

    return location;    
  }

  placesNearByMe(lat,lng) {

    return this.http.get(this.googlePlacesURL 
        + 'nearbysearch/json?location='
        + lat 
        + ',' 
        + lng 
        + '&types=night_club|bar|grocery_or_supermarket|restaurant|liquor_store|gas_station|convenience_store&radius=100&&key=' 
        + this.googlePlacesAPIKey)
        .map(res => res.json());    

    //grocery_or_supermarket ?
  }

  placesNearByRadius(lat,lng,radius?,filter?) {

    let _type = "&types=night_club|bar|grocery_or_supermarket|liquor_store|gas_station|convenience_store";
    let _rankby = "";
    let _radius = "";
    let _open_now = "";

    console.log('radius',radius);
    console.log('filter',filter);

    if (radius == null) {
      _rankby = "&rankby=distance";
    } else {
      _radius = "&radius=" + radius;
    }

    if (filter!=null) {

      if (filter.isOpen!=null && filter.isOpen)
        _open_now = "&opennow=true";

      //set place types by filter
      if (filter.placeType!=null)
       _type = "&types=" + filter.placeType;
         
    }

    return this.http.get(this.googlePlacesURL 
        + 'nearbysearch/json?location='
        + lat 
        + ',' 
        + lng
        + _type
        + _radius
        + _rankby
        + _open_now
        + '&key=' 
        + this.googlePlacesAPIKey)
        .map(res => res.json());
  }

  placesNearByNextToken(nextToken) {
    return this.http.get(this.googlePlacesURL + 'nearbysearch/json?pagetoken='
        + nextToken 
        + '&key=' + this.googlePlacesAPIKey)
        .map(res => res.json());
  }

  placesNearByName(name,lat,lng) {

    return this.http.get(this.googlePlacesURL + 'nearbysearch/json?location='
        + lat + ',' + lng 
        + '&keyword=bar|food|restaurant|liquor_store&radius=100&types=establishment'
        + '&name=' + name 
        + '&key=' + this.googlePlacesAPIKey)
        .map(res => res.json());

  }

  placeDetail(placeId) {
    return this.http.get(this.googlePlacesURL + 'details/json?placeid='
        + placeId
        + '&key=' + this.googlePlacesAPIKey)
        .map(res => res.json());    
  }

  placePhotos(photoRef) {
    return this.http.get(this.googlePlacesURL + 'photo?photoreference='
        + photoRef
        + '&maxwidth=400&key=' + this.googlePlacesAPIKey);    
  }

  placesAutocomplete(locationName) {

    return this.http.get(this.googlePlacesURL + 'autocomplete/json?input='
    	  + locationName + "&location=" 
        + this.lat + ',' + this.lng 
        + '&types=establishment&radius=500&key=' 
        + this.googlePlacesAPIKey)
        .map(res => res.json());
  }

  cityAutoComplete(cityName) {
    return this.http.get(this.googlePlacesURL + 'autocomplete/json?input='
        + cityName + "&country=us" 
        + '&types=(cities)&key=' 
        + this.googlePlacesAPIKey)
        .map(res => res.json());    
  }

  rad(x) {
    return x * Math.PI / 180;
  };

  getDistance(p1, p2,isMiles?) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(p2.lat - p1.lat);
    var dLong = this.rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    if (isMiles) {
      d = d * 0.00062137; // convert meters to miles
    } else {
      d = d * 0.001; // convert meters to kilometers
    }
    return d; // returns the distance in meter
 }  

}
