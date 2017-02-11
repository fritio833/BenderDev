import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import {Validators, FormBuilder } from '@angular/forms';

import { CreateAccountPage } from '../create-account/create-account';
import { BreweryService } from '../../providers/brewery-service';
import { SingletonService } from '../../providers/singleton';
import { SearchPage } from '../search/search';

import { Beer } from '../../models/beer';


@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})

export class HelloIonicPage {

  public qSearch:any;
  public qSearchForm:any;
  public alert:string;
  public totalResults:number;
  public numberOfPages:number;
  public currentPage:number;
  public beers:Beer[];

  constructor(public navCtrl: NavController,public params:NavParams,public _form: FormBuilder,private alertCtrl: AlertController,public beerAPI: BreweryService, public sing:SingletonService) {

  	this.qSearch = params.get("qSearch");
  	this.alert = params.get("alert");

  	this.qSearchForm = this._form.group({
  		qSearch : ['',Validators.required]
  	});

  }

  showCreateAccount() {

  	this.navCtrl.push(CreateAccountPage);
  }

  doSearch() {

  	 if (this.qSearchForm.valid) {

      this.beerAPI.loadBeerByName(this.qSearchForm.value.qSearch).subscribe(beer => {
         this.beers = beer;
         this.loadBeers(this.beers);
      }); 

  	 }
  }



  loadBeers(data) {

    // console.log(data);

    this.beers = data.data;
    this.totalResults = data.totalResults;
    // this.currentPage = data.currentPage;
    // this.numberOfPages = data.numberOfPages;

    
    if ( !this.totalResults ) {

    	this.presentAlert();
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
    this.navCtrl.push(SearchPage,{qSearch:this.qSearchForm.value.qSearch,beers:this.beers});
 
  }  

  
  doSupriseMe() {

  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'No Beers Found',
      subTitle: 'Please check your spelling.',
      buttons: ['Dismiss']
    });
    alert.present();
  }  

  ionViewDidLoad() {

    console.log('ionViewDidLoad HomePage');

    if (this.alert != null) {
      this.presentAlert();    
    }
  }

}
