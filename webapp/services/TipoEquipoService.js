sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/NSTipoEquipoSet",

		loadTipoEquipo: function (empresa) {
			var aFilter = [new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, empresa)];
			this.getTiposPromise(aFilter).then($.proxy(this.successGetTipos, this)).catch($.proxy(this.errorGetTipos, this));
		},

		getTiposPromise: function (aFilter) {
			var that = this;
			return new Promise((resolve, reject) => {
				let entity = that._entitySet;
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: aFilter,
					success: function (data) {
						// data.model = model;
						resolve(data);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},

		successGetTipos: function (data) {
			var aData = data.results;
			var model = AppManagementHelper.getModel("TipoEquipoJsonModel");
			model.setData({
				TipoEquipo: aData
			});
		},

		errorGetTipos: function (error) {
			//console.log("Error al cargar Equipos");
		}

	};
});