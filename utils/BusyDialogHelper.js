sap.ui.define([
], function() {
	"use strict";

	return {

		_busyDialog: null,

		_getBusyDialog: function () {
			if (!this._busyDialog) {
				this._busyDialog = new sap.m.BusyDialog();
			}
			return this._busyDialog;
		},

		open: function(i18nTitle, i18nMessage) {
			var t = (i18nMessage) ? i18nTitle : "";
			var m = (i18nMessage) ? i18nMessage : "";
			var busyDialog = this._getBusyDialog();
			busyDialog.setTitle(t);
			busyDialog.setText(m);
			busyDialog.open();
		},

		close: function() {
			this._getBusyDialog().close();
		}
	};
});