import {Page} from 'ionic/ionic';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { DbService } from './db-service';
import { AuthService } from './auth-service';
import { AlertController,Platform } from 'ionic-angular';

@Injectable()
export class FbProvider {

    public p:any;

    constructor( public platform: Platform, public alertCtrl: AlertController, public storage:Storage,public db:DbService, public auth:AuthService) {}

    loginAndroid() {
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
            facebookConnectPlugin.api('me?fields=email,name,gender,birthday', null,
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

    setCurrentUserProfileAndroid() {
        let loginCredentials = {email: '', password: '',socialLogin:1};
        this.p = new Promise((resolve, reject) => {
          this.getCurrentUserProfileAndroid().then(
            (profileData) => {
                
                //Check if we have an existing record. If not, we create new user.
                this.db.loginFacebook(profileData.id).subscribe(allow=>{

                    if (allow.status) {

                        loginCredentials.email = profileData.email;
                        loginCredentials.password = allow.data.token; // Social login password is token

                        this.auth.login(loginCredentials).subscribe((value)=>{

                          // we logged in succesfully
                          if (value) {

                            resolve(value);
                          }                       

                        },error => {

                           resolve(error);
                        });

                    } else {

                      this.db.saveUser(profileData.email,
                           profileData.name,
                           profileData.name,
                           profileData.id,
                           '',
                           1,
                           profileData.id,
                           "https://graph.facebook.com/" + profileData.id + "/picture")
                           .subscribe((value)=>{

                              let loginCredentials = {email: profileData.email, password: profileData.id};
                        
                              this.auth.login(loginCredentials)
                              .subscribe(allowed => {
                                 
                                 if (allowed) {
                                    resolve(allowed);
                                 }

                              },error => {
                                  resolve(error);
                              });
                          
                        },(error)=> {
                            resolve(error);
                        },()=>{

                        }
                      );
                    }

                },error => {
                    resolve(error);
                });

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
