import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,ToastController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Storage } from '@ionic/storage';

import { BreweryService } from '../../providers/brewery-service';

@Component({
  selector: 'page-checkin-select-beer',
  templateUrl: 'checkin-select-beer.html'
})
export class CheckinSelectBeerPage {

  public beerName:string;
  //public favBeers = new Array();
  public favBeers: FirebaseListObservable<any>;
  public breweryBeers = new Array();
  public beers = new Array();
  public toggleFavBeers:boolean = false;
  public toggleLocationBeers:boolean = false;
  public locationName:string;
  public location:any;
  public checkinType:string;
  public uid:any;
  public localBeers:FirebaseListObservable<any>;
  public showLoader:boolean = false;
  public numberOfPages:number;
  public currentPage:number;
  public totalResults:number = 0;
  public qSearchBeer:string = '';

  constructor(public navCtrl: NavController, 
  	          public view: ViewController,
  	          public storage:Storage,
  	          public beerAPI:BreweryService,
              public angFire:AngularFire,
  	          public toastCtrl:ToastController,
  	          public params: NavParams) {
  	this.breweryBeers = params.get('breweryBeers');
  	this.locationName = params.get('name');
  	this.checkinType = params.get('checkinType');
    
    if (this.checkinType == "place") {
      this.location = params.get("location");
    }

    this.storage.ready().then(()=>{
      this.storage.get('uid').then(uid=>{
        this.uid = uid;
        //this.favBeers = this.angFire.database.list('/favorite_beers/'+uid+'/');      
      });
    });    
  }

  fixBeers(beers) {
   
    for (var i = 0; i < beers.length; i++) {

 		  // fix beers with no images
 		  if (!beers[i].hasOwnProperty('labels')) {
          beers[i]['labels'] = {icon:'',medium:'',large:''};
 		  }

      if (!beers[i].hasOwnProperty('breweries')) {
        beers[i]['breweries'] = new Array({name:''}); // fix beers without breweries
      }       

 		  // fix no beer category
 		  if (!beers[i].hasOwnProperty('style')) {
          beers[i]['style'] = {category:{name:'',createDate:'',id:''}};
 		  }
      //console.log('beers',beers);
    }
    return beers;
  }     

  setBeer(beerId,beerName) {
    //console.log('beer',beer);
    
    this.beerAPI.loadBeerById(beerId).subscribe(resp=>{
      //console.log('beer',resp);
      if (resp.hasOwnProperty('data'))
        this.view.dismiss(resp.data);
      else
      	this.presentToast(beerName + ' no longer exists. Consider removing.');
    });
  }

  clearSearch(event){
    
  	this.qSearchBeer = '';
    this.totalResults = 0;
    this.showLoader = false;
  	this.beers = null;
  }

  doSearchBeer(evt) {
    
    if (evt.type != "input")
      return;

    this.currentPage = 1;

    if (evt.target.value.length > 2) {
      this.showLoader = true;
	    this.beerAPI.loadBeerByName(evt.target.value).subscribe(beer => {
          //console.log('beer',beer);
	        this.beers = beer.data;
	        this.numberOfPages = beer.numberOfPages;
          
          if (beer.hasOwnProperty('totalResults'))
            this.totalResults = beer.totalResults;
          else
            this.totalResults = 0;
	        //console.log(this.beers);
	        this.qSearchBeer = evt.target.value;
          if (this.totalResults)
	          this.beers = this.fixBeers(this.beers);

          //console.log('beers',this.beers);
          this.showLoader = false;          
	    });
    } else {
      this.totalResults = 0;
      this.showLoader = false;
    }
  }  

  getMoreBeers(infiniteScroll) {

    if (this.currentPage < this.numberOfPages) {
      this.currentPage++;
    }

    setTimeout(() => {
      this.beerAPI.loadBeerByName(this.qSearchBeer,this.currentPage).subscribe((beer)=>{
        let beersNext:any;
        beersNext = this.fixBeers(beer.data);

        for (var i = 0; i < beersNext.length; i++) {
          this.beers.push(beersNext[i]);
        }
        //console.log(beersNext);
        infiniteScroll.complete();

        if (this.currentPage == this.numberOfPages)
          infiniteScroll.enable(false);

      });
    }, 1000);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  getLocationBeers() {
  	if (this.toggleLocationBeers)
  		this.toggleLocationBeers = false;
  	else
  		this.toggleLocationBeers = true;

    // TODO: Show Brewery Beer first and append checked in beers
  }

  getFavoriteBeers() {

  	if (this.toggleFavBeers)
  		this.toggleFavBeers = false;
  	else
  		this.toggleFavBeers = true;

    this.favBeers = this.angFire.database.list('/favorite_beers/'+this.uid+'/');

  }

  cancel() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckinSelectBeerPage');
    if (this.checkinType == "place") {
      this.localBeers = this.angFire.database.list('/location_menu/'+this.location.place_id+'/beers');
    }
    //this.localBeers = this.angFire.database.list('/location_menu/'+this.locationId+'/beers');

  }

}
