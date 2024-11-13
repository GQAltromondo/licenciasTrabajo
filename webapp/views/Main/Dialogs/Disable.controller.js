sap.ui.define([
	//ui
	"sap/ui/core/mvc/Controller",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	//services
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function(Controller, NavigationHelper, AppManagementHelper) {
	"use strict";
	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.Disable", {
		deleteListLicense: function(oEvent) {
			var oControl = oEvent.getSource().getParent().getBindingContext("AnulableItemsJsonModel").getObject();
			var oLicenseModel = AppManagementHelper.getModel("AnulableItemsJsonModel");
			var aAnulableItems = oLicenseModel.getData().AnulableItems;
			var iIndex = aAnulableItems.indexOf(oControl);
			aAnulableItems.splice(iIndex, 1);
			oLicenseModel.refresh(true);
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