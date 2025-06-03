import lang from './lang.js'
import icons from './icons.js'
import alert from './component/alert.js'
import confirm from './component/confirm.js'
import loading from './component/loading.js'
import prompt from './component/prompt.js'
import message from './component/message.js'
import hint from './component/hint.js'
import { setElementHTML } from './utils.js'

//设置快捷方法
const setQuickMethod = name => {
    for(const method of ['success', 'error', 'warning', 'loading']){
        Object.defineProperty(LightPopup[name], method, {
            get(){
                return (content, options) => {
                    options = options || {}
                    options.icon = method
                    return LightPopup[name].call(this, content, options)
                }
            }
        })
    }
}

//创建弹窗元素
const createPopupElement = (options, type) => {
    const {
        maskOpacity = .5, 
        title,
        content,
        buttons = [],
        icon,
        className,
        useHTML = false,
        width,
        onClose,
    } = options

    const popup = document.createElement('div')
    popup.className = 'light-popup'
    popup.style.setProperty('--popup-light-mask-opacity', maskOpacity) // 蒙层透明度

    //给每种弹窗加上专属的class名
    if (type){
        popup.classList.add('light-popup-' + type)
    }

    if (className){
        popup.classList.add(className)
    }

    // 弹窗内容部分
    const popupIn = document.createElement('div')
    popupIn.className = 'light-popup-in'
    popupIn.onclick = e => {
        e.stopPropagation()
    }
    if (width){
        popupIn.style.width = width
    }
    
    // 弹窗头部
    if (title !== false){
        const popupHead = document.createElement('div')
        popupHead.className = 'light-popup-head'

        // 弹窗标题
        const popupTitle = document.createElement('div')
        popupTitle.className = 'light-popup-head-title'
        setElementHTML(popupTitle, title || lang.title, useHTML)

        // 关闭按钮
        const closeButton = document.createElement('div')
        closeButton.className = 'light-popup-close'
        closeButton.innerHTML = icons.close
        closeButton.title = lang.close
        closeButton.onclick = () => {
            if (typeof onClose === 'function' && onClose(popup) === false){
                return
            }
            popup.close()
        }

        popupHead.appendChild(popupTitle)
        popupHead.appendChild(closeButton)
        popupIn.appendChild(popupHead)
    }

    // 弹窗主体
    const popupBody = document.createElement('div')
    popupBody.className = 'light-popup-body'

    if (icon){
        const iconElement = document.createElement('div')
        iconElement.className = 'light-popup-icon'
        iconElement.innerHTML = icons[icon] || icon
        popupBody.appendChild(iconElement)

        if (icons[icon]){
            popupIn.classList.add(`light-popup-has-icon-${icon}`)
        }
    }
    
    const popupContent = document.createElement('div')
    popupContent.className = 'light-popup-content'
    setElementHTML(popupContent, content, useHTML)
    popupBody.appendChild(popupContent)

    // 拼接所有部分
    popupIn.appendChild(popupBody)

    // 弹窗底部 - 动态生成按钮
    if (buttons.length){
        const popupBottom = document.createElement('div')
        popupBottom.className = 'light-popup-bottom'

        //遍历按钮
        for(const v of buttons){
            const btn = document.createElement('button')
            const type = ['default', 'primary', 'error', 'warning', 'success'].includes(v.type) ? v.type : 'primary'

            const loadingOn = () => {
                btn.disabled = true
                btn.insertAdjacentHTML('afterbegin', `<span class="light-popup-button-loading">${icons.loading}</span>`)
            }

            const loadingOff = () => {
                btn.disabled = false
                btn.querySelector('.light-popup-button-loading')?.remove()
            }

            btn.onclick = () => {
                v.onClick(popup, [loadingOn, loadingOff])
            }

            btn.classList.add('light-popup-button', `light-popup-button-${type}`)

            if (typeof v.className === 'string'){
                v.className.split(' ').forEach(v => btn.classList.add(v))
            }else if(Array.isArray(v.className)){
                v.className.forEach(v => btn.classList.add(v))
            }

            btn.innerText = v.text
            popupBottom.appendChild(btn)
        }

        popupIn.appendChild(popupBottom)
    }

    popup.appendChild(popupIn)

    // 将弹窗插入到 body 中
    document.body.appendChild(popup)

    return popup
}

//主函数
const LightPopup = (options, type) => {
    const animateTime = 300
    const {
        closeOnMaskClick = false,
        OnMaskClick,
        close,
        autoClose,
        done,
    } = options
    
    const popup = createPopupElement(options, type)
    
    popup.onclick = () => {
        if (typeof OnMaskClick === 'function' && OnMaskClick(popup) === false){
            return false
        }

        // 点击蒙层关闭弹窗
        if (closeOnMaskClick){
            popup.close()
        }
    }

    //弹窗关闭方法
    popup.close = (...args) => {
        
        if (typeof close === 'function' && close.apply(this, args) === false){
            return
        }

        popup.classList.add('light-popup-closing')

        setTimeout(() => {
            popup.remove()
        }, animateTime)
    }

    if (typeof autoClose === 'number' && autoClose > 0){
        popup.autoClose = autoClose
        setTimeout(() => {
            popup.close()
        }, autoClose)
    }

    typeof done === 'function' && done(popup)

    return {
        el: popup,
        close: popup.close,
        animateTime
    }
}

//设置语言
LightPopup.setLanguage = o => {
    for(const i in o){
        lang[i] && (lang[i] = o[i])
    }
}

LightPopup.alert = alert
LightPopup.loading = loading
LightPopup.confirm = confirm
LightPopup.prompt = prompt
LightPopup.message = message

LightPopup.hint = hint

setQuickMethod('message')
setQuickMethod('alert')
setQuickMethod('hint')

export default LightPopup