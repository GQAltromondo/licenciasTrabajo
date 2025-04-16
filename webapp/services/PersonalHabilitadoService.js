sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/i18nTranslationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",

], function (oDataServices, FioriHelper, FioriComponentHelper, FormatHelper, i18nTranslationHelper, MessageBoxHelper, AppManagementHelper) {
	"use strict";

	return {
		//PersonalHabilitadoSet
		_entitySet: "/PersonalHabilitadoSet",

		//TODO SEGUIR AHORITA
		_filterPersonal: function (aData) {
			var aFilteredByRegion = _.filter(aData, {})

		},

		/*****************************************************get company list************************************************************/
		getPersonalPromise: function (sSociedad) {
			var aPromise = [];
			aPromise.push(this.getJefeTrabajoPromise(sSociedad));
			aPromise.push(this.getSolicitantePromise(sSociedad));
			aPromise.push(this.getPromise(sSociedad));
			aPromise.push(this.getPersonalHabilitadoTecnicosEt(sSociedad));
			aPromise.push(this.getJefeTrabajoTctPromise(sSociedad));
			aPromise.push(this.getJefeTrabajoGuiadoPromise(sSociedad));
			aPromise.push(this.getJefeTrabajoTctGuiadoPromise(sSociedad));
			Promise.all(aPromise).then(function (aPromisesResolved) {
				var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
				let all = aPromisesResolved[2].results;
				let map = new Map();
				let todos = [];
				all.forEach(el => {
					if (!map.has(el.Legajo)) {
						map.set(el.Legajo, true); // set any value to Map
						todos.push(el);
					}
				});

				oModel.setData({
					JefeDeTrabajo: aPromisesResolved[0].results,
					Solicitante: aPromisesResolved[1].results,
					Todos: Array.from(todos),
					TecnicosEt: aPromisesResolved[3].results,
					JefeDeTrabajoTct: aPromisesResolved[4].results,
					// Ticket #86190 GQ
					JefeDeTrabajoGuiado: aPromisesResolved[5],
					JefeDeTrabajoTctGuiado: aPromisesResolved[6]
				})
			}).catch(function (e) {
				console.log("aaaa")
			})
		},

		getFiltersPersonalHabilitado: function (sType, sSociedad, sClase, sLote, sLote2) {
			let filters = [];

			// Filtro obligatorio por Empresa
			filters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, sSociedad));

			// Filtros múltiples para TipoHab con OR
			if (sType) {
				let aTypes = [];

				if (Array.isArray(sType)) {
					aTypes = sType;
				} else if (typeof sType === "string") {
					aTypes = sType.split(" ");
				}

				let aTypeFilters = aTypes.map(function (type) {
					return new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, type.toUpperCase());
				});

				if (aTypeFilters.length > 1) {
					filters.push(new sap.ui.model.Filter(aTypeFilters, false)); // false = OR
				} else if (aTypeFilters.length === 1) {
					filters.push(aTypeFilters[0]);
				}
			}

			// Filtro para ClaseHab
			if (sClase) {
				filters.push(new sap.ui.model.Filter("ClaseHab", sap.ui.model.FilterOperator.EQ, sClase));
			}

			// Filtro para Lote
			if (sLote) {
				filters.push(
					new sap.ui.model.Filter({
						path: "Lote",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sLote,
						caseSensitive: false
					})
				);
			}

			return filters;
		},


		getPersonalHabilitadoTecnicosEt: function (sSociedad) {
			var that = this;
			return new Promise(function (resolve, reject) {
				oDataServices.getModel("TransenerOperaciones").read("/PersonalHabilitadoTecnicosEtSet", {
					filters: that.getFiltersPersonalHabilitado("", sSociedad),
					success: resolve,
					error: reject
				})
			})
		},

		getJefeTrabajoPromise: function (sSociedad) {
			var that = this;
			return new Promise(function (resolve, reject) {
				oDataServices.getModel("TransenerOperaciones").read(that._entitySet, {

					filters: that.getFiltersPersonalHabilitado("JT", sSociedad, "H0001", ""),
					success: resolve,
					error: reject
				})
			})
		},

		getJefeTrabajoTctPromise: function (sSociedad) {
			var that = this;
			return new Promise(function (resolve, reject) {
				oDataServices.getModel("TransenerOperaciones").read(that._entitySet, {

					filters: that.getFiltersPersonalHabilitado("", sSociedad, "H0002", "J", "JN"),

					success: resolve,
					error: reject
				})
			})
		},
		getJefeTrabajoGuiadoPromise: function (sSociedad) {
			var that = this;
			return new Promise(function (resolve, reject) {
				oDataServices.getModel("TransenerOperaciones").read(that._entitySet, {
					filters: that.getFiltersPersonalHabilitado("JT", sSociedad, "H0001", ""),
					success: function (oData) {
						const allowedTypes = ["M03", "M07", "M11", "M15", "M19", "M23", "M27"];

						// Filtrar el array de resultados
						const filteredResults = oData.results.filter(function (item) {
							return allowedTypes.includes(item.TipoHab);
						});
				
						resolve(filteredResults); // Devuelve solo los filtrados
					},
					error: reject
				});
			});
		},
		getJefeTrabajoTctGuiadoPromise: function (sSociedad) {
			var that = this;
			return new Promise(function (resolve, reject) {
				oDataServices.getModel("TransenerOperaciones").read(that._entitySet, {
					filters: that.getFiltersPersonalHabilitado("", sSociedad, "H0002", "J", "JN"),
					success: function (oData) {
						const allowedTypes = ["M03", "M07", "M11", "M15", "M19", "M23", "M27"];

						// Filtrar el array de resultados
						const filteredResults = oData.results.filter(function (item) {
							return allowedTypes.includes(item.TipoHab);
						});
				
						resolve(filteredResults); // Devuelve solo los filtrados
					},
					error: reject
				});
			});
		},


		getSolicitantePromise: function (sSociedad) {
			var that = this;
			return new Promise(function (resolve, reject) {
				oDataServices.getModel("TransenerOperaciones").read(that._entitySet, {
					filters: that.getFiltersPersonalHabilitado("SO", sSociedad),
					success: resolve,
					error: reject
				})
			})
		},

		getPromise: function (sSociedad) {
			var that = this;
			return new Promise(function (resolve, reject) {
				oDataServices.getModel("TransenerOperaciones").read(that._entitySet, {
					filters: that.getFiltersPersonalHabilitado("", sSociedad),
					success: resolve,
					error: reject
				})
			})
		},

		loadPersonal: function (society) {
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter({
				path: "Empresa",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: society
			}));
			oDataServices.getModel("TransenerOperaciones").read(this._entitySet, {
				filters: aFilters,
				success: function (data) {
					var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
					oModel.setData({
						Solicitante: _.filter(data.results, {
							TipoHab: "SO"
						}),
						JefeDeTrabajo: _.filter(data.results, {
							TipoHab: "JT"
						})
					})
				},
				error: function () {
					console.log("Se ha producido un error al cargar el personal habilitado")
				}
			})
		}

	};
});