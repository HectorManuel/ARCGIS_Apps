define(['jimu/BaseWidget',
        'dojo/dom-construct',
        'dojo/domReady!'],
  function(BaseWidget, domConstruct){
    return{
      
      CSSStyle: null,
      
      CustomListItem: function(innerText,id){
        var opt = document.createElement('div');
        opt.innerHTML = innerText;
        opt.id=id;
        opt.style.cssText = this.CSSStyle;
        opt.ondblclick = function(item){
          var test = this.id;
          domConstruct.destroy(this.id);
        };
        return opt;     
      },
      
      
    }
  });
