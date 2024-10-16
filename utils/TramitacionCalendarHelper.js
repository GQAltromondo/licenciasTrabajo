sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/RolAuthorizationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatterHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/LicenseService",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
], function (AppManagementHelper, FormatHelper, RolAuthorizationHelper, MessageBoxHelper, FormatterHelper, LicenseService,
	BusyDialogHelper) {
	"use strict";
	return {
		_oDialog: null,
		_oModelPath: null,
		_bHasTraindex: null,
		getTramitacionCalendarView: function (oViewDependent, sModelPath, bHasTraindex) {
			this._bHasTraindex = bHasTraindex
			this._oModelPath = sModelPath
			var oDialog = new sap.m.Dialog({
				afterClose: (oEvent) => {
					var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
					oEvent.getSource().close();
					oEvent.getSource().destroy();
						if (this._bHasTraindex) {
				BusyDialogHelper.open()
				LicenseService.loadSpecialDatesTramitacion(license.Anio, license.Id, license.Empresa, license.Period);
			}
				},
				title: "Calendario Tramitación",
				contentWidth: "60%",
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.HBox({
								items: [
									new sap.m.VBox({
										items: [
											new sap.m.Label({
												text: "Fecha"
											}),
											new sap.m.DatePicker({
												enabled: {
													parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
														"DisableControlsJsonModel>/visibleLic",
														"PermisosJsonModel>/UsuarioEncontrado"
													],
													formatter: this.rolStatusEdition("tramitacion/")
												},
												dateValue: "{CalendarFormModel>/Fecha}",
												valueState: "{CalendarFormModel>/ValueStateFecha}",
												minDate: "{LicenseJsonModel>/Solbeg}",
												maxDate: "{LicenseJsonModel>/Solend}",
											}),
										]
									}),
									new sap.m.VBox({
										items: [
											new sap.m.Label({
												text: "Estado forma de entrega diaria"
											}),
											new sap.m.ComboBox({
												enabled: {
													parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/",
														"LicenseJsonModel>/Werks",
														"DisableControlsJsonModel>/visibleLic",
														"PermisosJsonModel>/UsuarioEncontrado"
													],
													formatter: this.rolStatusEdition("tramitacion/")
												},
												width: "230px",
												selectedKey: "{CalendarFormModel>/Estado}",
												valueState: "{CalendarFormModel>/ValueStateEstado}",
												items: [
													new sap.ui.core.Item({
														key: "NA",
														text: "No Autorizada",
													}),
													new sap.ui.core.Item({
														key: "CC",
														text: "Condicionada",
													}),
													new sap.ui.core.Item({
														key: "AS",
														text: "Anulada por el solicitante",
													})
												]
											})
										]
									}).addStyleClass("sapUiTinyMarginBeginEnd"),
									new sap.m.VBox({
										width: "51%",
										items: [
											new sap.m.Label({
												text: "Observación"
											}),
											new sap.m.TextArea({
												enabled: {
													parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
														"DisableControlsJsonModel>/visibleLic",
														"PermisosJsonModel>/UsuarioEncontrado"
													],
													formatter: this.rolStatusEdition("tramitacion/")
												},
												width: "100%",
												value: "{CalendarFormModel>/Observaciones}"
											})
										]
									}).addStyleClass("sapUiSmallMarginEnd"),
									new sap.m.VBox({
										items: [
											new sap.m.Label({
												text: ""
											}),
											new sap.m.Button({
												enabled: {
													parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
														"DisableControlsJsonModel>/visibleLic",
														"PermisosJsonModel>/UsuarioEncontrado"
													],
													formatter: this.rolStatusEdition("tramitacion/")
												},
												text: "Agregar",
												press: [this.addNewDate, this]
											}).addStyleClass("buttonInverted")
										]
									})
								]
							}),
							new sap.m.Table({
								inset: false,
								fixedLayout: false,
								enableBusyIndicator: true,
								noDataText: "No hay dias agregados...",
								columns: [
									new sap.m.Column({
										width: "10%",
										header: new sap.m.Text({
											text: "Fecha"
										})
									}),
									new sap.m.Column({
										width: "30%",
										header: new sap.m.Text({
											text: "Estado"
										})
									}),
									new sap.m.Column({
										width: "50%",
										header: new sap.m.Text({
											text: "Observación"
										})
									}),
									new sap.m.Column({
										width: "10%",
										header: new sap.m.Text({
											text: ""
										})
									}),
								],
								items: {
									sorter: new sap.ui.model.Sorter("Fecha", false, false),
									path: "TramitacionListJsonModel>" + this._oModelPath + "/CalendarDates",
									template: new sap.m.ColumnListItem({
										cells: [
											new sap.m.Text({
												text: {
													path: "TramitacionListJsonModel>Fecha",
													formatter: $.proxy(this.formatDate, this)
												}
											}),
											new sap.m.Text({
												text: {
													path: "TramitacionListJsonModel>Estado",
													formatter: $.proxy(this.formatStatus, this)
												}
											}),
											new sap.m.Text({
												text: "{TramitacionListJsonModel>Observaciones}"
											}),
											new sap.m.HBox({
												items: [
													new sap.m.Button({
														enabled: {
															parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																"DisableControlsJsonModel>/visibleLic",
																"PermisosJsonModel>/UsuarioEncontrado"
															],
															formatter: this.rolStatusEdition("tramitacion/")
														},
														icon: "sap-icon://delete",
														press: [this._deleteCalendarDate, this]
													}).addStyleClass("buttonInverted")
												]
											})
										]
									})
								}
							}).addStyleClass("sapUiTinyMarginTop")
						]
					}).addStyleClass("sapUiSmallMarginBeginEnd sapUiTinyMarginTop")
				],
				buttons: [
					new sap.m.Button({
						text: "Cerrar",
						press: [this.closeTramitacionCalendar, this]
					}).addStyleClass("buttonInverted")
				]
			});
			this._oDialog = oDialog;
			this.createFormModel();
			oViewDependent.addDependent(oDialog);
			return this._oDialog;
		},

		cleanFormModel: function () {
			this._oDialog.getModel("CalendarFormModel").setData({
				Fecha: null,
				Observacion: "",
				Estado: "",
				ValueStateFecha: "None",
				ValueStateEstado: "None",
			})
		},

		formatDate: function (date) {
			return FormatHelper.formatDateLicenseWithoutUtc(date);
		},
		formatStatus: function (estado) {
			return FormatHelper.getEstadoTramitacion(estado);
		},

		createFormModel: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				Fecha: null,
				Observaciones: "",
				Estado: "",
				ValueStateFecha: "None",
				ValueStateEstado: "None",
			})
			this._oDialog.setModel(oModel, "CalendarFormModel");
		},

		rolStatusEdition: function (controlPath, callback) {
			return RolAuthorizationHelper.rolStatusEdition(controlPath, callback);
		},

		payloadValid: function (oDatePayload) {
			if (oDatePayload.Fecha === null) {
				this._oDialog.getModel("CalendarFormModel").setProperty("/ValueStateFecha", "Error")
			} else {
				this._oDialog.getModel("CalendarFormModel").setProperty("/ValueStateFecha", "None")
			}

			if (oDatePayload.Estado === "") {
				this._oDialog.getModel("CalendarFormModel").setProperty("/ValueStateEstado", "Error")
			} else {
				this._oDialog.getModel("CalendarFormModel").setProperty("/ValueStateEstado", "None")
			}

			var oModelForm = this._oDialog.getModel("CalendarFormModel").getData();
			return oModelForm.ValueStateEstado === "None" && oModelForm.ValueStateFecha === "None";
		},

		addNewDate: function () {
			var oDatePayload = this._oDialog.getModel("CalendarFormModel").getData();
			if (this.payloadValid(oDatePayload)) {
				if (!this.dateHasBeenAdded(oDatePayload.Fecha)) {
					this.saveDate(oDatePayload);
					this.cleanFormModel();
				} else {
					//mostrar confirm.
					MessageBoxHelper.showConfirm("Alerta", "Esta fecha ya ha sido agregada, ¿desea reemplazarla?", () => {
						if (this._bHasTraindex) {
							this.saveDate(oDatePayload);
							this.cleanFormModel();
						} else {
							this.replaceDate(oDatePayload)
							this.cleanFormModel();
						}
					})
				}
			};
		},

		replaceDate: function (oDatePayload) {
			var oModelTramitacion = this._oDialog.getModel("TramitacionListJsonModel")
			var aDates = oModelTramitacion.getProperty(this._oModelPath + "/CalendarDates");
			var iIndex = _.findIndex(aDates, (e) => {
				return e.Fecha.getTime() === oDatePayload.Fecha.getTime()
			});
			aDates[iIndex] = oDatePayload;
			oModelTramitacion.refresh(true);
		},

		handleCalendarData: function (aCalendarDates) {
			aCalendarDates.forEach((e) => {
				delete e.Tramitaciones;
				delete e.__metadata;
				e.Fecha = FormatHelper.formatDatesGMT(e.Fecha)
			})
		},

		saveDate: function (oDatePayload) {
			var oModelTramitacion = this._oDialog.getModel("TramitacionListJsonModel")
			if (this._bHasTraindex) {
				var oPayloadTramitacion = oModelTramitacion.getProperty(this._oModelPath);
				LicenseService.getCalendarPostTramitacion(oPayloadTramitacion, oDatePayload, oDatePayload.Fecha).then(() => {
					LicenseService.getDatesFromTramitacion(oPayloadTramitacion).then((data) => {
						this.handleCalendarData(data.results);
						this._oDialog.getModel("TramitacionListJsonModel").setProperty(this._oModelPath + "/CalendarDates", data.results)
						this._oDialog.setBusy(false);
					})
				})
			} else {
				var aDates = oModelTramitacion.getProperty(this._oModelPath + "/CalendarDates");
				aDates.push(oDatePayload);
				oModelTramitacion.refresh(true);
			}

		},

		_deleteCalendarDate: function (oEvent) {
			var event = oEvent.getSource().getParent().getParent();
			var oControl = event.getBindingContext("TramitacionListJsonModel").getObject();
			MessageBoxHelper.showConfirm("Alerta", "¿Está seguro que desea eliminar esta fecha?", () => {
				if (oControl.Traindex) {
					this._oDialog.setBusy(true);
					var oPayload = oControl;
					var aDifferenceToDelete = [{
						Fecha: oPayload.Fecha
					}];
					LicenseService.removeDates(oPayload, aDifferenceToDelete).then((d) => {
						LicenseService.getDatesFromTramitacion(oPayload).then((data) => {
							this.handleCalendarData(data.results);
							this._oDialog.getModel("TramitacionListJsonModel").setProperty(this._oModelPath + "/CalendarDates", data.results)
							this._oDialog.setBusy(false);
						})
					}).catch(() => {
						MessageBoxHelper.showAlert("Alerta", "Error al borrar fecha");
						this._oDialog.setBusy(false);
					})
				} else {
					var oModel = this._oDialog.getModel("TramitacionListJsonModel")
					var aItems = oModel.getProperty(this._oModelPath + "/CalendarDates");
					var iIndex = aItems.indexOf(oControl);
					aItems.splice(iIndex, 1);
					oModel.refresh(true);
				}
			})
		},

		dateHasBeenAdded: function (dateFromPayload) {
			var oModelTramitacion = this._oDialog.getModel("TramitacionListJsonModel")
			var aDates = oModelTramitacion.getProperty(this._oModelPath + "/CalendarDates");
			//validar dps utc cuando get
			var oPayloadWithDateFound = aDates.find(e => e.Fecha.getTime() === dateFromPayload.getTime());
			if (oPayloadWithDateFound) {
				return true;
			} else {
				return false;
			}
		},

		closeTramitacionCalendar: function (oEvent) {

			var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
			//	LicenseService.FIND(license);
			this._oDialog.close();
			this._oDialog.destroy();
			//	BusyDialogHelper.open()
			if (this._bHasTraindex) {
				BusyDialogHelper.open()
				LicenseService.loadSpecialDatesTramitacion(license.Anio, license.Id, license.Empresa, license.Period);
			}
		}
	};
});