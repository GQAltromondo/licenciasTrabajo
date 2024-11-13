sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/LTOrdenesSet",

		loadOrdenes: function (empresa, region, fnCallback) {
			this._fnCallback = fnCallback;
			AppManagementHelper.getModel("OrdenesJsonModel").setProperty("/Busy", true);
			var aFilter = [
				new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, empresa),
				new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.EQ, region)
			];
			this.getOrdenesPromise(aFilter).then($.proxy(this.successGetOrdenes, this)).catch($.proxy(this.errorGetOrdenes, this));
		},
		//
		getOrdenesPromise: function (aFilter) {
			return new Promise((resolve, reject) => {
				let entity = this._entitySet;
				oDataService.getModel("TransenerOperaciones").read(entity, {
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

		successGetOrdenes: function (data) {
			var aData = FormatHelper.removeResults(data);
			AppManagementHelper.getModel("OrdenesJsonModel").setData({
				Ordenes: aData,
				Busy: false
			});
			
			if (this._fnCallback)
				this._fnCallback();
		},

		errorGetOrdenes: function (error) {
			console.log("Error al cargar Ordenes", error);
			AppManagementHelper.getModel("OrdenesJsonModel").setProperty("/Busy", false);
		},
		
		//devuelve un objeto con {Solbeg, Solend, Arbpl,
		// Solicitante, Equstatnocam, Tplnr, Equnr, Jefe}
		// para colocar dentro del modelo de la licencia
		getDataByOrder: function(key) {
			let ordenes = AppManagementHelper.getModel("OrdenesJsonModel").getData().Ordenes;
			if(!ordenes) throw new Error("No se encuentra cargado el array de ordenes");
			let encontrada = ordenes.find(x => x.Orden === key);
			if(!encontrada) return {};
			let datos = {
				Solbeg: encontrada.Inicio,
				Solend: encontrada.Fin,
				Arbpl: encontrada.Puestotr,
				Solicitante: encontrada.Solicitante,
				Equstatnocam: encontrada.Estadoeq,
				Tplnr: encontrada.Et,
				Equnr: encontrada.Eq,
				Jefe: encontrada.Jefe
			}
			return datos;
		}

	};
});