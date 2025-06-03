import lang from './lang.js'

const confirm = (options, beforeConfirm) => {
    return {
        text: options.confirmButtonText || lang.confirm,
        type: options.confirmButtonType || 'primary',
        onClick(popup, loadingController){
            let args = []
            if (typeof beforeConfirm === 'function'){
                args = beforeConfirm(popup)
                if (args === false){
                    return
                }

                if (!Array.isArray(args)){
                    args = []
                }
            }

            if (typeof options.onConfirm === 'function' && options.onConfirm.call(this, ...arguments, ...args) === false){
                return
            }

            popup.close()
        }
    }
}

const cancel = options => {
    return {
        text: options.cancelButtonText || lang.cancel,
        type: options.cancelButtonType || 'default',
        onClick(popup, loadingController){
            if (typeof options.onCancel === 'function' && options.onCancel.apply(this, arguments) === false){
                return
            }

            popup.close()
        }
    }
}

export {
    confirm,
    cancel
}