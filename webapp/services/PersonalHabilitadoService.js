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
				})
			}).catch(function (e) {
				console.log("aaaa")
			})
		},

		getFiltersPersonalHabilitado: function (sType, sSociedad, sClase, sLote, sLote2) {
			let filters = [];
			filters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, sSociedad));
			if (sType) {
				filters.push(new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, sType));
			}
			if (sClase) {
				filters.push(new sap.ui.model.Filter("ClaseHab", sap.ui.model.FilterOperator.EQ, sClase));
			}
			if (sLote) {
				filters.push(
					new sap.ui.model.Filter({
						path: "Lote",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sLote,
						value2: sLote2,
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
    var oModel = oDataServices.getModel("TransenerOperaciones");

    // ===== helpers locales =====
    const asArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.results && Array.isArray(data.results)) return data.results;
        return [data];
    };
    const safe = (v) => (v == null ? "" : String(v).trim());

    // Deduplica por TipoHab y arma { TipoHab, Descripcion }
    const toUniqueHabList = (rows) => {
        const map = new Map();
        for (const r of rows) {
            const tipo = safe(r.TipoHab);
            if (!tipo) continue;
            if (!map.has(tipo)) {
                // Fallbacks por si la descripción viene con otro nombre
                const desc =
                    safe(r.Descripcion) ||
                    safe(r.Desc_TipoHab) ||
                    safe(r.DescripcionTipoHab) ||
                    "";
                map.set(tipo, { TipoHab: tipo, Descripcion: desc });
            }
        }
        return Array.from(map.values());
    };

    return new Promise(function (resolve, reject) {
        oModel.read(that._entitySet, {
            filters: that.getFiltersPersonalHabilitado("JT", sSociedad, "H0001", ""),
            success: function (oData) {
                const rows = asArray(oData);
                const list = toUniqueHabList(rows);
                AppManagementHelper.getModel("HabPersonalModel").setData(list);
                resolve(oData);
            },
            error: reject
        });
    });
},

getJefeTrabajoTctPromise: function (sSociedad) {
    var that = this;
    var oModel = oDataServices.getModel("TransenerOperaciones");

    // ===== helpers locales (idénticos a los de arriba) =====
    const asArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.results && Array.isArray(data.results)) return data.results;
        return [data];
    };
    const safe = (v) => (v == null ? "" : String(v).trim());
    const toUniqueHabList = (rows) => {
        const map = new Map();
        for (const r of rows) {
            const tipo = safe(r.Lote);
            if (!tipo) continue;
            if (!map.has(tipo)) {
                const desc =
                    safe(r.Descripcion) ||
                    safe(r.Desc_TipoHab) ||
                    safe(r.DescripcionTipoHab) ||
                    "";
                map.set(tipo, { TipoHab: tipo, Descripcion: desc });
            }
        }
        return Array.from(map.values());
    };

    return new Promise(function (resolve, reject) {
        oModel.read(that._entitySet, {
            // según tu comentario: H0002 y roles J / JN
            // filters: that.getFiltersPersonalHabilitado("", sSociedad, "H0002", "J", "JN"),
			  filters: that.getFiltersPersonalHabilitado("", sSociedad, "H0002"),
            success: function (oData) {
                const rows = asArray(oData);
                const list = toUniqueHabList(rows);
                AppManagementHelper.getModel("HabPersonalTCTModel").setData(list);
                resolve(oData);
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