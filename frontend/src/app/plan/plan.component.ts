import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  planForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.planForm = new FormGroup({
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required])
    });
  }

  lookup() {

  }
}
