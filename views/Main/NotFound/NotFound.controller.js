/*creado por hector zea 04/04/2017*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function(Controller, AppManagementHelper) {
	"use strict";

	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.view.Main.NotFound.NotFound", {

		onAfterRendering: function() {

		},

		goToHome: function() {
			AppManagementHelper.getAppRouter().navTo("Licencias");
		}

	});

});