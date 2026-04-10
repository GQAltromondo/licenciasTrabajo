sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/utils/Gantt/DateHelper"
], function (DateHelper) {
	"use strict";

	return {

		formatData: function (registros) {
			var timeZoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;

			registros.forEach(function (registro) {
				registro.LunesI = new Date(registro.Lunes.getTime() + registro.LunesI.ms + timeZoneOffsetMs);
				registro.LunesF = new Date(registro.Lunes.getTime() + registro.LunesF.ms + timeZoneOffsetMs);
				registro.MartesI = new Date(registro.Martes.getTime() + registro.MartesI.ms + timeZoneOffsetMs);
				registro.MartesF = new Date(registro.Martes.getTime() + registro.MartesF.ms + timeZoneOffsetMs);
				registro.MiercolesI = new Date(registro.Miercoles.getTime() + registro.MiercolesI.ms + timeZoneOffsetMs);
				registro.MiercolesF = new Date(registro.Miercoles.getTime() + registro.MiercolesF.ms + timeZoneOffsetMs);
				registro.JuevesI = new Date(registro.Jueves.getTime() + registro.JuevesI.ms + timeZoneOffsetMs);
				registro.JuevesF = new Date(registro.Jueves.getTime() + registro.JuevesF.ms + timeZoneOffsetMs);
				registro.ViernesI = new Date(registro.Viernes.getTime() + registro.ViernesI.ms + timeZoneOffsetMs);
				registro.ViernesF = new Date(registro.Viernes.getTime() + registro.ViernesF.ms + timeZoneOffsetMs);
				registro.SabadoI = new Date(registro.Sabado.getTime() + registro.SabadoI.ms + timeZoneOffsetMs);
				registro.SabadoF = new Date(registro.Sabado.getTime() + registro.SabadoF.ms + timeZoneOffsetMs);
				registro.DomingoI = new Date(registro.Domingo.getTime() + registro.DomingoI.ms + timeZoneOffsetMs);
				registro.DomingoF = new Date(registro.Domingo.getTime() + registro.DomingoF.ms + timeZoneOffsetMs);

			});
		},

		getDataOnlyWithDates: function (registros) {
			var that = this;
			var timeZoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
			var registrosFiltrados = [];

			registros.map(function (item) {
				var LunesI = new Date(item.Lunes.getTime() + item.LunesI.ms + timeZoneOffsetMs);
				var LunesF = new Date(item.Lunes.getTime() + item.LunesF.ms + timeZoneOffsetMs);
				var MartesI = new Date(item.Martes.getTime() + item.MartesI.ms + timeZoneOffsetMs);
				var MartesF = new Date(item.Martes.getTime() + item.MartesF.ms + timeZoneOffsetMs);
				var MiercolesI = new Date(item.Miercoles.getTime() + item.MiercolesI.ms + timeZoneOffsetMs);
				var MiercolesF = new Date(item.Miercoles.getTime() + item.MiercolesF.ms + timeZoneOffsetMs);
				var JuevesI = new Date(item.Jueves.getTime() + item.JuevesI.ms + timeZoneOffsetMs);
				var JuevesF = new Date(item.Jueves.getTime() + item.JuevesF.ms + timeZoneOffsetMs);
				var ViernesI = new Date(item.Viernes.getTime() + item.ViernesI.ms + timeZoneOffsetMs);
				var ViernesF = new Date(item.Viernes.getTime() + item.ViernesF.ms + timeZoneOffsetMs);
				var SabadoI = new Date(item.Sabado.getTime() + item.SabadoI.ms + timeZoneOffsetMs);
				var SabadoF = new Date(item.Sabado.getTime() + item.SabadoF.ms + timeZoneOffsetMs);
				var DomingoI = new Date(item.Domingo.getTime() + item.DomingoI.ms + timeZoneOffsetMs);
				var DomingoF = new Date(item.Domingo.getTime() + item.DomingoF.ms + timeZoneOffsetMs);

				if (that.getBooleanDiffInicioYFin(LunesI, LunesF) || that.getBooleanDiffInicioYFin(MartesI, MartesF) || that.getBooleanDiffInicioYFin(MiercolesI, MiercolesF) ||
					that.getBooleanDiffInicioYFin(JuevesI, JuevesF) || that.getBooleanDiffInicioYFin(ViernesI, ViernesF) || that.getBooleanDiffInicioYFin(SabadoI, SabadoF) ||
					that.getBooleanDiffInicioYFin(DomingoI, DomingoF)
				) {
					registrosFiltrados.push(item);
				}
			});
			return registrosFiltrados;
		},

		getBooleanDiffInicioYFin: function (inicio, fin) {

			//GQ - Modifi Gantt
			if (inicio && fin) {
				return true
			}
			// if(inicio && fin){
			// 	var dif = inicio.getTime() - fin.getTime();

			// 	if ( dif !== 0 ) {
			// 		return true;
			// 	}
			// 	return false;
			// }else {
			// 	return false;
			// }
		},

		getTimeLineOptions: function () {
			return {
				"1day": {
					innerInterval: {
						unit: "d3.time.day",
						span: 1,
						range: 90
					},
					largeInterval: {
						unit: "d3.time.month",
						span: 1,
						format: "yyyyMMMM"
					},
					smallInterval: {
						unit: "d3.time.day",
						span: 1,
						pattern: "d. HH:mm"
					}
				},
				"2day": {
					innerInterval: {
						unit: "d3.time.day",
						span: 2,
						range: 90
					},
					largeInterval: {
						unit: "d3.time.month",
						span: 1,
						format: "yyyyMMMM"
					},
					smallInterval: {
						unit: "d3.time.day",
						span: 2,
						pattern: "d. HH:mm"
					}
				},
				"4day": {
					innerInterval: {
						unit: "d3.time.day",
						span: 4,
						range: 90
					},
					largeInterval: {
						unit: "d3.time.month",
						span: 1,
						format: "yyyyMMMM"
					},
					smallInterval: {
						unit: "d3.time.day",
						span: 4,
						pattern: "d. HH:mm"
					}
				},
				"1week": {
					innerInterval: {
						unit: "d3.time.week",
						span: 1,
						range: 90
					},
					largeInterval: {
						unit: "d3.time.month",
						span: 1,
						format: "yyyyMMMM"
					},
					smallInterval: {
						unit: "d3.time.week",
						span: 1,
						pattern: "d. HH:mm"
					}
				},
				"2week": {
					innerInterval: {
						unit: "d3.time.week",
						span: 2,
						range: 90
					},
					largeInterval: {
						unit: "d3.time.month",
						span: 1,
						format: "yyyyMMMM"
					},
					smallInterval: {
						unit: "d3.time.week",
						span: 2,
						pattern: "d. HH:mm"
					}
				},
				"1month": {
					innerInterval: {
						unit: "d3.time.month",
						span: 1,
						range: 90
					},
					largeInterval: {
						unit: "d3.time.month",
						span: 6,
						format: "yyyyMMMM"
					},
					smallInterval: {
						unit: "d3.time.month",
						span: 1,
						pattern: "d. HH:mm"
					}
				},
				"2month": {
					innerInterval: {
						unit: "d3.time.month",
						span: 2,
						range: 90
					},
					largeInterval: {
						unit: "d3.time.month",
						span: 6,
						format: "yyyyMMMM"
					},
					smallInterval: {
						unit: "d3.time.month",
						span: 2,
						pattern: "d. HH:mm"
					}
				},
			};
		},

		configAxisTimeStrategy: function (axisTimeStrategy, timeLineOptions, startDate, endDate, zoomLevel) {
			let startTime = this.formatDateStrategyTime(startDate);
			let endTime = this.formatDateStrategyTime(endDate);
			let oldTimeConfig = axisTimeStrategy.getTimeLineOptions();
			axisTimeStrategy.setTimeLineOptions(Object.assign({}, oldTimeConfig, timeLineOptions));

			let totalHorizon = axisTimeStrategy.getTotalHorizon();
			totalHorizon.setStartTime(startTime);
			totalHorizon.setEndTime(endTime);
			axisTimeStrategy.setTotalHorizon(totalHorizon);

			let visibleHorizon = axisTimeStrategy.getVisibleHorizon();
			visibleHorizon.setStartTime(startTime);
			visibleHorizon.setEndTime(endTime);
			axisTimeStrategy.setVisibleHorizon(totalHorizon);
			axisTimeStrategy.setZoomLevel(zoomLevel);
		},

		formatDateStrategyTime: function (date) {
			return DateHelper.formatDatePattern(date, "yyyyMMddHHmmss")
		}

	};
});