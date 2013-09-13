/*!
 * Searchable Map Template with Google Fusion Tables
 * http://derekeder.com/searchable_map_template/
 *
 * Copyright 2012, Derek Eder
 * Licensed under the MIT license.
 * https://github.com/derekeder/FusionTable-Map-Template/wiki/License
 *
 * Date: 12/10/2012
 *
 */

var MapsLib = MapsLib || {};
var MapsLib = {

  //Setup section - put your Fusion Table details here
  //Using the v1 Fusion Tables API. See https://developers.google.com/fusiontables/docs/v1/migration_guide for more info

  //the encrypted Table ID of your Fusion Table (found under File => About)
  //NOTE: numeric IDs will be depricated soon
  fusionTableId: "1vP4neapn78SucXReab_cyuCcyPxANww6_o1lFu8",

  commAreasTableId: "1GtSykK6xHkeFrxmWK1VpvOaJltJgpa4o1bX7F14",
  ediTableId: "1bOniDCHwGJQRItiTiUc_Pz8Y0VGmIbP4bBhYIMM",
  medianIncomeId: "14kEdO1R9-j0VELDdIDoX3rhhFyiv9WdgDYj79zg",

  //*New Fusion Tables Requirement* API key. found at https://code.google.com/apis/console/
  //*Important* this key is for demonstration purposes. please register your own.
  googleApiKey: "AIzaSyDtJXRQCXB-WlDve_nLtHbeDjj3q4saCag",

  //name of the location column in your Fusion Table.
  //NOTE: if your location column name has spaces in it, surround it with single quotes
  //example: locationColumn:     "'my location'",
  locationColumn: "Longitude",

  map_centroid: new google.maps.LatLng(41.8781136, -87.66677856445312), //center that your map defaults to
  locationScope: "chicago", //geographical area appended to all address searches
  recordName: "Action", //for showing number of results
  recordNamePlural: "Actions",

  searchRadius: 805, //in meters ~ 1/2 mile
  defaultZoom: 10, //zoom level when map is loaded (bigger is more zoomed in)
  addrMarkerImage: 'http://derekeder.com/images/icons/blue-pushpin.png',
  currentPinpoint: null,




  initialize: function() {
    $("#result_count").html("");

    geocoder = new google.maps.Geocoder();
    var myOptions = {
      zoom: MapsLib.defaultZoom,
      minZoom: 11,
      streetViewControl: false,
      satelliteViewControl:false,
      zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
      center: MapsLib.map_centroid,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles:  
[
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#e9e9e9" }
    ]
  },{
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ffffff" },
      { "weight": 0.6 }

    ]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#c5c5c3" },
       { "visibility": "simplified" },
      { "weight": 0.6 }
    ]
  },{
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#c5c5c6" },
      { "visibility": "off" }
    ]
  },{
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#c1c1c1" }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "color": "#a2a2a2" }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": "#a9a9a9" }
    ]
  },{
    "featureType": "poi.school",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#dadada" }
    ]
  },{
    "featureType": "poi.school",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#dadada" }
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#c5c5c5" }

    ]
  },{
    "featureType": "poi.sports_complex",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#d8d8d8" },
      { "visibility": "off" }
    ]
  },{
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#dadadb" },
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi.business",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#bfbfbf" },
       { "visibility": "off" },
    ]
  },{
    "featureType": "poi.attraction"  },{
    "featureType": "poi.government",
    "elementType": "geometry",
    "stylers": [
      { "color": "#dadada" },
     { "visibility": "off" }
    ]
  },{
    "featureType": "poi.attraction",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#dadad7" },
      { "visibility": "off" }
    ]
  },{
    "stylers": [
      { "saturation": -91 },
      { "lightness": 18 }
      ]
  },{
      "featureType": "administrative.locality",
    "stylers": [
      { "visibility": "off" }

    ]
  }
]




};





   // };
    map = new google.maps.Map($("#map_canvas")[0], myOptions);

    
 

   MapsLib.commAreas = new google.maps.FusionTablesLayer({
      query: {
        from: MapsLib.commAreasTableId,
        select: "col12"
      }, 
      styleId: 2,
      templateId: 2,
      suppressInfoWindows: true
    });
    MapsLib.commAreas.setMap(map);

    MapsLib.edi = new google.maps.FusionTablesLayer({
      query: {
        from: MapsLib.ediTableId,
        select: "col54"
     },
     styleId: 4,
      templateId: 5,
      zOrder:1,
     suppressInfoWindows: true
    }); 
    MapsLib.edi.setMap(map); 
     MapsLib.edi.setMap(null); 


    $("#search_address").val(MapsLib.convertToPlainString($.address.parameter('address')));
    var loadRadius = MapsLib.convertToPlainString($.address.parameter('radius'));
    if (loadRadius != "") $("#search_radius").val(loadRadius);
    else $("#search_radius").val(MapsLib.searchRadius);
    //$(".checked").attr("checked", "checked");
    $('.nav-tabs').button()
    $("#result_count").hide();
    $("#text_search").val("");

    


    // maintains map centerpoint for responsive design
    google.maps.event.addDomListener(map, 'idle', function() {
      MapsLib.calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(MapsLib.map_centroid);
    });



    MapsLib.searchrecords = null;




    //reset filters


    //-----custom initializers-------

    $("#age-slider").slider({
      orientation: "horizontal",
      range: true,
      min: 1997,
      max: 2013,
      values: [1997, 2013],
      step: 1,
      slide: function(event, ui) {
        $("#age-selected-start").html(ui.values[0]);
        $("#age-selected-end").html(ui.values[1]);
      },
      stop: function(event, ui) {
        MapsLib.doSearch();
      }
    });

    //-----end of custom initializers-------

    //run the default search
    MapsLib.doSearch();
  },

  doSearch: function(location) {
    MapsLib.clearSearch();
    var address = $("#search_address").val();
    MapsLib.searchRadius = $("#search_radius").val();

    var whereClause = MapsLib.locationColumn + " not equal to ''";

    //-----custom filters-------

    var text_search = $("#text_search").val().replace("'", "\'");
    if (text_search != '') whereClause += " AND 'Label' contains ignoring case '" + text_search + "'";


    var type_column = "'ActionFlag'"; 
    var searchType = type_column + " IN (-1,";
    if ($("#actiontype1").is(':checked')) searchType += "1,";
    if ($("#actiontype2").is(':checked')) searchType += "2,";
    if ($("#actiontype3").is(':checked')) searchType += "3,";
    if ($("#actiontype4").is(':checked')) searchType += "4,";
    if ($("#actiontype5").is(':checked')) searchType += "5,";
    if ($("#actiontype6").is(':checked')) searchType += "6,";
    if ($("#actiontype7").is(':checked')) searchType += "7,"; 
    if ($("#actiontype8").is(':checked')) searchType += "8,"; 


    whereClause += " AND " + searchType.slice(0, searchType.length - 1) + ")"; 

    var type_column = "'TypeFlag'";
    var searchType = type_column + " IN (-1,";
    if ($("#closetype1").is(':checked')) searchType += "1,";
    if ($("#closetype2").is(':checked')) searchType += "2,";
    if ($("#closetype3").is(':checked')) searchType += "3,"; 
    if ($("#opentype1").is(':checked')) searchType += "21,";
    if ($("#opentype2").is(':checked')) searchType += "22,";
    if ($("#opentype3").is(':checked')) searchType += "23,";
    if ($("#opentype4").is(':checked')) searchType += "24,";
    if ($("#opentype6").is(':checked')) searchType += "26,";

    whereClause += " AND " + searchType.slice(0, searchType.length - 1) + ")"; 


    whereClause += " AND 'Year' >= '" + $("#age-selected-start").html() + "'";
    whereClause += " AND 'Year' <= '" + $("#age-selected-end").html() + "'";




    //-------end of custom filters--------

    if (address != "") {
      if (address.toLowerCase().indexOf(MapsLib.locationScope) == -1) address = address + " " + MapsLib.locationScope;

      geocoder.geocode({
        'address': address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          MapsLib.currentPinpoint = results[0].geometry.location;

          $.address.parameter('address', encodeURIComponent(address));
          $.address.parameter('radius', encodeURIComponent(MapsLib.searchRadius));
          map.setCenter(MapsLib.currentPinpoint);
          map.setZoom(14);

          MapsLib.addrMarker = new google.maps.Marker({
            position: MapsLib.currentPinpoint,
            map: map,
            icon: MapsLib.addrMarkerImage,
            animation: google.maps.Animation.DROP,
            title: address
          });

          whereClause += " AND ST_INTERSECTS(" + MapsLib.locationColumn + ", CIRCLE(LATLNG" + MapsLib.currentPinpoint.toString() + "," + MapsLib.searchRadius + "))";

          MapsLib.drawSearchRadiusCircle(MapsLib.currentPinpoint);
          MapsLib.submitSearch(whereClause, map, MapsLib.currentPinpoint);
        } else {
          alert("We could not find your address: " + status);
        }
      });
    } else { //search without geocoding callback
      MapsLib.submitSearch(whereClause, map);
    }
  },

  submitSearch: function(whereClause, map, location) {
    //get using all filters
    //NOTE: styleId and templateId are recently added attributes to load custom marker styles and info windows
    //you can find your Ids inside the link generated by the 'Publish' option in Fusion Tables
    //for more details, see https://developers.google.com/fusiontables/docs/v1/using#WorkingStyles

    MapsLib.searchrecords = new google.maps.FusionTablesLayer({
      query: {
        from: MapsLib.fusionTableId,
        select: MapsLib.locationColumn,
        where: whereClause
      },
      styleId: 4,
      templateId: 5
    });
    MapsLib.searchrecords.setMap(map);
    MapsLib.getCount(whereClause);
  },



  clearSearch: function() {
    if (MapsLib.searchrecords != null) MapsLib.searchrecords.setMap(null);
    if (MapsLib.addrMarker != null) MapsLib.addrMarker.setMap(null);
    if (MapsLib.searchRadiusCircle != null) MapsLib.searchRadiusCircle.setMap(null);
  },



  findMe: function() {
    // Try W3C Geolocation (Preferred)
    var foundLocation;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        foundLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        MapsLib.addrFromLatLng(foundLocation);
      }, null);
    } else {
      alert("Sorry, we could not find your location.");
    }
  },

  addrFromLatLng: function(latLngPoint) {
    geocoder.geocode({
      'latLng': latLngPoint
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          $('#search_address').val(results[1].formatted_address);
          $('.hint').focus();
          MapsLib.doSearch();
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  },

  drawSearchRadiusCircle: function(point) {
    var circleOptions = {
      strokeColor: "#4b58a6",
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: "#4b58a6",
      fillOpacity: 0.05,
      map: map,
      center: point,
      clickable: false,
      zIndex: -1,
      radius: parseInt(MapsLib.searchRadius)
    };
    MapsLib.searchRadiusCircle = new google.maps.Circle(circleOptions);
  },

  query: function(selectColumns, whereClause, callback) {
    var queryStr = [];
    queryStr.push("SELECT " + selectColumns);
    queryStr.push(" FROM " + MapsLib.fusionTableId);
    queryStr.push(" WHERE " + whereClause);

    var sql = encodeURIComponent(queryStr.join(" "));
    $.ajax({
      url: "https://www.googleapis.com/fusiontables/v1/query?sql=" + sql + "&callback=" + callback + "&key=" + MapsLib.googleApiKey,
      dataType: "jsonp"
    });
  },

  handleError: function(json) {
    if (json["error"] != undefined) {
      var error = json["error"]["errors"]
      console.log("Error in Fusion Table call!");
      for (var row in error) {
        console.log(" Domain: " + error[row]["domain"]);
        console.log(" Reason: " + error[row]["reason"]);
        console.log(" Message: " + error[row]["message"]);
      }
    }
  },

  getCount: function(whereClause) {
    var selectColumns = "Count()";
    MapsLib.query(selectColumns, whereClause, "MapsLib.displaySearchCount");
  },

  displaySearchCount: function(json) {
    MapsLib.handleError(json);
    var numRows = 0;
    if (json["rows"] != null) numRows = json["rows"][0];

    var name = MapsLib.recordNamePlural;
    if (numRows == 1) name = MapsLib.recordName;
    $("#result_count").slideUp(function() {
      $("#result_count").html(MapsLib.addCommas(numRows) + " " + name + " found");
    });
    $("#result_count").css({"display": "block"})
    $("#result_count").slideDown("slow")
    
    
  },



  addCommas: function(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  },

 

  // maintains map centerpoint for responsive design
  calculateCenter: function() {
    center = map.getCenter();
  },

  //converts a slug or query string in to readable text
  convertToPlainString: function(text) {
    if (text == undefined) return '';
    return decodeURIComponent(text);
  }
}



  //-----custom functions-------
 
 //lettering






  //-----end of custom functions-------


//filters

$('#edi').click(function(){
            MapsLib.edi.setMap(map);
            MapsLib.searchrecords.setMap(map);
            });
            $('#default').click(function(){
            MapsLib.edi.setMap(null);
            });



            
//fusion table queries

 var apiKey = "AIzaSyDtJXRQCXB-WlDve_nLtHbeDjj3q4saCag";
 var queryUrlHead = 'https://www.googleapis.com/fusiontables/v1/query?sql=';
 var queryUrlTail = '&key=' + apiKey + '&callback=?';
 var tableid = MapsLib.fusionTableId;
 var searchString = 1
       

var query =   "SELECT COUNT() FROM " + tableid + " WHERE 'TypeFlag' CONTAINS IGNORING CASE '" + searchString + "'"
var queryurl = encodeURI(queryUrlHead + query + queryUrlTail);
var getCount = $.get(queryurl,
function(data){
try{
$('#closetypedistrict').html((data.rows[0][0]));
}
catch(err){
$('#closetypedistric').html('0');
}
},
"jsonp");

var searchString = 2

var query =   "SELECT COUNT() FROM " + tableid + " WHERE 'TypeFlag' CONTAINS IGNORING CASE '" + searchString + "'"
var queryurl = encodeURI(queryUrlHead + query + queryUrlTail);
var getCount = $.get(queryurl,
function(data){
try{
$('#closetypecharter').html((data.rows[0][0]));
}
catch(err){
$('#closetypecharter').html('0');
}
},
"jsonp");

var searchString = 3
       

var query =   "SELECT COUNT() FROM " + tableid + " WHERE 'TypeFlag' CONTAINS IGNORING CASE '" + searchString + "'"
var queryurl = encodeURI(queryUrlHead + query + queryUrlTail);
var getCount = $.get(queryurl,
function(data){
try{
$('#closetypecontract').html((data.rows[0][0]));
}
catch(err){
$('#closetypecontract').html('0');
}
},
"jsonp");









    


          
            

  




   
