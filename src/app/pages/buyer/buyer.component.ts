import { Settings, AppSettings } from '../../app.settings';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss']
})
export class BuyerComponent implements OnInit {

  public settings: Settings

  constructor(public appSettings:AppSettings) { 
    this.settings = this.appSettings.settings
  }

  

  ngOnInit(): void {
  }

}
