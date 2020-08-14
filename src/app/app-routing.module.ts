import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {CustomerComponent} from './pages/customer/customer.component';
import {ProductComponent} from './pages/product/product.component';
import {OrderComponent} from './pages/order/order.component';
import {AuthComponent} from './pages/auth/auth.component';
import {AuthGuardService} from './services/auth-guard.service';
import {OwnerComponent} from './pages/owner/owner.component';
import {JobComponent} from './pages/job/job.component';
import { JobTaskComponent } from './pages/job/job-task/job-task.component';
import { JobDetailComponent } from './pages/job/job-detail/job-detail.component';
import {GoldSubmitComponent} from "./pages/job/job-detail/gold-submit/gold-submit.component";
import {GoldReturnComponent} from "./pages/job/job-detail/gold-return/gold-return.component";
import {DalSubmitComponent} from "./pages/job/job-detail/dal-submit/dal-submit.component";
import {DalReturnComponent} from "./pages/job/job-detail/dal-return/dal-return.component";
import {PanSubmitComponent} from "./pages/job/job-detail/pan-submit/pan-submit.component";
import {PanReturnComponent} from "./pages/job/job-detail/pan-return/pan-return.component";
import {NitricReturnComponent} from "./pages/job/job-detail/nitric-return/nitric-return.component";
import {BronzeSubmitComponent} from "./pages/job/job-detail/bronze-submit/bronze-submit.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'customer', canActivate:  [AuthGuardService], component: CustomerComponent},
  {path: 'product', canActivate:  [AuthGuardService], component: ProductComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'owner', canActivate:  [AuthGuardService], component: OwnerComponent},
  {path: 'order', canActivate:  [AuthGuardService], component: OrderComponent},
  {path: 'job', canActivate:  [AuthGuardService], component: JobComponent},
  {path: 'job_task',canActivate : [AuthGuardService], component: JobTaskComponent},
  {path: 'job_detail/:id',canActivate : [AuthGuardService], component: JobDetailComponent,
    children: [
      {path: '', component: GoldSubmitComponent},
      {path: 'goldSubmit', component: GoldSubmitComponent},
      {path: 'goldReturn', component: GoldReturnComponent},
      {path: 'dalSubmit', component: DalSubmitComponent},
      {path: 'dalReturn', component: DalReturnComponent},
      {path: 'panSubmit', component: PanSubmitComponent},
      {path: 'panReturn', component: PanReturnComponent},
      {path: 'nitricReturn', component: NitricReturnComponent},
      {path: 'bronzeSubmit', component: BronzeSubmitComponent},
      // {path: 'albums', component: ArtistAlbumListComponent},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
