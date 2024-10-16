sap.ui.define([
	//helpers
], function () {
	"use strict";

	return {
		getWeekYearOfDate: function (date) {
			//stackoverflow
			//https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
			// Copy date so don't modify original
			date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
			// Set to nearest Thursday: current date + 4 - current day number
			// Make Sunday's day number 7, sunday is 0
			date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
			// Get first day of year
			let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
			// Calculate full weeks to nearest Thursday
			let weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
			// Return array of year and week number
			return [weekNo, yearStart];
		},
		
		getWeekOfDate: function (date) {
			return this.getWeekYearOfDate(date)[0];
		},

		getDateOfWeek: function (week, year) {
			//stackoverflow
			//https://stackoverflow.com/questions/16590500/javascript-calculate-date-from-week-number
			let simple = new Date(year, 0, 1 + (week - 1) * 7);
			let dow = simple.getDay();
			let ISOweekStart = simple;
			if (dow <= 4)
				ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
			else
				ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
			//le descuento gmt
			ISOweekStart = new Date(ISOweekStart.getTime() - ISOweekStart.getTimezoneOffset() * 60 * 1000);
			return ISOweekStart;
		}

	}
});