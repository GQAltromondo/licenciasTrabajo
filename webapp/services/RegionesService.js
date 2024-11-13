sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/RegionesSet",

		loadRegiones: function (sKey, callback) {
			this._sKey = sKey;
			var aFilter = [new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, sKey)];
			let promise = this.getRegionesPromise(aFilter)
			promise.then($.proxy(this.successGetRegiones, this)).catch($.proxy(this.errorGetRegiones, this)).then(callback);
			
		},
		//
		getRegionesPromise: function (aFilter) {
			let that = this;
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read(that._entitySet, {
					filters: aFilter,
					success: function (data) {
						resolve(data);
					},
					error: function (error) {
						reject(error);
					}
				})
			})
		},

		getRegiones: function () {
			var aRegiones = [];
			if (this._sKey == "100") {
				aRegiones.push({
					Name1: "Norte",
					Werks: "103"
				}, {
					// Name1: "Reg. Metropolitana",
					Name1: "Centro Este",
					Werks: "102"
				}, {
					Name1: "Sur",
					Werks: "104"
				});
			} else {
				aRegiones.push({
					Name1: "Norte",
					Werks: "113"
				}, {
					Name1: "Sur",
					Werks: "114"
				});
			}
			return aRegiones;
		},

		successGetRegiones: function (data) {
			var oModel = AppManagementHelper.getModel("RegionesJsonModel")
			oModel.setData({
				Regiones: this.getRegiones()
			})
			return this.getRegiones();
		},

		errorGetRegiones: function (error) {
			console.log("Error al cargar Regiones");
		}

	};
});