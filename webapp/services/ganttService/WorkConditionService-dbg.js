sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService"
], function (oDataService) {
	"use strict";

	return {
		_entitySet: "/FixedValuesSet",
		
		getPromise: function () {
			return new Promise((resolve, reject) => {

				let filters = [];
				filters.push(new sap.ui.model.Filter({
					path: "Tabname",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "ZTAB_LICENCIAS"
				}));
				filters.push(new sap.ui.model.Filter({
					path: "Fieldname",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "JOBCOND"
				}));
				oDataService.getModel("TransenerOperaciones").read(this._entitySet, {
					filters: filters,
					success: resolve,
					error: reject
				});
			});
		}
	};
});