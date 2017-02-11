import {Page} from 'ionic/ionic';
import { Injectable } from '@angular/core';

import { AlertController,Platform } from 'ionic-angular';
import { SingletonService } from './singleton';

@Injectable()
export class FbProvider {

    public p:any;

    constructor( public platform: Platform, public alertCtrl: AlertController,public sing:SingletonService) {}

    loginAndroid() {
        this.p = new Promise((resolve, reject) => {
            if(this.platform.is('cordova')) {
                facebookConnectPlugin.login([ 'email' ], (success) => {
                    console.log(JSON.stringify(success));
                    this.sing.loginStatus = true;
                    resolve(success);
                },(err) => {
                    console.log(JSON.stringify(err));
                    reject(err);
                });          
            } else {
                console.log("Please run me on a device");
                reject('Please run me on a device');
            }
        });

        return this.p;
    }

    logoutAndroid() {

      this.p = new Promise((resolve, reject) => {
	        if(this.platform.is('cordova')) {      
	          facebookConnectPlugin.logout((success) =>{
	             console.log(JSON.stringify(success));
	             resolve("OK");
	          },(err) => {
	           console.log(JSON.stringify(err));
	           reject(err);
	        });
        } else {
          console.log("Please run me on a device");
          reject('Please run me on a device');
        }
      });

      return this.p;        

    }
   
    getCurrentUserProfileAndroid() {
        this.p = new Promise((resolve, reject) => {
            facebookConnectPlugin.api('me?fields=email,name,gender', null,
            (profileData) => {
                console.log(JSON.stringify(profileData));
                resolve(profileData);
            },(err) => {
                console.log(JSON.stringify(err));
                reject(err);
            });
        });
        return this.p;
    }

    showAlert(msg) {

	    let alert = this.alertCtrl.create({
	      title: "Error",
	      subTitle: msg,
	      buttons: ['Dismiss']
	    });
	    alert.present();

    }
}
