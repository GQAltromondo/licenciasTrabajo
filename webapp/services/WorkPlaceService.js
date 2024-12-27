sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/i18nTranslationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"

], function (oDataServices, FioriHelper, FioriComponentHelper, FormatHelper, i18nTranslationHelper, MessageBoxHelper, AppManagementHelper) {
	"use strict";

	return {
		//PersonalHabilitadoSet
		_entitySet: "/WorkPlaceMasterSet",

		_filterSapWorkplacesByUser: function (aAvailableGroups) {
			var afilteredSapWpByUser = [new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.EQ, 'MDO')];
			var oFilter;
			for (var scpWp of aFilteredScpWorkplaces) {
				oFilter = new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.EQ, scpWp.value);
				afilteredSapWpByUser.push(oFilter);
			}
			return afilteredSapWpByUser;
		},

		_filterSapWorkplacesByUser2: function (aAvailableGroups) {
			var afilteredSapWpByUser = ["MDO"];
			var oFilter;
			for (var scpWp of aFilteredScpWorkplaces) {
				afilteredSapWpByUser.push(scpWp.value);
			}
			return afilteredSapWpByUser;
		},

		_filterScpGroupsByWorkplaces: function (aUserAvaibleGroups) {
			var aCodes = ["TR20", "TR22", "TR24", "TR30", "TR34", "TR40", "TR50", "TR52", "TR54", "TR60","TB12", "TB11", "TR12", "TB13"];
			var aFilteredWorkplaces = [];
			var aGroupValue;

			for (var oGroup of aUserAvaibleGroups) {
				aGroupValue = oGroup;

				for (var code of aCodes) {
					if (aGroupValue.startsWith(code)) {
						aFilteredWorkplaces.push(oGroup);
					}
				}
			}
			return aFilteredWorkplaces;
		},

		loadWorkPlaces: function (empresa, fnCallback) {
			var that = this
			var filters = [];
			if (empresa) {
				let filterEmpresa = empresa == 100 ? "TR" : "TB";
				filters.push(new sap.ui.model.Filter({
					path: "Company",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: filterEmpresa
				}));
			}
			this.getWorkPlacePromise(filters).then(function (res) {
				var aData = FormatHelper.removeResults(res);
				AppManagementHelper.getModel("WorkPlacesJsonModel").setData({
					WorkPlaces: aData,
					FilteredWorkPlaces: aData
				});
				that.workPlaces = aData;
				if(fnCallback)fnCallback();
			}, function (err) {
				console.log("Error al cargar WorkPlaces", err);
			});
		},

		getWorkPlacePromise: function (filters) {
			let that = this;
			return new Promise(function (resolve, reject) {
				oDataServices.getModel("WorkOrderMaster").read(that._entitySet, {
					filters: filters,
					success: resolve,
					error: reject
				})
			})
		},

		filterWorkPlacesByRegion: function (region) {
			let workPlaces = this.workPlaces;
			let filteredWorkPlaces = [];
			if (region) {
				filteredWorkPlaces = workPlaces.filter(function (workPlace) {
					return workPlace.Werks === region;
				});
			} else {
				filteredWorkPlaces = workPlaces;
			}
			console.log(filteredWorkPlaces)
			AppManagementHelper.getModel("WorkPlacesJsonModel").setProperty("/FilteredWorkPlaces", filteredWorkPlaces)
		}

	};
});