import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import MainComponent from './main.component';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';

@NgModule({
  imports: [SharedModule, RouterModule, FooterComponent, PageRibbonComponent],
  declarations: [MainComponent],
})
export default class MainModule {}
