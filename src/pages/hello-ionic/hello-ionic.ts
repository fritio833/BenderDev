import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Validators, FormBuilder } from '@angular/forms';

import { LoginPage } from '../login/login';
import { BreweryService } from '../../providers/brewery-service';
import { LocationService } from '../../providers/location-service';
import { SingletonService } from '../../providers/singleton-service';
import { DbService } from '../../providers/db-service';
import { GoogleService } from '../../providers/google-service';

import { SearchPage } from '../search/search';
import { BeerDetailPage } from '../beer-detail/beer-detail';
import { Beer } from '../../models/beer';
import { LocationResultsPage } from '../location-results/location-results';
import { LocationDetailPage } from '../location-detail/location-detail';


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
  public popularBeers:any;
  public placeName:any;

  constructor(public navCtrl: NavController,
              public params:NavParams,
              public _form: FormBuilder,
              private alertCtrl: AlertController,
              public beerAPI: BreweryService, 
              public sing: SingletonService, 
              public toastCtrl:ToastController,
              public db:DbService,
              public location:LocationService,
              public geo:GoogleService) {

  	this.qSearchBeer = params.get("qSearchBeer");
    this.qSearchLocation = params.get("qSearchLocation");
  	this.alert = params.get("alert");
    

  	this.qSearchBeerForm = this._form.group({
  		qSearchBeer : ['',Validators.required]
  	});

    this.qSearchLocationForm = this._form.group({
      qSearchLocation : ['',Validators.required]
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

  autoLocationSearch(event) {
    console.log("YOLO",event);
  }

  doSearchLocation() {
    
    let locationName = this.qSearchLocationForm.value.qSearchLocation;
    this.location.getLocationsByName(locationName).subscribe((success)=>{
       console.log(success[0].id);
       if (parseInt(success[0].id)) {
         this.navCtrl.push(LocationResultsPage,{locations:success});         
       } else {

           if ( success[0].name == "Try a Longer Search") {
             this.presentToast("Try a Longer Search");
           }

           if ( success[0].name == "No locations Found") {
             this.presentToast("No Locations Found");
           }           
         console.log(success);
       }
    });
    
  }

  getLocal() {

    Geolocation.getCurrentPosition().then((resp) => {

      this.geo.placesNearByRadius(resp.coords.latitude,resp.coords.longitude,50000)
        .subscribe((success)=>{
           
           this.locations = success.results;
           let ptypes = '';
           //console.log(this.locations);
           for (var i = 0; i < this.locations.length; i++ ) {

              ptypes ='';
              
              for (var j = 0; j < this.locations[i].types.length; j++) {
                  
                  if (this.locations[i].types[j] == 'bar'
                      || this.locations[i].types[j] == 'night_club'
                      || this.locations[i].types[j] == 'convenience_store'
                      || this.locations[i].types[j] == 'liquor_store'
                      || this.locations[i].types[j] == 'grocery_or_supermarket') {
                    ptypes += this.locations[i].types[j] + ', ';
                  }
              }
              this.locations[i].place_types = ptypes.replace(/,\s*$/, "").replace(/_/g, " ");
           }
        });
       
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getLocationDetail(location) {

    this.navCtrl.push(LocationDetailPage,{placeId:location.place_id});

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

  getPopBeers(beerId) {

    this.navCtrl.push(BeerDetailPage,{beerId:beerId});

  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'No Beers Found',
      subTitle: 'Please check your spelling.',
      buttons: ['Dismiss']
    });
    alert.present();
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

    if (this.choice == "beersearch") {
      this.db.getMostTackedDrinks(this.sing.token).subscribe((success)=>{
       
        //console.log(success);
        this.popularBeers = success.data;

      });
    }
  } 

}
