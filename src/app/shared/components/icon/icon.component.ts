import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() name: string
  @Input() type: string
  @Input() color: string
  @Input() height: string
  @Input() width: string
  @Input() style: string

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
