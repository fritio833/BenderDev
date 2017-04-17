import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { Ionic2RatingModule } from 'ionic2-rating';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { FbProvider } from '../providers/fb-provider';
import { BreweryService } from '../providers/brewery-service';
import { SingletonService } from '../providers/singleton-service';
import { AuthService } from '../providers/auth-service';
import { DbService } from '../providers/db-service';
import { LocationService } from '../providers/location-service';
import { GoogleService } from '../providers/google-service';
import { ConnectivityService } from '../providers/connectivity-service';
import { DemoService } from '../providers/demo-service';

import { CheckinComponent } from '../components/checkin/checkin';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { CreateAccountFinalPage } from '../pages/create-account-final/create-account-final';
import { SuccessPage } from '../pages/success/success';
import { ChooseCategoryPage } from '../pages/choose-category/choose-category';
import { ChooseBeerTypePage } from '../pages/choose-beer-type/choose-beer-type';
import { BeerListPage } from '../pages/beer-list/beer-list';
import { SwipePage } from '../pages/swipe/swipe';
import { SearchPage } from '../pages/search/search';
import { BeerDetailPage } from '../pages/beer-detail/beer-detail';
import { MyPubPage } from '../pages/my-pub/my-pub';
import { LoginPage } from '../pages/login/login';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ProfilePage } from '../pages/profile/profile';
import { ProfileEditPage } from '../pages/profile-edit/profile-edit';
import { ReviewsPage } from '../pages/reviews/reviews';
import { FriendsPage } from '../pages/friends/friends';
import { ReviewBeerPage } from '../pages/review-beer/review-beer';
import { HomePage } from '../pages/home/home';
import { MyRatingsPage } from '../pages/my-ratings/my-ratings';
import { LocationResultsPage } from '../pages/location-results/location-results';
import { LocationDetailPage } from '../pages/location-detail/location-detail';
import { CheckinPage }  from '../pages/checkin/checkin';
import { CheckinSelectBeerPage } from '../pages/checkin-select-beer/checkin-select-beer';
import { TackMapPage } from '../pages/tack-map/tack-map';
import { LocationMapPage } from '../pages/location-map/location-map';
import { SearchStartPage } from '../pages/search-start/search-start';
import { SearchBeerPage } from '../pages/search-beer/search-beer';
import { SearchLocationPage } from '../pages/search-location/search-location';
import { SearchBeerFilterPage } from '../pages/search-beer-filter/search-beer-filter';
import { SearchLocationKeyPage } from '../pages/search-location-key/search-location-key';
import { SearchLocationFilterPage } from '../pages/search-location-filter/search-location-filter';
import { SearchBreweriesPage } from '../pages/search-breweries/search-breweries';
import { BreweryDetailPage } from '../pages/brewery-detail/brewery-detail';
import { BreweryDetailMorePage } from '../pages/brewery-detail-more/brewery-detail-more';
import { SelectLocationPage } from '../pages/select-location/select-location';
import { LocationDetailsMorePage } from '../pages/location-details-more/location-details-more';
import { DrinkMenuPage } from '../pages/drink-menu/drink-menu';

export const firebaseConfig = {
    apiKey: "AIzaSyCd-WZs4O8gNx9qVlwwyRdK6_qY60WuQl0",
    authDomain: "bender-1487426215149.firebaseapp.com",
    databaseURL: "https://bender-1487426215149.firebaseio.com",
    projectId: "bender-1487426215149",
    storageBucket: "bender-1487426215149.appspot.com",
    messagingSenderId: "925035513978"    
}

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    CreateAccountPage,
    CreateAccountFinalPage,
    SuccessPage,
    ChooseCategoryPage,
    ChooseBeerTypePage,
    BeerListPage,
    BeerDetailPage,
    SwipePage,
    SearchPage,
    MyPubPage,
    LoginPage,
    FavoritesPage,
    ProfilePage,
    ProfileEditPage,
    ReviewsPage,
    FriendsPage,
    ReviewBeerPage,
    HomePage,
    MyRatingsPage,
    LocationResultsPage,
    LocationDetailPage,
    LocationDetailsMorePage,
    CheckinPage,
    CheckinSelectBeerPage,
    TackMapPage,
    LocationMapPage,
    SearchStartPage,
    SearchBeerPage,
    SearchLocationPage,
    SearchBeerFilterPage,
    SearchLocationKeyPage,
    SearchLocationFilterPage,
    SearchBreweriesPage,
    BreweryDetailPage,
    BreweryDetailMorePage,
    SelectLocationPage,
    DrinkMenuPage,
    CheckinComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    CreateAccountPage,
    CreateAccountFinalPage,
    SuccessPage,
    ChooseCategoryPage,
    ChooseBeerTypePage,
    BeerListPage,
    BeerDetailPage,
    SwipePage,
    SearchPage,
    MyPubPage,
    LoginPage,
    FavoritesPage,
    ProfilePage,
    ProfileEditPage,
    ReviewsPage,
    FriendsPage,
    ReviewBeerPage,
    HomePage,
    MyRatingsPage,
    LocationResultsPage,
    LocationDetailPage,
    LocationDetailsMorePage,
    CheckinPage,
    CheckinSelectBeerPage,
    TackMapPage,
    LocationMapPage,
    SearchStartPage,
    SearchBeerPage,
    SearchLocationPage,
    SearchBeerFilterPage,
    SearchLocationKeyPage,
    SearchLocationFilterPage,
    SearchBreweriesPage,
    BreweryDetailPage,
    BreweryDetailMorePage,
    SelectLocationPage,
    DrinkMenuPage
  ],
  providers: [{provide: ErrorHandler, 
              useClass: IonicErrorHandler},
              BreweryService,
              Storage,
              FbProvider,
              SingletonService,
              AuthService,
              DbService,
              LocationService,
              DemoService,
              GoogleService,
              ConnectivityService]
})
export class AppModule {}
