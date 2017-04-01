import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { BeerDetailPage } from '../beer-detail/beer-detail';
import { LocationMapPage } from '../location-map/location-map';


@Component({
  selector: 'page-brewery-detail',
  templateUrl: 'brewery-detail.html'
})
export class BreweryDetailPage {

  public brewery:any;
  public breweryBeers:any;
  public breweryDescription:string;
  public breweryHours:string;

  constructor(public navCtrl: NavController, 
              public params: NavParams,
              public modalCtrl:ModalController) {

  	this.brewery = params.get('brewery');
    this.breweryBeers = params.get('beers');

    console.log('brewery',this.brewery);

    if (this.brewery.hasOwnProperty('brewery')) {
      this.breweryDescription = this.brewery.brewery.description;
    } else {
      this.breweryDescription = null;	
    }

    if (this.brewery.hasOwnProperty('hoursOfOperation')) {
      this.breweryHours = this.brewery.hoursOfOperation;
    } else {
      this.breweryHours = null;	
    }

    if (!this.brewery.brewery.hasOwnProperty('images')) {
      
      this.brewery['brewery']['images'] = {icon:'images/no-image.jpg',
                                           medium:'images/no-image.jpg',
                                           squareMedium:'images/no-image.jpg', 
                                           large:'images/no-image.jpg'};      
    }
    

    if (this.breweryBeers.hasOwnProperty('data')) {
    	this.breweryBeers = this.breweryBeers.data;
    	this.fixBreweryBeers();
    } else {
    	this.breweryBeers = new Array();
    }
  
  	//console.log('brewery',this.brewery);
  	//console.log('beers',this.breweryBeers);
  }

  fixBreweryBeers() {

  	for (var i = 0; i < this.breweryBeers.length; i++) {
      
  	  if (!this.breweryBeers[i].hasOwnProperty('labels')) {
  	  	this.breweryBeers[i]['labels'] = {icon:'images/no-image.jpg',medium:'images/no-image.jpg'};
  	  }

  	  if (!this.breweryBeers[i].hasOwnProperty('style')) {
  	    this.breweryBeers[i]['style'] = {shortName:''};	
  	  }
  	}
  } 

  showMap(beer) {
    
    let modal = this.modalCtrl.create(LocationMapPage,
                                      { lat:beer.latitude,
                                        lng:beer.longitude,
                                        locName:beer.name
                                      });
    modal.present();
  }

  getBeerDetail(beer) {
     this.navCtrl.push(BeerDetailPage,{beerId:beer.id});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BreweryDetailPage');
  }

}
