let $ = (function() {
    let styleElement,
        animationList = []
    function $(query) {
        if(this instanceof $){
            if(typeof query === 'string'){
                try {
                    this.el = document.querySelectorAll(query)
                } catch (error) {
                    throw new Error(error)
                }
            }else if(typeof query === 'object'){
                this.el = query
            }
            this.id = Math.random().toString().slice(2,6)
        }else{
            return new $(query)
        }
    }
    $.prototype = {
        constructor: $,
        animate(cssText) {
            window.addEventListener('animationend', ()=>{
                this.el.style.cssText += cssText
                this.el.classList.remove(`animate${this.id}`)
                deleteCSSRule(`.animate${this.id}`)
                deleteKeyframe(`play${this.id}`)
            })
            addCSSRule(`.animate${this.id}{animation: play${this.id} 1s;}`)
            addCSSRule(`@keyframes play${this.id}{100%{${cssText}}}`)
            this.el.classList.add(`animate${this.id}`)
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