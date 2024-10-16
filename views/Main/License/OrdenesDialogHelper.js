sap.ui.define([
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	//services
	//model
], function (FioriComponentHelper) {
	"use strict";

	return {
		_dialog: null,

		openDialog: function (initialValue, view) {
			//gets dialog
			var dialog = this.getDialog(view);
			//opens dialog
			dialog.open();
			//sets initial value
			this.setInitialValue(initialValue);
		},

		//singleton de dialog
		getDialog: function (view) {
			//gets view
			var dialog = this._dialog;
			if (!dialog) {
				//crea dialog
				this._searchControl = new sap.m.SearchField({
					placeholder: "{i18n>Search}",
					//liveChange: [this.onMasterPOSearchLiveChange, this],
					search: [this.onMasterSearchLiveChange, this],
					width: "100%"
				});
				dialog = new sap.m.Dialog({
					title: "{i18n>LoadInvoice}",
					showHeader: true,
					stretch: true,
					afterClose: [this.afterCloseDialog, this],
					beginButton: new sap.m.Button({
						icon: "sap-icon://sys-cancel",
						text: "{i18n>Close}",
						press: [this.closeDialog, this]
					}),
					subHeader: new sap.m.Bar({
						contentMiddle: [
							this._searchControl
						]
					}),
					content: [
						//desktop
						new sap.m.Table({
							fixedLayout: false,
							noDataText: "{i18n>NoPOAvailable}",
							busy: "{ListItems>/Busy}",
							busyIndicatorDelay: 0,
							columns: [
								new sap.m.Column({
									header: new sap.m.Text({
										text: "{i18n>Order}"
									})
								}),
								new sap.m.Column({
									header: new sap.m.Text({
										text: "{i18n>Description}"
									})
								})
							],
							items: {
								path: "ListItems>/Items",
								template: new sap.m.ColumnListItem({
									type: sap.m.ListType.Navigation,
									press: [this.onListItemPress, this],
									cells: [
										new sap.m.Text({
											text: "{ListItems>DocumentNumber}"
										}),
										new sap.m.Text({
											text: "{ListItems>CompanyName}"
										})
									]
								})
							}
						}).addStyleClass("customTable")
					]
				});
				//embeds dialog inside view
				view.addDependent(dialog);
			}
			this._dialog = dialog;
			return dialog;
		},

		//sets initial value for search
		setInitialValue: function (initialValue) {
			if (initialValue) {
				var searchControl = this._searchControl;
				searchControl.setValue(initialValue);
				searchControl.fireLiveChange({
					newValue: initialValue
				});
			}
		},

		onMasterSearchLiveChange: function (oEvent) {
			//gets search terms
			var searchParameter = oEvent.getParameter("query");
			//searches Purchase
			//var loadInvoiceModel = LoadInvoiceModel.getModel();
			//var vendorAccount = loadInvoiceModel.getProperty("/VendorAccount");
			//PurchaseOrdersService.loadModel(searchParameter, vendorAccount);
		},

		onListItemPress: function (oEvent) {
			//gets selected master company
			var context = oEvent.getSource().getBindingContext("ListElements");
			var obj = context.getObject();
			this.updateSelected(obj);
			//closes dialog
			this.closeDialog();
		},

		updateSelected: function (selected) {
			//updates selected company model

			/*var loadInvoiceModel = LoadInvoiceModel.getModel();
			loadInvoiceModel.setProperty("/PurchaseOrder", selected.DocumentNumber);
			loadInvoiceModel.setProperty("/CompanyCode", selected.CompanyCode);
			loadInvoiceModel.setProperty("/CompanyName", selected.CompanyName);
			loadInvoiceModel.setProperty("/CurrencyKey", selected.CurrencyKey);
			loadInvoiceModel.setProperty("/TotalValue", selected.TotalValue);*/

		},

		closeDialog: function () {
			//closes dialog
			this.getDialog().close();
		},

		afterCloseDialog: function () {
			//destroys dialog
			this.getDialog().destroy();
		}
	};
});