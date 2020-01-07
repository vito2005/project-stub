modules.define('e-accordion', ['i-bem-dom'], function(provide, bemDom) {

    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            'js' : {
                'inited' : function() {
                    debugger
                    console.log(this.domElem[0].outerHTML);
                }
            }
        }
    }));

});
