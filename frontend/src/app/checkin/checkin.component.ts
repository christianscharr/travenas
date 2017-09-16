import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CheckinService} from "../common/services/checkin/checkin.service";
import {isNullOrUndefined} from "util";
import "rxjs/add/observable/empty";
import {ActivatedRoute, Router} from "@angular/router";
import * as ZXing from '../3rdparty/zxing.qrcodereader.min';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  checkinForm: FormGroup;

  constructor(private checkinService: CheckinService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.checkinForm = new FormGroup({
      'station': new FormControl('', [Validators.required])
    });

    this.route.paramMap.subscribe((params) => {
      const stationId = params.get('stationId');

      if (!isNullOrUndefined(stationId) && stationId.trim().length > 0) {
        this.stationControl.patchValue(stationId);
      }
    });


    window.addEventListener('load', function() {
      const codeReader = new ZXing.BrowserQRCodeReader();
      console.log('ZXing code reader initialized');
      codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
          const sourceSelect = document.getElementById('sourceSelect');
          const firstDeviceId = videoInputDevices[0].deviceId
          if (videoInputDevices.length > 1) {
            videoInputDevices.forEach((element) => {
              const sourceOption = document.createElement('option');
              sourceOption.text = element.label;
              sourceOption.value = element.deviceId;
              sourceSelect.appendChild(sourceOption)
            })
            const sourceSelectPanel = document.getElementById('sourceSelectPanel');
            sourceSelectPanel.style.display = 'block'
          }
          document.getElementById('scanButton').addEventListener('click', () => {
            codeReader.decodeFromInputVideoDevice(firstDeviceId, 'video').then((result) => {
              console.log(result);
              document.getElementById('result').textContent = result.text;
              setTimeout(function () {
                window.location.href = result.text;
              }, 500);

            }).catch((err) => {
              console.error(err);
              document.getElementById('result').textContent = err
            });
            console.log(`Started continous decode from camera with id ${firstDeviceId}`)
          });
          document.getElementById('resetButton').addEventListener('click', () => {
            codeReader.reset();
            console.log('Reset.')
          })
        })
        .catch((err) => {
          console.error(err)
        })
    })

  }

  get stationControl() {
    return this.checkinForm.get('station');
  }

  doCheckIn() {
    this.checkinService.getRouteId(this.stationControl.value).subscribe((route) => {
      if (!isNullOrUndefined(route) && route.length > 0) {
        const routeId = route[0]['route'];
        this.checkinService.checkIn(this.stationControl.value, routeId).subscribe((data: any) => {
          CheckinService.RouteChannelUrl = data.RouteUrl;
          CheckinService.StationChannelUrl = data.StationUrl;

          this.checkinService.checkTripEnded(this.stationControl.value).subscribe((tripState: any) => {
            this.router.navigate(['ride'], {queryParams: {"status": tripState.status, "score": tripState.score}});
          });

        });
      }
    });
  }
}
