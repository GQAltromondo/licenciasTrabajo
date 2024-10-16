sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (oDataService, AppManagementHelper) {
	"use strict";
	
	return {

		getMailsARO: function(empresa){
			var aFilters = [];

			aFilters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, empresa));

			var entity = "/LicenciasMailAROSet";
			oDataService.getModel("TransenerOperaciones").read(entity, {
				filters: aFilters,
				success: function (data) {
					
					var oModel = AppManagementHelper.getModel("MailsAROModel");
					oModel.setData({
						Mails: data.results
					})
				},
				error: function (error) {
					console.log(error);
				}
			});
		}
	}
	
});