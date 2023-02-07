import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-videocontact',
  templateUrl: './videocontact.component.html',
  styleUrls: ['./videocontact.component.scss']
})
export class VideocontactComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const tag = document.createElement('script');

  	tag.src = "https://www.youtube.com/iframe_api";

  	document.body.appendChild(tag);
  }

}
