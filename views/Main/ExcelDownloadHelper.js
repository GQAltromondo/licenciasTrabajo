sap.ui.define([
	//ui
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/ValidateHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/i18nTranslationHelper",
	//model
	//services
	"Transener/Operaciones/LicenciasTrabajo/services/UserDataService"
], function(Export, ExportTypeCSV, NavigationHelper, BusyDialogHelper, FormatHelper, FioriHelper, FioriComponentHelper, ValidateHelper, MessageBoxHelper, i18nTranslationHelper,
UserDataService) {
	"use strict";
	
	return {
		
		download: function(data) {
			//busy
			BusyDialogHelper.open("Loading", "DownloadingExcelFile");
			//empties model
			var model = this._getModel();
			model.setProperty("/Busy", true);
			model.setProperty("/AuditoriaExcel", data);
			this.downloadFile();
			model.setProperty("/Busy", false);
			BusyDialogHelper.close();
		},
		
		_getModel: function() {
			//gets model
			var component = FioriComponentHelper.getComponent();
			var jsonModel = component.byId("App").getModel("AuditoriaExcel");
			//checks if the model exists
			if (!jsonModel) {
				jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setSizeLimit(9999);
				component.byId("App").setModel(jsonModel, "AuditoriaExcel");
				//initilializing
				jsonModel.setData({
					Busy: false,
					PurchaseOrderExcel: []
				});
			}
			return jsonModel;
		},
		
		downloadFile: function(){
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					separatorChar: ";"
				}),
				models: this._getModel(),
				rows: {
					path: "/AuditoriaExcel"
				},

				columns: [{
					name: i18nTranslationHelper.getTranslation("Legajo"),
					template: {
						content: "{Legajo}"
					}
				},{
					name: i18nTranslationHelper.getTranslation("Nombre"),
					template: {
						content: "{Nombre}"
					}
				},{
					name: i18nTranslationHelper.getTranslation("Apellido"),
					template: {
						content: "{Apellido}"
					}
				},{
					name: i18nTranslationHelper.getTranslation("TipoHabilitacion"),
					template: {
						content: "{Tipohab}"
					}
				},{
					name: i18nTranslationHelper.getTranslation("ClaseHabilitacion"),
					template: {
						content: "{Clasehab}"
					}
				},{
					name: i18nTranslationHelper.getTranslation("Estado"),
					template: {
						content: "{Estado}"
					}
				},{
					name: i18nTranslationHelper.getTranslation("ValidityDate"),
					template: {
						content: {
							path: "Vigencia",
							formatter: function(fecha) {
								if(!fecha) {
									return "";
								}
								var dd = fecha.getDate();
								var mm = fecha.getMonth()+1; //January is 0!
								
								var yyyy = fecha.getFullYear();
								if(dd<10){
								    dd="0"+dd;
								} 
								if(mm<10){
								    mm="0"+mm;
								} 
								return dd+"/"+mm+"/"+yyyy;
							}
						}
					}
				}]
			});
			oExport.saveFile(i18nTranslationHelper.getTranslation("PurchaseOrders")).catch(function(oError) {
				MessageBoxHelper.showAlertValidate("Error", "ErrorExportingData");
			}).then(function() {
				oExport.destroy();
			});
		}
		
	};
});