sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/EmpresasLTSet",

		loadTramitacion: function (sKey) {
			var aFilter = [new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, sKey)];
			this.getPromise(aFilter).then($.proxy(this.success, this)).catch($.proxy(this.error, this));
		},
		//
		getPromise: function (aFilter) {
			let entity = this._entitySet;
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: aFilter,
					success: resolve,
					error: reject
				})
			})
		},

		success: function (data) {
			var aData = FormatHelper.removeResults(data);
			AppManagementHelper.getModel("EmpresaTramitacionJsonModel").setData({
				Empresas: aData
			})
		},

		error: function (error) {
			console.log("Error al cargar Empresas");
		}

	};
});