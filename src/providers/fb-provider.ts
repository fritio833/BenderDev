import {Page} from 'ionic/ionic';
import { Injectable } from '@angular/core';

import { AlertController } from 'ionic-angular';


import { Platform } from 'ionic-angular';

@Injectable()
export class FbProvider {

    public p:any;

    constructor( public platform: Platform, public alertCtrl: AlertController) {}

    login() {
        this.p = new Promise((resolve, reject) => {
        if(this.platform.is('cordova')) {
            facebookConnectPlugin.login([ 'email' ], (success) => {
                    console.log(JSON.stringify(success));
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

    logout() {

        facebookConnectPlugin.logout((success) =>{
           console.log(JSON.stringify(success));
        },(err) => {
           console.log(JSON.stringify(err));
        });

    }
   
    getCurrentUserProfile() {
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
	      title: "wtf" + msg,
	      subTitle: "*" + msg + "*",
	      buttons: ['Dismiss']
	    });
	    alert.present();

    }
}
