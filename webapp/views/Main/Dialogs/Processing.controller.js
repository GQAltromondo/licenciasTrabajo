sap.ui.define([
	//ui
	"sap/ui/core/mvc/Controller",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	//services
	"Transener/Operaciones/LicenciasTrabajo/services/CompanyService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function(Controller, NavigationHelper, CompanyService, AppManagementHelper) {
	"use strict";
	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.Processing", {
		onInit: function() {
			var jsonModel = new sap.ui.model.json.JSONModel();
			var Companies = [];
			jsonModel.setData({
				Companies: Companies
			});
			this.getView().setModel(jsonModel, "ListedCompanies");
			this.loadCompaniesModel();
			//$("#RequestLicenseFooter").appendTo("#RequestLicenseGeneralGrid");//hack sapui5 doesn´t append it correctly
		},
		onSaveForm: function() {

		},
		deleteListLicense: function(oEvent) {
			var oControl = oEvent.getSource().getParent().getBindingContext("AnulableItemsJsonModel").getObject();
			var oLicenseModel = AppManagementHelper.getModel("AnulableItemsJsonModel");
			var aAnulableItems = oLicenseModel.getData().AnulableItems;
			var iIndex = aAnulableItems.indexOf(oControl);
			aAnulableItems.splice(iIndex, 1);
			oLicenseModel.refresh(true);
		},

		addCompanyInputs: function(companyName) {
			companyName = this.getView().getModel().getData().CompanyToAdd || "BS";
			var companiesModel = this.getView().getModel("ListedCompanies");
			companiesModel.getData().Companies.push({
				companyName: companyName
			});
			companiesModel.refresh();
		},
		loadCompaniesModel: function() {
			CompanyService.load(
				jQuery.proxy(this.onSuccessLoad("Companies"), this),
				jQuery.proxy(this.onErrorLoad("Companies"), this)
			);
		},
		onSuccessLoad: function(model) {
			return function(data) {
				var results = data.results;
				var oModel = new sap.ui.model.json.JSONModel();
				var object = {};
				object[model] = results;
				oModel.setData(object);
				this.getView().setModel(oModel, model);
			};
		},
		onErrorLoad: function(model) {
			return function(error) {
				sap.m.MessageToast.show("Error de comunicación");
			};
		}
	});
});