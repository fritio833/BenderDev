import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { BreweryService } from '../../providers/brewery-service';

@Component({
  selector: 'page-checkin-select-beer',
  templateUrl: 'checkin-select-beer.html'
})
export class CheckinSelectBeerPage {

  public beerName:string;
  public favBeers = new Array();
  public breweryBeers = new Array();
  public beers = new Array();
  public toggleFavBeers:boolean = false;
  public toggleLocationBeers:boolean = false;
  public locationName:string;
  public checkinType:string;

  constructor(public navCtrl: NavController, 
  	          public view: ViewController,
  	          public storage:Storage,
  	          public beerAPI:BreweryService,
  	          public toastCtrl:ToastController,
  	          public params: NavParams) {
  	this.breweryBeers = params.get('breweryBeers');
  	this.locationName = params.get('name');
  	this.checkinType = params.get('checkinType');
  	console.log('breweryBeers',this.breweryBeers);
  	console.log('checkinType',this.checkinType);
  }

  findBeer() {
    console.log('beer',this.beerName);

  	 if (this.beerName.length) {

	      this.beerAPI.loadBeerByName(this.beerName).subscribe(beer => {
	         this.beers = beer.data;
	         this.fixBeers(); 
	         console.log('beers',this.beers);         
	      }); 

  	 }    
  }

  fixBeers() {

    for (var i = 0; i < this.beers.length; i++) {

        this.beers[i]['pos'] = i;
 		
 		  // fix beers with no images
 		  if (!this.beers[i].hasOwnProperty('labels')) {
          this.beers[i]['labels'] = {icon:'',medium:'',large:''};
 		  }

 		  // fix no beer category
 		  if (!this.beers[i].hasOwnProperty('style')) {
          this.beers[i]['style'] = {category:{name:'',createDate:'',id:''}};
 		  } 		
     
    }
  }     

  setBeer(beer) {

    this.beerAPI.loadBeerById(beer.id).subscribe(resp=>{
      //console.log('beer',resp);
      if (resp.hasOwnProperty('data'))
        this.view.dismiss(resp.data);
      else
      	this.presentToast(beer.name+' no longer exists. Consider removing.');
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

    this.storage.ready().then(()=>{

      this.storage.get('beers').then((beerArray)=>{
        this.favBeers = beerArray;
        //console.log('fav',this.favBeers);
      });      
    
    });
  }

  cancel() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckinSelectBeerPage');

  }

}
