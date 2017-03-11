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
  public alert:string;
  public totalResults:number;
  public numberOfPages:number;
  public currentPage:number;
  public beers:Beer[];
  public choice:string;
  public locations:any;
  public popularBeers:any;
  public predictions:any;
  public nextNearByToken:any;

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

    this.choice = "beersearch";

  }

  doLogin() {

  	this.navCtrl.push(LoginPage);
  }

  doSearchBeer() {

  	 if (this.qSearchBeerForm.valid) {

      this.beerAPI.loadBeerByName(this.qSearchBeerForm.value.qSearchBeer).subscribe(beer => {
         this.beers = beer;
         this.qSearchBeer = this.qSearchBeerForm.value.qSearchBeer;
         this.loadBeers(this.beers);          
      }); 

  	 }
  }

  autoLocationSearch(event) {
    
    this.geo.placesAutocomplete(event.target.value).subscribe((success)=>{
      this.predictions = success.predictions;
      console.log(this.predictions);
    });
  }

  getLocal() {

    Geolocation.getCurrentPosition().then((resp) => {

      this.geo.placesNearByRadius(resp.coords.latitude,resp.coords.longitude,50000)
        .subscribe((success)=>{
           
           this.locations = this.fixLocations(success.results);
           this.nextNearByToken = success.next_page_token;
        });
       
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  fixLocations(locations) {

   let ptypes = '';
  
   for (var i = 0; i < locations.length; i++ ) {

      ptypes ='';
      
      if (!locations[i].hasOwnProperty('opening_hours')) {
         locations[i]['opening_hours'] = {open_now:2};
      } else if (locations[i].opening_hours.open_now) {
        locations[i].opening_hours.open_now = 1;
      } else {
         locations[i].opening_hours.open_now = 0;
      }
    
      for (var j = 0; j < locations[i].types.length; j++) {
          
          if (locations[i].types[j] == 'bar'
              || locations[i].types[j] == 'night_club'
              || locations[i].types[j] == 'convenience_store'
              || locations[i].types[j] == 'gas_station'
              || locations[i].types[j] == 'liquor_store'
              || locations[i].types[j] == 'grocery_or_supermarket') {
            ptypes += locations[i].types[j] + ', ';
          }
      }
      locations[i].place_types = ptypes.replace(/,\s*$/, "").replace(/_/g, " ");
    }
    return locations;

  }

  getMoreLocal(infiniteScroll) {

    setTimeout(() => {
      this.geo.placesNearByNextToken(this.nextNearByToken).subscribe((success)=>{
        console.log(success);
        let locationsNext:any;

        locationsNext = this.fixLocations(success.results);

        if (success.hasOwnProperty('next_page_token'))
          this.nextNearByToken = success.next_page_token;

        for (let i = 0; i < locationsNext.length; i++) {
          this.locations.push(locationsNext[i]);
        }

        infiniteScroll.complete();
        //console.log(locationsNext);

        if (!success.hasOwnProperty('next_page_token')) {
          infiniteScroll.enable(false);
        }

      });
    }, 1000);
  }

  getLocationDetail(location) {

    this.geo.placeDetail(location.place_id).subscribe((resp)=>{

      //console.log(resp.result.types);

      for (var i=0;i<resp.result.types.length;i++) {

          if (resp.result.types[i].match('night_club|food|bar|grocery_or_supermarket|liquor_store|gas_station|convenience_store')) {
            this.navCtrl.push(LocationDetailPage,{location:resp.result});
            return;
          }
      }
      console.log(resp.result.types);
      this.presentToast('Not a place that would sell alcoholic beverages');

    });

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
    this.navCtrl.push(SearchPage,{
                                   beers:this.beers,
                                   totalResults:this.totalResults,
                                   numbeOfPages:data.numberOfPages,
                                   qSearchBeer:this.qSearchBeer
                                 });
 
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
