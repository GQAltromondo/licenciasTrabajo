sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/EquiposRolesSet",

		getEquipos: function (aEquipos) {
			let aEquiposPromises = [];
			// var a = b ;
			// b = 5 ;
			for (let oEquipo of aEquipos) {
				var aFilter = [
					new sap.ui.model.Filter("Estacion", sap.ui.model.FilterOperator.EQ, oEquipo.Estacion)
				];
				let roles = AppManagementHelper.getModel("UserJsonModel").getProperty("/roles");
				aFilter.push(new sap.ui.model.Filter({
					path: "Rol",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: roles.includes("ope_solic-lic_transener") ? "ope_solic-lic_transener" : roles[0]
				}));
				aEquiposPromises.push(this.getEquiposPromiseInd(aFilter, oEquipo.CodigoTplnr))
			}
			return new Promise((resolve, reject) => {
				Promise.all(aEquiposPromises).then((aEquipos) => {
					let aFormattedData = aEquipos.map(e => {
						return {
							Equipos: e.results,
							CodigoTplnr: e.CodigoTplnr
						}
					})
					resolve(aFormattedData);
				}).catch((err) => {
					reject(err);
				})
			});
		},

		loadEquipos: function (sKey, Equnr) {
			var aFilter = [
				new sap.ui.model.Filter("Estacion", sap.ui.model.FilterOperator.EQ, sKey),
			];
			let roles = AppManagementHelper.getModel("UserJsonModel").getProperty("/roles");
			aFilter.push(new sap.ui.model.Filter({
				path: "Rol",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: roles.includes("ope_solic-lic_transener") ? "ope_solic-lic_transener" : roles[0]
			}));


			aFilter.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, "100"))
			this.getEquiposPromise(aFilter).then($.proxy(this.successGetEquipos, this, Equnr)).catch($.proxy(this.errorGetEquipos, this));
		},

		getEquiposPromiseInd: function (aFilter, sTplnr) {
			return new Promise((resolve, reject) => {
				let entity = this._entitySet;
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: aFilter,
					success: function (data) {
						let oData = {
							CodigoTplnr: sTplnr,
							...data
						}
						resolve(oData);
					},
					error: function (error) {
						reject(error);
					}
				})
			})
		},

		getEquiposPromise: function (aFilter) {
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

		successGetEquipos: function (Equnr, data) {
			var aData = FormatHelper.removeResults(data);
			AppManagementHelper.getModel("EquiposJsonModel").setData({
				Equipos: aData
			})
			AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/enabledComboEQUIPO", true);
			if (Equnr !== undefined) {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Equnr", Equnr);
			}

		},

		errorGetEquipos: function (error) {
			console.log("Error al cargar Equipos");
		}

	};
});