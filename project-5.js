	var jamApp = {};
	jamApp.url =  'http://ws.audioscrobbler.com/2.0/';

	jamApp.key = 'b4f580293627898b199108ee97a4368c';


	jamApp.getTracks = function(country) {
		return $.ajax({
			url: jamApp.url,
			method: 'get',
			dataType: 'JSON',
			data: {
				method: 'geo.gettoptracks',
				country: country,
				api_key: jamApp.key,
				format: 'json'
			}
		});
	}
	

	function capitalize(string) { 
		return string.charAt(0).toUpperCase() + string.slice(1); 
	} 

	$('.result h2').text(`Hover over a country! `);
					// $('.result h3 a').attr('href',trackUrl );
	
	jamApp.init = function(hoverCountry){
			if (hoverCountry === 'Russia'){
				hoverCountry = 'Russian Federation';
			}

			if (hoverCountry === 'Iran (Islamic Republic of)'){
				hoverCountry = 'Iran (Islamic Republic of)';
			}



			$.when(jamApp.getTracks(hoverCountry))
				.then(function(topTracks){
					var rank = Math.floor(Math.random() * 4);
					
					var topTrack = topTracks.tracks.track[6];
					var trackName = topTracks.tracks.track[6].name;
					var trackUrl = topTracks.tracks.track[6].url;
					var artistName = topTracks.tracks.track[6].artist.name;
					// console.log(jamApp.getTracks('Germany'));
					// console.log(topTracks);
					console.log(trackName);
					console.log(artistName);

					if (hoverCountry === 'Russian Federation'){
						hoverCountry = 'Russia';
					}

					$('.result h2').text(`The hottest jam in ${capitalize(hoverCountry)} is ${trackName} by ${artistName}. `);
					// $('.result h2 span').text(`${trackName}`);
					// $('.result h2 span').text(`${artistName}`);
					

					
				})
				.fail(function(error){
					console.log(error);
					// $('.result h2').text(`Sorry, no data available! `)
					$('.result h2').text(` `)
				})
		

		
	}

	/* Basic map settings*/
	var myMap = L.map('mapid').setView([51.505, -0.09], 2.5);


	L.tileLayer('https://api.mapbox.com/styles/v1/willstanton/cirl59frv000cgcknwo8s3yzn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2lsbHN0YW50b24iLCJhIjoiY2lyZ3UyNjF3MDE2b2czbm4wMWNweWdiYyJ9._94HxAE11gbt_c35n88Rgw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    // id: 'your.mapbox.project.id',
    // accessToken: 'your.mapbox.public.access.token'
	}).addTo(myMap);

	function pickColor(){
		// How to color countries
		// 	1) Based on some aspect of country object
		//	2) Random color from array?
	}

	function style() {
		return {
			// fillColor: '#84bd00',
			fillColor: '#FFC857',
			// textColor: '#fff',
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '5',
			// fillOpacity: 0.7

		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 3,
			color: 'rgba(46, 64, 82, 0.7)',
			dashArray: '',
			fillOpacity: 0.7
		});

		if(!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}

		trackInfo.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		trackInfo.update();
		$('.result h2').text(`Hover over a country! `);
	}

	function zoomToFeature(e) {
		myMap.fitBounds(e.target.getBounds());
	}

	// function goToTrack() {
	// 	$('.result h3').text(`Check it out `);
	// 	$('.result h3 a').text(`here`);
	// 	$('.result h3 a').attr('href',trackUrl );
	// }

	function onEachFeature(feature, layer){
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			// mouseclick: goToTrack()
		});
	}

	
	geojson = L.geoJson(countryBorders, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(myMap);

	// Control that displays the info
	var trackInfo = L.control();

	trackInfo.onAdd = function(myMap) {
		this._div = L.DomUtil.create('div', 'trackInfo');
		this.update();
		return this._div;
	};

	trackInfo.update = function(props) {
		if (props){
		this._div.innerHTML = 'Turn it up,  ' +  (props ?
        '<b>' + props.NAME +  '!' + '</b><br />'
        : '') ;
        }
        else { 
        	this._div.innerHTML = '';

        }
  
		 jamApp.init(props ? props.NAME : '');
	};

	

	trackInfo.addTo(myMap);
	// Popup with Info
	// var popup = L.popup();
	   

	// function onMapClick(e){
	// 	popup
	// 		.setLatLng(e.latlng)
	// 		.openOn(myMap);
	// };

	// myMap.on('click', onMapClick);


	$(function(){

		// jamApp.init();
	});

	// TO-DO
	// 	1) Style.
	//	2) Go to song page on click.
	// 	3) Display error if there is no data for a country.