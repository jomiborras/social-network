import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherModule } from 'angular-feather';
import { Home } from 'angular-feather/icons';

const icons = {
	Home
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeatherModule.pick(icons)
  ]

  exports: [
  	FeatherModule
  ]

});
export class FeatherIconsModule { }
