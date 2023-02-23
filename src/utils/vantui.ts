import{
  Popup,
}from 'vant';
import {App} from 'vue'

const Vant ={
  install:(app:App):void=>{
    app.use(Popup)
  }
}

export default Vant