'use strict';

const baseUrl='https://api.weatherbit.io/v2.0/forecast/daily';
const apiKey = 'a7ba02e17f8d41a2b0936397fae108e6';
const weekdays = {
	0: 'Dom',
	1: 'Seg',
	2: 'Ter',
	3: 'Qua',
	4: 'Qui',
	5: 'Sex',
	6: 'Sáb' 
}

/* Initialize with forecast from São Paulo BR 
*/
getForecast('São Paulo');

/* Get the name on the search string and 
 * show the proper forecast
*/
$('#search').click(function(event) {
	event.preventDefault();
	const newCity = $('#city').val();

	/* Display 'loader' image while the 
	 * forecast data isn't loaded
	 */
	$('#loader').css('display','');
	getForecast(newCity);
})

/* Function getForecast displays information 
 * about 'today' and the next 15 days
 * Argument: 'city' from 'search' input found on data
*/
function getForecast(city) {
	$('#forecast').css('display','none');
	$('#loader').css('display','');
	
	clearFields();

	$.ajax({	
	url: baseUrl,
	data: {
		key: apiKey,
		city: city,
		lang: 'pt'
	},
	success: function(result) {
		$('#forecast').css('display','');
		$('#loader').css('display','none');

		$('#city-name').text(result.city_name);
		const forecast = result.data;
		const today = forecast[0];
		displayToday(today);

		const nextDays = forecast.slice(1);
		displayNextDays(nextDays);

	},
	error: function(error) {
		console.log('error');
	}

});

}

/* clearFields(): reset information from 'next days' 
 * card when a new forecast is displayed
 */
function clearFields() {
	$('#next-days').empty();
}

/* displayToday(): get information from API and 
 * show it on proper HTML elements
 */
function displayToday(today) {
	const temperature = Math.round(today.temp);
	const wind = Math.round(today.wind_spd);
	const humidity = today.rh;
	const weather = today.weather.description;
	const icon = today.weather.icon;
	const iconURL = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
	
	/* Get values and change innerText of each element */
	$('#current-temperature').text(temperature);
	$('#current-wind').text(wind);
	$('#current-humidity').text(humidity);
	$('#current-weather').text(weather);
	$('#weather-icon').attr('src', iconURL);
}

/* displayNextDays(): get information of the next  
 * 15 days from API and show it on the card
 */
function displayNextDays(nextDays) {
	for (let i = 0; i < nextDays.length; i = i + 1) {
		const day = nextDays[i];
		const date = new Date(day.valid_date);
		const min = Math.round(day.min_temp);
		const max = Math.round(day.max_temp);
		const weekday = weekdays[date.getUTCDay()];

		/* Create a HTML element for each day */
		const card = $(`<div class="day-card">
	          <div class="date">${date.getUTCDate()}/${date.getUTCMonth() + 1}</div>
	          <div class="weekday">${weekday}</div>
	          <div class ="temperatures">
	            <span class="max">${max}°</span>
	            <span class="min">${min}°</span>
	          </div>
	        </div>`);
		card.appendTo('#next-days');
	}
	}


