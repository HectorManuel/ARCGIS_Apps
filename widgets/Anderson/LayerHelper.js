define(['dojo/_base/array', 
        'esri/layers/GraphicsLayer', 
        'esri/layers/ArcGISTiledMapServiceLayer', 
        'esri/layers/FeatureLayer'
],
function (array, GraphicsLayer, ArcGISTiledMapServiceLayer, FeatureLayer) {
    return {
        LayerType: {
            GraphicsLayer: "GraphicsLayer",
            TiledLayer: "TiledLayer",
            FeatureLayer: "FeatureLayer",
            DynamicLayer: "DynamicLayer",
            Unknown: "Unknown"
        },

        GetOrCreateLayer: function(map, layerId, lyrType, layerUrl, opacity, visible) {
            var returnLayer = null;
            var layer = map.getLayer(layerId);

            if (lyrType == this.LayerType.GraphicsLayer) {
                if (layer != null && layer instanceof GraphicsLayer) {
                    returnLayer = layer;
                }
                else {
                    var gLayer = new GraphicsLayer({ id: layerId });

                    if (opacity != null)
                        gLayer.opacity = opacity;

                    if (visible != null)
                        gLayer.visible = visible;

                    map.addLayer(gLayer);
                    returnLayer = gLayer;
                }
            }
            else if (lyrType == this.LayerType.TiledLayer) {
                if (layer != null && layer instanceof ArcGISTiledMapServiceLayer) {
                    returnLayer = layer;
                }
                else if (layerUrl != null && layerUrl != '') {
                    var tLayer = new ArcGISTiledMapServiceLayer(layerUrl);
                    tLayer.id = layerId;

                    if (opacity != null)
                        tLayer.opacity = opacity;

                    if (visible != null)
                        tLayer.visible = visible;

                    map.addLayer(tLayer);
                    returnLayer = tLayer;
                }
            }
            else if (lyrType == this.LayerType.FeatureLayer) {
                if (layer != null && layer instanceof FeatureLayer) {
                    returnLayer = layer;
                }
                else if (layerUrl != null && layerUrl != '') {
                    var fLayer = new FeatureLayer(layerUrl);
                    fLayer.id = layerId;

                    if (opacity != null)
                        tLayer.opacity = opacity;

                    if (visible != null)
                        tLayer.visible = visible;

                    map.addLayer(fLayer);
                    returnLayer = fLayer;
                }
            }

            return returnLayer;
        },

        //Search a map for a layer with a given name and returns that layer.
        //@param (Map)map - The map containing the layer
        //@param (string)layerName - The name of the layer to be found
        //@return The found layer or null if it wasn't found.
        GetFeatureLayerByName: function(map, layerName) {
            var lstLayerId = null;
            var foundLayer = null;

            lstLayerId = map.graphicsLayerIds;   

            array.some(lstLayerId, function(layerId) {
                var currentLayer = map.getLayer(layerId);
                if (currentLayer.name != undefined && currentLayer.name != null && layerName.toUpperCase() === currentLayer.name.toUpperCase()) {
                    foundLayer = currentLayer;
                    return true;
                }
            }, this);

            return foundLayer;
        }
    };
});

