import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.css']
})
export class GeolocationComponent implements OnInit {

  positions = [];
  details = {
    lat: null,
    timestamp: null,
    lng: null
  };

  constructor() {
    this.load();
  }

  ngOnInit() {
    if (navigator.onLine === true) {
      this.geolocalization();
    } else {
    }
  }

  load() {
    for (let i = 0; i < localStorage.length; i++) {
      const data = JSON.parse(localStorage.getItem(localStorage.key(i)));
      this.positions.push(data);
    }
  }

  posiotionOffline() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    const lastKey = _.max(keys);
    const lastPos = JSON.parse(localStorage.getItem(lastKey));
    this.details.lat = lastPos.lat;
    this.details.lng = lastPos.lng;
    this.details.timestamp = lastPos.timestamp;
  }

  positionOnline() {
    moment.locale('pl');
    navigator.geolocation.getCurrentPosition((position) => {
      this.details.lat = position.coords.latitude;
      this.details.lng = position.coords.longitude;
      this.details.timestamp = moment(position.timestamp).format('LLLL');
    });
  }

  getPosition() {
    if (navigator.onLine === true) {
      return this.positionOnline();
    } else {
      return this.posiotionOffline();
    }
  }

  geolocalization() {
    moment.locale('pl');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos: object = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: moment(position.timestamp).format('LLLL')
        };
        const key = Date.now().toString();
        localStorage.setItem(key, `${JSON.stringify(pos)}`);
        this.positions.push(pos);
      });
    }
  }

}
