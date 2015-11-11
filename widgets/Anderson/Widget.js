var listToQuery = [];
var listAnterior = [];
var fullList;

var serviceUrl = "http://www.mapas.gmtgis.net/arcgis/rest/services/Mapas/EstablecimientosComerciales/MapServer/1";
var serviceUrl2 = "http://www.mapas.gmtgis.net/arcgis/rest/services/Mapas/EstablecimientosComerciales/MapServer/0";
var SubWhere;
var tipoChanged = false;
var barrioChanged = false;
var municipioChanged = false;
var ZipChanged = false;
var AreaChanged = false;
var informacion;
var ReferenceLayer;
var LayerComercios;
var circle;
var circleSymb;
var radio;
var latPoint;
var isAnterior= false;
var grid;
var establecimientosArray = [];
var isEdit= false;
var firstTimer = true;
var referenciasMarker;
var comerciosMarker;
var finishWork="";
var lastWork="";
define(['./CustomList/CustomList','dijit/registry','./ComboBox/ComboBox','dijit/form/FilteringSelect','dojo/_base/declare',
  'jimu/BaseWidget','dojo/on',
  'dojo/dom-style','dojo/_base/lang',
  "dijit/Dialog", "dijit/_WidgetsInTemplateMixin",
  "dojo/parser", "dijit/form/Button", 
  "dijit/form/TextBox", "dijit/form/DateTextBox", 
  "dijit/form/TimeTextBox","dojo/on", "dojo/text!./DataBrowser.html",
  "esri/dijit/geoenrichment/DataBrowser","dojo/dom-construct", "./QueryHelper",
  "dijit/focus", "esri/layers/FeatureLayer","esri/symbols/SimpleFillSymbol", "esri/Color",
  "esri/tasks/query", "esri/layers/Domain","esri/request", "./WhereGen","./LayerHelper",
  "esri/geometry/Circle","esri/symbols/SimpleLineSymbol","esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/store/Memory",
  "dojox/grid/EnhancedGrid","dojo/data/ItemFileWriteStore", "./TreeView/TreeView",
  
  "dijit/layout/TabContainer", "dijit/layout/ContentPane","dijit/form/_AutoCompleterMixin",
	"dojo/domReady!"],
function(CustomList, registry, ComboBox, FilteringSelect, declare, BaseWidget, on, domStyle, lang, 
        Dialog, _WidgetsInTemplateMixin, parser, Button, 
				TextBox,DateTextBox,TimeTextBox,on,template, DataBrowser, domConstruct, 
				QueryHelper, FocusTool, FeatureLayer, SimpleFillSymbol, Color, Query, Domain,request, 
				WhereGen, LayerHelper, Circle, SimpleLineSymbol, SimpleRenderer, SimpleMarkerSymbol, Graphic,
				Memory, EnhanceGrid, ItemFileWriteStore, TreeView) {
  var clazz = declare([BaseWidget], {
   // templateString: '<div>This is a very simple widget. ' +
  //  '<input type="button" value="Get Map Id" data-dojo-attach-event="click:_getMapId">.</div>',
  templateString:template,
  
  myDialog: null,
  ErrorDialog: null,
  tree:null,
  treeComercios:null,
  box:null,
  justCruising: true,
  dataList:null,
  
  treeCheckItems: [],
  treeCheckedItemsComercios:[],
  selectedComerceArray:[],
  
  selectedComerceStore: null,

  NAICS:[{id:"categorias", name:"Seleccione Categoría", label:"Seleccione categoría"}],
    _getMapId: function(){
      alert(this.map.id);
    },
    
   startup: function(){
   		parser.parse();
   		//pase.parse();
   		
   		
   		
   		var whereClause = "TIPO='0'";
    	var fieldRange = ["MUNICIPIO"];
    	var whereClause1 = "OBJECTID>='0'";
    	var field = ["TIPO"];
    	var order =["MUNICIPIO"];
    	var orderTipo=["TIPO"];
    	QueryHelper.ExecuteQuery(serviceUrl, whereClause1, field, false,true,
            function(error){console.log(error);}, 
            function(featureSet){
            	  console.log(featureSet.features);
            	  //var featureLayer = new FeatureLayer(serviceUrl);

      	      	var i;
					    	for (i=0; i < featureSet.features.length; i++){
							     var opt = document.createElement('option');
						       opt.innerHTML= informacion.layers[1].types[i].name;/*featureSet.features[i].attributes["TIPO"] +" - "+*/
						       opt.value = featureSet.features[i].attributes["TIPO"];
						    	 this.tipo.appendChild(opt);
						    	 //var njijiji = getName(featureSet.features[i].attributes["TIPO"]);
						    	 //var jijiji = featureLayer.getDomain("SUBTIPO").name;
					    	}


        		},orderTipo);
        QueryHelper.ExecuteQuery(serviceUrl, whereClause, fieldRange, false,true,
            function(error){
            	console.log(error);
            	}, 
            function(featureSet){
            	  console.log(featureSet.features);
      	      	var i;
					    	for (i=0; i < featureSet.features.length; i++){
							     var opt = document.createElement('option');
						       opt.innerHTML=featureSet.features[i].attributes["MUNICIPIO"];
						       opt.value = featureSet.features[i].attributes["MUNICIPIO"];
						    	 this.municipio.appendChild(opt);
					    	}

        		},order);
        		console.log(informacion);
        		//look for the reference layer to use : Puntos de Referencias
        referenceLayer = LayerHelper.GetFeatureLayerByName(this.map, "Puntos de Referencias");
        LayerComercios = LayerHelper.GetFeatureLayerByName(this.map, "Establecimientos Comerciales");
        //LayerComercios.setVisibility(false);
	  		referenciasMarker = new SimpleMarkerSymbol(
		      SimpleMarkerSymbol.STYLE_CIRCLE, 
		      12, 
		      new SimpleLineSymbol(
		        SimpleLineSymbol.STYLE_NULL, 
		        new Color([0,0,0]), 
		        1
		      ),
		      new Color([255, 128,0, 0.8])
		    );
		    
		    comerciosMarker = new SimpleMarkerSymbol(
		      SimpleMarkerSymbol.STYLE_CIRCLE, 
		      12, 
		      new SimpleLineSymbol(
		        SimpleLineSymbol.STYLE_NULL, 
		        new Color([0,0,0]), 
		        1
		      ),
		      new Color([153, 0, 153, 0.8])
		    );
		    //set the new markers
        LayerComercios.setSelectionSymbol(comerciosMarker); 
    		var nullSymbol = new SimpleMarkerSymbol().setSize(0);
    		LayerComercios.setRenderer(new SimpleRenderer(nullSymbol));
        referenceLayer.setSelectionSymbol(referenciasMarker); 
    		referenceLayer.setRenderer(new SimpleRenderer(nullSymbol));
				//LayerComercios.hide();
        
        //************************Load of items for the dropdown of the comercio layer
      	var whereClause3 = "NAICS_CODE>=0";
	  		var fieldRange3 = ["NAICS_CODE, NAICS_DESCRIPTION"];
	  		var order3 = ["NAICS_DESCRIPTION"];
	  		QueryHelper.ExecuteQuery(serviceUrl2, whereClause3, fieldRange3, false,true,
          function(error){
          	console.log(error);
          	}, 
          lang.hitch(this, function(featureSet){
          	  console.log(featureSet.features);
          	  
		           for (var i=0; i< featureSet.features.length; i++)
				        {
				          var stringOfId = String(featureSet.features[i].attributes["NAICS_CODE"]);
				          var description = featureSet.features[i].attributes["NAICS_DESCRIPTION"];
				          this.NAICS.push({id:stringOfId, name:description, label:description});
				        	// var opt = document.createElement('option');
				        	// opt.innerHTML = featureSet.features[i].attributes["NAICS_DESCRIPTION"];
				        	// opt.value = featureSet.features[i].attributes["NAICS_DESCRIPTION"];
				        	// this.ZipCodeList2.appendChild(opt);

				        }
				        
				        this.NAICS.splice(1, 1);
				        var store = ComboBox.ComboBoxMemory(this.NAICS);
				        //this.box = ComboBox.CreateComboBox(store);      
				        //this.box.placeAt(this.typesOfCommerce);
	              this.box = new FilteringSelect({
                id:"typesOfCommerce",
                name:"Comercios",
                value:"categorias",
                autoComplete: true,
                autoWidth:true,
                store: store,
                searchAttr:"name",
                onChange: lang.hitch(this, function(){
                            if(this.box){
                              var currentValue = this.box.get('displayedValue');
                              this.ProcessAndRecord(currentValue);  
                             }
                         })
                //labelAttr: "label",
                //labelType: "text"
              }, this.typesOfCommerce);
        				        
				        this.box.startup();
				        
    

      		}),order3);
        		
        	//*********en of load for items in comercio layer
	    ErrorDialog = new Dialog({
      	title: "Error",
      	style: "width:300px"
      });
   },

    postCreate: function(){
    	//parser.parse();
    	//pase.parse();
    	//var databrowser= new DataBrowser();
    	var DataDiv = '<div data-dojo-attach-point="db" data-dojo-attach-id="db" style="width:90%; height:90%; border: 1px solid #A8A8A8;"></div>';
    	
    	//var node = domConstruct.create("div");
    	
    	//DataBrowser.DataBro();
    	var layerRequest = request({
    		"url": "https://www.mapas.gmtgis.net/arcgis/rest/services/Mapas/EstablecimientosComerciales/MapServer/layers",
    		"content":{f: "json"},
    		"handleAs": "json",
    		"callbackParamName": "callback"
    	});
    	
    	layerRequest.then(
    		function(response){
    			console.log("Success: ", response);
    			informacion = response;
    		}, function(error){
    			console.log("error: ", error.message);
    		}
    	);
    	
    	TreeView.CreateStore();//create the store memory for the Treview;
	    this.tree = TreeView.CreateTree();
	    this.tree.placeAt(this.treeViewBody);
	    this.tree.on("checkBoxClick", lang.hitch(this,this.CheckBoxIsClicked));
	    this.tree.startup();
	    
	    TreeView.CreateStoreComercios();
	    this.treeComercios = TreeView.CreateTreeComercio();
	    this.treeComercios.placeAt(this.treeViewBodyComercios);
	    this.treeComercios.on("checkBoxClick", lang.hitch(this,this.CheckBoxComercios));
	    this.treeComercios.on("click", lang.hitch(this,this.ItemClicked));
	    this.treeComercios.startup();
    	
    	on(this.btnAdd, "click", lang.hitch(this, this.addQuery));
    	//on(this.borrar, "click", lang.hitch(this, this.selection));
      
    	on(this.someter,"click",lang.hitch(this,this.submitQuery));
    	on(this.retroceder,"click", lang.hitch(this,this.backup));
    	on(this.borrarTodo,"click", lang.hitch(this,this.limpiarSearch));
//    	on(this.map, "extentChange", lang.hitch(this, this.ExtentChange));
    	dojo.connect(this.map, "onExtentChange", lang.hitch(this, this.ExtentChange));
    	//dojo.connect(this.box, 'onChange', this.ProcessAndRecord()); 
    	
   },
   //"<button class='spanDivStyle' data-dojo-attach-event='click:DeleteCommerceType' data-dojo-attach-point='"+ value +"' id='"+ value +"'>"+ value +"</button>";
   ProcessAndRecord: function(value){
     var index = this.selectedComerceArray.indexOf(value);
     if(index == -1)
     {

       this.selectedComerceArray.push(value);
       TreeView.AddToMemoryComercio(value, value, 'tipo', 'R', null);
       this.map.setZoom(15); 
     }
     else{
       console.log("el valor fue escogido");
       alert("el valor ya fue escogido");
     }
     
   },
   


/* each time a checkbox is clicked this function will run 
 executing and drawing the point in the map*/
   CheckBoxIsClicked : function(item, node, event){
     console.log(node);
     this.justCruising = false;
     var test = node.getChildren();
     node.getChildren().forEach(lang.hitch(this,function(node){
     if(node.item.type =="comercio"){
         if(node.get("checked")){
           if(this.treeCheckItems.indexOf(node.item.id)>-1)
           {
             this.treeCheckItems.splice(this.treeCheckItems.indexOf(node.item.id),1);
           }
           this.treeCheckItems.push(node.item.id);
         }
         else{
           console.log(node.item.id);
           var index = this.treeCheckItems.indexOf(node.item.id);
           if(index > -1)
           {
             this.treeCheckItems.splice(index,1);
           }
         }
       }
       else{
         node.getChildren().forEach(lang.hitch(this, function(node){
           if(node.item.type =="comercio"){
             if(node.get("checked")){
               if(this.treeCheckItems.indexOf(node.item.id)>-1)
               {
                 this.treeCheckItems.splice(this.treeCheckItems.indexOf(node.item.id),1);
               }
               this.treeCheckItems.push(node.item.id);
             }
             else{
               console.log(node.item.id);
               var index = this.treeCheckItems.indexOf(node.item.id);
               if(index > -1)
               {
                 this.treeCheckItems.splice(index,1);
               }
             }
           }
         }));
       }
   }));
       this.setFeatures(node);
     //this.treeCheckitem = TreeView.CheckBoxClicked(item, node, event);
   },
   
   CheckBoxComercios:function(item, node, event){
     var items = item;
     var nodes = node;
     domStyle.set(this.showComerces,{display:'block'});
     domStyle.set(this.cucar, {display:'block'});
     this.ShowAllSelectedCommerce(node);
     this.ShowCommerceOnMap();
   },
   
   ItemClicked: function(item, node, event){
     var items = item;
     var nodes = node;
     this.map.centerAndZoom(item.location, 18);
   },
   
   ShowAllSelectedCommerce: function(node){
     node.getChildren().forEach(lang.hitch(this,function(child){//treeCheckedItemsComercios
       if(child.item.type=="comercios"){
         if(node.get("checked")){
           if(this.treeCheckedItemsComercios.indexOf(child.item.id)>-1){
             this.treeCheckItemsComercios.splice(this.treeCheckItemsComercios.indexOf(child.item.id),1);
           }
           this.treeCheckItemsComercios.push(child.item.id);
         }
         else{
           var index = this.treeCheckedItemsComercios.indexOf(child.item.id);
           if(index>-1){
             this.treeCheckItemsComercios.splice(index,1);
           }
         }
       }
     }));
     this.SetFeaturesComercios(node);
   },
   
   ClearAllComercios: function(){
     // domConstruct.empty(this.listaComercios);
     // domConstruct.empty(this.selectedTypes);
     this.selectedComerceStore.setData([]);
     TreeView.ClearStoreCommerce();
   },
   
   SetFeaturesComercios: function(child){
     if(child.item.type=="comercios"){
         if(node.get("checked")){
           if(this.treeCheckedItemsComercios.indexOf(child.item.id)>-1){
             this.treeCheckItemsComercios.splice(this.treeCheckItemsComercios.indexOf(child.item.id),1);
           }
           this.treeCheckItemsComercios.push(child.item.id)
         }
         else{
           var index = this.treeCheckedItemsComercios.indexOf(child.item.id);
           if(index>-1){
             this.treeCheckItemsComercios.splice(index,1);
           }
         }
       }
   },
   
   setFeatures: function(node){
     if(node.item.type =="comercio"){
         if(node.get("checked")){
           if(this.treeCheckItems.indexOf(node.item.id)>-1)
           {
             this.treeCheckItems.splice(this.treeCheckItems.indexOf(node.item.id),1);
           }
           this.treeCheckItems.push(node.item.id);
         }
         else{
           console.log(node.item.id);
           var index = this.treeCheckItems.indexOf(node.item.id);
           if(index > -1)
           {
             this.treeCheckItems.splice(index,1);
           }
         }
       }
   },
   
   
   ShowCommerceOnMap: function(){
     var q = new Query();
     q.objectIds = this.treeCheckedItemsComercios;
     
     LayerComercios.selectFeatures(q,FeatureLayer.SELECTION_NEW);
     
   },
   
    getFilteredList: function(){
      
      this.map.graphics.clear();

      var queryFiltered = new Query();
      queryFiltered.objectIds= this.treeCheckItems;
      
      if(this.treeCheckItems.length > 0)
      {
        referenceLayer.selectFeatures(queryFiltered,FeatureLayer.SELECTION_NEW);
        var location = TreeView.GetFirstPoint(this.treeCheckItems[0]);
        this.map.centerAndZoom(location,14); 
      }
      else{
        this.justCruising= true;
      }
      
      //this.treeCheckItems.splice(0, this.treeCheckItems.length);
    },

   
   ExtentChange: function(extent){
   	var escala = this.map.getScale();
   	var level = this.map.getLevel();
   	var ex = extent;
   	var query = new Query();
   	var queryReference = new Query();
   	query.geometry = extent;
   	queryReference.geometry = extent;
   	if(this.justCruising){
   	  
   	  
     	// if(this.ZipCodeList2.value != "default"){
     		// query.where = "NAICS_DESCRIPTION =" + "'" + this.ZipCodeList2.value + "'";
     	// }
     	var valueTest = this.box.get('displayedValue');
      if(valueTest != "Seleccione Categoría"){
        //query.where = "NAICS_DESCRIPTION =" + "'";
        for(var key in this.selectedComerceArray){
          if(this.selectedComerceArray.hasOwnProperty(key)){
            var obj = this.selectedComerceArray[key];
            query.where += "NAICS_DESCRIPTION= " + "'" + obj + "'";
            var lastItem = this.selectedComerceArray.length - 1;
            if(key != lastItem){
              query.where += " OR ";
            }
            else{
              //query.where += "'";
            }
          }
        }
      }
     	if(finishWork){
     		queryReference.where = finishWork;
     	}
  
     	if(LayerComercios.isVisibleAtScale(escala)){
     		this.map.graphics.clear();
     		//domStyle.set(this.listaDeLosComercios,{display:"block"});
  	   	setTimeout(lang.hitch(this,function(){
     		LayerComercios.queryFeatures(query,lang.hitch(this,this.ExtentResult));
     		}), 1000);
     	}
     	if(referenceLayer.isVisibleAtScale(escala)){
  
  	   	setTimeout(lang.hitch(this,function(){
     		referenceLayer.queryFeatures(queryReference,lang.hitch(this,this.ExtentResultReference));
     		}), 1000);
     	}
   	}
   	else{
   	  console.log("extent ignored");
   	}

   },
   
    ExtentResultReference: function(response){
   	var features = response.features;
   	var inBuffer = [];

   	for(var key in features)
    		{
    			if(features.hasOwnProperty(key))
    			{
    				var obj = features[key];
   					if(obj.geometry){
   						inBuffer.push(obj.attributes[referenceLayer.objectIdField]);
/*   						var opt =  document.createElement('option');

   						opt.innerHTML = obj.attributes.BUSSINES_NAME;
   						opt.value = obj.attributes.OBJECTID;
   						this.listaComercios.appendChild(opt);*/

   					}
    			}
    		}

   	var query2 = new Query();
   	query2.objectIds= inBuffer;

   	referenceLayer.selectFeatures(query2,FeatureLayer.SELECTION_NEW);
   },
   
   ExtentResult: function(response){
   	var features = response.features;
   	var inBuffer = [];
    // for(var i=this.listaComercios.length; this.listaComercios.length>0; i--){
    	// this.listaComercios.remove(i);
    // }
   	for(var key in features)
    		{
    			if(features.hasOwnProperty(key))
    			{
    				var obj = features[key];
   					if(obj.geometry){
   					  TreeView.AddToMemoryComercio(obj.attributes.OBJECTID, obj.attributes.BUSSINES_NAME.trim(),'comercios', obj.attributes.NAICS_DESCRIPTION, obj.geometry); 
 					   }
 					  inBuffer.push(obj.attributes[LayerComercios.objectIdField]);
 					}
  			}
   	var query3 = new Query();
   	query3.objectIds= inBuffer;

   	LayerComercios.selectFeatures(query3,FeatureLayer.SELECTION_NEW);
   },

   
   abrete : function(){
   	//this.myDialog.set("content", );
   	  this.tree.destroy();
      // this.AlFin.appendChild(grid.domNode);
     	// grid.startup();
   	  //this.dialogo.show();
   		//this.dialogo.hidden = true;
   		//this.dialogo.hidden = false;
   		//this.myDialog.show();
   },
   

   //limpiar la busqueda reciente
   limpiarSearch : function(){
   	domConstruct.empty(this.items);
   	listToQuery.splice(0, listToQuery.length);
   	this.ClearAllFields();
   	domStyle.set(this.editSelect,{display:"none"}); 
   },
   
   //SE UTILIZA CON EL LAYER DE COMERCIOS
   tocame: function(e){
   	console.log("nice");
   	//this.map.graphics.clear();
   	// LayerComercios.clear(); this.ZipCodeList2.options[this.ZipCodeList2.selectedIndex].value
   	var defi = "NAICS_DESCRIPTION =" + "'" + this.ZipCodeList2.value + "'";
   	this.map.setZoom(15);
   	//LayerComercios.setDefinitionExpression(defi);

   },
   
   
   
   PresentComercios : function(evt){
   		var symbol = new SimpleMarkerSymbol(
          SimpleMarkerSymbol.STYLE_CIRCLE, 
          12, 
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_NULL, 
            new Color([223, 115, 255, 0.9]), 
            1
          ),
          new Color([223, 115, 255, 0.5])
        );
      LayerComercios.setSelectionSymbol(symbol); 
	    var nullSymbol = new SimpleMarkerSymbol().setSize(0);
	    LayerComercios.setRenderer(new SimpleRenderer(nullSymbol));
	    
  	  circleSymb = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_NULL,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
          new Color([105, 105, 105]),
          2
        ), new Color([255, 255, 0, 0.25])
      );
	   	//LayerComercios.clear();
	   	if(evt != null ||evt != undefined)
	   	{
	   		latPoint = evt.mapPoint;
	   	}
	   	circle = new Circle({
	   		center:latPoint,
	   		geodesic:true,
	   		radius:500,
	   		radiusUnit: "esriMeters"
	   	});
	   	this.map.graphics.clear();
	   	var graphic = new Graphic(circle, circleSymb);
	   	this.map.graphics.add(graphic);
	   	
	   	
	   	var query = new Query();
	   	query.geometry = circle.getExtent();
	   	
	   	LayerComercios.queryFeatures(query,lang.hitch(this,this.SelectInBuffer));
	   	//LayerComercios.queryFeatures(query,lang.hitch(this,this.SelectInBuffer));
   },
   
   SelectInBuffer : function(response){
   	var feature;
   	var features = response.features;
   	var inBuffer = [];
   	
   for (var i=0; i<features.length; i++){
   		feature = features[i];
   		
   		if(circle.contains(feature.geometry)){
   			inBuffer.push(feature.attributes[LayerComercios.objectIdField]);
   		}
   	}
   	
   	var query = new Query();
   	query.objectIds= inBuffer;

   	LayerComercios.selectFeatures(query,FeatureLayer.SELECTION_NEW);
   	LayerComercios.setVisibility(true);
   	//LayerComercios.show();
   },

   /*
    
    * TENGO MUCHO TRABAJO PARA MOSTRAR Y VER LAS COSAS EN ESPECIAL
    * EL DATABROWSER. ESTOY TRABAJANO EN ESO, Y HACER EL REPORTE
    * EL ENHANCED GRID NO ME QUIERE FUNCIONAR COMO DEBE
    * 
    * */
   TestDialog:function(){
    	
    	//lang.hitch(this, this.myDialog.show());
     var	databrowser= new DataBrowser({
	    		countryID: "PR",
	    		countryBox:true,
	    		cancelButton:'cancel',
	    		backButton:'back',
	    		okButton:'ok'
	    		}, this.miData);
	    		databrowser.startup();
    		on(databrowser, 'ok', function (evt) {
                var selection = databrowser.selection;
                console.log(selection);
            });
        on(databrowser, 'back', function (evt) {
                var selection = databrowser.selection;
                console.log(selection);
            });
        on(databrowser, 'cancel', function (evt) {
        				//this.myDialog.hide();
                var selection = databrowser.selection;
                console.log(selection);
            });
	    	
        //databrowser.placeAt(this.datita)  
        //this.myDialog.set('content',databrowser);
     		
    },
    
    addQuery:function(){
    	
  	    //fullList.push({municipio:this.municipio.value,barri:this.barriadas.value,zipCode: this.ZipCodeList.value, ruta:this.urbRutaList.value});
		    //always add the item at the end of the list
		    var tipoDeData;
		    
		    if(this.tipo.value != "" && this.tipo.value != "")
		    {
			    listToQuery.push({tipo:this.tipo.value,municipio:this.municipio.value,barri:this.barriadas.value,zipCode: this.ZipCodeList.value, ruta:this.urbRutaList.value, subtipo:this.Stipo.value, Establecimiento:this.Establecimiento.value});
			    var l = listToQuery.length;
			    var opt = document.createElement('option');
			    for(var key in this.tipo){
			    	if (this.tipo.hasOwnProperty(key)){
			    		var obj = this.tipo[key];
			    		if(obj.tagName.toLowerCase() == "option")
			    		{
				    		if(obj.value == listToQuery[l-1].tipo)
				    		{
				    			tipoDeData = obj.innerHTML;
				    			break;
				    		}
			    		}
			    	}
			    }
			    opt.innerHTML= tipoDeData+" "+listToQuery[l-1].municipio;
			    opt.value = listToQuery[l-1].municipio + "_" + listToQuery[l-1].barri;
			    this.items.appendChild(opt);
			    this.ClearAllFields();
		    }
		    else
		    {
		    	ErrorDialog.set("content","Debe elegir al menos un tipo y un municipio");
		    	ErrorDialog.show();
		    	domStyle.set(this.tipo,{border: "2px solid red"});
		    	domStyle.set(this.municipio,{border: "2px solid red"});
		    }
		    domStyle.set(this.editSelect,{display:"none"}); 
    },
    
    UpdateQuery:function(){
    	var index = this.items.selectedIndex;
    	listToQuery[index].tipo = this.tipo.value;
    	listToQuery[index].municipio = this.municipio.value;
    	listToQuery[index].barri = this.barriadas.val;
    	listToQuery[index].zipCode = this.ZipCodeList.value;
    	listToQuery[index].ruta = this.urbRutaList.value;
    	listToQuery[index].subtipo = this.Stipo.value;
    	listToQuery[index].Establecimiento = this.Establecimiento.value;
    	
    	this.ClearAllFields();

    },
    
    /*this function will add the item selected back to the dropdown boxes
     and reload any information require to allow the user to edit the item 
     based on the previous selected information.*/
    isEditing:true,
    SelectedItemofListToQuery: function(){
    	if(this.isEditing){
	    	var index = this.items.selectedIndex;
	    	var tipo = listToQuery[index].tipo;
	    	var municipio = listToQuery[index].municipio;
	    	tipoChanged = false;
	    	municipioChanged=false;
	    	barrioChanged = false;
	    	ZipChanged =false;
	    	AreaChanged=false;
	    	if(tipo && municipio)
	    	{
	    		tipoChanged=true;
	    		municipioChanged=true;
	    		var deTipo = this.tipo;
	    		deTipo.value = tipo;
	    		var miMun = this.municipio;
	    		miMun.disabled = "";
	    		miMun.value = municipio;
	    		//this.SubTypeMe(); 
	    		isEdit = true;
	    		this.cambioDeMunicipio();
	  		}
	  		this.editSelect.innerHTML = "cancelar";
	  		this.isEditing = false;
	  		domStyle.set(this.btnAdd, {display:"none"});
	  		domStyle.set(this.actualizarCampo, {display:"block"});
  		}
  		
  		else{
  			this.editSelect.innerHTML = "editar";
  			this.ClearAllFields();
	  		domStyle.set(this.btnAdd, {display:"block"});
	  		domStyle.set(this.actualizarCampo, {display:"none"});
  			domStyle.set(this.editSelect,{display:"none"});
  			this.isEditing = true;
  		}
    },
    
    restForEdit: function(){
    	var index = this.items.selectedIndex;
    	var barrio = listToQuery[index].barri;
    	if(barrio)
    	{
    		barrioChanged = true;
    		var br = this.barriadas;
    		br.disabled = "";
    		br.value = barrio;
  		}
    	var zipCode = listToQuery[index].zipCode;
    	if(zipCode)
    	{
    		ZipChanged =true;
    		var zp = this.ZipCodeList;
    		zp.value = zipCode;
    		zp.disabled = "";}
    	var UrbRuta = listToQuery[index].ruta;
    	if(UrbRuta)
    	{
    		AreaChanged=true;
    		var ur = this.urbRutaList;
    		ur.disabled=""
  		}
  		
  		this.SubTypeMe();

    },
    
    subTypesEdit : function(){
    	var index = this.items.selectedIndex;
    	var SubtType = listToQuery[index].subtipo;
    	if(SubtType)
    	{
    		this.Stipo.value = SubtType;
    		domStyle.set(this.Stipo, {display:"block"});
  		}
    	var Lugar = listToQuery[index].Establecimiento;
    	if(Lugar)
    	{
    		domStyle.set(this.Establecimiento, {display:"block"});
    		this.Establecimiento.value = Lugar;
    	}
    	isEdit=false;
    	this.ModifyEstablecimientos; 
    },
    
    GetLastQuery: function(){
    	domStyle.set(this.requestInfo,{display:'none'});
    	
  	  domStyle.set(this.Results,{display:'block'});
/*
    	if(lastWork){
    		
    		finishWork = lastWork;
    		listToQuery = listAnterior;
    		isAnterior = true;
    		this.submitQuery();
    	}*/

    },
    
    //submit query and divide results in detail for count information
    submitQuery: function(){ 
    	//lastWork= finishWork;
    	//listAnterior = listToQuery;
    		finishWork = WhereGen.WhereBuilder(listToQuery);

    	var fieldRange = ["*"];
    	var orderBy = ["OBJECTID"];

/*
    	referenceLayer.setDefinitionExpression(finishWork);
    	referenceLayer.show();*/

    	
    	QueryHelper.ExecuteQuery(serviceUrl, finishWork, fieldRange, true,false,
            function(error){
            	console.log(error);
            	}, 
	            lang.hitch(this, function(featureSet){
	            	  console.log(featureSet.features);
	            	  fullList = featureSet.features;
	            	  //domConstruct.empty(this.tableBody);
  	  						domConstruct.empty(this.tableBodyGross);
	            	  var added =[];
	            	  var exist=false;
	            	  var row = domConstruct.toDom("<tr><td class='ter'>"+"Total values obtained"+": "+"</td><td class='ter2'>"+featureSet.features.length+"</td></tr>")
	            	  this.map.centerAndZoom(featureSet.features[0].geometry, 14);
	        	  		domConstruct.place(row,this.tableBodyGross);
	        	  		//TreeView.AddRootToMemory("R", "Total: "+featureSet.features.length ,"result", null);
	        	  		/*
            	    listAnterior = listToQuery;*/
            	    //var tree = new TreeView({data:listToQuery}).placeAt(this.treeViewBody);
            	    //TreeView.CreateStore();
            	    
            	    //TreeView.CleanMemory();
									//tree.startup();
	        	  		
	            	  //obtain gross count by category and total
	            	  for(var i=0; i< listToQuery.length; i++)
	            	  {
	            	  	var counter = 0;
	          	  		if (added.length == 0 || added.length == undefined)
	          	  		{
	          	  			added.push("");
	          	  		}
	          	  		for(var j=0; j<added.length;j++){
	          	  			if(listToQuery[i].tipo == added[j])
	          	  			{
	          	  				exist = true;
	          	  				j = added.length-1;
	          	  			}
	          	  			else 
	          	  			{exist = false;}
	          	  		}
	          	  		
	          	  		if(!exist){
	          	  		  var firstCount=0;
	          	  		  for(var n=0;n< featureSet.features.length; n++)
                      {
                        if(String(featureSet.features[n].attributes["TIPO"]) == listToQuery[i].tipo)
                        {
                          firstCount++;
                        }
                      }
	          	  		  
	          	  			var idParent = listToQuery[i].tipo;
	          	  			var nameParent = firstCount +"  "+ informacion.layers[1].types[parseInt(listToQuery[i].tipo)].name;
	          	  			var typeParent = 'tipoLocal';
	          	  			var parentParent = "R";
	          	  			
	          	  			TreeView.AddToMemory(idParent, nameParent,typeParent,parentParent, null);
	          	  			var tempListForMunicipio= [];
	          	  			for(var key in listToQuery){
	          	  			  if(listToQuery.hasOwnProperty(key)){
	          	  			    var obj = listToQuery[key];
	          	  			    var exist2=false;
	          	  			    
	          	  			    if(tempListForMunicipio.length == 0){
	          	  			      tempListForMunicipio.push({municipio: obj.municipio, tipo: obj.tipo});
	          	  			      TreeView.AddToMemory(obj.municipio+"_"+obj.tipo, obj.municipio, "municipios", obj.tipo, null);
	          	  			    }
	          	  			    else{
	          	  			      //for design to avoid duplicate errors
	          	  			      for(key in tempListForMunicipio){
	          	  			        if(tempListForMunicipio.hasOwnProperty(key)){
	          	  			          var ob = tempListForMunicipio[key];
	          	  			          if(ob.municipio==obj.municipio && ob.tipo==obj.tipo){
	          	  			            exist2=true;
	          	  			          }
	          	  			        }
	          	  			      }
	          	  			      if(!exist2){
	          	  			        TreeView.AddToMemory(obj.municipio+"_"+obj.tipo, obj.municipio, "municipios", obj.tipo, null);
	          	  			        tempListForMunicipio.push({municipio: obj.municipio, tipo: obj.tipo})
                            }
                            
	          	  			      // var index = tempListForMunicipio.indexOf(obj.municipio);
	          	  			      // if(index == -1){
	          	  			        // tempListForMunicipio.push(obj.municipio);
	          	  			        // TreeView.AddToMemory(obj.municipio, obj.municipio, "municipios", obj.tipo, null);
	          	  			      // }
	          	  			    }
	          	  			  }
	          	  			}
	          	  			
	          	  			for(var n=0;n< featureSet.features.length; n++)
		            	  	{
		            	  		if(String(featureSet.features[n].attributes["TIPO"]) == listToQuery[i].tipo)
		            	  		{
		            	  			counter++;
			          	  			var idChild = featureSet.features[n].attributes["OBJECTID"];
			          	  			var nameChild = featureSet.features[n].attributes["NOMBRE"];
			          	  			var typeChild = 'comercio';
			          	  			var parentChild = featureSet.features[n].attributes["MUNICIPIO"] +"_"+ featureSet.features[n].attributes["TIPO"];//listToQuery[n].municipio;
			          	  			var geom = featureSet.features[n].geometry;
			          	  			TreeView.AddToMemory(idChild, nameChild, typeChild, parentChild, geom);
		            	  		}
		            	  	}
		            	  	var row = domConstruct.toDom("<tr><td class='ter'>"+informacion.layers[1].types[parseInt(listToQuery[i].tipo)].name+": "+"</td><td class='ter2'>"+counter+"</td></tr>")
		          	  		domConstruct.place(row,this.tableBodyGross);
		          	  		added.push(listToQuery[i].tipo);
	          	  		}
	            	  	
	            	  }
	            	  
	            	  //Divide in detail            	  
	            	  for(var i=0; i< listToQuery.length; i++)
	            	  {
	            	  	var counter = 0;
	            	  	for(var n=0;n< featureSet.features.length; n++)
	            	  	{
	            	  		if(String(featureSet.features[n].attributes["TIPO"]) == listToQuery[i].tipo && String(featureSet.features[n].attributes["MUNICIPIO"]) == listToQuery[i].municipio)
	            	  		{
	            	  			counter++;
	            	  		}
	            	  	}
	            	  	// var row = domConstruct.toDom("<tr><td class='ter'>"+informacion.layers[1].types[parseInt(listToQuery[i].tipo)].name+" en "+listToQuery[i].municipio+": "+"</td><td class='ter2'>"+counter+"</td></tr>")
	          	  		// domConstruct.place(row,this.tableBody);
	            	  }
	            	  
	            	  domStyle.set(this.requestInfo,{display:'none'});
	            	  domStyle.set(this.Results,{display:'block'});
            	    
            	    //start tree after all data has been set
            	    //TreeView.AddChildren();
            	    // var tree = TreeView.SetData();
            	    // tree.placeAt(this.treeViewBody);
            	    // tree.startup();
            	    this.tree.expandAll();

            	    //create grid with data
            	    var data = {
							      identifier: 'id',
							      items: []
							    };
							    var rows = fullList.length;
							    for(var i=0, l=fullList.length; i<rows; i++){
							      data.items.push(dojo.mixin({ id: i+1 }, fullList[i%l]));
							    }
/*
							    var store = new ItemFileWriteStore({data: data});//var store = new MemoryStore({data: data});
							    var layout = [[
							      {'name': 'id', 'field': 'id'},
							      {'name': 'barrio', 'field': 'BARRIO'},
							      {'name': 'Municipio', 'field': 'MUNICIPIO'},
							      {'name': 'Tipo', 'field': 'TIPO'}
							    ]];
							   
					     		grid = new EnhanceGrid({
							        id: 'grido',
							        store: store,
							        structure: layout,
							        rowSelector: '20px'},
							        document.createElement('div'));
							    //****************************************/

        			}),orderBy);
    },
    
    
    OnMapClickCircle: function(evt){
    	/* this is the fucntion to create a circle 
    	 * and show all inside that circle*/
   		var symbol = new SimpleMarkerSymbol(
          SimpleMarkerSymbol.STYLE_CIRCLE, 
          12, 
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_NULL, 
            new Color([223, 115, 255, 0.9]), 
            1
          ),
          new Color([223, 115, 255, 0.5])
        );
      referenceLayer.setSelectionSymbol(symbol); 
	    var nullSymbol = new SimpleMarkerSymbol().setSize(0);
	    referenceLayer.setRenderer(new SimpleRenderer(nullSymbol));
	    
			var circleFill = new SimpleFillSymbol(
				SimpleFillSymbol.STYLE_NULL,
				new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
				new Color([105, 105, 105]),
				2
				), new Color([255, 255, 0, 0.25]));
				
			radio = new Circle({
				center:evt.mapPoint,
				radius:1,
				radiusUnit:"esriMiles"
			});
			
			this.map.graphics.clear();
			this.map.infoWindow.hide();
			var roundShape = new Graphic(radio, circleFill);
			this.map.graphics.add(roundShape);
			
			var query = new Query();
			query.geometry = radio.getExtent();
			
			//referenceLayer
			this.map.centerAndZoom(evt.mapPoint, 14);
			//referenceLayer.queryFeatures(query,lang.hitch(this,this.Buffer));
			
			

    },
      
   Buffer : function(response){
		
	   	var feature;
	   	var features = response.features;
	   	var inBuffer = [];
	   	
	   	for (var i=0; i<features.length; i++){
	   		feature = features[i];
	   		
	   		if(radio.contains(feature.geometry)){
	   			inBuffer.push(feature.attributes[referenceLayer.objectIdField]);
	   		}
	   	}
	   	
	   	var query = new Query();
	   	query.objectIds= inBuffer;
	
	   	referenceLayer.selectFeatures(query,FeatureLayer.SELECTION_NEW);
	   	referenceLayer.setVisibility(true);
	   	var graphicTEtsing = referenceLayer.graphics;
	   	
	   	//referenceLayer.refresh();
	   	//LayerComercios.show();
	  
   },
   
   
    //retroceder al tab anterior de informacion
    backup:function(){
/*
  	  domConstruct.empty(this.tableBody);
  	  domConstruct.empty(this.tableBodyGross);*/

    	domStyle.set(this.requestInfo,{display:'block'});
    	
  	  domStyle.set(this.Results,{display:'none'});
  	  TreeView.ClearStore();
  	  this.justCruising= true;
  	  if(!lastWork){
  	  	lastWork = finishWork;
  	  }
    	//domStyle.set(this.lastSearch , {display:"block"});
  	  this.limpiarSearch();
    },

    ActivateEditButton:function(){
    	if(this.isEditing){
    		domStyle.set(this.editSelect,{display:"block"});
    		domStyle.set(this.borrar,{display:"block"});
			}
    },
    
    selection: function(){
	    //When deleting an item, also delete it from the main list
	    //and reload the list to always maintain the same order in the 
	    //display and in the list
	    var id = this.items.selectedIndex;
	    
	    this.items.remove(this.items.selectedIndex);
	    listToQuery.splice(id,1);
	    for(var i=this.items.length;i>=0; i--)
	    {
	        this.items.remove(i);
	    }
	    for(var i=0; i<listToQuery.length;i++)
	    {
	        var opt = document.createElement('option');
	        opt.innerHTML= listToQuery[i].municipio + " " + listToQuery[i].barri;
	        opt.value = listToQuery[i].municipio + "_" + listToQuery[i].barri;
	        this.items.appendChild(opt);
	    }
	    domStyle.set(this.editSelect,{display:"none"}); 
    },
    
    ClearAllFields: function(){
    	var BarrioLength = this.barriadas.options.length;
    	for (var i=BarrioLength-1; i>=1;i--)
	    {
	        this.barriadas.remove(i);
	        
	    }
	    this.barriadas.disabled = "disabled";
    	
			var municipios = this.municipio;
			municipios.selectedIndex = 0;
	    this.municipio.disabled = "disabled";
    	var ZipCodeLength = this.ZipCodeList.options.length;
	    for (var i=ZipCodeLength-1; i>=1;i--)
	    {
	        this.ZipCodeList.remove(i);
	    }
	    this.ZipCodeList.disabled ="dissabled";
    	var UrbLength= this.urbRutaList.options.length;
	    for (var i=UrbLength-1; i>=1;i--)
	    {
	        this.urbRutaList.remove(i);
	    }
	    this.urbRutaList.disabled ="disabled";
    	var SubtypeLength = this.Stipo.options.length;
	    for (var i=SubtypeLength-1; i>=1;i--)
	    {
	        this.Stipo.remove(i);	    
      }
	    this.Stipo.disabled = "disabled";
      var tipejo = this.tipo;
    	tipejo.selectedIndex = 0;
    	
    	domStyle.set(this.Subtipos,{display:"none"});
    	domStyle.set(this.SubDiv2,{display:"none"});
    	domStyle.set(this.editSelect,{display:"none"}); 
    },
    

    //modify establecimientos based on subtipo
    ModifyEstablecimientos: function(){
    	//var estlargo = this.Establecimiento.length; .options[this.Stipo.selectedIndex]
    	var est = this.Stipo.value;
    	
    	for(var i=this.Establecimiento.options.length;i>=1;i--)
		  {
		  	this.Establecimiento.remove(i);
		  }
		  
		  for(var key in establecimientosArray){
		  	if(establecimientosArray.hasOwnProperty(key)){
		  		var object = establecimientosArray[key];
		  		if(object.attributes["SUBTIPO"] == est){
		  			var opt = document.createElement('option');
		  			opt.innerHTML = establecimientosArray[key].attributes["NOMBRE"];
		  			opt.value = establecimientosArray[key].attributes["NOMBRE"];
		  			this.Establecimiento.appendChild(opt);
		  		}
		  	}
		  }
    },

    
    //Change the barrios DropDown based on the municipio 
    ChangeBarrios : function(featuresSet){
    	
    	var things = this.barriadas.options.length;
    	barrioChanged = false;
		    for (var i=things-1; i>=1;i--)
		    {
		        this.barriadas.remove(i);
		    }
    	
    	for (var i = 0; i <featuresSet.features.length; i++)
						    {
						        var opt = document.createElement('option');
						        opt.innerHTML = featuresSet.features[i].attributes["BARRIO"];
						        opt.value = featuresSet.features[i].attributes["BARRIO"];
						
						        this.barriadas.appendChild(opt);
						        
						
						    }
    },
    
    //Zip Codes Based on The municipio
    ChangeZipCodes : function(featuresSet){
    	ZipChanged = false;
	    for(var i=this.ZipCodeList.options.length; i>=1;i--)
		    {
		        this.ZipCodeList.remove(i);
		    }
    	for (var i = 0; i <featuresSet.features.length; i++)
						    {
						        var opt = document.createElement('option');
						        opt.innerHTML = "00"+featuresSet.features[i].attributes["Zip"];
						        opt.value = "00"+featuresSet.features[i].attributes["Zip"];
						        this.ZipCodeList.appendChild(opt);
						        
						    }
    },
    
    //Areas based on Municipio
    ChangeAreas : function(featuresSet){
    	AreaChanged = false;
	    for(var i= this.urbRutaList.options.length; i>=1; i--)
		    {
		        this.urbRutaList.remove(i);
		    }
	    for (var i = 0; i <featuresSet.features.length; i++)
						    {
						        var opt = document.createElement('option');
						        opt.innerHTML = featuresSet.features[i].attributes["NOMBRE_AREA"];
						        opt.value = featuresSet.features[i].attributes["NOMBRE_AREA"];
						
						        this.urbRutaList.appendChild(opt);
						    }
       if(isEdit)
       {
       		this.restForEdit();
	     }
    },
    
    ChangeSubTipos : function(featuresSet){
    	
	    for(var i=this.Stipo.options.length; i>=1; i--)
	    {
	    	this.Stipo.remove(i);
	    }
		  for(var i=this.Establecimiento.options.length;i>=1;i--)
		  {
		  	this.Establecimiento.remove(i);
		  }
		  establecimientosArray.splice(0,establecimientosArray.length);//clean the array for a new subtype		  
		  /*-------------NO DEPENDER DEL SUBTIPO Y AGREGAR EL NOMBRE--------------------
		   ---------------------------------------------------------------------------
		   -------------------------------------------------------------------------
		   -------------------------------------------------------------------------*/ 
		  var SubArray = []; 
    	for (var i = 0; i <featuresSet.features.length; i++)
						    {
						        var opt = document.createElement('option');
						        var opt2 = document.createElement('option');
						        var codedValuesArray;
						        var subclasses = [2,8,9,10,11,12,13,35];
						        var tipo = featuresSet.features[i].attributes["TIPO"];
						        //establecimientosArray.splice(0,establecimientosArray.length);//clean the array for a new subtype
						        var getInfoFrominformacion = false;
						        
						        //Obtain an array of objects with the names of th4e subtypes for the selected type
						        if (subclasses.indexOf(tipo) > -1)
						        {
						        	codedvaluesArray = informacion.layers[1].types[tipo].domains.SUBTIPO["codedValues"];
						        	//codedvaluesArray.forEach(function getname())
						        	getInfoFrominformacion = true;
						        }
						        else if(tipo == '0' || tipo == '36')
						        {
						        	codedvaluesArray = informacion.layers[1].fields[2].domain["codedValues"];
						        	//codedvaluesArray.forEach(function getname())
						        	getInfoFrominformacion = true;
						        }
						        
						        //if it obtained the subtypes, add the subtypes to the dropdownList
						        if(getInfoFrominformacion)
						        {
						        	for(var key in codedvaluesArray){
						        		if(codedvaluesArray.hasOwnProperty(key)){
						        			var obj = codedvaluesArray[key];
						        			if(obj.code == featuresSet.features[i].attributes["SUBTIPO"])
						        			{
						        				if(SubArray.indexOf(obj.name) == -1)
						        				{
						        					opt.innerHTML = obj.name;
							        				opt.value = obj.code;
							        				this.Stipo.appendChild(opt);
							        				SubArray.push(obj.name);
						        				}
						        				
						        			}
						        		}
						        	}
						        	
						        	
						        	/* Me quede aqui agregando los exstablecimientos con los subtipos
						        	 * incluidos para que puedan elegis establecimiento expecifico. */
						        	if(featuresSet.features[i].attributes["NOMBRE"].trim().length >0)
						        	{
						        		opt2.innerHTML = featuresSet.features[i].attributes["NOMBRE"];
						        		opt2.value = featuresSet.features[i].attributes["NOMBRE"];
						        		establecimientosArray.push(featuresSet.features[i]);
						        		this.Establecimiento.appendChild(opt2);
						        	}
						        	
						        	domStyle.set(this.Subtipos,{display:"block"});
						        	this.Stipo.disabled = "";
						        	domStyle.set(this.SubDiv2, {display:"block"});
						        	this.Establecimiento.disabled = "";
		        	        
						        
						        }
						        
						        if(!getInfoFrominformacion)
						        {
						        	opt.innerHTML = featuresSet.features[i].attributes["NOMBRE"];
						        	opt.value = featuresSet.features[i].attributes["NOMBRE"];
						        	this.Establecimiento.appendChild(opt);
						        	domStyle.set(this.Subtipos,{display:"none"});
						        	domStyle.set(this.SubDiv2,{display:"block"});
						        	this.Establecimiento.disabled = "";
						        }

						    }
						    // if(isEdit)
					      // {
					      		// this.subTypesEdit();
						    // }
    },
    
    findName : function(thing){
    	var length = informacion.layers[1].types[this.tipo.value].domains.SUBTIPO.codedValues.length;	
    	for (var i=0 ; i< length ; i++)
    	{
    		if(informacion.layers[1].types[this.tipo.value].domains.SUBTIPO.codedValues[i].code == thing )
    		{
    			return informacion.layers[1].types[this.tipo.value].domains.SUBTIPO.codedValues[i].name;
    		}
    	}
    	
    	//informmacion.layers[1].types[this.tipo.value].domains.SUBTIPO.
    },
    
    
    determineSubtype : function(type){
    	
    	var styles = informacion.layers[1].types[type].domains.SUBTIPO.type;
    	
    	if(styles == "inherited")
    	{}
    	else if (styles == "codedValue")
    	{}
    	
    },

    tipoIndicator : function(){
    	//referenceLayer.refresh();
    	//referenceLayer.redraw();
    	//this.map.graphics.redraw();
    	//this.map.graphics.refresh();
    	tipoChanged = true;
    	lang.hitch(this,this.municipio.disabled = "");
    	domStyle.set(this.tipo,{border: "1px solid gray"});
    	if(tipoChanged && this.municipio.selectedIndex != 0){
    		this.SubTypeMe();
    	}
    	
    },
    barrioIndicator : function(){
    	barrioChanged = true;
    	if(tipoChanged && municipioChanged){
    		this.SubTypeMe();
    	}
    },
    ZipIndicator : function(){
    	ZipChanged = true;
    	if(tipoChanged && municipioChanged){
    		this.SubTypeMe();
    	}
    },
    AreaIndicator: function(){
    	AreaChanged = true;
    	if(tipoChanged && municipioChanged){
    		this.SubTypeMe();
    	}
  	},
    
    SubTypeMe: function(){

    		console.log('hora de los subtipos');
    		if(ZipChanged && AreaChanged && barrioChanged )
    		{
    			var mun = this.municipio.value; 
    			var tip = this.tipo.value; 
    			var bar = this.barriadas.value; 
    			var zip = this.ZipCodeList.value; 
    			var nma = this.urbRutaList.value; 
    			SubWhere="Municipio ='"+mun+"' AND TIPO='"+tip+"' AND BARRIO='"+bar+"' AND ZIP='"+zip+"' AND NOMBRE_AREA='"+nma+"'";
    			
    		}
    		else if(ZipChanged && AreaChanged && !barrioChanged)
    		{
    			var mun = this.municipio.value; 
    			var tip = this.tipo.value;
    			
    			var zip = this.ZipCodeList.value; 
    			var nma = this.urbRutaList.value;
    			SubWhere="Municipio ='"+mun+"' AND TIPO='"+tip+"' AND ZIP='"+zip+"'AND NOMBRE_AREA='"+nma+"'";
    		}
    		else if(ZipChanged && !AreaChanged && barrioChanged)
    		{
    			var mun = this.municipio.value; 
    			var tip = this.tipo.value; 
    			var bar = this.barriadas.value; 
    			var zip = this.ZipCodeList.value; 
    			
    			SubWhere="Municipio ='"+mun+"' AND TIPO='"+tip+"' AND BARRIO='"+bar+"' AND ZIP='"+zip+"'";
    		}
    		else if (ZipChanged && !AreaChanged && !barrioChanged)
    		{
    			var mun = this.municipio.value; 
    			var tip = this.tipo.value; 
    			var zip = this.ZipCodeList.value; 
    
    			SubWhere="Municipio ='"+mun+"' AND TIPO='"+tip+"' AND ZIP='"+zip+"'";
    		}
    		else if(!ZipChanged && AreaChanged && barrioChanged)
    		{
    			var mun = this.municipio.value; 
    			var tip = this.tipo.value; 
    			var bar = this.barriadas.value;
    			var nma = this.urbRutaList.value;
    			SubWhere="Municipio ='"+mun+"' AND TIPO='"+tip+"' AND BARRIO='"+bar+"' NOMBRE_AREA='"+nma+"'";
    			}
    		else if(!ZipChanged && AreaChanged && !barrioChanged)
    		{
    			var mun = this.municipio.value; 
    			var tip = this.tipo.value;
    			var nma = this.urbRutaList.value;
    			SubWhere="Municipio ='"+mun+"' AND TIPO='"+tip+"' AND NOMBRE_AREA='"+nma+"'";
    		}
    		else if(!ZipChanged && !AreaChanged && barrioChanged)
    		{
    			var mun = this.municipio.value; 
    			var tip = this.tipo.value; 
    			var bar = this.barriadas.value;
    			//options[this.barriadas.selectedIndex].
    			SubWhere="Municipio ='"+mun+"' AND TIPO='"+tip+"' AND BARRIO='"+bar+"'";
  			}
    		else if (!ZipChanged && !AreaChanged && !barrioChanged)
    		{
    			var mun = this.municipio.value; 
    			var tip = this.tipo.value;

    			//var mun = this.municipio.options[this.municipio.selectedIndex].value; 
    			//var tip = this.tipo.options[this.tipo.selectedIndex].value;

    			SubWhere="Municipio ='"+mun+"' AND TIPO='"+tip+"'";
    		}
    		
    		if (SubWhere != null && SubWhere!= undefined && SubWhere.trim() != "")
    		{
    			lang.hitch(this,this.SubtiposCall());
    		}


    },
    /*I'm working here, encontre el problema ahora solo es cueqstyion de 
     repararlo para ver como funciona, lo cual voy a hacer manana*/
    SubtiposCall: function(){
		    
		    var fieldrange = ["TIPO","SUBTIPO", "NOMBRE"];
	    	QueryHelper.ExecuteQuery(serviceUrl, SubWhere, fieldrange, false,true,
		        function(error){
		        	console.log(error);
		        	}, lang.hitch(this,function(featureSet){
		        this.ChangeSubTipos(featureSet);
					    if(isEdit)
				      {
				      		this.subTypesEdit();
					    }
		        }),
		        fieldrange);
    	
    },
    
    //Execute Query everytime Municipio change causing all dropdowns to adjust
    cambioDeMunicipio : function(indicate){
    		municipioChanged = true;
    		domStyle.set(this.municipio,{border: "1px solid gray"});
	    	var newMun = this.municipio.value;
	    	var tip = this.tipo.value;
	    	
	    	//var features=[];
	    	var whereClause = "Municipio='"+ newMun +"' AND TIPO='"+ tip +"'";
	    	var fieldRange1 = ["BARRIO"];
	    	var fieldRange2 = ["ZIP"];
	    	var fieldRange3 = ["NOMBRE_AREA"];
	     
	      //console.log(features);
	    	//+
	    	//remove old info from dropdowns
	 
		    
		    //Execute Queries to refill the dropdowns
	
		    
	    	QueryHelper.ExecuteQuery(serviceUrl, whereClause, fieldRange1, false,true,
	          function(error){console.log(error);}, 
	          lang.hitch(this, this.ChangeBarrios),fieldRange1);
	            
	    	QueryHelper.ExecuteQuery(serviceUrl, whereClause, fieldRange2, false,true,
	          function(error){console.log(error);}, 
	          lang.hitch(this, this.ChangeZipCodes), fieldRange2);
	    	QueryHelper.ExecuteQuery(serviceUrl, whereClause, fieldRange3, false,true,
	          function(error){console.log(error);},
	          lang.hitch(this, this.ChangeAreas),
	          fieldRange3);
		    
				//enable the dropdowns
		    this.barriadas.disabled = "";
		    this.ZipCodeList.disabled = "";
		    this.urbRutaList.disabled = "";
		    
		    if(!isEdit)
		    {
		    	if(tipoChanged && this.municipio.selectedIndex != 0){
		    		this.SubTypeMe();
		    	}
	    	}
    	}	
    	
  });


  return clazz;
});


