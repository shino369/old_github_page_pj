import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core'
import { gsap } from 'gsap'
import { ScrollTrigger, TextPlugin } from 'gsap/all'
import * as _ from 'lodash'
import { round } from 'lodash'
import { trigger, state, transition, style, animate } from '@angular/animations'
import { Subscription, BehaviorSubject, fromEvent } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Title, Meta } from '@angular/platform-browser'
import * as smoothscroll from 'smoothscroll-polyfill'

import {
  Breakpoint,
  BreakpointsService,
} from '@app/shared/services/breakpoints.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state(
        'expand',
        style({
          opacity: 1,

          transform: 'translateX(0)',
        })
      ),
      state(
        'none',
        style({
          opacity: 0,

          overflow: 'hidden',
          transform: `translateX(-768px)`,
        })
      ),
      transition('expand => none', animate('300ms')),
      transition('none => expand', animate('300ms')),
    ]),
    trigger('loading', [
      state(
        'true',
        style({
          opacity: 1,
        })
      ),
      state(
        'false',
        style({
          opacity: 0,
          display: 'none',
        })
      ),
      transition('true => false', [animate('300ms')]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  // platform detect
  OS = window.navigator.platform
  IOS = ['iPad Simulator', 'iPhone Simulator', 'iPad', 'iPhone']
  IPHONE = ['iPhone', 'iPhone Simulator']
  disableFullpage: boolean = false

  // state and subscriptions
  loading: string = 'true'
  breakpoints: Breakpoint
  filterHidden: boolean = true
  breakpointSubscription: Subscription
  visiblityState$ = new BehaviorSubject<string>('none')
  backdropSub: Subscription
  scrollEvent: Subscription

  // urls
  externals = [
    { name: 'GitHub', url: 'https://github.com/shino369' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aw3939' },
    { name: 'Whatsapp', url: 'https://wa.me/85252362806' },
    { name: 'Email', url: 'mailto:anthonywong3939@gmail.com' },
  ]

  // slides data
  slides = [
    {},
    {
      title: 'About Me',
      img: 'https://pbs.twimg.com/media/EQh9aLXUcAAUc_G.jpg',
      description:
        '\n\nAnthony Wong\n\nGraduated from City University of Hong Kong with a BEng in Information Engineering.\n\nEnthusiastic about learning new techs.\n\nA quick learner. Learn whatever is needed.\n\nExperienced in both frontend and backend development (well, excepts devops.)\n\nJLPT N1 certified.',
    },
    {
      title: 'Work Experience',
      description:
        'DEVELOPER\nAppicIDEA IT Solutions Limited\nSep 2021 - Present\nWeb application and app development\n---------------------\nASSOCIATE SOFTWARE ENGINEER\nThales\nJul 2021 - Sep 2021\nRCS Software Team. Software development, QA Testing',
    },
    {
      title: 'Skills',
      description:
        'PROGRAMMING LANGUAGES:\nTypescript, Javascript(ES6), Java, C++, MATLAB\n---------------------\nFRAMEWORKS/LIBRARIES:\nAngular 2+, React Native(functional), GSAP, RxJS, Bootstrap 4.5+, J2EE(Servlet), Spring Boot, Mybatis Plus\n---------------------\nDATABASES:\nPostgreSQL, Microsoft SQL Server\n---------------------\nLANGUAGES:\nChinese - Cantonese, Chinese - Mandarin, English, Japanese',
    },
    {
      title: 'Projects Participated',
      description:
        '3Tech OwlEye System (Front + Backend)\n\nThe Hong Kong Club Online Library System (Front)\n\nJockey Club All Brillants Carers Project (RN APP)\n\nJDCLab (RN APP)',
    },
    {
      title: 'Contact Me',
      email: ['anthonywong3939@gmail.com', 'mailto:anthonywong3939@gmail.com'],
      whatsapp: ['(+852)52362806', 'https://wa.me/85252362806'],
      linkedin: [
        'https://www.linkedin.com/in/aw3939',
        'https://www.linkedin.com/in/aw3939',
      ],
    },
  ]
  // slides
  keyArr: any = []
  activeSlide: number = 0

  // opening text
  words = ['HELLO.', "I'M ANTHONY WONG.", 'A DEVELOPER.']
  cursor: any
  masterTl: any
  boxTl: any

  // scroll related
  yBefore = 0
  yAfter = 0
  yCurrent = 0

  constructor(
    private breakpointsService: BreakpointsService,
    private metaService: Meta,
    private cdref: ChangeDetectorRef
  ) {
    this.metaService.addTag({
      property: 'og:image',
      content:
        'https://i.pinimg.com/originals/c9/72/f0/c972f0909879d3ce4137c7140e26922c.jpg',
    })
  }

  ngOnInit(): void {
    if (
      this.IOS.includes(navigator.platform) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    ) {
      this.disableFullpage = true
      console.log('disabled fullpage')
    }

    this.breakpointSubscription =
      this.breakpointsService.breakpointsSubject.subscribe(
        (breakpoints: Breakpoint) => {
          this.breakpoints = breakpoints
          // console.log(this.breakpoints)
          this.parallax(true)
        }
      )

    this.scrollEvent = fromEvent(window, 'scroll')
      .pipe(debounceTime(50))
      .subscribe(() => {
        if (this.loading === 'false') {
          this.activeSlide = round(window.scrollY / window.innerHeight)
          // if (!this.disableFullpage) {
          //   this.scroll(this.keyArr[this.activeSlide])
          // }
        }
      })
    this.subBackdrop()
  }

  ngAfterViewInit(): void {
    document.body.style.overflow = 'hidden'
    gsap.registerPlugin(ScrollTrigger, TextPlugin)
    if (this.loading === 'true') {
      this.nameEffect()
    }
    this.parallax()
    this.textEffect()

    // setTimeout(() => {
    //   this.cursor?.kill()
    //   this.loading = 'false'
    //   window.scrollTo(0, 0)
    //   this.activeSlide = round(window.scrollY / window.innerHeight)
    //   this.quoteEffect()
    // }, 12000)
  }

  ngAfterViewChecked(): void {
    this.cdref.detectChanges()
  }

  ngOnDestroy(): void {
    if (this.backdropSub) this.backdropSub.unsubscribe()
    if (this.breakpointSubscription) this.breakpointSubscription.unsubscribe()
    if (this.scrollEvent) this.scrollEvent.unsubscribe()
  }

  skip() {
    this.masterTl.kill()
    this.boxTl.kill()
    this.cursor?.kill()
    document.body.style.overflow = 'auto'
    setTimeout(() => {
      this.loading = 'false'
      // window.scrollTo(0, 0)
      this.activeSlide = round(window.scrollY / window.innerHeight)
      this.quoteEffect()
    }, 200)
  }

  subBackdrop() {
    this.backdropSub = this.visiblityState$.subscribe(state => {
      // console.log(state)
      if (state === 'expand') {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    })
  }
  clickHidden(goback?: boolean) {
    if (this.visiblityState$.value === 'none') {
      this.visiblityState$.next('expand')
    } else {
      this.visiblityState$.next('none')
    }
    this.filterHidden = !this.filterHidden
  }

  parallaxMap: any = {}

  parallax(reset?: boolean) {
    if (reset) {
      console.log('reset')
      for (let key in this.parallaxMap) {
        this.parallaxMap[key].kill()
      }
    }
    //Loop over all the sections and set animations
    gsap.utils.toArray('.section').forEach((section: any, i) => {
      // Set the bg variable for the section

      if (!reset) {
        this.keyArr.push(section)

        section.bg = section.querySelector('.bg')
        section.textWrapperL = section.querySelector('.textWrapperL')
        section.textWrapperR = section.querySelector('.textWrapperR')
        section.sectionTitleL = section.querySelector('.sectionTitleL')
        section.sectionTitleR = section.querySelector('.sectionTitleR')

        // Give the backgrounds some random images
        section.bg.style.backgroundImage = `url(https://picsum.photos/${1280}/${720}?random=${i}&blur=${3})`
      }

      // Do the parallax effect on each section
      if (!this.IPHONE.includes(navigator.platform)) {
        console.log('enabled parallax')
        // Set the initial position for the background
        section.bg.style.backgroundPosition = `50% ${-window.innerHeight / 2}px`
        this.parallaxMap[`bg${i}`] = gsap.to(section.bg, {
          backgroundPosition: `50% ${window.innerHeight / 2}px`,
          ease: 'none', // Don't apply any easing function.
          scrollTrigger: {
            // Trigger the animation as soon as the section comes into view
            trigger: section,
            // Animate on scroll/scrub
            scrub: true,
          },
        })
      }

      if (section.textWrapperL) {
        this.parallaxMap[`textL${i}`] = gsap.to(section.textWrapperL, {
          x: () =>
            //window.innerWidth / 2 - section.textWrapperL.offsetWidth / 2,
            '2%',
          // alignSelf: 'center',
          duration: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: section.textWrapperL,
            start: 'center bottom',
            end: 'center 60%',
            scrub: 1,
          },
        })
      }

      if (section.textWrapperR) {
        this.parallaxMap[`textR${i}`] = gsap.to(section.textWrapperR, {
          x: () =>
            // -(window.innerWidth / 2 - section.textWrapperR.offsetWidth / 2),
            '-2%',
          // alignSelf: 'center',
          duration: 3,
          // rotation: 360,
          ease: 'none',
          scrollTrigger: {
            // Trigger the animation as soon as the section comes into view
            trigger: section.textWrapperR,
            // Animate on scroll/scrub
            start: 'center bottom',
            end: 'center 60%',
            scrub: 1,
          },
        })
      }

      if (section.sectionTitleL) {
        // console.log(section.sectionTitleR)
        this.parallaxMap[`titleL${i}`] = gsap.to(section.sectionTitleL, {
          x: () =>
            // -(window.innerWidth * 0.75 - section.sectionTitleL.offsetWidth),
            '-5%',
          duration: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: section.sectionTitleL,
            start: 'center bottom',
            end: 'center 60%',
            scrub: 1,
            // markers: true,
          },
        })
      }

      if (section.sectionTitleR) {
        this.parallaxMap[`titleR${i}`] = gsap.to(section.sectionTitleR, {
          x: () =>
            //window.innerWidth * 0.75 - section.sectionTitleR.offsetWidth,
            '5%',
          duration: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: section.sectionTitleR,
            start: 'center bottom',
            end: 'center 60%',
            scrub: 1,
          },
        })
      }
    })
    // console.log(this.parallaxMap)
  }

  textEffect() {
    gsap.utils.toArray('.gs_reveal').forEach((elem: any) => {
      this.hide(elem) // assure that the element is hidden when scrolled into view

      ScrollTrigger.create({
        trigger: elem,
        onEnter: () => {
          this.animateFrom(elem)
        },
        onEnterBack: () => {
          this.animateFrom(elem, -1)
        },
        onLeave: () => {
          this.hide(elem)
        }, // assure that the element is hidden when scrolled into view
      })
    })
  }

  quoteEffect() {
    const quote = gsap.timeline()

    quote
      .to('.quote-wrapper', {
        transform: 'scaleX(1)',
        duration: 1,
        ease: 'power2.inOut',
      })
      .to('.quote', {
        opacity: 1,
        duration: 3,
        ease: 'power2.inOut',
      })
  }

  nameEffect() {
    this.masterTl = gsap.timeline({ repeat: -1 }).pause()
    this.boxTl = gsap.timeline()
    this.cursor = gsap.to('.cursor', {
      opacity: 0,
      ease: 'power2.inOut',
      repeat: -1,
    })
    this.boxTl
      .to('.box', {
        duration: 1,
        width: '100%',
        delay: 0,
        ease: 'power4.inOut',
      })
      .to('.hello-abs', {
        duration: 0.5,
        y: 0,
        ease: 'power3.out',
      })
      .to('.box', {
        duration: 1,
        height: '100%',
        // ease: 'elastic.out',
        onComplete: () => {
          this.masterTl.play()
        },
      })
      .to('.box', {
        duration: 1,
        autoAlpha: 0.7,
        yoyo: true,
        repeat: -1,
        ease: "rough({ template: none.out, strength:  1, points: 20, taper: 'none', randomize: true, clamp: false})",
      })
    this.words.forEach(word => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 })
      tl.to('.typing', {
        duration: 1,
        text: word,
        onComplete: () => {
          if (word === 'A DEVELOPER.') {
            this.masterTl.kill()
            this.boxTl.kill()
            setTimeout(() => {
              document.body.style.overflow = 'auto'
              this.cursor?.kill()
              this.loading = 'false'
              window.scrollTo(0, 0)
              this.activeSlide = round(window.scrollY / window.innerHeight)
              this.quoteEffect()
            }, 500)
          }
        },
      })
      this.masterTl.add(tl)
    })
  }

  animateFrom(elem: any, _direction?: number) {
    const direction = _direction || 1
    var x = 0,
      y = direction * 1000
    if (elem.classList.contains('gs_reveal_fromLeft')) {
      x = -100
      y = 0
    } else if (elem.classList.contains('gs_reveal_fromRight')) {
      x = 100
      y = 0
    }
    elem.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    elem.style.opacity = '0'
    gsap.fromTo(
      elem,
      { x: x, y: y, autoAlpha: 0 },
      {
        duration: 1.25,
        x: 0,
        y: 0,
        autoAlpha: 0.7,
        ease: 'expo',
        overwrite: 'auto',
      }
    )
  }

  hide(elem: any) {
    gsap.set(elem, { autoAlpha: 0 })
  }

  scroll(el: HTMLElement) {
    smoothscroll.polyfill()
    el.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  private debouncedOnScroll = _.debounce(
    (deltaY: number) => {
      // console.log(deltaY)
      const offset = round(window.scrollY / window.innerHeight)
      if (deltaY >= 20) {
        this.activeSlide =
          this.keyArr.length - 1 === offset ? offset : offset + 1
      } else if (deltaY < -20) {
        this.activeSlide = offset === 0 ? offset : offset - 1
      } else {
        this.activeSlide =
          this.keyArr.length - 1 === offset ? offset : offset + 1
      }
      this.scroll(this.keyArr[this.activeSlide])
    },
    50,
    {}
  )

  goTo(url: string) {
    window.open(url, '_blank')
  }

  onTouchStart(event: any) {
    this.yBefore = event.touches[0].clientY
  }

  onTouchEnd(event: any) {
    this.yAfter = event.changedTouches[0].clientY
    let offset = this.yBefore - this.yAfter
    if (this.yBefore - this.yAfter < 20 && this.yBefore - this.yAfter > -20) {
      this.yBefore < window.innerHeight / 2 ? (offset = -21) : (offset = 21)
    }
    if (this.visiblityState$.value !== 'expand') {
      this.debouncedOnScroll(offset)
    }
  }

  @HostListener('wheel', ['$event'])
  onScroll(event: any) {
    // console.log(event)
    if (event.type === 'wheel' && !this.disableFullpage) {
      event.preventDefault()
      if (this.visiblityState$.value !== 'expand' && this.loading === 'false') {
        this.debouncedOnScroll(event.deltaY)
      }
    }
  }
}
