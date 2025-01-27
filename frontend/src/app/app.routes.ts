import { Routes } from '@angular/router';
import { ShipmentListComponent } from './components/shipments/shipment-list/shipment-list.component';
import { ShipmentFormComponent } from './components/shipments/shipments-form/shipment-form.component';
import { PostOfficeFormComponent } from './components/post-office/post-office-form/post-office-form.component';
import { HomeComponent } from './components/home/home.component';
import { PostOfficeListComponent } from './components/post-office/post-office-list/post-office-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shipments/create', component: ShipmentFormComponent },
  { path: 'postOffice/create', component: PostOfficeFormComponent },
  { path: 'shipments/:shipmentNumber/edit', component: ShipmentFormComponent },
  { path: 'shipments', component: ShipmentListComponent },
  { path: 'postOffices', component: PostOfficeListComponent },
  { path: 'postOffices/:zipCode/edit', component: PostOfficeFormComponent },
];
