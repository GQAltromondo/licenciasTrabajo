jQuery.sap.require("Transener/Operaciones/LicenciasTrabajo/libs/xlsx");
jQuery.sap.require("Transener/Operaciones/LicenciasTrabajo/libs/jszip");
sap.ui.define([
	//ui
	"sap/ui/core/mvc/Controller",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MailHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/ValidateHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/i18nTranslationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/DateHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/ExportLicenseHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/ModelHelper",
	//model
	"Transener/Operaciones/LicenciasTrabajo/model/HardCodeModel",
	"Transener/Operaciones/LicenciasTrabajo/model/models",
	//services
	"Transener/Operaciones/LicenciasTrabajo/services/LicenseService",
	"Transener/Operaciones/LicenciasTrabajo/services/RegionesService",
	"Transener/Operaciones/LicenciasTrabajo/services/PersonalHabilitadoService",
	"Transener/Operaciones/LicenciasTrabajo/services/WorkPlaceService",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/services/EmpresaTramitacionService",
	"Transener/Operaciones/LicenciasTrabajo/services/TipoEquipoService",
	"Transener/Operaciones/LicenciasTrabajo/services/EquiposService",
	"Transener/Operaciones/LicenciasTrabajo/services/OrdenesService",
	"Transener/Operaciones/LicenciasTrabajo/services/EstacionesService",
	"Transener/Operaciones/LicenciasTrabajo/services/JobCondService",
	"Transener/Operaciones/LicenciasTrabajo/services/EstadoTramitacionService",
	"Transener/Operaciones/LicenciasTrabajo/services/MotivoNoAutorizacionService",
	"Transener/Operaciones/LicenciasTrabajo/services/RepositionTimeService",
	"Transener/Operaciones/LicenciasTrabajo/services/TramitacionMasivaService",
	"Transener/Operaciones/LicenciasTrabajo/services/InterventionTypesService",
	"Transener/Operaciones/LicenciasTrabajo/services/TipoOfEstacionalListService",
	"Transener/Operaciones/LicenciasTrabajo/services/StatusService",
	"Transener/Operaciones/LicenciasTrabajo/services/GrupoPlanificadorService",
	"Transener/Operaciones/LicenciasTrabajo/services/ReportesService",
	"Transener/Operaciones/LicenciasTrabajo/utils/ReportesHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/LimitacionesTecnicas",
	//excel
	"Transener/Operaciones/LicenciasTrabajo/views/Main/ExcelDownloadHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/LicenceHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/RolAuthorizationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatterHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/LegacyValidationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/UnifilarHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/checkAlternativeLabelService",
	"Transener/Operaciones/LicenciasTrabajo/services/UserService"

], function (Controller, NavigationHelper, FormatHelper, FioriComponentHelper, MailHelper, ValidateHelper,
	MessageBoxHelper, i18nTranslationHelper, AppManagementHelper, DateHelper, ExportLicenseHelper, ModelHelper, HardCodeModel, models, LicenseService,
	RegionesService,
	PersonalHabilitadoService, WorkPlaceService,
	oDataService, EmpresaTramitacionService, TipoEquipoService, EquiposService, OrdenesService, EstacionesService, JobCondService, EstadoTramitacionService, MotivoNoAutorizacionService,
	RepositionTimeService, TramitacionMasivaService, InterventionTypesService, TipoOfEstacionalListService, StatusService, GrupoPlanificadorService, ReportesService,
	ReportesHelper, LimitacionesTecnicas,
	ExcelDownloadHelper, BusyDialogHelper, FioriHelper, LicenceHelper, RolAuthorizationHelper, FormatterHelper, LegacyValidationHelper,
	UnifilarHelper, checkAlternativeLabelService, UserService) {
	"use strict";

	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.Main.Main", {
		_url: "",
		validURLToLicense: null,
		_oLicenseTable: null,
		localFilters: {},

		fastSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oTableBindingItems = this.byId("auditTable").getBinding("items");
			oTableBindingItems.filter(LicenceHelper.getFastSearchFilters(sValue, this));
		},
		getVersion: function () {
			const sVersion = this.getOwnerComponent().getManifestEntry("/sap.app/applicationVersion/version");
			ModelHelper.getModel(this.getView(), "version").setData({ version: sVersion });
		},
		onInit: function () {

			var oRouter = AppManagementHelper.getAppRouter();
			AppManagementHelper.getModel("OrderNumberJsonModel").setData({
				Odering: "down"
			});
			this.validateCheckAlternativeLabel()
			AppManagementHelper.getModel("vistaSeleccionada");
			AppManagementHelper.getModel('vistaSeleccionada').setProperty("/vista", 0);
			oRouter.getRoute("Licencias").attachPatternMatched(this._routePatternMatched, this);
			HardCodeModel.getModel();
			AppManagementHelper.getModel("LocalFilterJsonModel"); //this creates the model
			AppManagementHelper.getModel("filtrosAplicadosTextVisibleModel");
			AppManagementHelper.getModel("filtrosAplicadosTextVisibleModel").setData({
				Data: false
			});
			AppManagementHelper.getModel("EnabledFilterLicstat").setData({
				enabled: true
			});

			AppManagementHelper.getModel("ColorModel").setProperty("/Color", "white");
			AppManagementHelper.getModel("CheckAdvancedFiltersModel").setData({
				Aro: false,
				Bloqueo: false,
				Rdisparo: false,


			});

			oDataService.getModel("SelectModel")
			this.getVersion()
		},
		loadPuestosTrabajo: async function (empresa) {
			let aPuestosTrabajo = await LicenseService.getPuestosTrabajo(empresa)
			return aPuestosTrabajo;
		},


		_onHomeRouteMatched: function () {
			var oRouter = AppManagementHelper.getAppRouter();

			sap.ui.core.mvc.View.create({
				viewName: "Transener.Operaciones.LicenciasTrabajo.views.Main.Gantt.Gantt",
				type: sap.ui.core.mvc.ViewType.XML
			}).then(function (oView) {
				console.log("Vista precargada en segundo plano:", oView.getId());
				// Puedes agregar más lógica aquí si necesitas preparar la vista.
			}).catch(function (err) {
				console.error("Error al precargar la vista:", err);
			});
		},

		cleanLicstatFilterProperties: function () {
			var oBackupLocalFilters = $.extend({}, AppManagementHelper.getModel("LocalFilterJsonModel").getData());

			var oSolbeg = oBackupLocalFilters.Solbeg ? oBackupLocalFilters.Solbeg : new Date(new Date().setDate(new Date().getDate() - 7));
			AppManagementHelper.getModel("LocalFilterJsonModel").setProperty("/Solbeg", oSolbeg);
			var oSolend = oBackupLocalFilters.Solend ? oBackupLocalFilters.Solend : new Date(new Date().setDate(new Date().getDate() + 7));
			AppManagementHelper.getModel("LocalFilterJsonModel").setProperty("/Solend", oSolend);

			var oFiltermodel = AppManagementHelper.getModel("FiltersJsonModel");
			var oFilterModelData = oFiltermodel.getData();
			var oBackup = $.extend({}, true, oFilterModelData);

			var sPath = FioriHelper.getAppPath();
			oFiltermodel.loadData(sPath + "model/FiltersJsonModel.json", "", false);
			oFiltermodel.setProperty("/Licstat", oBackup.Licstat);
			oFiltermodel.setProperty("/Tplnr", oBackup.Tplnr);
			oFiltermodel.setProperty("/Equstat", oBackup.Equstat);
			oFiltermodel.setProperty("/Werks", oBackup.Werks)
		},

		blockFilters: function () {
			var aLicstatData = AppManagementHelper.getModel("FiltersJsonModel").getData().Licstat.value;
			if (aLicstatData.length > 0) {
				this.cleanLicstatFilterProperties();
				AppManagementHelper.getModel("EnabledFilterLicstat").setData({
					enabled: false
				});
			} else {
				AppManagementHelper.getModel("EnabledFilterLicstat").setData({
					enabled: true
				});
			}
		},

		cleanLicenceInformation: function () {
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/HorariosPorLicencia_nav", []);
			AppManagementHelper.getModel("TransferListJsonModel").setData({
				Transfers: []
			});
			AppManagementHelper.getModel("CoordinationTableJsonModel").setData({
				Coordinations: []
			});
			AppManagementHelper.getModel("ObservationTableJsonModel").setData({
				Observations: []
			});
			AppManagementHelper.getModel("DeliveryTableJsonModel").setData({
				Deliveries: []
			});
			AppManagementHelper.getModel("DevolutionTableJsonModel").setData({
				Devolutions: []
			});
			AppManagementHelper.getModel("SuspensionTableJsonModel").setData({
				Suspensions: []
			});
			AppManagementHelper.getModel("ReanudationTableJsonModel").setData({
				Reanudations: []
			});
		},
		validateCheckAlternativeLabel: function () {
			var aRoles = AppManagementHelper.getModel("UserJsonModel").getData().roles;
			if (!this._oAlternativeLabelProm) {
				this._oAlternativeLabelProm = checkAlternativeLabelService.getPromise();
			}

			this._oAlternativeLabelProm
				.then((oData) => {

					if (!oData.results || oData.results.length === 0) {
						return;
					}

					var oResult = oData.results[0];

					this.getView().setModel(new sap.ui.model.json.JSONModel(oResult), "AlternativeLabel");

					if (oResult.Status === "ER") {

						setTimeout(() => {
							sap.m.MessageBox.alert(oResult.Mensaje, {
								onClose: () => {

									if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
										var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
										oCrossAppNavigator.toExternal({ target: { semanticObject: "#" } });
									}
								}
							});
						}, 100);
						return;
					}
				})
				.catch((error) => {
					sap.m.MessageBox.error("Error al obtener información de Alternative Label. Intente nuevamente.");
				});
		},
		_routePatternMatched: function (oEvent) {
			var oArgs = oEvent?.getParameter("arguments") || {};
			var sKey = oArgs.url || ""; // Si no hay URL, asignamos una cadena vacía

			var aRoles = AppManagementHelper.getModel("UserJsonModel").getData().roles;

			if (aRoles.includes("ope_visualizador")) {
				this._handleValidUser(sKey);
				return;
			}

			if (!this._oAlternativeLabelProm) {
				this._oAlternativeLabelProm = checkAlternativeLabelService.getPromise();
			}

			this._oAlternativeLabelProm
				.then((oData) => {

					if (!oData.results || oData.results.length === 0) {
						return;
					}

					var oResult = oData.results[0];

					this.getView().setModel(new sap.ui.model.json.JSONModel(oResult), "AlternativeLabel");

					if (oResult.Status === "ER") {

						setTimeout(() => {
							sap.m.MessageBox.alert(oResult.Mensaje, {
								onClose: () => {

									if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
										var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
										oCrossAppNavigator.toExternal({ target: { semanticObject: "#" } });
									}
								}
							});
						}, 100);
						return;
					}

					this._handleValidUser(sKey);
				})
				.catch((error) => {
					sap.m.MessageBox.error("Error al obtener información de Alternative Label. Intente nuevamente.");
				});
		},

		_handleValidUser: function (sKey) {

			this.cleanLicenceInformation();
			this.validURLToLicense = LicenceHelper.validURLToLicense(sKey);

			if (this.validURLToLicense) {
				this._url = sKey;
			}

			var refreshSearch = AppManagementHelper.getModel("refreshSearch").getData().data;
			if (refreshSearch) {
				this.makeFilters(0);
			}
		}
		,


		/******************************************************formatting*****************************************************/
		formatCurrency: function (amount, currencyKey) {
			return FormatHelper.formatCurrency(amount, currencyKey);
		},

		formatDateTime: function (dDate, iTime) {
			if (!(dDate instanceof Date) || !(iTime instanceof Date)) return "";
			if (dDate !== null && iTime) {
				var date = FormatHelper.formatDate(dDate);
				var time = FormatHelper.getTimeStringWithoutUTC(iTime.getTime());
				return date + " " + time;
			}
		},

		/******************************************************search*****************************************************/
		onSearch: function (oEvent) {
			var sSearchId = oEvent.getParameter("value");
			var oLicenseTableItems = this.getLicenseTable().getBinding("items");
			var aFilter = [];

			aFilter.push(new sap.ui.model.Filter("Idlicencia", sap.ui.model.FilterOperator.Contains, sSearchId));
			aFilter.push(new sap.ui.model.Filter("Idsolicitud", sap.ui.model.FilterOperator.Contains, sSearchId));

			var oFilter = new sap.ui.model.Filter({
				filters: aFilter,
				and: false
			});

			oLicenseTableItems.filter(oFilter);
		},

		formatTime: function (dDate) {
			if (dDate) {
				var sDate = FormatHelper.getTimeStringWithoutUTC(dDate.getTime());
				return sDate;
			}
			return "";
		},

		formatTimes: function (iTime) {
			if (iTime && iTime > 0) {
				var sTime = FormatHelper.getTimeString(iTime);
				return sTime;
			}
		},

		formatTimeWithoutUtc: function (iTime) {
			if (iTime && iTime > 0) {
				var sTime = FormatHelper.getTimeStringWithoutUTC(iTime);
				return sTime;
			}
		},

		onDownloadReport: function () {
			//do nothing
			return 1;
		},

		test: function () {
			var pageName = "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.RequestLicense";
			var component = FioriComponentHelper.getComponent();
			var view = component.byId("App").byId(pageName);
			var oLicenseJsonModel = models.createLicenseJsonModel();
			oLicenseJsonModel.setProperty("/Gdate", new Date());
			var oSelectModel = AppManagementHelper.getModel("SelectModel");
			var oEnableControlsJsonModel = AppManagementHelper.getModel("DisableControlsJsonModel");
			oEnableControlsJsonModel.setProperty("/enabledTechLoc", false);
			oEnableControlsJsonModel.setProperty("/enabledEquipment", false);
			oEnableControlsJsonModel.setProperty("/enabled", true);
			oEnableControlsJsonModel.setProperty("/visibleAnulacion", false);
			if (!view) {
				//creates view
				var viewId = component.byId("App").createId(pageName);
				view = sap.ui.jsview(viewId, pageName);
				//adds view to split app
				//create model?	
				var oDialog = new sap.m.Dialog({
					title: "Solicitud de Trabajo",
					contentWidth: "90%",
					modal: true,
					content: view,
					isLicenseGenerated: false,
					buttons: [
						new sap.m.Button({
							text: "Cancelar",
							icon: "sap-icon://decline",
							press: [this.closeRequestDialog, this]
						}).addStyleClass("buttonInverted floatLeft"),
						new sap.m.Button({
							text: "Limpiar",
							icon: "sap-icon://document",
							press: [this.clearRequestDialog, this]
						}).addStyleClass("buttonInverted floatLeft"),
						new sap.m.Button({
							text: "Envíar",
							icon: "sap-icon://complete",
							press: [this.freeRequestDialog, this]
						}).addStyleClass("buttonInverted floatRight")
					]
				}).addStyleClass("customDialog");
				oDialog.setModel(oLicenseJsonModel, "LicenseJsonModel");
				oDialog.setModel(oSelectModel, "SelectModel");
				oDialog.setModel(oEnableControlsJsonModel, "DisableControlsJsonModel");
				oDialog.open();
				this.requestDialog = oDialog;
				if (oDialog) {
					return true;
				}
			} else {
				if (this.requestDialog) {
					this.requestDialog.setModel(oLicenseJsonModel, "LicenseJsonModel");
					this.requestDialog.setModel(oSelectModel, "SelectModel");
					this.requestDialog.setModel(oEnableControlsJsonModel, "DisableControlsJsonModel");
					this.requestDialog.open();
					return true;
				}
			}
		},

		handleComments: function (oLicense) {
			//TAMBIEN VALIDAR PARA LO DE TRANSBA TODO
			var sValue = "";
			if (oLicense.R500kv !== "N") {
				var sRequiereBarra = " Requiere calle 500 kV abierta: Si, ";
				sValue = sValue + sRequiereBarra;
			}
			if (oLicense.Bloqueo !== "N") {
				var sBloqueo = " Bloqueo de recierre: Si," + " ";
				sValue = sValue + sBloqueo;
			}
			if (oLicense.Barrafs !== "N") {
				var sBarra = " Requiere Barra F/S: Si, Barra Especificada: " + oLicense.Barrafstx + " ";
				sValue = sValue + sBarra;
			}
			var date = FormatHelper.formatDate(oLicense.Solend);
			sValue = sValue + " Equipo a Intervenir: " + oLicense.Equiinterv + " ";
			sValue = sValue + " Trabajo a realizar " + oLicense.Descripcion + " ";
			sValue = sValue + " Finaliza:" + date + "LT Nº " + oLicense.Id + " ";

			oLicense.Comments = sValue;

		},

		getLicenseButtonText: function (sTipoLic, sLicStat) {
			return ((sTipoLic === "N" || sTipoLic === "EM" || sTipoLic === "TE") && sLicStat === "02") ? "Enviar a tramitar." :
				"Guardar Cambios"
		},

		goToEdit: function (oEvent, bManualPress) {
			LegacyValidationHelper.createLegacyComboStateModel();
			BusyDialogHelper.open();
			var oFilterSelectionModel = AppManagementHelper.getModel("FilterSelectionJsonModel");
			//var oDeliveryModel = AppManagementHelper.getModel("DeliveryTableJsonModel");
			var oDisableControlsJsonModel = AppManagementHelper.getModel("DisableControlsJsonModel");
			oDisableControlsJsonModel.setProperty("/DaysDeleteVisible", false);
			oFilterSelectionModel.setProperty("/textFlowSol", "Guardar Cambios");
			oFilterSelectionModel.setProperty("/visible", true);

			var oItem = bManualPress ? oEvent : oEvent.getSource().getParent();
			var oLicense = $.extend(true, {}, bManualPress ? oItem : oItem.getBindingContext("LicencesListJsonModel").getObject());

			oFilterSelectionModel.setProperty("/textFlow", this.getLicenseButtonText(oLicense.Tipolicencia, oLicense.Licstat));
			oFilterSelectionModel.setProperty("/annulateCreatedStatus", !!oLicense.Id);
			var isLicense = oLicense.Tipo === "L";
			var isNotAnulate = oLicense.Licstat !== "03";
			let visibleTabs = oLicense.Licstat !== "30";
			let oLicenseTipeOfLicense = oLicense.Licstat;
			//TODO sacar el tabVisibility y usar el rolauthorization helper
			oDisableControlsJsonModel.setProperty("/tabVisibility", visibleTabs);
			if (oLicenseTipeOfLicense === "07" || oLicenseTipeOfLicense === "30") {
				oDisableControlsJsonModel.setProperty("/weekChanger", false);
			} else {
				oDisableControlsJsonModel.setProperty("/weekChanger", true);
			}

			if (isLicense) {
				oDisableControlsJsonModel.setProperty("/visibleLic", true);
				oDisableControlsJsonModel.setProperty("/visibleSol", false);
			} else {
				oDisableControlsJsonModel.setProperty("/visibleLic", true);
				oDisableControlsJsonModel.setProperty("/visibleSol", true);
				oFilterSelectionModel.setProperty("/textFlow", "Crear Licencia");
			}
			if (oLicense.AttachmentXLicencia_nav.length > 0) {
				oFilterSelectionModel.setProperty("/visibleFiles", true);
			} else {
				oFilterSelectionModel.setProperty("/visibleFiles", false);
			}

			if (oLicense.Period === "D") { //Esto hace que al entrar a la licencia, se fija si es Diaria/Continua y determina habilitar o no el boton de "Horarios Semana"
				oDisableControlsJsonModel.setProperty("/HorariosSemanaEnabled", true);
			} else if (oLicense.Period === "C") {
				oDisableControlsJsonModel.setProperty("/HorariosSemanaEnabled", false);
			}

			AppManagementHelper.setNavigationProperties(oLicense);

			LicenceHelper.generatePlacementRemoval(oLicense);
			LicenceHelper.generateTurno(oLicense);
			LicenceHelper.generateInhibicionHabilitacion(oLicense);
			LicenceHelper.generateDeliveryDevolution(oLicense);

			this.findEstacionCode(oLicense.Tplnr);
			this.loadCatalogData(oLicense.Werks).then((oCatalogData) => {
				AppManagementHelper.getModel("PuestoTrabajoJsonModel");
				AppManagementHelper.getModel("PuestoTrabajoJsonModel").setData({
					PuestosTrabajo: oCatalogData.PuestosTrabajo
				});
			}).catch((e) => {
				console.log(e)
			});
			EstacionesService.filterPorRegion(oLicense.Werks || "");
			LicenseService.getCammesaComments(oLicense);
			this.findOrden(oLicense.Empresa, oLicense.Werks);

			var sLicenseUrl = FormatterHelper.getLicenseUrl(oLicense);
			LicenceHelper.generateDeliveryDevolution(oLicense);
			LicenceHelper.generatePlacementRemoval(oLicense);
			LicenceHelper.generateTurno(oLicense);
			LicenceHelper.generateInhibicionHabilitacion(oLicense);
			if (this.isProgrammerRol(oLicense.Licstat)) {
				oDisableControlsJsonModel.setProperty("/enabledForProgrammer", false);
			} else {
				oDisableControlsJsonModel.setProperty("/enabledForProgrammer", true);
			}

			if (isLicense) {
				localStorage.setItem("type", "Licencia");
				AppManagementHelper.getAppRouter().navTo("Licencia", {
					id: sLicenseUrl
				});
			} else {
				localStorage.setItem("type", "Solicitud");
				AppManagementHelper.getAppRouter().navTo("Solicitud", {
					id: sLicenseUrl
				});
			}

		},

		isProgrammerRol: function (sLicstat) {
			var aUserRoles = AppManagementHelper.getModel("UserJsonModel").getData().roles;
			var aInvalidRolesForEdit = ["ope_programacion_cot", "ope_programacion_cotdt", "Programacion_COT", "Programacion_COTDT"];

			return aUserRoles.some(r => aInvalidRolesForEdit.includes(r)) && sLicstat === "30";
			// //FIX GQ
			// var aValidRolesForEdit = ["ope_solic-lic_transba","Solicitante_Lic","ope_solic-lic_transener"];
			//  return aUserRoles.some(r => aValidRolesForEdit.includes(r)) && (sLicstat === "30" || sLicstat === "02");
		},

		findEstacionCode: function (Tplnr) {
			oDataService.getModel("SelectModel").read("/EstacionesSet", {
				success: function (data) {
					var oData = data.results.find(function (e) {
						return e.Codigo === Tplnr;
					})
					EquiposService.loadEquipos(oData.Estacion);
				},
				error: function (error) {
					console.log("error");
				}
			});

		},

		findOrden: function (empresa, region) {
			OrdenesService.loadOrdenes(empresa, region);
		},

		handleViewType: function (oEvent) {
			var sType = oEvent.getSource().getCustomData()[0].getValue();
			var oLicense = {};
			if (sType === "S") {
				localStorage.setItem("type", "Solicitud");
				this.goToRequest(oLicense);
			} else {
				localStorage.setItem("type", "Licencia");
				this.goToLicense(oLicense);
			}
		},

		goToRequest: function (oLicense) {
			this.handleLicenseInformation(oLicense);
			AppManagementHelper.getAppRouter().navTo("Solicitud", {
				id: "CREACION"
			});
		},

		goToLicense: function (oLicense) {
			this.handleLicenseInformation(oLicense);
			AppManagementHelper.getAppRouter().navTo("Licencia", {
				id: "CREACION"
			});
		},

		handleLicenseInformation: function (oLicense) {
			LegacyValidationHelper.createLegacyComboStateModel();
			var oModelPermisos = AppManagementHelper.getModel("PermisosJsonModel");
			var oDisableControlsJsonModel = AppManagementHelper.getModel("DisableControlsJsonModel");
			var oUserModel = AppManagementHelper.getModel("UserJsonModel");
			var aUserRoles = oUserModel.getProperty("/roles");

			oDisableControlsJsonModel.setProperty("/DaysDeleteVisible", true);
			oDisableControlsJsonModel.setProperty("/visibleLic", true);
			oDisableControlsJsonModel.setProperty("/visibleSol", true);
			oDisableControlsJsonModel.setProperty("/visibleAnulacion", false);

			var oEnableControlsJsonModel = AppManagementHelper.getModel("DisableControlsJsonModel");
			oEnableControlsJsonModel.setProperty("/enabledTechLoc", false);
			oEnableControlsJsonModel.setProperty("/enabledEquipment", false);
			oEnableControlsJsonModel.setProperty("/enabled", true);
			oEnableControlsJsonModel.setProperty("/tabVisibility", false);
			oEnableControlsJsonModel.setProperty("/enabledForProgrammer", true);
			oEnableControlsJsonModel.setProperty("/HorariosSemanaEnabled", oLicense.Period === "D");
			//oLicense.Period = "D" ? oDisableControlsJsonModel.setProperty("/HorariosSemanaEnabled", true) : oDisableControlsJsonModel.setProperty("/HorariosSemanaEnabled", false);
			oModelPermisos.setProperty("/UsuarioEncontrado", true);

			var sTxtFlox = "Crear Licencia";
			if (aUserRoles.includes("ope_solic-lic_transener") || aUserRoles.includes("Solicitante_Lic_S") || aUserRoles.includes(
				"ope_solic-lic_transba") || aUserRoles.includes("Solicitante_Lic_TBA")) {
				sTxtFlox = "Crear Borrador de Licencia";
			}
			AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/textFlow", sTxtFlox);

			AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/textFlowSol", "Crear Solicitud");
			AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/enabledComboEQUIPO", false);
			var sPath = FioriHelper.getAppPath();
			AppManagementHelper.getModel("LicenseJsonModel").loadData(sPath + "model/LicenseJsonModel.json", "", false);

			//TODO NUEVOOJO
			var sIdUnifilar = new Date().valueOf().toString(36) + Math.random().toString(36).substr(2);
			var sFormatted = sIdUnifilar.substr(1, 18)
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Idunifilar", sFormatted);
			var empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Empresa", empresa);
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Anio", new Date().getFullYear() + "");

			var sWerks = AppManagementHelper.getModel("CurrentUser").getData().Region;

			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Werks", sWerks);
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Gdate", new Date());
			AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/visible", false);
			AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/enabledEspecifyBarra", false);
			AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/annulateCreatedStatus", !!oLicense.Id);


			// Issue #518 -> Set Tipo de Licencia por defecto según rol.
			//var bJefeTurnoCOT = aUserRoles.find(sRol => sRol === "Jefe_Turno_COT" || sRol === "Jefe_Turno_COTDT");
			var bJefeTurnoCOT = aUserRoles.find(sRol => sRol === "ope_jefe_turno_cot" || sRol === "ope_jefe_turno_cotdt");

			//var bOperador = aUserRoles.find(sRol => sRol === "Operador_COT" || sRol === "Operador_COTDT");
			var bOperador = aUserRoles.find(sRol => sRol === "ope_oper-turno_cot" || sRol === "ope_oper-turno_cotdt");
			if (bJefeTurnoCOT || bOperador) {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Tipolicencia", "EM");
			}

			//var bProgramacion = aUserRoles.find(sRol => sRol === "Programacion_COT" || sRol === "Programacion_COTDT");
			var bProgramacion = aUserRoles.find(sRol => sRol === "ope_programacion_cot" || sRol === "ope_programacion_cotdt");

			if (bProgramacion) {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Tipolicencia", "TE");
			}

			//var bSolicitanteLicTBA = aUserRoles.find(sRol => sRol === "Solicitante_Lic_TBA");
			var bSolicitanteLicTBA = aUserRoles.find(sRol => sRol === "ope_solic-lic_transba");

			if (bSolicitanteLicTBA) {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Tipolicencia", "N");
			}
		},

		duplicateLicense: function (evt) {
			BusyDialogHelper.open();
			var oItem = evt.getSource().getParent();
			let oldLicense = oItem.getBindingContext("LicencesListJsonModel").getObject();
			LicenseService.getPromise(oldLicense, "HorariosPorLicencia_nav").then(license => {
				if (oldLicense.Tipo === "L") {
					localStorage.setItem("type", "Licencia");
					this.goToLicense(oldLicense);
				} else {
					localStorage.setItem("type", "Solicitud");
					this.goToRequest(oldLicense);
				}

				this.findEstacionCode(oldLicense.Tplnr);
				EstacionesService.filterPorRegion(oldLicense.Werks || "");
				let copy = AppManagementHelper.getModel("LicenseJsonModel").getData();
				let propertiesToCopy = ["Solbeg", "Solend", "Timbeg", "Timend", "Period", "Arbpl", "Solicitante",
					"Equstatnocam", "Jobcond", "Tplnr", "Equstat", "Equnr", "Tiemporep", "R500kv", "Barrafs",
					"Barrafstx", "Bloqueo", "Werks", "SolSuplente", "Jefe", "JefeSuplente", "Tipinterv", "Perestac",
					"Descripcion", "Solictext", "Aro", "Sindivi", "Senalninguna", "Precaucionesok", "Senalestados",
					"Senalalarmas", "Senalmedicion", "Senalafect", "Fstensionret", "Intnooperar", "Precauciones", "Rdisparo", "Equiinterv",
					"Aufnr", "Bloqueorecierretxt", "Tipolicencia", "Estacional", "Capex", "SolSuplenteAux", "TipoHabJefe", "TipoHabJefeSup", "IdHabJefe", "IdHabJefeSup"
				];
				propertiesToCopy.forEach(prop => {
					copy[prop] = oldLicense[prop];
				});
				// Time

				copy.TipoHabJefe = ""
				copy.TipoHabJefeSup = ""
				copy.Jefe = ""
				copy.JefeSuplente = ""
				copy.IdHabJefe = ""
				copy.IdHabJefeSup = ""
				copy.Aufnr = ""

				copy.Timbeg = new Date(copy.Timbeg);
				copy.Timbeg = new Date(copy.Timbeg.getTime() + copy.Timbeg.getTimezoneOffset() * 60 * 1000);
				copy.Timend = new Date(copy.Timend);
				copy.Timend = new Date(copy.Timend.getTime() + copy.Timend.getTimezoneOffset() * 60 * 1000);
				// Date
				copy.Solbeg = new Date(copy.Solbeg.getTime() + copy.Solbeg.getTimezoneOffset() * 60 * 1000);
				copy.Solend = new Date(copy.Solend.getTime() + copy.Solend.getTimezoneOffset() * 60 * 1000);

				// Set period radio button
				AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/enabled", copy.Period === "D");

				EstacionesService.filterPorRegion(copy.Werks);
				WorkPlaceService.filterWorkPlacesByRegion(copy.Werks);

				let empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
				var aFilter = [
					new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, empresa),
					new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.EQ, copy.Werks)
				];

				OrdenesService.loadOrdenes(empresa, copy.Werks, () => {
					AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/enabledEspecifyBarra", copy.Barrafs !== "N");
					AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/annulateCreatedStatus", false);
					copy.Barrafstx = copy.Barrafs !== "N" ? copy.Barrafstx : "";
					if (license.Rdisparo === "") copy.Rdisparo = "Y";
					//if (license.Equstat === "") copy.Equstat = "Y";
					//TODO VER?
					if (copy.Equstat === "Y")
						copy.Rdisparo = "Y";

					var sIdUnifilar = new Date().valueOf().toString(36) + Math.random().toString(36).substr(2);
					var sFormatted = sIdUnifilar.substr(1, 18);
					copy.Idunifilar = sFormatted;
					AppManagementHelper.getModel("LicenseJsonModel").setData(copy);
					license.HorariosPorLicencia_nav = license.HorariosPorLicencia_nav.results;
					var horarios = license.HorariosPorLicencia_nav;
					var miliSecondsOffset = new Date().getTimezoneOffset() * 60 * 1000; //offset en segundos
					horarios.forEach(function (dia) {
						dia.Fecha = new Date(dia.Fecha.getTime() + miliSecondsOffset);
						// hora inicio
						var dateFormattedInit = new Date(dia.Horainicio.ms);
						var dateInit = new Date(dateFormattedInit.getTime() + dateFormattedInit.getTimezoneOffset() * 60 * 1000);
						dia.Horainicio = dateInit;
						// hora fin
						var dateFormattedFin = new Date(dia.Horafin.ms);
						var dateFin = new Date(dateFormattedFin.getTime() + dateFormattedFin.getTimezoneOffset() * 60 * 1000);
						dia.Horafin = dateFin;
					});

					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/HorariosPorLicencia_nav", license.HorariosPorLicencia_nav);

					this.loadCatalogData(oldLicense.Werks).then((oCatalogData) => {
						AppManagementHelper.getModel("PuestoTrabajoJsonModel");
						AppManagementHelper.getModel("PuestoTrabajoJsonModel").setData({
							PuestosTrabajo: oCatalogData.PuestosTrabajo
						});
					}).catch((e) => {
						console.log(e)
					});

					//PROCESO DUP UNIFILAR
					if (oldLicense.Tipo === "L") {
						LicenseService.getUnifilarCount(oldLicense).then((iCount) => {
							BusyDialogHelper.open("", "Duplicando unifilares...");
							if (iCount > 0) {
								LicenseService.getUnifilares(oldLicense, (data) => {
									let aUnifilarestoGetVersion = [];
									var aUnifilares = data.results;
									for (let oUnifilar of aUnifilares) {
										aUnifilarestoGetVersion.push(LicenseService.getUnifilarVersion(oUnifilar))
									}
									Promise.all(aUnifilarestoGetVersion).then((aData) => {
										//aUnifilares los viejos y aVersionesActuales son los unifilares actuales
										let aVersionesActuales = this.getVersionesActualesArray(aData);
										let aUnifilarDataToHandle = this.validateUnifilarVersions(aUnifilares, aVersionesActuales);
										var sNewId = copy.Idunifilar;
										this.handleRecursiveUnifilarCreation(sNewId, aUnifilarDataToHandle, []);
									}).catch((e) => {
										BusyDialogHelper.close();
										MessageBoxHelper.showAlert("Alerta", "Error al obtener unifilares")
									})
								}, () => {
									MessageBoxHelper.showAlert("Alerta", "Error al obtener unifilares")
								}, {
									"$select": "Nombre,Idunifilar,NumVersion,Region,TipoUnifilar,Et,Empresa,Anio,Region,IntAbLe,SecAbBt,SecPatCr,PatAdic,Numerolicencia,Mapa,Doctype,Imagenunifilar,RealIdUnifilar"
								})
							} else {
								BusyDialogHelper.close();
							}
						}).catch((e) => {
							BusyDialogHelper.close();
							MessageBoxHelper.showAlert("Alerta", "Error al obtener contador unifilar")
						})
					} else {
						BusyDialogHelper.close();
					}
				});
			}, err => {
				BusyDialogHelper.close();
				sap.m.MessageBox.alert("No se ha podido cargar la licencia a clonar.", {
					title: "Error al clonar"
				});
			});

		},

		getTipo: function (tipo) {
			if (tipo === "P") {
				return "Potencia";
			}
			if (tipo === "S") {
				return "Servicios Auxiliares"
			}
			if (tipo === "O") {
				return "Otro"
			}
			return ""
		},
		getRegiones: function (value) {
			if (value === '103' || value === '113') {
				return 'Norte'
			} else if (value === '102') {
				return 'Reg. Metropolitana'
			} else if (value === '104' || value === '114') {
				return 'Sur'
			}
		},

		handleRecursiveUnifilarCreation: function (sId, aUnifilares, aMessages) {
			let oUnifilarObject = aUnifilares.shift();
			if (oUnifilarObject) {
				let oData = oUnifilarObject.data;
				let bValidToCreate = oUnifilarObject.create;
				if (bValidToCreate) {
					//obtener los navigation.
					let aPromiseNavigations = [];
					aPromiseNavigations.push(LicenseService.getIndividualUnifilar(oData.Anio, oData.Empresa, oData.Idunifilar, oData.Numerolicencia,
						"/marcadores_nav"));
					aPromiseNavigations.push(LicenseService.getIndividualUnifilar(oData.Anio, oData.Empresa, oData.Idunifilar, oData.Numerolicencia,
						"/marcadoresnorel_nav"));
					Promise.all(aPromiseNavigations).then((aData) => {
						//_.omit para borrar properties 
						oData.marcadores_nav = aData[0] ? aData[0].results ? aData[0].results : [] : [];
						oData.marcadores_nav.forEach(e => {
							e.Numerolicencia = sId
						});
						oData.marcadoresnorel_nav = aData[1] ? aData[1].results ? aData[1].results : [] : [];
						oData.marcadoresnorel_nav.forEach(e => {
							e.Numerolicencia = sId
						});
						oData.areasseguras_nav = [];
						oData.Numerolicencia = sId;
						LicenseService.createUnifilar(oData).then((data) => {
							aMessages.push({
								EsquemaUnifilar: `Esquema Unifilar: ${this.getTipo(oData.TipoUnifilar)} / ${oData.Et} - ${oData.Nombre} / ${this.getRegiones(oData.Region)}`,
								Text: "Creado Exitosamente",
							});
							this.handleRecursiveUnifilarCreation(sId, aUnifilares, aMessages)
						}).catch(() => {
							aMessages.push({
								EsquemaUnifilar: `Esquema Unifilar: ${this.getTipo(oData.TipoUnifilar)} / ${oData.Et} - ${oData.Nombre} / ${this.getRegiones(oData.Region)}`,
								Text: "Se Produjo un error de servicio al crear",
							});
							this.handleRecursiveUnifilarCreation(sId, aUnifilares, aMessages)
						})
					}).catch(() => {
						this.handleRecursiveUnifilarCreation(sId, aUnifilares, aMessages);
					})
				} else {
					aMessages.push({
						EsquemaUnifilar: `Esquema Unifilar: ${this.getTipo(oData.TipoUnifilar)} / ${oData.Et} - ${oData.Nombre} / ${this.getRegiones(oData.Region)}`,
						Text: "Versiones diferentes, NO CREADO",
					});
					this.handleRecursiveUnifilarCreation(sId, aUnifilares, aMessages);
				}
			} else {
				BusyDialogHelper.close();
				AppManagementHelper.getModel("TextUnifilarCreationJsonModel");
				AppManagementHelper.getModel("TextUnifilarCreationJsonModel").setData({
					Messages: aMessages
				});
				var oDialog = this.getDialogMessages();
				oDialog.open();
			}
		},

		getDialogMessages: function () {
			var oDialog = new sap.m.Dialog({
				afterClose: (oEvent) => {
					UnifilarHelper.refreshUnifilar();
					oEvent.getSource().close();
					oEvent.getSource().destroy(true);
				},
				title: "Alerta",
				contentWidth: "30%",
				modal: true,
				content: [
					new sap.m.VBox({
						items: {
							path: "TextUnifilarCreationJsonModel>/Messages",
							template: new sap.m.VBox({
								items: [
									new sap.m.Text({
										text: "{TextUnifilarCreationJsonModel>EsquemaUnifilar}"
									}).addStyleClass("sapUiTinyMarginBottom"),
									new sap.m.Text({
										text: "{TextUnifilarCreationJsonModel>Text}"
									})
								]
							}).addStyleClass("sapUiSmallMarginTopBottom")
						}
					}).addStyleClass("sapUiTinyMarginBeginEnd")
				],
				buttons: [
					new sap.m.Button({
						text: "Cerrar",
						icon: "sap-icon://decline",
						press: (oEvent) => {
							UnifilarHelper.refreshUnifilar();
							oEvent.getSource().getParent().close();
							oEvent.getSource().getParent().destroy(true);
						}
					}).addStyleClass("buttonInverted floatLeft")
				]
			});
			oDialog.setModel(AppManagementHelper.getModel("TextUnifilarCreationJsonModel"), "TextUnifilarCreationJsonModel")
			return oDialog
		},

		validateUnifilarVersions: function (aUnifilaresFromOldLicense, aActualVersions) {
			let aUnifilaresToCreate = [];
			for (let oUnifilarFromOldLicense of aUnifilaresFromOldLicense) {
				let oUnifilarNewVersion = aActualVersions.find(e => e.Centro === oUnifilarFromOldLicense.Region && e.Et ===
					oUnifilarFromOldLicense.Et && e.TipoUnifilar === oUnifilarFromOldLicense.TipoUnifilar)
				if (oUnifilarNewVersion) {
					if (oUnifilarFromOldLicense.NumVersion !== oUnifilarNewVersion.NumVersion) {
						//GQ PROBLEMA CON DUPLICAR UNIFILARES 22/10
						oUnifilarFromOldLicense.RealIdUnifilar = oUnifilarNewVersion.IdUnifilar
						aUnifilaresToCreate.push({
							data: oUnifilarFromOldLicense,
							create: false
						})
					} else {
						aUnifilaresToCreate.push({
							data: oUnifilarFromOldLicense,
							create: true
						})
					}
				}
			}
			return aUnifilaresToCreate;

		},

		getVersionesActualesArray: function (aData) {
			let aNewVersions = [];
			for (let oData of aData) {
				let aUnifilares = oData.results;
				let oVersion = aUnifilares[0]
				if (oVersion) {
					aNewVersions.push(oVersion);
				}
			}
			return aNewVersions;
		},

		freeRequestDialog: function () {
			this.requestDialog.close();
			LicenseService.POST();
		},

		closeRequestDialog: function () {
			this.requestDialog.close();
		},

		saveRequestDialog: function () {
			this.requestDialog.close();
		},

		clearRequestDialog: function () {
			AppManagementHelper.getModel("LicenseJsonModel").loadData("model/LicenseJsonModel.json", "", false);
		},

		handleItemPress: function (oEvent) {
			AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/busyData", true);
			LicenseService.FIND(oEvent.getParameter("listItem").getBindingContext("LicencesListJsonModel").getObject());
			/*var aItemDays = oEvent.getParameter("listItem").getBindingContext("LicencesListJsonModel").getObject()["HorariosPorLicencia_nav"];
			AppManagementHelper.getModel("LicenseDaysJsonModel").setData({
				Days: aItemDays
			});*/
		},
		// Identificador estable de una licencia en la tabla
		// Identificador estable
		_keyFor: function (lic) {
			return [lic.Empresa, lic.Anio, lic.Id].join("|");
		},

		_getSelectedKeys: function () {
			return this.getLicenseTable()
				.getSelectedContexts()
				.map(c => this._keyFor(c.getObject()));
		},

		_findLicenseInModelByKey: function (key) {
			const [Empresa, Anio, Id] = key.split("|");
			const a = AppManagementHelper.getModel("LicencesListJsonModel").getData().Licenses || [];
			return a.find(l => l.Empresa === Empresa && l.Anio === Anio && l.Id === Id);
		},

		_restoreSelectionFromKeys: function (keys) {
			const set = new Set(keys);
			const table = this.getLicenseTable();
			table.removeSelections(true);
			table.getItems().forEach(item => {
				const o = item.getBindingContext("LicencesListJsonModel")?.getObject();
				if (o && set.has(this._keyFor(o))) {
					table.setSelectedItem(item, true);
				}
			});
		},

		// >>> NUEVO: sleep fijo de 5s (o ms parametrizable)
		_sleep: function (ms) {
			return new Promise(res => setTimeout(res, ms));
		},


		// Espera a que termine el refresh (datos + render) antes de continuar
		_waitListRendered: function () {
			const table = this.getLicenseTable();
			return new Promise(resolve => {
				const binding = table.getBinding("items");
				binding.attachEventOnce("dataReceived", () => {
					table.attachEventOnce("updateFinished", () => resolve());
				});
			});
		},



		getMassiveTramitationsAvailability: function (aLicencias) {
			var bool = aLicencias.some(function (o) {
				return o.Licstat === '30' || o.Licstat === '03' || o.Licstat === '02' || o.Licstat === '11' || o.Licstat === '09' || o.Licstat ===
					'08' || o.Licstat === '90' || o.Licstat === '' ||
					o.Substatus === 'E'
			})
			if (bool === true) { //Si encuentra licencias NO habilitadas para tramitacion
				return false;
			} else {
				return true;
			}
		},


		clearTramitMassiveModal: function () {
			AppManagementHelper.getModel("TramitacionMasivaListJsonModel").getData().Tramitaciones = [];
		},

		openMassiveTramitationAddCompanyDialog: function () {
			this.clearTramitMassiveModal();
			var selectedItemsSinFiltrar = this.getLicenseTable().getSelectedContexts().map(x => x.getObject());
			AppManagementHelper.getModel("TramitacionesCatalogoJsonModel").setProperty("/Tramitaciones", selectedItemsSinFiltrar);

			if (this.checkIfAllAreLicences(selectedItemsSinFiltrar)) {
				if (this.getMassiveTramitationsAvailability(selectedItemsSinFiltrar) === false) {
					// Si solo las seleccionadas estan habilitadas para tramitarse.
					sap.m.MessageToast.show("Seleccione solo licencias en estado habilitadas para tramitación");
				} else {
					var pageName = "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.MassiveTramitation";
					var oController = this;
					var component = FioriComponentHelper.getComponent();
					var view = component.byId(pageName);
					if (!view) {
						var viewId = component.byId(pageName);
						view = sap.ui.jsview(viewId, pageName);
						var oDialog = new sap.m.Dialog({
							title: "Tramitacion Masiva",
							contentWidth: "60%",
							modal: true,
							content: view,
							busy: "{TramitacionMasivaListJsonModel>/Busy}",
							buttons: [
								new sap.m.Button({
									text: "Cancelar",
									press: [oController.closeMassiveTramitationDialog, oController]
								}).addStyleClass("buttonInverted floatLeft"),
								new sap.m.Button({
									text: "Aceptar",
									press: [oController.tramitMassiveLicenses, oController]
								}).addStyleClass("buttonInverted floatRight")
							],
							customData: [
								new sap.ui.core.CustomData({
									key: "list",
									value: null
								})
							]
						}).addStyleClass("customDialog");
						this.massiveTramitationDialog = oDialog;
						oController.getView().addDependent(oDialog);
						oDialog.open();
						if (oDialog) {
							return true;
						}
					} else {
						if (this.massiveTramitationDialog) {
							this.disableDialog.open();
							return true;
						}
					}
				}
			} else {
				MessageBoxHelper.showAlert("Alerta", "Operación inválida, debe seleccionar solo licencias")
			}
		},

		closeMassiveTramitationDialog: function () {
			this.massiveTramitationDialog.close();
		},

		bFinishTramitacion: true,
		validTramitaciones: function (aTramitaciones) {
			var bValid = true;
			if (this.bFinishTramitacion) {
				if (aTramitaciones.length > 0) {
					for (var oTramitacion of aTramitaciones) {
						if (oTramitacion.EmpTramita === "") {
							bValid = false;
							break;
						}
						//aprobada
						if (oTramitacion.Estado === "01") {
							if (oTramitacion.EmpTramita === "") {
								bValid = false;
								break;
							}
						}
						//no autorizada
						if (oTramitacion.Estado === "02") {
							if (oTramitacion.EmpTramita === "" || oTramitacion.CausaNo === "" || oTramitacion.MotivoNo ===
								"") {
								bValid = false;
								break;
							}
						}
						//void
						if (oTramitacion.Estado === "") {
							bValid = false;
							break;
						}
					}
					return bValid
				} else {
					return false;
				}
				//return bValid
			} else {
				for (var oTramitacion of aTramitaciones) {
					if (oTramitacion.EmpTramita === "") {
						bValid = false;
						break;
					}
				}
				return bValid
			}
		},

		_tramitarMasivamente: function (aLicencias, aTramitaciones) {
			BusyDialogHelper.open();

			let aLicenciaPutPromises = [];
			aLicencias.forEach(oLicencia => {
				oLicencia.Tramitador = AppManagementHelper.getStringUserLegacy();
				oLicencia.Licstat = LicenceHelper.getTramitStatus(aTramitaciones);
				oLicencia.Timbeg = new Date(oLicencia.Timbeg.ms);
				oLicencia.Timend = new Date(oLicencia.Timend.ms);
				let oLicenciaClone = LicenceHelper.cloneLicense(oLicencia);

				// Timezone for dates.
				oLicenciaClone.Solbeg = new Date(oLicenciaClone.Solbeg.getTime() + oLicenciaClone.Solbeg.getTimezoneOffset() * 60 * 1000);
				oLicenciaClone.Timbeg = new Date(oLicenciaClone.Timbeg.getTime() + oLicenciaClone.Timbeg.getTimezoneOffset() * 60 * 1000);
				oLicenciaClone.Solend = new Date(oLicenciaClone.Solend.getTime() + oLicenciaClone.Solend.getTimezoneOffset() * 60 * 1000);
				oLicenciaClone.Timend = new Date(oLicenciaClone.Timend.getTime() + oLicenciaClone.Timend.getTimezoneOffset() * 60 * 1000);

				aLicenciaPutPromises.push(LicenseService.updateLicenciaPromise(oLicenciaClone));
			});

			Promise.all(aLicenciaPutPromises).then(() => {
				let aTramitacionesPromises = [];
				aLicencias.forEach(oLicencia => {
					aTramitaciones.forEach(oTramite => {
						let oTramiteClone = jQuery.extend({}, true, oTramite);
						oTramiteClone.Avisoprog = AppManagementHelper.getStringUserLegacy();
						oTramiteClone.Id = oLicencia.Id;
						oTramiteClone.Empresa = oLicencia.Empresa;
						oTramiteClone.Anio = oLicencia.Anio;
						delete oTramiteClone.Enabled;
						aTramitacionesPromises.push(oTramiteClone);
					});
				});

				let aTramitePromises = LicenseService.handleTramitePromises(aTramitacionesPromises);
				Promise.all(aTramitePromises).then((aResponses) => {
					this._loopLicencias(aLicencias);

				}).catch((oError) => {
					console.error(oError);
					BusyDialogHelper.close();
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error tramitar");
				});
			}).catch((oError) => {
				console.error(oError);
				BusyDialogHelper.close();
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error tramitar");
			});
		},

		_loopLicencias: function (aLicencias) {
			let oLicencia = aLicencias.pop();
			if (oLicencia) {
				if (oLicencia.Licstat !== "23") {
					let oLicenciaCloned = jQuery.extend(true, {}, oLicencia);
					oLicenciaCloned.Timbeg = new Date(oLicenciaCloned.Timbeg.getTime() + oLicenciaCloned.Timbeg.getTimezoneOffset() * 60 * 1000);
					oLicenciaCloned.Timend = new Date(oLicenciaCloned.Timend.getTime() + oLicenciaCloned.Timend.getTimezoneOffset() * 60 * 1000);
					LicenseService.sendLicenciaEmail(oLicenciaCloned).then(() => {
						this._loopLicencias(aLicencias);
					}).catch(() => {
						this._loopLicencias(aLicencias);
					});
				} else {
					this._loopLicencias(aLicencias);
				}
			} else {
				this.closeMassiveTramitationDialog();
				AppManagementHelper.getModel("LicencesListJsonModel").refresh(true);
				BusyDialogHelper.close();
				this.makeFilters(0);
			}
		},

		checkSiLicenciasTienenTramitaciones: function (aLicencias, aTramitaciones) {
			var bools = [];

			return new Promise(function (resolve, reject) {
				$.map(aLicencias, function (licencia, index) {
					if (licencia.TramitacionesLicencia_nav.results.length !== 0) { //Si tiene tramitaciones en las cuales buscar
						$.map(licencia.TramitacionesLicencia_nav.results, function (tramitDeLicencia, index2) {
							$.map(aTramitaciones, function (tramitacion, index3) {
								if (tramitDeLicencia.EmpTramita === tramitacion.EmpTramita) { //Si tiene la misma empresa de tramitacion ya agregada
									bools.push(true);
								}
							})
						})
					} else {
						bools.push(false);
					}
				});
				if (bools.some((item) => item === true)) { //Si entre todas hay alguna q tiene la misma empresa
					resolve(true);
				} else {
					resolve(false);
				}
			})
		},

		checkIfAllAreLicences: function (aItems) {
			var bool = aItems.some(function (item) {
				return item.Tipo === 'S'
			});
			if (bool) {
				return false;
			} else {
				return true;
			}
		},

		setModalTramitacionesMasivasBusyState: function (state) {
			this.getView().getModel("TramitacionMasivaListJsonModel").setProperty("/Busy", state);
		},
		tramitMassiveLicenses: async function () {
			var aLicenciasSelected = AppManagementHelper.getModel("TramitacionesCatalogoJsonModel").getData().Tramitaciones;
			var aTramitaciones = AppManagementHelper.getModel("TramitacionMasivaListJsonModel").getData().Tramitaciones;
			var that = this;

			// 1) validación de campos (igual que antes)
			if (this.validTramitaciones(aTramitaciones)) {
				this.setModalTramitacionesMasivasBusyState(true);
				ReportesService.getLicenciasFullData(aLicenciasSelected).then((aLicenciaFull) => {
					var aLicenciasSelectedFull = aLicenciaFull;
					this.checkSiLicenciasTienenTramitaciones(aLicenciasSelectedFull, aTramitaciones).then(function (result) {
						that.setModalTramitacionesMasivasBusyState(false);
						if (result === true) {
							sap.m.MessageBox.show(
								"Hay licencias con agentes cargados, desea sobrescribir?", {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: "Alerta",
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
								onClose: function (oAction) {
									if (oAction == 'YES') {
										that._tramitarMasivamente(aLicenciasSelectedFull, aTramitaciones);
									}
								}
							});
						} else {
							that._tramitarMasivamente(aLicenciasSelectedFull, aTramitaciones);
						}
					});
				});
			} else {
				MessageBoxHelper.showAlert("Alerta", "Debe completar los campos faltantes.");
			}
		},


		getLicenseStatusByOperationType: function (sOperation) {
			switch (sOperation) {
				case "Observar":
					return "02";
				case "Anular":
					return "03";
				default:
			}
		},

		onSelect: function (evt) {
			this.formatAndShowData(evt.getSource().getBindingContext("LicencesListJsonModel").getObject());
			var selectedLicId = evt.getSource().getBindingContext("LicencesListJsonModel").getObject().Id;

			var data = {
				Id: selectedLicId
			};
			var oModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(oModel, "LicenseIdModel");
		},

		onAfterRendering: function () {
			var oController = this;
			this.byId("auditTable").addEventDelegate({
				onkeyup: function (event) {
					var data = event.srcControl.getBindingContext("LicencesListJsonModel").getObject();
					oController.formatAndShowData(data);
					LicenseService.FIND(data);
				}
			});
			if (!this.hasExported) {
				this.hasExported = true;
				this.loadSociety();
				this.loadTipoIntModel();
				this.loadStacionalListModel();
				this.loadStatusModel();
				this.loadMotivoNoAutorizacionModel();
				this.loadJobCondModel()
				this.loadTramitacionsModel()
			}

		},

		loadCatalogDataReports: async function () {
			let aDataJobCond = await LicenseService.getJobCond();
			return {
				JobConds: aDataJobCond,
				EstacionalData: AppManagementHelper.getModel("EstacionalListSet").getData().EstacionalListSet
			}
		},

		loadCatalogData: async function (Werks) {
			let aDataPuestosTrabajo = await LicenseService.getPuestoTrabajo(Werks);
			return {
				PuestosTrabajo: aDataPuestosTrabajo
			}
		},

		loadMotivoNoAutorizacionModel: function () {
			var oModel = AppManagementHelper.getModel("MotivoNoAutorizacionJsonModel");
			oModel.setData({
				Motivos: [{
					key: "COND",
					text: "COND - Condiciones climáticas adversas",
				}, {
					key: "FALT",
					text: "FALT - Falta de recursos operativos",
				}, {
					key: "CONV",
					text: "CONV - Conveniencia de Mantenimientos",
				}, {
					key: "ERRO",
					text: "ERRO - LLTT confeccionada por Error",
				}, {
					key: "ALTE",
					text: "ALTE -Trabajo alternativo",
				}, {
					key: "HLIM",
					text: "HLIM -Aviso de autorización fuera del horario de limite indicado",
				}, {
					key: "ERMS",
					text: "ERMS - Error en las medidas de seguridad",
				}, {
					key: "FEM",
					text: "FEM - Falla en maniobra de equipo involucrado en las MS",
				}]
			})
		},

		loadSociety: function () {
			var that = this;
			var oModeld = oDataService.getModel("TransenerOperaciones");
			oModeld.read("/EmpresaUsuarioSet", {
				/*urlParameters: {
					$expand: "TurnoUsuarioSet"
				},*/
				//filters: filters,
				success: function (data) {
					var empresa = data.results[0].Empresa;
					var werks = data.results[0].Region;

					if (empresa == 999) {
						that.InitSociety();
					} else {
						that.society = empresa;
						that.werks = werks;
						AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Werks/value", werks);
						that.afterEmpresa();
					}
					//TODO OJO
					//data.results[0].Region = "103";
					AppManagementHelper.getModel("CurrentUser").setData(data.results[0]);
				},
				error: function (err) {
					//do something;
				}
			});
			oModeld.read("/EstadoTramitacionCammesaSet", {
				success: (data) => {
					let oModel = AppManagementHelper.getModel("EstadosModel");
					oModel.setData({
						estados: data.results
					});
				},
				error: (err) => {
					console.log("Error cargando estados");
				}
			});

		},

		changeUbicacion: function (oEvent) {
			LicenceHelper.changeUbicacion(oEvent);
		},

		InitSociety: function () {
			this.dialogSociety = new sap.m.Dialog({
				type: sap.m.DialogType.Message,
				title: "Selección de Empresa",
				escapeHandler: function (oPromise) {
					oPromise.reject();
				},
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.Label({
								text: "Debe seleccionar la empresa:"
							}),
							new sap.m.Select({
								change: [this.ValidateCombo, this],
								selectedKey: "{Society>/Code}",
								items: [
									new sap.ui.core.Item({
										key: "",
										text: "Elija Uno"
									}),
									new sap.ui.core.Item({
										key: "100",
										text: "TRANSENER S.A."
									}),
									new sap.ui.core.Item({
										key: "300",
										text: "TRANSBA S.A."
									})
								]
							})
						]
					})

				],
				buttons: [
					new sap.m.Button({
						icon: "sap-icon://save",
						type: sap.m.ButtonType.Emphasized,
						text: "Guardar",
						press: [this.onSelectedSociety, this]
					})
				]
			});
			var oModel = new sap.ui.model.json.JSONModel();
			this.dialogSociety.setModel(oModel, "Society");
			this.dialogSociety.open();
		},

		onSelectedSociety: function () {
			var society = this.dialogSociety.getModel("Society").getData().Code;
			if (society !== "" && typeof society !== "undefined") {
				this.society = society;
				console.log(society);
				this.afterEmpresa();

				this.dialogSociety.close();
				this.dialogSociety.destroy()
			} else {
				sap.m.MessageBox.alert("Debe seleccionar una de empresa!", {
					title: "Selección de Empresa"
				});
			}
		},
		ValidateCombo: function (oEvent) {
			var society = this.dialogSociety.getModel("Society").getData().Code;

			if (society !== "") {
				oEvent.getSource().setValueState("None");
			} else {
				oEvent.getSource().setValueState("Error");
			}
		},

		afterEmpresa: async function () {

			//var model = new sap.ui.model.json.JSONModel(this.society);

			var filters = [];
			let filtersEstaciones = [];
			let filterEmpresa = new sap.ui.model.Filter({
				path: "Empresa",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.society
			});
			let filterWerks = new sap.ui.model.Filter({
				path: "Werks",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.werks
			});
			if (this.werks) {
				filters.push(filterWerks);
			}
			filters.push(filterEmpresa);
			filtersEstaciones.push(filterEmpresa);
			let roles = AppManagementHelper.getModel("UserJsonModel").getProperty("/roles");
			filtersEstaciones.push(new sap.ui.model.Filter({
				path: "Rol",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: roles.includes("ope_solic-lic_transener") ? "ope_solic-lic_transener" : roles[0]
			}));

			// fecha desde
			filters.push(new sap.ui.model.Filter({
				path: "Solbeg",
				operator: sap.ui.model.FilterOperator.GE,
				value1: new Date(new Date().setDate(new Date().getDate() - 7))
				//	value1: new Date(new Date().getFullYear(), 0, 1)
			}));
			this.getView().getModel("LocalFilterJsonModel").setProperty("/Solbeg", new Date(new Date().setDate(new Date().getDate() - 7)));
			//this.getView().getModel("LocalFilterJsonModel").setProperty("/Solbeg", new Date(new Date().getFullYear(), 0, 1));
			// fecha hasta
			filters.push(new sap.ui.model.Filter({
				path: "Solend",
				operator: sap.ui.model.FilterOperator.LE,
				value1: new Date(new Date().setDate(new Date().getDate() + 7))
				//value1: new Date(new Date().getFullYear(), 11, 31)
			}));
			this.getView().getModel("LocalFilterJsonModel").setProperty("/Solend", new Date(new Date().setDate(new Date().getDate() + 7)));
			//this.getView().getModel("LocalFilterJsonModel").setProperty("/Solend", new Date(new Date().getFullYear(), 11, 31));

			WorkPlaceService.loadWorkPlaces(this.society, () => {
				LicenseService.GET(filters);
			});

			AppManagementHelper.getModel("UtilsJsonModel").setData({
				empresa: this.society
			});

			if (this.werks) {
				this.loadCatalogData(this.werks).then((oCatalogData) => {
					AppManagementHelper.getModel("PuestoTrabajoJsonModel");
					AppManagementHelper.getModel("PuestoTrabajoJsonModel").setData({
						PuestosTrabajo: oCatalogData.PuestosTrabajo
					});
				}).catch((e) => {
					console.log(e)
				});
			}

			//LicenseService.GETTramitaciones(this.society);
			RegionesService.loadRegiones(this.society, this.loadAllOrdenes.bind(this));
			EstadoTramitacionService.loadStatus()
			MotivoNoAutorizacionService.loadMotivos()
			EmpresaTramitacionService.loadTramitacion(this.society);
			await PersonalHabilitadoService.getPersonalPromise(this.society);
			this.loadPuestosTrabajo(this.society).then((aPuestosTrabajo) => {
				AppManagementHelper.getModel("PuestosTrabajoJsonModel");
				AppManagementHelper.getModel("PuestosTrabajoJsonModel").setData({
					PuestosTrabajo: aPuestosTrabajo
				})
				//		oRouter.attachRoutePatternMatched(this._onHomeRouteMatched, this);

			})
			EstacionesService.loadEstaciones(filtersEstaciones);
			//ReportesHelper.workReportCammesa(this.society, new Date(0), new Date(), false);
			//RepositionTimeService.loadEstaciones(filters);
			this.loadRepositionTimeModel();
			LicenseService.GETTipoLicenciaCatalog();
			this.getImageUrl();

			if (this.validURLToLicense) {
				this.getView().setBusy(true);
				var oDataUrl = LicenceHelper.getURLLicenseData(this._url);
				setTimeout(() => {
					/*var aTableItems = this.byId("auditTable").getItems();
					var oLicenseItem = aTableItems.find(oItem => {
						var oItemData = oItem.getBindingContext("LicencesListJsonModel").getObject()
						return oDataUrl.Id === oItemData.Id && oDataUrl.Empresa === oItemData.Empresa && oDataUrl.Tipo === oItemData.Tipo &&
							oDataUrl.Anio === oItemData.Anio
					});*/
					LicenseService.FIND(oDataUrl, (license) => {
						this.getView().setBusy(false);
						this.c(license, true);
					})
				}, 5000)
			}

			var sPath = FioriHelper.getAppPath();
			var centroToRegion = AppManagementHelper.getModel("centroToRegion");
			centroToRegion.loadData(sPath + "/conf/centroToRegion.json", "", false);

			//	AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Werks/value", werks);
			var empresa = this.society === "100" ? "TRANSENER" : "TRANSBA";

			LimitacionesTecnicas.loadLimitacionesTecnicas(empresa);

		},

		loadAllOrdenes: function (regiones) {
			return; //TODO remove this, this is to go back to not having a select on ordenes
			AppManagementHelper.getModel("TiposOrdenes").setProperty("/Busy", true);
			let promises = [];
			regiones.forEach(region => {
				let filters = [
					new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, this.society),
					new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.EQ, region.Werks)
				];
				promises.push(OrdenesService.getOrdenesPromise(filters))
			});
			Promise.all(promises).then((res) => {
				let tiposOrdenes = {};
				regiones.forEach((region, index) => {
					tiposOrdenes[region.Werks] = res[index].results
				});
				AppManagementHelper.getModel("TiposOrdenes").setProperty("/TiposOrdenes", tiposOrdenes);
				AppManagementHelper.getModel("TiposOrdenes").setProperty("/Busy", false);
			}).catch(err => {
				console.log(err);
				AppManagementHelper.getModel("TiposOrdenes").setProperty("/Busy", false);
			});
		},

		// getImageUrl: function () {
		// 	var that = this;
		// 	var xhr = new XMLHttpRequest();
		// 	//test webide images/transener.png
		// 	if (that.society === "100") {
		// 		xhr.open("GET", "/images/transener.png", true);
		// 		//	xhr.open("GET", "/sap/fiori/transeneroperacionesworklicens/images/transener.png", true);
		// 	} else {
		// 		xhr.open("GET", "/images/TRANSBA.png", true);
		// 		// xhr.open("GET", "/sap/fiori/transeneroperacionesworklicens/images/TRANSBA.png", true);
		// 	}

		// 	xhr.responseType = "blob";
		// 	xhr.onload = function (e) {
		// 		//console.log(this.response);
		// 		if (e.srcElement.status >= 400) {
		// 			that.imageUrl = false;
		// 			return;
		// 		}
		// 		var reader = new FileReader();
		// 		reader.onload = function (event) {
		// 			var res = event.target.result;
		// 			that.imageUrl = res;
		// 			var oModelImage = AppManagementHelper.getModel("ImageModel")
		// 			oModelImage.setProperty("/Image", res);
		// 		};
		// 		var file = this.response;
		// 		reader.readAsDataURL(file);
		// 	};
		// 	xhr.send();
		// },
		getImageUrl: function () {
			var oModelImage = AppManagementHelper.getModel("ImageModel");
			var sEmpresaLogo = "";

			if (this.society === "100") {
				// TRANSENER
				sEmpresaLogo = "data:image/png;base64,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"
			} else {
				sEmpresaLogo = "data:image/png;base64,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"
			}
		},
		generateSolicitudAcuerdoData: function (aLicenses, aData) {
			for (var oLicenseContext of aLicenses) {
				aData.push(oLicenseContext.getBindingContext("LicencesListJsonModel").getObject())
			}
			return aData;
		},

		solicitudAcuerdoExport: function () {
			var aData = [];
			var aLicenses = this.byId("auditTable").getSelectedItems();
			if (aLicenses.length > 0) {
				var aData = this.generateSolicitudAcuerdoData(aLicenses, aData);
				ReportesHelper.exportSolicitudAcuerdo(aData, this.society);
			} else {
				sap.m.MessageBox.alert("Necesita seleccionar al menos una licencia para generar el reporte.", {
					title: "Alerta"
				});
			}

		},

		comparacionReporte: function () {
			var aData = [];
			var aLicenses = this.byId("auditTable").getSelectedItems();
			if (aLicenses.length > 0) {
				var aData = this.generateSolicitudAcuerdoData(aLicenses, aData);
				ReportesHelper.comparacionLicencia(aData);
			} else {
				sap.m.MessageBox.alert("Necesita seleccionar al menos una licencia para generar el reporte.", {
					title: "Alerta"
				});
			}
		},

		handleSemanalCammesa: function () {
			var tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			var oModel = AppManagementHelper.getModel("CammesaSemanal");
			oModel.setData({
				fechadesde: tomorrow,
				fechahasta: tomorrow
			});
			this.dialogSemanalCamesa = new sap.m.Dialog({
				type: sap.m.DialogType.Message,
				title: "Programación Semanal (reunion CAMMESA)",
				escapeHandler: function (oPromise) {
					oPromise.reject();
				},
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.Label({
								text: "Fecha desde:"
							}),
							new sap.m.DatePicker({
								dateValue: "{CammesaSemanal>/fechadesde}"
							})
						]
					}),
					new sap.m.VBox({
						items: [
							new sap.m.Label({
								text: "Fecha hasta:"
							}),
							new sap.m.DatePicker({
								dateValue: "{CammesaSemanal>/fechahasta}"
							})
						]
					})
				],
				buttons: [
					new sap.m.Button({
						icon: "sap-icon://save",
						type: sap.m.ButtonType.Emphasized,
						text: "Realizar Reporte ",
						press: [this.downloadSemanalCamesa, this]
					}),
					new sap.m.Button({
						icon: "sap-icon://decline",
						type: sap.m.ButtonType.Emphasized,
						text: "Cerrar",
						press: [this.closeDialogSemanalCammesa, this]
					})
				]
			});

			this.dialogSemanalCamesa.setModel(oModel, "CammesaSemanal");
			this.dialogSemanalCamesa.open();
		},

		closeDialogSemanalCammesa: function () {
			this.dialogSemanalCamesa.close();
			this.dialogSemanalCamesa.destroy();
		},

		downloadSemanalCamesa: function () {
			let filterData = AppManagementHelper.getModel("CammesaSemanal").getData();
			var sSolbeg = filterData.fechadesde.toISOString().split("T")[0].replace(/-/g, "");
			var sSolend = filterData.fechahasta.toISOString().split("T")[0].replace(/-/g, "");
			let daysInBetWeen = filterData;
			ReportesHelper.reporteSemanalCammesa(sSolbeg, sSolend, this.society, daysInBetWeen).then((m) => {
				BusyDialogHelper.close();
				sap.m.MessageBox.alert(m.message, {
					title: "Descarga Excel"
				});
			}).catch((e) => {
				console.log(e)
			})
		},

		handleDiaryPartLT: function () {
			var tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			var oModel = AppManagementHelper.getModel("DiaryPartFilterModel");
			oModel.setData({
				fecha: tomorrow
			});
			this.dialogDiaryPart = new sap.m.Dialog({
				type: sap.m.DialogType.Message,
				title: "Parte Diaria",
				escapeHandler: function (oPromise) {
					oPromise.reject();
				},
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.Label({
								text: "Fecha:"
							}),
							new sap.m.DatePicker({
								dateValue: "{DiaryPartFilterModel>/fecha}"
							})
						]
					})
				],
				buttons: [
					new sap.m.Button({
						icon: "sap-icon://save",
						type: sap.m.ButtonType.Emphasized,
						text: "Realizar Reporte ",
						press: [this.downloadReportDiaryPart, this]
					}),
					new sap.m.Button({
						icon: "sap-icon://decline",
						type: sap.m.ButtonType.Emphasized,
						text: "Cerrar",
						press: [this.closeDialogDiaryPart, this]
					})
				]
			});

			this.dialogDiaryPart.setModel(oModel, "DiaryPartFilterModel");
			this.dialogDiaryPart.open();
		},

		closeDialogDiaryPart: function () {
			this.dialogDiaryPart.close();
			this.dialogDiaryPart.destroy();
		},

		downloadReportDiaryPart: function () {
			var dSolbeg = AppManagementHelper.getModel("DiaryPartFilterModel").getProperty("/fecha");
			var sSolbeg = dSolbeg.toISOString().split("T")[0].replace(/-/g, "");
			this.sSolbeg = FormatHelper.formatDateLicense(dSolbeg);
			this.sDay = FormatHelper.getDayName(dSolbeg);
			var Empresa = this.society;
			LicenseService.diaryPartReport(sSolbeg, Empresa)
				.then($.proxy(this.createPDFReportDiaryPart, this))
				.catch($.proxy(this.errorPDFReportDiaryPart, this));
		},

		handleWorkReportCammesa: function () {
			var oModel = AppManagementHelper.getModel("ReportFilterModel");
			oModel.setData({
				Semanal: true
			});

			function radioSelect(evt) {
				if (!oModel.getProperty("/Semanal")) {
					oModel.setProperty("/Hasta", oModel.getProperty("/Desde"));
				}
			}
			//TODO mover dialog a archivo aparte
			this.reportDialog = new sap.m.Dialog({
				type: sap.m.DialogType.Message,
				title: "Exportar a EXCEL",
				escapeHandler: function (oPromise) {
					oPromise.reject();
				},
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.Label({
								text: "Desde:"
							}),
							new sap.m.DatePicker({
								dateValue: "{ReportFilterModel>/Desde}",
								change: radioSelect
							}),
							new sap.m.Label({
								text: "Hasta:"
							}),
							new sap.m.DatePicker({
								dateValue: "{ReportFilterModel>/Hasta}",
								enabled: "{ReportFilterModel>/Semanal}"
							}),
							new sap.m.CheckBox({
								selected: "{ReportFilterModel>/Anul}",
								text: "Informar LLTT Anuladas"
							}),
							new sap.m.RadioButtonGroup({
								columns: 2,
								buttons: [
									new sap.m.RadioButton({
										text: "Semanal",
										selected: "{ReportFilterModel>/Semanal}"
									}),
									new sap.m.RadioButton({
										text: "Diario",
										selected: "{= !${ReportFilterModel>/Semanal}}"
									})
								],
								select: radioSelect
							})
						]
					})
				],
				buttons: [
					new sap.m.Button({
						icon: "sap-icon://save",
						type: sap.m.ButtonType.Emphasized,
						text: "Aceptar",
						press: [this.downloadWorkReportCammesa, this]
					}),
					new sap.m.Button({
						icon: "sap-icon://decline",
						type: sap.m.ButtonType.Emphasized,
						text: "Cerrar",
						press: [this.closeReportDialog, this]
					})
				]
			});

			this.reportDialog.setModel(oModel, "ReportFilterModel");
			this.reportDialog.open();
		},

		downloadWorkReportCammesa: function () {
			let filterData = AppManagementHelper.getModel("ReportFilterModel").getData();
			if (!filterData.Desde) {
				sap.m.MessageBox.alert("Debe cargar la fecha Desde", {
					title: "Error"
				});
				return;
			}
			if (!filterData.Hasta) {
				sap.m.MessageBox.alert("Debe cargar la fecha Hasta", {
					title: "Error"
				});
				return;
			}
			BusyDialogHelper.open();
			ReportesHelper.workReportCammesa(this.society, filterData.Desde, filterData.Hasta, filterData.Anul)
				.then(res => {
					BusyDialogHelper.close();
					sap.m.MessageBox.alert("Reporte completado satisfactoriamente", {
						title: "Descarga Excel"
					});
				}, err => {
					let messages = new Set();
					err.forEach(e => {
						if (e.responseText) {
							let error;
							try {
								error = JSON.parse(e.responseText).error;
							} catch (err) {
								error = {};
							}
							if (error.message && error.message.value) {
								messages.add(error.message.value);
							}
						}
					});
					let printError = Array.from(messages).join("\n");
					if (!printError) printError = "Error";
					sap.m.MessageBox.alert(printError, {
						title: "Error al descargar el excel"
					});
					BusyDialogHelper.close();
				});
		},

		closeReportDialog: function () {
			this.reportDialog.close();
			this.reportDialog.destroy();
		},

		registerJSPdfModules: function () {
			jQuery.sap.registerModulePath("index", "https://unpkg.com/jspdf@1.4.1/dist/");
			jQuery.sap.require({
				modName: "index.jspdf",
				type: "debug"
			});
			jQuery.sap.registerModulePath("index", "https://unpkg.com/jspdf-autotable@3.0.4/dist/");
			jQuery.sap.require({
				modName: "index.jspdf",
				type: "plugin.autotable"
			});
		},

		registerDefine: function () {
			if (window.define) {
				var temp = define.amd;
				define.amd = false;
			}
			jQuery.sap.registerModulePath("index", "https://unpkg.com/jspdf@1.4.1/dist/");
			jQuery.sap.require({
				modName: "index.jspdf",
				type: "debug"
			});
			jQuery.sap.registerModulePath("index", "https://unpkg.com/jspdf-autotable@3.0.4/dist/");
			jQuery.sap.require({
				modName: "index.jspdf",
				type: "plugin.autotable"
			});
			if (window.define) define.amd = temp;
		},

		setImageToDocument: function (doc) {
			var imageUrl = this.imageUrl;
			var empresa = this.society === "100" ? "TRANSENER" : "TRANSBA";
			if (this.imageUrl) {
				if (this.society === "100") {
					doc.addImage(imageUrl, 'PNG', 10, 5, 40, 15);
				} else {
					doc.addImage(imageUrl, 'PNG', 10, 5, 60, 12);
				}
			}
		},

		formatFecha: function (Solbeg) {
			var year = Solbeg.substr(0, 4);
			var month = Solbeg.substr(4, 2);
			var day = Solbeg.substr(6);

			return day + "-" + month + "-" + year;
		},

		//TODO remove
		getLicStat: function (status) {
			if (status == "06") {
				return "Aprobada";
			} else if (status == "04") {
				return "Cancelada";
			} else if (status == "01") {
				return "NO Autorizada";
			} else if (status == "03") {
				return "Anulada";
			} else if (status == "02") {
				return "Observada";
			} else if (status == "08") {
				return "Entregada";
			} else if (status == "09") {
				return "Generada";
			} else if (status == "10") {
				return "Suspendida";
			} else if (status == "05") {
				return "Tramitada";
			} else if (status == "07") {
				return "Coordinada";
			} else if (status == "11") {
				return "Cancelada";
			} else if (status == "11") {
				return "Cancelada";
			}
			return status;
		},

		setSubstatusFilter: function (sKey) {
			var sSubstatus = "";
			if (sKey === "90") {
				sSubstatus = "E"
			}
			if (sKey === "91") {
				sSubstatus = "D"
			}
			if (sKey === "92") {
				sSubstatus = "R"
			}
			if (sKey === "10") {
				sSubstatus = "S"
			}
			AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Substatus/value", sSubstatus)

		},

		changeStatus: function (oEvent) {
			var sKey = oEvent.getSource().getSelectedKey();
			if (sKey === "90" || sKey === "91" || sKey === "92" || sKey === "10") {
				//	AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Licstat/value", "01")
				this.setSubstatusFilter(sKey)
			} else {
				AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Licstat/value", sKey)
				AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Substatus/value", "")
			}
		},

		getPDFLicenseFormattedData: function (aData) {
			var self = this;
			var aDataFormatted = $.extend([], aData);
			aDataFormatted.forEach(function (e) {
				e.Empresa = e.Empresa === "100" ? "TRANSENER" : "TRANSBA";
				e.Barrafs = e.Barrafs === "N" ? "NO" : "SI";
				e.Aro = e.Aro === "X" ? "SI" : "NO";
				e.Bloqueo = e.Bloqueo === "N" ? "NO" : "SI";
				e.Equstat = e.Equstat === "" ? "FUERA DE SERVICIO" : "EN SERVICIO";
				e.Gdate = typeof (e.Gdate) === "object" ? self.formatDate(e.Gdate) : e.Gdate;
				e.Tipo = e.Tipo === "S" ? "SOLICITUD" : "LICENCIA";
				e.Licstat = self.getLicStat(e.Licstat);
				e["R500kv"] = e["R500kv"] === "N" ? "NO" : "SI";
			});
			return aDataFormatted;
		},

		getTimeFormat: function (date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes + " HS";
			return strTime;
		},

		formatDate: function (dDate) {
			let dDateFormatted = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
			let d = new Date(dDateFormatted);
			let month = '' + (d.getMonth() + 1);
			let day = '' + d.getDate();
			let year = d.getFullYear();

			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;

			return [day, month, year].join('/');
		},

		createPDFLicencias: function (aData) {
			var sFechaReporte = this.formatDate(new Date())
			var aDataFormatted = this.getPDFLicenseFormattedData(aData);
			this.registerDefine();

			var doc = new jsPDF({
				format: "a3",
				orientation: 'l',
				unit: "mm"
			});

			this.setImageToDocument(doc)

			doc.setFontSize(14);
			doc.setFontType("bold");
			doc.text(70, 10, "LISTADO DE LICENCIAS DE TRABAJO");
			doc.setFontSize(8);

			doc.text(70, 15, "Fecha del reporte: " + sFechaReporte);

			var headers = [{
				Anio: "Año",
				Arbpl: "Puesto de trabajo",
				Aro: "Coordinado ARO",
				Aufnr: "Orden de trabajo",
				Barrafs: "Barra",
				Bloqueo: "Bloqueo",
				Descripcion: "Descripción",
				Empresa: "Empresa",
				Equnr: "Equipo",
				Equstat: "Estado del equipo",
				Licstat: "Estado de la licencia",
				R500kv: "500 kv",
				Rdisparo: "Riesgo de disparo",
				Tipo: "Tipo"
			}];

			var colLongs = [{
				"dataKey": "Anio"
			}, {
				"dataKey": "Arbpl"
			}, {
				"dataKey": "Aro",
			}, {
				"dataKey": "Aufnr"
			}, {
				"dataKey": "Barrafs"
			}, {
				"dataKey": "Bloqueo"
			}, {
				"dataKey": "Descripcion"
			}, {
				"dataKey": "Empresa"
			}, {
				"dataKey": "Equipo"
			}, {
				"dataKey": "Estado del equipo"
			}, {
				"dataKey": "Licstat"
			}, {
				"dataKey": "R500kv"
			}, {
				"dataKey": "Rdisparo"
			}, {
				"dataKey": "Tipo"
			}];

			doc.autoTable({
				head: headers,
				columns: colLongs,
				body: aDataFormatted,
				startY: 25,
				margin: {
					horizontal: 7,
					top: 30,
					bottom: 60
				},
				bodyStyles: {
					valign: 'top'
				},
				styles: {
					overflow: 'linebreak',
					cellWidth: 'wrap',
					tableWidth: 200
				},
				columnStyles: {
					text: {
						cellWidth: 'auto'
					}
				}
			});
			doc.save("LICENCIAS DE TRABAJO.pdf");

		},

		getPDFFormattedData: function (aData) {
			var self = this;
			var aDataFormatted = $.extend([], aData);
			aDataFormatted.forEach(function (e) {
				e.LT = e.Anio + "\n" + e.Id.slice(5);
				e.Empresa = e.Empresa === "100" ? "TRANSENER" : "TRANSBA";
				e.Solbeg = self.formatFecha(e.Solbeg);
				e.Solend = self.formatFecha(e.Solend);
				e.TrabajoFS = e.Equstat === "X" ? "" : "X";
				e.Equstat = e.Equstat === "" ? "FUERA DE SERVICIO" : "EN SERVICIO";
				e.Timbeg = FormatHelper.getTimeString(e.Timbeg.ms) || "00:00" + "HS";
				e.Timend = FormatHelper.getTimeString(e.Timend.ms) || "00:00" + "HS";
				e.EntregaLT = "";
				e.CancelaLT = "";
				e.HPD = e.Solbeg + " / " + e.Timbeg;
				e.HPH = e.Solend + " / " + e.Timend;
				e.Comentarios = FormatHelper.getCommentsFromLicence(e);
			});
			return aDataFormatted;
		},

		formatJobCond: function (key) {

		},

		getEstacional: function (k) {
			let oEstacional = this.estacionaldata.find(e => e.Codigo === k)
			return oEstacional ? oEstacional.Descripcion : "";
		},

		getJobCond: function (k) {
			let oJobcond = this.jobconds.find(e => e.Valkey === k)
			return oJobcond ? oJobcond.Valtext : "";
		},

		getJefe: function (k) {
			var aPersonalJefeTrabajo = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().JefeDeTrabajo;
			let oJefe = aPersonalJefeTrabajo.find(e => e.Legajo === k);
			return oJefe ? oJefe.Nombre : "";
		},

		getPDFFormattedDataTRANSBA: function (aData) {
			var self = this;
			var aDataFormatted = $.extend([], aData);
			aDataFormatted.forEach((e) => {
				e.LT = e.Anio + "\n" + e.Id.slice(5);
				e.Empresa = e.Empresa === "100" ? "TRANSENER" : "TRANSBA";
				e.TrabajoRealizar = `${e.Tipinterv} /  ${this.getEstacional(e.Estacional)}`;
				e.Solbeg = self.formatFecha(e.Solbeg);
				e.Solend = self.formatFecha(e.Solend);
				e.TrabajoFS = e.Equstat === "X" ? "" : "X";
				e.Equstat = e.Equstat === "" ? "" : "X";
				e.EquipoFS = e.Equstat === "" ? "X" : "";
				e.EquipoES = e.Equstat === "X" ? "X" : "";
				e.Timbeg = FormatHelper.getTimeString(e.Timbeg.ms) || "00:00" + "HS";
				e.Timend = FormatHelper.getTimeString(e.Timend.ms) || "00:00" + "HS";
				e.EntregaLT = "";
				e.CancelaLT = "";
				e.HPD = e.Solbeg + " / " + e.Timbeg;
				e.HPH = e.Solend + " / " + e.Timend;
				e.Jobcond = this.getJobCond(e.Jobcond);
				e.Comentarios = FormatHelper.getCommentsFromLicence(e);
				e.ComentariosOperativos = this.getComentOper(e);
				e.MedidasSeguridadTot = "xx";
				e.Jefe = this.getJefe(e.Jefe)
			});
			return aDataFormatted;
		},

		getComentOper: function (lic) {
			return `Trabajo a realizar: ${lic.Descripcion} - Base de programacion COT/COTDT: ${lic.Tdtcomments} - Comentarios Programación: ${lic.Prgcomments}`;
		},

		getMedidasSeguridad: function () {
			return `Condiciones de trabajo`
		},

		getFullComments: function (lic) {
			let comentariosProg = lic.Prgcomments ? `${lic.Prgcomments} /` : "";
			let Interabier = lic.Interabier ? `${lic.Interabier} /` : "";
			let Seleccionad = lic.Seleccionad ? `${lic.Seleccionad} /` : "";
			let Intercerr = lic.Intercerr ? `${lic.Intercerr} /` : "";
			let Patadic = lic.Patadic ? `${lic.Patadic} /` : "";
			let Equimov = lic.Equimov ? `${lic.Equimov} /` : "";
			let Bloqueorecierretxt = lic.Bloqueorecierretxt ? `${lic.Bloqueorecierretxt} /` : "";
			let Intnooperar = lic.Intnooperar ? `${lic.Intnooperar} /` : "";
			let Precauciones = lic.Precauciones ? `${lic.Precauciones} /` : "";
			let Solictext = lic.Solictext ? `${lic.Solictext} /` : "";
			let a = "-Coment. Oper: \n" + "--- \n";
			return a
		},

		createPDF: function (aData) {
			let aTplnr = aData.map(e => e.Tplnr);
			LicenseService.getEstacionesCodes(aTplnr).then((aEstaciones) => {
				let aEstacionesCodes = aEstaciones.map(x => {
					return {
						Estacion: x.Estacion,
						CodigoTplnr: x.Codigo
					}
				});
				EquiposService.getEquipos(aEstacionesCodes).then((aEquipos) => {
					aData.forEach(e => {
						let oEquipo = aEquipos.find(eq => eq.CodigoTplnr === e.Tplnr);
						if (oEquipo) {
							let oEquipoDesc = oEquipo.Equipos.find(equip => equip.CodigoEquipo === e.Equnr);
							if (oEquipoDesc) {
								e.DescripcionEq = oEquipoDesc.DescEquipo
							} else {
								e.DescripcionEq = ""
							}
						} else {
							e.DescripcionEq = ""
						}
					});

					this.loadCatalogDataReports().then((oData) => {
						this.jobconds = oData.JobConds;
						this.estacionaldata = oData.EstacionalData;

						if (this.society === '100') { //TRANSENER
							var aDataFormatted = this.getPDFFormattedData(aData);
							this.getReporteTransener(aDataFormatted);
						} else { //TRANSBA
							var aDataFormatted = this.getPDFFormattedDataTRANSBA(aData);
							this.getReporteTransba(aDataFormatted);
						}

					}).catch(() => {
						MessageBoxHelper.showAlert("Alerta", "Error al descarga parte diario");
					})

				}).catch((err) => {
					console.log(err);
				})
			}).catch((err) => {
				MessageBoxHelper.showAlert("Alerta", "Error al descarga parte diario");
			})

		},

		getReporteTransba: function (aDataFormatted) {
			const LineasSalidas = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "SAL"];
			let aLineas = [];
			let aEstaciones = [];

			for (let oDataFormatted of aDataFormatted) {
				let oRecord = LineasSalidas.find(e => e === oDataFormatted.TipoEquipo);
				if (oRecord) {
					aLineas.push(oDataFormatted);
				} else {
					aEstaciones.push(oDataFormatted);
				}
			}

			var sFechaReporte = FormatHelper.formatDateLicenseWithoutUtc(new Date());
			var sTime = FormatHelper.getTimeStringWithoutUTC(new Date().getTime());

			this.registerDefine();

			var doc = new jsPDF({
				format: "a3",
				orientation: 'l',
				unit: "mm"
			});

			doc.page = 1;
			this.setImageToDocument(doc);
			doc.setFontSize(14);
			doc.setFontType("bold");
			doc.text(140, 15, `Licencias de trabajo del dia ${this.sDay} (${this.sSolbeg})`);
			doc.setFontSize(8);
			doc.text(360, 15, `Fecha de Impresión ${sFechaReporte} ${sTime} `);
			doc.setFontType("italic");
			doc.text(15, 20, `Gerencia de operaciones COT-COTDT`);
			doc.setFontType("normal");
			doc.setFontSize(12);
			doc.text(160, 50, `Estaciones Transformadoras`);

			let oEstacionesAgrupadas = _.groupBy(aEstaciones, e => e.Tplnr);
			let iIndex = 0;
			for (let ETAttribute in oEstacionesAgrupadas) {
				if (iIndex > 0) {
					doc.addPage({
						format: "a3",
						orientation: 'l',
						unit: "mm"
					});
				}

				let sText = oEstacionesAgrupadas[ETAttribute][0] ? oEstacionesAgrupadas[ETAttribute][0].Pltxt : "";
				doc.autoTable({
					headStyles: {
						fontSize: 16,
						halign: 'center',
					},
					head: [{
						Estacion: {
							content: sText,
							rowSpan: 2,
						},
					}],
					columns: [{
						"dataKey": "Estacion"
					}],
					columnStyles: {
						Estacion: {
							columnWidth: 80,
							fontSize: 20
						},
						text: {
							cellWidth: 'auto',
							fontSize: 20
						}
					},
					body: [],
					startY: iIndex > 0 ? 40 : 60,
					margin: {
						horizontal: 7,
						top: 30,
						bottom: 60
					},
					styles: {
						overflow: 'linebreak',
						cellWidth: 'wrap',
						tableWidth: 300
					},
				});

				let aEquiposAsociadosALaET = oEstacionesAgrupadas[ETAttribute];
				for (var i = 0; i < aEquiposAsociadosALaET.length; i++) {
					let oEquipoAsociadoET = aEquiposAsociadosALaET[i];

					doc.autoTable({
						theme: "grid",
						head: [{
							FS: {
								content: "F/S",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							ES: {
								content: "E/S",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							LTN: {
								content: "LT N°",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							ET: {
								content: "ET",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							EQUIPOS: {
								content: "Equipo",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							TRABAJOREALIZAR: {
								content: "Trabajo a realizar",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							SEGURIDAD: {
								content: "Seguridad",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							JEFETRABAJO: {
								content: "Jefe de Trabajo",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							Fsllenaut: {
								content: "F/S",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							Esllenaut: {
								content: "E/S",
								rowSpan: 2,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							Period: {
								content: "Horarios",
								colSpan: 6,
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
						}, {
							Period: {
								content: "Periodo",
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							HPD: {
								content: "Desde",
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							EntregaLT: {
								content: "Entregado",
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							HPH: {
								content: "Hasta",
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							CancelaLT: {
								content: "Cancelado",
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							},
							Folio: {
								content: "Folio",
								styles: {
									valign: 'center',
									fillColor: [255, 255, 255],
									lineColor: [0, 0, 0],
									textColor: [0, 0, 0],
									lineWidth: 0.4
								}
							}
						}],
						columns: [{
							"dataKey": "FS"
						}, {
							"dataKey": "ES"
						}, {
							"dataKey": "LTN"
						}, {
							"dataKey": "ET",
						}, {
							"dataKey": "EQUIPOS"
						}, {
							"dataKey": "TRABAJOREALIZAR"
						}, {
							"dataKey": "SEGURIDAD"
						}, {
							"dataKey": "JEFETRABAJO"
						}, {
							"dataKey": "Fsllenaut"
						}, {
							"dataKey": "Esllenaut"
						}, {
							"dataKey": "Period"
						}, {
							"dataKey": "HPD"
						}, {
							"dataKey": "EntregaLT"
						}, {
							"dataKey": "HPH"
						}, {
							"dataKey": "CancelaLT"
						}, {
							"dataKey": "Folio"
						}],
						body: [{
							FS: {
								content: "",
								styles: {
									cellWidth: 4,
									lineColor: [0, 0, 0],
								}
							},
							ES: {
								content: "",
								rowSpan: 1,
								styles: {
									cellWidth: 4,
									lineColor: [0, 0, 0],
								}
							},
							LTN: {
								content: oEquipoAsociadoET.Id,
								rowSpan: 2,
								styles: {
									cellWidth: 6,
									fontStyle: 'bold',
									fontSize: 8,
									lineColor: [0, 0, 0],
								}
							},
							ET: {
								content: oEquipoAsociadoET.Tplnr,
								rowSpan: 2,
								styles: {
									cellWidth: 4,
									lineColor: [0, 0, 0],
								}
							},
							EQUIPOS: {
								content: `${oEquipoAsociadoET.Equnr} - ${oEquipoAsociadoET.DescripcionEq}`,
								rowSpan: 3,
								styles: {
									cellWidth: 8,
									fontSize: 8,
									lineColor: [0, 0, 0],
								}
							},
							TRABAJOREALIZAR: {
								content: oEquipoAsociadoET.TrabajoRealizar,
								rowSpan: 3,
								styles: {
									cellWidth: 12,
									minCellHeight: 12,
									lineColor: [0, 0, 0],
								}
							},
							SEGURIDAD: {
								content: oEquipoAsociadoET.Jobcond,
								rowSpan: 1,
								styles: {
									cellWidth: 12,
									lineColor: [0, 0, 0],
								}
							},
							JEFETRABAJO: {
								content: oEquipoAsociadoET.Jefe,
								rowSpan: 1,
								styles: {
									cellWidth: 11,
									lineColor: [0, 0, 0],
								}
							},
							Fsllenaut: {
								content: oEquipoAsociadoET.EquipoFS,
								rowSpan: 1,
								styles: {
									cellWidth: 4,
									lineColor: [0, 0, 0],
								}
							},
							Esllenaut: {
								content: oEquipoAsociadoET.EquipoES,
								rowSpan: 1,
								styles: {
									cellWidth: 4,
									lineColor: [0, 0, 0],
								}
							},
							Period: {
								content: oEquipoAsociadoET.Period === "D" ? "Diario" : "Continuo",
								rowSpan: 1,
								styles: {
									cellWidth: 7,
									lineColor: [0, 0, 0],
								}
							},
							HPD: {
								content: oEquipoAsociadoET.HPD,
								rowSpan: 1,
								styles: {
									cellWidth: 7,
									lineColor: [0, 0, 0],
								}
							},
							EntregaLT: {
								content: "",
								rowSpan: 1,
								styles: {
									cellWidth: 7,
									lineColor: [0, 0, 0],
								}
							},
							HPH: {
								content: oEquipoAsociadoET.HPH,
								rowSpan: 1,
								styles: {
									cellWidth: 7,
									lineColor: [0, 0, 0],
								}
							},
							CancelaLT: {
								content: "",
								rowSpan: 1,
								styles: {
									cellWidth: 7,
									lineColor: [0, 0, 0],
								}
							},
							Folio: {
								content: "",
								rowSpan: 1,
								styles: {
									cellWidth: 6,
									lineColor: [0, 0, 0],
								}
							}
						}],
						margin: {
							horizontal: 7,
							top: 30,
							bottom: 60
						},
						bodyStyles: {
							valign: 'top'
						},
						styles: {
							overflow: 'linebreak',
							cellWidth: 'wrap',
							tableWidth: 300
						},
						columnStyles: {
							Comentarios: {
								columnWidth: 80
							},
							text: {
								cellWidth: 'auto'
							}
						}
					});

					//COMENTARIO TOTAL
					doc.autoTable({
						theme: "plain",
						body: [
							["Coment.Oper:"],
							[oEquipoAsociadoET.ComentariosOperativos],
							["Condiciones Trabajo"],
							[" -Equipos a mover: " + oEquipoAsociadoET.Equimov],
							[" -Riesgo disparo: " + (oEquipoAsociadoET.Rdisparo === "X" ? "SI" : "NO")],
							[" --- "],
							["Medidas de Seguridad"],
							[" -Interruptores abiertos y en local/extr: " + oEquipoAsociadoET.Interabier],
							[" -Secc. abiertos, bloq y trab: " + oEquipoAsociadoET.Seleccionad],
							[" -Secc. de PAT cerrados: " + oEquipoAsociadoET.Intercerr],
							[" -Bloqueo de recierres: " + oEquipoAsociadoET.Bloqueorecierretxt],
							[" -Int. que no deben operarse: " + oEquipoAsociadoET.Intnooperar],
							[
								// Issue 529 -> se cambia el mapeo de .Precauciones por .Patadic
								// Issue 529 -> se concatena .Precauciones despues del Patadic con un / separadora
								" -Otras precauciones PAT portatiles: " + oEquipoAsociadoET.Patadic + " / " + oEquipoAsociadoET.Precauciones
							],
							[" --- "],
							[" Barra F/S " + oEquipoAsociadoET.Barrafstx],
							[" Comentarios del solicitante " + oEquipoAsociadoET.Solictext],
						],
						columnStyles: {
							0: {
								columnWidth: 80
							},
							text: {
								cellWidth: 'auto'
							}
						},
						startY: doc.lastAutoTable.finalY,
						margin: {
							horizontal: 7,
							top: 30,
							bottom: 60
						},
						bodyStyles: {
							valign: 'top'
						},
						styles: {
							overflow: 'linebreak',
							cellWidth: 'auto',
							tableWidth: 300,
						},
					});

					if (i !== (aEquiposAsociadosALaET.length - 1)) {
						doc.addPage({
							format: "a3",
							orientation: 'l',
							unit: "mm"
						});
					}
				}

				iIndex++;
			}

			var numberOfPages = doc.internal.getNumberOfPages();
			for (var i = 1; i <= numberOfPages; i++) {
				doc.setPage(i);
				doc.text(375, 10, `Hoja: ${i}   De: ${doc.internal.getNumberOfPages()}`);
			}

			doc.save("PARTE DIARIA LT.pdf");
		},

		getReporteTransener: function (aDataFormatted) {
			// Issue #510 - Sort by ET
			aDataFormatted = _.sortBy(aDataFormatted, ['Tplnr']);

			var sFechaReporte = FormatHelper.formatDateLicenseWithoutUtc(new Date());
			var sTime = FormatHelper.getTimeStringWithoutUTC(new Date().getTime());

			this.registerDefine();
			var doc = new jsPDF({
				format: "a3",
				orientation: 'l',
				unit: "mm"
			});

			doc.page = 1;
			this.setImageToDocument(doc);
			doc.setFontSize(14);
			doc.setFontType("bold");
			doc.text(120, 15, `PARTE DIARIA DE LICENCIAS DE TRABAJO AUTORIZADAS (${this.sSolbeg})`);
			doc.setFontSize(8);
			doc.text(360, 15, `Fecha del Impresion ${sFechaReporte} ${sTime} `);
			var colLongs;
			var pageCount = doc.internal.pages;

			var headers;
			if (this.society == "100") {
				colLongs = [{
					"dataKey": "LT"
				}, {
					"dataKey": "Tplnr"
				}, {
					"dataKey": "Equnr"
				}, {
					"dataKey": "DescripcionEq"
				}, {
					"dataKey": "TrabajoFS"
				}, {
					"dataKey": "EntregaLT"
				}, {
					"dataKey": "CancelaLT"
				}, {
					"dataKey": "HPD"
				}, {
					"dataKey": "HPH"
				}, {
					"dataKey": "Comentarios"
				}];
				headers = [{
					LT: "L.T",
					Tplnr: "E.T",
					Equnr: "Código de Equipo",
					DescripcionEq: "Descripción",
					TrabajoFS: "Trabajo con equipo F/S",
					EntregaLT: "Entrega LT",
					CancelaLT: "Cancela LT",
					HPD: "Horario previsto (Desde)",
					HPH: "Horario previsto (Hasta)",
					Comentarios: "Observaciones Cammesa"
				}];
			} else {
				colLongs = [{
					"dataKey": "LT"
				}, {
					"dataKey": "Equnr"
				}, {
					"dataKey": "Descripcion"
				}, {
					"dataKey": "TrabajoFS"
				}, {
					"dataKey": "HPD"
				}, {
					"dataKey": "EntregaLT"
				}, {
					"dataKey": "HPH"
				}, {
					"dataKey": "CancelaLT"
				}, {
					"dataKey": "Comentarios"
				}];
				headers = [{
					LT: {
						content: "L.T.",
						rowSpan: 2,
						styles: {
							valign: 'center'
						}
					},
					Equnr: {
						content: "Equipo",
						rowSpan: 1,
						styles: {
							valign: 'center'
						}
					},
					Descripcion: {
						content: "Descripción",
						rowSpan: 1,
						styles: {
							valign: 'center'
						}
					},
					TrabajoFS: {
						content: "Trabajo a realizar",
						rowSpan: 1,
						styles: {
							valign: 'center'
						}
					},
					HPD: {
						content: "Horarios",
						colSpan: 4,
						styles: {
							halign: 'center'
						}
					},
					Comentarios: {
						content: "Observaciones Cammesa",
						rowSpan: 2,
						styles: {
							valign: 'center'
						}
					}

				}, {
					HPD: "Desde",
					EntregaLT: "Entregado",
					HPH: "Hasta",
					CancelaLT: "Cancelado"
				}];

			}

			doc.autoTable({
				head: headers,
				columns: colLongs,
				body: aDataFormatted,
				startY: 25,
				margin: {
					horizontal: 7,
					top: 30,
					bottom: 60
				},
				bodyStyles: {
					valign: 'top'
				},
				styles: {
					overflow: 'linebreak',
					cellWidth: 'wrap',
					tableWidth: 300,
					//lineWidth: 0.25
				},
				columnStyles: {
					Comentarios: {
						columnWidth: 80
					},
					text: {
						cellWidth: 'auto'
					}

				}
			});

			var numberOfPages = doc.internal.getNumberOfPages();

			for (var i = 1; i <= numberOfPages; i++) {
				doc.setPage(i);
				doc.text(392, 10, `Hoja: ${i}   De: ${doc.internal.getNumberOfPages()}`);
			}

			doc.save("PARTE DIARIA LT.pdf");
		},

		createPDFReportDiaryPart: function (aData) {
			this.society === "100" ? "TRANSENER" : "TRANSBA";
			this.createPDF(aData);
		},

		errorPDFReportDiaryPart: function (error) { },

		loadDeliveryDevolucionModelData: function (data) {
			AppManagementHelper.getModel();

		},

		formatAndShowData: function (data) {
			this.loadDeliveryDevolucionModelData(data);
			var boxes = [];
			if (data.Descripcion) {
				boxes.push({
					text: "Descripción del trabajo: " + data.Descripcion,
					growFactor: 3
				});
			}
			if (data.Solictext) {
				boxes.push({
					text: "Comentarios del solicitante: " + data.Solictext
				});
			}
			if (data.Equiinterv) {
				boxes.push({
					text: "Equipo a Intervenir: " + data.Equiinterv
				});
			}
			if (data.interventionType) {
				boxes.push({
					text: "Intervenir: " + data.interventionType
				});
			}
			if (data.Tiemporep) {
				boxes.push({
					text: "Tiempo de Reposición: " + FormatterHelper.FormatTiempoRepText(data.Tiemporep)
				});
			}
			var rDisparo = data.Rdisparo === "X" ? "SI" : "NO";
			boxes.push({
				text: "Riesgo de Disparo: " + rDisparo
			});
			if (boxes.length) {
				this.getView().setModel(new sap.ui.model.json.JSONModel(data.dias), "preVisualization");
				this.showMsgStrip(boxes);
			}
		},

		showMsgStrip: function (boxes) {
			var hBox = this.byId("jobDescriptionPanelHBox");
			if (hBox.getItems().length) {
				hBox.destroyItems();
			}

			if (boxes.length) {
				this._generateMsgStrip(boxes);
			} else {
				this.getView().getModel("preVisualization").setData([]);
			}
		},

		destroyMsgStrip: function () {
			var oMs = this.byId("msgStrip");

			if (oMs) {
				oMs.destroy();
			}
		},

		_generateMsgStrip: function (boxes) {
			var hBox = this.getView().byId("jobDescriptionPanelHBox");
			var oController = this;
			boxes.forEach(function (element, index) {
				var oMsgStrip = new sap.m.MessageStrip({
					height: "100%",
					id: oController.getView().createId("msgStrip" + index),
					text: element.text,
					showIcon: false,
					type: "Information",
					showCloseButton: false,
					layoutData: new sap.m.FlexItemData({
						baseSize: "0",
						growFactor: element.growFactor || 1
					})
				}).addStyleClass("customMessageStrip");
				hBox.addItem(oMsgStrip);
			});
		},

		decline: function () {

		},

		finishedBinding: function (oEvent) {
			console.log("aja")
			var aFilter = [];
			var tipoLicenciaFilter = null;
			var checkedLic = AppManagementHelper.getModel("FilterSelectionJsonModel").getProperty("/checkedLic");
			var checkedSol = AppManagementHelper.getModel("FilterSelectionJsonModel").getProperty("/checkedSol");
			if (checkedLic && checkedSol) {
				tipoLicenciaFilter = null;
			} else if (checkedLic) {
				tipoLicenciaFilter = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.Contains, "L");
			} else if (checkedSol) {
				tipoLicenciaFilter = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.Contains, "S");
			}
			if (tipoLicenciaFilter)
				this.getLicenseTable().getBinding("items").filter([tipoLicenciaFilter]);
		},

		changedChecks: function (oEvent) {
			this.makeFilters(oEvent)
		},
		//Equipments inside ET
		loadEquipmentsModel: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			var object = {};
			object.Equipos = [{
				key: 0,
				text: "Seleccione Estación"
			}];
			oModel.setData(object);
			this.getView().setModel(oModel, "Equipos");
		},

		loadStationsModel: function () {
			StationService.load(
				jQuery.proxy(this.onSuccessLoad("Estaciones"), this),
				jQuery.proxy(this.onErrorLoad("Estaciones"), this)
			);
		},

		loadPersonsModel: function () {
			PersonsService.load(
				jQuery.proxy(this.onSuccessLoad("Persons"), this),
				jQuery.proxy(this.onErrorLoad("Persons"), this)
			);
		},

		loadRepositionTimeModel: function () {
			RepositionTimeService.getPromise()
				.then(this.onSuccessLoad("RepositionTimes").bind(this),
					this.onErrorLoad("RepositionTimes").bind(this)
				);
		},

		loadJobCondModel: function () {
			JobCondService.getPromise()
				.then(this.onSuccessLoad("JobConditions").bind(this),
					this.onErrorLoad("JobConditions").bind(this)
				);
		},
		loadTramitacionsModel: function () {
			TramitacionMasivaService.getPromise()
				.then(this.onSuccessLoad("TramitacionMasiva").bind(this),
					this.onErrorLoad("TramitacionMasiva").bind(this)
				);
		},

		loadTipoIntModel: function () {
			InterventionTypesService.getPromise()
				.then(this.onSuccessLoad("TiposIntervencion").bind(this),
					this.onErrorLoad("TiposIntervencion").bind(this)
				);
		},

		loadStacionalListModel: function () {
			TipoOfEstacionalListService.getPromise()
				.then(this.onSuccessLoad("EstacionalListSet").bind(this),
					this.onErrorLoad("EstacionalListSet").bind(this)
				);
		},

		getEquiposModel: function () {
			var jsonModel = this.getView().getModel("Equipos");
			//checks if model exists
			if (!jsonModel) {
				jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setSizeLimit(9999);
				//sets model
				this.getView().setModel(jsonModel, "Equipos");
			}
			return jsonModel;
		},

		onStationChanged: function (oEvent) {
			var model = this.getEquiposModel();
			var equipments = oEvent.getParameter("selectedItem").getBindingContext("Estaciones").getProperty("Equipos");
			equipments.unshift({
				key: "0",
				text: "Seleccione uno"
			});
			model.setData({
				Equipos: equipments
			});
			//change to set region with selected equipment custom data?
		},

		loadRegionsModel: function () {
			RegionService.load(
				jQuery.proxy(this.onSuccessLoad("Regiones"), this),
				jQuery.proxy(this.onErrorLoad("Regiones"), this)
			);
		},

		onSuccessLoad: function (model) {
			return function (data) {
				var results = data.results;
				var oModel = new sap.ui.model.json.JSONModel();
				var object = {};
				object[model] = results;
				AppManagementHelper.getModel(model).setData(object);
				//oModel.setData(object);
				//this.getView().setModel(oModel, model);
			};
		},
		onErrorLoad: function (model) {
			return function (error) {

			};
		},

		//TODO ESTO POR SI EL CLIENTE LA SUEÑA
		onDetailOpen: function (oEvent) {
			this.requestDialog = null;
			//dialog will get deleted when changing pages, so if you open it again, it will be blank
			this.processingDialog = null;
			var item = oEvent.getSource().getParent();
			var license = this.getView().getModel("LicenciaData").getData().LicenciaData[item.getParent().indexOfItem(item)];
			var modelData = license;
			modelData.type = license.tipo;
			modelData.principalTab = true;
			modelData.securityTab = false;
			modelData.commentsTab = false;
			modelData.tramitationTab = false;
			modelData.transferenceTab = false;
			modelData.deliveryAndNormlizationTab = false;
			modelData.observationsTab = false;
			var detailModel = new sap.ui.model.json.JSONModel(modelData); //load default dialog model
			NavigationHelper.to({
				pageId: "Transener.Operaciones.LicenciasTrabajo.views.Main.Details.Details",
				model: detailModel
			});
		},

		downloadLicenses: function () {
			BusyDialogHelper.open();
			var aData = [];
			// Issue 558 - Se requiere que el export de licencias no respete el paginado
			// Si hay items seleccionados se deben traer los mismos y si no hay se debe traer todos las licencias filtradas
			var aItems = this.getLicenseTable().getSelectedItems();
			if (aItems.length !== 0) {
				for (var oItem of aItems) {
					aData.push(oItem.getBindingContext("LicencesListJsonModel").getObject());
				}
			} else {
				aData = this.getView().getModel("LicencesListJsonModel").getData().Licenses;
			}
			ReportesHelper.createExcelLicencias(aData);
		},

		/*onDisableLicenses: function () {
			var items = this.byId("auditTable").getSelectedContexts();
		},*/

		/*onCancelledLicenses: function () {
			var items = this.byId("auditTable").getSelectedContexts();
		},*/

		clearAdvancedFilters: function () {
			models.createFiltersModel();
		},

		openAdvancedFilters: function () {

			var oFiltersModel = AppManagementHelper.getModel("FiltersJsonModel");
			var oHardCodeModel = AppManagementHelper.getModel("HardCodeModel");
			var PersonalHabilitadoModel = AppManagementHelper.getModel("PersonalHabilitadoModel");
			var oRepModel = AppManagementHelper.getModel("RepositionTimes");
			var pageName = "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.advancedFilters";
			var oController = this;
			var component = FioriComponentHelper.getComponent();
			var view = component.byId("App").byId(pageName);
			var oSelectModel = AppManagementHelper.getModel("SelectModel");
			var society = this.society
			TipoEquipoService.loadTipoEquipo(society);
			InterventionTypesService.getPromise();

			if (!view) {
				//creates view
				var viewId = component.byId("App").createId(pageName);
				view = sap.ui.jsview(viewId, pageName);
				//adds view to split app
				//create model?
				var oDialog = new sap.m.Dialog({
					title: "Filtros Avanzados",
					contentWidth: "60%",
					modal: true,
					content: view,
					buttons: [
						new sap.m.Button({
							text: "Cancelar",
							icon: "sap-icon://decline",
							press: [oController.closeAdvancedFilters, oController]
						}).addStyleClass("buttonInverted floatLeft"),
						new sap.m.Button({
							text: "Limpiar",
							icon: "sap-icon://document",
							press: [oController.clearAdvancedFilters, oController]
						}).addStyleClass("buttonInverted floatLeft"),
						new sap.m.Button({
							text: "Aplicar",
							icon: "sap-icon://search",
							press: [oController.makeFilters, oController]
						}).addStyleClass("buttonInverted floatRight")
					]
				}).addStyleClass("customDialog");
				oDialog.open();
				oDialog.setModel(AppManagementHelper.getModel("WorkPlacesJsonModel"), "WorkPlacesJsonModel");
				oDialog.setModel(this.getView().getModel("GrupoPlanificador"), "GrupoPlanificador");
				oDialog.setModel(AppManagementHelper.getModel("TiposIntervencion"), "TiposIntervencion");
				oDialog.setModel(AppManagementHelper.getModel("TipoEquipoJsonModel"), "TipoEquipoJsonModel");
				oDialog.setModel(oSelectModel, "SelectModel");
				oDialog.setModel(oFiltersModel, "FiltersJsonModel");
				oDialog.setModel(oHardCodeModel, "HardCodeModel");
				oDialog.setModel(PersonalHabilitadoModel, "PersonalHabilitadoModel");
				oDialog.setModel(oRepModel, "RepositionTimes");
				oDialog.setModel(this.getView().getModel("RepositionTimes"), "RepositionTimes");
				oDialog.setModel(AppManagementHelper.getModel("TipoLicFiltersModel"), "TipoLicFiltersModel");
				oDialog.setModel(AppManagementHelper.getModel("CheckAdvancedFiltersModel"), "CheckAdvancedFiltersModel");
				this.advancedFilters = oDialog;
				if (oDialog) {
					return true;
				}
			} else {
				if (this.advancedFilters) {
					this.advancedFilters.setModel(PersonalHabilitadoModel, "PersonalHabilitadoModel");
					this.advancedFilters.setModel(oSelectModel, "SelectModel");
					this.advancedFilters.setModel(oHardCodeModel, "HardCodeModel");
					this.advancedFilters.setModel(oFiltersModel, "FiltersJsonModel");
					this.advancedFilters.setModel(oRepModel, "RepositionTimes");
					this.advancedFilters.setModel(this.getView().getModel("RepositionTimes"), "RepositionTimes");
					this.advancedFilters.setModel(AppManagementHelper.getModel("WorkPlacesJsonModel"), "WorkPlacesJsonModel");
					this.advancedFilters.setModel(this.getView().getModel("GrupoPlanificador"), "GrupoPlanificador");
					this.advancedFilters.setModel(AppManagementHelper.getModel("TipoLicFiltersModel"), "TipoLicFiltersModel");
					this.advancedFilters.setModel(AppManagementHelper.getModel("CheckAdvancedFiltersModel"), "CheckAdvancedFiltersModel");
					this.advancedFilters.open();
					return true;
				}
			}

		},
		closeAdvancedFilters: function () {
			this.advancedFilters.close();
		},

		getFilterObject: function (attribute, sValue) {
			var oObject = {};
			switch (sValue) {
				case "0":
					oObject.attribute = "Senalestados";
					oObject.value = "X";
					break;
				case "1":
					oObject.attribute = "Senalalarmas";
					oObject.value = "X";
					break;
				case "2":
					oObject.attribute = "Senalmedicion";
					oObject.value = "X";
					break;
				case "3":
					oObject.attribute = "Precauciones";
					oObject.value = "X";
					break;
				case "4":
					oObject.attribute = "Senalninguna";
					oObject.value = "X";
					break;
				default:
					oObject.attribute = attribute
					oObject.value = sValue;
					break;
			}
			return oObject;

		},

		generateAdvancedFilters: function () {
			var oFilterDataModel = AppManagementHelper.getModel("FiltersJsonModel")
			var oFilterData = oFilterDataModel.getData();
			var aFilters = [];
			// RECORRIDO DE ATRIBUTOS 
			for (var attribute in oFilterData) {
				// en el recorrido del model de filtros, evaluamos los arrays para creacion de filtros multiples
				if (oFilterData[attribute]["value"] !== null && oFilterData[attribute]["value"].constructor === Array) {
					var aValues = oFilterData[attribute]["value"];
					if (aValues.length !== 0) {
						var aMultipleFilter = [];
						for (var value in aValues) {
							var oFilterValues = this.getFilterObject(attribute, aValues[value]);
							aMultipleFilter.push(new sap.ui.model.Filter(oFilterValues.attribute, sap.ui.model.FilterOperator[oFilterData[attribute][
								"operator"
							]], oFilterValues.value));
						}
						var oMultipleFilter = new sap.ui.model.Filter({
							filters: aMultipleFilter,
							and: true
						});
						aFilters.push(oMultipleFilter);
					}
				} else {

					/*if( attribute==="Equstat" ){
						if (oFilterData["Equstat"].value === "N") {
							oFilterData["Equstat"].value = "";
						} else if(oFilterData["Equstat"].value==="") {
							oFilterData["Equstat"].value = "N";
						}
					//	debugger;
					}*/

					if (this.acceptEmptyValues(attribute, oFilterData[attribute])) {
						// casos fechas null, no es vacio, porque el date tiene que ser null para presetarse sin nada.
						if (oFilterData[attribute]["value"] !== null) {
							// si es atributo fecha hora tratamiento especial
							//ya las fechas no llegan por aca
							/*if (attribute === "Solbeg" || attribute === "Solend") {
								//var oFormattedDate = moment(oFilterData[attribute]["value"].setHours(0, 0, 0, 0)).toDate();
								aFilters.push(new sap.ui.model.Filter(attribute, sap.ui.model.FilterOperator[oFilterData[attribute]["operator"]], oFilterData[
									attribute]["value"]));
							} else {*/
							// pusheado normal de todos los demas atributos con su filter operator y su valor tranca
							aFilters.push(new sap.ui.model.Filter(attribute, sap.ui.model.FilterOperator[oFilterData[attribute]["operator"]], oFilterData[
								attribute]["value"]));
							//}
						}
					}
				}
			}

			//aca calculo los filtros de fechas
			var localFilterData = AppManagementHelper.getModel("LocalFilterJsonModel").getData();
			if (localFilterData.WeekNumber) {
				//calculo las fechas de inicio y fin dada la semana y el anio
				let fechaDesde = DateHelper.getDateOfWeek(localFilterData.WeekNumber,
					oFilterData.Anio.value || new Date().getFullYear());
				//le sumo una semana a la fecha hasta
				let fechaHasta = new Date(fechaDesde.getTime() + 6 * 24 * 60 * 60 * 1000);

				aFilters.push(new sap.ui.model.Filter({
					path: "Solbeg",
					operator: sap.ui.model.FilterOperator.LE,
					value1: fechaDesde
				}));

				aFilters.push(new sap.ui.model.Filter({
					path: "Solend",
					operator: sap.ui.model.FilterOperator.GE,
					value1: fechaHasta
				}));

				//filtro para hacer que traiga todas las licencias abiertas entre las dos fechas anteriores
				aFilters.push(new sap.ui.model.Filter({
					path: "Idfinal",
					operator: sap.ui.model.FilterOperator.GE,
					value1: "X"
				}));
			} else {
				if (localFilterData.Solbeg) {
					aFilters.push(new sap.ui.model.Filter({
						path: "Solbeg",
						operator: sap.ui.model.FilterOperator.LE,
						value1: localFilterData.Solbeg
					}));
				}
				if (localFilterData.Solend) {
					aFilters.push(new sap.ui.model.Filter({
						path: "Solend",
						operator: sap.ui.model.FilterOperator.GE,
						value1: localFilterData.Solend
					}));
				}
			}
			//Si tiene fecha de inicio
			if (localFilterData.Solbeg2) {
				aFilters.push(new sap.ui.model.Filter({
					path: "Fechainicio",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: localFilterData.Solbeg2
				}));
			}

			return aFilters;
		},

		acceptEmptyValues: function (sAttribute, object) {
			switch (sAttribute) {
				case "Substatus":
					var oFilterData = AppManagementHelper.getModel("FiltersJsonModel").getData();
					var sKey = oFilterData.Licstat.value;
					if (object.value === "" && sKey === "01") {
						object.value = "Z";
						return true
					} else {
						if (object.value !== "") {
							return true
						} else {
							return false
						}

					}
					return true;
				case "Equstatnocam":
				case "Equstat":
					return true;
				case "Bloqueo":
					return true;
				case "Rdisparo":
					return true;
				default:
					return object.value !== "";
			}
		},

		onCleanFilters: function () {
			AppManagementHelper.getModel("EnabledFilterLicstat").setData({
				enabled: true
			});
			var sPath = FioriHelper.getAppPath();
			AppManagementHelper.getModel("LocalFilterJsonModel").setData({});
			var FiltersJsonModel = AppManagementHelper.getModel("FiltersJsonModel");
			FiltersJsonModel.loadData(sPath + "model/FiltersJsonModel.json", "", false);
			var filters = [];
			filters.push(new sap.ui.model.Filter({
				path: "Empresa",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.society
			}));
			LicenseService.GET(filters);
			this.localFiltering();
			AppManagementHelper.getModel("filtrosAplicadosTextVisibleModel").setProperty("/Data", false);
			this.cleanSelections()
		},

		validateLicenseStatus: function () {
			var oFilterData = AppManagementHelper.getModel("FiltersJsonModel").getData();
			var sKey = oFilterData.Licstat.value;
			if (sKey === "90" || sKey === "91" || sKey === "92" || sKey === "10") {
				oFilterData.Licstat.value = "01";
			}
		},

		makeFilters: function (oEvent) {
			this._oActGrowInfo = this.getView().byId("auditTable").getGrowingInfo().actual;
			if (typeof oEvent === 'number') {
				// Issue 548 - Si la vista esta filtrada ( vista NO Original ) y se ingresa a una licencia al momento de volver se debe retomar la vista filtrada
				// previamente siempre volvia a la original sin importar si se habia filtrado antes
				var vistaSeleccionada = AppManagementHelper.getModel("vistaSeleccionada").getData().vista;
				if (vistaSeleccionada === "undefined") {
					vistaSeleccionada = 0;
				}
				//		var vistaSeleccionada = 0;
			} else {
				vistaSeleccionada = oEvent.getSource().mProperties.key !== undefined ? oEvent.getSource().getProperty("key") : "0";

			}
			// vistaSeleccionada = 0 -> vista Original
			// vistaSeleccionada = 1 -> LTs de Equipos de EETT
			// vistaSeleccionada = 2 -> Salidas y Líneas
			AppManagementHelper.getModel("vistaSeleccionada").setData({
				'vista': vistaSeleccionada
			});
			this.validateLicenseStatus();

			if (this.advancedFilters) {
				this.advancedFilters.close();
			}
			var aFilters = this.generateAdvancedFilters();
			aFilters.push(new sap.ui.model.Filter({
				path: "Empresa",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.society
			}));

			aFilters.push(new sap.ui.model.Filter({
				path: "Vista",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vistaSeleccionada
			}));

			if (vistaSeleccionada === "2" || vistaSeleccionada === "1") {
				var bDontFilter = true;
			} else {
				bDontFilter = false;
			}

			// Issue 548 - Cuando se llama a esta funcion y se esta selecciónando vista 1 y 2  no se debe ordenar 
			// ya que el orden lo da back end , para eso se utilizo el parametro dontFilter
			LicenseService.GETWithFilters(aFilters, bDontFilter);
			this.localFiltering();
			// 👇 solo limpia si NO pedimos “saltarlo” desde Tramitación Masiva
			if (!this._skipCleanSelectionsOnce) {
				this.cleanSelections();
			} else {
				this._skipCleanSelectionsOnce = false; // consumir el “pase”
			}
		},

		cleanSelections: function () {
			if (this._skipCleanSelectionsOnce) { this._skipCleanSelectionsOnce = false; return; }
			this.getView().byId("auditTable").removeSelections(true);
		},


		getEval: function (filterExtendedWithoutWerks) {
			var filterData = filterExtendedWithoutWerks;
			var localFilterData = AppManagementHelper.getModel("LocalFilterJsonModel").getData();

			var filtrosEnviados = []; //Hago un rejunte de los filtros que se agregan de distintos modelos y los pongo en un solo lado
			for (var item in filterData) { //Hago un rejunte de los filtros que se agregan de distintos modelos y los pongo en un solo lado
				if (item === "Tplnr" && filterData["Tplnr"].values !== undefined) {
					filtrosEnviados.push({
						attribute: item,
						value: filterData[item].values[0]
					});
				}
				//	filtrosEnviados.push(filterData[item].value);
				filtrosEnviados.push({
					attribute: item,
					value: filterData[item].value
				})
			}
			for (var item in localFilterData) { //Hago un rejunte de los filtros que se agregan de distintos modelos y los pongo en un solo lado
				//filtrosEnviados.push(localFilterData[item]);
				filtrosEnviados.push({
					attribute: item,
					value: localFilterData[item]
				})
			}
			var Eval = filtrosEnviados.some(function (item) {
				if (item.attribute === "Equstat" || item.attribute === "Equstatnocam") {
					return item.value === "" || item.value === "X"
				} else if (item.attribute === "Aro") {
					return item.value !== "Z"
				} else {
					return item.value !== undefined && item.value !== null && item.value !== "" && item.value !== " " && item.value.length !== 0 &&
						item.value !== "N"
				}
			});
			if (Eval) {
				return true;
			} else {
				return false;
			}

		},

		setColor: function () {
			var oFilterData = AppManagementHelper.getModel("FiltersJsonModel").getData();
			var bHasWerks = oFilterData.Werks.value !== "";
			var oExtendFilters = $.extend({}, AppManagementHelper.getModel("FiltersJsonModel").getData())
			delete oExtendFilters.Werks;

			//si tengo werks y no tengo filtros

			if (bHasWerks && !this.getEval(oExtendFilters)) {
				return "yellow"
			}
			//si no tengo werks y tengo filtros
			if (!bHasWerks && this.getEval(oExtendFilters)) {
				return "red"
			}

			if (bHasWerks && this.getEval(oExtendFilters)) {
				return "red"
			}

			if (!bHasWerks && !this.getEval(oExtendFilters)); {
				return "white"
			}

			return "white"
		},

		localFiltering: function () {
			var filterData = AppManagementHelper.getModel("FiltersJsonModel").getData();
			var localFilterData = AppManagementHelper.getModel("LocalFilterJsonModel").getData();

			var filtrosEnviados = []; //Hago un rejunte de los filtros que se agregan de distintos modelos y los pongo en un solo lado
			for (var item in filterData) { //Hago un rejunte de los filtros que se agregan de distintos modelos y los pongo en un solo lado
				if (item === "Tplnr" && filterData["Tplnr"].values !== undefined) {
					filtrosEnviados.push({
						attribute: item,
						value: filterData[item].values[0]
					});
				}
				//	filtrosEnviados.push(filterData[item].value);
				filtrosEnviados.push({
					attribute: item,
					value: filterData[item].value
				})
			}
			for (var item in localFilterData) { //Hago un rejunte de los filtros que se agregan de distintos modelos y los pongo en un solo lado
				//filtrosEnviados.push(localFilterData[item]);
				filtrosEnviados.push({
					attribute: item,
					value: localFilterData[item]
				})
			}
			var Eval = filtrosEnviados.some(function (item) {
				if (item.attribute === "Equstat" || item.attribute === "Equstatnocam") {
					return item.value === "" || item.value === "X"
				} else if (item.attribute === "Aro") {
					return item.value !== "Z"
				} else {
					return item.value !== undefined && item.value !== null && item.value !== "" && item.value !== " " && item.value.length !== 0 &&
						item.value !== "N"
				}
			});
			if (Eval) {
				AppManagementHelper.getModel("filtrosAplicadosTextVisibleModel").setProperty("/Data", true);
			} else {
				AppManagementHelper.getModel("filtrosAplicadosTextVisibleModel").setProperty("/Data", false);
			}

			AppManagementHelper.getModel("ColorModel").setProperty("/Color", this.setColor());
			let tipoEquipos = filterData.Tipoequipo.values;

			let filters = [];

			if (tipoEquipos && tipoEquipos.length) {
				let tipoEquiposArrayFilters = [];
				tipoEquipos.forEach(estacion => {
					tipoEquiposArrayFilters.push(new sap.ui.model.Filter({
						path: "Tipoequipo",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: estacion
					}));
				});
				let tipoEquiposFilter = new sap.ui.model.Filter(tipoEquiposArrayFilters, false);
				filters.push(tipoEquiposFilter);
				this.tipoEquiposFilter = tipoEquiposFilter;
				//aFilters.push(estacionesFilter);
			} else {
				this.tipoEquiposFilter = null;
			}
			let estaciones = filterData.Tplnr.values;
			if (estaciones && estaciones.length) {
				let estacionesArrayFilters = [];
				estaciones.forEach(estacion => {
					estacionesArrayFilters.push(new sap.ui.model.Filter({
						path: "Tplnr",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: estacion
					}));
				});
				let estacionesFilter = new sap.ui.model.Filter(estacionesArrayFilters, false);
				filters.push(estacionesFilter);
				this.estacionesFilter = estacionesFilter;
				//aFilters.push(estacionesFilter);
			} else {
				this.estacionesFilter = null;
			}
			let timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
			if (localFilterData.WeekNumber) {
				// Si el año está seleccionado como filtro lo toma, sino toma el año actual
				var Anio = filterData.Anio.value ? filterData.Anio.value : new Date().getFullYear();
				var semanaAFiltrarInicio = DateHelper.getDateOfWeek(localFilterData.WeekNumber, Anio);
				var semanaAFiltrarFin = new Date(new Date(semanaAFiltrarInicio).setDate(semanaAFiltrarInicio.getDate() + 7));

				this.localFilters.fechaInicio = semanaAFiltrarInicio ? new sap.ui.model.Filter({
					path: "Solbeg",
					operator: sap.ui.model.FilterOperator.GE,
					value1: new Date(semanaAFiltrarInicio - timeZoneOffset)
				}) : null;

				this.localFilters.fechaFin = semanaAFiltrarFin ? new sap.ui.model.Filter({
					path: "Solend",
					operator: sap.ui.model.FilterOperator.LE,
					value1: new Date(semanaAFiltrarFin - timeZoneOffset)
				}) : null;
				/*
				//si hay una semana elegida, entonces tengo que armar los filtros de fechas como locales
				this.localFilters.fechaInicio = localFilterData.Solbeg ? new sap.ui.model.Filter({
					path: "Solbeg",
					operator: sap.ui.model.FilterOperator.GE,
					value1: new Date(localFilterData.Solbeg - timeZoneOffset)
				}) : null;
	
				this.localFilters.fechaFin = localFilterData.Solend ? new sap.ui.model.Filter({
					path: "Solend",
					operator: sap.ui.model.FilterOperator.LE,
					value1: new Date(localFilterData.Solend - timeZoneOffset)
				}) : null;
				*/
			} else {
				/*
				this.localFilters.fechaInicio = null;
				this.localFilters.fechaFin = null;
				*/

				this.localFilters.fechaInicio = localFilterData.Solbeg ? new sap.ui.model.Filter({
					path: "Solbeg",
					operator: sap.ui.model.FilterOperator.LE,
					value1: new Date(localFilterData.Solbeg)
				}) : null;

				this.localFilters.fechaFin = localFilterData.Solend ? new sap.ui.model.Filter({
					path: "Solend",
					operator: sap.ui.model.FilterOperator.GE,
					value1: new Date(localFilterData.Solend)
				}) : null;
			}

			if (this.textSearchFilter) filters.push(this.textSearchFilter);
			if (this.tipoLicenciaFilter) filters.push(this.tipoLicenciaFilter);
			/*	if (this.localFilters.fechaInicio) filters.push(this.localFilters.fechaInicio);
				if (this.localFilters.fechaFin) filters.push(this.localFilters.fechaFin);*/
			this.getView().byId("auditTable").getBinding("items").filter(filters);

			/*var filtros = [a,b,c,d,e,f,g,h,i,j,k,l,ll,m,n,o,p,q,r,s,t,u,v,w,x,y,z];
			var Eval = filtros.some(function(item){ return item!==undefined && item!==null && item!=="" && item!==" " && item.length!==0 });
			return Eval;*/
		},

		//AppManagementHelper.getModel("LicenseJsonModel").setData(oLicense);
		//LicenseService.FIND(licencia);

		/*	cleanSolbeg: function (oEvent) {
				AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Solbeg/value",oEvent.getSource().getDateValue())
			},*/

		setLicenseType: function (tipo) {
			if (tipo === "licencia") {
				this.addStyleClass("isLicense");
				this.removeStyleClass("isRequest");
				return "sap-icon://form";
			} else {
				this.addStyleClass("isRequest");
				this.removeStyleClass("isLicense");
				return "sap-icon://request";
			}
		},

		setStatusColor: function (status, substatus) {
			this.toggleStyleClass("acceptedStatus", status == "01" || status === "28");
			this.toggleStyleClass("cancelledStatus", status == "04" || status == "10" || status == "11");
			this.toggleStyleClass("rejectedStatus", status == "06");
			this.toggleStyleClass("disabledStatus", status == "03");
			this.toggleStyleClass("observedStatus", status == "02");
			this.toggleStyleClass("deliveredStatus", status == "08" || status == "30" || status == "05");
			this.toggleStyleClass("inTransit", status == "23");
			this.toggleStyleClass("toCoordinateStatus", status == "09");
			this.toggleStyleClass("toTramitacion", status == "07");

			if (status === "01") {
				this.toggleStyleClass("deliveredStatusAutorized", substatus === "E");
				this.toggleStyleClass("cancelledStatus", substatus === "F");
				return FormatterHelper.getApprovalSubstatus(status, substatus)
			} else {
				return FormatterHelper.getStatusName(status);
			}

		},

		dateToDayMonthYear: function (date) {
			return date ? date.toISOString().slice(0, 10) : "";
		},

		dateRangeTime: function (from, to) {
			return (from ? from.toISOString().slice(11, 16) : "") +
				" - " +
				(to ? to.toISOString().slice(11, 16) : "");
		},

		setLicenseTable: function (oTable) {
			this._oLicenseTable = oTable;
		},

		getLicenseTable: function () {
			return this._oLicenseTable;
		},

		cleanInputSearch: function (oEvent) {
			var aFilter = [];
			if (oEvent.getParameter("value") === "") {
				if (!sap.ui.getCore().byId("licenseFilter").getSelected()) {
					aFilter.push(new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.Contains, "S"));
				}
				if (!sap.ui.getCore().byId("requestFilter").getSelected()) {
					aFilter.push(new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.Contains, "L"));
				}
				this.getLicenseTable().getBinding("items").filter(aFilter);
			}
		},
		downloadNegreo: function (oData) {

			if (window.define) {
				var temp = define.amd;
				define.amd = false;
			}
			jQuery.sap.registerModulePath("index", "https://unpkg.com/jspdf@1.5.3/dist/");
			jQuery.sap.require({
				modName: "index.jspdf",
				type: "debug"
			});
			if (window.define) define.amd = temp;

			var doc = new jsPDF("p", "pt", [595, 1600], true);
			console.log(doc);

			//BORDER-BODY
			//doc.text(20, 20, 'Hello landscape world!');
			doc.rect(20, 50, 550, 1500);

			//Primer cuadro y lineas
			doc.rect(20, 50, 550, 60);
			doc.setLineWidth(0.5);
			doc.line(205, 50, 205, 110);
			doc.line(380, 50, 380, 110);

			doc.text(30, 80, 'LOGO TRANSENER.');

			doc.setFontSize(12);
			doc.text(250, 75, 'SOLICITUD DE');
			doc.text(220, 100, 'LICENCIA DE TRABAJO');

			doc.setFontSize(20);
			doc.text(400, 90, 'N°: 2019-1546');

			doc.setFontSize(10);
			doc.text(30, 130, 'Fecha:');
			doc.text(70, 130, '27/02/2019');

			doc.setFontSize(10);
			doc.text(30, 150, 'Solicitante:');
			doc.text(80, 150, 'GARRIDO, Roberto Raúl ');

			//IZQ COMMENT
			doc.setFontSize(10);
			doc.text(250, 150, 'Jefe de Trabajo:');
			doc.text(330, 150, ' ANGELONI, Julio César');

			doc.setFontSize(10);
			doc.text(250, 170, 'Jefe de Trabajo Suplente:');
			doc.text(365, 170, 'MONACO, Antonio');

			doc.setFontSize(10);
			doc.text(250, 190, 'Recibio:');
			doc.text(350, 190, 'Recibio');

			doc.setFontSize(10);
			doc.text(250, 210, 'ET:');
			doc.text(280, 210, 'Recibio');

			//DER COMMENT

			doc.setFontSize(10);
			doc.text(30, 190, 'Transmitio:');
			doc.text(80, 190, 'ANGELONI, Julio César');

			doc.setFontSize(10);
			doc.text(30, 210, 'Equipo');
			doc.text(80, 210, '5EZHE1');

			doc.setFontSize(10);
			doc.text(30, 230, 'Trabajos a Realizar');
			doc.text(120, 230, '5EZHE1');

			//DEL DIA FECHA HORA
			doc.setFontSize(10);
			doc.text(30, 310, 'Del Día:');
			doc.text(80, 310, 'Jueves');

			doc.setFontSize(10);
			doc.text(30, 330, 'Al Día:');
			doc.text(80, 330, 'Viernes');

			doc.setFontSize(10);
			doc.text(200, 310, 'Fecha:');
			doc.text(240, 310, '28/02/2019');

			doc.setFontSize(10);
			doc.text(200, 330, 'Fecha:');
			doc.text(240, 330, '15/03/2019');

			doc.setFontSize(10);
			doc.text(350, 310, 'Hora:');
			doc.text(390, 310, '16:00');

			doc.setFontSize(10);
			doc.text(350, 330, 'Hora:');
			doc.text(390, 330, '16:00');

			//CONDICIONES DE TRABAJO RECTANGULO
			doc.rect(20, 355, 250, 20);
			doc.text(30, 370, 'CONDICIONES DEL TRABAJO');
			doc.setLineWidth(1);
			doc.line(270, 360, 580, 360);

			//CONDICIONES DE TRABAJO RECTANGULO(CONTENIDO)
			doc.text(30, 390, 'Seguridad:');
			doc.text(90, 390, 'Respuesta');
			doc.text(30, 410, 'Tierras Adicionales:');
			doc.text(120, 410, 'Respuesta');

			doc.text(220, 410, 'Tiempo de Reposición:');
			doc.text(330, 410, 'Respuesta');
			//MEDIDAS DE SEGURIDAD
			doc.rect(20, 425, 250, 20);
			doc.text(30, 440, 'MEDIDAS DE SEGURIDAD');
			doc.setLineWidth(1);
			doc.line(270, 430, 580, 430);

			//MEDIDAS DE SEGURIDAD(CONTENIDO)
			doc.setFontSize(10);
			doc.setFont('times');
			doc.text(30, 470, 'Condiciones especiales');
			doc.text(30, 485, 'Riesgo de Disparo');

			doc.text(30, 515, 'Interruptores abiertos y en local');
			doc.text(30, 530, 'Seccionadores Abiertos Bloqueados y');
			doc.text(30, 545, 'Trabados');
			doc.text(30, 560, 'Sec. de Puesta a Tierra Cerrados');
			doc.text(30, 575, 'Bloqueo de Recierres');
			doc.text(30, 590, 'Interruptores que no deben operarse');
			doc.text(30, 605, 'Otras Precauciones de Seguridad /');
			doc.text(30, 620, 'Puestas a Tierra Adicionales');

			doc.text(30, 635, 'Se maniobraran equipos');
			doc.text(30, 650, '/ Pruebas Funcionales');

			//SEÑALES
			doc.setFont('helvetica');
			doc.rect(30, 670, 110, 20);
			doc.text(40, 685, 'SEÑALES');
			doc.setLineWidth(1);
			doc.line(140, 680, 580, 680);

			//SEÑALES(CONTENIDO)
			doc.setFont('times');
			doc.text(40, 710, 'Estados');
			doc.text(90, 710, 'NO');
			doc.text(40, 725, 'Alarmas');
			doc.text(90, 725, 'SI');

			doc.text(130, 710, 'Mediciones');
			doc.text(180, 710, 'NO');
			doc.text(130, 725, 'Desmarca');
			doc.text(180, 725, 'NO');

			//AUTORIZACION
			doc.rect(20, 740, 250, 20);
			doc.setFont('helvetica');
			doc.text(30, 750, 'AUTORIZACION');
			doc.setLineWidth(1);
			doc.line(270, 745, 580, 745);

			//AUTORIZACION(CONTENIDO)
			doc.setFont('times');
			doc.text(30, 780, 'Autorización');
			doc.text(30, 795, 'Fecha');
			doc.text(30, 810, 'Autorizado por');
			doc.text(30, 825, 'Recibió');

			//CUADRO COORDINACION sin limitacion
			doc.rect(20, 840, 550, 60);

			//COORDINACION
			doc.rect(20, 840, 150, 20);
			doc.setFont('helvetica');
			doc.setFontSize(9);
			doc.text(50, 850, 'COORDINACION');

			//sin limitacion
			doc.rect(420, 840, 150, 20);
			doc.setFont('helvetica');
			doc.setFontSize(9);
			doc.text(450, 850, 'sin limitacion');

			//Empresa Aviso Recibio Fecha_Aut Hora Autorizo Recibio
			doc.setFont('times');
			doc.setFontSize(9);
			doc.text(30, 880, 'Empresa');
			doc.text(80, 880, 'Fecha');
			doc.text(130, 880, 'Hora');
			doc.text(180, 880, 'Aviso');
			doc.text(230, 880, 'Recibio');
			doc.text(280, 880, 'Fecha');
			doc.text(330, 880, 'Aut Hora');
			doc.text(380, 880, 'Autorizo');
			doc.text(430, 880, 'Recibio');
			doc.text(480, 880, 'Autorizado');

			//Sector Nombre Fecha usuario
			doc.rect(20, 920, 550, 50);
			doc.text(30, 935, 'Sector');
			doc.text(130, 935, 'Sector');
			doc.text(380, 935, 'Fecha');
			doc.text(480, 935, 'Usuario');

			doc.rect(30, 990, 530, 90);

			//ENTREGAS Y NORMALIZACIONES DIARIAS DEL EQUIPO
			doc.rect(40, 1000, 150, 25);
			doc.line(195, 1010, 560, 1010);
			doc.setFont('helvetica');
			doc.setFontSize(8);
			doc.text(55, 1010, 'ENTREGAS Y NORMALIZACIONES');
			doc.text(55, 1020, 'DIARIAS DEL EQUIPO');

			//Numero Licencia:
			doc.text(60, 1040, 'Numero Licencia');
			doc.text(180, 1040, 'Año:');

			doc.text(100, 1055, 'ENTREGADO');

			doc.text(60, 1065, 'Fecha/Hora');
			doc.text(110, 1065, 'CC');
			doc.text(160, 1065, 'Tecnico/JT/JTG');
			doc.text(240, 1065, 'Folio');
			doc.text(290, 1065, 'Licencia');

			doc.text(345, 1065, 'Fecha/Hora');
			doc.text(395, 1065, 'CC');
			doc.text(440, 1065, 'Tecnico/JT/JTG');

			doc.line(330, 1010, 330, 1080);

			//TRANSFERENCIA CUADRO CHICO
			doc.rect(40, 1090, 150, 25);
			//TRANSFERENCIA CUADRO GRANDE
			doc.rect(30, 1090, 530, 60);
			doc.line(195, 1100, 560, 1100);

			doc.text(40, 1105, 'TRANSFERENCIA');

			doc.text(40, 1130, 'Nuevo jefe de Trabaj');
			doc.text(240, 1130, 'Fecha');
			doc.text(380, 1130, 'Hora');

			//OBSERVACIONES

			doc.rect(40, 1170, 150, 25);
			doc.setFontSize(8);
			doc.text(50, 1190, 'OBSERVACIONES');
			doc.line(195, 1180, 570, 1180);

			doc.line(195, 1210, 550, 1210);
			doc.line(195, 1230, 550, 1230);

			//FIN
			doc.output('dataurlnewwindow');
		},

		removeJump: function (text) {
			return text.replace(/(\r\n|\n|\r)/gm, " ");
		},

		rolEdition: function (controlPath, callback) {
			return RolAuthorizationHelper.rolEdition(controlPath, callback);
		},

		rolVisualization: function (controlPath, callback) {
			return RolAuthorizationHelper.rolVisualization(controlPath, callback);
		},

		setDupState: function (type) {
			return type === "L"
		},

		loadStatusModel: function () {
			let statusModel = new sap.ui.model.json.JSONModel({
				statuses: StatusService.get()
			});
			this.getView().setModel(statusModel, "StatusModel");
		},

		reportLicenseComparison: function () {
			let selectedLicenses = this.getLicenseTable().getSelectedContexts()

				.map(x => x.getObject());
			if (selectedLicenses.length === 0) {
				new sap.m.MessageToast.show('No ha seleccionado solicitudes/Licencias');
				return
			}
			for (var valor of selectedLicenses) {
				if (valor.Tipo === "S") {
					new sap.m.MessageToast.show('No es posible comparar solicitudes con licencias');
					return
				}
			}
			ReportesHelper.licenseComparison(selectedLicenses);
		},

		exportMultipleLics: function () {
			var aLicenciasSelected = this.getLicenseTable().getSelectedContexts().map(x => x.getObject());
			$.map(x => x.getObject());
			if (aLicenciasSelected.length === 0) {
				new sap.m.MessageToast.show('No ha seleccionado Solicitudes/Licencias');
				BusyDialogHelper.close();
				return
			}

			var oModel = AppManagementHelper.getModel("ExportMultiLicsModel");
			oModel.setData({
				ExportType: true
			});

			this.reportDialog = new sap.m.Dialog({
				type: sap.m.DialogType.Message,
				title: "Exportar",
				escapeHandler: function (oPromise) {
					oPromise.reject();
				},
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.RadioButtonGroup({
								columns: 2,
								buttons: [
									new sap.m.RadioButton({
										text: "Normal",
										selected: "{ExportMultiLicsModel>/ExportType}"
									}),
									new sap.m.RadioButton({
										text: "Simplificado",
										selected: "{= !${ExportMultiLicsModel>/ExportType}}"
									})
								]
							})
						]
					})
				],
				buttons: [
					new sap.m.Button({
						icon: "sap-icon://save",
						type: sap.m.ButtonType.Emphasized,
						text: "Aceptar",
						press: [this.downloadExportMultipleLics, this]
					}),
					new sap.m.Button({
						icon: "sap-icon://decline",
						type: sap.m.ButtonType.Emphasized,
						text: "Cerrar",
						press: [this.closeReportDialog, this]
					})
				]
			});
			this.reportDialog.setModel(oModel, "ExportMultiLicsModel");
			this.reportDialog.open();
		},

		downloadExportMultipleLics: function () {
			var aLicenciasSelected = this.getLicenseTable().getSelectedContexts().map(x => x.getObject());
			let oModelExportMultiLicsModel = AppManagementHelper.getModel("ExportMultiLicsModel").getData();

			// Formato completo - "Normal"
			if (oModelExportMultiLicsModel.ExportType) {
				BusyDialogHelper.open();
				ReportesService.getLicenciasFullData(aLicenciasSelected).then((aLicenciasFull) => {
					var aLicenciasSelectedFull = aLicenciasFull;

					var aPDFNormalContent = [];

					//Por cada licencia hacer una exportacion
					aLicenciasSelectedFull.map(function (lic) {
						var unifilares = {
							"results": []
						};
						var licencia = lic;
						var Colocaciones = lic.ColocacionPAT_nav.results;


						var Retiros = lic.RetiroPAT_nav.results;
						var Habilitaciones = lic.HabilitacionRecierre_nav.results;
						var Inhibiciones = lic.InhibicionRecierre_nav.results;
						var Entregas = lic.EntregasLicencia_nav.results;
						var Devoluciones = lic.DevolucionLicencia_nav.results;
						var Suspensiones = lic.SuspensionLicencia_nav.results;
						var Reanudaciones = lic.ReanudacionLicencia_nav.results;
						var Observaciones = lic.ObservacionesLicencia_nav.results;
						var Coordinaciones = lic.CoordinacionesLicencia_nav.results;
						var Tramitaciones = lic.TramitacionesLicencia_nav.results;
						var Transferencias = lic.TransferenciaJefeTrabajo_nav.results;

						licencia.Timbeg = new Date(new Date(lic.Timbeg.ms).getTime() + new Date(lic.Timbeg.ms).getTimezoneOffset() * 60 * 1000);
						licencia.Timend = new Date(new Date(lic.Timend.ms).getTime() + new Date(lic.Timend.ms).getTimezoneOffset() * 60 * 1000);

						LicenseService.getUnifilares(licencia, (data) => {
							if (licencia.Id === undefined) {
								licencia.Id = AppManagementHelper.getModel("LicenciaClonadaID").getData().IdClonada;
							}

							// En el PDF debe salir el texto no la clave tecnica del tipo de intervencion, Issue # 531
							var oTextos = {
								TipintervText: ((licencia.Tipinterv) ? AppManagementHelper.getModel("TiposIntervencion").getData().TiposIntervencion.filter(
									(data) => {
										return data.Clave === licencia.Tipinterv;
									})[0].Descripcion : "")
							};

							var doc = ExportLicenseHelper.createPdfLicense(
								data, licencia, Colocaciones, Retiros, Habilitaciones, Inhibiciones, Entregas,
								Devoluciones, Suspensiones, Reanudaciones,
								Observaciones, Coordinaciones, Tramitaciones,
								Transferencias, oTextos, oModelExportMultiLicsModel.ExportType
							);

						}, (e) => {
							console.log(e);
						}, {
							"$select": "Nombre,Idunifilar,NumVersion,Region,TipoUnifilar,Et,Empresa,Anio,Region,IntAbLe,SecAbBt,SecPatCr,PatAdic,Numerolicencia,Imagenunifilar,Doctype,RealIdUnifilar"
						});


					});
				});
			} else {
				this._donwloadPfdSimplificado();
			}
		},

		_donwloadPfdSimplificado: function () {
			var aLicenciasSelected = this.getLicenseTable().getSelectedContexts().map(x => x.getObject());
			let oModelExportMultiLicsModel = AppManagementHelper.getModel("ExportMultiLicsModel").getData();

			BusyDialogHelper.open();
			ReportesService.getLicenciasFullData(aLicenciasSelected).then((aLicenciasFull) => {
				var aLicenciasSelectedFull = aLicenciasFull;

				var aPDFSimplificadoContent = [];

				//Por cada licencia hacer una exportacion
				aLicenciasSelectedFull.map(function (lic) {
					var licencia = lic;
					var Colocaciones = lic.ColocacionPAT_nav.results;
					var Retiros = lic.RetiroPAT_nav.results;
					var Habilitaciones = lic.HabilitacionRecierre_nav.results;
					var Inhibiciones = lic.InhibicionRecierre_nav.results;
					var Entregas = lic.EntregasLicencia_nav.results;
					var Devoluciones = lic.DevolucionLicencia_nav.results;
					var Suspensiones = lic.SuspensionLicencia_nav.results;
					var Reanudaciones = lic.ReanudacionLicencia_nav.results;
					var Observaciones = lic.ObservacionesLicencia_nav.results;
					var Coordinaciones = lic.CoordinacionesLicencia_nav.results;
					var Tramitaciones = lic.TramitacionesLicencia_nav.results;
					var Transferencias = lic.TransferenciaJefeTrabajo_nav.results;
					var oTextos = {
						TipintervText: ""
					};

					licencia.Timbeg = new Date(new Date(lic.Timbeg.ms).getTime() + new Date(lic.Timbeg.ms).getTimezoneOffset() * 60 * 1000);
					licencia.Timend = new Date(new Date(lic.Timend.ms).getTime() + new Date(lic.Timend.ms).getTimezoneOffset() * 60 * 1000);

					var content = ExportLicenseHelper.createPdfLicense(
						[], licencia, Colocaciones, Retiros, Habilitaciones, Inhibiciones, Entregas,
						Devoluciones, Suspensiones, Reanudaciones,
						Observaciones, Coordinaciones, Tramitaciones,
						Transferencias, oTextos, oModelExportMultiLicsModel.ExportType
					);

					aPDFSimplificadoContent.push(content);
				});

				for (let i = 0; i < aPDFSimplificadoContent.length; i++) {
					if (i < aPDFSimplificadoContent.length - 1) {
						aPDFSimplificadoContent[i][aPDFSimplificadoContent[i].length - 1]["pageBreak"] = "after";
					}
				}

				var docDefinition = {
					content: aPDFSimplificadoContent
				};

				var fileName = "Reporte simplificado";
				pdfMake.createPdf(docDefinition).download(fileName);
				BusyDialogHelper.close();
			});
		},

		sorterLicenses: function () {
			var orderNumber = AppManagementHelper.getModel("OrderNumberJsonModel").getData().Odering;
			var sorder = orderNumber !== "up" ? "asc" : "desc"
			var aLicenses = AppManagementHelper.getModel("LicencesListJsonModel").getData().Licenses
			var aLicensesOrdered = _.orderBy(aLicenses, ['Anio', "Id"], [sorder, sorder])
			AppManagementHelper.getModel("LicencesListJsonModel").setData({
				Licenses: aLicensesOrdered
			})

			if (orderNumber === "up") {
				AppManagementHelper.getModel("OrderNumberJsonModel").setData({
					Odering: "down"
				});

			} else {
				AppManagementHelper.getModel("OrderNumberJsonModel").setData({
					Odering: "up"
				});
			}

		},

		loadGrupoPlanificador: function (evt) {
			//let region = evt.getParameters().selectedItem.getKey();
			let region = AppManagementHelper.getModel("FiltersJsonModel").getData().Werks.value;
			if (region === '') {
				AppManagementHelper.getModel("FiltersJsonModel").setProperty("/Werks/value", "");
			}
			GrupoPlanificadorService.loadModel(region);
		},

		goToGantt: function () {
			this.getOwnerComponent().getRouter().navTo("Gantt", { empresa: this.society });
		},
		checkTramitacionMasivaEstados: function () {
			var oTable = this.byId("auditTable");
			var aSel = oTable.getSelectedItems();

			if (!aSel || !aSel.length) {
				return sap.m.MessageToast.show("Seleccioná al menos una licencia.");
			}

			// Snapshot de seleccionados (lo que el usuario vio)
			var aSnap = aSel.map(function (oItem) {
				var oCtx = oItem.getBindingContext("LicencesListJsonModel"); // o getBindingContext("LicenciaData") si aplica
				var o = oCtx && oCtx.getObject();
				return { Id: o.Id, Licstat: o.Licstat };
			});

			this._getBusyDialog().setText("Chequeando estado de las licencias seleccionadas...");
			this._getBusyDialog().open();

			// Releer backend con mismos filtros que makeFilters (sin Id)
			this._fetchUpdatedByIds()
				.then(function (aFresh) {
					// Index rápido por Id
					var mFresh = {};
					(aFresh || []).forEach(function (o) {
						mFresh[String(o.Id)] = o.Licstat;
					});

					// Comparar solo lo seleccionado
					var aDiff = [];
					aSnap.forEach(function (old) {
						var sNew = mFresh[String(old.Id)];
						if (sNew != null && String(sNew) !== String(old.Licstat)) {
							aDiff.push({ Id: old.Id, before: old.Licstat, after: sNew });
						}
					});

					this._getBusyDialog().close();

					// ✅ Sin cambios -> continuar
					if (!aDiff.length) {
						this.openMassiveTramitationAddCompanyDialog();
						return;
					}

					// ⚠️ Hay cambios -> avisar + refrescar para que vuelvan a elegir
					var sMsg =
						"Estas licencias cambiaron de estado mientras estabas en la pantalla:\n\n" +
						aDiff.map(x => ("- " + x.Id)).join("\n") +
						"\n\nActualizaremos las licencias para que vuelvas a elegirlas.";


					sap.m.MessageBox.warning(sMsg, {
						onClose: function () {
							// refresca misma vista (makeFilters ya limpia selección)
							var v = AppManagementHelper.getModel("vistaSeleccionada").getData().vista;
							this.makeFilters(Number(v) || 0);
						}.bind(this)
					});
				}.bind(this))
				.catch(function (err) {
					this._getBusyDialog().close();

					console.error(err);
					sap.m.MessageBox.error("Error al chequear estados actualizados.");
				});
		},

		_fetchUpdatedByIds: function (aIds) { // aIds queda sin uso si no querés filtrar por Id
			var sEntitySet = "/LicenciaTrabajoSet";

			// === mismos filtros que makeFilters ===
			var vistaSeleccionada = AppManagementHelper.getModel("vistaSeleccionada").getData().vista;
			if (vistaSeleccionada === "undefined" || vistaSeleccionada == null) {
				vistaSeleccionada = 0;
			}

			var aFilters = []

			aFilters.push(new sap.ui.model.Filter({
				path: "Empresa",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.society
			}));

			aFilters.push(new sap.ui.model.Filter({
				path: "Vista",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vistaSeleccionada
			}));

			return new Promise(function (resolve, reject) {
				oDataService.getModel("TransenerOperaciones").read(sEntitySet, {
					filters: aFilters,
					// opcional: si querés traer liviano (pero ojo si necesitás más campos)
					// urlParameters: { "$select": "Id,Licstat" },
					success: function (oData) {
						resolve(oData && oData.results ? oData.results : []);
					},
					error: reject
				});
			});
		},
		_getBusyDialog: function () {
			if (!this._oBusyDialog) {
				this._oBusyDialog = new sap.m.BusyDialog({
					title: "Por favor esperá",
					text: "Chequeando estado de las licencias seleccionadas..."
				});
			}
			return this._oBusyDialog;
		}




	});
});