/* Commenct section for the code used fo the list that show the results
 * in here you will find code that was ised and can be used again if nedded 
 */
//                
              // if(!this.selectedComerceStore){
                // this.selectedComerceStore = ComboBox.ComboBoxMemory([{id:obj.attributes.OBJECTID, name:obj.attributes.BUSSINES_NAME, location:obj.geometry, description: obj.attributes.NAICS_DESCRIPTION}]); 
                // domStyle.set(this.cucar,{display:'block'});
              // }else{
                // var verify = this.selectedComerceStore.get(obj.attributes.OBJECTID);
                // if(!verify){
                  // var ar = {id:obj.attributes.OBJECTID, name:obj.attributes.BUSSINES_NAME, location:obj.geometry, description: obj.attributes.NAICS_DESCRIPTION}};
                  // this.selectedComerceStore.put(ar);
                // }
              // }
//                
              // if(!verify){
//                  
                // CustomList.CSSStyle = 'width: 100%;white-space:normal;border: 1px solid gray;background-color: #E0E0E0;color: #191919;font-size: 1em;margin-bottom: 3px;margin-top:3px;font-weight: 500;font-family: inherit;font-style: inherit;text-decoration: inherit;text-align: left;border-radius:3px;padding:3px';
                // var opt = CustomList.CustomListItem(obj.attributes.BUSSINES_NAME, obj.attributes.OBJECTID);
                // //this.selectedComerceStore
                // this.listaComercios.appendChild(opt);
                // opt.onclick = lang.hitch(this, function(item){
                // var loc = this.selectedComerceStore.get(item.currentTarget.id);
                  // this.map.centerAndZoom(loc.location, 18);
                // });  



       // CustomList.CSSStyle = 'width: 100%;white-space:normal;border: none;background-color: #E0E0E0;color: #191919;font-size: 1em;margin-bottom: 3px;margin-top:3px;font-weight: 500;font-family: inherit;font-style: inherit;text-decoration: inherit;text-align: left;border-radius:3px;padding:3px';
       // var opt= CustomList.CustomListItem(value, value);
       // opt.onclick = lang.hitch(this,function(item){
         // var id = item.currentTarget.id;
         // //this.DeleteComerceOfTypes(id);
         // this.selecteComerceArray.remove(id);
         // this.extentChange(this.map.extent);
       // });
       // this.selectedTypes.appendChild(opt);

