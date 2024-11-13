sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService"
], function(oDataServices) {
	"use strict";
	//var setEntity = "/TeamsSet";
	return {

		load : function(onSuccessCallback, onErrorCallback) {			
			//var odataModel = oDataServices.getModel();
			onSuccessCallback({results: [
				{
					key: 1,
					text: "Diaria"
				},
				{
					key: 2,
					text: "Continua"
				}
			]});
			/*odataModel.read(setEntity, {		
				success: onSuccessCallback,
				error: onErrorCallback
			});*/
		}
	};
});