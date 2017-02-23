import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Geolocation } from 'ionic-native';
import { ConnectivityService } from '../../providers/connectivity-service';

declare var google;
/*
  Generated class for the TackMap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tack-map',
  templateUrl: 'tack-map.html'
})
export class TackMapPage {

  @ViewChild('map') mapElement;
  public map:any;
  public mapInitialised: boolean = false;
  public apiKey: any;  

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public conn:ConnectivityService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TackMapPage!!!!!!');

    this.initMap();
  }

  initMap() {
  	console.log('init map');
  	console.log('isOnline',this.conn.isOnline());

    Geolocation.getCurrentPosition().then((resp) => {
    	console.log('resp',resp);
       if (resp.coords.latitude) {

         let latlng = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
         
         let mapOptions = {
           center:latlng,
           zoom:15,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         };

         this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
        
       }
    }).catch((error) => {
      console.log('Error getting location', error);
    });
   
  }  

}
