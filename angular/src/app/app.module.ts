import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { HttpModule } from "@angular/http"
import { HttpClientModule } from "@angular/common/http"

// 設定Form的資料繫結
import { FormsModule } from "@angular/forms"

// 設定AngularFirestore
import { config } from "../environments/config"
import { AngularFireModule } from "@angular/fire"
import { AngularFirestoreModule } from "@angular/fire/firestore"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"

import { RegisterComponent } from "./register.component"
import { ReservationComponent } from "./reservation.component"
import { ModelService } from "./services/modelService"

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        ReservationComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        AngularFireModule.initializeApp(config.firebaseConfig),
        AngularFirestoreModule,
        HttpModule,
        HttpClientModule
    ],
    providers: [ModelService],
    bootstrap: [AppComponent]
})

export class AppModule
{
}
