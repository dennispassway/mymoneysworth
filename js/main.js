// Set i
var i = 1;
var valutaUitkomst = 0;

// Google Maps original
var map;
var MY_MAPTYPE_ID = 'custom_style';

function initialize() {

	var featureOpts =[
	{
		"elementType": "labels",
		"stylers": [
		{ "visibility": "off" }
		]
	},{
		"featureType": "road",
		"stylers": [
		{ "visibility": "off" }
		]
	},{
		"featureType": "water",
		"stylers": [
		{ "color": "#6DBCDB" },
		{ "saturation": 11 }
		]
	},{
		"featureType": "landscape",
		"stylers": [
		{ "color": "#D7DADB" }
		]
	},{
		"featureType": "poi",
		"stylers": [
		{ "visibility": "off" }
		]
	},{
		"featureType": "administrative.province",
		"stylers": [
		{ "visibility": "off" }
		]
	},{
		"featureType": "administrative.locality",
		"stylers": [
		{ "visibility": "off" }
		]
	},{
		"featureType": "administrative.neighborhood",
		"stylers": [
		{ "visibility": "off" }
		]
	},{
		"featureType": "administrative.land_parcel"  },{
		}
		];

		var mapOptions = {
			draggable: false,
			disableDoubleClickZoom: true,
			scrollwheel: false,

			zoom: 2,
			center: new google.maps.LatLng(28.868729,4.921875),
			disableDefaultUI: true,
			navigationControl: false,
			mapTypeControl: false,
			scaleControl: false,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
			},
			mapTypeId: MY_MAPTYPE_ID
		};

		map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);

		var styledMapOptions = {
			name: 'Custom Style'
		};

		var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

		map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
	}

	google.maps.event.addDomListener(window, 'load', initialize);

// Infobar
$('.infobar').hide();
$('.infobar').draggable();

function showInfo() {
	$('.infobar').show(200);
}

$('.sluiten').click(function() {
	$('.infobar').hide(200);
});

// D3 datapaks
var data = [], rows;
d3.csv("data/dataset.csv", function(loadedRows) {
	rows = loadedRows;

	// Push Data
	$.each(rows, function(value,key){
		data.push([value,key]);
	});

	tekenMarkers();
	Execute();
});

// Teken Markers
function tekenMarkers() {
	var a = 0;
	var marker = Array();

	function clickHandler(a) {
		return function () {
			i = data[a][1].ID; Execute(); showInfo();
		};
	}

	for (a = 0; a<=(data.length-1); a++) {
		icoonkleur = 'img/green.png';
		console.log(a);
		marker[a] = new google.maps.Marker({position: new google.maps.LatLng(data[a][1].Lat,data[a][1].Lng),map: map,
			icon: icoonkleur
		});
		google.maps.event.addListener(marker[a], 'click', clickHandler(a));
	}

}

// Execute
function Execute() {
	// Valuta doorschieten
	var vs = data[i][1].VS;
	var valutaBerekens = "currencydata.rates." + vs;

	// Currency Data
	var currencydata;
	d3.json("http://openexchangerates.org/api/latest.json?app_id=0da18a0aebc04e1bb6d42edbc43d07ca", function(json) {
		currencydata = json;

		var baseEuro = (1/(currencydata.rates.EUR));
		valutaBerekens = eval(valutaBerekens);

		var valutaUitkomst = valutaBerekens*baseEuro;
		valutaUitkomst = valutaUitkomst.toFixed(2);
		$('.omgerekend').html(valutaUitkomst);

		var theDate = new Date(currencydata.timestamp * 1000);
		dateString = theDate.toGMTString();

		$('.updated').html(dateString);
	});

	// Infobar Vullen
	var afbeeldingsrc = "img/" + data[i][1].Afbeelding + ".gif";
	// https://www.cia.gov/library/publications/the-world-factbook/graphics/flags/large/za-lgflag.gif
	$('#landafbeelding').attr("src", afbeeldingsrc);
	$('#landafbeelding').attr("alt", data[i][1].Land);
	$('.land').html(data[i][1].Land);
	$('.valuta').html(data[i][1].Valuta);
}

// Uitleg en info
$('.uitleginfo').hide();
$('#menuknop').click(function(){
	$('.uitleginfo').toggle(100);
})
$('.sluiten2').click(function(){
	$('.uitleginfo').hide(100);
})