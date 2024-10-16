sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySetLibroGuardias: "/GuardiasListSet",

		POSTLibroGuardia: function (oLibroGuardia) {
			return new Promise((resolve, reject) => {
				oDataService.getModel("LibroGuardias").create(this._entitySetLibroGuardias, oLibroGuardia, {
					success: resolve,
					error: reject
				});
			});
		}
	};
});