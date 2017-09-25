let $ = (function() {
    let styleElement,
        animationList = []
    function $(element) {
        if(this instanceof $){
            if(typeof element === 'object'){
                this.el = element
            }
            this.id = Math.random().toString().slice(2,6)
        }else{
            return new $(element)
        }
    }
    $.prototype = {
        constructor: $,
        animate(inQueue, cssText, duration = '1s', easing = 'ease', callback = ()=>{}) {
            // 立即开始执行的动画
            if(!inQueue){
                let removeAnimation = () => {
                    this.el.style.cssText += cssText
                    this.clearStyle(this.id)
                    callback()
                    this.el.removeEventListener('animationend', removeAnimation)
                }
                this.el.addEventListener('animationend', removeAnimation)
                this.id = Math.random().toString().slice(2,6)
                let pre = getComputedStyle(this.el).animation,
                    comma = pre.length <= 0 ? '' : `${pre},`,
                    now = comma + `play${this.id} ${duration} ${easing}`
                addCSSRule(`.animate${this.id}{animation: ${now};transform: translate3d(0)}`)
                addCSSRule(`@keyframes play${this.id}{100%{${cssText}}}`)
                this.el.classList.add(`animate${this.id}`)
                console.log(getComputedStyle(this.el).animation)
            }else{
                animationList.push({    // 加入队列的动画
                    cssText,
                    duration,
                    easing,
                    callback
                })
                return this                
            }
        },
        animateOnece(cssText, duration = '1s', easing = 'ease', callback = ()=>{}) {
            let removeAnimation = () => {
                this.el.style.cssText += cssText
                this.clearStyle(this.id)
                callback()
                this.el.removeEventListener('animationend', removeAnimation)
            }
            this.el.addEventListener('animationend', removeAnimation)
            this.id = Math.random().toString().slice(2,6)
            addCSSRule(`.animate${this.id}{animation: play${this.id} ${duration} ${easing};transform: translate3d(0)}`)
            addCSSRule(`@keyframes play${this.id}{100%{${cssText}}}`)
            this.el.classList.add(`animate${this.id}`)
        },
        start() {
            let len = animationList.length
            if(len <= 0){
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