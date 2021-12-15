import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZoomComponent } from './zoom/zoom.component';
const routes: Routes = [
  { path: '', component: ZoomComponent },
  { path: 'integrations/zoom', component: ZoomComponent },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

