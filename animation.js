var $ = (function() {
    function $(query) {
        if(this instanceof $){
            try {
                this.el = document.querySelectorAll(query)
            } catch (error) {
                this.el = {}
            }
        }else{
            return new $(query)
        }
    }
    return $
})()