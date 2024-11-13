sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/FixedValuesSet",

		loadJobCond: function () {
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
					value1: "ZTAB_LICENCIAS",
				}));
				filters.push(new sap.ui.model.Filter({
					path: "Fieldname",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "JOBCOND",
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
			AppManagementHelper.getModel("JobCondJsonModel").setData({
				JobCond: aData
			});
		},

		errorGet: function (error) {
			console.log("Error al cargar Condiciones de Trabajo", error);
		}

	};
});