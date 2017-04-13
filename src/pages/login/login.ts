import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AuthProviders, AuthMethods, AngularFire  } from 'angularfire2';

import { FbProvider } from '../../providers/fb-provider';
import { ValidationService } from '../../providers/validation-service';
import { SingletonService } from '../../providers/singleton-service';
import { AuthService } from '../../providers/auth-service';


import { CreateAccountFinalPage }from '../create-account-final/create-account-final';
import { HomePage } from '../home/home';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public email:any;
  public emailForm:any;
  public name:any;
  public id:any;
  public picture:any;
  public gender:any;
  public birthday:any;
  public password:any;
  public loginCredentials = {email: '', password: ''};
  public loading:any;

  constructor(public navCtrl: NavController, 
              public params: NavParams,
              public alertCtrl: AlertController,
              public form: FormBuilder,
              public fb:FbProvider, 
              public storage: Storage,
              public sing: SingletonService,
              public auth:AuthService,
              public toastCtrl:ToastController,
              public angFire:AngularFire,
              public loadingCtrl: LoadingController, 
              public modalCtrl:ModalController) {

    this.email = params.get("email");
    this.password = params.get("password");
    
    this.emailForm = this.form.group({
      email : ['',Validators.required],
      password : ['',Validators.compose([Validators.required,Validators.maxLength(30)])]
    });
  }

  showCreateAccountFinal() {
    this.navCtrl.push(CreateAccountFinalPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  presentModal() {
    let modal = this.modalCtrl.create(CreateAccountFinalPage);
    modal.present();
  }

  loginFacebook() {
     this.auth.loginFacebook().subscribe(resp => {
      //console.log('resp',resp);
      if (!resp)
        this.presentToast("Incorrect Login Credentials.");
      else {
        this.navCtrl.setRoot(HomePage);
      }
      //this.showError("Incorrect Login Credentials."); 
    }, error => {
      console.log('error',error);
    });
  }

  loginFB() {

    this.fb.loginAndroid().then(() => {

      this.fb.setCurrentUserProfileAndroid().then((success) => {
        this.navCtrl.setRoot(HomePage);
      });
    });
  }

  logoutFB() {
    
    this.fb.logoutAndroid();

  }

  showAlert(title,msg) {

      let alert = this.alertCtrl.create({
        title: msg,
        subTitle: msg,
        buttons: ['Dismiss']
      });
      alert.present();

  }


  loginEmail() {

    this.loginCredentials = { 
                                email:this.emailForm.value.email,
                                password:this.emailForm.value.password
                            };
    
    if (this.emailForm.valid) {
      this.auth.loginEmail(this.loginCredentials)
        .subscribe(resp=>{
          if(resp) {
            this.navCtrl.setRoot(HomePage);
          }
          console.log('resp',resp);
        },error=> {
          console.log('error',error);
          this.presentToast(error.message);
        });
     }   

  }

  // TODO:  Firebase email confirmation
  signupEmail() {


  }

  logMeOut() {
    this.auth.logOut();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }  

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration:3000
    });
    this.loading.present();
  }
 
  showError(text) {
    /*
    setTimeout(() => {
      this.loading.dismiss();
    });
    */
    let alert = this.alertCtrl.create({
      title: 'Login Failed',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }


}