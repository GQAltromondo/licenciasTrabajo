sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper"
], function (oDataService, FormatHelper) {
	"use strict";

	return {
		_entitySet: "/LicenciaTrabajoSet",
		//made with array to be more easily readable
		_expandProperties: ["HorariosPorLicencia_nav", "CoordinacionesLicencia_nav", "ObservacionesLicencia_nav", "TramitacionesLicencia_nav",
			"SuspensionLicencia_nav", "ReanudacionLicencia_nav", "TransferenciaJefeTrabajo_nav", "DevolucionLicencia_nav", "EntregasLicencia_nav",
			"AttachmentXLicencia_nav", "EsquemaUnifilar_nav", "ColocacionPat_nav", "RetiroPAT_nav", "HabilitacionRecierre_nav",
			"InhibicionRecierre_nav",
		].join(","),

		_expandTest: ["HorariosPorLicencia_nav"].join(","),

		_expandTramitation: "TramitacionesLicencia_nav",

		getLicenses: function (filters, expand) {
			return new Promise((resolve, reject) => {
				let entity = this._entitySet;
				let urlParameters = {};
				if (expand) urlParameters["$expand"] = expand;
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: filters,
					urlParameters: urlParameters,
					success: function (data) {
						resolve(data);
					},
					error: function (error) {
						reject(error)
					}
				});
			})
		},

		getLicence: function (Empresa, Id, Tipo, Anio, expand, selectProp) {
			return new Promise((resolve, reject) => {
				let entity = this._entitySet
				var key = entity + "(Empresa='" + Empresa + "',Id='" + Id + "',Tipo='" +
					Tipo + "',Anio='" + Anio + "')";
				let urlParameters = {};
				if (!expand) {
					urlParameters["$expand"] = this._expandProperties;
				} else {
					urlParameters["$expand"] = expand
				}

				if (selectProp) {
					urlParameters["$select"] = selectProp;
				}

				oDataService.getModel("TransenerOperaciones").read(key, {
					filters: [],
					urlParameters: urlParameters,
					success: function (data) {
						resolve(data);
					},
					error: function (error) {
						reject(error)
					}
				});
			})
		},

		getLicencesWithHorarioSemanal: function (licences) {
			let aPromises = [];
			return new Promise((resolve, reject) => {
				for (let oLicense of licences) {
					aPromises.push(this.getLicence(oLicense.Empresa, oLicense.Id, oLicense.Tipo, oLicense.Anio,
						"HorariosPorLicencia_nav,TramitacionesLicencia_nav",
						"HorariosPorLicencia_nav,Id,TramitacionesLicencia_nav"))
				}
				Promise.all(aPromises).then((data) => {
					let aDataFormatted = data.map(e => {
						return {
							Id: e.Id,
							HorariosSemana: e.HorariosPorLicencia_nav.results,
							Tramitaciones: e.TramitacionesLicencia_nav.results
						}
					})
					aDataFormatted.forEach(e => {
						e.HorariosSemana.forEach(x => {
							x.Fecha = FormatHelper.formatDatesGMT(x.Fecha);
						})
					})
					resolve(aDataFormatted)
				}).catch((e) => {
					reject(e)
				})
			})
		},

		getLicenciasFullData: function (aData) {
			var aPromises = [];
			for (var oData of aData) {
				aPromises.push(this.getLicence(oData.Empresa, oData.Id, oData.Tipo, oData.Anio))
			}

			return new Promise((resolve, reject) => {
				Promise.all(aPromises.map(this.reflectPromise)).then((res) => {
					var aSuccessData = res.filter(x => x.status === "success").map(x => x.v)
					resolve(aSuccessData);
				});
			})

		},

		semanalCamesa: function (society, fechadesde, fechahasta) {
			var aFilters = [];

			let desdeFilter = new sap.ui.model.Filter({
				path: "Solbeg", //a
				operator: sap.ui.model.FilterOperator.GE,
				value1: fechadesde //d
			});
			aFilters.push(desdeFilter)

			let hastaFilter = new sap.ui.model.Filter({
				path: "Solend", //b
				operator: sap.ui.model.FilterOperator.LE,
				value1: fechahasta //c
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
				oDataService.getModel("TransenerOperaciones").read("/ReporteLTProgramacionSemanalSet", {
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

		_getHorariosLicencia: function (empresa, id, tipo, anio) {
			return new Promise((resolve, reject) => {
				let oModel = oDataService.getModel("TransenerOperaciones");
				oModel.read(`/LicenciaTrabajoSet(Empresa='${empresa}',Id='${id}',Tipo='${tipo}',Anio='${anio}')`, {
					urlParameters: {
						"$expand": "HorariosPorLicencia_nav"
					},
					success: resolve,
					error: reject
				});
			});
		},

		reflectPromise(promise) {
			return promise.then(v => ({
				v,
				status: "success"
			}), e => ({
				e,
				status: "error"
			}));
		},

		workReportCammesa: function (Empresa, Desde, Hasta, anuladas) {
			return new Promise((resolve, reject) => {
				let promises = [];
				let Tipo = new sap.ui.model.Filter({
					path: "Tipo",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "L"
				});
				//filtro para que tome las fechas al revez
				let oIdFinalFilter = new sap.ui.model.Filter({
					path: "Idfinal",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "X"
				});

				let empresaFilter = new sap.ui.model.Filter({
					path: "Empresa",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: Empresa
				});

				let desdeFilter = new sap.ui.model.Filter({
					path: "Solbeg", //a
					operator: sap.ui.model.FilterOperator.GE,
					value1: Desde //d
				});

				let hastaFilter = new sap.ui.model.Filter({
					path: "Solend", //b
					operator: sap.ui.model.FilterOperator.LE,
					value1: Hasta //c
				});

				let autorizadasFilter = new sap.ui.model.Filter({
					path: "Licstat",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "01"
				});
				promises.push(this.getLicenses([Tipo, empresaFilter, desdeFilter, hastaFilter, oIdFinalFilter, autorizadasFilter]))

				let enTramitesFilter = new sap.ui.model.Filter({
					path: "Licstat",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "23"
				});
				promises.push(this.getLicenses([Tipo, empresaFilter, desdeFilter, hastaFilter, oIdFinalFilter, enTramitesFilter]))

				let entregadasFilter = new sap.ui.model.Filter({
					path: "Licstat",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "1E"
				});
				promises.push(this.getLicenses([Tipo, empresaFilter, desdeFilter, hastaFilter, oIdFinalFilter, entregadasFilter]))

				let suspendidaFilter = new sap.ui.model.Filter({
					path: "Licstat",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "1S"
				});
				promises.push(this.getLicenses([Tipo, empresaFilter, desdeFilter, hastaFilter, oIdFinalFilter, suspendidaFilter]))

				let coordinadasFilter = new sap.ui.model.Filter({
					path: "Licstat",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "07"
				});
				promises.push(this.getLicenses([Tipo, empresaFilter, desdeFilter, hastaFilter, oIdFinalFilter, coordinadasFilter]))

				if (anuladas) {
					let anuladasFilter = new sap.ui.model.Filter({
						path: "Licstat",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: "03"
					});
					promises.push(this.getLicenses([Tipo, empresaFilter, desdeFilter, hastaFilter, oIdFinalFilter, anuladasFilter]))
				}

				Promise.all(promises.map(this.reflectPromise)).then((res) => {
					if (res.every(x => x.status === "error")) return reject(res.map(x => x.e));
					let licenses = res.map(x => (x.v && x.v.results) || []).flat();

					resolve(licenses);
				});
			}, err => console.error(err));
		},

		//INI TRNS99 - obtener dias anulados
		getDiasAnulados: function (aLicencias) {
				return new Promise((resolve, reject) => {
					let aFilters = [];
					var aFilterLicencias = [];
					for (var oLic of aLicencias) {
						aFilterLicencias.push(new sap.ui.model.Filter({
							path: "Id",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: oLic.Id
						}))
					}
					if (aFilterLicencias.length > 0) {
						aFilters.push(new sap.ui.model.Filter({
							filters: aFilterLicencias,
							and: false,
						}));
					}
					//estados
					aFilters.push(new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter({
								path: "Estado",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: "NA"
							}),
							new sap.ui.model.Filter({
								path: "Estado",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: "02"
							}),
							new sap.ui.model.Filter({
								path: "Estado",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: "AS"
							})
						],
						and: false,
					}));
					oDataService.getModel("TransenerOperaciones").read("/LicenciaDiasSet", {
						filters: aFilters,
						success: function (data) {
							resolve(data.results);
						},
						error: function (error) {
							resolve([]);
						}
					});
				})
			}
			//FIN TNRS99
	};
});