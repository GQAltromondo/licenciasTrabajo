sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/i18nTranslationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper"
], function(FioriHelper, FioriComponentHelper, FormatHelper, i18nTranslationHelper, MessageBoxHelper) {
	"use strict";

	return {
		
		_servicePathPrefix: "/services/userapi",
		_servicePath: "/attributes",
		
		getModel: function() {
			//gets component
	    	var component = FioriComponentHelper.getComponent();
			//gets model
			var jsonModel = component.byId("App").getModel("UserData");
			//checks if the model exists
			if (!jsonModel) {
				jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setSizeLimit(9999);
				component.byId("App").setModel(jsonModel, "UserData");
				//initilializing
				jsonModel.setData({});
			}
			return jsonModel;
		},
		
		loadModel: function() {
			var UserDataService = this;
			//reads user api
			var path = this._servicePathPrefix + this._servicePath;
			jQuery.ajax(path, {
				method: "GET",
				success: jQuery.proxy(UserDataService.onReadUserApiSuccess, UserDataService),
				error: jQuery.proxy(UserDataService.onReadUserApiError, UserDataService)
			});
		},
		
		onReadUserApiSuccess: function(data, textStatus, jqXHR) {
			//creates model
			var jsonModel = this.getModel();
			var data = { 
				TaxNumbers: data.tax_numbers
			};
			//sets data
			jsonModel.setData(data);
		},
				
		onReadUserApiError: function(jqXHR, textStatus, error) {
			
			//verifies if session is still active
			var sessionTimeoutResponseCode = 503;
			if (error.response.statusCode === sessionTimeoutResponseCode) {
				//session timeout
				FioriHelper.showSessionTimeoutMessageBox();
				return;
			}

			//gets error
			var errorText = error.response.body;
			//parses error
			var contentType = error.response.headers["Content-Type"];
			if (contentType.indexOf("text/html") >= 0) {
				//HTML
				errorText = $(error.response.body).text();
			}
			else if (contentType.indexOf("application/json") >= 0) {
				//JSON
				try {
					var oError = JSON.parse(errorText);
					errorText = oError.error.message.value;
				} catch (ex) {
					//error in parsing
					errorText = error.response.body;
				}
			}
			
			//error message
			errorText = i18nTranslationHelper.getTranslation("ErrorLoadingAssignedTaxNumbers") + ". \n\n" + errorText;
			MessageBoxHelper.showAlert("Error", errorText);
		}

	};
});