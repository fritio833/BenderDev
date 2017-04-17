import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

@Injectable()
export class DemoService {

  public fbRef:any;

  constructor(public http: Http) {
    console.log('Hello DemoService Provider');
    this.fbRef = firebase.database();
  }

  setBeerDemo(data) {
    return new Observable(observer => {

      this.fbRef.ref('/demo/beers/'+data.beerId).transaction(value=>{
        if (value) {          
          value.total++;
          //value.cities[]         
          return value;
        } else {
          let newBeer = {
            name:data.beerDisplayName,
            img:data.beerIMG,
            abv:data.beerABV,
            style:data.beerStyleShortName,
            brewery:data.breweryShortName,
            breweryIMG:data.breweryImages,
            total:1,
          };
          return newBeer;
        }
      },(complete)=>{
         let cityKey = data.city.toLowerCase()+'-'+data.state.toLowerCase()+'-'+data.country.toLowerCase();
         this.fbRef.ref('/demo/beers/'+data.beerId+'/cities/'+cityKey).transaction(value=>{
          return (value||0)+1;
         });
      });
      observer.next(true);
    });
  }

  setCheckinUserCount(uid) {
    return new Observable(observer => {
      this.fbRef.ref('/users/'+uid+'/checkins').transaction(value=>{
          //value.cities[]       
          return (value||0)+1;
      },(complete)=>{

      });
      observer.next(true);
    });    
  }

  setUserScore(uid,score) {
    return new Observable(observer => {
      this.fbRef.ref('/users/'+uid+'/points').transaction(value=>{
          //value.cities[]       
          return (value||0)+score;
      },(complete)=>{

      });
      observer.next(true);
    });
  }

  setBeerByLocation(data) {
    return new Observable(observer => {

      if (data.placeId!=null && data.placeId!='') {

        this.fbRef.ref('/location_menu/'+ data.placeId +'/beers/'+data.beerId).transaction(value=>{
          if (value) {          
            value.beerUpdated = firebase.database.ServerValue.TIMESTAMP;
            return value;
          } else {
            let newBeer = {
              uid:data.uid,
              name:data.beerDisplayName,
              img:data.beerIMG,
              abv:data.beerABV,
              style:data.beerStyleShortName,
              brewery:data.breweryShortName,
              breweryIMG:data.breweryImages,
              beerUpdated:firebase.database.ServerValue.TIMESTAMP,
              beerCreated:firebase.database.ServerValue.TIMESTAMP
            };
            return newBeer;
          }
        },(complete)=>{

          if (data.servingStyleName !=null && data.servingStyleName!=''){
            this.fbRef.ref('/location_menu/'+data.placeId+'/beers/'+data.beerId+'/servingStyle/'+data.servingStyleName)
              .transaction(value=>{
                if (value) {
                  value.uid = data.uid;
                  value.reported++;
                  value.timestamp = firebase.database.ServerValue.TIMESTAMP;
                  return value;
                } else {
                  let newServStyle = {
                    uid:data.uid,
                    timestamp:firebase.database.ServerValue.TIMESTAMP,
                    reported: 1
                  }
                  return newServStyle;
                }
            });
          }
        }); 
      }
      observer.next(true);
    });
  }

  setBeerByCityDemo(data) {
    return new Observable(observer => {
      let cityKey = data.city.toLowerCase()+'-'+data.state.toLowerCase()+'-'+data.country.toLowerCase();
      this.fbRef.ref('/demo/beer_by_city/'+cityKey+'/'+data.beerId).transaction(value=>{
        if (value) {          
          value.total++;
          //value.cities[]         
          return value;
        } else {
          let newBeer = {
            name:data.beerDisplayName,
            img:data.beerIMG,
            abv:data.beerABV,
            style:data.beerStyleShortName,
            brewery:data.breweryShortName,
            breweryIMG:data.breweryImages,
            total:1,
          };
          return newBeer;
        }
      },(complete)=>{


      });
      observer.next(true);
    });
  }

}
