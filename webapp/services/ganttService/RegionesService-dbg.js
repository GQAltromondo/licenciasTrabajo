sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService"
], function (oDataService) {
	"use strict";

	return {
		loadRegiones: function (empresa) {
			let filters = [new sap.ui.model.Filter({
				path: "Bukrs",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: empresa
			})];
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read("/RegionesSet", {
					filters: filters,
					success: function (data) {
						resolve(data);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		}
	};
});