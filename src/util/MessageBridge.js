export default {
    modal: null,
    platform: 'electron',
    generateCallback(prefix, callback) {
        var functionName = prefix + Date.parse( new Date())
        window[functionName] = (index) => {
            callback(index)
        }
        return functionName
    },

    showMessageBox(config) {
        console.log(`showMessageBox ,platform=>${this.platform}`)
        switch(this.platform.toLowerCase()){
            case 'mac':
            case 'windows':
            case 'electron':
                console.debug('showMessageBox callback =>', config.callback)
                window.parent.showMessageBox(config.title, config.options, config.callback)
                break;
            case 'ios':
                if(  window.webkit && window.webkit.messageHandlers ){
                    window.webkit.messageHandlers.showMessageBox.postMessage({
                        title: config.title,
                        options: config.options,
                        function: this.generateCallback('showMessage', config.callback)
                    })
                }
                break;
            case 'android':
                window.container.showMessageBox(JSON.stringify({
                    title: config.title,
                    options: config.options,
                    function: this.generateCallback('showMessage', config.callback)
                }))
                break;
            case 'record':
            case 'web':
                this.modal.props.zIndex.default = 100001
                if( config.options.length > 1 ){
                    this.modal.confirm({
                        title: '温馨提示',
                        content: config.title,
                        okText: config.options[0],
                        closable: true,
                        cancelText:  config.options[1],
                        zIndex:  100003,
                        onOk: () => {
                            if (config.callback) {
                                config.callback(0)
                            }
                        },
                        onCancel: () => {
                            if (config.callback) {
                                config.callback(1)
                            }
                            return;
                        }
                    });
                }else{
                    this.modal.info({
                        title: '温馨提示',
                        content: config.title,
                        okText: config.options[0],
                        closable: true,
                        cancelText:  config.options[1],
                        zIndex:  100003,
                        onOk: () => {
                            if (config.callback) {
                                config.callback(0)
                            }
                        },
                        onCancel: () => {
                            if (config.callback) {
                                config.callback(1)
                            }
                            return;
                        }
                    });
                }
                break;
            default:
                break;
        }
    },

    sendChannel(data) {
        console.log(`sendChannel ,platform=>${this.platform}, type => ${data.type}`)
        switch(this.platform.toLowerCase()){
            case 'mac':
            case 'windows':
            case 'electron':
            case 'miniprogram':
                console.debug('sendChannel electron', data.type , data.data)
                if(window.parent && window.parent.sendChannel){
                    window.parent.sendChannel(data.type, data.data)
                }
                break;
            case 'record':
                console.debug('sendChannel record', data.type , data.data)
                setTimeout( () =>{
                    window.sendChannel(data.type, data.data)
                },10);
                break;
            case 'ios':
                console.debug('sendChannel ios', JSON.stringify(data))
                if( window.webkit && window.webkit.messageHandlers ){
                    window.webkit.messageHandlers.sendChannel.postMessage(data)
                }
                break;
            case 'android':
                console.debug('sendChannel android', JSON.stringify(data))
                if(window.container && window.container.sendChannel){
                    window.container.sendChannel(JSON.stringify(data))
                }
                break;
            default:
                break;
        }
    }
}