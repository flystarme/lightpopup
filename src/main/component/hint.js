import lang from '../lang.js'

export default (content, options) => {
    options = options || {}
    const {close} = options

    delete options.close //移除关闭回调，否则会覆盖默认的关闭回调逻辑，将会在实际dom移除前进行回调

    //如果是loading则清空所有的hint并赋默认内容
    if (options.icon == 'loading'){
        document.querySelectorAll('.light-popup-hint').forEach(el => {
            el.remove()
        })

        if (!content){
            content = lang.loading
        }
    }

    const gap = 15 //每个hint之间的距离

    //获取最后一个hint
    const lastHints = document.querySelectorAll('.light-popup-hint')
    const lastHint = lastHints[lastHints.length - 1] || null

    //hint停留时间（实际显示的时间可能超出这个时间，因为必须要等待上一个hint显示结束）
    //loading不添加默认关闭时间
    const stayTime = options.autoClose || (options.icon != 'loading' ? 3000 : 0)

    //开始显示的时间
    const showTime = Date.now()

    //获取元素的margin-top值
    const getElementMarginTop = el => {
        return +el.style.marginTop.replace('px', '')
    }

    //判断是否是hint popup
    const isHint = el => {
        return el.classList.contains('light-popup-hint')
    }

    let closeTimer //如果时间还没到，那么就添加这个计时器，等到点了再执行关闭

    const popup = LightPopup({
        title: false,
        content,
        autoClose: stayTime,
        maskOpacity: 0,
        close(focusClose){
            let prevHint, startMargin, stopMargin, distance, duration, startTime

            //获取上一个提示dom
            const getPrev = () => {
                const prevEl = popup.el.previousElementSibling
                return prevHint = prevEl && isHint(prevEl) ? prevEl : null
            }

            //先获取上一个hint
            getPrev()

            //如果还有上一个hint，说明在这里考虑滑动动画，因为前面已经注册了上一个元素观察器，会自动调整位置
            if (prevHint){
                return false
            }

            //只有当前是第一个hint时才需要执行下面代码

            function animate(time) {
                const elapsed = time - startTime //过去的时间
                const progress = Math.min(elapsed / duration, 1) //进度计算

                const currentMargin = startMargin - distance * progress

                //如果已经到达停止位置，那么就移除这个元素
                if (currentMargin <= stopMargin){
                    if (currentMargin <= 0){
                        const nextHint = popup.el.nextElementSibling

                        popup.el.remove()

                        //移除后触发下一个元素的关闭
                        nextHint && isHint(nextHint) && nextHint.autoClose && nextHint.close()
                    }
                    return
                }

                popup.el.style.marginTop = `${currentMargin}px`

                if (progress < 1) {
                    requestAnimationFrame(animate)
                }
            }

            //计算一下自动关闭时间，如果时间还没到，那么就添加一个计时器，等到点了再执行关闭
            let leftShowTime = stayTime - (Date.now() - showTime)

            if (leftShowTime > 0 && !focusClose){
                clearTimeout(closeTimer)
                closeTimer = setTimeout(() => {
                    popup.el.close()
                }, leftShowTime)
            }else{
                typeof close === 'function' && close.call(this, ...arguments)

                if (!prevHint){
                    popup.el.classList.add('light-popup-closing')
                }

                //当前marinTop
                startMargin = getElementMarginTop(popup.el)

                //移动后的marginTop
                stopMargin = prevHint ? getElementMarginTop(prevHint) : (startMargin - gap - popup.el.children[0].clientHeight)

                distance = startMargin - stopMargin //移动的距离
                duration = popup.animateTime //移动消耗的时间
                startTime = performance.now()

                requestAnimationFrame(animate)
            }

            return false
        },
        ...options
    }, 'hint')

    if (!lastHint){
        // 如果是第一个hint，直接设置margin-top值
        popup.el.style.marginTop = `${gap}px`
    }else{
        // 如果不是第一个hint，需要监听上一个hint的margin-top值变化，然后设置当前hint的margin-top值

        //根据上一个hint的margin-top值计算当前hint的margin-top值
        const marginTop = () => {
            return getElementMarginTop(lastHint) + lastHint.children[0].clientHeight + gap + 'px'
        }

        //注册一个观察器，观察前一个hint的margin-top值变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    //上一个margin-top变化后，设置当前hint的margin-top值
                    popup.el.style.marginTop = marginTop()
                }
            })
        })

        observer.observe(lastHint, { attributes: true, attributeFilter: ['style'] })

        //刚插入元素时先设置一个margin-top值
        popup.el.style.marginTop = marginTop()
    }
    
    return popup
}