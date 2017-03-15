import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';

import { BreweryService } from '../../providers/brewery-service';
import { Beer } from '../../models/beer';
import { SearchPage } from '../search/search';
import { BeerDetailPage } from '../beer-detail/beer-detail';
import { SearchBeerFilterPage } from '../search-beer-filter/search-beer-filter';

@Component({
  selector: 'page-search-beer',
  templateUrl: 'search-beer.html'
})
export class SearchBeerPage {

  public qSearchBeer:any;
  public alert:string;
  public beers:Beer[];
  public totalResults:number;
  public numberOfPages:number;
  public currentPage:number;
  public popularBeers:any;
  public filter:any;

  constructor(public navCtrl: NavController, 
  	          public params: NavParams,
  	          public beerAPI: BreweryService,
  	          public toastCtrl: ToastController,
  	          public modalCtrl:ModalController,
  	          public _form: FormBuilder) {

  	this.qSearchBeer = params.get("qSearchBeer");
  	this.alert = params.get("alert");
    this.currentPage = 1;

  }

  loadBeers(data) {
    // console.log(data);
    this.beers = this.fixBeers(data.data);
    this.totalResults = data.totalResults;
  }

  fixBeers(beers) {

    for (var i=0;i<beers.length;i++) {

      if (!beers[i].hasOwnProperty('breweries')) {
        beers[i]['breweries'] = new Array({name:''}); // fix beers without breweries
      }

      // fix beers with no images
      if (!beers[i].hasOwnProperty('labels')) {
        beers[i]['labels'] = {icon:'images/no-image.jpg',medium:'images/no-image.jpg',large:'images/no-image.jpg'};
      }
    }
    return beers;
  }  

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  doSearchBeer(evt) {
    this.currentPage = 1;
    if (evt.target.value.length > 4) {
	    this.beerAPI.loadBeerByName(evt.target.value).subscribe(beer => {
	        this.beers = beer;
	        this.numberOfPages = beer.numberOfPages;
	        //console.log(this.beers);
	        this.qSearchBeer = evt.target.value;
	        this.loadBeers(this.beers);          
	    });
    }
  }

  getMoreBeers(infiniteScroll) {

    if (this.currentPage < this.numberOfPages) {
      this.currentPage++;
    }

    setTimeout(() => {
      this.beerAPI.loadBeerByName(this.qSearchBeer,this.currentPage,this.filter).subscribe((beer)=>{
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

  showBeerFilter() {
    let modal = this.modalCtrl.create(SearchBeerFilterPage,{filter:this.filter});
    modal.onDidDismiss(filter => {
      //console.log('filter',filter);      
      if (filter!=null) {
        this.filter = filter;

        this.beerAPI.loadBeerByName(this.qSearchBeer,this.currentPage,this.filter).subscribe(beer => {
            if (beer.hasOwnProperty('data')) { 
              this.beers = beer;
              this.numberOfPages = beer.numberOfPages;
              //console.log(this.beers);
              this.loadBeers(this.beers);
            } else {
              this.beers = new Array();
              this.presentToast("Sorry. No beers found.")
            }

        });
      }

    });
    modal.present();  	
  }

  getBeerDetail(beerDbId) {
    this.navCtrl.push(BeerDetailPage,{beerId:beerDbId});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchBeerPage');
  }

}
