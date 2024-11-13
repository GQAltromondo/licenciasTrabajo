sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/Gantt/ModelHelper"
], function (oDataService, ModelHelper) {
	"use strict";

	return {
		_entitySet: "/TipoIntervencionSet",

		getPromise: function () {
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read(this._entitySet, {
					success: function (data) {
						resolve(data);

						var model = ModelHelper.getModel("TransenerIntervention");
						model.setData(data.results);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		}

	};
});