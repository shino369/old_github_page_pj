import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-icons',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() name: string = ''
  @Input() size: number = 30
  @Input() color?:
    | 'primary'
    | 'white'
    | 'red'
    | 'green'
    | 'yellow'
    | 'darkblue'
    | 'disabled'
    | 'rate' = 'primary'
  @Input() disabled = false
  @Input() opacity = ''

  constructor() {}

  ngOnInit(): void {}
}
