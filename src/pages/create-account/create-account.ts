import { Component } from '@angular/core';
<<<<<<< HEAD
import { NavController, NavParams, AlertController,LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { FbProvider } from '../../providers/fb-provider';
import { SingletonService } from '../../providers/singleton';
import { ValidationService } from '../../providers/validation-service';
=======
import { NavController, NavParams } from 'ionic-angular';
>>>>>>> parent of 7c48660... Facebook Login

import { CreateAccountFinalPage }from '../create-account-final/create-account-final';
import { MyPubPage } from '../my-pub/my-pub';


@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html'
})
export class CreateAccountPage {

<<<<<<< HEAD
  public email:any;
  public emailForm:any;
  public name:any;
  public id:any;
  public picture:any;
  public gender:any;
  public password:any;

  constructor(public navCtrl: NavController, public params: NavParams,public alertCtrl: AlertController,public sing:SingletonService,public form: FormBuilder,public fb:FbProvider, public storage: Storage, public loadingCtrl: LoadingController) {

    this.email = params.get("email");
    this.password = params.get("password");
    
    this.emailForm = this.form.group({
      email : ['',Validators.compose([Validators.required,Validators.maxLength(30),ValidationService.emailValidator])],
      password : ['',Validators.compose([Validators.required,Validators.maxLength(30)])]
    });

  }
=======
  constructor(public navCtrl: NavController, public navParams: NavParams) {}
>>>>>>> parent of 7c48660... Facebook Login


  showCreateAccountFinal() {
  	this.navCtrl.push(CreateAccountFinalPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountPage');
  }

<<<<<<< HEAD
  login(logType) {

    this.fb.loginAndroid().then(() => {
      this.fb.getCurrentUserProfileAndroid().then(
        (profileData) => {
          this.email = profileData.email;
          this.name = profileData.name;
          this.id = profileData.id;
          this.gender = profileData.gender;
          this.picture = "https://graph.facebook.com/" + profileData.id + "/picture?type=large";
      });
    });
  }

  logout() {
    
    this.fb.logoutAndroid();

  }

  goPub() {
     this.navCtrl.push('CreateAccountFinalPage');
  }

  showAlert(title,msg) {

      let alert = this.alertCtrl.create({
        title: msg,
        subTitle: msg,
        buttons: ['Dismiss']
      });
      alert.present();

  }

  showLoading() {
    let loader = this.loadingCtrl.create({
      content: "Verifying. Please wait...",
      duration: 2500
    });

    loader.present();

    setTimeout(() => {
      this.navCtrl.push('CreateAccountFinalPage');
    }, 2000);
  
  }

  // TODO:  Firebase email confirmation
  signupEmail() {

    if (this.emailForm.valid) {
      
       this.storage.ready().then(()=>{

         this.storage.set('user',this.emailForm.value.email);
         this.storage.set('userType','email');

         this.sing.loginStatus = true;

         //this.navCtrl.push('MyPubPage');
         this.showLoading();
         //this.showAlert("YOLO","WTF");

       });       
    }
  }
}
=======
}
>>>>>>> parent of 7c48660... Facebook Login
