sap.ui.define([
	//ui
	"sap/ui/core/mvc/Controller",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	//services
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function(Controller, NavigationHelper, AppManagementHelper) {
	"use strict";
	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.advancedFilters", {

		handleBlock: function(oEvent) {
			(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Bloqueo/value", "X"):
				AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Bloqueo/value", "");
		},

		handleShoot: function(oEvent) {
			(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Rdisparo/value", "X"):
				AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Rdisparo/value", "");
		},

		handleARO: function(oEvent) {
			(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Aro/value", "X"):
				AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Aro/value", "N");
		}

	});
});