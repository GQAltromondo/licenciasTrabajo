sap.ui.define([
	//ui
	"sap/ui/core/mvc/Controller",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	//services
	"Transener/Operaciones/LicenciasTrabajo/services/LicenseService",
	"Transener/Operaciones/LicenciasTrabajo/utils/TramitacionMasivaCalendarHelper",
], function(Controller, NavigationHelper, AppManagementHelper, FormatHelper, LicenseService, TramitacionMasivaCalendarHelper) {
	"use strict";
	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.MassiveTramitation", {
		onAfterRendering: function() {
			var dialog = this.getView().getParent();
		},
		
		onAddTramitacion: function () {
			var oTramitacionModel = AppManagementHelper.getModel("TramitacionMasivaListJsonModel");
			var aTramitaciones = oTramitacionModel.getData().Tramitaciones;
			var empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			var oObject = {
				Id: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id"),
				Anio: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio"),
				Empresa: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Empresa"),
				EmpTramita: "",
				Traindex: "",
				Estado: "",
				CausaNo: "",
				Avisotecet: "",
				Avisoprog: AppManagementHelper.getStringUserLegacy(),
				Trascot: "X",
				MotivoNo: "",
				Enabled: false,
				CalendarDates: []
				/*
				CalendarDates: {
					EstadoEntrega: "",
					Observacion: "",
					FechasSeleccionadas: [],
				}
				*/
			};
			aTramitaciones.push(oObject);
			oTramitacionModel.refresh(true);
		},
		
		enableCausaNO: function (oEvent) {
			var oTramitacionModel = AppManagementHelper.getModel("TramitacionMasivaListJsonModel");
			var sPath = oEvent.getSource().getParent().getBindingContext("TramitacionMasivaListJsonModel").getPath();
			var sKey = oEvent.getSource().getSelectedKey();
			
			// si es rechazada
			if (sKey === "02") {
				oTramitacionModel.setProperty(sPath + "/Enabled", true);
			} else {
				oTramitacionModel.setProperty(sPath + "/Enabled", false);
				oTramitacionModel.setProperty(sPath + "/CausaNo", "");
				oTramitacionModel.setProperty(sPath + "/MotivoNo", '');
			}

		},
		
		onDeleteFromTable: function (oEvent) {
			var event = oEvent.getSource();
			var oControl = event.getParent().getBindingContext("TramitacionMasivaListJsonModel").getObject();
			var oModel = AppManagementHelper.getModel("TramitacionMasivaListJsonModel");
			
			var aItems = oModel.getData().Tramitaciones;
			var iIndex = aItems.indexOf(oControl);
			aItems.splice(iIndex, 1);
			oModel.refresh(true);
		},
		
		saveDates: function () {
			var aDates = this.aDates
			if (this._bEditionCalendar) {
				BusyDialogHelper.open();
				var aDifferenceToDelete = _.differenceBy(this.oCalendarPayload.FechasSeleccionadas, aDates, (o) => {
					return o.Fecha.getTime();
				})
				LicenseService.removeDates(this.oCalendarPayload, aDifferenceToDelete).then((d) => {
					BusyDialogHelper.close();
				}).catch(() => {
					BusyDialogHelper.close();
				})
			}

			this.calendarTramitacionDialog.close();
			this.calendarTramitacionDialog.destroy(true);
			this.getView().getModel("TramitacionMasivaListJsonModel").setProperty(this._actualPathCalendar, this.aDates);
		},
		
		onSelectDate: function (oEvent) {
			var aDatesLocal = oEvent.getSource().getSelectedDates();
			var aEmpty = [];
			for (var oDate of aDatesLocal) {
				aEmpty.push({
					Fecha: oDate.getProperty("startDate")
				})
			}
			this.aDates = aEmpty;
		},
		
		getDatesFiltered: function (aResults) {
			var aMappedDates = aResults.map((oFecha) => {
				return {
					Fecha: FormatHelper.formatDatesGMT(oFecha.Fecha)
				}
			})
			return aMappedDates;
		},
		
		openTramitacionCalendarDialog: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext("TramitacionMasivaListJsonModel")
			var sPath = oContext.getPath();
			var oTramitacion = oContext.getObject();
			var bHasTraindex = oTramitacion.Traindex !== ""
			if (bHasTraindex) {
				BusyDialogHelper.open();
				LicenseService.getDatesFromTramitacion(oTramitacion).then((data) => {
					TramitacionMasivaCalendarHelper.handleCalendarData(data.results); 
					this.getView().getModel("TramitacionMasivaListJsonModel").setProperty(sPath + "/CalendarDates", data.results)
					BusyDialogHelper.close();
				}).catch(() => {
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al obtener las fechas");
				})
			}

			var oViewDependent = this.getView();
			var oCalendarTramitacionDialog = TramitacionMasivaCalendarHelper.getTramitacionCalendarView(oViewDependent, sPath, bHasTraindex);
			oCalendarTramitacionDialog.open();
			
			
			/*
			var oContext = oEvent.getSource().getBindingContext("TramitacionMasivaListJsonModel")
			var sPath = oContext.getPath();
			this._actualPathCalendar = sPath + "/CalendarDates/FechasSeleccionadas";
			var oTramitacion = oContext.getObject();
			var that = this;
			this.calendarTramitacionDialog = new sap.m.Dialog({
				title: "Calendario",
				content: [
					new sap.m.HBox({
						items: [
							new sap.m.Label({
								width: "200px",
								text: "Estado forma de entrega diaria: "
							}).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop"),
							new sap.m.ComboBox({
								width: "230px",
								selectedKey: "{TramitacionMasivaListJsonModel>" + sPath + "/CalendarDates/EstadoEntrega}",
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
					new sap.m.HBox({
						items: [
							new sap.m.Label({
								width: "200px",
								text: "Observación: "
							}).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop"),
							new sap.m.TextArea({
								width: "500px",
								value: "{TramitacionMasivaListJsonModel>" + sPath + "/CalendarDates/Observacion}",
							})
						]
					}).addStyleClass("sapUiTinyMarginBeginEnd sapUiTinyMarginBottom sapUiSmallMarginTop"),
					new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Start,
						justifyContent: sap.m.FlexJustifyContent.Center,
						items: [
							new sap.ui.unified.Calendar({
								selectedDates: {
									path: "TramitacionMasivaListJsonModel>" + sPath + "/CalendarDates/FechasSeleccionadas",
									template: new sap.ui.unified.DateRange({
										startDate: "{TramitacionMasivaListJsonModel>Fecha}"
									})
								},
								width: "43rem",
								singleSelection: false,
								select: [this.onSelectDate, this],
								text: "Observación: ",
								minDate: "{LicenseJsonModel>/Solbeg}",
								maxDate: "{LicenseJsonModel>/Solend}",
							}).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop"),
						]
					}).addStyleClass("sapUiTinyMarginBeginEnd sapUiTinyMarginBottom sapUiSmallMarginTop")
				],
				buttons: [
					new sap.m.Button({
						text: "Guardar",
						press: [this.saveDates, this]
					}).addStyleClass("buttonInverted"),
					new sap.m.Button({
						text: "Cancelar",
						press: function () {
							that.calendarTramitacionDialog.close();
							that.calendarTramitacionDialog.destroy(true);
						}
					}).addStyleClass("buttonInverted")
				]
			})
			this.getView().addDependent(this.calendarTramitacionDialog);
			if (oTramitacion.Traindex !== "") {
				BusyDialogHelper.open();
				LicenseService.getDatesFromTramitacion(oTramitacion).then((data) => {
					this._bEditionCalendar = true;
					var oPayload = {
						Id: data.results[0] ? data.results[0].Id : "",
						Traindex: data.results[0] ? data.results[0].Traindex : "",
						Empresa: data.results[0] ? data.results[0].Empresa : "",
						EstadoEntrega: data.results[0] ? data.results[0].Estado : "",
						Observacion: data.results[0] ? data.results[0].Observaciones : "",
						FechasSeleccionadas: this.getDatesFiltered(data.results),
					}
					this.oCalendarPayload = oPayload;
					this.getView().getModel("TramitacionMasivaListJsonModel").setProperty(sPath + "/CalendarDates", oPayload)
					BusyDialogHelper.close()
					this.calendarTramitacionDialog.open();
				}).catch((e) => {
					BusyDialogHelper.close()
				})
			} else {
				this._bEditionCalendar = false;
				this.calendarTramitacionDialog.open();
			}
			
			*/

		},
		
	});
});