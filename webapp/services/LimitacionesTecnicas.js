sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/LimitacionTecnicaSet",


		loadLimitacionesTecnicas: function (empresa) {
						
			var aFilter = [new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, empresa)];
			this.getLimitacionesPromise(aFilter).then($.proxy(this.successGetLimitaciones, this)).catch($.proxy(this.errorGetLimitaciones, this));
		},

		getLimitacionesPromise: function (aFilter) {
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

		successGetLimitaciones: function (data) {
			var aData = data.results;
			var model = AppManagementHelper.getModel("LimitacionesJsonModel");
			model.setData({
				Limitaciones: aData
			});
			model.setSizeLimit(99999);
		},

		errorGetLimitaciones: function (error) {
			console.log("Error al cargar limitaciones tecnicas");
		}

	};
});