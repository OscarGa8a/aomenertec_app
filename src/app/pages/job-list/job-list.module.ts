import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobListPageRoutingModule } from './job-list-routing.module';

import { JobListPage } from './job-list.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    JobListPageRoutingModule,
    SharedModule
  ],
  declarations: [JobListPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobListPageModule {}
