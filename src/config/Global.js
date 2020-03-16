import Constant from './Constant'
import store from 'store'
window.store = store
const numeric_list = [ 'companyId', 'sdkAppId', 'classId' ]
const restore_keys = [
  'userId',
  'userSig',
  'userToken',
  'token',
  'role',
  'classId',
  'nickname',
]
const auth_keys = [
  'userSig',
  'userToken',
  'token'
]
export default {
  mode : 'product',
  companyId : store.get(Constant.STORAGE_KEY.COMPANYID) || null,
  sdkAppId : store.get(Constant.STORAGE_KEY.SDKAPPID) || null,
  userId : store.get(Constant.STORAGE_KEY.USERID) || null,
  userSig : store.get(Constant.STORAGE_KEY.USERSIG) || null,
  userToken : store.get(Constant.STORAGE_KEY.USERTOKEN) || null,
  token : store.get(Constant.STORAGE_KEY.TOKEN) || null,
  role : store.get(Constant.STORAGE_KEY.ROLE) || null,
  classId : store.get(Constant.STORAGE_KEY.CLASSID) || null,
  // nickname : store.get(Constant.STORAGE_KEY.NICKNAME) || null,
  nickname : null,
  company: store.get(Constant.STORAGE_KEY.COMPANY) || null,
  classPassword: store.get(Constant.STORAGE_KEY.CLASSPASSWORD) || null,
  password: store.get(Constant.STORAGE_KEY.PASSWORD) || null,
  account: store.get(Constant.STORAGE_KEY.ACCOUNT) || null,
  userAccount: store.get(Constant.STORAGE_KEY.USERACCOUNT) || null,
  guestFlag: store.get(Constant.STORAGE_KEY.GUESTFLAG) || null,
  demoLoginInfo: store.get(Constant.STORAGE_KEY.DEMOLOGININFO) || null,
  localStream: null,

  sendMsg: true,
  mic: true,
  camera: true,
  autoPush: true,
  draw: false,
  members: [],

  sendMsgAll: true,
  hasInteract: false,

  get(key){
    // console.error(`no key =>${key}`)
    return this[key];// || store.get( Constant.STORAGE_KEY[key.toUpperCase()] )
  },
  set(key, value){
    if( Constant.STORAGE_KEY[key.toUpperCase()] ){
      store.set(Constant.STORAGE_KEY[key.toUpperCase()], value)
    }
    if (numeric_list.indexOf(key)!==-1) {
      this[key] = value * 1
    } else {
      this[key] = value
    }
  },
  del(key){
    this[key] = null
    store.remove( Constant.STORAGE_KEY[key.toUpperCase()] )
  },

  loginUrl() {
    if( window.Config && window.Config.loginUrl ){
      window.location.href = window.Config.loginUrl+`?classId=${this.classId}`
      return;
    }
    var url = '/login'
    if(this.companyId && this.mode === 'product'){
      url += `/${this.companyId}`
    }
    if(this.classId && this.mode === 'product'){
      url += `/${this.classId}`
    }
    console.debug(`loginUrl => ${url}`)
    return url
  },
  
  clearAuth(){
    auth_keys.forEach(item => {
      store.remove(Constant.STORAGE_KEY[item.toUpperCase()])
      this[item] = null
    })
  },

  clear() {
    restore_keys.forEach(item => {
      this[item] = null
    })
    store.clearAll()
  }
}