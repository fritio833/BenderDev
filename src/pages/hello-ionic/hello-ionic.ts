import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController} from 'ionic-angular';

import {Validators, FormBuilder } from '@angular/forms';

import { LoginPage } from '../login/login';
import { BreweryService } from '../../providers/brewery-service';
import { LocationService } from '../../providers/location-service';
import { SingletonService } from '../../providers/singleton-service';
import { AuthService } from '../../providers/auth-service';
import { GoogleService } from '../../providers/google-service';

import { SearchPage } from '../search/search';
import { MyPubPage } from '../my-pub/my-pub';
import { Beer } from '../../models/beer';
import { LocationResultsPage } from '../location-results/location-results';


@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})

export class HelloIonicPage {

  public qSearchBeer:any;
  public qSearchLocation:any;
  public qSearchBeerForm:any;
  public qSearchLocationForm:any;
  public alert:string;
  public totalResults:number;
  public numberOfPages:number;
  public currentPage:number;
  public beers:Beer[];
  public choice:string;
  public locations:any;

  constructor(public navCtrl: NavController,
              public params:NavParams,
              public _form: FormBuilder,
              private alertCtrl: AlertController,
              public beerAPI: BreweryService, 
              public sing: SingletonService, 
              public auth: AuthService, 
              public toastCtrl:ToastController,
              public location:LocationService,
              public google:GoogleService) {

  	this.qSearchBeer = params.get("qSearchBeer");
    this.qSearchLocation = params.get("qSearchLocation");
  	this.alert = params.get("alert");
    

  	this.qSearchBeerForm = this._form.group({
  		qSearchBeer : ['',Validators.required]
  	});




    this.choice = "beersearch";

  }

  doLogin() {

  	this.navCtrl.push(LoginPage);
  }

  doSearchBeer() {

  	 if (this.qSearchBeerForm.valid) {

      this.beerAPI.loadBeerByName(this.qSearchBeerForm.value.qSearchBeer).subscribe(beer => {
         this.beers = beer;
         this.loadBeers(this.beers);
      }); 

  	 }
  }

  doSearchLocation() {
    /*
    let locationName = this.qSearchLocationForm.value.qSearchLocation;
    this.location.getLocationsByName(locationName).subscribe((success)=>{

       if (!success.id) {
         this.navCtrl.push(LocationResultsPage,{locations:success});
       }
    });
    */
  }

  getLocations(event) {
    let predictions:any;
    this.locations = new Array();
    //console.log(event.target.value);
    
    this.google.placesAutocomplete(event.target.value).subscribe((success)=>{
        //console.log(success.predictions[0].description);
        predictions = success.predictions;
        console.log(success);
        for (var i = 0; i < predictions.length; i++) {
            this.locations.push({id:predictions[i].id,description:predictions[i].description});
        }
    });
    
    //var types:string[] = ['bar','food','restaurant'];
    //let response = new google.maps.places.Autocomplete(event.target).setTypes(types);
    //console.log(response);
  }

  loadBeers(data) {

    // console.log(data);

    this.beers = data.data;
    this.totalResults = data.totalResults;

    
    if ( !this.totalResults ) {

    	this.presentToast('No Beers Found. Please check your spelling.');
    	return;
    }
    

    for (var i = 0; i < this.beers.length; i++) {

        this.beers[i]['pos'] = i;
 		
 		  // fix beers with no images
 		  if (!this.beers[i].hasOwnProperty('labels')) {
          this.beers[i]['labels'] = {icon:'images/no-image.jpg',medium:'images/no-image.jpg',large:'images/no-image.jpg'};
 		  }

 		  // fix no beer category
 		  if (!this.beers[i].hasOwnProperty('style')) {
          this.beers[i]['style'] = {category:{name:'',createDate:'',id:''}};
 		  } 		
     
    }
    //console.log(this.beers);
    this.navCtrl.push(SearchPage,{beers:this.beers});
 
  }  

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'No Beers Found',
      subTitle: 'Please check your spelling.',
      buttons: ['Dismiss']
    });
    alert.present();
  }


  doLogout() {
  
    this.auth.logout().subscribe(allowed => {
      if (allowed) {
        this.navCtrl.setRoot(LoginPage);
        this.presentToast('Log out was successful');      
      }
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }  

  ionViewDidLoad() {

    console.log('ionViewDidLoad HomePage');

    if (this.alert != null) {
      this.presentAlert();    
    }
  } 

}
