import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './components/header/header.component';
import { RssPageComponent } from './pages/rss-page/rss-page.component';
import { CollapseMenuComponent } from './components/collapse-menu/collapse-menu.component';
import { MenuItemComponent } from './components/collapse-menu/menu-item/menu-item.component';
import { CountTagPipe } from './pipes/count-tag.pipe';
import { ConvertUnitPipe } from './pipes/convert-unit.pipe';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
	declarations: [
		AppComponent,
		HomePageComponent,
		HeaderComponent,
		RssPageComponent,
		CollapseMenuComponent,
		MenuItemComponent,
		CountTagPipe,
		ConvertUnitPipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		ReactiveFormsModule,
		FormsModule,
		MatIconModule,
		NgApexchartsModule
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
