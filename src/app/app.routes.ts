import { Routes } from '@angular/router';
import { AdminComponent } from './admin-component/admin-component';
import { RetailComponent } from './retail-component/retail-component';
import { CommercialComponent } from './commercial-component/commercial-component';

export const routes: Routes = [
    {path : 'admin', component : AdminComponent},
    {path : 'retail', component : RetailComponent},
    {path :'commercial', component : CommercialComponent},
    {path : '', redirectTo: '/retail', pathMatch: 'full'} // Page par défaut
];
