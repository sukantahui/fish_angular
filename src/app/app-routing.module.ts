import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {CustomerComponent} from './pages/customer/customer.component';
import {ProductComponent} from './pages/product/product.component';
import {AuthComponent} from './pages/auth/auth.component';
import {AuthGuardService} from './services/auth-guard.service';
import {OwnerComponent} from './pages/owner/owner.component';
import {VendorComponent} from './pages/vendor/vendor.component';
import {PurchaseComponent} from './pages/purchase/purchase.component';
import {SaleComponent} from './pages/sale/sale.component';
import {PaymentComponent} from './pages/payment/payment.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'customer', canActivate:  [AuthGuardService], component: CustomerComponent},
  {path: 'vendor', canActivate:  [AuthGuardService], component: VendorComponent},
  {path: 'product', canActivate:  [AuthGuardService], component: ProductComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'owner', canActivate:  [AuthGuardService], component: OwnerComponent},
  {path: 'purchase', canActivate:  [AuthGuardService], component: PurchaseComponent},
  {path: 'sale', canActivate:  [AuthGuardService], component: SaleComponent},
  {path: 'payment', canActivate:  [AuthGuardService], component: PaymentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
