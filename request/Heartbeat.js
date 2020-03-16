class Heartbeat{

  constructor({ classId, request, data}){
    this.$request = request
    this.classId = classId * 1
    this.defaultTimeout = 30 * 1000 // unit : second
    this.timeout = this.defaultTimeout

    this.status = true
    this.sto = null
    this.maxRetry = 10
    this.retryCount = 0
    this.data = data
  }
  beat() {
    clearTimeout( this.sto )
    this.$request.heartbeat( this.data ).then( (res) => {
      this.retryCount = 0
      if (res.data.Response && !res.data.Response.Error) {
        //更新下次上报的时间
        this.timeout = res.data.Response.IntervalTime * 1000 
        this.trigger()
      }else{
        this.trigger()
      }
    }).catch( (e) => {
      this.retryCount ++ 
      // to protect the server , set a maximum retry count 
      if( this.retryCount < this.maxRetry){
        console.error(`heartbeat error , retry times => ${this.retryCount}`, e)
        this.trigger()
      }else{
        console.error(`heartbeat error , retry times => ${this.retryCount} , reach the maximum retry setting`, e)
      }
    })
  }
  
  trigger() {
    clearTimeout( this.sto )
    this.sto = setTimeout( () => {
        this.beat()
    }, this.timeout )
  }
  
  setClassId(classId) {
    this.classId = classId
  }
  
  start() {
    this.beat()
  }
  
  pause() {
    this.status = false;
    clearTimeout( this.sto )
  }
  
  resume() {
    this.status = true;
    this.beat()
  }
  
  destroy() {
    clearTimeout( this.sto )
  }
}

export default Heartbeat;