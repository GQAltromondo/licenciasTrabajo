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
			BusyDialogHelper.open();
			var oFilterSelectionModel = AppManagementHelper.getModel("FilterSelectionJsonModel");
			var oDeliveryModel = AppManagementHelper.getModel("DeliveryTableJsonModel");
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
			LicenceHelper.generateDeliveryDevolution(oLicense);
			LicenceHelper.generatePlacementRemoval(oLicense);
			LicenceHelper.generateTurno(oLicense);
			LicenceHelper.generateInhibicionHabilitacion(oLicense);

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
					"Aufnr", "Bloqueorecierretxt", "Tipolicencia", "Estacional", "Capex", "SolSuplenteAux","TipoHabJefe","TipoHabJefeSup","IdHabJefe","IdHabJefeSup"
				];
				propertiesToCopy.forEach(prop => {
					copy[prop] = oldLicense[prop];
				});
				// Time
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

		tramitMassiveLicenses: function () {
			var aLicenciasSelected = AppManagementHelper.getModel("TramitacionesCatalogoJsonModel").getData().Tramitaciones;
			var aTramitaciones = AppManagementHelper.getModel("TramitacionMasivaListJsonModel").getData().Tramitaciones;
			var bShowConfirm = false;
			var that = this;

			// Valido si todos los campos necesarios estan completos.
			if (this.validTramitaciones(aTramitaciones)) {
				this.setModalTramitacionesMasivasBusyState(true);
				ReportesService.getLicenciasFullData(aLicenciasSelected).then((aLicenciaFull) => {
					var aLicenciasSelectedFull = aLicenciaFull;
					this.checkSiLicenciasTienenTramitaciones(aLicenciasSelectedFull, aTramitaciones).then(function (result) {
						that.setModalTramitacionesMasivasBusyState(false);
						if (result === true) {
							// Si alguna de las licencias ya tiene tramitaciones, pregunta si quiere sobreescribir.
							sap.m.MessageBox.show(
								"Hay licencias con agentes cargados, desea sobrescribir?", {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: "Alerta",
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
								onClose: function (oAction) {
									if (oAction == 'YES') {
										// Guarda con confirmacion
										that._tramitarMasivamente(aLicenciasSelectedFull, aTramitaciones);
									}
								}
							});
						} else {
							// Guarda directo.
							that._tramitarMasivamente(aLicenciasSelectedFull, aTramitaciones);
						}
					});
				})

			} else {
				MessageBoxHelper.showAlert("Alerta", "Debe completar los campos faltantes.")
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

		afterEmpresa: function () {

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
			PersonalHabilitadoService.getPersonalPromise(this.society);
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
						this.goToEdit(license, true);
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

		getImageUrl: function () {
			var that = this;
			var xhr = new XMLHttpRequest();
			//test webide images/transener.png
			if (that.society === "100") {
				xhr.open("GET", "/images/transener.png", true);
				//	xhr.open("GET", "/sap/fiori/transeneroperacionesworklicens/images/transener.png", true);
			} else {
				xhr.open("GET", "/images/TRANSBA.png", true);
				// xhr.open("GET", "/sap/fiori/transeneroperacionesworklicens/images/TRANSBA.png", true);
			}

			xhr.responseType = "blob";
			xhr.onload = function (e) {
				//console.log(this.response);
				if (e.srcElement.status >= 400) {
					that.imageUrl = false;
					return;
				}
				var reader = new FileReader();
				reader.onload = function (event) {
					var res = event.target.result;
					that.imageUrl = res;
					var oModelImage = AppManagementHelper.getModel("ImageModel")
					oModelImage.setProperty("/Image", res);
				};
				var file = this.response;
				reader.readAsDataURL(file);
			};
			xhr.send();
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

			this.cleanSelections();

		},

		cleanSelections: function () {
			this.getView().byId("auditTable").removeSelections(true)
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

			//ocation.hash = "Gantt_Licencias-Display?Empresa=" + this.society 
			//	window.open("#" + "Gantt_Licencias-Display?Empresa=" + this.society);
			//	AppManagementHelper.getAppRouter().navTo("Gantt")
			this.getOwnerComponent().getRouter().navTo("Gantt");
		},

	});
});