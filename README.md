# js-animation-engine
基于CSS3的js动画引擎

#### 功能介绍：
**$(element)**: 构造函数，elment为dom元素，返回新创建的动画对象，可直接调用下列的方法

**.animate(cssText [, duration ] [, easing ] [, callback ] )**:类似于jq的animate自定义动画，第一个是字符串参数，cssText，要变形的css参数；
duration（默认值1s），单独数字代表动画执行的秒数；easing是缓动函数，默认ease，值与css标准参数相同；callback为动画结束后执行的回调函数

**.hide( [ duration ] [, easing ] [, callback ])**:隐藏当前元素，可选参数duration为隐藏动画持续的秒数，默认1s；easing为缓动函数，默认ease，callback为回调

**.show( [ duration ] [, easing ] [, callback ])**:参数同hide

**.toggle( [ duration ] [, easing ] [, callback ])**:如果当前为隐藏，则将元素显示，否则将元素隐藏

**.fadeTo(opacity [, duration = 0.5] [, ease = 'ease'] [, callback] )**:改变当前元素透明度，opacity为目标透明度值

**.changePlayState()**:暂停或继续播放当前帧的动画

**.finish()**:清空当前动画队列
