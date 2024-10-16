// DESARROLLADO POR  ING HECTOR ZEA 
sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper"
], function (oDataService, MessageBoxHelper, FormatHelper, AppManagementHelper, BusyDialogHelper, FioriHelper) {
	"use strict";
	return {
		_servicePathPrefix: "/services/userapi",
		_servicePath: "/attributes",

		getUser: function () {
			var self = this;
			var path = this._servicePathPrefix + this._servicePath + "?multiValuesAsArrays=true";
			jQuery.ajax(path, {
				method: "GET",
				success: jQuery.proxy(self.onReadUserApiSuccess, self),
				error: jQuery.proxy(self.onReadUserApiError, self)
			});
		},
		//SE RESOLVIO NO VA NADA
		getRoles: function (groupData) {
			var aData = [];
			if (groupData.constructor === Array) {
				aData = aData.concat(groupData);
			} else {
				if (groupData !== "") {
					aData.push(groupData);
				}
			}
			return aData;
		},

		onReadUserApiSuccess: function (data, textStatus, jqXHR) {
			AppManagementHelper.getModel("UserJsonModel").setData({
				nombre: data.firstName,
				apellido: data.lastName,
				login_name: data.login_name,
				email: data.email,
				// roles: ["Supervisor_MantenimienTto"],

				// Paso 1 para creacion de licencias.
				// roles: ["Solicitante_Lic", "Solicitante_Lic_S"],
                // (Nuevo rol Solicitante_Lic_TBA Issue #518).
                // roles: ["Solicitante_Lic_TBA"],

				// Paso 2 Coordinador.
				// roles: ["Coordinador_Mantenimiento"],
				// roles: ["Coordinador_Mantenimiento"],

				// Paso 3 Tramitado -> tramita u observa.
			    //roles: ["Tramitador"],

				// Paso 4 Entraga, devolución y cancelación definitiva.
				// roles: ["Jefe_Turno_COT"],
				// roles: ["Programacion_COTDT"],
				// roles: ["Operador_COT"],

                // IMPORTANTE: deployear siempre con este descomentado.
                // ##########################################################################
                // ############################## IMPORTANTE ################################
                // ##########################################################################
                roles: this.getRoles(data.groups)
                // ##########################################################################
                // ##########################################################################
            });
		},

		onReadUserApiError: function (jqXHR, textStatus, error) {
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
			} else if (contentType.indexOf("application/json") >= 0) {
				//JSON
				try {
					var oError = JSON.parse(errorText);
					errorText = oError.error.message.value;
				} catch (ex) {
					//error in parsing
					errorText = error.response.body;
				}
			}
		}
	};
});