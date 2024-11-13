sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/Gantt/formatter"
], function (oDataService, formatter) {
	"use strict";

	return {
		_entitySet: "/LicenciaTrabajoSet",
		//made with array to be more easily readable
		_expandProperties: ["HorariosPorLicencia_nav", "CoordinacionesLicencia_nav", "ObservacionesLicencia_nav", "TramitacionesLicencia_nav",
			"SuspensionLicencia_nav", "ReanudacionLicencia_nav", "TransferenciaJefeTrabajo_nav", "DevolucionLicencia_nav", "EntregasLicencia_nav",
			"AttachmentXLicencia_nav", "EsquemaUnifilar_nav"
		].join(","),

		_expandTest: ["HorariosPorLicencia_nav"].join(","),

		_expandTramitation: "TramitacionesLicencia_nav",

		semanalCamesa: function (fechadesde, fechahasta, society, aId) {
			var aFilters = [];
			for (let oId of aId) {
				let aIDFilter = new sap.ui.model.Filter({
					path: "Id", //a
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oId //d
				});
				aFilters.push(aIDFilter)
			}

			let desdeFilter = new sap.ui.model.Filter({
				path: "Solbeg", //a
				operator: sap.ui.model.FilterOperator.GE,
				value1: fechadesde
			}); //d

			aFilters.push(desdeFilter)
			let oToday = new Date();
			let hastaFilter = new sap.ui.model.Filter({
				path: "Solend", //b
				operator: sap.ui.model.FilterOperator.LE,
				value1: fechahasta
			});
			aFilters.push(hastaFilter)
			let EmpresaFilter = new sap.ui.model.Filter({
				path: "Empresa", //b
				operator: sap.ui.model.FilterOperator.EQ,
				value1: society //c
			});
			aFilters.push(EmpresaFilter)

			let FiltroMantenimiento = new sap.ui.model.Filter({
				path: "HabilitadoGestion", //b
				operator: sap.ui.model.FilterOperator.EQ,
				value1: true //c
			});
			aFilters.push(FiltroMantenimiento)

			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read("/ReporteLTProgramacionSemanalGanttSet", {
					filters: aFilters,
					success: function (data) {
						resolve(data);
					},
					error: function (error) {
						reject(error)
					}
				});
			})

		},

		reflectPromise(promise) {
			return promise.then(v => ({
				v,
				status: "success"
			}), e => ({
				e,
				status: "error"
			}));
		}

	};
});