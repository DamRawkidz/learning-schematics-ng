import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatDatepickerModule, MatFormFieldModule,
  MatInputModule, MatNativeDateModule, MatSelectModule, MatStepperModule
} from '@angular/material';

import { TestingComponent } from './testing.component';
import { TestingService } from './testing.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatStepperModule,
  ],
  declarations: [TestingComponent],
  providers: [TestingService]
})
export class TestingModule { }
