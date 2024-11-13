sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"Transener/Operaciones/LicenciasTrabajo/services/LicenseService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper"
], function (JSONModel, Device, LicenseService, AppManagementHelper, FioriHelper) {
	"use strict";

	return {
		createLicensesModel: function () {
			// LicenseService.GET();
		},

		createLicenseJsonModel: function () {
			var sPath = FioriHelper.getAppPath();
			var oLicenseJsonModel = AppManagementHelper.getModel("LicenseJsonModel");
			oLicenseJsonModel.loadData(sPath + "model/LicenseJsonModel.json", "", false);
			return oLicenseJsonModel;
		},

		//tipos de filtro
		//duales, para permutaciones duales ( (F1 eq V1) and (F2 eq V2) )
		//multiples, para permutaciones multiples (F1 eq V1 or F2 eq V2 or F3 eq V3)

		createFiltersModel: function () {
			var sPath = FioriHelper.getAppPath();
			var oFilterJsonModel = AppManagementHelper.getModel("FiltersJsonModel");
			var LocalFilterJsonModel = AppManagementHelper.getModel("LocalFilterJsonModel").setData({});
			oFilterJsonModel.loadData(sPath + "model/FiltersJsonModel.json", "", false);
			return oFilterJsonModel;
		}
	};
});