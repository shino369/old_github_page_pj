import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

// UI librairies
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { LayoutModule } from '@angular/cdk/layout'
import { MatCommonModule } from '@angular/material/core'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { ParallaxComponent } from './components/parallax/parallax.component'

// components
import { IconComponent } from './components/icon/icon.component'

const COMMON = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
const UIMODULES = [
  NgbModule,
  LayoutModule,
  MatCommonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
]

// remove never later
const COMPONENTS = [IconComponent, ParallaxComponent]
const DIRECTIVES: never[] = []
const PIPES: never[] = []
const DECLARE = [...COMPONENTS, ...DIRECTIVES, ...PIPES]
@NgModule({
  declarations: DECLARE,
  imports: [...COMMON, ...UIMODULES],
  providers: [],
  exports: [...COMMON, ...COMPONENTS, ...UIMODULES, ...PIPES],
})
export class SharedModule {}
