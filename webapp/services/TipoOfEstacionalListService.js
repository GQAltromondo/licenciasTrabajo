sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/EstacionalListSet",
		
		getPromise: function () {
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read(this._entitySet, {
					success: function (data) {
						resolve(data);

						var model = AppManagementHelper.getModel("TransenerIntervention");
						model.setData({
							EstacionList: data.results
						});
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		}

	};
});