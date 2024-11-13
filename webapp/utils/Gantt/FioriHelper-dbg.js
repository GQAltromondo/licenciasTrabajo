sap.ui.define([
], function() {
	"use strict";

	return {

		getAppPath: function() {
			return jQuery.sap.getModulePath("Transener.Operaciones.LicenciasTrabajo") + "/";
		},

		loadSessionTimeoutReload: function() {
			var FioriHelper = this;
			//attaches lister for ajax resuests
			jQuery(document).ajaxComplete(function(e, jqXHR) {
				//checks response for timeout
				var sessionTimeout = FioriHelper._responseHasSessionTimeout(jqXHR);
				if (sessionTimeout) {
					FioriHelper.showSessionTimeoutMessageBox();
				}
			});
		},

		showSessionTimeoutMessageBox: function() {
			console.log("EXPIRED");
		},

		loadCorporateStyling: function() {
			var corporateStylePath = "styling/css/styles.css";
			//checks if app is running on SAPWeb IDE or deployed version
			var serverPath = "";
			if (window.location.hostname.indexOf("webidetesting") >= 0) {
				//SAP web ide
				serverPath = "/destinations/styling/";
			} else {
				//deployed version
				serverPath = "/sap/fiori/";
			}
			var path = serverPath + corporateStylePath;
			jQuery.sap.includeStyleSheet(path);
		},

		_responseHasSessionTimeout: function(jqXHR) {
			var contentType = jqXHR.getResponseHeader("Content-Type");
			var status = jqXHR.status;
			return ((status === 503) &&
				(contentType && contentType.indexOf("text/html") === 0));
		},

		_reloadPage: function() {
			window.location.reload();
		}

	};
});