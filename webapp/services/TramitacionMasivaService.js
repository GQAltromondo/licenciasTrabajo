sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/FixedValuesSet",

		loadTramitacion: function () {
			this.getPromise().then($.proxy(this.successGet, this)).catch($.proxy(this.errorGet, this));
		},
		//
		getPromise: function () {
			return new Promise((resolve, reject) => {
				let entity = "/FixedValuesSet"
				
				let filters = [];
				filters.push(new sap.ui.model.Filter({
					path: "Tabname",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "ZTAB_OP_TRALIC",
				}));
				filters.push(new sap.ui.model.Filter({
					path: "Fieldname",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "ESTADO",
				}));
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
			AppManagementHelper.getModel("TramitacionMasivaListJsonModel").setData({
				Tiempos: aData
			});
		},

		errorGet: function (error) {
			console.log("Error al cargar Tramitacion", error);
		}

	};
});