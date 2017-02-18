import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocationService } from '../../providers/location-service';
import { Geolocation } from 'ionic-native';

/*
  Generated class for the LocationDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-location-detail',
  templateUrl: 'location-detail.html'
})
export class LocationDetailPage {

  public location:any;
  public locScore:any;
  public locImages:any;
  public locMap:any;

  constructor(public navCtrl: NavController, 
  	          public params: NavParams, 
  	          public loc:LocationService) {

    this.location = params.get("location");
    this.location.overall = Math.round(this.location.overall); 
    console.log(this.location);

	Geolocation.getCurrentPosition().then((resp) => {
	 // resp.coords.latitude
	 // resp.coords.longitude
	 console.log(resp);
	}).catch((error) => {
	  console.log('Error getting location', error);
	});

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationDetailPage');

    // Get location data
    this.loc.getLocationMap(this.location.id).subscribe((success)=>{

    	if (success) {
    		this.locMap = success;
    		//console.log('map',this.locMap);
    	}
    });

    this.loc.getLocationImages(this.location.id).subscribe((success)=>{

    	if (success) {
    		this.locImages = success;
    		//console.log('images',this.locImages);
    	}
    });

    this.loc.getLocationScore(this.location.id).subscribe((success)=>{

    	if (success) {
    		this.locScore = success;
    		//console.log('score',this.locScore);
    	}
    });

  }

}
