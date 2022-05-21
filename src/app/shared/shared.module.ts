import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

// UI librairies
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { LayoutModule } from '@angular/cdk/layout'
import { MatCommonModule } from '@angular/material/core'

const COMMON = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
const UIMODULES = [NgbModule, LayoutModule, MatCommonModule]

// remove never later
const COMPONENTS: never[] = []
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
