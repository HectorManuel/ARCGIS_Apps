define(['esri/geometry/Geometry', 
        'esri/tasks/QueryTask', 
        'esri/tasks/query'],
function (Geometry, QueryTask, Query) {
    return {
        //The parameters drawIncidents, orderByFields, groupByFieldForStatistics, outStatistics are optional parameters.
        ExecuteQuery: function (serviceUrl, whereClause, fieldRange, returnGeometry,returnDistinctValues,
        												processFailedCallBack, processCompletedCallBack,orderByFields) {
            try {
                var queryTask = new QueryTask(serviceUrl);

                var query = new Query();
                
        //        ,
        //    spatialReference, processFailedCallBack, processCompletedCallBack, drawIncidents, orderByFields,        
        //    groupByFieldForStatistics, outStatistics
                
                // if (drawIncidents != null && drawIncidents) {
                    // orderByFields = null;
                    // groupByFieldsForStatistics = null;
                    // outStatistics = null;
                // }
                // else {
                    if (orderByFields != null)
                        query.orderByFields = orderByFields;
                    // if (groupByFieldForStatistics != null)
                        // query.groupByFieldsForStatistics = groupByFieldForStatistics;
                    // if (outStatistics != null)
                        // query.outStatistics = outStatistics;
                // }


                query.outFields = fieldRange;
                query.returnGeometry = returnGeometry;
                //query.outSpatialReference = spatialReference;
                //query.geometry = geometryFilter;, geometryFilter
                query.where = whereClause;
                query.returnDistinctValues= returnDistinctValues;
                queryTask.execute(query, processCompletedCallBack, processFailedCallBack);
            }
            catch (err) {
                throw(err);
            }
        }

        //Test Methods
//            ProcessCompletedCallBackTester: function (result) {
//                return (result.features.length > 0);
//            },

//            ProcessErrorCallBackTester: function (error) {
//                alert("Error: " + error);
//            },

//            ExecuteQueryTester: function () {
//                var serviceUrl = "https://www.mapas.gmtgis.net/ArcGIS/rest/services/Mapas/PoliDistritos_Sectores_Incidencia/MapServer/0";
//                var whereClause = "FK_delito_cometido_Tipo_I = 1";
//                var geometryFilter = null;
//                var showProgressBar = true;
//                var fieldRange = ["id_incidente", "FK_delito_cometido_Tipo_I", "IWDOW"];
//                var returnGeometry = true;
//                var spatialReference = new SpatialReference({ wkid: 32162 });
//                var drawIncidents = false;
//                var orderByFields = ["Sector ASC", "FK_delito_cometido_Tipo_I ASC"];
//                var groupByFieldsForStatistics = ["Sector", "FK_delito_cometido_Tipo_I"];
//                var statDef = new StatisticDefinition();
//                statDef.statisticType = "count";
//                statDef.onStatisticField = "FK_delito_cometido_Tipo_I";
//                statDef.outStatisticFieldName = "IncidentCount";
//                var outStatistics = [statDef];
//                this.ExecuteQuery(serviceUrl, whereClause, geometryFilter, showProgressBar, fieldRange, returnGeometry, spatialReference,
//                    this.ProcessErrorCallBackTester, this.ProcessCompletedCallBackTester, drawIncidents, orderByFields, groupByFieldsForStatistics,
//                    outStatistics);
//            },

//            //end of test Methods

//            // Run tests suite, for this method to work the following classes should be added to define at the top of this file,
//            //'esri/SpatialReference', 'esri/tasks/StatisticDefinition'
//            runTests: function () {
//                this.ExecuteQueryTester();
//            }
    };
});