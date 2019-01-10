import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

import { RegisterComponent } from "./register.component"
import { ReservationComponent } from "./reservation.component"

const routes: Routes = [
    { path: "register", component: RegisterComponent },
    { path: "reservation", component: ReservationComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule
{
}
