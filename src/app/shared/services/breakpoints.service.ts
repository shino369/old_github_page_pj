import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export const BreakpointConfigs: BreakpointConfig = {
  'sm-up': { dimensions: 576, query: '(min-width: 576px)' },
  'md-up': { dimensions: 768, query: '(min-width: 768px)' }, //
  'lg-up': { dimensions: 992, query: '(min-width: 992px)' },
  'xl-up': { dimensions: 1200, query: '(min-width: 1200px)' },
  'xxl-up': { dimensions: 1400, query: '(min-width: 1400px)' },
  'sm-down': { dimensions: 576, query: '(max-width: 575.98px)' },
  'md-down': { dimensions: 768, query: '(max-width: 767.98px)' }, //
  'lg-down': { dimensions: 992, query: '(max-width: 991.98px)' },
  'xl-down': { dimensions: 1200, query: '(max-width: 1119.98px)' },
  'xxl-down': { dimensions: 1400, query: '(max-width: 1399.98px)' },
  'sm-only': {
    dimensions: 576,
    query: '(min-width: 576px) and (max-width: 767.98px)',
  },
  'md-only': {
    dimensions: 768,
    query: '(min-width: 768px) and (max-width: 991.98px)',
  },
  'lg-only': {
    dimensions: 992,
    query: '(min-width: 992px) and (max-width: 1199.98px)',
  },
  'xl-only': {
    dimensions: 1200,
    query: '(min-width: 1200px) and (max-width: 1399.98px)',
  },
}

export type BreakpointClass =
  | 'sm-up'
  | 'md-up'
  | 'lg-up'
  | 'xl-up'
  | 'xxl-up'
  | 'sm-down'
  | 'md-down'
  | 'lg-down'
  | 'xl-down'
  | 'xxl-down'
  | 'sm-only'
  | 'md-only'
  | 'lg-only'
  | 'xl-only'

export type BreakpointConfig = {
  [key in BreakpointClass]: {
    dimensions: number
    query: string
  }
}
export type Breakpoint = { [key in BreakpointClass]: boolean }

@Injectable({
  providedIn: 'root',
})
export class BreakpointsService {
  private configs = BreakpointConfigs
  breakpoints: Breakpoint = {
    'sm-up': false,
    'md-up': true,
    'lg-up': true,
    'xl-up': true,
    'xxl-up': false,
    'sm-down': false,
    'md-down': false,
    'lg-down': false,
    'xl-down': false,
    'xxl-down': true,
    'sm-only': false,
    'md-only': false,
    'lg-only': false,
    'xl-only': true,
  }
  breakpointsSubject = new BehaviorSubject<Breakpoint>(this.breakpoints)

  constructor(public breakpointObserver: BreakpointObserver) {
    const configs = Object.entries(this.configs)
    const queryies = Object.values(this.configs).map(value => value.query)

    this.breakpointObserver
      .observe(queryies)
      .subscribe((state: BreakpointState) => {
        configs.forEach(([key, value]) => {
          this.breakpoints[key as keyof Breakpoint] =
            state.breakpoints[value.query]
        })
        this.breakpointsSubject.next(this.breakpoints)
      })
  }
}
