import { HomeComponent } from './pages/home/home.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [],
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
      scrollPositionRestoration: 'disabled',
    }),
  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
