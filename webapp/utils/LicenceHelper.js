sap.ui.define([
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"sap/ui/core/routing/History",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/LicenseService",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/EquiposService",
	"Transener/Operaciones/LicenciasTrabajo/utils/LegacyValidationHelper",
], function (NavigationHelper, FormatHelper, AppManagementHelper, oDataService, History, MessageBoxHelper,
	FioriComponentHelper, LicenseService, FioriHelper, BusyDialogHelper, EquiposService, LegacyValidationHelper) {
	"use strict";

	return {

		changeUbicacion: function (oEvent) {
			var items = oEvent.getSource().getSelectedItems();
			if (items.length !== 1) {
				AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/enabledComboEQUIPO", false);
				AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Equnr/Value", "");
				return;
			}
			var obj = items[0].getBindingContext("EstacionesJsonModel").getObject();
			var sKey = obj.Estacion;
			var sEmpresa = "100";
			EquiposService.loadEquipos(sKey, sEmpresa);
			AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/enabledComboEQUIPO", true);
			//TODO uncomment if decide to select region based on ET

		},

		handleSpecialDatesTramitacion: function (aData) {
			aData.forEach((oData) => {
				oData.Fecha = FormatHelper.formatDatesGMT(oData.Fecha);
			});
			var aUniqueDates = _.uniqBy(aData, (e) => {
				return e.Fecha.getTime();
			});
			return {
				Fechas: aUniqueDates
			};
		},

		getFastSearchFilters: function (sValue, mainController) {
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter({
						path: 'Id',
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),
					new sap.ui.model.Filter({
						path: 'Tplnr',
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),
					new sap.ui.model.Filter({
						path: 'Equnr',
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),
					new sap.ui.model.Filter({
						path: 'ArbplDesc',
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),
					//EqustatText
					new sap.ui.model.Filter({
						path: 'EqustatText',
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),
					new sap.ui.model.Filter({
						path: 'BloqueoText',
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),
					new sap.ui.model.Filter({
						path: 'PeriodoText',
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),
					new sap.ui.model.Filter({
						path: 'StatusText',
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),

				],
				and: false
			});
			var filters = [];
			// Issue 567 - Fallan el filtrado con la barra de busqueda
			// Se determino que estan generando la falla los filtros adicionales , 
			// se comentan ya que el filtro de busqueda rapido se aplica sobre el json que ya fue filtrado en el backend
			// por lo cual es redundante filtrar nuevamente en el front end 
			// if (mainController.estacionesFilter) filters.push(mainController.estacionesFilter);
			// if (mainController.tipoEquiposFilter) filters.push(mainController.tipoEquiposFilter);
			// if (mainController.tipoLicenciaFilter) filters.push(mainController.tipoLicenciaFilter);
			// if (mainController.localFilters.fechaInicio) filters.push(mainController.localFilters.fechaInicio);
			// if (mainController.localFilters.fechaFin) filters.push(mainController.localFilters.fechaFin);
			mainController.textSearchFilter = oFilter;
			if (sValue) {
				filters.push(oFilter);
			} else {
				mainController.textSearchFilter = null;
			}
			return filters;
		},

		validURLToLicense: function (sUrlParam) {
			var aKeys = sUrlParam ? sUrlParam.split(":") : [];
			return aKeys && aKeys.length ? aKeys.length === 4 : false
		},

		getURLLicenseData: function (sKey) {
			var aKeys = sKey.split(":");
			if (aKeys.length === 4) {
				var oLicenseData = {
					Id: aKeys[0] ? aKeys[0] : "",
					Tipo: aKeys[1] ? aKeys[1] : "",
					Empresa: aKeys[2] ? aKeys[2] : "",
					Anio: aKeys[3] ? aKeys[3] : "",
				}
				return oLicenseData;
			}
		},

		validForAnnulation: function (oLicence) {
			var bFlag = true;
			if (oLicence.Licstat === "01") {
				bFlag = oLicence.Substatus == "";
			}
			return bFlag;
		},

		setComments: function (oLicense) {
			if (oLicense.Comments === "") {
				let sValue = "";
				sValue += oLicense.R500kv === "X" ? " Requiere calle 500 kV abierta: Si, " : "";
				sValue += oLicense.Bloqueo === "X" ? " Bloqueo de recierre: Si, " : "";
				sValue += oLicense.Barrafs === "X" ? " Requiere Barra F/S: Si, Barra Especificada: " + oLicense.Barrafstx + " " : "";
				let oDate = FormatHelper.formatDate(oLicense.Solend);
				sValue = sValue + " Equipo a Intervenir: " + oLicense.Equiinterv + " ";
				sValue = sValue + " Trabajo a realizar " + oLicense.Descripcion + " ";
				sValue = sValue + " Finaliza:" + oDate + " LT Nº " + oLicense.Id + " ";
				oLicense.Comments = sValue;
			}
		},

		getCommentsReports: function (oLicense) {
			if (oLicense.Comments === "") {
				let sValue = "";
				sValue += oLicense.R500kv === "X" ? " Requiere calle 500 kV abierta: Si, " : "";
				sValue += oLicense.Bloqueo === "X" ? " Bloqueo de recierre: Si, " : "";
				sValue += oLicense.Barrafs === "X" ? " Requiere Barra F/S: Si, Barra Especificada: " + oLicense.Barrafstx + " " : "";
				let oDate = FormatHelper.formatDate(oLicense.Solend);
				sValue = sValue + " Equipo a Intervenir: " + oLicense.Equiinterv + " ";
				sValue = sValue + " Trabajo a realizar " + oLicense.Descripcion + " ";
				sValue = sValue + " Finaliza:" + oDate + " LT Nº " + oLicense.Id + " ";
				// Issue # 541 - en el reporte "Parte de Trabajos Diario y Semanal" concatenar en OBS
				// Se agregan comentarios de programación       
				sValue = sValue + " / " + oLicense.Tdtcomments;
				return sValue;
			} else {
				// Issue # 541 - en el reporte "Parte de Trabajos Diario y Semanal" concatenar en OBS
				// Se agregan comentarios de programación      
				return oLicense.Comments + " / " + oLicense.Tdtcomments;
			}
		},

		isLicense: function () {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			return (oLicense.Solbeg !== null && oLicense.Timend !== null && oLicense.Solend !== null && oLicense.Timbeg !== null && oLicense.Arbpl !==
				"" && oLicense.Solicitante !== "" &&
				oLicense.Equstatnocam !== "" && oLicense.Jobcond !== "" && oLicense.Equiinterv !== "" && oLicense.Descripcion !== "" && oLicense.R500kv !==
				"" && oLicense.Barrafs !== "" && oLicense.Bloqueo !==
				"" && oLicense.Werks !== "" && oLicense.Aufnr !== "" && oLicense.SolSuplente !== "" && oLicense.Jefe !== "" && oLicense.JefeSuplente !==
				"" && oLicense.Tipinterv !== "" && oLicense.Perestac !==
				"" && oLicense.Solictext !== "");
		},

		isSolicitud: function () {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			return (oLicense.Solbeg !== null && oLicense.Timend !== null && oLicense.Solend !== null && oLicense.Timbeg !== null && oLicense.Arbpl !==
				"" && oLicense.Solicitante !== "" &&
				oLicense.Equstatnocam !== "" && oLicense.Jobcond !== "" && oLicense.Equiinterv !== "" && oLicense.Descripcion !== "" && oLicense.R500kv !==
				"" && oLicense.Barrafs !== "" && oLicense.Bloqueo !==
				"");
		},

		setStatusOperationDelivery: function (aData, iIndex, aDelivery) {
			for (var i = 0; i < iIndex; i++) {
				aData[i].enabled = false;
				aData[i].Tejt = aDelivery[i].Tejt;
				aData[i].Folio = aDelivery[i].Folio;
				aData[i].Motivono = aDelivery[i].Motivono;
				aData[i].Commen = aDelivery[i].Commen;
				// aData[i].NotAuth = aDelivery[i]
			}
		},

		setStatusOperationDevolution: function (aData, iIndex, aDevolution) {
			for (var i = 0; i < iIndex; i++) {
				aData[i].enabled = false;
				aData[i].Tejt = aDevolution[i].Tejt;
				aData[i].Commen = aDevolution[i].Commen;
			}
		},

		formatUTCDates: function (aData) {
			aData.forEach((oData) => {
				oData.Datelicencia = FormatHelper.formatDatesGMT(oData.Datelicencia)
			})
		},

		generateSuspentionReanudation: function (oLicense) {
			var aSuspention = [];
			var aReanudation = [];
			if (oLicense.SuspensionLicencia_nav.length > 0) {
				this.formatUTCDates(oLicense.SuspensionLicencia_nav)
				aSuspention = aSuspention.concat(oLicense.SuspensionLicencia_nav)
				aSuspention.push({
					Anio: oLicense.Anio,
					Empresa: oLicense.Empresa,
					//	Datelicencia: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
					//		new Date() : oLicense.Solend, //oLicense.Solbeg,
					Datelicencia: new Date(),
					Id: oLicense.Id,
					Time: new Date(), //null,
					Cot: AppManagementHelper.getUser(),
					Tecnicoet: this.getDeliveryLastPerson(oLicense.Period, oLicense.EntregasLicencia_nav),
					Commen: "",
					enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "S")
				});
			} else {
				aSuspention.push({
					Anio: oLicense.Anio,
					Empresa: oLicense.Empresa,
					//	Datelicencia: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
					//	new Date() : oLicense.Solend, //oLicense.Solbeg,
					Datelicencia: new Date(),
					Id: oLicense.Id,
					Time: new Date(), //null,
					Cot: AppManagementHelper.getUser(),
					Tecnicoet: this.getDeliveryLastPerson(oLicense.Period, oLicense.EntregasLicencia_nav),
					Commen: "",
					enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "S")
				});
			}
			if (oLicense.ReanudacionLicencia_nav.length > 0) {
				this.formatUTCDates(oLicense.ReanudacionLicencia_nav)
				aReanudation = aReanudation.concat(oLicense.ReanudacionLicencia_nav)
				aReanudation.push({
					Anio: oLicense.Anio,
					Empresa: oLicense.Empresa,
					//Datelicencia: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
					//	new Date() : oLicense.Solend, //oLicense.Solbeg,
					Datelicencia: new Date(),
					Id: oLicense.Id,
					Time: new Date(), //null,
					Cot: AppManagementHelper.getUser(),
					Tecnicoet: this.getDeliveryLastPerson(oLicense.Period, oLicense.EntregasLicencia_nav),
					enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "R")
				})
			} else {
				aReanudation.push({
					Anio: oLicense.Anio,
					Empresa: oLicense.Empresa,
					//	Datelicencia: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
					//		new Date() : oLicense.Solend, //oLicense.Solbeg,
					Datelicencia: new Date(),
					Id: oLicense.Id,
					Time: new Date(), //null,
					Cot: AppManagementHelper.getUser(),
					Tecnicoet: this.getDeliveryLastPerson(oLicense.Period, oLicense.EntregasLicencia_nav),
					enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "R")
				})
			}

			aSuspention.forEach((e) => {
				e.TecnicoetValueState = "Success";
				e.TecnicoetValueStateText = ""
			});

			aReanudation.forEach((e) => {
				e.TecnicoetValueState = "Success";
				e.TecnicoetValueStateText = ""
			});

			LegacyValidationHelper.validateLegaciesFromSuspentionReanudation(oLicense, aSuspention);
			LegacyValidationHelper.validateLegaciesFromSuspentionReanudation(oLicense, aReanudation);

			AppManagementHelper.getModel("ReanudationTableJsonModel").setData({
				Reanudations: aReanudation
			});

			AppManagementHelper.getModel("SuspensionTableJsonModel").setData({
				Suspensions: aSuspention
			});
		},

		generateDeliveryDevolution: function (oLicense) {
			var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
			var aDataTODOS = oModel.getProperty("/Todos");

			var aDevolution = [];
			var aDelivery = [];

			if (oLicense.Period === "C") {
				// #513 -> Si la licencia tiene entregas:
				// "Asimismo, deben persistir los datos de las entregas aunque el usuario no aparezca según los criterios para el data source del combo."
				if (oLicense.EntregasLicencia_nav.length > 0) {
					let aCloneEntregas = jQuery.extend(true, [], oLicense.EntregasLicencia_nav);
					aCloneEntregas.forEach(oEntrega => {
						oEntrega.showPrevValue = true;
						let oTejtPrev = aDataTODOS.find(oItem => oItem.Legajo === oEntrega.Tejt);
						oEntrega.TejtPrev = oTejtPrev ? oTejtPrev : {
							Legajo: "",
							Nombre: "",
						};
						let oTecETPrev = aDataTODOS.find(oItem => oItem.Legajo === oEntrega.TecET);
						oEntrega.TecETPrev = oTecETPrev ? oTecETPrev : {
							Legajo: "",
							Nombre: "",
						};
					});

					// Assign data
					aDelivery = aDelivery.concat(aCloneEntregas);
				}
				this.formatUTCDates(aDelivery);

				var oDelivery = {
					Anio: oLicense.Anio,
					Empresa: oLicense.Empresa,
					sameDayValidation: true,
					Devolutiondate: new Date(),
					Datelicencia: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
						new Date() : oLicense.Solend,
					Id: oLicense.Id,
					Time: new Date(),
					Cot: AppManagementHelper.getStringUserLegacy(),
					Tejt: "",
					TecET: "",
					Folio: "",
					Motivono: "",
					Commen: "",
					enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "E"),
					showPrevValue: false,
					TejtPrev: {
						Legajo: "",
						Nombre: "",
					},
					TecETPrev: {
						Legajo: "",
						Nombre: "",
					}
				};

				var oDevolutionFromService = oLicense.DevolucionLicencia_nav.length ? oLicense.DevolucionLicencia_nav.shift() : null;
				if (oDevolutionFromService) {
					oDevolutionFromService.Datelicencia = FormatHelper.formatDatesGMT(oDevolutionFromService.Datelicencia);
					oDevolutionFromService.showPrevValue = true;
					let oTejtPrev = aDataTODOS.find(oItem => oItem.Legajo === oDevolutionFromService.Tejt);
					oDevolutionFromService.TejtPrev = oTejtPrev ? oTejtPrev : {
						Legajo: "",
						Nombre: "",
					};
					let oTecETPrev = aDataTODOS.find(oItem => oItem.Legajo === oDevolutionFromService.TecET);
					oDevolutionFromService.TecETPrev = oTecETPrev ? oTecETPrev : {
						Legajo: "",
						Nombre: "",
					};
				}

				var oDevolution = oDevolutionFromService ? oDevolutionFromService : {
					Anio: oLicense.Anio,
					Empresa: oLicense.Empresa,
					sameDayValidation: true,
					Devolutiondate: new Date(),
					Datelicencia: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
						new Date() : oLicense.Solend,
					Id: oLicense.Id,
					Time: new Date(),
					Devindex: "",
					Personal: AppManagementHelper.getStringUserLegacy(),
					Tejt: "",
					TecET: "",
					Commen: "",
					Cancel: "",
					enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "D"),
					enabledContinua: true,
					showPrevValue: false,
					TejtPrev: {
						Legajo: "",
						Nombre: "",
					},
					TecETPrev: {
						Legajo: "",
						Nombre: "",
					}
				};

				aDevolution.push(oDevolution);
				aDelivery.push(oDelivery);

			} else {
				// #513 -> Si la licencia tiene entregas:
				// "Asimismo, deben persistir los datos de las entregas aunque el usuario no aparezca según los criterios para el data source del combo."
				if (oLicense.EntregasLicencia_nav.length > 0) {
					let aCloneEntregas = jQuery.extend(true, [], oLicense.EntregasLicencia_nav);
					aCloneEntregas.forEach(oEntrega => {
						oEntrega.showPrevValue = true;
						let oTejtPrev = aDataTODOS.find(oItem => oItem.Legajo === oEntrega.Tejt);
						oEntrega.TejtPrev = oTejtPrev ? oTejtPrev : {
							Legajo: "",
							Nombre: "",
						};
						let oTecETPrev = aDataTODOS.find(oItem => oItem.Legajo === oEntrega.TecET);
						oEntrega.TecETPrev = oTecETPrev ? oTecETPrev : {
							Legajo: "",
							Nombre: "",
						};
					});

					// Assign data
					aDelivery = aDelivery.concat(aCloneEntregas);
				}

				this.formatUTCDates(aDelivery);
				aDelivery.push({
					Anio: oLicense.Anio,
					enabledInputMotivo: false,
					Devolutiondate: new Date(),
					Empresa: oLicense.Empresa,
					Datelicencia: new Date() > oLicense.Solbeg && new Date() < oLicense.Solend ? new Date() : oLicense.Solend,
					Id: oLicense.Id,
					Time: new Date(),
					Cot: AppManagementHelper.getStringUserLegacy(),
					Tejt: "",
					TecET: "",
					Folio: "",
					Motivono: "",
					Commen: "",
					enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "E") && oLicense.Licstat !== "11",
					showPrevValue: false,
					TejtPrev: {
						Legajo: "",
						Nombre: "",
					},
					TecETPrev: {
						Legajo: "",
						Nombre: "",
					}
				});

				// #513 -> Si la licencia tiene entregas:
				// "Asimismo, deben persistir los datos de las entregas aunque el usuario no aparezca según los criterios para el data source del combo."
				if (oLicense.DevolucionLicencia_nav.length > 0) {
					let aCloneDevoluciones = jQuery.extend(true, [], oLicense.DevolucionLicencia_nav);
					aCloneDevoluciones.forEach(oDevolucion => {
						oDevolucion.showPrevValue = true;
						let oTejtPrev = aDataTODOS.find(oItem => oItem.Legajo === oDevolucion.Tejt);
						oDevolucion.TejtPrev = oTejtPrev ? oTejtPrev : {
							Legajo: "",
							Nombre: "",
						};
						let oTecETPrev = aDataTODOS.find(oItem => oItem.Legajo === oDevolucion.TecET);
						oDevolucion.TecETPrev = oTecETPrev ? oTecETPrev : {
							Legajo: "",
							Nombre: "",
						};
					});

					// Assign data
					aDevolution = aDevolution.concat(aCloneDevoluciones);
				}

				this.formatUTCDates(aDevolution);
				aDevolution.push({
					Anio: oLicense.Anio,
					Empresa: oLicense.Empresa,
					Devolutiondate: new Date(),
					Datelicencia: new Date().getTime() < oLicense.Solbeg.getTime() ? oLicense.Solbeg : new Date(), //null,
					Id: oLicense.Id,
					Time: new Date(),
					Devindex: "",
					Personal: AppManagementHelper.getStringUserLegacy(),
					Tejt: "",
					TecET: "",
					Commen: "",
					Cancel: "",
					enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "D"),
					enabledContinua: true,
					showPrevValue: false,
					TejtPrev: {
						Legajo: "",
						Nombre: "",
					},
					TecETPrev: {
						Legajo: "",
						Nombre: "",
					}
				});
			}

			this.checkIfDeliveryHasMade(aDelivery, aDevolution);

			aDelivery.forEach((e) => {
				e.TejtValueState = "Success";
				e.TejtValueStateText = "";
			});
			aDevolution.forEach((e) => {
				e.TejtValueState = "Success";
				e.TejtValueStateText = "";
			});

			LegacyValidationHelper.validateLegaciesFromDeliveryDevolution(oLicense, aDelivery);
			LegacyValidationHelper.validateLegaciesFromDeliveryDevolution(oLicense, aDevolution);

			AppManagementHelper.getModel("DevolutionTableJsonModel").setData({
				Devolutions: aDevolution
			});

			AppManagementHelper.getModel("DeliveryTableJsonModel").setData({
				Deliveries: aDelivery
			});

			//para chequear que el menos una entrega se ha hecho.
			AppManagementHelper.getModel("ValidateFirstDeliveryJsonModel");
			AppManagementHelper.getModel("ValidateFirstDeliveryJsonModel").setData({
				FirstDeliveryHasBeenMade: !aDelivery.some(e => e.Entindex && e.Entindex !== "")
			});

			AppManagementHelper.getModel("ValidateFirstContModel").setData({
				fd: oLicense.Period === "C" ? !aDelivery.some(e => e.Entindex && e.Entindex !== "" && e.Motivono === "") : true
			});

			this.generateTable();
		},
		// generateDeliveryDevolution: function (oLicense) {
		// 	var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
		// 	var aDataTODOS = oModel.getProperty("/Todos");

		// 	var aDevolution = [];
		// 	var aDelivery = [];

		// 	// Helper to find previous values for Tejt and TecET
		// 	var findPrevValues = function (legajo, key) {
		// 		let foundItem = aDataTODOS.find(oItem => oItem.Legajo === legajo);
		// 		return foundItem ? foundItem : {
		// 			Legajo: "",
		// 			Nombre: ""
		// 		};
		// 	};

		// 	// Helper to process delivery or devolution nav data
		// 	var processNavData = function (navData, isDelivery) {
		// 		let cloneData = jQuery.extend(true, [], navData);
		// 		cloneData.forEach(item => {
		// 			item.showPrevValue = true;
		// 			item.TejtPrev = findPrevValues(item.Tejt);
		// 			item.TecETPrev = findPrevValues(item.TecET);
		// 		});
		// 		return cloneData;
		// 	};

		// 	// Helper to create new delivery or devolution objects
		// 	var createDeliveryDevolutionObject = function (isDevolution, defaults) {
		// 		return Object.assign({
		// 			Anio: oLicense.Anio,
		// 			Empresa: oLicense.Empresa,
		// 			Devolutiondate: new Date(),
		// 			Datelicencia: (new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend)) ?
		// 				new Date() : oLicense.Solend,
		// 			Id: oLicense.Id,
		// 			Time: new Date(),
		// 			enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, isDevolution ? "D" : "E"),
		// 			showPrevValue: false,
		// 			TejtPrev: {
		// 				Legajo: "",
		// 				Nombre: ""
		// 			},
		// 			TecETPrev: {
		// 				Legajo: "",
		// 				Nombre: ""
		// 			}
		// 		}, defaults);
		// 	}.bind(this);

		// 	if (oLicense.Period === "C") {
		// 		// Process existing deliveries
		// 		if (oLicense.EntregasLicencia_nav.length > 0) {
		// 			aDelivery = processNavData(oLicense.EntregasLicencia_nav, true);
		// 		}
		// 		this.formatUTCDates(aDelivery);

		// 		// Create new delivery and devolution objects
		// 		aDelivery.push(createDeliveryDevolutionObject(false, {
		// 			Cot: AppManagementHelper.getStringUserLegacy(),
		// 			Folio: "",
		// 			Motivono: "",
		// 			Commen: "",
		// 			enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "E")
		// 		}));

		// 		var oDevolutionFromService = oLicense.DevolucionLicencia_nav.length ? oLicense.DevolucionLicencia_nav.shift() : null;
		// 		if (oDevolutionFromService) {
		// 			oDevolutionFromService.Datelicencia = FormatHelper.formatDatesGMT(oDevolutionFromService.Datelicencia);
		// 			oDevolutionFromService.showPrevValue = true;
		// 			oDevolutionFromService.TejtPrev = findPrevValues(oDevolutionFromService.Tejt);
		// 			oDevolutionFromService.TecETPrev = findPrevValues(oDevolutionFromService.TecET);
		// 		}

		// 		aDevolution.push(oDevolutionFromService || createDeliveryDevolutionObject(true, {
		// 			Personal: AppManagementHelper.getStringUserLegacy(),
		// 			Devindex: "",
		// 			Commen: "",
		// 			Cancel: "",
		// 			enabledContinua: true
		// 		}));

		// 	} else {
		// 		// Process existing deliveries for non-C period
		// 		if (oLicense.EntregasLicencia_nav.length > 0) {
		// 			aDelivery = processNavData(oLicense.EntregasLicencia_nav, true);
		// 		}

		// 		this.formatUTCDates(aDelivery);
		// 		aDelivery.push(createDeliveryDevolutionObject(false, {
		// 			Cot: AppManagementHelper.getStringUserLegacy(),
		// 			Folio: "",
		// 			Motivono: "",
		// 			Commen: "",
		// 			enabledInputMotivo: false,
		// 			enabled: this.getEnabledEstatusDelivery(oLicense.Period, oLicense.Substatus, "E") && oLicense.Licstat !== "11"
		// 		}));

		// 		// Process devolutions
		// 		if (oLicense.DevolucionLicencia_nav.length > 0) {
		// 			aDevolution = processNavData(oLicense.DevolucionLicencia_nav, false);
		// 		}

		// 		this.formatUTCDates(aDevolution);
		// 		aDevolution.push(createDeliveryDevolutionObject(true, {
		// 			Personal: AppManagementHelper.getStringUserLegacy(),
		// 			Devindex: "",
		// 			Commen: "",
		// 			Cancel: "",
		// 			enabledContinua: true
		// 		}));
		// 	}

		// 	// Set models with processed data
		// 	AppManagementHelper.getModel("DevolutionTableJsonModel").setData({
		// 		Devolutions: aDevolution
		// 	});
		// 	AppManagementHelper.getModel("DeliveryTableJsonModel").setData({
		// 		Deliveries: aDelivery
		// 	});

		// 	// Check if at least one delivery was made
		// 	AppManagementHelper.getModel("ValidateFirstDeliveryJsonModel").setData({
		// 		FirstDeliveryHasBeenMade: !aDelivery.some(e => e.Entindex && e.Entindex !== "")
		// 	});

		// 	AppManagementHelper.getModel("ValidateFirstContModel").setData({
		// 		fd: oLicense.Period === "C" ? !aDelivery.some(e => e.Entindex && e.Entindex !== "" && e.Motivono === "") : true
		// 	});

		// 	this.checkIfDeliveryHasMade(aDelivery, aDevolution);

		// 	// Apply success state for legacy validation
		// 	aDelivery.forEach(e => {
		// 		e.TejtValueState = "Success";
		// 		e.TejtValueStateText = "";
		// 	});
		// 	aDevolution.forEach(e => {
		// 		e.TejtValueState = "Success";
		// 		e.TejtValueStateText = "";
		// 	});

		// 	LegacyValidationHelper.validateLegaciesFromDeliveryDevolution(oLicense, aDelivery);
		// 	LegacyValidationHelper.validateLegaciesFromDeliveryDevolution(oLicense, aDevolution);

		// 	this.generateTable();
		// },
		generateTurno: function (oLicense) {
			var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
			var aDataTODOS = oModel.getProperty("/Todos");

			var aTurnos = [];

			if (oLicense.TurnosLicencias_nav.length > 0) {
				let aCloneTurnos = jQuery.extend(true, [], oLicense.TurnosLicencias_nav);

				aCloneTurnos.forEach(oTurno => {
					oTurno.Dateturno = FormatHelper.formatDateWithoutGMT(oTurno.Dateturno)
					oTurno.Turno = FormatHelper.formatTimeString(oTurno.Turno)
				})

				aTurnos = aTurnos.concat(aCloneTurnos);
			}
			//	this.formatUTCDates(aColocaciones);
			AppManagementHelper.getModel("TurnosTableJsonModel").setData({
				Turno: aTurnos
			});
		},

		generateInhibicionHabilitacion: function (oLicense) {
			var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
			var aDataTODOS = oModel.getProperty("/Todos");

			var aInhibicion = [];
			var aHabilitacion = [];

			if (oLicense.Period === "C") {
				// #513 -> Si la licencia tiene inhibiciones:

				//Revisar y agregar .length >0
				if (oLicense.InhibicionRecierre_nav.length > 0) {
					let aCloneInhibiciones = jQuery.extend(true, [], oLicense.InhibicionRecierre_nav);

					aInhibicion = aInhibicion.concat(aCloneInhibiciones);
				}

				if (oLicense.HabilitacionRecierre_nav.length > 0) {
					let aCloneHabilitaciones = jQuery.extend(true, [], oLicense.HabilitacionRecierre_nav);

					aHabilitacion = aHabilitacion.concat(aCloneHabilitaciones);
				}
				//this.formatUTCDates(aInhibicion);

				var oHabilitacion = {
					Id: oLicense.Id,
					Empresa: oLicense.Empresa,
					Datehab: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
						new Date() : oLicense.Solend,
					Time: new Date(),
					Tplnr: "",
					Coment: "",
				};
				var oInhibicion = {
					Id: oLicense.Id,
					Empresa: oLicense.Empresa,
					Datehab: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
						new Date() : oLicense.Solend,
					Time: new Date(),
					Tplnr: "",
					Coment: "",
				};
				//Revisar y agregar .length

				aHabilitacion.push(oHabilitacion);
				aInhibicion.push(oInhibicion);

			} else {
				if (oLicense.InhibicionRecierre_nav.length > 0) {
					let aCloneInhibiciones = jQuery.extend(true, [], oLicense.InhibicionRecierre_nav);

					aInhibicion = aInhibicion.concat(aCloneInhibiciones);
				}
				if (oLicense.HabilitacionRecierre_nav.length > 0) {
					let aCloneHabilitaciones = jQuery.extend(true, [], oLicense.HabilitacionRecierre_nav);
					aHabilitacion = aHabilitacion.concat(aCloneHabilitaciones);
				}
				//this.formatUTCDates(aInhibicion);
				aInhibicion.push({
					Empresa: oLicense.Empresa,
					Datehab: new Date() > oLicense.Solbeg && new Date() < oLicense.Solend ? new Date() : oLicense.Solend,
					Id: oLicense.Id,
					Time: new Date(),
					Coment: "",
					Tplnr: '',

				});
				aHabilitacion.push({
					Empresa: oLicense.Empresa,
					Datehab: new Date() > oLicense.Solbeg && new Date() < oLicense.Solend ? new Date() : oLicense.Solend,
					Id: oLicense.Id,
					Time: new Date(),
					Coment: "",
					Tplnr: '',

				});
			}

			AppManagementHelper.getModel("HabilitacionTableJsonModel").setData({
				Habilitacion: aHabilitacion
			});
			AppManagementHelper.getModel("InhibicionTableJsonModel").setData({
				Inhibicion: aInhibicion
			});
		},
		generatePlacementRemoval: function (oLicense) {
			var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
			var aDataTODOS = oModel.getProperty("/Todos");

			var aColocaciones = [];
			var aRetiros = [];

			if (oLicense.Period === "C") {
				
				if (oLicense.ColocacionPAT_nav.length > 0) {
					let aCloneColocaciones = jQuery.extend(true, [], oLicense.ColocacionPAT_nav);

					aColocaciones = aColocaciones.concat(aCloneColocaciones);
				}

				if (oLicense.RetiroPAT_nav.length > 0) {
					let aCloneRetiros = jQuery.extend(true, [], oLicense.RetiroPAT_nav);

					aRetiros = aRetiros.concat(aCloneRetiros);
				}
				//this.formatUTCDates(aColocaciones);

				var oRetiro = {
					Id: oLicense.Id,
					Empresa: oLicense.Empresa,
					Datehab: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
						new Date() : oLicense.Solend,
					Time: new Date(),
					Tplnr: "",
					Coment: "",
				};
				var oColocacion = {
					Id: oLicense.Id,
					Empresa: oLicense.Empresa,
					Datehab: new Date() > FormatHelper.formatDatesGMT(oLicense.Solbeg) && new Date() < FormatHelper.formatDatesGMT(oLicense.Solend) ?
						new Date() : oLicense.Solend,
					Time: new Date(),
					Tplnr: "",
					Coment: "",
				};
				//Revisar y agregar .length

				aColocaciones.push(oColocacion);
				aRetiros.push(oRetiro);

			} else {
				if (oLicense.ColocacionPAT_nav.length > 0) {
					let aCloneColocaciones = jQuery.extend(true, [], oLicense.ColocacionPAT_nav);

					aColocaciones = aColocaciones.concat(aCloneColocaciones);
				}
				if (oLicense.RetiroPAT_nav.length > 0) {
					let aCloneRetiros = jQuery.extend(true, [], oLicense.RetiroPAT_nav);
					aRetiros = aRetiros.concat(aCloneRetiros);
				}
				//this.formatUTCDates(aColocaciones);
				aColocaciones.push({
					Empresa: oLicense.Empresa,
					Datehab: new Date() > oLicense.Solbeg && new Date() < oLicense.Solend ? new Date() : oLicense.Solend,
					Id: oLicense.Id,
					Time: new Date(),
					Coment: "",
					Tplnr: '',

				});
				aRetiros.push({
					Empresa: oLicense.Empresa,
					Datehab: new Date() > oLicense.Solbeg && new Date() < oLicense.Solend ? new Date() : oLicense.Solend,
					Id: oLicense.Id,
					Time: new Date(),
					Coment: "",
					Tplnr: '',

				});
			}

			AppManagementHelper.getModel("RetiroTableJsonModel").setData({
				Retiro: aRetiros
			});
			AppManagementHelper.getModel("ColocacionTableJsonModel").setData({
				Colocacion: aColocaciones
			});
		},
		setPersonalHabilitadoParaCboEntraga: function (oLicense) {
			var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
			var aDataTODOS = oModel.getProperty("/Todos");
			var oJefe = aDataTODOS.find(oItem => oItem.Legajo === oLicense.Jefe);
			var oJefeSuplente = aDataTODOS.find(oItem => oItem.Legajo === oLicense.JefeSuplente);
			var aOptions = [oJefe, oJefeSuplente];

			if (oLicense.TransferenciaJefeTrabajo_nav.length > 0) {
				var oLastTranfer = oLicense.TransferenciaJefeTrabajo_nav[oLicense.TransferenciaJefeTrabajo_nav.length - 1];
				var oLastJefeTransferido = aDataTODOS.find(oItem => oItem.Legajo === oLastTranfer.Jefetra);
				aOptions.push(oLastJefeTransferido);
			}

			oModel.setProperty("/CboJefeEntregas", aOptions);
		},

		setPersonalHabilitadoParaCboDevolucion: function (oLicense) {
			var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
			var aDataTODOS = oModel.getProperty("/Todos");
			var aOptions = [];

			if (oLicense.EntregasLicencia_nav.length > 0) {
				var oLastEntrega = oLicense.EntregasLicencia_nav[oLicense.EntregasLicencia_nav.length - 1];
				var oLastJefeEntrega = aDataTODOS.find(oItem => oItem.Legajo === oLastEntrega.Tejt);
				aOptions.push(oLastJefeEntrega);
			}

			if (oLicense.TransferenciaJefeTrabajo_nav.length > 0) {
				var oLastTranfer = oLicense.TransferenciaJefeTrabajo_nav[oLicense.TransferenciaJefeTrabajo_nav.length - 1];
				var oLastJefeTransferido = aDataTODOS.find(oItem => oItem.Legajo === oLastTranfer.Jefetra);
				aOptions.push(oLastJefeTransferido);
			}

			oModel.setProperty("/CboJefeDevoluciones", aOptions);
		},

		setPersonalHabilitadoParaCboCancelacion: function (oLicense) {
			var oModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
			var aDataTODOS = oModel.getProperty("/Todos");

			console.log("DATA", aDataTODOS)
			var aOptions = [];

			if (oLicense.EntregasLicencia_nav.length > 0) {
				var oLastEntrega = oLicense.EntregasLicencia_nav[oLicense.EntregasLicencia_nav.length - 1];
				var oLastJefeEntrega = aDataTODOS.find(oItem => oItem.Legajo === oLastEntrega.Tejt);
				aOptions.push(oLastJefeEntrega);
			}

			if (oLicense.TransferenciaJefeTrabajo_nav.length > 0) {
				var oLastTranfer = oLicense.TransferenciaJefeTrabajo_nav[oLicense.TransferenciaJefeTrabajo_nav.length - 1];
				var oLastJefeTransferido = aDataTODOS.find(oItem => oItem.Legajo === oLastTranfer.Jefetra);
				aOptions.push(oLastJefeTransferido);
			}

			console.log("Options", aOptions)

			oModel.setProperty("/CboJefeCancelacion", aOptions);
		},

		getDeliveryLastPerson: function (sPeriod, aDelivery) {
			if (sPeriod === "C") {
				if (AppManagementHelper.getModel("DeliveryTableJsonModel").getData().Deliveries[0]) {
					return AppManagementHelper.getModel("DeliveryTableJsonModel").getData().Deliveries[0].Tejt
				}
				return "";
			} else {
				if (aDelivery.length > 1) {
					var aFiltered = aDelivery.filter(e => e.Entindex !== undefined);
					return aFiltered[aFiltered.length - 1]["Tejt"];
				}
				return "";
			}

		},

		generateTable: function () {
			var oModel = AppManagementHelper.getModel("DeliveryDevolutionTable");
			var aData = [];
			var aDeliveries = AppManagementHelper.getModel("DeliveryTableJsonModel").getData().Deliveries;
			var aDevolutions = AppManagementHelper.getModel("DevolutionTableJsonModel").getData().Devolutions;
			var iIterable = Math.max(aDeliveries.length, aDevolutions.length);
			for (var i = 0; i < iIterable; i++) {
				aData.push({
					FechaEntrega: (aDeliveries[i] && aDeliveries[i].Datelicencia && aDeliveries[i].Entindex) ? aDeliveries[i].Datelicencia : "",
					HoraEntrega: (aDeliveries[i] && aDeliveries[i].Time && aDeliveries[i].Entindex) ? aDeliveries[i].Time : "",
					FechaDevolucion: (aDevolutions[i] && aDevolutions[i].Datelicencia && aDevolutions[i].Devindex) ? aDevolutions[i].Datelicencia : "",
					HoraDevolucion: (aDevolutions[i] && aDevolutions[i].Time && aDevolutions[i].Devindex) ? aDevolutions[i].Time : ""
				})
			}
			oModel.setData({
				DeliveryDevolutions: aData
			})

		},

		checkIfDeliveryHasMade: function (aDelivery, aDevolution) {
			//testing!!
			//TODO verificar con juan si esto es lo que quieren
			aDelivery.forEach(e => e.sameDayValidation = true);
			aDevolution.forEach(e => e.sameDayValidation = true);
			return;
			//fin
			var sActualDate = new Date().toISOString().split("T")[0];
			var oDeliveryMade = aDelivery.find((e) => {
				if (e.Delivereddate)
					return e.Delivereddate.toISOString().split("T")[0] === sActualDate;
			});

			if (oDeliveryMade) {
				aDelivery.forEach(e => e.sameDayValidation = false);
			} else {
				aDelivery.forEach(e => e.sameDayValidation = true);
			}

			var oDevolutionMade = aDevolution.find((e) => {
				if (e.Delivereddate)
					return e.Delivereddate.toISOString().split("T")[0] === sActualDate;
			});

			if (oDevolutionMade) {
				aDevolution.forEach(e => e.sameDayValidation = false);
			} else {
				aDevolution.forEach(e => e.sameDayValidation = true);
			}
		},
		checkIfPlacementHasMade: function (aDelivery, aDevolution) {
			//testing!!
			//TODO verificar con juan si esto es lo que quieren
			aDelivery.forEach(e => e.sameDayValidation = true);
			aDevolution.forEach(e => e.sameDayValidation = true);
			return;
			//fin
			var sActualDate = new Date().toISOString().split("T")[0];
			var oDeliveryMade = aDelivery.find((e) => {
				if (e.Delivereddate)
					return e.Delivereddate.toISOString().split("T")[0] === sActualDate;
			});

			if (oDeliveryMade) {
				aDelivery.forEach(e => e.sameDayValidation = false);
			} else {
				aDelivery.forEach(e => e.sameDayValidation = true);
			}

			var oDevolutionMade = aDevolution.find((e) => {
				if (e.Delivereddate)
					return e.Delivereddate.toISOString().split("T")[0] === sActualDate;
			});

			if (oDevolutionMade) {
				aDevolution.forEach(e => e.sameDayValidation = false);
			} else {
				aDevolution.forEach(e => e.sameDayValidation = true);
			}
		},
		checkIfInhibitionHasMade: function (aDelivery, aDevolution) {
			//testing!!
			//TODO verificar con juan si esto es lo que quieren
			aDelivery.forEach(e => e.sameDayValidation = true);
			aDevolution.forEach(e => e.sameDayValidation = true);
			return;
			//fin
			var sActualDate = new Date().toISOString().split("T")[0];
			var oDeliveryMade = aDelivery.find((e) => {
				if (e.Delivereddate)
					return e.Delivereddate.toISOString().split("T")[0] === sActualDate;
			});

			if (oDeliveryMade) {
				aDelivery.forEach(e => e.sameDayValidation = false);
			} else {
				aDelivery.forEach(e => e.sameDayValidation = true);
			}

			var oDevolutionMade = aDevolution.find((e) => {
				if (e.Delivereddate)
					return e.Delivereddate.toISOString().split("T")[0] === sActualDate;
			});

			if (oDevolutionMade) {
				aDevolution.forEach(e => e.sameDayValidation = false);
			} else {
				aDevolution.forEach(e => e.sameDayValidation = true);
			}
		},

		//EL STYPE IDENTIFICA EL PROCESO, REANUDACION, SUSPENSION, ENTREGA O DEVOLUCION
		getEnabledEstatusDelivery: function (sPeriod, sSubstatus, sType) {
			//cuando vengo por primera vez aprobada sin subestado, es decir, comienzo el proceso, el boton de entrega
			//se habilita cuando 
			//TODO AGREGAR TMB AQUI LO DE LA TRAMITACION EN UN FUTURO CALENDARIO

			switch (sType) {
				case "E":
					return sPeriod === "C" ? sSubstatus === "" : sSubstatus === "" || sSubstatus === "D";
				case "D":
					return sSubstatus === "E" || sSubstatus === "R";
				case "R":
					return sSubstatus === "S";
				case "S":
					return sSubstatus === "R" || sSubstatus === "E";
				case "F":
					return false;
			}

		},

		cloneLicense: function (license) {
			let clone = {
				...license
			};
			clone.Gdate = new Date(license.Gdate);
			clone.Solbeg = new Date(license.Solbeg);
			clone.Timbeg = new Date(license.Timbeg);
			clone.Solend = new Date(license.Solend);
			clone.Timend = new Date(license.Timend);

			if (license.HorariosPorLicencia_nav && license.HorariosPorLicencia_nav.length) {
				clone.HorariosPorLicencia_nav = [];
				license.HorariosPorLicencia_nav.forEach((horario) => {
					let horarioClone = {
						...horario
					};
					horarioClone.Fecha = new Date(horario.Fecha);
					horarioClone.Horainicio = new Date(horario.Horainicio);
					horarioClone.Horafin = new Date(horario.Horafin);
					clone.HorariosPorLicencia_nav.push(horarioClone);
					//TODO LicenciaPorHorario_nav
				});
			}

			if (license.ObservacionesLicencia_nav && license.ObservacionesLicencia_nav.length) {
				clone.ObservacionesLicencia_nav = [];
				license.ObservacionesLicencia_nav.forEach((observacion) => {
					let observacionClone = {
						...observacion
					};
					observacionClone.CreationDate = new Date(observacion.CreationDate);
					observacionClone.CreationTime = {
						ms: observacion.CreationTime.ms,
						__edmType: observacion.CreationTime.__edmType
					}
					clone.ObservacionesLicencia_nav.push(observacionClone);
				});
			}

			if (license.CoordinacionesLicencia_nav && license.CoordinacionesLicencia_nav.length) {
				clone.CoordinacionesLicencia_nav = [];
				license.CoordinacionesLicencia_nav.forEach((coordinacion) => {
					let coordinacionClone = {
						...coordinacion
					};
					coordinacionClone.CreationDate = new Date(coordinacion.CreationDate);
					coordinacionClone.CreationTime = {
						ms: coordinacion.CreationTime.ms,
						__edmType: coordinacion.CreationTime.__edmType
					}
					clone.CoordinacionesLicencia_nav.push(coordinacionClone);
				});
			}
			//todo que es esto
			/*		if (license.TramitacionesLicencia_nav && license.TramitacionesLicencia_nav.length) {
						clone.TramitacionesLicencia_nav = [];
						license.TramitacionesLicencia_nav.forEach((tramitacion) => {
							let tramitacionClone = {...tramitacion
							};
							tramitacionClone.CalendarDates = {...tramitacion.CalendarDates
							};
							tramitacionClone.CalendarDates.FechasSeleccionadas = [];
							tramitacion.CalendarDates.FechasSeleccionadas.forEach(fechaSeleccionada => {
								let fechaClone = {...fechaSeleccionada
								};
								fechaClone.Fecha = new Date(fechaSeleccionada.Fecha);
								tramitacionClone.CalendarDates.FechasSeleccionadas.push()
							});
							clone.TramitacionesLicencia_nav.push(tramitacionClone);
						});
					}*/

			if (license.TramitacionesLicencia_nav && license.TramitacionesLicencia_nav.length) {
				clone.TramitacionesLicencia_nav = [];
				license.TramitacionesLicencia_nav.forEach((tramitacion) => {
					let tramitacionClone = {
						...tramitacion
					};
					tramitacionClone.CalendarDates = {
						...tramitacion.CalendarDates
					};
					tramitacionClone.CalendarDates = [];
					tramitacion.CalendarDates.forEach(fechaSeleccionada => {
						let fechaClone = {
							...fechaSeleccionada
						};
						fechaClone.Fecha = new Date(fechaSeleccionada.Fecha);
						tramitacionClone.CalendarDates.push()
					});
					clone.TramitacionesLicencia_nav.push(tramitacionClone);
				});
			}

			if (license.EntregasLicencia_nav && license.EntregasLicencia_nav.length) {
				clone.EntregasLicencia_nav = [];
				license.EntregasLicencia_nav.forEach((entrega) => {
					let entregaClone = {
						...entrega
					};
					entregaClone.Datelicencia = new Date(entrega.Datelicencia);
					entregaClone.Delivereddate = new Date(entrega.Delivereddate);
					entregaClone.Devolutiondate = new Date(entrega.Devolutiondate);
					entregaClone.Time = new Date(entrega.Time);
					clone.EntregasLicencia_nav.push(entregaClone)
				});
			}

			if (license.DevolucionLicencia_nav && license.DevolucionLicencia_nav.length) {
				clone.DevolucionLicencia_nav = [];
				license.DevolucionLicencia_nav.forEach((devolucion) => {
					let devolucionClone = {
						...devolucion
					};
					devolucionClone.Datelicencia = new Date(devolucion.Datelicencia);
					devolucionClone.Delivereddate = new Date(devolucion.Delivereddate);
					devolucionClone.Devolutiondate = new Date(devolucion.Devolutiondate);
					devolucionClone.Time = new Date(devolucion.Time);
					clone.DevolucionLicencia_nav.push(devolucionClone)
				});
			}

			if (license.SuspensionLicencia_nav && license.SuspensionLicencia_nav.length) {
				clone.SuspensionLicencia_nav = [];
				license.SuspensionLicencia_nav.forEach((suspension) => {
					let suspensionClone = {
						...suspension
					};
					suspensionClone.Datelicencia = new Date(suspension.Datelicencia);
					suspensionClone.Time = new Date(suspension.Time);
					clone.SuspensionLicencia_nav.push(suspensionClone)
				});
			}

			if (license.ReanudacionLicencia_nav && license.ReanudacionLicencia_nav.length) {
				clone.ReanudacionLicencia_nav = [];
				license.ReanudacionLicencia_nav.forEach((reanudacion) => {
					let reanudacionClone = {
						...reanudacion
					};
					reanudacionClone.Datelicencia = new Date(reanudacion.Datelicencia);
					reanudacionClone.Time = new Date(reanudacion.Time);
					clone.ReanudacionLicencia_nav.push(reanudacionClone)
				});
			}

			if (license.TransferenciaJefeTrabajo_nav && license.TransferenciaJefeTrabajo_nav.length) {
				clone.TransferenciaJefeTrabajo_nav = [];
				license.TransferenciaJefeTrabajo_nav.forEach((transferencia) => {
					let transferenciaClone = {
						...transferencia
					};
					transferenciaClone.Time = new Date(transferencia.Time);
					clone.TransferenciaJefeTrabajo_nav.push(transferenciaClone)
				});
			}

			return clone;
		},

		// TODO VER CON PABLO Y MATI

		getIsFinish: function (sStatus) {
			let bFinish;
			switch (sStatus) {
				case "01":
					bFinish = true;
					break;
				case "06":
					bFinish = true;
					break;
				case "23":
					bFinish = true;
					break;
				default:
					bFinish = false;
					break;
			}

			return bFinish;
		},

		getOrderSpecialDate: function (oSpecialDates) {
			if (oSpecialDates.Fechas.length > 0) {
				let oData = oSpecialDates;
				for (let i = 0; oData.Fechas.length > i; i++) {
					if (oSpecialDates.Fechas[i].Estado === "CC") {
						let oData = oSpecialDates.Fechas[i];
						let iPos = oSpecialDates.Fechas.indexOf(oData);
						oSpecialDates.Fechas.splice(iPos, 1);
						oSpecialDates.Fechas.unshift(oData);
					}
				}
			}
			return oSpecialDates;
		},

		deliveryIsNotAuthorized: function (selectedDate) {
			var specialDates = AppManagementHelper.getModel("EspecialDatesTramitacion").getData().Fechas;
			let fechaEncontrada = specialDates.find(x => new Date(x.Fecha).setHours(0, 0, 0, 0) === new Date(selectedDate).setHours(0, 0, 0, 0));
			return fechaEncontrada && fechaEncontrada.Estado === "NA"
		},
		// Issue #535 el estado diario " anulada por el solicitante" NO bloquea la entrega
		// Se agrega función para validar si  el estado de la entrega es "Anulada por solicitante" ya que el mismo debe bloquear la entrega
		deliveryIsAnuladaSol: function (selectedDate) {
			var specialDates = AppManagementHelper.getModel("EspecialDatesTramitacion").getData().Fechas;
			let fechaEncontrada = specialDates.find(x => new Date(x.Fecha).setHours(0, 0, 0, 0) === new Date(selectedDate).setHours(0, 0, 0, 0));
			return fechaEncontrada && fechaEncontrada.Estado === "AS"
		},

		getTramitTextStatus: function (licstat, aTramites) {
			if (aTramites.length > 0) {
				if (aTramites.some((Tramitacion) => Tramitacion.Estado === '02')) { //Si alguna tramitacion tiene estado "No autorizada"
					return 'NO'
				} else if (aTramites.some((Tramitacion) => Tramitacion.Estado === '03')) { //Si alguna tiene "En tramite"
					return 'NO'
				} else { //si no tienen ninguna "En tramite" y ninguna en "No autorizada", se supone que tiene todas autorizadas
					return 'SI'
				}
			} else {
				return licstat === "07" || licstat === "03" ? "NO" : "SI";
			}
		},

		getTramitStatus: function (aTramites) {
			if (aTramites.length > 0) {

				if (aTramites.some((Tramitacion) => Tramitacion.Estado === '02')) { //Si alguna tramitacion tiene estado "No autorizada"
					return '06' // NO autorizada
				} else if (aTramites.some((Tramitacion) => Tramitacion.Estado === '03')) { //Si alguna tiene "En tramite"
					return '23' // En tramite
				} else { //si no tienen ninguna "En tramite" y ninguna en "No autorizada", se supone que tiene todas autorizadas
					return '01' // Autorizada
				}

			}
			return "01";
		},

		attributeIsValidForRequest: function (attribute, value, aRequiredFields) {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			switch (attribute) {
				case "Solbeg":
					if (value !== null) {
						break;
					} else {
						aRequiredFields.push({
							value: "- Fecha de inicio"
						})
						break;
					}
				case "Solend":
					if (value !== null) {
						break;
					} else {
						aRequiredFields.push({
							value: "- Fecha de fin"
						})
						break;
					}
				case "Timbeg":
					if (value !== null) {
						break;
					} else {
						aRequiredFields.push({
							value: "- Hora de inicio"
						})
						break;
					}
				case "Timend":
					if (value !== null) {
						break;
					} else {
						aRequiredFields.push({
							value: "- Hora de fin"
						})
						break;
					}
				case "Descripcion":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Descripción del trabajo a realizar"
						})
						break;
					}
				case "Equnr":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Equipo Solicitado Cammesa"
						})
						break;
					}
				case "Estacional":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Estacional"
						})
						break;
					}
				case "Capex":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- CAPEX"
						})
						break;
					}
				case "Tplnr":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- E.T"
						})
						break;
					}
				case "Werks":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Región"
						})
						break;
					}
				case "Tiemporep":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Tiempo de reposición"
						})
						break;
					}
				case "Equstat":
					if (value !== "N") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Estado Equipo CAMMESA"
						})
						break;
					}
				default:
					return true
			}
		},

		attributeIsValidForLicense: function (attribute, value, aRequiredFields) {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			switch (attribute) {
				case "Solbeg":
					if (value !== null) {
						break;
					} else {
						aRequiredFields.push({
							value: "- Fecha de inicio"
						})
						break;
					}
				case "Solend":
					if (value !== null) {
						break;
					} else {
						aRequiredFields.push({
							value: "- Fecha de fin"
						})
						break;
					}
				case "Timbeg":
					if (value !== null) {
						break;
					} else {
						aRequiredFields.push({
							value: "- Hora de inicio"
						})
						break;
					}
				case "Timend":
					if (value !== null) {
						break;
					} else {
						aRequiredFields.push({
							value: "- Hora de fin"
						})
						break;
					}
				case "Descripcion":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Descripción del trabajo a realizar"
						})
						break;
					}
				case "Equnr":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Equipo Solicitado Cammesa"
						})
						break;
					}
				case "Estacional":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Estacional"
						})
						break;
					}
				case "Capex":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- CAPEX"
						})
						break;
					}
				case "Tplnr":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- E.T"
						})
						break;
					}
				case "Werks":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Región"
						})
						break;
					}
				case "Equstat":
					if (value !== "N") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Estado Equipo CAMMESA"
						})
						break;
					}
				case "Tipinterv":
					if (value === "") {
						aRequiredFields.push({
							value: "- Tipo de intervención"
						})
					}
					if (value === "ESTACIONAL") {
						if (oLicense.Perestac !== "") {
							break;
						} else {
							aRequiredFields.push({
								value: "- Periodo del Estacional / Estacional Pendiente"
							})
							break;
						}
						break;
					} else {
						break;
					}
				case "Arbpl":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Puesto de trabajo"
						})
						break;
					}
				case "Solicitante":
					if (value !== "" && value !== "00000000") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Solicitante"
						})
						break;
					}
				case "Equstatnocam":
					if (value !== "N") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Estado Equipo/s a intervenir"
						})
						break;
					}
				case "Jobcond":
					if (value === "" || value === "00") {
						aRequiredFields.push({
							value: "- Condiciones de trabajo"
						})
					}
					// if (value === "06")
					// 	aRequiredFields.push({
					// 		value: "- Descripcion de las Condiciones Especiales"
					// 	})
					if (value === '04' || value === '05') {
						if (oLicense.Bloqueorecierretxt === '') {
							aRequiredFields.push({
								value: "- Bloqueo de recierres (Sólo para TCT)"
							})
						}
						if (oLicense.Intnooperar === '') {
							aRequiredFields.push({
								value: "- Interruptores que no deben Operarse (sólo para TcT)"
							})
						}
						break;
					}
				// else {
				// 	break;
				// }
				case "Equiinterv":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Equipo/s a Intervenir"
						})
						break;
					}
				/*case "Barrafs":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Requiere alguna Barra F/S"
						})
						break;
					}
				*/
				case "Bloqueo":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Bloqueo de recierres"
						})
						break;
					}
				case "Rdisparo":
					if (value !== "" && value !== "N") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Riesgo de disparo"
						})
						break;
					}
				case "SolSuplente":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Solicitante suplente"
						})
						break;
					}
				case "Jefe":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Jefe de trabajo"
						})
						break;
					}
				case "JefeSuplente":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Jefe de trabajo suplente"
						})
						break;
					}
				case "Solictext":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Comentarios del solicitante / Descripcion de las Condiciones Especiales"
						})
						break;
					}
				case "Aro":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Coordinado con ARO"
						})
						break;
					}
				case "Senalafect":
					if (value === "" && oLicense.Senalninguna === "") {
						aRequiredFields.push({
							value: "- Especificar Señales Afectadas"
						})
						break;
					} else {
						break;
					}
				case "Precauciones":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Otras precauciones de seguridad"
						})
						break;
					}
				case "Tiemporep":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Tiempo de reposición"
						})
						break;
					}
				case "Fstensionret":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- LAT F/S con Tensión de Retorno"
						})
						break;
					}
				/*case "R500kv":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- Requiere calle de 500kV abierta"
						})
						break;
					}
				*/
				case "Fstensionret":
					if (value !== "") {
						break;
					} else {
						aRequiredFields.push({
							value: "- LAT F/S con Tensión de Retorno"
						})
						break;
					}
				case "Barrafstx":
					if (oLicense.Barrafs === "X" && value === "") {
						aRequiredFields.push({
							value: "- Especificar Barra"
						})
						break;
					} else {
						break;
					}
				default:
					return true
			}
		},

		InvalidPeriodicity: function () {
			var oModel = AppManagementHelper.getModel("LicenseJsonModel");
			var oSolbeg = oModel.getProperty("/Solbeg");
			var oSolend = oModel.getProperty("/Solend");
			var sPeriod = oModel.getProperty("/Period");
			if (oSolbeg && oSolend) {
				return oSolend.getTime() === oSolbeg.getTime() && sPeriod !== "D"
			}
			return true;
		},

		getLicenseRequiredFields: function () {
			var aRequiredFields = [];
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			for (let attribute in oLicense) {
				this.attributeIsValidForLicense(attribute, oLicense[attribute], aRequiredFields)
			}
			if (this.InvalidPeriodicity()) {
				aRequiredFields.push({
					value: "- Si la fecha de inicio y la fecha de fin de la licencia son iguales debe seleccionar periodicidad DIARIA."
				});
			}
			if (this.invalidSameYear()) {
				aRequiredFields.push({
					value: "- La fecha de inicio y la fecha de fin de la licencia deben ser del mismo año."
				});
			}
			//INI TRNS119
			if (oLicense.Period !== 'C' && (!oLicense["HorariosPorLicencia_nav"] || oLicense["HorariosPorLicencia_nav"].length <= 0)) {
				aRequiredFields.push({
					value: `- Deberá seleccionar el botón "Horarios Semana"`
				})
			}
			//FIN TRNS119
			return aRequiredFields;
		},

		invalidSameYear: function () {
			var oModel = AppManagementHelper.getModel("LicenseJsonModel");
			var oSolbeg = oModel.getProperty("/Solbeg");
			var oSolend = oModel.getProperty("/Solend");
			if (oSolbeg && oSolend) {
				return oSolbeg.getFullYear() !== oSolend.getFullYear();
			}
			return true;
		},

		getRequestRequiredFields: function () {
			var aRequiredFields = [];
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			for (let attribute in oLicense) {
				this.attributeIsValidForRequest(attribute, oLicense[attribute], aRequiredFields)
			}
			if (this.InvalidPeriodicity()) {
				aRequiredFields.push({
					value: "- Si la fecha de inicio y la fecha de fin de la solicitud son iguales debe seleccionar periodicidad DIARIA."
				});
			}
			if (this.invalidSameYear()) {
				aRequiredFields.push({
					value: "- La fecha de inicio y la fecha de fin de la solicitud deben ser del mismo año."
				});
			}
			return aRequiredFields;
		}

	};

});