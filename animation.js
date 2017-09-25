let $ = (function() {
    let styleElement,
        animationList = []
    animationList.busy = false
    function $(element) {
        if(this instanceof $){
            this.el = element
            this.id = Math.random().toString().slice(2,6)
            this.isHide = false
        }else{
            return new $(element)
        }
    }
    $.prototype = {
        constructor: $,
        animate(cssText, duration = 1, easing = 'ease', callback = ()=>{}) {
            // 加入队列的动画
            animationList.push({    
                cssText,
                duration,
                easing,
                callback
            })
            this.start()
            return this                
        },
        animateOnece(cssText, duration = 1, easing = 'ease', callback = ()=>{}) {
            let removeAnimation = () => {
                this.el.style.cssText += cssText
                this.clearStyle(this.id)
                this.el.removeEventListener('animationend', removeAnimation)
                animationList.busy = false
                callback()
            }
            this.el.addEventListener('animationend', removeAnimation)
            this.id = Math.random().toString().slice(2,6)
            addCSSRule(`.animate${this.id}{animation: play${this.id} ${duration}s ${easing};transform: translateZ(0)}`)
            addCSSRule(`@keyframes play${this.id}{100%{${cssText}}}`)
            this.el.classList.add(`animate${this.id}`)
            animationList.busy = true
        },
        start() {
            let len = animationList.length
            if(len <= 0){
                return
            }
            if(animationList.busy){
                return
            }
            let fireAnimation = () => {
                    if(animationList.length > 0){
                        let {cssText, duration, easing, callback} = animationList[0]
                        this.animateOnece(cssText, duration, easing, callback)
                        animationList.shift()
                    }else{
                        window.removeEventListener('animationend', fireAnimation)
                    }
                }
            window.addEventListener('animationend', fireAnimation)
            fireAnimation()
        },
        // 清除已经完成的keyframe和对应的类
        clearStyle(id){
            this.el.classList.remove(`animate${this.id}`)
            deleteCSSRule(`.animate${this.id}`)
            deleteKeyframe(`play${this.id}`)
        },
        hide(duration = 0.5, ease = 'ease', callback) {
            if(animationList.busy){
                return
            }
            if(!this.isHide){
                this.animate('opacity: 0', duration, ease, callback)
                setTimeout(()=>{
                    this.el.style.display = 'none'
                    this.isHide = true
                }, duration * 1000)
            }
        },
        show(duration = 0.5, ease = 'ease', callback) {
            if(animationList.busy){
                return
            }
            if(this.isHide){
                this.el.style.display = ''
                this.animate('opacity: 1', duration, ease, callback)
                this.isHide = false
            }
        },
        toggle(duration = 0.5, ease = 'ease', callback) {
            if(!animationList.busy){
                this.isHide ? this.show(duration, ease, callback) : this.hide(duration, ease, callback)
            }
        },
        fadeTo(op, duration = 0.5, ease = 'ease', callback) {
            if(!animationList.busy){
                this.animate(`opacity:${op}`, duration, ease, callback)
            }
        },
        changePlayState() {
            state = this.el.style.animationPlayState
            this.el.style.animationPlayState = state === 'paused' ? 'running' : 'paused'
        },
        finish() {
            animationList = []
        }
    }
    function addCSSRule(rule) {
        if(styleElement){
            let len = styleElement.sheet.cssRules.length
            styleElement.sheet.insertRule(rule, len)
        }else{
            styleElement = document.createElement('style')
            styleElement.innerHTML = rule
            document.head.appendChild(styleElement)
        }
    }
    function deleteCSSRule(ruleName, isKeyframe){
        if(styleElement){
            let cssRules = styleElement.sheet.cssRules,
                sheet = styleElement.sheet,
                prop = isKeyframe ? 'name' : 'selectorText'
            for(let i = 0; i < cssRules.length; i++){
                if(cssRules[i][prop] === ruleName){
                    sheet.deleteRule(cssRules[i])
                    console.log(prop, ruleName, 'deleted')
                }
            }
        }
    }
    function deleteKeyframe(keyframeName) {
        deleteCSSRule(keyframeName, true)
    }
    return $
})()