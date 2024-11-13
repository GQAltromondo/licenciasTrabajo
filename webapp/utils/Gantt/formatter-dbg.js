sap.ui.define(["sap/ui/core/format/NumberFormat",
	"sap/ui/core/format/DateFormat"
], function (NumberFormat, DateFormat) {
	"use strict";

	return {
		_dateFormatter: DateFormat.getDateTimeInstance({
			pattern: "dd-MM-yyyy"
		}),

		_dateTimeFormatter: DateFormat.getDateTimeInstance({
			pattern: "dd-MM-yyyy HH:mm"
		}),

		_timeFormatter: DateFormat.getDateTimeInstance({
			pattern: "HH:mm"
		}),

		getStatusName: function (status) {
			if (status === "01") {
				return "Autorizada";
			} else if (status === "28") {
				//antes era Normalizada.
				return "Normalizada";
			} else if (status === "04") {
				return "Cancelada";
			} else if (status === "06") {
				return "NO Autorizada";
			} else if (status === "03") {
				return "Anulada";
			} else if (status === "23") {
				return "En tramite";
			} else if (status === "02") {
				return "Observada";
			} else if (status === "08") {
				return "Entregada";
			} else if (status === "09") {
				return "Generada";
			} else if (status === "30") {
				return "Creada";
			} else if (status === "10") {
				return "Suspendida";
			} else if (status === "05") {
				return "Tramitada";
			} else if (status === "07") {
				return "Coordinada";
			} else if (status === "11") {
				return "Cancelada";
			} else if (status === "90") {
				return "Entregada";
			} else if (status === "91") {
				return "Aprobada y devuelta";
			} else if (status === "92") {
				return "Aprobada y reanudada";
			} else if (status === "93") {
				return "Aprobada y suspendida";
			}
			return status;
		},
		getRegionesDescriptionByCode: function (sWerks) {
			switch (sWerks) {
			case "102":
				return "Reg. Metropolitana";
			case "103":
			case "113":
				return "Norte";
			case "104":
			case "114":
				return "Sur";
			default:
				return "";
			}
		},
		getTimeStringSAPFormat: function (date) {
			return "PT" + date.getHours() + "H" + date.getMinutes() + "M" + date.getSeconds() + "S";
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
		getTiempoReposicionDesc: function (key, aRepositionTimes) {
			let tiempos = aRepositionTimes;

			for (let i = 0; i < tiempos.length; i++) {
				let tiempo = tiempos[i];
				if (tiempo.Valkey == key) return tiempo.Valtext;
			}

			return key;
			//TODO this should search the model for the key/description data, but the current is an odatamodel so unnaccesible
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
		formatDateLicense: function (dDate) {
			if (typeof (dDate) === "object") {
				let dDateFormatted = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
				let d = new Date(dDateFormatted);
				let month = '' + (d.getMonth() + 1);
				let day = '' + d.getDate();
				let year = d.getFullYear();

				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;

				return [day, month, year].join('-');
			}
			return dDate;
		},
		formatDate: function (d) {
			if (d) {
				var date = d;
				date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
				return this._dateFormatter.format(date);
			}
		},
		formatDateLicense: function (dDate) {
			if (typeof (dDate) === "object") {
				let dDateFormatted = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
				let d = new Date(dDateFormatted);
				let month = '' + (d.getMonth() + 1);
				let day = '' + d.getDate();
				let year = d.getFullYear();

				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;

				return [day, month, year].join('-');
			}
			return dDate;
		}

	};
});