sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/FixedValuesSet",

		loadMotivos: function () {
			this.getPromise().then($.proxy(this.successGet, this)).catch($.proxy(this.errorGet, this));
		},
		//
		getPromise: function () {
			return new Promise((resolve, reject) => {
				let entity = "/MotivoNoAutorizacionSet"
				
			
				oDataService.getModel("TransenerOperaciones").read(entity, {
					
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
			AppManagementHelper.getModel("MotivoNoAutorizacion").setData(aData);
		},

		errorGet: function (error) {
			console.log("Error al cargar motivos de No Autorizacion", error);
		}

	};
});