sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatHelper, oDataService, AppManagementHelper) {
	"use strict";

	return {
		_entitySet: "/LicenciasMailXETSet",
		//
		getPromise: function (empresa, estacion, seleccion) {
			let entity = this._entitySet;
			let filters = [
				new sap.ui.model.Filter({
					path: "Empresa",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: empresa
				}),
				new sap.ui.model.Filter({
					path: "Et",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: estacion
				}),

			];
			// Issue 582 - Se debe enviar correo a Tecnicos  de extremos de lineas cuando la ET es de tipo L ( Linea )
		    var sEquipo =  AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Equnr");
			let oEquipo = AppManagementHelper.getModel("EquiposJsonModel").getProperty("/Equipos").find((oEquipo) => oEquipo
				.CodigoEquipo === sEquipo);
			if (oEquipo) {
				if (oEquipo.ExtremoA) {
					filters.push(new sap.ui.model.Filter({
						path: "Et",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: oEquipo.ExtremoA
					}));
				}

				if (oEquipo.ExtremoB) {
					filters.push(new sap.ui.model.Filter({
						path: "Et",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: oEquipo.ExtremoB
					}));
				}
			}

			if (seleccion) {
				filters.push(new sap.ui.model.Filter({
					path: "Area",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: seleccion
				}));
			}
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: filters,
					success: resolve,
					error: reject
				})
			})
		},

	};
});