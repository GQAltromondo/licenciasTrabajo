/*creado por hector zea 04/04/2017*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/model/models",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/services/UserService"
], function (Controller, AppManagementHelper, FioriHelper, models, oDataService, UserService) {
	"use strict";

	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.App", {
		setApp: function (oApp) {
			AppManagementHelper.setApp(oApp);
			this.setApplicationModels();
		},

		onInit: function () {
			var cUrl = this.getBaseURL();
		},

		getBaseURL: function () {

			//debugger;

			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");

			var appModel = AppManagementHelper.getModel("appId")
			appModel.setData(appId)

			//var appId = this.getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			var appModulePath = jQuery.sap.getModulePath(appPath);

			var jsonModel = sap.ui.getCore().getModel("appCurrentInfo");
			//checks if the model exists
			if (!jsonModel) {
				jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setSizeLimit(9999);
				jsonModel.appUrl = appModulePath;
				sap.ui.getCore().setModel(jsonModel, "appCurrentInfo");
				//initilializing = appModulePath; 
				jsonModel.setData({});
			}
			return appModulePath;

		},
		setApplicationModels: function () {

			var sPath = FioriHelper.getAppPath();
			var permisosModel = AppManagementHelper.getModel("permisosModel");
			permisosModel.loadData(sPath + "conf/permisos.json", "", false);

			var statusPermisosModel = AppManagementHelper.getModel("statusModel");
			statusPermisosModel.loadData(sPath + "conf/permisosPorEstado.json", "", false);

			UserService.loadModel();

			AppManagementHelper.getModel("RapidSearchJsonModel").setData({
				searchCriteria: ""
			});

			AppManagementHelper.getModel("SelectedTipoLicenciaModel").setData({
				SelectedLic: ""
			});

			AppManagementHelper.getModel("FilterSelectionJsonModel").setData({
				checkedSol: false,
				checkedLic: true,
				id: "",
				visible: true,
				textFlow: "",
				textFlowSol: "",
				enabledCausa: false,
				finalCancelation: false,
				enabledEspecifyBarra: false,
				visibleFiles: false,
				enabledEquipos: false,
				enabledComboEQUIPO: false,
				weekChanger: true
			});
			AppManagementHelper.getApp().setModel(models.createFiltersModel(), "FiltersJsonModel");

			//limpiar
			AppManagementHelper.getModel("TramitacionListJsonModel").setData({
				Tramitaciones: []
			});

			AppManagementHelper.getModel("TramitacionMasivaListJsonModel").setData({
				Tramitaciones: []
			});

			AppManagementHelper.getModel("TransferListJsonModel").setData({
				Transfers: []
			});

			AppManagementHelper.getModel("CoordinationTableJsonModel").setData({
				Coordinations: []
			});

			AppManagementHelper.getModel("ObservationTableJsonModel").setData({
				Observations: []
			});

			AppManagementHelper.getModel("DeliveryTableJsonModel").setData({
				Deliveries: []
			});

			AppManagementHelper.getModel("DevolutionTableJsonModel").setData({
				Devolutions: []
			});

			AppManagementHelper.getModel("SuspensionTableJsonModel").setData({
				Suspensions: []
			});

			AppManagementHelper.getModel("ReanudationTableJsonModel").setData({
				Reanudations: []
			});

		}
	});

});