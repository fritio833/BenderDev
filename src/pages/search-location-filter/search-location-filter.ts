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
  public placeType:any;

  constructor(public navCtrl: NavController, public params: NavParams, public view: ViewController) {
  	if (params.get("filter") == null) {
	  	this.filter = { distance:null,
	  		            isOpen:null,
                    rating:null,
	  		            placeType:null,
                    affordable:null
	  	            };
  	} else {
  		this.filter = params.get("filter");
  	}

    this.placeType = params.get("placeType");

    if (this.placeType != null && this.placeType != 'all') {
      this.filter.placeType = this.placeType;
    }
  }

  applyPlaceFilter() {
  	this.view.dismiss(this.filter);
  }

  convertDistance(meters) {
    return Math.round(meters * 0.00062137 * 10) / 10;
  }

  setRating(rat) {
    this.filter.rating = rat;
  }

  showMoney(val) {
    let str = '';
    switch(val) {
      case 1: str = '$'; break;
      case 2: str = '$$'; break;
      case 3: str = '$$$'; break;
      case 4: str = '$$$$'; break;
      default: str = '';
    }
    return str;
  }

  cancel() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchLocationFilterPage');
  }

}
