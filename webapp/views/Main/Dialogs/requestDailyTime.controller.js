sap.ui.define([
	//ui
	"sap/ui/core/mvc/Controller",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/LicenseService",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/RolAuthorizationHelper",

], function (Controller, FioriComponentHelper, NavigationHelper, FormatHelper, LicenseService, BusyDialogHelper, AppManagementHelper,
	MessageBoxHelper, RolAuthorizationHelper) {
	"use strict";
	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.requestDailyTime", {
		onAddDate: function () {
			var bEdition = AppManagementHelper.getModel("DisableNoAuthModel").getProperty("/isEdition");
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var object = this.getView().getModel("newDay").getData();
			if (!object.date || !object.timeFrom || !object.timeTo) {
				return;
			}





			if (object.isEdit) {
				this.onAcceptEdit(object);
				return;
			}
			var horarios = AppManagementHelper.getModel("LicenseJsonModel").getData().HorariosPorLicencia_nav;
			//TODO hacer lo de poner los dias bien y cambiarlos cuando se editan, tambien hay que ver que pasa cuando es nueva y et
			//marcar los nuevos de alguna forma?
			for (var i = horarios.length; i--;) {
				var dia = horarios[i];
				if (dia.Fecha.getTime() == object.date.getTime()) {
					if (bEdition) {
						var oDay = {
							Tipo: oLicense.Tipo,
							Empresa: oLicense.Empresa,
							Anio: oLicense.Anio,
							Id: oLicense.Id,
							Modif: dia.Modif,
							Fecha: object.date,
							Horainicio: FormatHelper.getTimeStringSAPFormat(object.timeFrom),
							Horafin: FormatHelper.getTimeStringSAPFormat(object.timeTo)
						}
						LicenseService.putDayHorarios(oDay).then(() => {
							MessageBoxHelper.showAlert("Alerta", "Se ha realizado el proceso de manera exitosa", () => {
								LicenseService.FIND(oLicense)
							})
						}).catch(() => { })
						return;
					} else {
						dia.Horainicio = object.timeFrom;
						dia.Horafin = object.timeTo;
						AppManagementHelper.getModel("LicenseJsonModel").refresh();
						this.getView().getModel("newDay").setData({});
						return;
					}
				}
			}

			var minDate = _.minBy(horarios, 'Fecha');
			var maxDate = _.maxBy(horarios, 'Fecha');

			if (minDate.Fecha > object.date || maxDate.Fecha < object.date) {

				MessageBoxHelper.showAlert("Alerta", "Solo podra modificar los horarios ya asignados, si quieren agregar mas dias, debera hacerlo desde la pantalla de licencia.")
				return;
			}



			if (bEdition) {
				if (object.date.getTime() > maxDate.Fecha.getTime()) {
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solbeg", minDate.Fecha);
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timbeg", new Date(minDate.Horainicio));

					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solend", object.date);
					//AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timend", object.timeFrom)
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timend", object.timeTo)

					var aDeepInsert = [];
					var aDaysExtended = $.extend([], AppManagementHelper.getModel("LicenseJsonModel").getData().HorariosPorLicencia_nav);
					var aDays = this.regenerateDays();

					var aNewDays = _.xorBy(aDays, aDaysExtended, (e) => {
						return e.Fecha.getTime()
					});

					aNewDays.forEach((oDay) => {
						var oDay = {
							Tipo: oLicense.Tipo,
							Empresa: oLicense.Empresa,
							Anio: oLicense.Anio,
							Id: oLicense.Id,
							Modif: "",
							Fecha: oDay.Fecha,
							Horainicio: FormatHelper.getTimeStringSAPFormat(object.timeFrom),
							Horafin: FormatHelper.getTimeStringSAPFormat(object.timeTo)
						}
						aDeepInsert.push(oDay);
					});

					var oData = {
						Tipo: oLicense.Tipo,
						Empresa: oLicense.Empresa,
						Anio: oLicense.Anio,
						Id: oLicense.Id,
						HorariosPorLicencia_nav: aDeepInsert
					}

					LicenseService.editLicense().then(() => {
						LicenseService.PostDaysLicence(oData).then(() => {
							MessageBoxHelper.showAlert("Alerta", "Se ha realizado el proceso de manera exitosa", () => {
								LicenseService.FIND(oLicense)
							})
						}).catch(() => {
							MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear fechas")
						})
					}).catch(() => {
						MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al editar los tiempos")
					});
				} else {
					if (this.dateInTheMiddle(object.date)) {
						var oDay = {
							Tipo: oLicense.Tipo,
							Empresa: oLicense.Empresa,
							Anio: oLicense.Anio,
							Id: oLicense.Id,
							Modif: "",
							Fecha: object.date,
							Horainicio: FormatHelper.getTimeStringSAPFormat(object.timeFrom),
							Horafin: FormatHelper.getTimeStringSAPFormat(object.timeTo)
						}
						LicenseService.postDay(oDay).then(() => {
							MessageBoxHelper.showAlert("Alerta", "Se ha realizado el proceso de manera exitosa", () => {
								LicenseService.FIND(oLicense)
							})
						}).catch(() => { })
					} else {
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solbeg", object.date);
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timbeg", object.timeFrom);

						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solend", maxDate.Fecha);
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timend", new Date(maxDate.Horainicio))

						var aDeepInsert = [];
						var aDaysExtended = $.extend([], AppManagementHelper.getModel("LicenseJsonModel").getData().HorariosPorLicencia_nav);
						var aDays = this.regenerateDays();

						var aNewDays = _.xorBy(aDays, aDaysExtended, (e) => {
							return e.Fecha.getTime()
						});

						aNewDays.forEach((oDay) => {
							var oDay = {
								Tipo: oLicense.Tipo,
								Empresa: oLicense.Empresa,
								Anio: oLicense.Anio,
								Id: oLicense.Id,
								Modif: "",
								Fecha: oDay.Fecha,
								Horainicio: FormatHelper.getTimeStringSAPFormat(object.timeFrom),
								Horafin: FormatHelper.getTimeStringSAPFormat(object.timeTo)
							}
							aDeepInsert.push(oDay);
						});

						var oData = {
							Tipo: oLicense.Tipo,
							Empresa: oLicense.Empresa,
							Anio: oLicense.Anio,
							Id: oLicense.Id,
							HorariosPorLicencia_nav: aDeepInsert
						}

						LicenseService.editLicense().then(() => {
							LicenseService.PostDaysLicence(oData).then(() => {
								MessageBoxHelper.showAlert("Alerta", "Se ha realizado el proceso de manera exitosa", () => {
									LicenseService.FIND(oLicense)
								})
							}).catch(() => {
								MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear fechas")
							})
						}).catch(() => {
							MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al editar los tiempos")
						});
					}
				}
			}
			//CREACION 
			else {
				if (object.date.getTime() > maxDate.Fecha.getTime()) {
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/HorariosPorLicencia_nav", []);

					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solbeg", minDate.Fecha);
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timbeg", minDate.Horainicio);

					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solend", object.date);
					//AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timend", object.timeFrom)
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timend", object.timeTo)

					this.regenerateDays();
					AppManagementHelper.getModel("LicenseJsonModel").refresh(true);
				} else {
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/HorariosPorLicencia_nav", []);

					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solbeg", object.date);
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timbeg", object.timeFrom);

					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solend", maxDate.Fecha);
					//AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timend", maxDate.Horainicio)
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timend", maxDate.Horafin)

					this.regenerateDays();
					AppManagementHelper.getModel("LicenseJsonModel").refresh(true);
					this.getView().getModel("newDay").setData({});
				}
				this.getView().getModel("newDay").setData({});
				AppManagementHelper.getModel("LicenseJsonModel").refresh();
			}

		},

		noAuthDay: function (oEvent) {
			oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().close();
			BusyDialogHelper.open();
			var oDay = oEvent.getSource().getParent().getBindingContext("LicenseJsonModel").getObject();
			oDay.Noauth = "X";
			delete oDay.LicenciaPorHorario_nav;
			LicenseService.PUTDay(oDay);
		},

		validateHoursFromEdition: function (date) {
			if (!date) return "";
			if (typeof (date) !== "number") {
				var tempDate = new Date(date.getTime() - 3 * 3600 * 1000);
				return tempDate.toISOString().slice(11, 16);
			} else {
				return FormatHelper.getTimeString(date);
			}
		},

		validateDaysFromEdition: function (date) {
			if (!date) return "";
			if (typeof (date) !== "number") {
				return FormatHelper.formatDateLicense(date);
			} else {
				return FormatHelper.getTimeString(date);
			}
		},

		onAcceptEdit: function (object) {
			this.getView().getModel().getData()[object.editing] = object;
			delete object.editing;
			delete object.isEdit;
			this.getView().getModel().refresh();
			this.getView().getModel("dirty").setData(true);
			this.getView().getModel("newDay").setData({});
		},

		onCancel: function () {
			this.getView().getModel("newDay").setData({});
		},

		onInit: function () {
			this.getView().setModel(new sap.ui.model.json.JSONModel({}), "newDay");
			//this.getView().setModel(new sap.ui.model.json.JSONModel(false), "dirty");
		},

		onEditDate: function (oEvent) {
			var object = oEvent.getSource().getBindingContext().getObject();
			var item = oEvent.getSource().getParent();
			var table = oEvent.getSource().getParent().getParent();
			var index = table.indexOfItem(item);
			this.getView().getModel("newDay").setData({
				date: new Date(object.date),
				timeFrom: object.timeFrom,
				timeTo: object.timeTo,
				editing: index,
				isEdit: true
			});
		},

		dateInTheMiddle: function (dateInTheMiddle) {
			/*	var aSplitedDateInTheMiddle = dateInTheMiddle.toISOString().split("T")[0].split("-");
				var parsedMiddleDate = aSplitedDateInTheMiddle[1] + "/" + aSplitedDateInTheMiddle[2] + "/" + aSplitedDateInTheMiddle[0];
	
				var initDate = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solbeg");
				var aSplitedInitDate = initDate.toISOString().split("T")[0].split("-");
				var parsedInitDate = aSplitedInitDate[1] + "/" + aSplitedInitDate[2] + "/" + aSplitedInitDate[0]
	
				var endDate = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solend");
				var aSplitedEndDate = endDate.toISOString().split("T")[0].split("-");
				var parsedEndDate = aSplitedEndDate[1] + "/" + aSplitedEndDate[2] + "/" + aSplitedEndDate[0]
	
				var d1 = parsedInitDate.split("/");
				var d2 = parsedEndDate.split("/");
				var c = parsedMiddleDate.split("/");
	
				var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]); // -1 because months are from 0 to 11
				var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
				var check = new Date(c[2], parseInt(c[1]) - 1, c[0]);*/

			var from = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solbeg"); // -1 because months are from 0 to 11
			var to = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solend");
			var check = dateInTheMiddle;



			return check > from && check < to;

		},

		onDeleteDate: function (oEvent) {
			var bEdition = AppManagementHelper.getModel("DisableNoAuthModel").getProperty("/isEdition");
			var oSelectedDate = oEvent.getSource().getBindingContext("LicenseJsonModel").getObject();
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			if (bEdition) {
				var aItems = AppManagementHelper.getModel("LicenseJsonModel").getData().HorariosPorLicencia_nav;
				var aOrdered = _.sortBy(aItems, (e) => {
					return e.Fecha.getTime()
				});
				var iIndex = aOrdered.indexOf(oSelectedDate);
				var bMinDate = aOrdered.indexOf(oSelectedDate) === 0;
				var bMaxDate = aOrdered.length === aOrdered.indexOf(oSelectedDate) + 1;

				if (bMinDate) {
					var indexOfMinDate = aOrdered.indexOf(oSelectedDate);
					var nextDate = aOrdered[indexOfMinDate + 1];
					if (nextDate) {
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solbeg", nextDate.Fecha);
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timbeg", new Date(nextDate.Horainicio));
					}
				}
				if (bMaxDate) {
					var indexOfMaxDate = aOrdered.length;
					var beforeDate = aOrdered[indexOfMaxDate - 2];
					if (beforeDate) {
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solend", beforeDate.Fecha);
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timend", new Date(beforeDate.Horafin));
					}
				}

				if (!nextDate && !beforeDate && !this.dateInTheMiddle(oSelectedDate.Fecha)) {
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "C");
					AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/enabled", true);
					this.getView().getParent().close()
				} else {
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "D");
				}
				// Se debe borrar el la fecha de la entidad "Horarios por licencia" antes de hacer el update en el servicio
				aItems.splice(iIndex, 1);
				LicenseService.editLicense().then(() => {
					LicenseService.deleteDay(oSelectedDate).then(() => {
						MessageBoxHelper.showAlert("Alerta", "Se ha eliminado el dia de manera exitosa.", () => {
							LicenseService.FIND(oLicense);
						})
					}).catch(() => {
						MessageBoxHelper.showAlert("Alerta", "Se ha producido un error");
					})
				}).catch(() => {
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al eliminar los tiempos")
				});
			} else {
				var aItems = AppManagementHelper.getModel("LicenseJsonModel").getData().HorariosPorLicencia_nav;
				var iIndex = aItems.indexOf(oSelectedDate);
				var bMinDate = aItems.indexOf(oSelectedDate) === 0;
				var bMaxDate = aItems.length === aItems.indexOf(oSelectedDate) + 1;

				//si se elimino el min date.
				if (bMinDate) {
					var indexOfMinDate = aItems.indexOf(oSelectedDate);
					var nextDate = aItems[indexOfMinDate + 1];
					if (nextDate) {
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solbeg", nextDate.Fecha);
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timbeg", nextDate.Horainicio);
					}
				}
				if (bMaxDate) {
					var indexOfMaxDate = aItems.length;
					var beforeDate = aItems[indexOfMaxDate - 2];
					if (beforeDate) {
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Solend", beforeDate.Fecha);
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Timend", beforeDate.Horafin);
					}
				}

				if (!nextDate && !beforeDate && !this.dateInTheMiddle(oSelectedDate.Fecha)) {
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "C");
					AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/enabled", true);
					this.regenerateDays();
					this.getView().getParent().close()
				} else {
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "D");
				}

				aItems.splice(iIndex, 1);
				AppManagementHelper.getModel("LicenseJsonModel").refresh(true);
			}

		},

		regenerateDaysEdition: function () { },

		regenerateDays: function () {
			var dateArray = [];
			var solBeg = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solbeg");
			var solEnd = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solend");
			var timBeg = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timbeg");
			var timeEnd = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timend")

			if (!solBeg || !solEnd || !timBeg || !timeEnd) {
				return;
			}
			var currentDate = new Date(solBeg.getTime());
			var stopDate = new Date(solEnd.getTime());
			var timeFrom = new Date(timBeg.getTime());
			var timeTo = new Date(timeEnd.getTime());
			//timeFrom.setHours(timeFrom.getHours() - 3);
			//timeTo.setHours(timeTo.getHours() - 3);
			currentDate.setHours(0, 0, 0, 0);
			stopDate.setHours(0, 0, 0, 0);
			while (currentDate <= stopDate) {
				dateArray.push({
					Fecha: currentDate,
					Horainicio: timeFrom,
					Horafin: timeTo
				});
				currentDate = new Date(currentDate);
				currentDate.setDate(currentDate.getDate() + 1);
			}
			var bEdition = AppManagementHelper.getModel("DisableNoAuthModel").getProperty("/isEdition");
			if (bEdition) {
				return dateArray;
			} else {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/HorariosPorLicencia_nav", dateArray);
			}
		},

		rolStatusEdition: function (controlPath, callback) {
			return RolAuthorizationHelper.rolStatusEdition(controlPath, callback);
		},

	});
});