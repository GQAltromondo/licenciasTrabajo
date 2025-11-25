sap.ui.define([
	//helpers
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/format/DateFormat"
], function (NumberFormat, DateFormat) {
	"use strict";

	return {

		/******************************************FLOAT************************************************/

		getDayName: function (x) {
			var d = x
			var weekday = new Array(7);
			weekday[0] = "Domingo";
			weekday[1] = "Lunes";
			weekday[2] = "Martes";
			weekday[3] = "Miercoles";
			weekday[4] = "Jueves";
			weekday[5] = "Viernes";
			weekday[6] = "Sabado";

			var n = weekday[d.getDay()];
			return n;
		},

		getWeekNumber: function (d) {
			// Copy date so don't modify original
			d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
			// Set to nearest Thursday: current date + 4 - current day number
			// Make Sunday's day number 7
			d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
			// Get first day of year
			var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
			// Calculate full weeks to nearest Thursday
			var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
			// Return array of year and week number
			return [d.getUTCFullYear(), weekNo];
		},
		formatDateLicense: function (dDate) {
			if (typeof dDate === "object" && dDate !== null) {
				let d = new Date(dDate); // No ajustar timezone manualmente
				let day = String(d.getUTCDate()).padStart(2, "0"); 
				let month = String(d.getUTCMonth() + 1).padStart(2, "0");
				let year = d.getUTCFullYear();
		
				return `${day}-${month}-${year}`;
			}
			return dDate;
		},
		formatDateLicense: function (dDate) {
			if (typeof dDate === "object" && dDate !== null) {
				let d = new Date(dDate); // No ajustar timezone manualmente
				let day = String(d.getUTCDate()).padStart(2, "0"); 
				let month = String(d.getUTCMonth() + 1).padStart(2, "0");
				let year = d.getUTCFullYear();
		
				return `${day}-${month}-${year}`;
			}
			return dDate;
		},

		formatDateLicenseReportDiary: function (dDate) {
			if (typeof (dDate) === "object") {
				let dDateFormatted = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
				let d = new Date(dDateFormatted);
				let month = '' + (d.getMonth() + 1);
				let day = '' + d.getDate();
				let year = d.getFullYear();

				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;

				return [day, month, year].join('/');
			}
			return dDate;
		},

		getEstadoTramitacion: function (sEstado) {
			if (sEstado === "NA") {
				return "No Autorizada"
			}
			if (sEstado === "CC") {
				return "Condicionada"
			}
			if (sEstado === "AS") {
				return "Anulada por el solicitante"
			}
			return "";
		},

		formatDateLicenseYYYYMMDD: function (dDate) {
			if (typeof (dDate) === "object") {
				let dDateFormatted = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
				let d = new Date(dDateFormatted);
				let month = '' + (d.getMonth() + 1);
				let day = '' + d.getDate();
				let year = d.getFullYear();

				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;

				return [year, month, day].join('-');
			}
			return dDate;
		},

		// formatDateLicenseWithoutUtc: function (dDate) {
		// 	let d = dDate
		// 	let month = '' + (d.getMonth() + 1);
		// 	let day = '' + d.getDate();
		// 	let year = d.getFullYear();

		// 	if (month.length < 2) month = '0' + month;
		// 	if (day.length < 2) day = '0' + day;

		// 	return [day, month, year].join('-');
		// },
		formatDateLicenseWithoutUtc: function (dDate) {
    if (!dDate) return "";

    let d = (dDate instanceof Date) ? dDate : new Date(dDate);
    if (isNaN(d)) return "";

    let day = String(d.getUTCDate()).padStart(2, "0");
    let month = String(d.getUTCMonth() + 1).padStart(2, "0");
    let year = d.getUTCFullYear();

    return `${day}-${month}-${year}`;
},


		getTimeFromHorariosInit: function (dDate, iInicio) {
			var iDate = dDate.getTime();
			var dFormatted = new Date(iDate + iInicio);
			return dFormatted;
		},

		getTimeFromHorariosEnd: function (dDate, iFin) {
			var iDate = dDate.getTime();
			var dFormatted = new Date(iDate + iFin);
			return dFormatted;
		},

		getFormattedDateOffset: function (dDate) {
			var date = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
			var sFullYear = this.getFullYear(date);
			var str = sFullYear + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			return str;
		},

		getFormattedDate: function (date) {
			if (date !== undefined) {
				var sFullYear = this.getFullYear(date);
				var str = sFullYear + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
				return str;
			}
		},

		_getFormatInstance: function (decimals, withThousands) {
			if (decimals === undefined || decimals === null) {
				decimals = 2;
			}
			return NumberFormat.getFloatInstance({
				minFractionDigits: decimals,
				maxFractionDigits: decimals,
				// decimalSeparator: ",",
				// groupingSeparator: ".",
				groupingEnabled: withThousands
			});
		},

		formatStrToDec: function (number, decimals) {
			var withThousands = false;
			return this._getFormatInstance(decimals).format(number, withThousands);
		},

		formatDecimalWithThousands: function (number, decimals) {
			var withThousands = true;
			return this._getFormatInstance(decimals).format(number, withThousands);
		},

		parseStrToDec: function (s, decimals) {
			return (s) ? this._getFormatInstance(decimals).parse(s) : NaN;
		},

		getUTCdate: function (oDate) {
			return new Date(Date.UTC(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), 0, 0, 0, 0));
		},

		/******************************************FLOAT para Currency************************************************/
		_specialCurrencies: [{
			CurrencyKey: "COP",
			Decimals: 0
		}, {
			CurrencyKey: "CLP",
			Decimals: 0
		}],

		getFullYear: function (dDate) {
			var dd = dDate.getDate();
			var mm = dDate.getMonth() + 1; //January is 0!
			var yyyy = dDate.getFullYear();

			if (dd < 10) {
				dd = '0' + dd;
			}

			if (mm < 10) {
				mm = '0' + mm;
			}

			dDate = yyyy + "-" + mm + "-" + dd;
			return dDate;
		},

		getCurrencyDecimals: function (currencyKey) {
			//default decimal places
			var decimals = 2;
			//finds currency
			var results = jQuery.grep(this._specialCurrencies, function (currency) {
				return currency.CurrencyKey === currencyKey;
			});
			if (results.length > 0) {
				decimals = results[0].Decimals;
			}
			return decimals;
		},

		formatCurrency: function (amount, currencyKey) {
			var decimals = this.getCurrencyDecimals(currencyKey);
			var withThousands = true;
			return this._getFormatInstance(decimals).format(amount, withThousands);
		},

		/******************************************FLOAT para Gateway************************************************/
		_getFormatNumberGatewayInstance: function (decimals) {
			if (decimals === undefined || decimals === null) {
				decimals = 2;
			}
			return NumberFormat.getFloatInstance({
				minFractionDigits: decimals,
				maxFractionDigits: decimals,
				// decimalSeparator: ".",
				// groupingSeparator: ",",
				groupingEnabled: false
			});
		},

		formatDecimalForGatewayService: function (number, decimals) {
			//parsea valor
			var numberDec = this.parseStrToDec(number, decimals);
			//formatea para gateway
			return this._getFormatNumberGatewayInstance(decimals).format(numberDec);
		},

		/******************************************NUMERIC************************************************/
		_numberFormatter: NumberFormat.getFloatInstance({
			maxFractionDigits: 0
				//decimalSeparator: "."
		}),

		formatIntThousands: function (n) {
			if (n) {
				n = parseInt(n);
				if (!isNaN(n)) {
					return this._numberFormatter.format(n);
				}
			}
		},

		/******************************************DATE************************************************/
		_dateFormatter: DateFormat.getDateTimeInstance({
			pattern: "dd-MM-yyyy"
		}),

		_dateTimeFormatter: DateFormat.getDateTimeInstance({
			pattern: "dd-MM-yyyy HH:mm"
		}),

		_timeFormatter: DateFormat.getDateTimeInstance({
			pattern: "HH:mm"
		}),

		formatDateWithoutGMT: function (date) {
			return this._dateFormatter.format(date);
		},

		formatDateTimeWithoutGMT: function (date) {
			return this._dateTimeFormatter.format(date);
		},

		formatTime: function (date) {
			return this._timeFormatter.format(date);
		},

		parseDate: function (s) {
			if (s) {
				return this._dateFormatter.parse(s);
			}
		},

		formatTimeString: function (time) {
			time = time.toString();

			// Extraer las partes de la hora (horas, minutos, segundos)
			var horas = time.substr(0, 2);
			var minutos = time.substr(2, 2);

			// Formar la hora en el formato deseado
			var horaFormateada = horas + ":" + minutos;

			return horaFormateada;
		},

		getCommentsFromLicence: function (oLicense) {
			return oLicense.Comments;
		},

		buildCommentCamesa: function (oLicense) {
			let sValue = "";
			sValue += oLicense.R500kv === "X" ? " Requiere calle 500 kV abierta: Si, " : "";
			sValue += oLicense.Bloqueo === "X" ? " Bloqueo de recierre: Si, " : "";
			sValue += oLicense.Barrafs === "X" ? " Requiere Barra F/S: Si, Barra Especificada: " + oLicense.Barrafstx + " " : "";
			let oDate = this.formatDate(oLicense.Solend);
			sValue = sValue + " Equipo a Intervenir: " + oLicense.Equiinterv + " ";
			sValue = sValue + " Trabajo a realizar " + oLicense.Descripcion + " ";
			sValue = sValue + " Finaliza:" + oDate + " LT Nº " + oLicense.Id + " ";
			return sValue;
		},

		formatDate: function (d) {
			if (d) {
				var date = d;
				date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
				return this._dateFormatter.format(date);
			}
		},

		getTimeStringWithoutUTC: function (iTime) {
			var dateFormatted = new Date(iTime);
			var hours = dateFormatted.getHours();
			var minutes = dateFormatted.getMinutes();
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes;
			return strTime;
		},

		getTimeString: function (iTime) {
			if (!iTime) {
				return;
			}

			if (iTime instanceof Date) {
				var date = new Date(iTime);
			} else {
				var dateFormatted = new Date(iTime);
				var date = new Date(dateFormatted.getTime() + dateFormatted.getTimezoneOffset() * 60 * 1000);
			}

			var hours = date.getHours();
			var minutes = date.getMinutes();
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes;
			return strTime;
		},

		getTimeStringAndConvertTimezone: function (mTime) {
			if (!mTime) {
				return;
			}

			var date = new Date(mTime);
			date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

			var hours = date.getHours();
			var minutes = date.getMinutes();
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes;
			return strTime;
		},

		formatDateTimePickerTime: function (dDate) {
			var sFullYear = this.getFullYear(dDate);
			var sTime = dDate.getHours() + "" + dDate.getMinutes() + "" + dDate.getSeconds();

			// (AAAAMMDDhhmmss) 
			return sFullYear + sTime;
		},

		formatDateTime: function (d) {
			if (d) {
				var date = d;
				date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
				return this._dateTimeFormatter.format(date);
			}
		},

		formatJsonDate: function (d) {
			if (d) {
				var date = d;
				if (typeof d === "string") {
					var ticks = d.replace("/Date(", "");
					ticks = ticks.replace(")/", "");
					ticks = parseInt(ticks);
					date = new Date(ticks);
				}
				//fixes GMT offset
				date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
				return date;
			}
		},

		formatStringToDate: function (d) {
			if (this._getType(d) === 'string') {
				d = new Date(parseInt(d.replace("/Date(", "").replace(")/")));
			}
			return this.formatDate(d);
		},

		formatDateShortDesc: function (d) {
			if (d) {
				//formatting
				var f = DateFormat.getDateTimeInstance({
						pattern: "MMMM dd"
					},
					new sap.ui.core.Locale("en-US")
				);
				var r = f.format(d);
				return r;
			}
		},

		formatDateWeekDayDesc: function (d) {
			if (d) {
				//formatting
				var f = DateFormat.getDateTimeInstance({
						pattern: "EEEE MMMM dd"
					},
					new sap.ui.core.Locale("en-US")
				);
				var r = f.format(d);
				return r;
			}
		},

		formatWeekDayDesc: function (d) {
			if (d) {
				//formatting
				var f = DateFormat.getDateTimeInstance({
						pattern: "EEEE"
					},
					new sap.ui.core.Locale("en-US")
				);
				var r = f.format(d);
				return r;
			}
		},

		formatDateMonthYear: function (year, month) {
			if (year && month) {
				//shifts month to index 0
				month -= 1;
				//creates date
				var d = new Date(year, month, 1);
				//formatting
				var f = DateFormat.getDateTimeInstance({
						pattern: "yyyy MMMM"
					},
					new sap.ui.core.Locale("en-US")
				);
				var r = f.format(d);
				//r = r.toUpperCase();
				return r;
			}
		},

		formaTimesToShow: function (iDate) {
			var dDate = new Date(iDate);
			var oNewDate = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
			return oNewDate;
		},

		getLicenceFormattedMS: function (oLicence) {
			oLicence.Timend = new Date(oLicence.Timend.ms);
			oLicence.Timend = this.formaTimesToShow(oLicence.Timend);
			oLicence.Timbeg = new Date(oLicence.Timbeg.ms);
			oLicence.Timbeg = this.formaTimesToShow(oLicence.Timbeg);

			return oLicence;
		},

		_getType: function (obj) {
			return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
		},

		parseJsonError: function (error) {
			if (error.responseText && error.statusCode !== 500) {
				var oError = JSON.parse(error.responseText);
				return oError.error.message.value;
			}
			return "Error critico en el servidor.";
		},

		getRegionesDescriptionByCode: function (sWerks) {
			switch (sWerks) {
			case "102":
				// return "Reg. Metropolitana"; INI MOD - TRNS81
				return "Región Centro Este"; // FIN MOD - TRNS81
			case "103":
			case "113":
				return "Norte"
			case "104":
			case "114":
				return "Sur"
			default:
				return "";
			}
		},

		removeResults: function (oObject) {
			oObject = (oObject.results) ? oObject.results : (oObject.result) ? oObject.result : oObject;
			delete oObject.__metadata;
			for (var property in oObject) {
				var type = this.getType(oObject[property]);
				if (type === "object") {
					oObject[property] = this.removeResults(oObject[property]);
				}
				if (type === "number") {
					(new RegExp("TIENE.*").test(property)) ? oObject[property] = !!+oObject[property]: undefined;
				}
			}
			return oObject;
		},

		getType: function (obj) {
			return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
		},

		formatTimesToDate: function (aDays) {
			aDays.map(function (oDay) {
				oDay.Horafin = new Date(oDay.Horafin);
				oDay.Horainicio = new Date(oDay.Horainicio);
			});
		},

		formatDatesGMT: function (dDate) {
			let dDateFormatted = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
			let d = new Date(dDateFormatted);
			return d;
		},
		daysInBetweenDates: function (DInicio, DHasta) {
			var Difference_In_Time = DHasta.getTime() - DInicio.getTime();
			console.log(Difference_In_Time);
			var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
			console.log(Difference_In_Days);
			return Difference_In_Days;
		},
		//i changed the function, now, instead of returning the ms it returns the date object
		formatTimesFromGetLicenses: function (aLicenses) {

			aLicenses.map(function (oLicense) {

				if (oLicense.HorariosPorLicencia_nav && oLicense.HorariosPorLicencia_nav.length > 0) {
					var aLicensesDays = oLicense.HorariosPorLicencia_nav;
					aLicensesDays.map(function (oDay) {
						//why is this if here?
						//i should add the gmt on this dates, so it shows the correct date
						let gmtDifferenceMs = new Date().getTimezoneOffset() * 60 * 1000;
						if (oDay.Horafin.ms >= 0) {
							oDay.Horafin = new Date(oDay.Horafin.ms + gmtDifferenceMs);
						}

						if (oDay.Horainicio.ms >= 0) {
							oDay.Horainicio = new Date(oDay.Horainicio.ms + gmtDifferenceMs);
						}

					});
				}

				if (oLicense.Timbeg.ms >= 0) {
					oLicense.Timbeg = new Date(oLicense.Timbeg.ms);
				}

				if (oLicense.Timend.ms >= 0) {
					oLicense.Timend = new Date(oLicense.Timend.ms);
				}
			});
		},

		getTimeStringSAPFormat: function (date) {
			return "PT" + date.getHours() + "H" + date.getMinutes() + "M" + date.getSeconds() + "S";
		},

		deleteNavPropertiesByPeriod: function (oLicense, sPeriod) {

			if (sPeriod === "C") {
				delete oLicense.HorariosPorLicencia_nav;

			}

			//hecho por hector zea, consultar si hay dudas.
			if (oLicense.Tipo === "L") {
				delete oLicense.CoordinacionesLicencia_nav;
				delete oLicense.ObservacionesLicencia_nav;
			}

			// console.log(sPeriod);
			//delete oLicense.HorariosPorLicencia_nav;
			// 	console.log(oLicense.HorariosPorLicencia_nav);

		},

		formatDayArrayTimes: function (oLicense) {
			var self = this;
			//TODO fixed with a patch, remove later when fixed correctly
			if (oLicense.HorariosPorLicencia_nav && oLicense.HorariosPorLicencia_nav.length > 0) {
				oLicense.HorariosPorLicencia_nav.map(function (oDay) {
					oDay.Horainicio = new Date(oDay.Horainicio);
					oDay.Horafin = new Date(oDay.Horafin);
					oDay.Horainicio = self.getTimeStringSAPFormat(oDay.Horainicio);
					oDay.Horafin = self.getTimeStringSAPFormat(oDay.Horafin);
				});
			}
		},

		formatTimes: function (oLicense) {
			if (oLicense.Timend !== null) {
				oLicense.Timend = "PT" + oLicense.Timend.getHours() + "H" + oLicense.Timend.getMinutes() + "M" + oLicense.Timend.getSeconds() + "S";
			} else {
				oLicense.Timend = "PT00H00M00S";
			}

			if (oLicense.Timbeg !== null) {
				oLicense.Timbeg = "PT" + oLicense.Timbeg.getHours() + "H" + oLicense.Timbeg.getMinutes() + "M" + oLicense.Timbeg.getSeconds() + "S";
			} else {
				oLicense.Timbeg = "PT00H00M00S";
			}

		},

		generateContentForMassiveCoordination: function (aSuccessPUTLicences, aErrorPutLicences, aSuccessPostCoordination,
			aErrorPostCoordination) {
			var oVBox = new sap.m.VBox({
				items: []
			});

			aSuccessPUTLicences.map(function (oSuccess) {
				oVBox.addItem(
					new sap.m.Text({
						text: oSuccess.texto
					})
				);
			});

			aErrorPutLicences.map(function (oError) {
				oVBox.addItem(
					new sap.m.Text({
						text: oError.texto
					})
				);
			});

			aSuccessPostCoordination.map(function (oSuccess) {
				oVBox.addItem(
					new sap.m.Text({
						text: oSuccess.texto
					})
				);
			});

			aErrorPostCoordination.map(function (oError) {
				oVBox.addItem(
					new sap.m.Text({
						text: oError.texto
					})
				);
			});

			return oVBox;

		},

		getTimeFromSap: function (sTime) {
			var aSplited = sTime.replace("H", ":").replace("PT", "").replace("M", ":").replace("S", "").split(":")
			return aSplited[0] + ":" + aSplited[1];
		},

		customFormat: function (vPatterEsperado, vValorfecha) {
			let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: vPatterEsperado
			});

			if (vValorfecha) {
				return oDateFormat.format(vValorfecha);
			}
		}

	};
});