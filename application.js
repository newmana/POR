var map;

Event.observe(window, 'load', function() {
    $('logout-button').observe('click', doStuff);
    init();
});

function doStuff() {
    alert('Log out');
}

function init() {
    map = new OpenLayers.Map('map');
    var layer = new OpenLayers.Layer.WMS("OpenLayers WMS",
            "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'});
    map.addLayer(layer);

    // allow testing of specific renderers via "?renderer=Canvas", etc
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

    /*
     * Layer style
     */
    // we want opaque external graphics and non-opaque internal graphics
    var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
    layer_style.fillOpacity = 0.2;
    layer_style.graphicOpacity = 1;

    /*
     * Blue style
     */
    var style_blue = OpenLayers.Util.extend({}, layer_style);
    style_blue.strokeColor = "blue";
    style_blue.fillColor = "blue";
    style_blue.graphicName = "star";
    style_blue.pointRadius = 10;
    style_blue.strokeWidth = 3;
    style_blue.rotation = 45;
    style_blue.strokeLinecap = "butt";

    /*
     * Green style
     */
    var style_green = {
        strokeColor: "#00FF00",
        strokeWidth: 3,
        strokeDashstyle: "dashdot",
        pointRadius: 6,
        pointerEvents: "visiblePainted"
    };

    /*
     * Mark style
     */
    var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
    // each of the three lines below means the same, if only one of
    // them is active: the image will have a size of 24px, and the
    // aspect ratio will be kept
    // style_mark.pointRadius = 12;
    // style_mark.graphicHeight = 24;
    // style_mark.graphicWidth = 24;

    // if graphicWidth and graphicHeight are both set, the aspect ratio
    // of the image will be ignored
    style_mark.graphicWidth = 24;
    style_mark.graphicHeight = 20;
    style_mark.graphicXOffset = 10; // default is -(style_mark.graphicWidth/2);
    style_mark.graphicYOffset = -style_mark.graphicHeight;
    style_mark.externalGraphic = "./img/marker.png";
    // graphicTitle only works in Firefox and Internet Explorer
    style_mark.graphicTitle = "this is a test tooltip";

    var vectorLayer = new OpenLayers.Layer.Vector("Simple Geometry", {
        style: layer_style,
        renderers: renderer
    });

    // create a point feature
    var point = new OpenLayers.Geometry.Point(-111.04, 45.68);
    var pointFeature = new OpenLayers.Feature.Vector(point, null, style_blue);
    var point2 = new OpenLayers.Geometry.Point(-105.04, 49.68);
    var pointFeature2 = new OpenLayers.Feature.Vector(point2, null, style_green);
    var point3 = new OpenLayers.Geometry.Point(-105.04, 49.68);
    var pointFeature3 = new OpenLayers.Feature.Vector(point3, null, style_mark);

    // create a line feature from a list of points
    var pointList = [];
    var newPoint = point;
    for (var p = 0; p < 15; ++p) {
        newPoint = new OpenLayers.Geometry.Point(newPoint.x + Math.random(1),
                newPoint.y + Math.random(1));
        pointList.push(newPoint);
    }
    var lineFeature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString(pointList), null, style_green);

    // create a polygon feature from a linear ring of points
    var pointList = [];
    for (var p = 0; p < 6; ++p) {
        var a = p * (2 * Math.PI) / 7;
        var r = Math.random(1) + 1;
        var newPoint = new OpenLayers.Geometry.Point(point.x + (r * Math.cos(a)),
                point.y + (r * Math.sin(a)));
        pointList.push(newPoint);
    }
    pointList.push(pointList[0]);

    var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
    var polygonFeature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Polygon([linearRing]));


    map.addLayer(vectorLayer);
    map.setCenter(new OpenLayers.LonLat(point.x, point.y), 5);
    vectorLayer.addFeatures([pointFeature, pointFeature3, pointFeature2, lineFeature, polygonFeature]);
}
