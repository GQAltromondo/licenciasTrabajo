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
					key: 0,
					text: "Seleccione uno",
					Equipos: [
						{
							key: 0,
							text: "Seleccione Estación"
						}
					]
				},
				{
					key: 1,
					text: "ATV",
					Equipos: [
						{
							key: 2,
							text: "2AU-TVA1"
						},
						{
							key: 3,
							text: "ATVL1"
						}
					]
				},
				{
					key: 1,
					text: "2AU",
					Equipos: [
						{
							key: 4,
							text: "2AU-ATVL"
						},
						{
							key: 1,
							text: "2ATVL2"
						}
					]
				}
				
			]});
			/*odataModel.read(setEntity, {		
				success: onSuccessCallback,
				error: onErrorCallback
			});*/
		}
	};
});