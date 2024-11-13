sap.ui.define([
	//libs
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/i18nTranslationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper"
], function (MessageToast, MessageBox, i18nTranslationHelper, FioriComponentHelper) {
	"use strict";

	return {

		showMessageToast: function (i18nMessage) {
			var m = i18nTranslationHelper.getTranslation(i18nMessage);
			sap.m.MessageToast.show(m);
		},

		showAlert: function (i18nTitle, i18nMessage, fnOk) {
			var m = i18nTranslationHelper.getTranslation(i18nMessage);
			var dialogAlert = new sap.m.Dialog({
				type: sap.m.DialogType.Message,
				title: i18nTranslationHelper.getTranslation(i18nTitle),
				content: [
					new sap.m.Text({
						text: m
					}),
					new sap.m.FlexBox({
						justifyContent: sap.m.FlexJustifyContent.End,
						items: [
							new sap.m.Button({
								icon: "sap-icon://accept",
								press: function () {
									dialogAlert.close();
									dialogAlert.destroy();
									if (fnOk) {
										fnOk();
									}
								}
							})
						]
					})
				]
			}).addStyleClass("dialogCustom");
			dialogAlert.open();
		},

		showAlertValidate: function (i18nTitle, i18nMessages, fnOk) {

			var m = "";

			for (var message in i18nMessages) {
				for (var property in i18nMessages[message]) {
					m = m.concat(i18nTranslationHelper.getTranslation(property + i18nMessages[message][property]) + ".\n");
				}
			}

			var dialogAlert = new sap.m.Dialog({
				type: sap.m.DialogType.Message,
				title: i18nTranslationHelper.getTranslation(i18nTitle),
				content: [
					new sap.m.Text({
						text: m
					}),
					new sap.m.FlexBox({
						justifyContent: sap.m.FlexJustifyContent.End,
						items: [
							new sap.m.Button({
								icon: "sap-icon://accept",
								press: function () {
									dialogAlert.close();
									dialogAlert.destroy();
									if (fnOk) {
										fnOk();
									}
								}
							})
						]
					})
				]
			}).addStyleClass("dialogCustom");
			dialogAlert.open();
		},

		showConfirm: function (i18nTitle, i18nMessage, fnOk, fnNoOk) {
			var m = i18nTranslationHelper.getTranslation(i18nMessage);
			var dialogConfirm = new sap.m.Dialog({
				title: i18nTranslationHelper.getTranslation(i18nTitle),
				type: sap.m.DialogType.Message,
				buttons: [
					new sap.m.Button({
						icon: "sap-icon://accept",
						press: function () {
							dialogConfirm.close();
							dialogConfirm.destroy();
							if (fnOk) {
								fnOk();
							}
						}
					}),
					new sap.m.Button({
						icon: "sap-icon://decline",
						press: function () {
							dialogConfirm.close();
							dialogConfirm.destroy();
							if (fnNoOk) {
								fnNoOk();
							}
						}
					})
				],
				content: [
					new sap.m.Text({
						text: m
					})
				]
			}).addStyleClass("dialogCustom");
			dialogConfirm.open();
		},

		showCustomDialog: function (title, content, fnCallback) {
			var dialog = new sap.m.Dialog({
				type: sap.m.DialogType.Message,
				title: "{i18n>" + title + "}",
				content: content
			}).addStyleClass("dialogCustom");
			//gets component
			var component = FioriComponentHelper.getComponent();
			var i18nModel = component.byId("App").getModel("i18n");

			var buttonClose = new sap.m.Button({
				icon: "sap-icon://decline",
				press: function () {
					dialog.close();
					fnCallback();
				},
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.addButton(buttonClose);

			dialog.setModel(i18nModel, "i18n");
			dialog.open();
		},

		getValidationDialog: function () {
			var dialog = new sap.m.Dialog({
				contentWidth: "25%",
				afterClose: (oEvent) => {
					oEvent.getSource().close();
					oEvent.getSource().destroy(true);
				},
				title: "Alerta",
				content: [
					new sap.m.Text({
						text: "{RequiredFieldsModel>/initialText}"
					}).addStyleClass("sapUiSmallMarginBeginEnd sapUiTinyMarginTopBottom"),
					new sap.m.VBox({
						items: {
							path: "RequiredFieldsModel>/fields",
							template: new sap.m.Text({
								text: "{RequiredFieldsModel>value}"
							}).addStyleClass("sapUiTinyMarginTopBottom sapUiSmallMarginBeginEnd")
						}
					})
				],
				buttons: [
					new sap.m.Button({
						text: "Cerrar",
						press: (oEvent) => {
							oEvent.getSource().getParent().close()
							oEvent.getSource().getParent().destroy(true)
						}
					}).addStyleClass("buttonInverted")
				]
			})
			return dialog;
		},

		showMessage: function (sMensaje) {
			// Usar el MessageBox de SAPUI5 para mostrar un mensaje informativo
			MessageBox.show(sMensaje, {
				icon: MessageBox.Icon.INFORMATION, // Icono de información
				title: "Información", // Título de la ventana emergente
				actions: [MessageBox.Action.CLOSE], // Botón para cerrar el mensaje
				onClose: function (oAction) {
					// Función callback si se necesita realizar una acción adicional al cerrar
					if (oAction === MessageBox.Action.CLOSE) {
						// Acción a realizar al cerrar
						console.log("Mensaje cerrado");
					}
				},
				styleClass: "", // Clase CSS personalizada si se requiere
				contentWidth: "auto", // Ancho adaptable al contenido del mensaje
				horizontalScrolling: false, // Deshabilitar scroll horizontal
				verticalScrolling: true // Habilitar scroll vertical
			});
		}

	};
});