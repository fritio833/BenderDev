import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the SearchLocationFilter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search-location-filter',
  templateUrl: 'search-location-filter.html'
})
export class SearchLocationFilterPage {

  public filter:any;

  constructor(public navCtrl: NavController, public params: NavParams, public view: ViewController) {
  	if (params.get("filter") == null) {
	  	this.filter = { distance:null,
	  		            isOpen:null,
	  		            placeType:null,
                        affordable:true,
                        expensive:true
	  	            };
  	} else {
  		this.filter = params.get("filter");
  	}  	
  }

  applyPlaceFilter() {
  	this.view.dismiss(this.filter);
  }

  cancel() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchLocationFilterPage');
  }

}