/* *******************************************************************\
 * this section of codes are code that were used for trial and error.
 * Code that is not in use but may be used as reference in the future.
 *  
\* *******************************************************************/
	    //use to disable/enable options tag
	    //this.urbRutaList.options[0].disabled = "";
	    //barrio.disabled=false;
	    //zipCode.disabled=false;
	    //urb_ruta.disabled=false;
	    
//    this.municipio.appendChild("Test");

//properties not use in here, added in the manifest.json
  //clazz.hasStyle = false;
  //clazz.hasUIFile = false;
  //clazz.hasLocale = false;
  //clazz.hasConfig = false;

//old code use to fill the dropdowns with dummy data	
	    /*
	    //var lista = municipios2[newMun].barrio.length;
	//    if (municipios2[newMun]!=undefined && (municipios2[newMun].barrio.length !=0|| municipios2[newMun].Zip.length !=0||municipios2[newMun].Urb.length !=0)
	//    {
	    for (var i = 0; i <features.length; i++)
	    {
	        var opt = document.createElement('option');
	        opt.innerHTML = features[i].attributes["BARRIO"];
	        opt.value = features[i].attributes["BARRIO"];
	
	        this.barriadas.appendChild(opt);
	        
	
	    }
	    
	    for (var i = 0; i <features.length; i++)
	    {
	        var opt = document.createElement('option');
	        opt.innerHTML = features[i].attributes["ZIP"];
	        opt.value = features[i].attributes["ZIP"];
	
	        this.ZipCodeList.appendChild(opt);
	        
	
	    }
	    // for (var i = 0; i <municipios2[newMun].Zip.length; i++)
	    // {
	        // var opt = document.createElement('option');
	        // opt.innerHTML = municipios2[newMun].Zip[i];
	        // opt.value = municipios2[newMun].Zip[i];
// 	
	        // this.ZipCodeList.appendChild(opt);
// 	
	    // }
	    for (var i = 0; i <features.length; i++)
	    {
	        var opt = document.createElement('option');
	        opt.innerHTML = features[i].attributes["NOMBRE_AREA"];
	        opt.value = features[i].attributes["NOMBRE_AREA"];
	
	        this.urbRutaList.appendChild(opt);
	        
	
	    }
	    // for (var i = 0; i <municipios2[newMun].Urb.length; i++)
	    // {
	        // var opt = document.createElement('option');
	        // opt.innerHTML = municipios2[newMun].Urb[i];
	        // opt.value = municipios2[newMun].Urb[i];
// 	
	        // this.urbRutaList.appendChild(opt);
// 	
	    // }
	    
	        	
    //	this.myDialog = new Dialog({
    //		title: "myDialog",
    //		content: "<div data-dojo-attach-point='AlFin' style='width: 90%;height: 90%'></div>",
    //		//href: 'widgets/samplewidgets/Simple2/DataBrowser',
    //		parseOnLoad:true,
    //		preLoad : true,
    //		doLayout: true,
    //		refreshOnShow:true,
    //		style:"background-color:white; width:50% !important; height:50% !important;"
    //	});


EXTRAIDO DE CHANGE SUBTIPO
/*
						        if(featuresSet.features[i].attributes["NOMBRE"].trim() == "")
						        {
						        	
						        }
						        else
						        {
						        	opt.innerHTML = featuresSet.features[i].attributes["NOMBRE"];
						        	opt.value = featuresSet.features[i].attributes["NOMBRE"];
						        	this.Stipo.appendChild(opt);
						        }*/

			/*
										if(featuresSet.features[i].attributes["SUBTIPO"] == "N/A" || featuresSet.features[i].attributes["SUBTIPO"] == "" || featuresSet.features[i].attributes["SUBTIPO"] == null)
													{
														opt.innerHTML = featuresSet.features[i].attributes["SUBTIPO"];
														opt.value = featuresSet.features[i].attributes["SUBTIPO"];	
														this.Stipo.appendChild(opt);
																												}
													else{
														//var weirdstuff = this.findName(featuresSet.features[i].attributes["SUBTIPO"]);
														var weirdstuff = this.determineSubtype(featuresSet.features[i].attributes["SUBTIPO"]);
														opt.innerHTML = featuresSet.features[i].attributes["SUBTIPO"] + weirdstuff;
														opt.value = featuresSet.features[i].attributes["SUBTIPO"];	
														this.Stipo.appendChild(opt);
													}
													
			
						//lang.hitch(this,this.findName(featuresSet.features[i].attributes["SUBTIPO"]))

	    */
