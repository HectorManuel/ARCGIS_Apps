define(['dojo/_base/declare',
  'jimu/BaseWidget','dojo/on',
  'dojo/dom-style','dojo/_base/lang',
  "dijit/Dialog", "dijit/_WidgetsInTemplateMixin",
  "dojo/parser", "dijit/form/Button", 
  "dijit/form/TextBox", "dijit/form/DateTextBox", 
  "dijit/form/TimeTextBox","dojo/on", "dojo/text!./DataBrowser.html",
  "esri/dijit/geoenrichment/DataBrowser","dojo/dom-construct", "./QueryHelper",
  "dijit/focus", "esri/layers/FeatureLayer","esri/symbols/SimpleFillSymbol", "esri/Color",
  "esri/tasks/query", "esri/layers/Domain","esri/request", "./WhereGen","./LayerHelper",
  "dijit/layout/TabContainer", "dijit/layout/ContentPane",
	"dojo/domReady!"],
function(declare, BaseWidget, on, domStyle, lang, Dialog, _WidgetsInTemplateMixin, parser, Button, 
				TextBox,DateTextBox,TimeTextBox,on,template, DataBrowser, domConstruct, 
				QueryHelper, FocusTool, FeatureLayer, SimpleFillSymbol, Color, Query, Domain,request, 
				WhereGen, LayerHelper) {
		  return{
		  	
		  	callOfTheQuery: function(){console.log("hoho");},
		  	toca : function(value){
		  		alert("interesting)" + value);
		  	}
		  };
  });