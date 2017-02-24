// App Global Variables

import { Injectable } from '@angular/core';


@Injectable()
export class SingletonService {

  // User information set @ app.component.ts
  public loggedIn:boolean = false;
  public userName:string = '';
  public profileIMG:string = '';
  public realName:string = '';
  public token:string = '';
  public description:string = '';
  public geoCity = '';
  public geoState = '';
  
  // App configuration.  API keys, webservice url, etc. 
  public breweryDbAPIKey:string = '3c7ec73417afb44ae7a4450482f99d70';
  public databaseServiceUrl:string = 'bender/';
  public beermappingAPIKey:string = '345ed2357f37f2d46eb2f1cfdc4b3646';
  public googleGeocodeAPIKey:string = 'AIzaSyA4dIwMeqXekFajK1uIesJn53LzkyZ_kU4';
  public googlePlacesAPIKey: string = 'AIzaSyDJ5qz7QX1yXkX2c444v5v0ziSPg15PLjM';

  //Testing. Dev Flags to simulate geolocation
  public test = false;

  //ABC Liquore Store 1930 Thomasville Rd, Tallahassee FL
  //public lat = 30.466237;
  //public lng = -84.269281;

  // Fermintation Lounge
  //public lat = 30.433812;
  //public lng = -84.286296;

  //McGuire's Pensacola
  //public lat = 30.418049;
  //public lng = -87.202452;

  //Pug Mahone's
  //public lat = 30.464105;
  //public lng = -84.298067;

  public lat = 0;
  public lng = 0;

}
