import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TestingService } from './testing.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestingComponent implements OnInit {
  public order: FormGroup;
  public showSuccess: Boolean;
  public months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: TestingService,
  ) { }

  public get years(): number[] {
    let current = new Date().getFullYear();
    return [current, current += 1, current += 2];
  }

  public ngOnInit(): void {
    this.order = this.fb.group({
      steps: this.fb.array([
        this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', Validators.required],
          telephone: [''],
          dateOfBirth: ['', Validators.required]
        }),
        this.fb.group({
          addressLine1: ['', Validators.required],
          addressLine2: [''],
          city: [''],
          state: ['', Validators.required],
          zip: ['', Validators.required]
        }),
        this.fb.group({
          cardNumber: ['', Validators.required],
          sortCode: ['', Validators.required],
          expiryMonth: ['', Validators.required],
          expiryYear: ['', Validators.required],
          securityCode: ['', Validators.required]
        })
      ])
    });
  }

  public submit(): void {
    if (this.order.valid) {
      this.service.submitOrder(this.order.value).subscribe(() => {
        this.showSuccess = true;
      });
    }
  }

}
