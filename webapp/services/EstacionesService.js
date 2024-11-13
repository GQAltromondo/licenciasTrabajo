sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/EstacionesRolesSet",

		loadEstaciones: function (filters) {
			this.getPromise(filters).then($.proxy(this.successGet, this)).catch($.proxy(this.errorGet, this));
		},
		//
		getPromise: function (filters) {
			return new Promise((resolve, reject) => {
				let entity = this._entitySet;
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: filters,
					success: function (data) {
						resolve(data);
					},
					error: function (error) {
						reject(error);
					}
				})
			})
		},

		successGet: function (data) {
			var aData = FormatHelper.removeResults(data);
			var aOrdered = _.orderBy(aData, ['Codigo'], ['asc'])
			AppManagementHelper.getModel("EstacionesJsonModel").setProperty("/Estaciones", aOrdered);
			if (!AppManagementHelper.getModel("EstacionesJsonModel").getProperty("/EstacionesPorRegion")) {
				AppManagementHelper.getModel("EstacionesJsonModel").setProperty("/EstacionesPorRegion", aOrdered);
			}
		},

		errorGet: function (error) {
			console.log("Error al cargar Estaciones", error);
		},

		filterPorRegion: function (centro) {
			var estaciones = AppManagementHelper.getModel("EstacionesJsonModel").getProperty("/Estaciones");
			var filteredEstaciones = [];
			if (centro) {
				filteredEstaciones = estaciones.filter(function (estacion) {
					return estacion.Centro == centro;
				});
			}
			var aOrdered = _.orderBy(filteredEstaciones, ['Codigo'], ['asc'])
			AppManagementHelper.getModel("EstacionesJsonModel").setProperty("/EstacionesPorRegion", aOrdered);
		},

		filterPorRegionUnifilar: function (centro) {
			var estaciones = AppManagementHelper.getModel("EstacionesJsonModel").getProperty("/Estaciones");
			var filteredEstaciones = [];
			if (centro) {
				filteredEstaciones = estaciones.filter(function (estacion) {
					return estacion.Centro == centro;
				});
			}
			var aOrdered = _.orderBy(filteredEstaciones, ['Codigo'], ['asc'])
			AppManagementHelper.getModel("EstacionesJsonModelUnifilar").setProperty("/EstacionesPorRegion", aOrdered);
		}

	};
});