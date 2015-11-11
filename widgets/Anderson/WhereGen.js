define(['dojo/_base/kernel', 
        'dojo/i18n'
],
function (kernel, i18n) {
    return {
        //Returns a where clause with the listed lstInClauseValues contained within an IN operator.
        //@param (string)inClauseField - The in clause field used for the IN operator
        //@param (Object[])lstInClauseValues - The array of objects to be inside the in operator
        //@return (string) A where clause including an IN operator. 
        //( Example: "inClauseField IN (lstInClauseValues[0], lstInClauseValues[1]...lstInClauseValues[n])" )
        WhereGenerator: function(ArrayToQuery) {
        	var i;
					var columns = ["Municipio","TIPO","BARRIO","ZIP","NOMBRE_AREA","SUBTIPO"];
					var Municipio = "Municipio IN (";
					var Tipo = "TIPO IN (";
					var Barrio = "BARRIO IN (";
					var zip = "ZIP IN (";
					var Area = "NOMBRE_AREA IN (";
					var SubTipo = "SUBTIPO IN (";
					var MunicipioCount = 0;
					var TipoCount = 0;
					var BarrioCount = 0;
					var zipCount = 0;
					var AreaCount = 0;
					var SubTipoCount = 0;
        	var whereClause = "";
        	
        	
        	for (i=0; i<ArrayToQuery.length; i++){
        		console.log(ArrayToQuery[i]);
        		
        		if(ArrayToQuery[i].tipo != null && ArrayToQuery[i].tipo != "" && ArrayToQuery[i].tipo != undefined)
        		{
        			Tipo += "'" + ArrayToQuery[i].tipo +"'"+ ", ";
        			TipoCount++;
        		}
        		if(ArrayToQuery[i].municipio != null && ArrayToQuery[i].municipio != "" && ArrayToQuery[i].municipio != undefined)
        		{
        			Municipio += "'" + ArrayToQuery[i].municipio + "'" + ", ";
        			MunicipioCount++;
        		}
        		if(ArrayToQuery[i].barri != null && ArrayToQuery[i].barri != "" && ArrayToQuery[i].barri != undefined)
        		{
        			Barrio += "'" + ArrayToQuery[i].barri + "'" + ", ";
        			BarrioCount++;
        		}
        		if(ArrayToQuery[i].zipCode != null && ArrayToQuery[i].zipCode != "" && ArrayToQuery[i].zipCode != undefined)
        		{
        			zip += "'" + ArrayToQuery[i].zipCode + "'" + ", ";
        			zipCount++;
        		}
        		if(ArrayToQuery[i].ruta != null && ArrayToQuery[i].ruta != "" && ArrayToQuery[i].ruta != undefined)
        		{
        			Area += "'" + ArrayToQuery[i].ruta + "'"+ ", ";
        			AreaCount++;
        		}
        		if(ArrayToQuery[i].subtipo != null && ArrayToQuery[i].subtipo != "" && ArrayToQuery[i].subtipo != undefined)
        		{
        			SubTipo += "'" + ArrayToQuery[i].subtipo + "'" + ", ";
        			SubTipoCount++;
        		}
        	}
        	
        	if(TipoCount>0)
        	{
        		whereClause = whereClause + Tipo + ")";
        		whereClause = whereClause.replace(", )", ") ");
        	}
        	if(MunicipioCount >0)
        	{
        		whereClause += "AND "+ Municipio + ")";
        		whereClause = whereClause.replace(", )", ") ");
        	}
        	if (BarrioCount>0)
        	{
        		whereClause += "AND "+  Barrio +")";
        		whereClause = whereClause.replace(", )", ") ");
        	}
        	if (zipCount>0)
        	{
        		whereClause += "AND " + zip + ")";
        		whereClause = whereClause.replace(", )", ") ");
        	}
        	if(AreaCount >0)
        	{
        		whereClause += "AND "+  Area + ")";
        		whereClause = whereClause.replace(", )", ") ");
        	}
        	if(SubTipoCount>0)
        	{
        		whereClause += "AND " + SubTipo + ")";
        		whereClause = WhereClause.replace(", )", ") ");
     
        	}
        	

          return whereClause;
        },
        
        WhereBuilder : function(ArrayToQuery){
        	var i;
					var columns = ["Municipio","TIPO","BARRIO","ZIP","NOMBRE_AREA","SUBTIPO"];
					var subclasses = [2,8,9,10,11,12,13,35];
        	var whereClause = "";
        	var clauses ="";
        	var arrClauses = [];
        	for (i=0; i<ArrayToQuery.length; i++){
        		console.log(ArrayToQuery[i]);
        		clauses = "";
        		if(ArrayToQuery[i].tipo != null && ArrayToQuery[i].tipo != "" && ArrayToQuery[i].tipo != undefined)
        		{
        			clauses += "( TIPO = '" + ArrayToQuery[i].tipo+ "'";
        		}
        		if(ArrayToQuery[i].municipio != null && ArrayToQuery[i].municipio != "" && ArrayToQuery[i].municipio != undefined)
        		{
        			clauses += " AND Municipio = '" + ArrayToQuery[i].municipio +"'";
        		}
        		if(ArrayToQuery[i].barri != null && ArrayToQuery[i].barri != "" && ArrayToQuery[i].barri != undefined)
        		{
        			clauses += " AND BARRIO = '" + ArrayToQuery[i].barri + "'";
        		}
        		if(ArrayToQuery[i].zipCode != null && ArrayToQuery[i].zipCode != "" && ArrayToQuery[i].zipCode != undefined)
        		{
        			clauses += " AND ZIP = '" + ArrayToQuery[i].zipCode + "'";
        		}
        		if(ArrayToQuery[i].ruta != null && ArrayToQuery[i].ruta != "" && ArrayToQuery[i].ruta != undefined)
        		{
        			clauses += " AND NOMBRE_AREA = '" + ArrayToQuery[i].ruta + "'";
        		}
        		if(ArrayToQuery[i].subtipo != null && ArrayToQuery[i].subtipo.trim() != "" && ArrayToQuery[i].subtipo != undefined)
        		{
        			
        			clauses += " AND SUBTIPO = '" + ArrayToQuery[i].subtipo + "'";
        		}
        		if(ArrayToQuery[i].Establecimiento != null && ArrayToQuery[i].Establecimiento.trim() != "" && ArrayToQuery[i].Establecimiento != undefined)
        		{
        			
        			clauses += " AND NOMBRE = '" + ArrayToQuery[i].Establecimiento + "'";
        		}
        		clauses += ")";
        		
        		arrClauses.push(clauses);
        		if(i==0)
	        		{
	        			whereClause = clauses;
	        		}
      			else
        			{
        				whereClause += " OR " + clauses;
        			}
        			
        		
        	}
        	
        	
        	return whereClause;
        },
        //new function
    };
});

//tipo:          this.tipo.value
//municipio:     this.municipio.value
//barri:         this.barriadas.value
//zipCode:       this.ZipCodeList.value
//ruta:          this.urbRutaList.value