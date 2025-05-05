sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/services/ganttService/oDataService"
], function (oDataService) {
	"use strict";

	return {
		getGanttData: function (empresa, week, year, tipo, region, aStatus) {
			let filters = [new sap.ui.model.Filter({
				path: "Empresa",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: empresa
			}), new sap.ui.model.Filter({
				path: "Anio",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: year
			}), new sap.ui.model.Filter({
				path: "Semana",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: week
			}), new sap.ui.model.Filter({
				path: "Tipo",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: tipo
			}), new sap.ui.model.Filter({
				path: "Region",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: region
			})];

			for (var i = 0; aStatus.length > i; i++) {
				filters.push(new sap.ui.model.Filter({
					path: "StatLicencia",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: aStatus[i]
				}));
			}

			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read("/GantLicenciasSet", {
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