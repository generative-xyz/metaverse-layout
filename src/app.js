import './app.scss'
import { _EMIT_EVENT_, PAGE_ENTER, PAGE_LOADED } from '@Libs/emit-event'
import { ThreeApp } from '@ThreeSketch/three-app'

class App {
  constructor() {

    new ThreeApp()
    //fake
    window.addEventListener('load', () => {
      _EMIT_EVENT_.emit(PAGE_LOADED)
      _EMIT_EVENT_.emit(PAGE_ENTER)
    })
  }
}

new App()
