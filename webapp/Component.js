/*global SignaturePad:true*/
/*global _:true*/
sap.ui.define([
	"sap/ui/core/UIComponent",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/DeviceModelHelper", //TODO
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/components/isComboBox",
	"Transener/Operaciones/LicenciasTrabajo/plugins/lodash",
	"Transener/Operaciones/LicenciasTrabajo/scripts/SignaturePad"
], function (UIComponent, DeviceModelHelper, FioriHelper, FioriComponentHelper, AppManagementHelper, isComboBox, lodash, SignaturePad) {
	"use strict";
	return UIComponent.extend("Transener.Operaciones.LicenciasTrabajo.Component", {

		metadata: {
			manifest: "json",
			includes: ["less/less.min.js", "libs/docx.js"]
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			const version = this.getManifestEntry("sap.app").applicationVersion.version;
		
			const versionModel = new sap.ui.model.json.JSONModel({
				version: version
			  });
			  this.setModel(versionModel, "appVersion");
		},
		getAppVersion: function () {
			return this.version || "v?";
		  },
		createContent: function () {
			//sets component
			FioriComponentHelper.setComponent(this);
			// create root view
			var view = sap.ui.view({
				id: this.createId("App"),
				viewName: "Transener.Operaciones.LicenciasTrabajo.views.App",
				type: "JS",
				viewData: {
					component: this
				}
			});

			this.getRouter().initialize();

			//loads device model
			DeviceModelHelper.loadModel();
			//styling
			FioriHelper.loadCorporateStyling();
			//timeout
			FioriHelper.loadSessionTimeoutReload();

			return view;
		}
	});
});