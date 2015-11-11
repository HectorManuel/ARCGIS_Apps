define(['jimu/BaseWidget', 
        'dojo/store/Memory', 
        'dijit/form/FilteringSelect',
        'dojo/data/ItemFileReadStore',
        'dojo/parser',
        'dijit/_WidgetsInTemplateMixin',
        'dojo/domReady!'],
function(BaseWidget, Memory, FilteringSelect, 
         ItemFileReadStore, parser, _WidgetsInTemplateMixin){
  return{
    ComboBoxMemory: function(data){
      var storage = new Memory({data:data});
      return storage;
    },
    
    CreateComboBox: function(store){
      var combo = new FilteringSelect({
        id:"typesOfCommerce",
        name:"Comercios",
        value:"categorias",
        autoComplete: true,
        autoWidth:true,
        store: store,
        searchAttr:"name"
        //labelAttr: "label",
        //labelType: "text"
      });
      return combo;
      //in widget.js use place at and then startup;
    }
  };
});
