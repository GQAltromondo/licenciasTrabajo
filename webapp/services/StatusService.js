sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatterHelper"
], function (FormatterHelper) {
	"use strict";
	//var setEntity = "/TeamsSet";
	return {

		get: function () {
			//var odataModel = oDataServices.getModel();
			let keys = [{
				key: "30",
			}, {
				key: "01",
			}, {
				key: "02",
			}, {
				key: "03",
			}, {
				key: "06",
			}, {
				key: "07",
			}, {
				key: "09",
			}, {
				key: "10",
			}, {
				key: "11",
			}, {
				key: "23",
			}, {
				key: "90"
			}];

			return keys.map(x => {
				x.text = FormatterHelper.getStatusName(x.key);
				return x;
			});

			/*odataModel.read(setEntity, {		
				success: onSuccessCallback,
				error: onErrorCallback
			});*/
		}
	};
});