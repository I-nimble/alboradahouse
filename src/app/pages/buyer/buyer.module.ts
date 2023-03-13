import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";
import { BuyerComponent } from "./buyer.component";

export const routes = [
    { path: '', component: BuyerComponent, pathMatch: 'full'  }
];

@NgModule({
    declarations:[
        BuyerComponent
    ],
    imports:[
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class BuyerModule { }