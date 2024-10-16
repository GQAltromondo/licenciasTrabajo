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
					text: "Preventivo Semanal y Diario"
				},
				{
					key: 2,
					text: "Preventivo Semanal"
				},
				{
					key: 3,
					text: "Preventivo Diario"
				},
				{
					key: 4,
					text: "Preventivo Mensual"
				}
			]});
			/*odataModel.read(setEntity, {		
				success: onSuccessCallback,
				error: onErrorCallback
			});*/
		}
	};
});