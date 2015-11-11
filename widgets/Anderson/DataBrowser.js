define(["dojo/_base/declare",
					"esri/dijit/geoenrichment/DataBrowser",
    			"dojo/on", "dojo/text!./DataBrowser.html",
			    'dijit/_WidgetBase',
    			'dijit/_TemplatedMixin',
    			'dijit/_WidgetsInTemplateMixin', 
    			"dojo/domReady!"],
    			function(declare, DataBrowser,on, template, _WidgetBase,_TemplateMixin,_WidgetsInTemplateMixin){
    				return declare([_WidgetBase,_TemplateMixin,_WidgetsInTemplateMixin],{
    					templateString:template,
    					
    					DataBro: function(){
					    	this.inherited(arguments);
					    	
					    	var databrowser= new DataBrowser({
					    		countryID: "PR",
					    		countryBox:true,
					    		cancelButton:'cancel',
					    		backButton:'back',
					    		okButton:'ok'
					    		}, template.dataBrowser);
					    		
					    		on(databrowser, 'ok', function (evt) {
					                var selection = databrowser.selection;
					                console.log(selection);
					
					            });
					        on(databrowser, 'back', function (evt) {
					                var selection = databrowser.selection;
					                console.log(selection);
					            });
					        on(databrowser, 'cancel', function (evt) {
					        				//myDialog.hide();
					                var selection = databrowser.selection;
					                console.log(selection);
					            });
					    	databrowser.startup();	    	

					    }
    				});
    			});
