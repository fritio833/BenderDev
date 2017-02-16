import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController,ModalController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { FbProvider } from '../../providers/fb-provider';
import { ValidationService } from '../../providers/validation-service';
import { SingletonService } from '../../providers/singleton-service';
import { AuthService } from '../../providers/auth-service';

import { CreateAccountFinalPage }from '../create-account-final/create-account-final';
import { MyPubPage } from '../my-pub/my-pub';


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

  constructor(public navCtrl: NavController, public params: NavParams,public alertCtrl: AlertController,public form: FormBuilder,public fb:FbProvider, public storage: Storage,public sing: SingletonService,public auth:AuthService, public loadingCtrl: LoadingController, public modalCtrl:ModalController) {

    this.email = params.get("email");
    this.password = params.get("password");
    
    this.emailForm = this.form.group({
      email : ['',Validators.compose([Validators.required,Validators.maxLength(30),ValidationService.emailValidator])],
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

  loginFB() {

    this.fb.loginAndroid().then(() => {

      this.fb.setCurrentUserProfileAndroid().then((success) => {
          
          this.navCtrl.setRoot(MyPubPage);

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

    this.loginCredentials = {email:this.emailForm.value.email,password:this.emailForm.value.password};

    if (this.emailForm.valid) {
        this.showLoading();
        this.auth.login(this.loginCredentials).subscribe(allowed => {
          if (allowed) {
            setTimeout(() => {
            this.loading.dismiss();
            this.navCtrl.setRoot(MyPubPage);
            });
          } else {
            this.showError("Access Denied");
          }
        },
        error => {
          this.showError(error);
        });    
      }
  }

  // TODO:  Firebase email confirmation
  signupEmail() {


  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
 
  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }


}