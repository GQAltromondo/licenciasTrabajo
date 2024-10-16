sap.ui.define([
	//ui
	"sap/ui/core/mvc/Controller",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	//services
	"Transener/Operaciones/LicenciasTrabajo/services/ObservationReasonsService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function(Controller, NavigationHelper, ObservationReasonsService, AppManagementHelper) {
	"use strict";
	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.Observation", {
		onInit: function() {
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData({});
			this.loadReasonsModel();
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
		loadReasonsModel: function() {
			ObservationReasonsService.load(
				jQuery.proxy(this.onSuccessLoad("ObservationReasons"), this),
				jQuery.proxy(this.onErrorLoad("ObservationReasons"), this)
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