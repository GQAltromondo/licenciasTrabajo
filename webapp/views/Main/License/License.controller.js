sap.ui.define([
	//ui
	"sap/ui/core/mvc/Controller",
	//model
	"Transener/Operaciones/LicenciasTrabajo/model/models",
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/NavigationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatterHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/RolAuthorizationHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"sap/ui/core/routing/History",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/LicenseService",
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MailHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/ValidateHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/LicenceHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/ExportLicenseHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/UnifilarHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/EquiposService",
	"Transener/Operaciones/LicenciasTrabajo/services/OrdenesService",
	"Transener/Operaciones/LicenciasTrabajo/services/TipoEquipoService",
	"Transener/Operaciones/LicenciasTrabajo/services/PersonalHabilitadoService",
	"Transener/Operaciones/LicenciasTrabajo/services/EmpresaTramitacionService",
	"Transener/Operaciones/LicenciasTrabajo/services/EstacionesService",
	"Transener/Operaciones/LicenciasTrabajo/services/WorkPlaceService",
	"Transener/Operaciones/LicenciasTrabajo/views/Main/License/OrdenesDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/MailAROService",
	"Transener/Operaciones/LicenciasTrabajo/utils/LegacyValidationHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/TramitacionCalendarHelper",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function (Controller, Models, NavigationHelper, FormatHelper, FormatterHelper, AppManagementHelper, RolAuthorizationHelper,
	oDataService, History,
	MessageBoxHelper,
	FioriComponentHelper, LicenseService, FioriHelper, MailHelper, BusyDialogHelper, ValidateHelper, LicenceHelper, ExportLicenseHelper,
	UnifilarHelper,
	EquiposService, OrdenesService, TipoEquipoService, PersonalHabilitadoService, EmpresaTramitacionService,
	EstacionesService, WorkPlaceService, OrdenesDialogHelper, MailAROService, LegacyValidationHelper, TramitacionCalendarHelper, Fragment, MessageBox) {
	"use strict";

	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.Main.License.License", {
		bFinishTramitacion: false,
		aDataUnifilar: [],
		isDateDeliveryValid: true,
		aDates: [],
		oDatesEdition: null,
		initialZoomScale: 100,

		handleUserName: function () {
			return AppManagementHelper.getUser();
		},

		enableEspecifyBarra: function (oEvent) {
			var oFilterSelecitonJsonModel = AppManagementHelper.getModel("FilterSelectionJsonModel");
			var oLicenseJsonModel = AppManagementHelper.getModel("LicenseJsonModel");
			var sKey = oEvent.getSource().getSelectedKey();
			if (sKey === "N" || sKey === "") {
				oFilterSelecitonJsonModel.setProperty("/enabledEspecifyBarra", false);
				oLicenseJsonModel.setProperty("/Barrafstx", "");
			} else {
				oFilterSelecitonJsonModel.setProperty("/enabledEspecifyBarra", true);
			}
		},

		onChangeTipoLic: function (oEvent) {
			let oModelLicencia = AppManagementHelper.getModel("LicenseJsonModel");
			let sKey = oEvent.getSource().getSelectedKey();
			if (sKey === "EM") {
				oModelLicencia.setProperty("/Tipinterv", "2");
				oModelLicencia.setProperty("/Estacional", "4");
				oModelLicencia.setProperty("/Capex", "Y")
			}
		},

		_editUnifilarUrl: function (oEvent) {
			var sAnio = oEvent.getSource().getParent().getBindingContext("UnifilarListModel").getObject().Anio;
			var sVersion = oEvent.getSource().getParent().getBindingContext("UnifilarListModel").getObject().NumVersion;
			var sEmpresa = oEvent.getSource().getParent().getBindingContext("UnifilarListModel").getObject().Empresa;
			var sCentro = oEvent.getSource().getParent().getBindingContext("UnifilarListModel").getObject().Region;
			var sET = oEvent.getSource().getParent().getBindingContext("UnifilarListModel").getObject().Et;
			var sTipo = oEvent.getSource().getParent().getBindingContext("UnifilarListModel").getObject().TipoUnifilar;
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var sIndex = oEvent.getSource().getParent().getBindingContext("UnifilarListModel").getObject().Idunifilar;

			// Fix issue #498 ID de solicitud y unifilres.
			var oLicencia = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var sLicenciaCreada = (oLicencia.Id && oLicencia.Tipo === "L") ? oLicencia.Id : "";


			// Obtén los parámetros de la URL
			var searchParams = new URLSearchParams(window.location.search);

			// Obtén el valor de 'siteId'
			var siteId = searchParams.get("siteId");

			// var sHost =
			// 	`https://${window.location.host}/sites/fiorilaunchpad#GestionUnifilares-Display?LicenciaCreada=${sLicenciaCreada}&Tipo=${sTipo}&Version=${sVersion}&Empresa=${sEmpresa}&Anio=${sAnio}&Id=${oLicense.Idunifilar}&IdUnifilar=${sIndex}&Centro=${sCentro}&ET=${sET}&Mode=E`;
			// window.open(sHost, "_blank");

			//	location.hash = `GestionUnifilares-Display?LicenciaCreada=${sLicenciaCreada}&Tipo=${sTipo}&Version=${sVersion}&Empresa=${sEmpresa}&Anio=${sAnio}&Id=${oLicense.Idunifilar}&IdUnifilar=${sIndex}&Centro=${sCentro}&ET=${sET}&Mode=E`
			var Hash = `#GestionUnifilaresV1-Display?LicenciaCreada=${sLicenciaCreada}&Tipo=${sTipo}&Version=${sVersion}&Empresa=${sEmpresa}&Anio=${sAnio}&Id=${oLicense.Idunifilar}&IdUnifilar=${sIndex}&Centro=${sCentro}&ET=${sET}&Mode=E`;

			const currentHash = Hash;

			// Crear la URL para la nueva pestaña
			const newUrl = `${location.origin}/site?siteId=${siteId}${currentHash}`;


			window.open(newUrl, '_blank');






		},

		onSuccessGetUnifilares: function (data) {
			var aUnifilares = data.results.filter(oUnifilar => oUnifilar.Numerolicencia !== "");
			var oModel = AppManagementHelper.getModel("UnifilarListModel");
			oModel.setData({
				Unifilares: aUnifilares,
				index: aUnifilares.length + 1
			});

			var oDialog = new sap.m.Dialog({
				afterClose: () => {
					this.oDialogTable.destroy(true);
				},
				contentWidth: "500px",
				title: "Esquemas Unifilares",
				content: [
					new sap.m.Table({
						inset: false,
						fixedLayout: false,
						enableBusyIndicator: true,
						noDataText: "No hay esquemas unifilares registrados",
						columns: [
							new sap.m.Column({
								hAlign: sap.ui.core.TextAlign.Center,
								header: new sap.m.Text({
									text: "Tipo"
								})
							}),
							new sap.m.Column({
								hAlign: sap.ui.core.TextAlign.Center,
								header: new sap.m.Text({
									text: "N° Versión"
								})
							}),
							new sap.m.Column({
								hAlign: sap.ui.core.TextAlign.Center,
								header: new sap.m.Text({
									text: "ESTACION"
								})
							}),
							new sap.m.Column({
								width: "100px",
								hAlign: sap.ui.core.TextAlign.Center,
								header: new sap.m.Text({
									text: "ACCIÓN"
								})
							})
						],
						items: {
							path: "UnifilarListModel>/Unifilares",
							template: new sap.m.ColumnListItem({
								cells: [
									new sap.m.Text({
										text: {
											path: "UnifilarListModel>TipoUnifilar",
											formatter: (tipo) => {
												if (tipo === "P") {
													return "Potencia"
												}
												if (tipo === "S") {
													return "Servicios Auxiliares"
												}
												if (tipo === "O") {
													return "Otro"
												}
												return ""
											}
										}
									}),
									new sap.m.Text({
										text: "{UnifilarListModel>NumVersion}"
									}),
									new sap.m.Text({
										text: "{UnifilarListModel>Nombre}"
									}),
									new sap.m.HBox({
										items: [
											new sap.m.Button({
												icon: "sap-icon://show",
												press: [this.showUnifilar, this]
											}),
											new sap.m.Button({
												enabled: {
													parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
														"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
													],
													formatter: this.rolStatusEdition("header/")
												},
												icon: "sap-icon://edit",
												press: [this._editUnifilarUrl, this]
											}).addStyleClass("sapUiTinyMarginBeginEnd"),
											new sap.m.Button({
												enabled: {
													parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
														"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
													],
													formatter: this.rolStatusEdition("header/")
												},
												icon: "sap-icon://delete",
												press: [this._deleteUnifilar, this]
											})

										]
									})
								]
							})
						}
					})
				],
				buttons: [
					new sap.m.Button({
						enabled: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
							],
							formatter: this.rolStatusEdition("header/")
						},
						text: "Agregar Unifilar",
						press: [this.handleOpenUnifilar, this]
					}).addStyleClass("buttonInverted floatLeft"),
					new sap.m.Button({
						text: "Cerrar",
						icon: "sap-icon://decline",
						press: [this.closeUnifilarImageTable, this]
					}).addStyleClass("buttonInverted floatLeft"),
					new sap.m.Button({
						test: "Refrescar",
						icon: "sap-icon://refresh",
						press: [this.refreshUnifilar, this]
					}).addStyleClass("buttonInverted floatLeft"),
				]
			});
			oDialog.setModel(oModel, "UnifilarListModel");
			this.getView().addDependent(oDialog);

			this.oDialogTable = oDialog;
			oDialog.open()
		},

		closeUnifilarImageTable: function (e) {
			UnifilarHelper.refreshUnifilar();
			this.oDialogTable.close();
			this.oDialogTable.destroy(true);
		},
		
		

		onChangeSelectionRegion: function (evt) {
			//return; //TODO remove this this is to go back to ordenes input
			var oModel = AppManagementHelper.getModel("UnifilaresFileListModel");
			oModel.setData({
				Files: []
			});
			var oSelectionData = AppManagementHelper.getModel("SelectionUnifilarModel").getData();
			let selected = evt ? evt.getSource().getSelectedKey() : oSelectionData.Region;
			var filters = [];
			let empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			if (!selected) {
				EstacionesService.filterPorRegionUnifilar("");
			};
			let region = selected;
			EstacionesService.filterPorRegionUnifilar(region);
		},

		onChangeSelection: function () {
			var oModelData = AppManagementHelper.getModel("SelectionUnifilarModel").getData();
			if (oModelData.Region && oModelData.ET) {
				var aFilters = [];
				//102 AB probar.
				aFilters.push(new sap.ui.model.Filter("Estado", sap.ui.model.FilterOperator.EQ, "1"));
				aFilters.push(new sap.ui.model.Filter("Centro", sap.ui.model.FilterOperator.EQ, oModelData.Region));
				aFilters.push(new sap.ui.model.Filter("Et", sap.ui.model.FilterOperator.EQ, oModelData.ET));
				LicenseService.getUnifilarFiles(aFilters).then((data) => {
					var oModel = AppManagementHelper.getModel("UnifilaresFileListModel");
					oModel.setData({
						Files: data.results
					})
				}).catch(() => {
					console.log(e);
				})
			}
		},

		checkData: function () {
			var oSelectionData = AppManagementHelper.getModel("SelectionUnifilarModel").getData();
			if (oSelectionData.Region && !oSelectionData.ET) {
				//
				this.onChangeSelectionRegion();
			}
			if (oSelectionData.Region && oSelectionData.ET) {
				this.onChangeSelectionRegion();
				this.onChangeSelection();
			}
		},

		handleOpenUnifilar: function () {
			var oLicenseData = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var oModel = AppManagementHelper.getModel("SelectionUnifilarModel");
			oModel.setData({
				Region: oLicenseData.Werks ? oLicenseData.Werks : "",
				ET: oLicenseData.Tplnr ? oLicenseData.Tplnr : "",
				Tipo: ""
			});
			var oDialogSelection = new sap.m.Dialog({
				title: "Selección",
				afterOpen: () => {
					this.checkData();
				},
				content: [
					new sap.m.VBox({
						width: "90%",
						items: [
							new sap.m.Text({
								text: "Region"
							}),
							new sap.m.ComboBox({
								width: "100%",
								change: [this.onChangeSelectionRegion, this],
								selectedKey: "{SelectionUnifilarModel>/Region}",
								items: {
									path: "RegionesJsonModel>/Regiones",
									template: new sap.ui.core.Item({
										key: "{RegionesJsonModel>Werks}",
										text: "{RegionesJsonModel>Name1}"
									})
								},
							})
						]
					}).addStyleClass("sapUiTinyMarginBeginEnd"),
					new sap.m.VBox({
						width: "90%",
						items: [
							new sap.m.Text({
								text: "E.T"
							}),
							new sap.m.ComboBox({
								width: "100%",
								change: [this.onChangeSelection, this],
								selectedKey: "{SelectionUnifilarModel>/ET}",
								items: {
									path: "EstacionesJsonModelUnifilar>/EstacionesPorRegion",
									template: new sap.ui.core.Item({
										key: "{EstacionesJsonModelUnifilar>Codigo}",
										text: "{EstacionesJsonModelUnifilar>Codigo} - {EstacionesJsonModelUnifilar>Descripcion}"
									})
								}
							})
						]
					}).addStyleClass("sapUiTinyMarginBeginEnd"),
					new sap.m.List({
						noDataText: "Seleccione región y E.T para ver unifilares",
						headerText: "Lista de unifilares",
						items: {
							path: "UnifilaresFileListModel>/Files",
							template: new sap.m.StandardListItem({
								type: sap.m.ListType.Navigation,
								press: [this.openUnifilarURL, this],
								// title: "{UnifilaresFileListModel>IdUnifilar} --- {UnifilaresFileListModel>Descripcion}",
								title: "{UnifilaresFileListModel>Descripcion}",
								description: {
									path: "UnifilaresFileListModel>TipoUnifilar",
									formatter: (tipo) => {
										if (tipo === "P") {
											return "Potencia"
										}
										if (tipo === "S") {
											return "Servicios Auxiliares"
										}
										if (tipo === "O") {
											return "Otro"
										}
										return ""
									}
								}
							})
						}
					})
				],
				buttons: [
					new sap.m.Button({
						text: "Cerrar",
						icon: "sap-icon://decline",
						press: [this.closeSelectionDialog, this]
					}).addStyleClass("buttonInverted floatLeft"),
				]
			});
			this.getView().addDependent(oDialogSelection);
			this.oDialogSelection = oDialogSelection;
			oDialogSelection.open();
		},

		closeSelectionDialog: function () {
			this.oDialogSelection.close();
			var oModel = AppManagementHelper.getModel("UnifilaresFileListModel");
			oModel.setData({
				Files: []
			})
		},

		// unifilarValid: function (oUnifilar) {
		// 	var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
		// 	this.oDialogSelection.setBusy(true);
		// 	LicenseService.getUnifilares(oLicense, (data) => {
		// 		this.oDialogSelection.setBusy(false);
		// 		var oModel = AppManagementHelper.getModel("UnifilarListModel");
		// 		oModel.setData({
		// 			Unifilares: data.results,
		// 			index: data.results.length + 1
		// 		});
		// 		let aUnifilares = AppManagementHelper.getModel("UnifilarListModel").getData().Unifilares;
		// 		let oUnifilarFound = aUnifilares.find(e => e.Et === oUnifilar.Et && e.TipoUnifilar === oUnifilar.TipoUnifilar);
		// 		if (oUnifilarFound) {
		// 			MessageBoxHelper.showAlert("Alerta", "Ya se ha agregado un unifilar del mismo tipo para esta E.T");
		// 		} else {
		// 			var sRealIdUnifilar = oUnifilar.IdUnifilar.toString();
		// 			var sTipo = oUnifilar.TipoUnifilar;
		// 			var oModelSelectionData = AppManagementHelper.getModel("SelectionUnifilarModel").getData();
		// 			var sVersion = "";
		// 			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
		// 			var sIndex = new Date().valueOf().toString(36) + Math.random().toString(36).substr(2);
		// 			var sIndexFormatted = sIndex.substr(1, 18);
		// 			var sIndex = sIndexFormatted;

		// 			// Fix issue #498 ID de solicitud y unifilres.
		// 			var oLicencia = AppManagementHelper.getModel("LicenseJsonModel").getData();
		// 			var sLicenciaCreada = (oLicencia.Id && oLicencia.Tipo === "L") ? oLicencia.Id : "";


		// 			// Obtén los parámetros de la URL
		// 			var searchParams = new URLSearchParams(window.location.search);

		// 			// Obtén el valor de 'siteId'
		// 			var siteId = searchParams.get("siteId");

		// 			console.log("siteId:", siteId);

		// 			// RL 10/12

		// 			var navigationService = sap.ushell.Container.getService('CrossApplicationNavigation');
		// 			var hash = navigationService.hrefForExternal({
		// 				target: { semanticObject: 'GestionUnifilaresV1', action: 'Display' },
		// 				params: {
		// 					LicenciaCreada: sLicenciaCreada,
		// 					Tipo: sTipo,
		// 					Version: sVersion,
		// 					Empresa: oLicense.Empresa,
		// 					Anio: oLicense.Anio,
		// 					Id: oLicense.Idunifilar,
		// 					IdUnifilar: sIndex,
		// 					RealIdUnifilar: sRealIdUnifilar,
		// 					Centro: oModelSelectionData.Region,
		// 					ET: oModelSelectionData.ET,
		// 					Mode: "C"
		// 				}
		// 			});
		// 			var url = window.location.href.split('#')[0] + hash;
		// 			sap.m.URLHelper.redirect(url, true);
		// 			// Fin RL 10/12

		// 			// console.log("URL", window.location.hostname + "/site?siteId=" + siteId)
		// 			// RL 10/12 var Hash = `#GestionUnifilares-Display?LicenciaCreada=${sLicenciaCreada}&Tipo=${sTipo}&Version=${sVersion}&Empresa=${oLicense.Empresa}&Anio=${oLicense.Anio}&Id=${oLicense.Idunifilar}&IdUnifilar=${sIndex}&RealIdUnifilar=${sRealIdUnifilar}&Centro=${oModelSelectionData.Region}&ET=${oModelSelectionData.ET}&Mode=C`;
		// 			// const sHost = (window.location.hostname + "/site?siteId=" + siteId + Hash)
		// 			// window.location.href = (sHost, "_blank")


		// 			// //window.open(sHost, "_blank");
		// 			// // var sHost =
		// 			// // 	`https://${window.location.host}/sites/fiorilaunchpad#GestionUnifilares-Display?LicenciaCreada=${sLicenciaCreada}&Tipo=${sTipo}&Version=${sVersion}&Empresa=${oLicense.Empresa}&Anio=${oLicense.Anio}&Id=${oLicense.Idunifilar}&IdUnifilar=${sIndex}&RealIdUnifilar=${sRealIdUnifilar}&Centro=${oModelSelectionData.Region}&ET=${oModelSelectionData.ET}&Mode=C`;
		// 			// // window.open(sHost, "_blank");
		// 			// RL 10/12 location.hash = "GestionUnifilares-Display?Empresa=" + `LicenciaCreada=${sLicenciaCreada}&Tipo=${sTipo}&Version=${sVersion}&Empresa=${oLicense.Empresa}&Anio=${oLicense.Anio}&Id=${oLicense.Idunifilar}&IdUnifilar=${sIndex}&RealIdUnifilar=${sRealIdUnifilar}&Centro=${oModelSelectionData.Region}&ET=${oModelSelectionData.ET}&Mode=C`;
		// 			//location.hash = Hash

		// 			// const currentHash = Hash;

		// 			// // Crear la URL para la nueva pestaña
		// 			// const newUrl = `${location.origin}/site?siteId=${siteId}${currentHash}`;

		// 			//}
		// 		}
		// 	}, $.proxy(this.onErrorGetUnifilares, this));
		// },

		unifilarValid: function (oUnifilar) {
  var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
  this.oDialogSelection.setBusy(true);

  // helper local para resolver versión desde distintas fuentes
  function resolveVersion(fromItem, fromResults) {
    // a) campos típicos
    let v = fromItem.NumVersion ?? fromItem.Version ?? fromItem.Numversion ?? fromItem.NroVersion;

    // b) si no vino, intento en el resultado del backend por Idunifilar
    if (!v && fromResults && fromResults.length) {
      const id = String(fromItem.IdUnifilar ?? fromItem.Idunifilar ?? fromItem.Id ?? "");
      let found = null;
      if (id) found = fromResults.find(r => String(r.Idunifilar ?? r.Id) === id);
      if (!found) {
        // último intento: por Tipo + (si existe) ET
        const tipo = String(fromItem.TipoUnifilar ?? fromItem.Tipo ?? "");
        const et   = String(fromItem.Et ?? fromItem.ET ?? "");
        found = fromResults.find(r => String(r.TipoUnifilar) === tipo && (!et || String(r.Et) === et));
      }
      if (found) v = found.NumVersion ?? found.Version;
    }

    // c) último recurso: parsear de textos (p.ej. "2 v — E.T. ABSTO")
    if (!v) {
      const texts = [
        String(fromItem.IdUnifilar ?? ""),
        String(fromItem.Descripcion ?? fromItem.Nombre ?? fromItem.Title ?? "")
      ];
      for (const s of texts) {
        // “2 v …” o “… v 2”
        let m = s.match(/^\s*(\d+)\s*v\b/i) || s.match(/\bv\s*(\d+)\b/i);
        if (m && m[1]) { v = m[1]; break; }
      }
    }

    // d) devuelvo string (o vacío si no hubo suerte)
    return v != null ? String(v) : "";
  }

  LicenseService.getUnifilares(oLicense, (data) => {
    this.oDialogSelection.setBusy(false);

    // log de respaldo
    console.log("[unifilarValid] item recibido:", oUnifilar);
    console.log("[unifilarValid] results del backend:", data && data.results);

    // (si usás el modelo local)
    var oModel = AppManagementHelper.getModel("UnifilarListModel");
    oModel.setData({ Unifilares: data.results, index: (data.results || []).length + 1 });

	// En tu payload, IdUnifilar es el número de versión
	var sVersion        = String(oUnifilar.IdUnifilar);
	var sRealIdUnifilar = String(oUnifilar.IdUnifilar); // si más adelante te llega un ID real distinto, lo cambiamos
	var sTipo           = String(oUnifilar.TipoUnifilar || "");


    // Si aún así no se pudo, NO bloqueo: uso fallback "1" y dejo log.
    if (!sVersion) {
      console.warn("[unifilarValid] No se pudo resolver la versión; uso fallback '1'. Item:", oUnifilar);
      sVersion = "1";
    }

    // índice temporal
    var sIndex = (new Date().valueOf().toString(36) + Math.random().toString(36).slice(2)).slice(1, 19);

    // Issue #498
    var oLicencia = AppManagementHelper.getModel("LicenseJsonModel").getData();
    var sLicenciaCreada = (oLicencia.Id && oLicencia.Tipo === "L") ? oLicencia.Id : "";

    var oModelSelectionData = AppManagementHelper.getModel("SelectionUnifilarModel").getData();

    // CrossApp nav (ojo con 'Id': acá es la licencia)
    var navigationService = sap.ushell.Container.getService('CrossApplicationNavigation');
    var hash = navigationService.hrefForExternal({
      target: { semanticObject: 'GestionUnifilaresV1', action: 'Display' },
      params: {
        LicenciaCreada : sLicenciaCreada,
        Tipo           : String(oUnifilar.TipoUnifilar || ""),
        Version        : String(oUnifilar.IdUnifilar),          // ✅ ahora viaja
        Empresa        : oLicense.Empresa,
        Anio           : oLicense.Anio,
        Id             : oLicense.Idunifilar,    // ✅ más consistente que Idunifilar
        IdUnifilar     : sIndex,              // temporal
        RealIdUnifilar : String(oUnifilar.IdUnifilar),     // lo que venga del item (texto o id)
        Centro         : oModelSelectionData.Region,
        ET             : oModelSelectionData.ET,
        Mode           : "C"
      }
    });

    var url = window.location.href.split('#')[0] + hash;
    sap.m.URLHelper.redirect(url, true);

  }, $.proxy(this.onErrorGetUnifilares, this));
},


		openUnifilarURL: function (oEvent) {
			var oUnifilar = oEvent.getSource().getBindingContext("UnifilaresFileListModel").getObject()
			console.log("[openUnifilarURL] item clickeado:", oUnifilar);

			this.unifilarValid(oUnifilar)
		},

		refreshUnifilar: function () {
			var oFinished = UnifilarHelper.refreshUnifilar();
			return oFinished;
		},

		_deleteUnifilar: function (oEvent) {
			this.oDialogTable.setBusy(true);
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var sId = oEvent.getSource().getParent().getParent().getBindingContext("UnifilarListModel").getObject().Idunifilar
			MessageBoxHelper.showConfirm("Alerta", "Desea elimminar el esquema unifilar?", () => {
				LicenseService.deleteUnifilar(sId).then(() => {
					MessageBoxHelper.showAlert("Alerta", "Se ha eliminado de manera correcta", () => {
						LicenseService.getUnifilares(oLicense, (data) => {
							var oModel = AppManagementHelper.getModel("UnifilarListModel")
							oModel.setData({
								Unifilares: data.results,
								index: data.results.length + 1
							});
							this.oDialogTable.setBusy(false);
						}, $.proxy(this.onErrorGetUnifilares, this));
					});
				}).catch(() => {
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al borrar unifilares.");
				});
			}, () => {
				this.oDialogTable.setBusy(false);
			});
			console.log(oEvent)
		},

		zoomInOnImage: function () {
			var oImage = this.byId("ImageZoom");
			if (this.initialZoomScale < 160) {
				this.initialZoomScale = this.initialZoomScale + 10
				var sWidth = this.initialZoomScale.toString() + "%";
				oImage.setWidth(sWidth)
			}
		},

		zoomOutOnImage: function () {
			var oImage = this.byId("ImageZoom");
			if (this.initialZoomScale > 100) {
				this.initialZoomScale = this.initialZoomScale - 10
				var sWidth = this.initialZoomScale.toString() + "%";
				oImage.setWidth(sWidth)
			}
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

		showUnifilar: function (oEvent) {
			this.oDialogTable.setBusy(true);
			var oData = oEvent.getSource().getParent().getParent().getBindingContext("UnifilarListModel").getObject();
			LicenseService.getIndividualUnifilar(oData.Anio, oData.Empresa, oData.Idunifilar, oData.Numerolicencia, "").then((data) => {
				var oModel = AppManagementHelper.getModel("UnifilarDataModel");
				oModel.setData(data);
				var oTitle =
					`Esquema Unifilar: ${this.getTipo(data.TipoUnifilar)} / ${data.Et} - ${data.Nombre} / ${this.getRegiones(data.Region)}`;
				var oDialog = new sap.m.Dialog({
					afterClose: () => {
						this.unifilarDialog.destroy(true);
					},
					customHeader: [
						new sap.m.Bar({
							contentLeft: [
								new sap.m.Text({
									text: {
										path: "LicenseJsonModel>/Id",
										formatter: function (Id) {
											return Id ? `Licencia N°: ${Id}` : ""
										}
									}
								})
							],
							contentMiddle: [
								new sap.m.Text({
									text: oTitle
								})
							]
						})
					],
					contentWidth: "70%",
					modal: true,
					content: [
						new sap.m.Image({
							id: this.createId("ImageZoom"),
							width: "100%",
							src: {
								parts: ["UnifilarDataModel>/Imagenunifilar", "UnifilarDataModel>/Doctype"],
								formatter: function (sUnifilar, sDoctype) {
									return sDoctype + "," + sUnifilar
								}
							}
						})
					],
					buttons: [
						new sap.m.Button({
							text: "Cancelar",
							icon: "sap-icon://decline",
							press: [this.closeUnifilarImage, this]
						}).addStyleClass("buttonInverted floatLeft"),
						new sap.m.Button({
							text: "Marcadores Relacionados",
							press: [this.showRelationatedMarkers, this]
						}).addStyleClass("buttonInverted floatLeft"),
						new sap.m.Button({
							text: "Marcadores No relacionados",
							press: [this.showNonRelationatedMarkers, this]
						}).addStyleClass("buttonInverted floatLeft"),
						new sap.m.Button({
							icon: "sap-icon://zoom-in",
							text: "Acercar Imagen",
							press: [this.zoomInOnImage, this]
						}).addStyleClass("buttonInverted floatLeft"),
						new sap.m.Button({
							icon: "sap-icon://zoom-out",
							text: "Alejar Imagen",
							press: [this.zoomOutOnImage, this]
						}).addStyleClass("buttonInverted floatLeft"),
						new sap.m.Button({
							icon: "sap-icon://decision",
							text: "Medidas de 3ros",
							press: [this.showMedidasTerceros, this]
						}).addStyleClass("buttonInverted floatLeft")
					]
				}).addStyleClass("customDialog schema");
				oDialog.setModel(oModel, "UnifilarDataModel");
				oDialog.setModel(AppManagementHelper.getModel("LicenseJsonModel"), "LicenseJsonModel");
				this.oDialogTable.setBusy(false);
				oDialog.open();
				this.unifilarDialog = oDialog;
			}).catch(() => {

			});
		},

		showNonRelationatedMarkers: function (oEvent) {
			var oData = oEvent.getSource().getModel("UnifilarDataModel").getData();
			LicenseService.getIndividualUnifilar(oData.Anio, oData.Empresa, oData.Idunifilar, oData.Numerolicencia, "/marcadoresnorel_nav").then(
				(data) => {
					data.results.forEach(function (e) {
						e.Tipomarcador = e.Tipomarcador === "02" ? "PUESTA A TIERRA" : "TENSIÓN";
					});
					var oModel = AppManagementHelper.getModel("NonRelationatedMarkersJsonModel");
					oModel.setData({
						NonRelationatedMarkers: data.results
					});
					var oDialog = new sap.m.Dialog({
						draggable: true,
						title: "Marcadores No Relacionados",
						modal: true,
						content: [
							new sap.m.Table({
								inset: false,
								fixedLayout: false,
								enableBusyIndicator: true,
								noDataText: "No hay marcadores no relacionados registrados",
								columns: [
									/*new sap.m.Column({
										hAlign: sap.ui.core.TextAlign.Center,
										header: new sap.m.Text({
											text: "N°"
										})
									}),*/
									new sap.m.Column({
										hAlign: sap.ui.core.TextAlign.Center,
										header: new sap.m.Text({
											text: "Tipo"
										})
									}),
									new sap.m.Column({
										hAlign: sap.ui.core.TextAlign.Center,
										header: new sap.m.Text({
											text: "Comentario"
										})
									})
								],
								items: {
									path: "NonRelationatedMarkersJsonModel>/NonRelationatedMarkers",
									template: new sap.m.ColumnListItem({
										cells: [
											/*		new sap.m.Text({
														text: "{NonRelationatedMarkersJsonModel>Nromarcador}"
													}),*/
											new sap.m.Text({
												text: "{NonRelationatedMarkersJsonModel>Tipomarcador}"
											}),
											new sap.m.Text({
												text: "{NonRelationatedMarkersJsonModel>Comentario}"
											})
										]
									})
								}
							})
						],
						buttons: [
							new sap.m.Button({
								text: "Cerrar",
								icon: "sap-icon://decline",
								press: [this.closeNonrelationatedDialog, this]
							}).addStyleClass("buttonInverted floatLeft"),
						]
					}).addStyleClass("customDialog schema");
					oDialog.setModel(oModel, "NonRelationatedMarkersJsonModel");
					oDialog.open();
					this.nonRelationatedMarkerDialog = oDialog;
				}).catch((e) => {
					console.log(e)
				})
		},

		showMedidasTerceros: function (oEvent) {
			var oModel = oEvent.getSource().getModel("UnifilarDataModel");
			var oDialog = new sap.m.Dialog({
				draggable: true,
				title: "Medidas de 3ros",
				modal: true,
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.Label({
								design: "Bold",
								text: "Interruptor abierto y en local / extraído:",
							}),
							new sap.m.Text({
								text: "{UnifilarDataModel>/IntAbLe}"
							}).addStyleClass("sapUiSmallMarginBottom"),
							new sap.m.Label({
								design: "Bold",
								text: "Seccionador abierto bloqueado y trabado:",
							}),
							new sap.m.Text({
								text: "{UnifilarDataModel>/SecAbBt}"
							}).addStyleClass("sapUiSmallMarginBottom"),
							new sap.m.Label({
								design: "Bold",
								text: "Seccionador de PaT cerrado:",
							}),
							new sap.m.Text({
								text: "{UnifilarDataModel>/SecPatCr}"
							}).addStyleClass("sapUiSmallMarginBottom"),
							new sap.m.Label({
								design: "Bold",
								text: "PaT adicional:",
							}),
							new sap.m.Text({
								text: "{UnifilarDataModel>/PatAdic}"
							}).addStyleClass("sapUiSmallMarginBottom")
						]
					}).addStyleClass("sapUiSmallMarginBeginEnd sapUiSmallMarginTopBottom")
				],
				buttons: [
					new sap.m.Button({
						text: "Cerrar",
						icon: "sap-icon://decline",
						press: [this.closeMedidasTercerosDialog, this]
					}).addStyleClass("buttonInverted floatLeft"),
				]
			}).addStyleClass("customDialog schema");
			oDialog.setModel(oModel, "UnifilarDataModel");
			oDialog.open();
			this.medidasTercerosDialog = oDialog;
		},

		closeSecuredArea: function () {
			this.SecuredAreaDialog.close();
			this.SecuredAreaDialog.destroy();
		},

		closeNonrelationatedDialog: function () {
			this.nonRelationatedMarkerDialog.close();
			this.nonRelationatedMarkerDialog.destroy();
		},

		closeMedidasTercerosDialog: function () {
			this.medidasTercerosDialog.close();
			this.medidasTercerosDialog.destroy();
		},

		formatOpcionSeleccionada: function (iOption) {
			var sOption = iOption.toString();
			switch (sOption) {
				case "0":
					return "Interruptor abierto";
				case "1":
					return "Seccionador abierto bloqueado y trabado";
				case "2":
					return "Seccionador PAT cerrado";
				case "3":
					return "Equipos a mover (Interruptores)";
				case "4":
					return "Equipos a mover (Seccionadores)";
				case "5":
					return "Equipos a mover (Seccionadores)";
				case "6":
					return "Interruptor extraído"
				default:
					return "";
			}
		},

		showRelationatedMarkers: function (oEvent) {
			var oData = oEvent.getSource().getModel("UnifilarDataModel").getData();
			LicenseService.getIndividualUnifilar(oData.Anio, oData.Empresa, oData.Idunifilar, oData.Numerolicencia, "/marcadores_nav").then((
				data) => {
				data.results.forEach((e) => {
					e.Opcionseleccionada = parseInt(e.Opcionseleccionada);
				});
				var oModel = AppManagementHelper.getModel("RelationatedUnifilarDataModel");
				oModel.setData({
					RelationatedMarkers: data.results
				});
				var oDialog = new sap.m.Dialog({
					draggable: true,
					title: "Marcadores Relacionados",
					modal: true,
					content: [
						new sap.m.Table({
							inset: false,
							fixedLayout: false,
							enableBusyIndicator: true,
							noDataText: "No hay marcadores relacionados...",
							columns: [
								new sap.m.Column({
									hAlign: sap.ui.core.TextAlign.Center,
									header: new sap.m.Text({
										text: "Equipo"
									})
								}),
								new sap.m.Column({
									width: "200px",
									hAlign: sap.ui.core.TextAlign.Center,
									header: new sap.m.Text({
										text: "Marcador"
									})
								}),
								new sap.m.Column({
									width: "200px",
									hAlign: sap.ui.core.TextAlign.Center,
									header: new sap.m.Text({
										text: "Comentario"
									})
								})
							],
							items: {
								path: "RelationatedUnifilarDataModel>/RelationatedMarkers",
								template: new sap.m.ColumnListItem({
									cells: [
										new sap.m.Text({
											text: "{RelationatedUnifilarDataModel>Equipo}"
										}),
										new sap.m.Text({
											text: {
												path: "RelationatedUnifilarDataModel>Opcionseleccionada",
												formatter: $.proxy(this.formatOpcionSeleccionada, this)
											}
										}),
										new sap.m.Text({
											text: "{RelationatedUnifilarDataModel>Comentario}"
										})
									]
								})
							}
						})
					],
					buttons: [
						new sap.m.Button({
							text: "Cerrar",
							icon: "sap-icon://decline",
							press: [this.closeUnifilarMarkerDialog, this]
						}).addStyleClass("buttonInverted floatLeft"),
					]
				}).addStyleClass("customDialog schema");
				oDialog.setModel(oModel, "RelationatedUnifilarDataModel")
				oDialog.open();
				this.RelationatedUnifilarDialog = oDialog;
			}).catch((e) => {
				console.log(e)
			})
		},

		closeUnifilarMarkerDialog: function () {
			this.RelationatedUnifilarDialog.close()
			this.RelationatedUnifilarDialog.destroy();
		},

		closeUnifilarImage: function () {
			this.unifilarDialog.close();
			this.unifilarDialog.destroy(true);
		},

		_downloadUnifilar: function (oEvent) {
			if (this._edit) {
				var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
				var sEsquid = oEvent.getSource().getBindingContext("UnifilarListModel").getObject().Esqid;
				LicenseService.getIndividualUnifilar(oLicense, sEsquid);
			} else {
				var Esqname = oEvent.getSource().getBindingContext("UnifilarListModel").getObject().Esqname;
				var Esqimage = oEvent.getSource().getBindingContext("UnifilarListModel").getObject().Esqimage;
				var base64 = Esqimage
				var element = document.createElement('a');
				element.setAttribute('href', 'data:image/jpeg;base64,' + base64);
				element.setAttribute('download', Esqname);

				element.style.display = 'none';
				document.body.appendChild(element);

				element.click();

				document.body.removeChild(element);
			}

		},

		onErrorGetUnifilares: function (error) {
			MessageBoxHelper.showAlert("Error", "Se ha producido un error al obtener los esquemas unifilares");
		},

		openUnifilarSchemaList: function () {
			this.getView().setBusy(true);
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			LicenseService.getUnifilares(oLicense, (data) => {
				this.onSuccessGetUnifilares(data);
				this.getView().setBusy(false)
			}, (e) => {
				console.log(e);
				this.getView().setBusy(false);
				this.onErrorGetUnifilares();
			});
		},

		closeUnifilarTable: function () {
			this.oDialogTable.close();
			this.oDialogTable.destroy();
		},

		verifySameUser: function (legajo, solicitanteLic, ...extra) {
			//first i check the extras
			if (!extra.every(function (el) {
				return !!el
			})) {
				return false;
			}
			return legajo == solicitanteLic;
		},

		verifySameUserObservation: function (status, legajo, solicitanteLic, ...extra) {
			//first i check the extras
			if (!extra.every(function (el) {
				return !!el
			})) {
				return false;
			}
			//i check if the status is observation
			if (status != "02") return true;
			return legajo == solicitanteLic;
		},

		formatTimeText: function (dDate) {
			return FormatHelper.getFormattedDate(dDate);
		},

		formatTimeTextOffset: function (dDate) {
			return FormatHelper.getFormattedDateOffset(dDate);
		},

		onInit: function () {
			var sRoute = localStorage.getItem("type");
			var oRouter = AppManagementHelper.getAppRouter();
			oRouter.getRoute(sRoute).attachPatternMatched(this._routePatternMatched, this);

		},

		onAfterRendering: function () {
			var empresa = AppManagementHelper.getModel("UtilsJsonModel").getData().empresa;
			this.getMailsARO(empresa);
		},

		getMailsARO: function (empresa) {
			MailAROService.getMailsARO(empresa);
		},

		//onInit: function () {
		//		var oRouter = AppManagementHelper.getAppRouter();
		//		this.sociedad = AppManagementHelper.getModel("UtilsJsonModel").getData().empresa;
		//this.society=prueba;

		//		this.getImageUrl();
		//	},

		disableAddCoordObservationRole: function (sLicStat, aRoles) {
			var bCoordinateRole = aRoles.find((sRole) => {
				return sRole === "Coordinador_Mantenimiento";
			});
			return sLicStat === "09" && bCoordinateRole;
		},

		rolEdition: function (controlPath, callback) {
			return RolAuthorizationHelper.rolEdition(controlPath, callback);
		},

		rolVisualization: function (controlPath, callback) {
			return RolAuthorizationHelper.rolVisualization(controlPath, callback);
		},

		rolStatusEdition: function (controlPath, callback) {
			return RolAuthorizationHelper.rolStatusEdition(controlPath, callback);
		},
		rolStatusEdition2: function (controlPath, callback) {
			return RolAuthorizationHelper.rolStatusEdition2(controlPath, callback);
		},


		validateSubstatus: function (...extra) {


			return (extra[1] === "" || extra[1] === "R" || extra[1] === "S" || extra[1] === "D" || extra[1] === "E") && extra[2] === "01" &&
				extra[0];
		},

		enableEspecificarBarra: function (Barrafs, UsuarioEncontrado) {
			if (Barrafs === "X") {
				return UsuarioEncontrado;
			} else if (Barrafs === "N") {
				return false;
			} else {
				return false;
			}
		},

		getModoEdicion: function () {
			var UsuarioEncontrado = AppManagementHelper.getModel("PermisosJsonModel").getData().UsuarioEncontrado;
			var Licstat = AppManagementHelper.getModel("LicenseJsonModel").getData().Licstat;
			var aCurrentUserRoles = AppManagementHelper.getModel("UserJsonModel").getData().roles;

			var UserTieneRolesDeEdicion = aCurrentUserRoles.some(function (rol) { //Si tiene alguno de estos roles que son para editar una licencia devuelve true
				return rol === 'ope_solic-lic_transener' || rol === 'ope_solic-lic_transener' || rol === 'ope_solic-lic_transba';
			});

			if (UsuarioEncontrado && UserTieneRolesDeEdicion) {
				if (Licstat === "30" || Licstat === "02") {
					return true;
				}
			} else {
				return false;
			}
		},

		doExport: function () {
			var licencia = this.getView().getModel("LicenseJsonModel").getData();
			var Entregas = this.getView().getModel("DeliveryTableJsonModel").getData().Deliveries;
			var Devoluciones = this.getView().getModel("DevolutionTableJsonModel").getData().Devolutions;

			//var Suspensiones = this.getView().getModel("SuspensionTableJsonModel").getData().Suspensions;
			//var Reanudaciones = this.getView().getModel("ReanudationTableJsonModel").getData().Reanudations;
			//var Observaciones = this.getView().getModel("ObservationTableJsonModel").getData().Observations;

			var Colocaciones = licencia.ColocacionPAT_nav;
			var Retiros = licencia.RetiroPAT_nav;
			var Habilitaciones = licencia.HabilitacionRecierre_nav;
			var Inhibiciones = licencia.InhibicionRecierre_nav;


			var Coordinaciones = licencia.CoordinacionesLicencia_nav;

			var Suspensiones = licencia.SuspensionLicencia_nav;
			var Reanudaciones = licencia.ReanudacionLicencia_nav;
			var Observaciones = licencia.ObservacionesLicencia_nav;

			// En el PDF debe salir el texto no la clave tecnica del tipo de intervencion, Issue # 531
			var oTextos = {
				TipintervText: ((licencia.Tipinterv) ? AppManagementHelper.getModel("TiposIntervencion").getData().TiposIntervencion.filter((data) => {
					return data.Clave === licencia.Tipinterv
				})[0].Descripcion : "")

			};
			if (licencia.Tipo === 'S') {
				var Transferencias = [];
				var Tramitaciones = [];
			} else {
				var Transferencias = licencia.TransferenciaJefeTrabajo_nav.filter(function (item) { //Filtro las transferencias "Fake"
					return item.Trjindex !== '' && item.Trjindex
				});
				var Tramitaciones = licencia.TramitacionesLicencia_nav;
			}

			LicenseService.getUnifilares(licencia, (data) => {

				if (licencia.Id === undefined) {
					licencia.Id = AppManagementHelper.getModel("LicenciaClonadaID").getData().IdClonada;
				}

				var doc = ExportLicenseHelper.createPdfLicense(
					data, licencia, Colocaciones, Retiros, Habilitaciones, Inhibiciones, Entregas,
					Devoluciones, Suspensiones, Reanudaciones,
					Observaciones, Coordinaciones, Tramitaciones,
					Transferencias, oTextos, true
				);
			}, $.proxy(this.onErrorGetUnifilares, this), {
				"$select": "Nombre,Idunifilar,NumVersion,Region,TipoUnifilar,Et,Empresa,Anio,Region,IntAbLe,SecAbBt,SecPatCr,PatAdic,Numerolicencia,Imagenunifilar,Doctype"
			});
		},

		exportLicense: function (e) {
			var that = this;
			var camposRequeridosCompletos = AppManagementHelper.getModel("enableValidLicense").getData().data;

			if (this.getModoEdicion()) {
				//GUARDA Y EXPORTA
				MessageBoxHelper.showConfirm("Imprimir Documento",
					"Para imprimir el documento primero debe guardar los cambios, ¿desea hacerlo ahora?\n \n IMPORTANTE: guardar los cambios implica guardar las modificaciones realizadas en el formulario, \n o crear un documento nuevo si ingresó por las funciones crear o duplicar.",
					function (eleccion) {
						let aRequiredFields = that.validForCreation("Licencia");
						if (aRequiredFields.length > 0) {
							let oModelRequiredFields = AppManagementHelper.getModel("RequiredFieldsModel");
							oModelRequiredFields.setData({
								initialText: `Los siguientes campos son requeridos para poder generar la Licencia`,
								fields: aRequiredFields
							});
							let oDialogRequiredFields = MessageBoxHelper.getValidationDialog();
							oDialogRequiredFields.setModel(oModelRequiredFields, "RequiredFieldsModel");
							oDialogRequiredFields.open();
							return false;
						}

						//Elige SI
						//Si todos los campos requeridos estan completos exporta y guarda
						that.handleSolLic("Licencia", true);

						setTimeout(function () {
							that.doExport();
						}, 6000);

					},
					function (eleccion) {
						//Elige NO, no hace nada
					}
				);

			} else {
				//SOLO EXPORTA
				that.doExport();
			}
		},

		exportSolicitud: function (e) {
			var that = this;
			var camposRequeridosCompletos = AppManagementHelper.getModel("validateRequest").getData().data;

			if (this.getModoEdicion()) {
				//GUARDA Y EXPORTA
				MessageBoxHelper.showConfirm("Imprimir Documento",
					"Para imprimir el documento primero debe guardar los cambios, ¿desea hacerlo ahora?\n \n IMPORTANTE: guardar los cambios implica guardar las modificaciones realizadas en el formulario, \n o crear un documento nuevo si ingresó por las funciones crear o duplicar.",
					function (eleccion) {
						let aRequiredFields = that.validForCreation("Solicitud");
						if (aRequiredFields.length > 0) {
							let oModelRequiredFields = AppManagementHelper.getModel("RequiredFieldsModel");
							oModelRequiredFields.setData({
								initialText: `Los siguientes campos son requeridos para poder generar la Solicitud`,
								fields: aRequiredFields
							});
							let oDialogRequiredFields = MessageBoxHelper.getValidationDialog();
							oDialogRequiredFields.setModel(oModelRequiredFields, "RequiredFieldsModel");
							oDialogRequiredFields.open();
							return false;
						}

						//Elige SI
						//Si todos los campos requeridos estan completos exporta y guarda
						that.handleSolLic("Solicitud", true);

						setTimeout(function () {
							that.doExport();
						}, 6000);

					},
					function (eleccion) {
						//Elige NO, no hace nada
					}
				);

			} else {
				//SOLO EXPORTA
				that.doExport();
			}
		},

		_routePatternMatched: function (oEvent) {
			AppManagementHelper;
			//INI TRNS126
			try {
				AppManagementHelper.getModel("UnifilaresResumenModel").setData({
					unifilares: [],
					marcadores_nav: [],
					marcadoresnorel_nav: [],
					IntAbLe: "",
					SecAbBt: "",
					SecPatCr: "",
					PatAdic: ""
				});
			} catch (err) { }
			//FIN TRNS126
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			this._edit = (oEvent.getParameter("arguments").id === "CREACION") ? false : true;
			var sKey = oEvent.getParameter("arguments").id;
			if (sKey !== "CREACION") {
				if (LicenceHelper.validURLToLicense(sKey) && sPreviousHash !== undefined) {
					var oDataUrl = LicenceHelper.getURLLicenseData(sKey);

					LicenseService.FIND(oDataUrl, this.findSuccess.bind(this), () => {
						MessageBoxHelper.showAlert("Alerta", "Licencia no encontrada", () => {
							window.history.go(-1)
						})
					});
				} else {
					window.history.go(-1)
				}
			} else {
				// Issue 582 - si se trata de una copia y el usuario es solicitante transener de debe asignar siempre el tipo "Programada"
				this.changeLicenTypeCopyTBA();
				// Issue 565 - Al copiar una licencia se debe inicializar el binding de los jefes
				this.bindJefes(AppManagementHelper.getModel("LicenseJsonModel").getData());
				this.validarHabilit(AppManagementHelper.getModel("LicenseJsonModel").getData(), AppManagementHelper.getModel(
					"PersonalHabilitadoModel").getData().Todos);
				this.getView().byId("InputTimbeg").setValue("");
				this.getView().byId("InputTimend").setValue("");
			}
		},

		openPopoverAnulacion: function (oEvent) {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var oButton = oEvent.getSource();
			var oPopover = new sap.m.Popover({
				title: "Causa de anulación",
				contentWidth: "320px",
				contentHeight: "190px",
				placement: sap.m.PlacementType.Left,
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.Text({
								text: "Motivo de anulacíon"
							}),
							new sap.m.Text({
								text: "{AnulacionVisualizacionJsonModel>/Motivo}"
							}),
						]
					}).addStyleClass("sapUiSmallMarginTopBottom sapUiSmallMarginBeginEnd"),
					new sap.m.VBox({
						items: [
							new sap.m.Text({
								text: "Observacion de la anulación"
							}),
							new sap.m.Text({
								text: "{AnulacionVisualizacionJsonModel>/Observacion}"
							}),
						]
					}).addStyleClass("sapUiSmallMarginBeginEnd"),
					new sap.m.VBox({
						items: [
							new sap.m.Text({
								text: "Fecha y hora de anulación"
							}),
							new sap.m.Text({
								text: "{AnulacionVisualizacionJsonModel>/FechaHoraAnulacion}"
							}),
						]
					}).addStyleClass("sapUiSmallMarginBeginEnd sapUiSmallMarginTop")
				]
			})
			var oModelAnulacion = AppManagementHelper.getModel("AnulacionVisualizacionJsonModel");
			oModelAnulacion.setData({
				Motivo: FormatterHelper.findMotivoNoAut(oLicense.Causaanulado),
				Observacion: oLicense.Obscausa,
				FechaHoraAnulacion: FormatHelper.formatDateLicense(oLicense.FechaAnulacion) + " " + FormatHelper.getTimeString(oLicense.HoraAnulacion
					.ms)
			})
			this.getView().addDependent(oPopover);
			oPopover.openBy(oButton);
		},
		openPopoverCancelacion: function (oEvent) {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var oButton = oEvent.getSource();
			var oPopover = new sap.m.Popover({
				title: "Causa de cancelacion",
				contentWidth: "320px",
				contentHeight: "220px",
				placement: sap.m.PlacementType.Left,
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.Text({
								text: "COT/COTDT:"
							}),
							new sap.m.Text({
								text: "{CancelacionVisualizacionJsonModel>/Personal}"
							}),
						]
					}).addStyleClass("sapUiSmallMarginTopBottom sapUiSmallMarginBeginEnd"),
					new sap.m.VBox({
						items: [
							new sap.m.Text({
								text: "Jefe de Trabajo"
							}),
							new sap.m.Text({
								text: "{CancelacionVisualizacionJsonModel>/JefTrabajo}"
							}),
						]
					}).addStyleClass("sapUiSmallMarginTopBottom sapUiSmallMarginBeginEnd"),
					new sap.m.VBox({
						items: [
							new sap.m.Text({
								text: "Tecnico de ET"
							}),
							new sap.m.Text({
								text: "{CancelacionVisualizacionJsonModel>/TecEt}"
							}),
						]
					}).addStyleClass("sapUiSmallMarginTopBottom sapUiSmallMarginBeginEnd"),
					new sap.m.VBox({
						items: [
							new sap.m.Text({
								text: "Fecha y hora de cancelación"
							}),
							new sap.m.Text({
								text: "{CancelacionVisualizacionJsonModel>/FechaHoraCancelacion}"
							}),
						]
					}).addStyleClass("sapUiSmallMarginBeginEnd sapUiSmallMarginTop")
				]
			})
			var oModelCancelacion = AppManagementHelper.getModel("CancelacionVisualizacionJsonModel");

			oModelCancelacion.setData({
				Personal: oLicense.CotCotdt + " " + FormatterHelper.getPersonalHabilitadoName(oLicense.CotCotdt),
				JefTrabajo: oLicense.JefeTrab + " " + FormatterHelper.getJefeName(oLicense.JefeTrab),
				TecEt: oLicense.Tecet + " " + FormatterHelper.getPersonalHabilitadoName(oLicense.Tecet),
				FechaHoraCancelacion: FormatHelper.formatDateLicense(oLicense.CancFecha) + " " + FormatHelper.getTimeString(oLicense.CancHora
					.ms)
			})
			this.getView().addDependent(oPopover);
			oPopover.openBy(oButton);
		},
		//if servicio else local
		formatDateTimeCoord: function (index, CreationDate, CreationTime) {
			if (index !== "") {
				if (CreationDate && CreationTime) {
					var sTime = FormatHelper.getTimeString(CreationTime.ms)
					return FormatHelper.formatDateLicense(CreationDate) + " " + sTime
				}
			} else {
				if (CreationDate) {
					var sDate = FormatHelper.formatDateLicenseWithoutUtc(CreationDate);
					var sTime = FormatHelper.getTimeStringWithoutUTC(CreationDate.getTime())
					return sDate + " " + sTime;
				}
			}
			return "";
		},

		onAddTramitacion: function () {
			var oTramitacionModel = AppManagementHelper.getModel("TramitacionListJsonModel");
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
			};
			aTramitaciones.push(oObject);
			oTramitacionModel.refresh(true);
		},

		enableCausaNO: function (oEvent) {
			var oTramitacionModel = AppManagementHelper.getModel("TramitacionListJsonModel");
			var sPath = oEvent.getSource().getParent().getBindingContext("TramitacionListJsonModel").getPath();
			var sKey = oEvent.getSource().getSelectedKey();
			// si es rechazada
			if (sKey === "02") {
				oTramitacionModel.setProperty(sPath + "/Enabled", true);
			} else {
				oTramitacionModel.setProperty(sPath + "/Enabled", false);
				oTramitacionModel.setProperty(sPath + "/CausaNo", "");
				oTramitacionModel.setProperty(sPath + "/Enabled", "");
				oTramitacionModel.setProperty(sPath + "/MotivoNo", "");
			}

		},

		handleUserOperations: function (oEvent) {
			if (!this._edit) {
				return true;
			} else {
				return false;
			}
		},

		validateToSend: function (sModel, sCooIndex, ...extra) {
			var oModel = AppManagementHelper.getModel(sModel);
			var aItems = this.getItemsFromAppModel(oModel, sModel);
			var iCoordinations = (aItems.length) ? aItems.length : 0;
			if (sCooIndex === "") {
				return extra.every((x) => x);
			} else {
				return (parseInt(sCooIndex) > iCoordinations) && extra.every((x) => x);
			}
		},

		validateAddObservation: function (sObsIndex) {
			var iObservations = AppManagementHelper.getModel("ObservationTableJsonModel").getData().Observations.length;
			if (sObsIndex === "") {
				return true;
			} else {
				return (parseInt(sObsIndex) > iObservations);
			}
		},

		editComments: function () {
			LicenseService.editComments().then((license) => {
				MessageBoxHelper.showAlert("Alert", "Se he editado el comentario de manera exitoso", () => {
					LicenseService.FIND(license);
				})
			}).catch(() => {
				MessageBoxHelper.showAlert("Error al editar comentarios")
			});
		},

		// TODO A ESTO LE FALTA DEFINICION POR PARTE DE CLIENTE CON SUS ATRIBUTOS
		onAddDelivery: function () {
			var oDeliveryModel = AppManagementHelper.getModel("DesliveryTableJsonModel");
			var aDeliveries = oDeliveryModel.getData().Deliveries;
			var empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			var oObject = {
				Id: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id"),
				Empresa: empresa,
				Time: new Date(),
				coordinador: "bindear cuando exista",
				comentarios: ""
			};
			aDeliveries.push(oObject);
			oDeliveryModel.refresh();
		},

		onAddSuspension: function () {
			var oSuspensionModel = AppManagementHelper.getModel("SuspensionTableJsonModel");
			var aSuspension = oSuspensionModel.getData().Suspensions;
			var empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			var oObject = {
				Id: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id"),
				Empresa: empresa,
				Susindex: "",
				Time: null,
				Cot: "",
				Commen: "",
				Tecnicoet: ""
			};
			aSuspension.push(oObject);
			oSuspensionModel.refresh();
		},

		onAddReanudation: function () {
			var oReanudationModel = AppManagementHelper.getModel("ReanudationTableJsonModel");
			var aReanudations = oReanudationModel.getData().Reanudations;
			var empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			var oObject = {
				Id: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id"),
				Empresa: empresa,
				Reaindex: "",
				Time: null,
				Cot: "",
				//Commen: "",
				Tecnicoet: ""
			};
			aReanudations.push(oObject);
			oReanudationModel.refresh();
		},

		getItemsFromAppModel: function (oModel, sModel) {
			switch (sModel) {
				case "ReanudationTableJsonModel":
					return oModel.getData().Reanudations;
				case "SuspensionTableJsonModel":
					return oModel.getData().Suspensions;
				case "DevolutionTableJsonModel":
					return oModel.getData().Devolutions;
				case "CoordinationTableJsonModel":
					return oModel.getData().Coordinations;
				case "ObservationTableJsonModel":
					return oModel.getData().Observations;
				case "DeliveryTableJsonModel":
					return oModel.getData().Deliveries;
				case "TransferListJsonModel":
					return oModel.getData().Transfers;
				case "TramitacionListJsonModel":
					return oModel.getData().Tramitaciones;
			}
		},

		formatStatus: function (sTipoDoc, Id, sIdLicencia, sLicStat, Substatus) {
			if (sLicStat === "01") {
				var s = FormatterHelper.getApprovalSubstatus(sLicStat, Substatus);
			} else {
				var s = FormatterHelper.getStatusName(sLicStat);
			}
			return "Estado: " + " " + s;
		},

		onDeleteFromTable: function (sModel, oEvent) {
			var event = oEvent.getSource();
			MessageBoxHelper.showConfirm("Alerta", "¿Está seguro que desea eliminar?", () => {
				var oControl = event.getParent().getBindingContext(sModel).getObject();
				var oModel = AppManagementHelper.getModel(sModel);
				if (sModel === "TramitacionListJsonModel" && oControl.Traindex !== "") {
					var oLicencia = AppManagementHelper.getModel("LicenseJsonModel").getData();
					LicenseService.removeTramitacion(oControl).then(() => {
						LicenseService.FIND(oLicencia)
					}).catch(() => {

					})
				}

				var aItems = this.getItemsFromAppModel(oModel, sModel);
				var iIndex = aItems.indexOf(oControl);
				aItems.splice(iIndex, 1);
				oModel.refresh(true);
			})
		},

		sendCoordination: function (oEvent) {
			var oSource = oEvent.getSource();
			MessageBoxHelper.showConfirm("Confirmación", "¿Está seguro que desea realizar la coordinación?", () => {
				BusyDialogHelper.open();
				var oCoordination = oSource.getParent().getParent().getBindingContext("CoordinationTableJsonModel").getObject();
				oCoordination.Coouser = AppManagementHelper.getUser();
				LicenseService.coordinateLicence(oCoordination);
			})
		},

		sendObservation: function (oEvent) {
			var oObservation = oEvent.getSource().getParent().getParent().getBindingContext("ObservationTableJsonModel").getObject();
			oObservation.Obsuser = AppManagementHelper.getUser();

			//Si eligio "motivo"
			if (oObservation.Obscause !== undefined && oObservation.Obscause !== "") {
				if (oObservation.Observation === "") {
					//Si no puso "comentario de la observacion"
					MessageBoxHelper.showAlert("Alerta", "Debe completar el Comentario de la observación.")
				} else {
					//Si ya completo motivo y comentario
					BusyDialogHelper.open();
					LicenseService.observateLicence(oObservation);
				}
			} else {
				MessageBoxHelper.showAlert("Alerta", "Debe completar Motivo y Comentario de la observación.")
			}
		},

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
							if (oTramitacion.EmpTramita === "" || oTramitacion.CausaNo === "" || oTramitacion.MotivoNo === "") {
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
				}
				return bValid
			} else {
				for (var oTramitacion of aTramitaciones) {
					if (oTramitacion.EmpTramita === "") {
						bValid = false;
						break;
					}
					if (oTramitacion.Estado === "") {
							bValid = false;
							break;
						}
				}
				return bValid
			}

		},

		sendTramitacion: function (oEvent) {
			this.bFinishTramitacion = false;
			this.selectValue = "";
			this.bFromSelect = false;
			this.makeTramitacion();
		},

		finishTramitacion: function () {
			this.bFinishTramitacion = true;
			this.selectValue = "";
			this.bFromSelect = false;
			this.makeTramitacion();
		},

		changeStatusTramitacion: function (oEvent) {
			this.bFinishTramitacion = true;
			this.selectValue = oEvent.getSource().getSelectedKey();
			this.bFromSelect = true;
			this.makeTramitacion();
		},

		cancelTramitacion: function () {
			MessageBoxHelper.showConfirm("Alerta", "¿Está seguro que desea cancelar la tramitación actual?", () => {
				LicenseService.cancelTramitacion();
			})
		},

		makeTramitacion: function () {
			var aTramitaciones = AppManagementHelper.getModel("TramitacionListJsonModel").getData().Tramitaciones;
			let sStatus = LicenceHelper.getTramitStatus(aTramitaciones);

			AppManagementHelper.getModel("TramitacionStatusModel").setProperty("/StatusText", FormatterHelper.getStatusTramitacionText(sStatus));

			if (this.validTramitaciones(aTramitaciones)) {
				BusyDialogHelper.open();
				aTramitaciones.forEach((tramitador) => {
					tramitador.Avisoprog = AppManagementHelper.getStringUserLegacy();
					delete tramitador.Enabled;
				});
				LicenseService.tramitLicence(aTramitaciones, this.bFinishTramitacion, this.bFromSelect, this.selectValue);
				this.aDates = [];
				this.oDatesEdition = null
			} else {
				MessageBoxHelper.showAlert("Alerta", "Debe completar los campos faltantes.")
			}
		},

		addOrRemoveDate: function (oEvent) {
			console.log(oEvent);
		},

		getDatesFiltered: function (aResults) {
			var aMappedDates = aResults.map((oFecha) => {
				return {
					Fecha: FormatHelper.formatDatesGMT(oFecha.Fecha)
				}
			})
			return aMappedDates;
		},

		openTramitacionCalendarTable: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext("TramitacionListJsonModel");
			var sPath = oContext.getPath();
			var oTramitacion = oContext.getObject();
			var bHasTraindex = oTramitacion.Traindex !== "";
			if (bHasTraindex) {
				BusyDialogHelper.open();
				LicenseService.getDatesFromTramitacion(oTramitacion).then((data) => {
					TramitacionCalendarHelper.handleCalendarData(data.results);
					this.getView().getModel("TramitacionListJsonModel").setProperty(sPath + "/CalendarDates", data.results);
					BusyDialogHelper.close();
				}).catch(() => {
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al obtener las fechas");
				})
			}

			var oViewDependent = this.getView();
			var oCalendarTramitacionDialog = TramitacionCalendarHelper.getTramitacionCalendarView(oViewDependent, sPath, bHasTraindex);
			oCalendarTramitacionDialog.open();
		},

		openTramitacionCalendarDialog: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext("TramitacionListJsonModel");
			var sPath = oContext.getPath();
			this._actualPathCalendar = sPath + "/CalendarDates/FechasSeleccionadas";
			var oTramitacion = oContext.getObject();
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
								enabled: {
									parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/",
										"LicenseJsonModel>/Werks",
										"DisableControlsJsonModel>/visibleLic",
										"PermisosJsonModel>/UsuarioEncontrado"
									],
									formatter: this.rolStatusEdition("tramitacion/")
								},
								width: "230px",
								selectedKey: "{TramitacionListJsonModel>" + sPath + "/CalendarDates/EstadoEntrega}",
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
								enabled: {
									parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/",
										"LicenseJsonModel>/Werks",
										"DisableControlsJsonModel>/visibleLic",
										"PermisosJsonModel>/UsuarioEncontrado"
									],
									formatter: this.rolStatusEdition("tramitacion/")
								},
								width: "500px",
								value: "{TramitacionListJsonModel>" + sPath + "/CalendarDates/Observacion}",
							})
						]
					}).addStyleClass("sapUiTinyMarginBeginEnd sapUiTinyMarginBottom sapUiSmallMarginTop"),
					new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Start,
						justifyContent: sap.m.FlexJustifyContent.Center,
						items: [
							new sap.ui.unified.Calendar({
								selectedDates: {
									path: "TramitacionListJsonModel>" + sPath + "/CalendarDates/FechasSeleccionadas",
									template: new sap.ui.unified.DateRange({
										startDate: "{TramitacionListJsonModel>Fecha}"
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
						enabled: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/",
								"LicenseJsonModel>/Werks",
								"DisableControlsJsonModel>/visibleLic",
								"PermisosJsonModel>/UsuarioEncontrado"
							],
							formatter: this.rolStatusEdition("tramitacion/")
						},
						text: "Guardar",
						press: [this.saveDates, this]
					}).addStyleClass("buttonInverted"),
					new sap.m.Button({
						text: "Cancelar",
						press: () => {
							this.aDates = this.getView().getModel("TramitacionListJsonModel").getProperty(this._actualPathCalendar);
							this.calendarTramitacionDialog.close();
							this.calendarTramitacionDialog.destroy(true);
						}
					}).addStyleClass("buttonInverted")
				]
			});
			this.getView().addDependent(this.calendarTramitacionDialog);
			if (oTramitacion.Traindex !== "") {
				BusyDialogHelper.open();
				LicenseService.getDatesFromTramitacion(oTramitacion).then((data) => {
					this._bEditionCalendar = true;
					var oPayload = {
						Anio: data.results[0] ? data.results[0].Anio : "",
						Id: data.results[0] ? data.results[0].Id : "",
						Traindex: data.results[0] ? data.results[0].Traindex : "",
						Empresa: data.results[0] ? data.results[0].Empresa : "",
						EstadoEntrega: this.getEstadoEntrega(this.oDatesEdition, data.results[0]),
						Observacion: this.getObservacion(this.oDatesEdition, data.results[0]),
						FechasSeleccionadas: this.getDatesFiltered(data.results),
					};
					this.getDaysDiferenceToAdd(oPayload, this.oDatesEdition);
					this.oCalendarPayload = oPayload;
					this.getView().getModel("TramitacionListJsonModel").setProperty(sPath + "/CalendarDates", oPayload);
					BusyDialogHelper.close();
					this.calendarTramitacionDialog.open();
				}).catch((e) => {
					BusyDialogHelper.close()
				})
			} else {
				this._bEditionCalendar = false;
				this.calendarTramitacionDialog.open();
			}

		},

		getEstadoEntrega: function (oDatesEdition, oResult) {
			if (oDatesEdition) {
				if (oDatesEdition.path === this._actualPathCalendar) {
					return oDatesEdition.EstadoEntrega ? oDatesEdition.EstadoEntrega : ""
				} else {
					return oResult ? oResult.Estado : "";
				}
			} else {
				return oResult ? oResult.Estado : "";
			}
		},

		getObservacion: function (oDatesEdition, oResult) {
			if (oDatesEdition) {
				if (oDatesEdition.path === this._actualPathCalendar) {
					return oDatesEdition.Observacion ? oDatesEdition.Observacion : ""
				} else {
					return oResult ? oResult.Observaciones : "";
				}
			} else {
				return oResult ? oResult.Observaciones : "";
			}
		},

		getDaysDiferenceToAdd: function (oPayload, oDatesEdition) {
			if (!oDatesEdition) {
				var aDates = [];
			} else {
				var aDates = oDatesEdition.dates;
				if (oDatesEdition.path === this._actualPathCalendar) {
					var difference = _.differenceBy(aDates, oPayload.FechasSeleccionadas, (o) => {
						return o.Fecha.getTime();
					});
					oPayload.FechasSeleccionadas = [...oPayload.FechasSeleccionadas, ...difference]
				}
			}
		},

		onSelectDate: function (oEvent) {
			var aDatesLocal = oEvent.getSource().getSelectedDates();
			var aEmpty = [];
			for (var oDate of aDatesLocal) {
				aEmpty.push({
					Fecha: oDate.getProperty("startDate")
				})
			}
			if (!this._bEditionCalendar) {
				this.aDates = aEmpty;
			} else {
				this.oDatesEdition = {
					path: this._actualPathCalendar,
					dates: aEmpty
				};
			}
		},

		saveDates: function () {
			if (this.oDatesEdition) {
				this.oDatesEdition.EstadoEntrega = this.oCalendarPayload.EstadoEntrega;
				this.oDatesEdition.Observacion = this.oCalendarPayload.Observacion;
			}
			var aDates = !this._bEditionCalendar ? this.aDates : this.oDatesEdition ? this.oDatesEdition.dates : this.aDates;
			if (this._bEditionCalendar) {
				BusyDialogHelper.open();
				var aDifferenceToDelete = _.differenceBy(this.oCalendarPayload.FechasSeleccionadas, aDates, (o) => {
					return o.Fecha.getTime();
				});
				LicenseService.removeDates(this.oCalendarPayload, aDifferenceToDelete).then((d) => {
					BusyDialogHelper.close();
				}).catch(() => {
					BusyDialogHelper.close();
				})
			}

			this.calendarTramitacionDialog.close();
			this.calendarTramitacionDialog.destroy(true);
			this.getView().getModel("TramitacionListJsonModel").setProperty(this._actualPathCalendar, aDates);
		},

		sendDelivery: function (oEvent) {
			var oDelivery = oEvent.getSource().getParent().getBindingContext("DeliveryTableJsonModel").getObject();
			console.log(oDelivery)
			var oValidation = this.validateDelivery(oDelivery, "Delivery");
			if (!oValidation.valid) {
				MessageBoxHelper.showAlert("Alerta", oValidation.message);
			} else {
				BusyDialogHelper.open();
				//oDelivery.Cot = AppManagementHelper.getLoginName();
				delete oDelivery.enabled;
				delete oDelivery.NoAuth;
				delete oDelivery.enabledInputMotivo;
				delete oDelivery.sameDayValidation;
				delete oDelivery.TejtValueState;
				delete oDelivery.TejtValueStateText;
				// Delete props for issue #513
				delete oDelivery.showPrevValue;
				delete oDelivery.TejtPrev;
				delete oDelivery.TecETPrev;
				oDelivery.Delivereddate = new Date();
				LicenseService.deliveryLicence(oDelivery);
			}
		},
		sendHabilitacion: function (oEvent) {
			var oHabilitacion = oEvent.getSource().getParent().getBindingContext("HabilitacionTableJsonModel").getObject();

			var oValidation = this.validateSend(oHabilitacion)
			if (!oValidation.valid) {
				MessageBoxHelper.showAlert("Alerta", oValidation.message);
			} else {
				BusyDialogHelper.open();
				LicenseService.HabilitacionLicence(oHabilitacion);
			}
		},
		sendInhibicion: function (oEvent) {
			var oInhibicion = oEvent.getSource().getParent().getBindingContext("InhibicionTableJsonModel").getObject();
			var oValidation = this.validateSend(oInhibicion)
			if (!oValidation.valid) {

				MessageBoxHelper.showAlert("Alerta", oValidation.message);
			} else {
				BusyDialogHelper.open();
				LicenseService.InhibicionLicence(oInhibicion);
			}
		},
		sendColocacionPAT: function (oEvent) {
			var oColocacionPAT = oEvent.getSource().getParent().getBindingContext("ColocacionTableJsonModel").getObject();
			var oValidation = this.validateSend(oColocacionPAT)
			if (!oValidation.valid) {
				MessageBoxHelper.showAlert("Alerta", oValidation.message);
			} else {
				BusyDialogHelper.open();
				LicenseService.ColocacionPATLicence(oColocacionPAT);
			}
		},
		sendRetiroPAT: function (oEvent) {
			var oRetiroPAT = oEvent.getSource().getParent().getBindingContext("RetiroTableJsonModel").getObject();
			var oValidation = this.validateSend(oRetiroPAT)
			if (!oValidation.valid) {
				MessageBoxHelper.showAlert("Alerta", oValidation.message);
			} else {
				BusyDialogHelper.open();
				LicenseService.RetiroPATLicence(oRetiroPAT);
			}
		},

		sendDevolution: function (oEvent) {
			BusyDialogHelper.open();
			var oDevolution = oEvent.getSource().getParent().getBindingContext("DevolutionTableJsonModel").getObject();
			var oValidation = this.validateDelivery(oDevolution, "Devolution");
			if (!oValidation.valid) {
				MessageBoxHelper.showAlert("Alerta", oValidation.message);
				BusyDialogHelper.close();
			} else {
				delete oDevolution.enabled;
				delete oDevolution.NoAuth;
				delete oDevolution.enabledContinua;
				delete oDevolution.enabledInputMotivo;
				delete oDevolution.sameDayValidation;
				delete oDevolution.Motivono;
				delete oDevolution.TejtValueState;
				delete oDevolution.TejtValueStateText;
				// Delete props for issue #513
				delete oDevolution.showPrevValue;
				delete oDevolution.TejtPrev;
				delete oDevolution.TecETPrev;
				oDevolution.Delivereddate = new Date();
				LicenseService.devolutionLicence(oDevolution);
			}
		},

		getLastDevolutionDate: function () {
			let dSolbeg = AppManagementHelper.getModel("LicenseJsonModel").getData().Solbeg;
			let aDevolutions = AppManagementHelper.getModel("DevolutionTableJsonModel").getData().Devolutions;
			let aDevolutionsFiltered = aDevolutions.filter(e => e.Devindex && e.Devindex !== "");
			if (aDevolutionsFiltered.length > 0) {
				let oLastDevolution = aDevolutionsFiltered[aDevolutionsFiltered.length - 1];
				if (oLastDevolution.Datelicencia) {
					return oLastDevolution.Datelicencia
				}
			} else {
				return new Date();
			}

		},

		getLastDevolutionTime: function () {
			let aDevolutions = AppManagementHelper.getModel("DevolutionTableJsonModel").getData().Devolutions;
			let aDevolutionsFiltered = aDevolutions.filter(e => e.Devindex && e.Devindex !== "");
			if (aDevolutionsFiltered.length > 0) {
				let oLastDevolution = aDevolutionsFiltered[aDevolutionsFiltered.length - 1];
				return oLastDevolution.Time ? oLastDevolution.Time : new Date();
			} else {
				return new Date();
			}
		},

		getLastTejt: function (oLicense) {
			let aPersHabTodos = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Todos;
			let oJefe = aPersHabTodos.find(oItem => oItem.Legajo === oLicense.Jefe);

			let aDevolutions = AppManagementHelper.getModel("DevolutionTableJsonModel").getData().Devolutions;
			let aDevolutionsFiltered = aDevolutions.filter(e => e.Devindex && e.Devindex !== "");
			if (aDevolutionsFiltered.length > 0) {
				let oLastDevolution = aDevolutionsFiltered[aDevolutionsFiltered.length - 1];
				if (oLastDevolution.Tejt) {
					return oLastDevolution.Tejt;
				} else {
					return oJefe.Legajo ? oJefe.Legajo : "";
				}
			} else {
				return oJefe.Legajo ? oJefe.Legajo : "";
			}

		},

		//Issue 602
		getLastTecET: function (oLicense) {
			let aPersHabTodos = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Todos;
			let oTecETResult = aPersHabTodos.find(oItem => oItem.Legajo === oLicense.Tecet);
			var oTecET;
			//fix Issue 602
			if (oTecETResult) {
				oTecET = oTecETResult.Legajo
			} else {
				oTecET = "";
			}
			let aDevolutions = AppManagementHelper.getModel("DevolutionTableJsonModel").getData().Devolutions;
			let aDevolutionsFiltered = aDevolutions.filter(e => e.Devindex && e.Devindex !== "");
			if (aDevolutionsFiltered.length > 0) {
				let oLastDevolution = aDevolutionsFiltered[aDevolutionsFiltered.length - 1];
				if (oLastDevolution.TecET) {
					return oLastDevolution.TecET;
				} else {
					return oTecET ? oTecET : "";
				}
			} else {
				return oTecET ? oTecET : "";
			}
		},

		dialogCancelacionDefinitiva: function () {
			let oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			let oModelCancelacionDefinitiva = AppManagementHelper.getModel("CancelacionDefinitivaJsonModel");
			oModelCancelacionDefinitiva.setData({
				Datelicencia: this.getLastDevolutionDate(),
				Time: this.getLastDevolutionTime(),
				Tejt: this.getLastTejt(oLicense),
				TecET: this.getLastTecET(oLicense),
				// TecET: "",
				Personal: AppManagementHelper.getUser(),
				Cancel: "X",
				Anio: oLicense.Anio,
				Empresa: oLicense.Empresa,
				Id: oLicense.Id
			});
			var oModelData = oModelCancelacionDefinitiva.getData();
			if (oModelData.Tejt) {
				// Si la condicion  de trabajo es TcT debiese usar los Tct sino los normales
				if (oLicense.Jobcond === "04" || oLicense.Jobcond === "05") {
					var sProperty = "/JefeDeTrabajoTct";
				} else {
					sProperty = "/JefeDeTrabajo";
				}
				var aPersonalTodo = AppManagementHelper.getModel("PersonalHabilitadoModel").getProperty(sProperty);
				var oPersonal = aPersonalTodo.find(e => e.Legajo === oModelData.Tejt);
				this.handleLegacyValidation("TejtCD", {
					dateAdded: true,
					estado: oPersonal.Estado,
					date: oPersonal.Vigencia
				})
			}
			let oDialogCancelacionDefinitiva = new sap.m.Dialog({
				contentWidth: "600px",
				afterClose: (oEvent) => {
					oEvent.getSource().destroy(true);
				},
				title: "Cancelación Definitiva",
				content: [
					new sap.m.HBox({
						alignItems: "Center",
						items: [
							new sap.m.Label({
								width: "100px",
								text: "Fecha y Hora:"
							}).addStyleClass("sapUiTinyMarginEnd"),
							new sap.m.DatePicker({
								dateValue: "{CancelacionDefinitivaJsonModel>/Datelicencia}",
								minDate: "{LicenseJsonModel>/Solbeg}",
								displayFormat: "dd-MM-yyyy",
							}),
							new sap.m.TimePicker({
								dateValue: "{CancelacionDefinitivaJsonModel>/Time}",
								displayFormat: "HH:mm"
							}).addStyleClass("sapUiTinyMarginBegin"),
						]
					}).addStyleClass("sapUiTinyMarginBeginEnd  sapUiSmallMarginTop"),
					new sap.m.HBox({
						alignItems: "Center",
						items: [
							new sap.m.Label({
								width: "100px",
								text: "COT/COTDT: "
							}).addStyleClass("sapUiTinyMarginEnd"),
							new sap.m.Text({
								text: "{CancelacionDefinitivaJsonModel>/Personal}",
							})
						]
					}).addStyleClass("sapUiTinyMarginBeginEnd  sapUiSmallMarginTop"),
					new sap.m.HBox({
						alignItems: "Center",
						items: [
							new sap.m.Label({
								width: "100px",
								text: "Jefes de Trabajo:"
							}).addStyleClass("sapUiTinyMarginEnd"),
							new sap.m.ComboBox({
								width: "432px",
								change: $.proxy(this.handleLegacyValidation, this, "TejtCD"),
								selectedKey: "{CancelacionDefinitivaJsonModel>/Tejt}",
								valueState: "{LegacyValidationJsonModel>/TejtCancelacionDefValueState}",
								valueStateText: "{LegacyValidationJsonModel>/TejtCancelacionDefValueStateText}",
								items: {
									templateShareable: false,
									path: "PersonalHabilitadoModel>/CboJefeCancelacion",
									template: new sap.ui.core.Item({
										key: "{PersonalHabilitadoModel>Legajo}",
										text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
									})
								}
							}),
						]
					}).addStyleClass("sapUiTinyMarginBeginEnd  sapUiSmallMarginTop"),
					new sap.m.HBox({
						alignItems: "Center",
						items: [
							new sap.m.Label({
								width: "100px",
								text: "Técnico de ET:"
							}).addStyleClass("sapUiTinyMarginEnd"),
							new sap.m.ComboBox({
								width: "432px",
								// change: $.proxy(this.handleLegacyValidation, this, "TejtCD"),
								// valueState: "{LegacyValidationJsonModel>/TejtCancelacionDefValueState}",
								// valueStateText: "{LegacyValidationJsonModel>/TejtCancelacionDefValueStateText}",
								selectedKey: "{CancelacionDefinitivaJsonModel>/TecET}",
								items: {
									templateShareable: false,
									path: "PersonalHabilitadoModel>/TecnicosEt",
									template: new sap.ui.core.Item({
										key: "{PersonalHabilitadoModel>Legajo}",
										text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
									}),
									// filters: new sap.ui.model.Filter([
									//     new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M04"),
									//     new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M08"),
									//     new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M12"),
									//     new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M16"),
									//     new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M20"),
									//     new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M24"),
									//     new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M28"),
									//     new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "PE5")
									// ], false)
								}
							}),
						]
					}).addStyleClass("sapUiTinyMarginBeginEnd  sapUiSmallMarginTopBottom")
				],
				buttons: [
					new sap.m.Button({
						text: "Aceptar",
						press: [this.sendCancelacionDefinitiva, this]
					}).addStyleClass("buttonInverted floatLeft"),
					new sap.m.Button({
						text: "Cancelar",
						icon: "sap-icon://decline",
						press: (oEvent) => {
							oEvent.getSource().getParent().close();
							oEvent.getSource().getParent().destroy(true);
						}
					}).addStyleClass("buttonInverted floatLeft"),
				]
			});
			this.oDialogCancelaciónDefinitiva = oDialogCancelacionDefinitiva;
			this.getView().addDependent(oDialogCancelacionDefinitiva);
			oDialogCancelacionDefinitiva.open()
		},

		cancelacionDefinitivaIsValid: function () {
			let oModelCancelacionDefinitivaData = AppManagementHelper.getModel("CancelacionDefinitivaJsonModel").getData();
			return oModelCancelacionDefinitivaData.Datelicencia !== null && oModelCancelacionDefinitivaData.Time !== null &&
				oModelCancelacionDefinitivaData.Tejt !== "";
		},

		sendCancelacionDefinitiva: function () {
			if (this.cancelacionDefinitivaIsValid()) {
				this.oDialogCancelaciónDefinitiva.close();
				this.oDialogCancelaciónDefinitiva.destroy(true);
				var oCC = AppManagementHelper.getModel("CancelacionDefinitivaJsonModel").getData();
				BusyDialogHelper.open("Cargando...");
				LicenseService.cancelacionDefinitivaLicence(oCC);
			} else {
				MessageBoxHelper.showAlert("Alerta", "Debe completar fecha, hora y tecnico para poder realizar la cancelación definitiva")
			}
		},

		handleDateChange: function (sModel, oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext(sModel);
			var oBindingPath = oBindingContext.getPath();
			var oContextData = oBindingContext.getObject();
			if (oEvent.getSource().getMetadata().getName() === "sap.m.DatePicker") {
				this.isDateDeliveryValid = oEvent.getParameter("valid");
			}

			if (sModel === "DeliveryTableJsonModel") {
				if (oContextData.Time && oContextData.Datelicencia) {
					AppManagementHelper.getModel(sModel).setProperty(oBindingPath + "/enabledInputMotivo", false);
					AppManagementHelper.getModel(sModel).setProperty(oBindingPath + "/Motivono", "")
				} else {
					AppManagementHelper.getModel(sModel).setProperty(oBindingPath + "/enabledInputMotivo", true)
				}
			}

			if (sModel === "DevolutionTableJsonModel") {
				if (oContextData.Time && oContextData.Datelicencia) {
					AppManagementHelper.getModel(sModel).setProperty(oBindingPath + "/enabledInputMotivo", false);
					AppManagementHelper.getModel(sModel).setProperty(oBindingPath + "/Motivono", "")
				} else {
					AppManagementHelper.getModel(sModel).setProperty(oBindingPath + "/enabledInputMotivo", true)
				}
			}

		},

		onMotivoNoEntregaChange: function (oEvent) {
			if (oEvent.getParameters().value !== '') {
				//AppManagementHelper.getModel("DeliveryTableJsonModel").getData().Deliveries[0].Time = null;
				//AppManagementHelper.getModel("DeliveryTableJsonModel").getData().Deliveries[0].Time = new Date("2020-01-01 00:00");
			}
		},

		devolutionWithSameDateHasBeenMade: function (oDevolution) {
			var aDevolutions = AppManagementHelper.getModel("DevolutionTableJsonModel").getData().Devolutions;
			if (aDevolutions.length > 0) {
				var aDevolutionsCreated = aDevolutions.filter(e => e.Devindex && e.Devindex !== "");
				if (aDevolutionsCreated.length > 0) {
					var oDevolutionWithSameDate = aDevolutionsCreated.find(e => e.Datelicencia.getTime() === oDevolution.Datelicencia.getTime());
					if (oDevolutionWithSameDate) {
						return true;
					} else {
						return false;
					}
				}
				return false;
			}
			return false;
		},

		deliveryWithSameDateHasBeenMade: function (oDelivery) {
			var aDeliveries = AppManagementHelper.getModel("DeliveryTableJsonModel").getData().Deliveries;
			if (aDeliveries.length > 0) {
				var aDeliveriesCreated = aDeliveries.filter(e => e.Entindex && e.Entindex !== "");
				if (aDeliveriesCreated.length > 0) {
					var oDeliveryWithSameDateFound = aDeliveriesCreated.find(e => e.Datelicencia.getTime() === oDelivery.Datelicencia.getTime());
					if (oDeliveryWithSameDateFound) {
						return true;
					} else {
						return false;
					}
				}
				return false;
			}
			return false;
		},

		sameDateHasBeenMade: function (oPayload, sType) {
			if (sType === "Delivery") {
				return this.deliveryWithSameDateHasBeenMade(oPayload);
			} else {
				return this.devolutionWithSameDateHasBeenMade(oPayload)
			}

		},
		validateSend: function (oObject, sType) {
			var oValidationObject = {
				valid: true,
				message: "Campos requeridos."
			};

			// Validate Datehab
			if (!oObject.Datehab) {
				oValidationObject.valid = false;
				oValidationObject.message = "La fecha es obligatoria";
			}

			// Validate Time
			if (oObject.Time === null) {
				oValidationObject.valid = false;
				oValidationObject.message = "La hora es requerida";
			}

			// Validate Coment
			if (oObject.Coment === '') {
				oValidationObject.valid = false;
				oValidationObject.message = "Debe completar un comentario";
			}

			// Validate Tplnr
			if (oObject.Tplnr === "") {
				oValidationObject.valid = false;
				oValidationObject.message = "Debe de agregar una Estacion para poder realizar la operación";
			}

			return oValidationObject;
		},

		validateDelivery: function (oDelivery, sType) {
			var oValidationObject = {
				valid: true,
				message: "Campos requeridos."
			};

			if (!oDelivery.Datelicencia) {
				oValidationObject.valid = false;
				oValidationObject.message = "La fecha es obligatoria para la entrega";
				return oValidationObject;
			}

			if (oDelivery.Time === null) {
				oValidationObject.valid = false;
				oValidationObject.message = "La hora es requerida";
			}

			if (sType === "Delivery") {
				if (oDelivery.Time) {
					oValidationObject.valid = true;
				} else {
					if (!oDelivery.Motivono) {
						oValidationObject.valid = false;
						oValidationObject.message = "Si no agregó hora, el motivo de NO entrega es requerido para realizar la entrega";
					} else {
						oValidationObject.valid = true;
					}
				}

				if (!oDelivery.Motivono && !oDelivery.Folio) {
					oValidationObject.valid = false;
					oValidationObject.message = "Si no agregó el \"Motivo de NO entrega\", el folio es requerido para realizar la entrega";
				}
			}

			if (oDelivery.Tejt === "") {
				oValidationObject.valid = false;
				oValidationObject.message = "Debe de agregar un \"Jefe de Trabajo\" para poder realizar la operación";
			}

			if (this.sameDateHasBeenMade(oDelivery, sType)) {
				oValidationObject.valid = false;
				oValidationObject.message = "No se pueden realizar 2 entregas / devoluciones con fechas iguales";
			}

			if (oDelivery.Motivono === "" && LicenceHelper.deliveryIsNotAuthorized(oDelivery.Datelicencia)) {
				oValidationObject.valid = false;
				oValidationObject.message = "Para entregas con estado diario 'No autorizado' es necesario completar el motivo de la NO ENTREGA";
			}
			// Issue #535 el estado diario " anulada por el solicitante" NO bloquea la entrega
			// Se agrega función validación el estado Anulada por solicitante bloquea la entrega
			if (oDelivery.Motivono === "" && LicenceHelper.deliveryIsAnuladaSol(oDelivery.Datelicencia)) {
				oValidationObject.valid = false;
				oValidationObject.message =
					"Para entregas con estado diario 'Anulada por solcitante' es necesario completar el motivo de la NO ENTREGA";
			}

			if (oValidationObject.valid && !this.isDateDeliveryValid) {
				oValidationObject.valid = false;
				oValidationObject.message = "Ingrese fecha dentro del rango permitido";
			}

			return oValidationObject;
		},

		onCammesaStateChange: function (oEvent) {
			var bOutOfService = oEvent.getSource().getSelectedKey() === "Y";
			if (bOutOfService) {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Rdisparo", "Y")
			}
		},

		validateSelectedTech: function (sAggregationProperty, oPayload) {
			var oValidationObject = {
				valid: false,
				message: "Se necesita agregar personal para poder realizar la operación"
			};

			if (oPayload[sAggregationProperty] === "") {
				return oValidationObject;
			} else {
				oValidationObject.valid = true;
				return oValidationObject;
			}
		},

		sendSuspension: function (oEvent) {
			var oSuspension = oEvent.getSource().getParent().getParent().getBindingContext("SuspensionTableJsonModel").getObject();
			if (!oSuspension.Datelicencia || !oSuspension.Time) {
				MessageBoxHelper.showAlert("Alerta", "Debe completar la fecha y hora");
			} else {
				// var oValidation = this.validateSelectedTech("Tecnicoet", oSuspension);
				// if (!oValidation.valid) {
				// 	MessageBoxHelper.showAlert("Alerta", oValidation.message);
				// } else {
				BusyDialogHelper.open();
				oSuspension.Cot = AppManagementHelper.getLoginName();
				delete oSuspension.NoAuth;
				delete oSuspension.enabled;
				delete oSuspension.TecnicoetValueState;
				delete oSuspension.TecnicoetValueStateText;
				LicenseService.suspendLicence(oSuspension);
				// }
			}

		},

		onSendTransfer: function (oEvent) {
			BusyDialogHelper.open();
			var oTransfer = oEvent.getSource().getParent().getParent().getBindingContext("TransferListJsonModel").getObject();
			if (oTransfer.Jefetra == "") {
				MessageBoxHelper.showAlert("Alerta", "Debe seleccionar un Jefe de Trabajo para realizar la transferencia");
				BusyDialogHelper.close();
				return
			}
			oTransfer.Autcot = AppManagementHelper.getUser();
			delete oTransfer.JefetraValueState;
			delete oTransfer.JefetraValueStateText;
			delete oTransfer.TeinformoValueState;
			delete oTransfer.TeinformoValueStateText;
			delete oTransfer.enabledCombo;
			LicenseService.transferLicence(oTransfer);
		},

		sendReanudation: function (oEvent) {
			var oReanudation = oEvent.getSource().getParent().getParent().getBindingContext("ReanudationTableJsonModel").getObject();
			if (!oReanudation.Datelicencia || !oReanudation.Time) {
				MessageBoxHelper.showAlert("Alerta", "Debe completar la fecha y hora");
			} else {
				// var oValidation = this.validateSelectedTech("Tecnicoet", oReanudation);
				// if (!oValidation.valid) {
				// 	MessageBoxHelper.showAlert("Alerta", oValidation.message);
				// } else {
				BusyDialogHelper.open();
				oReanudation.Cot = AppManagementHelper.getLoginName();
				delete oReanudation.enabled;
				delete oReanudation.TecnicoetValueState;
				delete oReanudation.TecnicoetValueStateText;
				LicenseService.reanudateLicence(oReanudation);
				// }
			}

		},

		_getAnulacionModel: function () {
			var oModel = AppManagementHelper.getModel("AnulacionJsonModel");
			oModel.setData({
				Motivo: "",
				Descripcion: ""
			});
			return oModel;
		},

		dialogAnnulateLicense: function () {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			if (!LicenceHelper.validForAnnulation(oLicense)) {
				MessageBoxHelper.showAlert("Alerta", "No se puede anular esta licencia");
			} else {
				var oModelAnulacion = this._getAnulacionModel();
				var that = this;
				this.annulateDialog = new sap.m.Dialog({
					title: "Anulación de Licencia",
					content: [
						new sap.m.HBox({
							items: [
								new sap.m.Label({
									text: "Motivo: "
								}).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop"),
								new sap.m.ComboBox({
									enabled: {
										path: "LicenseJsonModel>/Tipo",
										formatter: (sTipo) => {
											return sTipo === "L"
										}
									},
									width: "500px",
									selectedKey: "{AnulacionJsonModel>/Motivo}",
									items: {
										path: "MotivoNoAutorizacionJsonModel>/Motivos",
										template: new sap.ui.core.Item({
											key: "{MotivoNoAutorizacionJsonModel>key}",
											text: "{MotivoNoAutorizacionJsonModel>text}"
										})
									}
								})
							]
						}).addStyleClass("sapUiTinyMarginBeginEnd labelWidth  sapUiSmallMarginTop"),
						new sap.m.HBox({
							items: [
								new sap.m.Label({
									text: "Descripción: "
								}).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop"),
								new sap.m.Input({
									width: "500px",
									value: "{AnulacionJsonModel>/Descripcion}",
								})
							]
						}).addStyleClass("sapUiTinyMarginBeginEnd sapUiTinyMarginBottom sapUiSmallMarginTop")
					],
					buttons: [
						new sap.m.Button({
							text: "Anular",
							press: [this.annulateLicense, this]
						}).addStyleClass("buttonInverted"),
						new sap.m.Button({
							text: "Cancelar",
							press: function () {
								that.annulateDialog.close();
							}
						}).addStyleClass("buttonInverted")
					]
				});
				this.getView().addDependent(this.annulateDialog);
				this.annulateDialog.open();
			}

		},

		annulateLicense: function () {
			var sTipo = AppManagementHelper.getModel("LicenseJsonModel").getData().Tipo;
			var oAnulacion = AppManagementHelper.getModel("AnulacionJsonModel").getData();
			let bMotivoValid = sTipo === "L" ? oAnulacion.Motivo !== "" : true;
			if (bMotivoValid && oAnulacion.Descripcion !== "") {
				var oAnulatePayload = {
					Id: "",
					Licstat: "03",
					Causaanulado: oAnulacion.Motivo,
					Observadotxt: "",
					Obscausa: oAnulacion.Descripcion,
					Anulador: AppManagementHelper.getStringUserLegacy()
				};
				MessageBoxHelper.showConfirm("Alerta", "¿Está seguro que desea realizar la anulación?", $.proxy(this.annulateConfirmed, this,
					oAnulatePayload));
			} else {
				MessageBoxHelper.showAlert("Alerta", "El motivo y descripción son requeridos para realizar la anulación")
			}
		},

		navToLicense: function () {
			var sId = AppManagementHelper.getModel("LicenseJsonModel").getData().Id;
			var oModelValidateSol = AppManagementHelper.getModel("ComingFromRequestWithIdModel");
			oModelValidateSol.setData({
				comingFromRequestWithIdOfSol: sId ? true : false
			});

			var sIdUnifilar = new Date().valueOf().toString(36) + Math.random().toString(36).substr(2);
			var sIdUnifilarFormatted = sIdUnifilar.substr(1, 18);
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Idunifilar", sIdUnifilarFormatted);

			if (!this._edit) {
				AppManagementHelper.getAppRouter().navTo("Licencia", {
					id: "CREACION"
				});
			} else {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Licstat", "30");
				AppManagementHelper.getAppRouter().navTo("Licencia", {
					id: "CREACION"
				})
			}
		},

		annulateConfirmed: function (oAnnulatePayload) {
			this.annulateDialog.close();
			LicenseService.annulateLicense(oAnnulatePayload);
		},

		validateRequest: function (Solbeg, Timend, Solend, Timbeg, Arbpl, Solicitante, Equstatnocam, Jobcond, Equiinterv, Descripcion,
			Equnr,
			Equstat, Tplnr, Tiemporep, Werks, Tipinterv, Perestac, Solictext, Estacional, Capex, bUserFound) {

			//Si "Tipo de intervencion" es "ESTACIONAL" el campo "Periodo del Estacional / Estacional Pendiente" es obligatorio
			if (Tipinterv === 'ESTACIONAL') {
				if (Perestac !== "") {
					var EnablePerestac = true;
				} else {
					var EnablePerestac = false;
				}
			} else {
				var EnablePerestac = true;
			}

			if (Solbeg !== null && Timend !== null && Solend !== null && Timbeg !== null && Descripcion !== "" &&
				Equnr !== "" && Estacional !== "" && Capex !== "N" &&
				Tplnr !== "" && Werks !== "" && Tiemporep !== "" && EnablePerestac && Equstat !== "N" &&
				bUserFound) {
				AppManagementHelper.getModel("validateRequest").setData({
					"data": true
				});
			} else {
				AppManagementHelper.getModel("validateRequest").setData({
					"data": false
				});
			}

			return bUserFound;
		},

		enableValidLicense: function (
			Solbeg,
			Timend,
			Solend,
			Timbeg,
			Arbpl,
			Solicitante,
			Equstatnocam,
			Jobcond,
			Equiinterv,
			Descripcion,
			R500kv,
			Barrafs,
			Bloqueo,
			Rdisparo,
			Werks,
			Aufnr,
			SolSuplente,
			Jefe,
			JefeSuplente,
			Tipinterv,
			Perestac,
			Solictext,
			//medidas de seguridad
			Aro,
			// Sindivi,
			Senalninguna,
			Precaucionesok,
			Senalestados,
			Senalalarmas,
			Senalmedicion,
			Senalafect,
			//Interabier,
			//	Seleccionad,
			//	Intercerr,
			//	Patadic,
			//	Equimov,
			Intnooperar,
			Bloqueorecierretxt,
			Precauciones,
			Tipolicencia,
			Equnr,
			Tplnr,
			Equstat,
			Fstensionret,
			Estacional,
			Capex
		) {
			if (Jobcond === '04' || Jobcond === '05') {
				if (Bloqueorecierretxt === '' || Intnooperar === '') {
					var MedidasSegCamposTCT = false;
				} else {
					var MedidasSegCamposTCT = true;
				}
			} else {
				var MedidasSegCamposTCT = true;
			}

			// Senalafect -> Solo se requiere cuando Senalninguna es igual a "X"
			Senalafect = !(Senalninguna === "" && Senalafect === "");
			if (Tipolicencia && Tipolicencia !== "N") { // Si es "Licencia de emergencia" o "Licencia de terceros"
				var OTsegunTipoDeLicencia = true;
			} else { // Si es "Licencias programadas"
				if (Aufnr !== "") { // y si OT no esta vacio
					var OTsegunTipoDeLicencia = true;
				} else {
					var OTsegunTipoDeLicencia = true;
				}
			}

			//validado en new method
			if (Tipinterv === 'ESTACIONAL') { //Si "Tipo de intervencion" es "ESTACIONAL" el campo "Periodo del Estacional / Estacional Pendiente" es obligatorio
				if (Perestac !== "") {
					var EnablePerestac = true;
				} else {
					var EnablePerestac = false;
				}
			} else {
				var EnablePerestac = true;
			}

			if (Solbeg !== null && Timend !== null && Solend !== null && Timbeg !== null && Arbpl !== "" && Solicitante !== "" &&
				Jobcond !== "" && Equiinterv !== "" && Descripcion !== "" /*&& R500kv !== ""*/ && Barrafs !== "" && Bloqueo !==
				"" && Werks !== "" && OTsegunTipoDeLicencia && SolSuplente !== "" && Jefe !== "" && JefeSuplente !== "" && Tipinterv !== "" &&
				/*Perestac !==  "" &&*/
				EnablePerestac && MedidasSegCamposTCT &&
				Equnr !== "" && Tplnr !== "" && Equstat !== "N" && Equstatnocam !== "N" && Solictext !== "" && Aro !== null &&
				Precauciones !== "" && Rdisparo !== "N" && Fstensionret !== "N" && Estacional !== "" && Capex !== "N" &&
				(Senalninguna !== "" || Precaucionesok !== "" || Senalestados !== "" || Senalalarmas !== "" || Senalmedicion !== "") &&
				Senalafect) {
				AppManagementHelper.getModel("enableValidLicense").setData({
					"data": true
				});
			} else {
				AppManagementHelper.getModel("enableValidLicense").setData({
					"data": false
				});
			}

			return (Solbeg !== null && Timend !== null && Solend !== null && Timbeg !== null && Arbpl !== "" && Solicitante !== "" &&
				Jobcond !== "" && Equiinterv !== "" && Descripcion !== "" /*&& R500kv !== ""*/ && Barrafs !== "" && Bloqueo !==
				"" && Werks !== "" && OTsegunTipoDeLicencia && SolSuplente !== "" && Jefe !== "" && JefeSuplente !== "" && Tipinterv !== "" &&
				/*Perestac !==  "" &&*/
				EnablePerestac && MedidasSegCamposTCT &&
				Equnr !== "" && Tplnr !== "" && Equstat !== "N" && Equstatnocam !== "N" && Solictext !== "" && Aro !== null &&
				Precauciones !== "" && Rdisparo !== "N" && Fstensionret !== "N" && Estacional !== "" && Capex !== "N" &&
				(Senalninguna !== "" || Precaucionesok !== "" || Senalestados !== "" || Senalalarmas !== "" || Senalmedicion !== "") &&
				Senalafect
			)
		},

		checkIfSolHasChangeToLic: function () {
			var oLicenseModel = AppManagementHelper.getModel("LicenseJsonModel");
			return (oLicenseModel.getProperty("/Tipo") === "S") ? LicenceHelper.isLicense() : false
		},

		changeUbicacion: function (sView, oEvent) {
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Equnr", "");
			//LicenceHelper.changeUbicacion(sView, oEvent);
			//son dos funciones separadas, aca es un combobox y en el filtro es un multicombobox
			var DescripcionETJsonModel = AppManagementHelper.getModel("DescripcionETJsonModel");
			DescripcionETJsonModel.setData({
				Descripcion: oEvent.getParameter("value")
			});
			var item = oEvent.getSource().getSelectedItem();
			if (!item) {
				return;
			}
			var obj = item.getBindingContext("EstacionesJsonModel").getObject();
			var sKey = obj.Estacion;

			if (obj.Tipo === "L") { // Si E.T es una Linea, por defecto dejar seleccionada la misma opcion en el combo de "Equipo Solicitado CAMMESA"
				EquiposService.loadEquipos(sKey, obj.Codigo);
			} else {
				EquiposService.loadEquipos(sKey, undefined);
			}

		},

		validForCreation: function (sType) {
			let aRequiredFields = [];
			if (sType === "Solicitud") {
				aRequiredFields = LicenceHelper.getRequestRequiredFields();
			} else {
				aRequiredFields = LicenceHelper.getLicenseRequiredFields();
			}
			return aRequiredFields;
		},

		validateLicenceDatesAndPeriodicity: function () {
			var oModel = AppManagementHelper.getModel("LicenseJsonModel");
			var oSolbeg = oModel.getProperty("/Solbeg");
			var oSolend = oModel.getProperty("/Solend");
			if (oSolend.getTime() === oSolbeg.getTime()) {
				//ver dps si hay que hacer algo en la edicion
				oModel.setProperty("/Period", "D")
			}
		},

		handleSolLic: function (sType) {
			let aRequiredFields = this.validForCreation(sType);
			if (aRequiredFields.length > 0) {
				let oModelRequiredFields = AppManagementHelper.getModel("RequiredFieldsModel");
				oModelRequiredFields.setData({
					initialText: `Los siguientes campos son requeridos para poder generar la ${sType}`,
					fields: aRequiredFields
				});
				let oDialogRequiredFields = MessageBoxHelper.getValidationDialog();
				oDialogRequiredFields.setModel(oModelRequiredFields, "RequiredFieldsModel");
				oDialogRequiredFields.open();
				return false;
			}

			var bIsSol = true;
			var oLicenseModel = AppManagementHelper.getModel("LicenseJsonModel");
			var defaultLicTipo = LicenseService.GETTipoLicenciaCatalog();
			var tipoLicencia = oLicenseModel.getProperty("/Tipolicencia");

			if (!tipoLicencia && defaultLicTipo) {
				oLicenseModel.setProperty("/Tipolicencia", defaultLicTipo);
			}

			if (sType === "Solicitud") {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Gdate", new Date());
			}

			// Issue #586 - Se estan perdiendo en algunas licencias algunos marcadores de unifilares
			// Para evitar este issue se leen los unifilares para actualizar el modelo de licencia justo antes de grabar
			BusyDialogHelper.open();
			//EXT-MSUELDIA - se hace un chequeo de los unifilares
			var oDatosAnteriores = {
				...AppManagementHelper.getModel("LicenseJsonModel").getData()
			};
			var oFinished = this.refreshUnifilar();
			oFinished.then(() => {
				//INI EXT-MSUELDIA
				var oDatosARefrescar = AppManagementHelper.getModel("LicenseJsonModel").getData();
				if (!oDatosAnteriores.Interabier) oDatosAnteriores.Interabier = '';
				if (!oDatosAnteriores.Seleccionad) oDatosAnteriores.Seleccionad = '';
				if (!oDatosAnteriores.Intercerr) oDatosAnteriores.Intercerr = '';
				if (!oDatosAnteriores.Equimov) oDatosAnteriores.Equimov = '';
				if (!oDatosAnteriores.Patadic) oDatosAnteriores.Patadic = '';
				//si hay diferencia entre datos de unifilares se muestra advertencia
				if (oDatosAnteriores.Interabier !== oDatosARefrescar.Interabier || oDatosAnteriores.Seleccionad !== oDatosARefrescar.Seleccionad ||
					oDatosAnteriores.Intercerr !== oDatosARefrescar.Intercerr || oDatosAnteriores.Equimov !== oDatosARefrescar.Equimov ||
					oDatosAnteriores.Patadic !== oDatosARefrescar.Patadic) {
					//vuelvo al estado anterior
					//GQ FIX 25/02	
					//AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Licstat", this._estadoPrevio);
					BusyDialogHelper.close();
					return MessageBoxHelper.showAlert("Alerta",
						"Algunos datos de los unifilares no están actualizados con los ultimos cambios realizados. Se refrescará la información actual. Revise si es correcta e intente guardar nuevamente."
					);
				}
				//FIN EXT-MSUELDIA
				//		BusyDialogHelper.close();
				if (!this._edit) {
					BusyDialogHelper.open();

					if (sType === "Solicitud") {
						oLicenseModel.setProperty("/Tipo", "S");
					} else {
						let data = oLicenseModel.getData();
						if (data.Senalninguna) {
							if (data.Precaucionesok || data.Senalestados || data.Senalalarmas || data.Senalmedicion) {
								BusyDialogHelper.close();
								return MessageBoxHelper.showAlert("Alerta", "Si elige ninguna, no puede seleccionar otra señal");
							}
						} else if (!(data.Precaucionesok || data.Senalestados || data.Senalalarmas || data.Senalmedicion)) {
							BusyDialogHelper.close();
							return MessageBoxHelper.showAlert("Alerta", "Debe haber al menos una señal seleccionada");
						}
						oLicenseModel.setProperty("/Tipo", "L");
						bIsSol = false;
					}

					var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
					LicenseService.checkUnifilarByJobCond(oLicense).then((valid) => {
						if (valid) {
							// Issue 517
							LicenseService.getUnifilares(oLicense, (oResponse) => {
								var aUnifilares = oResponse.results;
								var sLicenseAnio = oLicense.Solbeg.getFullYear().toString();
								var bSameAnio = aUnifilares.every(oUnifilar => oUnifilar.Anio === sLicenseAnio);
								if (!bSameAnio) {

									// 1. borrar unifilares (ponele) // Falta hacer.
									// 2. crear nuevos unifilares con Anio corregido
									// 3. crear licenca
									var aUnifilarestoGetVersion = [];
									for (let oUnifilar of aUnifilares) {
										aUnifilarestoGetVersion.push(LicenseService.getUnifilarVersion(oUnifilar))
									}
									Promise.all(aUnifilarestoGetVersion).then((aData) => {
										// aUnifilares los viejos y aVersionesActuales son los unifilares actuales
										let aVersionesActuales = this.getVersionesActualesArray(aData);
										let aUnifilarDataToHandle = this.validateUnifilarVersions(aUnifilares, aVersionesActuales);
										var sNewId = oLicense.Idunifilar;

										var that = this;
										this.handleRecursiveUnifilarCreation(sNewId, aUnifilarDataToHandle, sLicenseAnio, [], function () {

											// Sigue igual...
											var oModelValidId = AppManagementHelper.getModel("ComingFromRequestWithIdModel");
											if (oModelValidId) {
												if (oModelValidId.getData().comingFromRequestWithIdOfSol && !bIsSol) {
													AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Tipo", "L");
													var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
													AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Idsolicitud", sId);
													AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Id", "");
												}
											}
											that.setCreadorToLicense();
											LicenseService.POST(bIsSol);
										});

									}).catch((e) => {
										BusyDialogHelper.close();
										MessageBoxHelper.showAlert("Alerta", "Error al obtener unifilares")
									})

								} else {

									// Sigue igual...
									var oModelValidId = AppManagementHelper.getModel("ComingFromRequestWithIdModel");
									if (oModelValidId) {
										if (oModelValidId.getData().comingFromRequestWithIdOfSol && !bIsSol) {
											AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Tipo", "L");
											var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
											AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Idsolicitud", sId);
											AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Id", "");
										}
									}
									this.setCreadorToLicense();
									LicenseService.POST(bIsSol);
								}
							}, () => {
								BusyDialogHelper.close();
								MessageBoxHelper.showAlert("Alerta", "Error al obtener unifilares");
							}, {
								"$select": "Nombre,Idunifilar,NumVersion,Region,TipoUnifilar,Et,Empresa,Anio,Region,IntAbLe,SecAbBt,SecPatCr,PatAdic,Numerolicencia,Mapa,Doctype,Imagenunifilar"
							});

						} else {
							BusyDialogHelper.close();
							MessageBoxHelper.showAlert("Alerta", "Debe agregar un esquema unifilar para poder generar la licencia");
						}
					}).catch(() => {
						BusyDialogHelper.close();
						MessageBoxHelper.showAlert("Alerta", "Error al chequear validación de unifilar");
					})
				} else {
					let data = oLicenseModel.getData();

					var bSolChangedState = (sType === "Licencia" && oLicenseModel.getProperty("/Tipo") === "S");
					if (bSolChangedState) {
						if (data.Senalninguna) {
							if (data.Precaucionesok || data.Senalestados ||
								data.Senalalarmas || data.Senalmedicion) {
								return MessageBoxHelper.showAlert("Alerta", "Si elige ninguna, no puede seleccionar otra señal");
							}
						} else if (!(data.Precaucionesok || data.Senalestados ||
							data.Senalalarmas || data.Senalmedicion)) {
							return MessageBoxHelper.showAlert("Alerta", "Debe haber al menos una señal seleccionada");
						}
						var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
						LicenseService.checkUnifilarByJobCond(oLicense).then((valid) => {
							if (valid) {
								AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Tipo", "L");
								var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
								AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Idsolicitud", sId);
								AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Id", "");
								this.setCreadorToLicense();
								LicenseService.POST(false);
							} else {
								MessageBoxHelper.showAlert("Alerta", "Debe agregar un esquema unifilar para poder generar la licencia");
							}
						}).catch(() => {
							MessageBoxHelper.showAlert("Alerta", "Error al chequear validación de unifilar");
						})
					} else {
						var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
						LicenseService.checkUnifilarByJobCond(oLicense).then((valid) => {
							if (valid) {
								// Issue #500
								// Elimino los horarios de la licencia:
								LicenseService.findHorarios(oLicense).then((aHorariosLicencia) => {
									let aPromisesToDelete = [];
									aHorariosLicencia = aHorariosLicencia.results;
									aHorariosLicencia.forEach((oHorarioLicencia) => {
										aPromisesToDelete.push(LicenseService.deleteDay(oHorarioLicencia));
									});

									Promise.all(aPromisesToDelete).then(() => {
										// Si la licencia tiene periodo diario (Period === 'D').
										if (oLicense.Period === "D") {
											let aDaysDeepEntity = [];
											let aDays = this.getDateArray();

											aDays.forEach((oDay) => {
												aDaysDeepEntity.push({
													Tipo: oLicense.Tipo,
													Empresa: oLicense.Empresa,
													Anio: oLicense.Anio,
													Id: oLicense.Id,
													Modif: "",
													Fecha: oDay.Fecha,
													Horainicio: FormatHelper.getTimeStringSAPFormat(oDay.Horainicio),
													Horafin: FormatHelper.getTimeStringSAPFormat(oDay.Horafin)
												});
											});

											let oEntryDays = {
												Tipo: oLicense.Tipo,
												Empresa: oLicense.Empresa,
												Anio: oLicense.Anio,
												Id: oLicense.Id,
												HorariosPorLicencia_nav: aDaysDeepEntity
											};

											LicenseService.PostDaysLicence(oEntryDays).then(() => {
												LicenseService.PUT(bSolChangedState);
											}).catch(() => {
												console.log("Error al crear los horarios de la licencia.");
												MessageBoxHelper.showAlert("Alerta", "Error al crear los horarios de la licencia.");
											});
										} else {
											LicenseService.PUT(bSolChangedState);
										}
									}).catch(() => {
										MessageBoxHelper.showAlert("Alerta", "Error al intentar eliminar los horarios de la licencia.");
									});
								}).catch(() => {

									// TODO: meter esto en una función:

									// Si la licencia tiene periodo diario (Period === 'D').
									if (oLicense.Period === "D") {
										let aDaysDeepEntity = [];
										let aDays = this.getDateArray();

										aDays.forEach((oDay) => {
											aDaysDeepEntity.push({
												Tipo: oLicense.Tipo,
												Empresa: oLicense.Empresa,
												Anio: oLicense.Anio,
												Id: oLicense.Id,
												Modif: "",
												Fecha: oDay.Fecha,
												Horainicio: FormatHelper.getTimeStringSAPFormat(oDay.Horainicio),
												Horafin: FormatHelper.getTimeStringSAPFormat(oDay.Horafin)
											});
										});

										let oEntryDays = {
											Tipo: oLicense.Tipo,
											Empresa: oLicense.Empresa,
											Anio: oLicense.Anio,
											Id: oLicense.Id,
											HorariosPorLicencia_nav: aDaysDeepEntity
										};

										LicenseService.PostDaysLicence(oEntryDays).then(() => {
											LicenseService.PUT(bSolChangedState);
										}).catch(() => {
											console.log("Error al crear los horarios de la licencia.");
											MessageBoxHelper.showAlert("Alerta", "Error al crear los horarios de la licencia.");
										});
									} else {
										LicenseService.PUT(bSolChangedState);
									}

									// MessageBoxHelper.showAlert("Alerta", "Error al intentar obtener los horarios de la liceinca.");
								});
							} else {
								MessageBoxHelper.showAlert("Alerta", "Debe agregar un esquema unifilar para poder generar la licencia.");
							}
						}).catch(() => {
							MessageBoxHelper.showAlert("Alerta", "Error al chequear validación de unifilar.");
						})
					}
				}
			});
		},

		setCreadorToLicense: function () {
			var oCreador = AppManagementHelper.getModel("UserJsonModel").getData();
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Creador", `${oCreador.nombre} ${oCreador.apellido}`);
		},

		sendRequestToCoordination: function () {
			let aRequiredFields = this.validForCreation("Solicitud");
			if (aRequiredFields.length > 0) {
				let oModelRequiredFields = AppManagementHelper.getModel("RequiredFieldsModel");
				oModelRequiredFields.setData({
					initialText: "Los siguientes campos son requeridos para poder enviar la solicitud a coordinar",
					fields: aRequiredFields
				});
				let oDialogRequiredFields = MessageBoxHelper.getValidationDialog();
				oDialogRequiredFields.setModel(oModelRequiredFields, "RequiredFieldsModel");
				oDialogRequiredFields.open();
				return false;
			}

			var types = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Tipo") === "S" || AppManagementHelper.getModel(
				"LicenseJsonModel").getProperty("/Tipo") === "" ? "Solicitud" : "Licencia";

			MessageBoxHelper.showConfirm("Confirmación", `¿Está seguro que desea generar la ${types}?`, () => {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Gdate", new Date());
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Licstat", "09");
				this.handleSolLic("Solicitud", true);
			})
		},

		//INI TRNS126
		_onOpenDialogSaveLicencia: function (sMesage) {
			if (this._oDialogSaveLicencia) {
				this._oDialogSaveLicencia.close();
			}
			var oDialogSaveLicencia = new sap.m.Dialog({
				title: "Confirmación",
				state: "Information",
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.Text({
								text: sMesage
							}),
						]
					}).addStyleClass("sapUiSmallMargin"),
					new sap.m.OverflowToolbar({
						height: "5px",
						content: []
					}),
					new sap.m.OverflowToolbar({
						content: [
							new sap.m.Button({
								// text: "Desplegar Resumen", // visualizar solo icono
								icon: "sap-icon://question-mark",
								iconFirst: false,
								press: function () {
									this._openReviewDialog();
									//no se cierra mensaje de exito
									// this._oDialogSaveLicencia.close();
								}.bind(this)
							}).addStyleClass("btnResumen"),
							new sap.m.ToolbarSpacer(),
							new sap.m.Button({
								icon: "sap-icon://accept",
								press: () => {
									//oojo
									var oLicenseModel = AppManagementHelper.getModel("LicenseJsonModel");
									let data = oLicenseModel.getData();
									if (data.Senalninguna) {
										if (data.Precaucionesok || data.Senalestados ||
											data.Senalalarmas || data.Senalmedicion) {
											return MessageBoxHelper.showAlert("Alerta", "Si elige ninguna, no puede seleccionar otra señal");
										}
									} else if (!(data.Precaucionesok || data.Senalestados ||
										data.Senalalarmas || data.Senalmedicion)) {
										return MessageBoxHelper.showAlert("Alerta", "Debe haber al menos una señal seleccionada");
									}
									//TODO pasar al handlesollic?
									if (AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Licstat") != "02") {
										AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Gdate", new Date());
									}
									AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Licstat", "09")
									// Issue 547 - La fecha se debe actualizar solo si el status actual no es observado
									//		data.Gdate = new Date();
									this.handleSolLic("Licencia", true);
								}
							}),
							new sap.m.Button({
								icon: "sap-icon://decline",
								press: [this._closeDialogSaveLicencia, this]
							})
						]
					})
				]
			});
			this.getView().addDependent(oDialogSaveLicencia);
			this._oDialogSaveLicencia = oDialogSaveLicencia;
			oDialogSaveLicencia.open();
		},

		_closeDialogSaveLicencia: function () {
			this._oDialogSaveLicencia.close();
		},

		_openReviewDialog: function () {
			let oData = AppManagementHelper.getModel("UnifilaresResumenModel").getData();
			if (!this._oReviewDialog) {
				Fragment.load({
					id: this.getView().getId(),
					name: "Transener.Operaciones.LicenciasTrabajo.views.Fragments.ReviewSave",
					controller: this
				}).then(function (oPopup) {
					this._oReviewDialog = oPopup;
					this.getView().addDependent(oPopup);
					this._oReviewDialog.setModel(new sap.ui.model.json.JSONModel(oData), "reviewSaveModel");
					this._oReviewDialog.open();
				}.bind(this));
			} else {
				this._oReviewDialog.setModel(new sap.ui.model.json.JSONModel(oData), "reviewSaveModel");
				this._oReviewDialog.open();
			}
		},

		onCloseReviewDialog: function () {
			this._oReviewDialog.close();
		},

		formatterTipoMarcadorNoRel: function (sTipo) {
			return sTipo === "02" ? "PUESTA A TIERRA" : "TENSIÓN";
		},

		formatOpcionSeleccionadaAux: function (iOption) {
			if (iOption) {
				var sOption = iOption.toString();
				switch (sOption) {
					case "00":
						return "Interruptor abierto";
					case "01":
						return "Seccionador abierto bloqueado y trabado";
					case "02":
						return "Seccionador PAT cerrado";
					case "03":
						return "Equipos a mover (Interruptores)";
					case "04":
						return "Equipos a mover (Seccionadores)";
					case "05":
						return "Equipos a mover (Seccionadores)";
					case "06":
						return "Interruptor extraído"
					default:
						return "";
				}
			} else {
				return "";
			}
		},
		//FIN TRNS126

		sendToCoordination: function () {
			let aRequiredFields = this.validForCreation("Licencia");
			if (aRequiredFields.length > 0) {
				let oModelRequiredFields = AppManagementHelper.getModel("RequiredFieldsModel");
				oModelRequiredFields.setData({
					initialText: `Los siguientes campos son requeridos para poder enviar la licencia a coordinar`,
					fields: aRequiredFields
				});
				let oDialogRequiredFields = MessageBoxHelper.getValidationDialog();
				oDialogRequiredFields.setModel(oModelRequiredFields, "RequiredFieldsModel");
				oDialogRequiredFields.open();
				return false;
			}

			var types = "Licencia";
			//INI TRNS126
			//si no tiene unifilares refrescar datos para evitar errores
			try {
				const oUnifilaresResumen = AppManagementHelper.getModel("UnifilaresResumenModel").getData();
				if (oUnifilaresResumen.unifilares.length === 0) {
					BusyDialogHelper.open();
					this.refreshUnifilar().then(() => {
						BusyDialogHelper.close();
						//si es licencia agregar boton de ayuda con datos de unifilares en el formulario
						this._onOpenDialogSaveLicencia(`¿Está seguro que desea generar la ${types}?`);
					});
				} else {
					this._onOpenDialogSaveLicencia(`¿Está seguro que desea generar la ${types}?`);
				}
			} catch (err) {
				this._onOpenDialogSaveLicencia(`¿Está seguro que desea generar la ${types}?`);
			}
			// MessageBoxHelper.showConfirm("Confirmación", `¿Está seguro que desea generar la ${types}?`, () => {
			// 	//oojo
			// 	var oLicenseModel = AppManagementHelper.getModel("LicenseJsonModel");
			// 	let data = oLicenseModel.getData();
			// 	if (data.Senalninguna) {
			// 		if (data.Precaucionesok || data.Senalestados ||
			// 			data.Senalalarmas || data.Senalmedicion) {
			// 			return MessageBoxHelper.showAlert("Alerta", "Si elige ninguna, no puede seleccionar otra señal");
			// 		}
			// 	} else if (!(data.Precaucionesok || data.Senalestados ||
			// 			data.Senalalarmas || data.Senalmedicion)) {
			// 		return MessageBoxHelper.showAlert("Alerta", "Debe haber al menos una señal seleccionada");
			// 	}
			// 	//TODO pasar al handlesollic?
			// 	if (AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Licstat") != "02") {
			// 		AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Gdate", new Date());
			// 	}
			// 	AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Licstat", "09")
			// 		// Issue 547 - La fecha se debe actualizar solo si el status actual no es observado
			// 		//		data.Gdate = new Date();
			// 	this.handleSolLic("Licencia", true);
			// })
			//FIN TRNS126
		},

		closeUnifilarSchemaDialog: function () {
			this.schemaDialog.close();
			this.schemaDialog.destroy();
		},

		generateFileArray: function (aFiles) {
			var aFileArray = [];
			for (var i = 0; i < aFiles.length; i++) {
				aFileArray.push(aFiles[i]);
			}
			return aFileArray;
		},

		uploadFiles: function (oEvent) {
			var aFiles = oEvent.getParameters().files;
			var aFilesFormatted = this.generateFileArray(aFiles);
			if (aFilesFormatted.length > 0) {
				LicenseService.handleUploadFile(aFilesFormatted);
			}
		},
		/*
		getUploadedFiles: function (oEvent) {
			var License = this.getView().getModel("LicenseJsonModel").getData();
			var Id		= License.Id;
			var Empresa = License.Empresa;
			var Anio	= License.Anio;
			LicenseService.handleGetUploadedFiles(Id, Empresa, Anio );
		},
		*/

		uploadImage: function (oEvent) {
			var aFiles = oEvent.getParameters().files;
			var oFile = aFiles[0];
			this._oFileName = oFile.name;
			this.fileUploaderSchemaDialog.close();
			this.fileUploaderSchemaDialog.destroy();
			this.showUnifilar(oFile);
		},

		handleDownloadDocument: function (oEvent) {
			var sAttindex = oEvent.getSource().getBindingContext("FileListJsonModel").getObject().Attindex;
			var sId = oEvent.getSource().getBindingContext("FileListJsonModel").getObject().Id;
			var empresa = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Empresa");
			var Anio = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio");
			LicenseService.findLicenseFile(sAttindex, sId, empresa, Anio)
		},

		handleDeleteDocument: function (sAttindex) {
			var license = AppManagementHelper.getModel("LicenseJsonModel").getData()

			var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
			var empresa = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Empresa");
			var Anio = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio");
			//presiono booton, obtengo la fuente, voy al parent,  que es el item en si, obtengo el contexto y obtener objeto
			//var oFile = oDocument.getSource().getParent().getBindingContext("FileListJsonModel").getObject();
			//obtener el item a borrar y luego posterior a esto, llamar al servicio de eliminacion
			LicenseService.removeSelectedFile(sAttindex, sId, empresa, Anio).then(() => {
				BusyDialogHelper.open();
				var commentsTEMPmodel = AppManagementHelper.getModel("commentsTEMP");
				commentsTEMPmodel.setData({
					Comments: license.Comments,
					Tdtcomments: license.Tdtcomments,
					Prgcomments: license.Prgcomments
				});

				LicenseService.FIND(license);
				this.closeFileRemovalAlert()
			}).catch((e) => {
				console.log("error");
				BusyDialogHelper.close();
			})
		},

		alertaConfirmacion: function (event) {
			var fileToDelete = event.getSource().getBindingContext("FileListJsonModel").getObject().Attindex;

			var oAlertDialog = new sap.m.Dialog({
				title: "Confirmar",
				modal: true,
				content: [
					new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.End,
						items: [
							new sap.m.Button({
								icon: "sap-icon://accept",
								press: () => {
									this.handleDeleteDocument(fileToDelete)
								},
							}).addStyleClass("sapUiTinyMarginEnd buttonInverted"),
							new sap.m.Button({
								icon: "sap-icon://decline",
								press: [this.closeFileRemovalAlert, this]
							}).addStyleClass("")
						]
					}).addStyleClass("sapUiTinyMarginEnd")
				]
			});
			oAlertDialog.open();
			this.removalAlertDialog = oAlertDialog;
		},

		openFileList: function () {
			var userInfo = AppManagementHelper.getModel("UserJsonModel");
			var permisosEliminarDocumento = userInfo.oData.roles[0];
			var EnablePermiso = undefined;
			if (permisosEliminarDocumento === 'ope_jefe_cot' || 'ope_oper-turno_cot' || 'ope_programacion_cotdt') {
				EnablePermiso = false;
			} else {
				EnablePermiso = true;
			}

			this.handleRefreshUploadedFilesList();

			var oDialog = new sap.m.Dialog({
				title: "Lista de archivos",
				modal: true,
				content: [
					new sap.m.List({
						items: {
							path: "FileListJsonModel>/Files",
							template: new sap.m.CustomListItem({
								content: [
									new sap.m.HBox({
										alignItems: sap.m.FlexAlignItems.Center,
										justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
										items: [
											new sap.m.Text({
												text: "{FileListJsonModel>Filename}"
											}).addStyleClass("sapUiSmallMarginBeginEnd"),
											new sap.m.HBox({
												alignItems: sap.m.FlexAlignItems.End,
												items: [
													new sap.m.Button({
														icon: "sap-icon://download",
														press: [this.handleDownloadDocument, this]
													}).addStyleClass("sapUiTinyMarginEnd buttonInverted"),
													new sap.m.Button({
														enabled: {
															parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
															formatter: this.rolStatusEdition("comentarios/")
														},
														icon: "sap-icon://delete",
														press: [this.alertaConfirmacion, this],
														//enabled: EnablePermiso
													}).addStyleClass("")
												]
											}).addStyleClass("sapUiTinyMarginEnd")
										]
									})
								]
							})
						}
					})
				],
				beginButton: new sap.m.Button({
					text: "Cerrar",
					icon: "sap-icon://decline",
					press: [this.closeFileList, this]
				}).addStyleClass("buttonInverted"),
				endButton: new sap.m.Button({
					text: "Refrescar",
					icon: "sap-icon://refresh",
					press: [this.handleRefreshUploadedFilesList]
				}).addStyleClass("buttonInverted")

			}).addStyleClass("customDialog schema");
			this.getView().addDependent(oDialog)
			oDialog.setModel(AppManagementHelper.getModel("FileListJsonModel"), "FileListJsonModel");
			oDialog.open();
			this.fileListDialog = oDialog;
		},

		handleRefreshUploadedFilesList: function () {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			LicenseService.FIND(oLicense);
		},

		closeFileList: function () {
			this.fileListDialog.close();
		},
		closeFileRemovalAlert: function () {
			this.removalAlertDialog.close();
		},

		showUploadFileDialog: function () {
			var oDialog = new sap.m.Dialog({
				title: "Esquema Unifilar",
				modal: true,
				content: [
					new sap.ui.unified.FileUploader({
						change: [this.uploadImage, this],
						multiple: false,
						buttonText: "Examinar",
						placeholder: "Agregue uno o mas documentos",
						fileType: ["jpg", "png", "jpeg", "gif", "bmp", "tiff"]
					}).addStyleClass("sapUiMediumMarginBegin")
				],
				isLicenseGenerated: false,
				buttons: [
					new sap.m.Button({
						text: "Cerrar",
						icon: "sap-icon://decline",
						press: [this.closeFileUploadSchemaDialog, this]
					}).addStyleClass("buttonInverted")
				]
			}).addStyleClass("customDialog schema");
			oDialog.open();
			this.fileUploaderSchemaDialog = oDialog;
		},

		closeFileUploadSchemaDialog: function () {
			this.fileUploaderSchemaDialog.close();
			this.fileUploaderSchemaDialog.destroy();
			this.image = "";
		},

		goToUnifilarSchema: function () {
			this.showUploadFileDialog();
		},

		navToSol: function () {
			var licencia = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var sTipo = "S";
			var sSol = licencia.Idsolicitud;
			var url = "https://" + window.location.host + window.location.hash.split("&")[0] + "&/" + sSol + ":" + sTipo + ":" + licencia.Empresa +
				":" + licencia.Anio;
			window.open(url, '_blank');
		},

		onCreate: function () {
			BusyDialogHelper.open();
			var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var canvas = document.getElementById("signature-pad");
			var image = canvas.toDataURL("image/jpeg").split(",")[1];
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var oPayloadSchemaUnifilar = {
				Empresa: oLicense.Empresa,
				Esqname: this._oFileName,
				Id: sId,
				Anio: oLicense.Anio,
				Esqid: "",
				Esqimage: image,
				Tipo: oLicense.Tipo
			};
			this.closeUnifilarSchemaDialog();
			if (this._edit) {
				LicenseService.POSTUnifilarSchema(oPayloadSchemaUnifilar);
			} else {
				BusyDialogHelper.close();
				this.aDataUnifilar.push(oPayloadSchemaUnifilar)
			}
		},

		clearUnifilarSchemaDialog: function () {
			BusyDialogHelper.open();
			var canvas = document.getElementById("signature-pad");
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			var background = new Image();
			// The image needs to be in your domain.
			background.src = this.image;

			background.onload = function () {
				BusyDialogHelper.close();
				context.drawImage(background, 0, 0, canvas.width, canvas.height);
			};
		},

		prepareCanvasContext: function (oFile) {
			BusyDialogHelper.open();
			var reader = new FileReader();
			reader.onloadend = () => {
				var canvas = document.getElementById("signature-pad");
				var context = canvas.getContext("2d");

				canvas.width = 1000;
				canvas.height = 400;

				let image = reader.result;
				var background = new Image();
				background.src = image;
				this.image = image;

				background.onload = function () {
					context.drawImage(background, 0, 0, canvas.width, canvas.height);
					BusyDialogHelper.close();
				};

				background.onerror = function (err) {
					MessageBoxHelper.showAlert("Error",
						"Se ha producido un error al mostrar la imagen, es posible que esta imagen se encuentre dañada");
					console.log(err);
					BusyDialogHelper.close();
				};

				context.fillStyle = "#fff";
				context.strokeStyle = "#444";
				context.lineWidth = 1.5;
				context.lineCap = "round";
				context.fillRect(0, 0, canvas.width, canvas.height);

				var signaturePad = new SignaturePad(document.getElementById("signature-pad"), {
					backgroundColor: "#ffffff",
					penColor: "rgb(0, 0, 0)",
					penWidth: "0"
				});

				this._signaturePad = signaturePad;
			};
			reader.readAsDataURL(oFile);

		},

		changePadColor: function (sRgbColor, oEvent) {
			this._signaturePad.penColor = sRgbColor;
		},

		cleanFilters: function () {
			Models.createFiltersModel();
		},

		cleanLicence: function () {
			var sPath = FioriHelper.getAppPath();
			AppManagementHelper.getModel("LicenseJsonModel").loadData(sPath + "model/LicenseJsonModel.json", "", false);
		},

		goToHome: function () {
			LegacyValidationHelper.createLegacyComboStateModel();
			this.cleanLicence();
			this.aDataUnifilar = [];
			this.aDates = [];
			this.oDatesEdition = null;
			LicenseService.goToHome();
		},

		formatDate: function (date) {
			return FormatHelper.formatDateTime(date);
		},

		formatDateWithoutGMT: function (date) {
			if (!date) return null;
			return FormatHelper.formatDateTimeWithoutGMT(date);
		},

		formatDateLicence: function (date) {
			if (date) {
				return FormatHelper.formatDateLicense(date);
			}
		},

		timesSelected: function () {
			var currentDate = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solbeg");
			var stopDate = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solend");
			var timeFrom = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timbeg");
			var timeTo = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timend");
			return (currentDate !== null && stopDate !== null && timeFrom !== null && timeTo !== null);
		},

		workStationPromise: function (sWorkStationKey) {
			return new Promise((resolve, reject) => {
				let aFilters = [];
				aFilters.push(new sap.ui.model.Filter("Gewrk", sap.ui.model.FilterOperator.EQ, sWorkStationKey));
				let entity = "/UbicacionesTecnicasSet";
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: aFilters,
					success: function () {
						resolve();
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},

		successGETTechLocation: function (data) {
			var aData = FormatHelper.removeResults(data);
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				"UbicacionesTecnicas": aData
			});

			this.getView().setModel(oModel, "TechLocationsJsonModel");
			AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/enabledTechLoc", true);
		},

		errorGETTechLocation: function (error) {
			console.log("se ha producido un error al cargar las ubicaciones tecnicas");
		},

		validDates: function () {
			var solBeg = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solbeg");
			var timBeg = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timbeg");
		},

		validateDate: function (oEvent) {
			var sBindingPath = oEvent.getSource().getBindingInfo("dateValue").binding.sPath;
			var bValid = oEvent.getSource()._bValid;
			if (!bValid) {
				oEvent.getSource().setValue("");
			}
		},

		onWorkDateChanged: function (oEvent) {
			if (oEvent) {
				this.validateDate(oEvent)
			}

			this.regenerateHorariosPorLicencia();

			if (oEvent) {
				LegacyValidationHelper.checkLegacies();
			}
		},

		regenerateHorariosPorLicencia: function () {
			var dateArray = [];
			var solBeg = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solbeg");
			var solEnd = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solend");
			var timBeg = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timbeg");
			var timeEnd = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timend");

			if (!solBeg || !solEnd || !timBeg || !timeEnd) {
				return;
			}
			// Esperar confirmación de Juan para descomentar esta linea
			// sap.m.MessageBox.show("Se remplazaran los horarios de todos los dias de trabajo");

			var currentDate = new Date(solBeg.getTime());
			var stopDate = new Date(solEnd.getTime());
			var timeFrom = new Date(timBeg.getTime());
			var timeTo = new Date(timeEnd.getTime());

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

			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/HorariosPorLicencia_nav", dateArray);
			if (AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Period") === "D") {
				AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", true);
			} else {
				AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", false);
			}

		},

		getDateArray: function () {
			//  Issue 554 - cuando se eliminan o agrega días del botón "Horarios Semana", vuelven a aparecer
			// Se precisa mantener las fechas que fueron editadas en los horarios ( antes de esta cambio se pisaban cada vez que se graban )

			var aHorarios = this.getView().getModel("LicenseJsonModel").getProperty("/HorariosPorLicencia_nav");
			var aDateArray = [];
			for (let oHorario of aHorarios) {
				aDateArray.push({
					Fecha: oHorario.Fecha,
					Horafin: oHorario.Horafin,
					Horainicio: oHorario.Horainicio
				});
			}
			return aDateArray;
			/*
		/*

			var dateArray = [];
			var solBeg = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solbeg");
			var solEnd = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solend");
			var timBeg = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timbeg");
			var timeEnd = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timend");

			if (!solBeg || !solEnd || !timBeg || !timeEnd) {
				return;
			}

			var currentDate = new Date(solBeg.getTime());
			var stopDate = new Date(solEnd.getTime());
			var timeFrom = new Date(timBeg.getTime());
			var timeTo = new Date(timeEnd.getTime());

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
			return dateArray;*/
		},

		handleLegacyValidation: function (sType, oEvent) {
			LegacyValidationHelper.handleLegacyValidation(sType, oEvent);
			if (oEvent.getSource) {
				if (oEvent.getSource().getValueState() === "Error") {
					oEvent.getSource().setSelectedKey("");
				}
			} else {
				if (this.getView().getModel("LegacyValidationJsonModel").getProperty("/TejtCancelacionDefValueState") === "Error") {
					this.getView().getModel("CancelacionDefinitivaJsonModel").setProperty("/Tejt", "");
				}
			}

		},

		handleLegacyValidationTransfers: function (oEvent) {
			var oModel = AppManagementHelper.getModel("TransferListJsonModel");
			var sPath = oEvent.getSource().getBindingContext("TransferListJsonModel").getPath();
			var oData = oEvent.getSource().getBindingContext("TransferListJsonModel").getObject();
			var sLegacy = oData.Jefetra;
			LegacyValidationHelper.handleLegacyValidationForDDSR(sLegacy, sPath, oModel, "/JefetraValueState", "/JefetraValueStateText",
				oEvent
					.getSource().mBindingInfos.items.path);
			if (oEvent.getSource) {
				if (oEvent.getSource().getValueState() === "Error") {
					oEvent.getSource().setSelectedKey("");
				}
			}
		},

		handleLegacyValidationReanudation: function (oEvent) {
			var oModel = AppManagementHelper.getModel("ReanudationTableJsonModel");
			var sPath = oEvent.getSource().getBindingContext("ReanudationTableJsonModel").getPath();
			var oData = oEvent.getSource().getBindingContext("ReanudationTableJsonModel").getObject();
			var sLegacy = oData.Tecnicoet;
			LegacyValidationHelper.handleLegacyValidationForDDSR(sLegacy, sPath, oModel, "/TecnicoetValueState", "/TecnicoetValueStateText",
				oEvent.getSource().mBindingInfos.items.path);
			if (oEvent.getSource().getValueState() === "Error") {
				oEvent.getSource().setSelectedKey("");
			}
		},

		handleLegacyValidationSuspention: function (oEvent) {
			var oModel = AppManagementHelper.getModel("SuspensionTableJsonModel");
			var sPath = oEvent.getSource().getBindingContext("SuspensionTableJsonModel").getPath();
			var oData = oEvent.getSource().getBindingContext("SuspensionTableJsonModel").getObject();
			var sLegacy = oData.Tecnicoet;
			LegacyValidationHelper.handleLegacyValidationForDDSR(sLegacy, sPath, oModel, "/TecnicoetValueState", "/TecnicoetValueStateText",
				oEvent.getSource().mBindingInfos.items.path);
			if (oEvent.getSource().getValueState() === "Error") {
				oEvent.getSource().setSelectedKey("");
			}
		},

		handleLegacyValidationDeliveries: function (oEvent) {
			var oModel = AppManagementHelper.getModel("DeliveryTableJsonModel");
			var sPath = oEvent.getSource().getBindingContext("DeliveryTableJsonModel").getPath();
			var oData = oEvent.getSource().getBindingContext("DeliveryTableJsonModel").getObject();
			var sLegacy = oData.Tejt;
			LegacyValidationHelper.handleLegacyValidationForDDSR(sLegacy, sPath, oModel, "/TejtValueState", "/TejtValueStateText");
			if (oEvent.getSource().getValueState() === "Error") {
				oEvent.getSource().setSelectedKey("");
			}
		},

		handleLegacyValidationDevolutions: function (oEvent) {
			var oModel = AppManagementHelper.getModel("DevolutionTableJsonModel");
			var sPath = oEvent.getSource().getBindingContext("DevolutionTableJsonModel").getPath();
			var oData = oEvent.getSource().getBindingContext("DevolutionTableJsonModel").getObject();
			var sLegacy = oData.Tejt;
			LegacyValidationHelper.handleLegacyValidationForDDSR(sLegacy, sPath, oModel, "/TejtValueState", "/TejtValueStateText", oEvent.getSource()
				.mBindingInfos.items.path);
		},

		handleLegacyValidationTransfersTeInformer: function (oEvent) {
			var oModel = AppManagementHelper.getModel("TransferListJsonModel");
			var sPath = oEvent.getSource().getBindingContext("TransferListJsonModel").getPath();
			var oData = oEvent.getSource().getBindingContext("TransferListJsonModel").getObject();
			var sLegacy = oData.Teinformo;
			LegacyValidationHelper.handleLegacyValidationForDDSR(sLegacy, sPath, oModel, "/TeinformoValueState", "/TeinformoValueStateText",
				oEvent.getSource().mBindingInfos.items.path);
			if (oEvent.getSource().getValueState() === "Error") {
				oEvent.getSource().setSelectedKey("");
			}
		},

		createRecursiveDays: function (aPromises, fnOk) {
			if (aPromises.length > 0) {
				var oPromise = aPromises.shift();
				oPromise.then(() => {
					this.createRecursiveDays(aPromises, fnOk)
				}).catch(() => {
					this.createRecursiveDays(aPromises, fnOk)
				})
			} else {
				fnOk();
			}
		},

		//TODO revisar sobre el grisado de diaria/continua
		handlePeriod: function (oEvent) {
			if (this._edit) {
				BusyDialogHelper.open();
				var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
				var bDiary = oEvent.getParameter("selectedIndex") === 0;
				if (bDiary) {
					if (this.timesSelected()) {
						AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "D");
						var aDaysDeepEntity = [];
						this.regenerateHorariosPorLicencia();
						var aDays = this.getDateArray();
						aDays.forEach((oDay) => {
							var oDay = {
								Tipo: oLicense.Tipo,
								Empresa: oLicense.Empresa,
								Anio: oLicense.Anio,
								Id: oLicense.Id,
								Modif: "",
								Fecha: oDay.Fecha,
								Horainicio: FormatHelper.getTimeStringSAPFormat(oDay.Horainicio),
								Horafin: FormatHelper.getTimeStringSAPFormat(oDay.Horafin)
							};
							aDaysDeepEntity.push(oDay);
						});
						var oData = {
							Tipo: oLicense.Tipo,
							Empresa: oLicense.Empresa,
							Anio: oLicense.Anio,
							Id: oLicense.Id,
							HorariosPorLicencia_nav: aDaysDeepEntity
						};

						// Elimino los horarios de la licencia:
						// LicenseService.findHorarios(oLicense).then((aHorariosLicencia) => {
						//     let aPromisesToDelete = [];
						//     aHorariosLicencia = aHorariosLicencia.results;
						//     aHorariosLicencia.forEach((oHorarioLicencia) => {
						//         aPromisesToDelete.push(LicenseService.deleteDay(oHorarioLicencia));
						//     });
						//
						//     Promise.all(aPromisesToDelete).then(() => {
						LicenseService.editLicense().then(() => {
							LicenseService.PostDaysLicence(oData).then(() => {
								MessageBoxHelper.showAlert("Alerta", "Se ha realizado el proceso de manera exitosa", () => {
									LicenseService.FIND(oLicense);
									AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", true);
									BusyDialogHelper.close();
								})
							}).catch(() => {
								BusyDialogHelper.close();
								MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear fechas");
								AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", true);
							})
						}).catch(() => {
							BusyDialogHelper.close();
							MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al editar los tiempos");
							AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", true);
						});
						//     }).catch(() => {
						//         MessageBoxHelper.showAlert("Alerta", "Error al intentar eliminar los horarios de la licencia.");
						//     });
						// }).catch(() => {
						//     MessageBoxHelper.showAlert("Alerta", "Error al intentar obtener los horarios de la liceinca.");
						// });
					}
				} else { // Cuando es Edicion "Continua"
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "C");
					LicenseService.findHorarios(oLicense).then((data) => {
						var aPromisesToDelete = [];
						var aData = data.results;
						aData.forEach((e) => {
							aPromisesToDelete.push(LicenseService.deleteDay(e));
						});

						LicenseService.editLicense().then(() => {
							Promise.all(aPromisesToDelete).then(() => {
								MessageBoxHelper.showAlert("Alerta", "Se ha realizado el proceso de manera exitosa", () => {
									LicenseService.FIND(oLicense);
									AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", false);
									BusyDialogHelper.close();
								})
							}).catch(() => {
								BusyDialogHelper.close();
								MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear fechas");
								AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", false);
							})
						}).catch(() => {
							BusyDialogHelper.close();
							MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al editar los tiempos");
							AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", false);
						});
					}).catch(() => {
						console.log("error");
					})
				}
			} else {
				if (oEvent.getParameter("selectedIndex") === 0) { // Si se selecciona "Diaria"
					AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", this.validDatesToEnableButton());
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "D");
					this.regenerateHorariosPorLicencia();
				} else {
					AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", false);
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "C");
				}
			}
		},

		validDatesToEnableButton: function () {
			let oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			return oLicense.Solbeg !== null && oLicense.Solend !== null && oLicense.Timend !== null && oLicense.Timbeg !== null
		},

		closeDailyDialog: function () {
			this.dailyDialog.close();
			this.dailyDialog.destroy(true);
		},

		onDailyDialogOpen: function () {
			var oModelNoAuth = AppManagementHelper.getModel("DisableNoAuthModel");
			var oPermisosJsonModel = AppManagementHelper.getModel("PermisosJsonModel");
			var oUserJsonModel = AppManagementHelper.getModel("UserJsonModel");
			var ostatusModel = AppManagementHelper.getModel("statusModel");
			var oDisableControlsModel = AppManagementHelper.getModel("DisableControlsJsonModel");
			if (this._edit) {
				oModelNoAuth.setProperty("/isEdition", true);
			} else {
				oModelNoAuth.setProperty("/isEdition", false);
			}
			var sPeriod = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Period");
			if (!this.timesSelected()) {
				MessageBoxHelper.showMessageToast("Debe cargar Fecha/Hora Inicio y Fecha/Hora Fin para poder acceder al detalle");
				return;
			}
			if (sPeriod === "D") {
				var pageName = "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.requestDailyTime";
				var oController = this;
				var component = FioriComponentHelper.getComponent();
				var view = component.byId("App").byId(pageName);
				var oLicenseJsonModel = AppManagementHelper.getModel("LicenseJsonModel");
				var viewId = component.byId("App").createId(pageName);
				view = sap.ui.jsview(viewId, pageName);
				//adds view to split app
				//create model?
				var oDialog = new sap.m.Dialog({
					afterClose: () => {
						this.dailyDialog.destroy(true);
					},
					title: "Días",
					contentWidth: "60%",
					modal: true,
					content: view,
					buttons: [
						new sap.m.Button({
							text: "Volver",
							icon: "sap-icon://decline",
							press: [oController.closeDailyDialog, oController]
						}).addStyleClass("buttonInverted floatLeft")
					]
				}).addStyleClass("customDialog");

				//??????TODO
				if (!this._edit) {
					FormatHelper.formatTimesToDate(oLicenseJsonModel.getProperty("/HorariosPorLicencia_nav"));
				}

				oDialog.setModel(oLicenseJsonModel, "LicenseJsonModel");
				oDialog.setModel(oPermisosJsonModel, "PermisosJsonModel");
				oDialog.setModel(oUserJsonModel, "UserJsonModel");
				oDialog.setModel(ostatusModel, "statusModel");
				oDialog.setModel(oModelNoAuth, "DisableNoAuthModel");
				oDialog.setModel(oDisableControlsModel, "DisableControlsJsonModel");
				this.dailyDialog = oDialog;
				oDialog.open();
			} else {
				MessageBoxHelper.showMessageToast("Para poder acceder el periodo necesita ser diario");
			}
		},

		handleSignal: function (name) {
			return function (oEvent) {
				(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("LicenseJsonModel").setProperty(name, "X") :
					AppManagementHelper.getModel("LicenseJsonModel").setProperty(name, "");
			}
		},

		handleBlock: function (oEvent) {
			(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Bloqueo", "X") :
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Bloqueo", "");
		},

		handleNoSignal: function (oEvent) {
			(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Senalninguna", "X") :
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Senalninguna", "");
		},

		handleCautions: function (oEvent) {
			(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Precaucionesok", "X") :
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Precaucionesok", "");
		},

		handleStates: function (oEvent) {
			(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Senalestados", "X") :
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Senalestados", "");
		},

		handleAlarms: function (oEvent) {
			(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Senalalarmas", "X") :
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Senalalarmas", "");
		},

		handleSignalMeasure: function (oEvent) {
			(oEvent.getParameter("selected")) ? AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Senalmedicion", "X") :
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Senalmedicion", "");
		},

		handleShootRange: function (oEvent) {
			var sSelected = oEvent.getParameter("selected") ? "X" : "";
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Rdisparo", sSelected);
		},

		getSolicitantes: function (tension, tarea) {
			var that = this;
			var tipo = "S";
			this.getPersonalHabilitado(tension, tarea, tipo).then(function (res) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					"personal": res.results
				});

				that.getView().setModel(oModel, "SolicitantesJsonModel");
			}, function (err) {
				//TODO
			})
		},

		getJefes: function (tension, tarea) {
			var that = this;
			var tipo = "S";
			this.getPersonalHabilitado(tension, tarea, tipo).then(function (res) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					"personal": res.results
				});

				that.getView().setModel(oModel, "JefesJsonModel");
			}, function (err) {
				//TODO
			});
		},

		getPersonalHabilitado: function (tension, tarea, tipo) {
			var filters = [];
			filters.push(new sap.ui.model.Filter({
				path: "tension",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: tension
			}));
			filters.push(new sap.ui.model.Filter({
				path: "tarea",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: tarea
			}));
			filters.push(new sap.ui.model.Filter({
				path: "tipo",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: tipo
			}));
			return personalHabilitadoService.getPersonalPromise(filters);
		},

		searchOrden: function (evt) {
			//return; //TODO remove this this is to go back to ordenes input
			let selected = evt.getParameter("selectedItem");
			var filters = [];
			let empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			if (!selected) {
				EstacionesService.filterPorRegion("");
				WorkPlaceService.filterWorkPlacesByRegion("");
				return;
			};
			let region = selected.getKey();
			/*let tiposOrdenes = AppManagementHelper.getModel("TiposOrdenes").getData().TiposOrdenes;
			AppManagementHelper.getModel("OrdenesJsonModel").setProperty("/Ordenes", tiposOrdenes[region]);*/

			OrdenesService.loadOrdenes(empresa, region);

			EstacionesService.filterPorRegion(region);
			//WorkPlaceService.filterWorkPlacesByRegion(region);
			this.loadPuestoTrabajo(region).then((aPuestoTrabajo) => {
				AppManagementHelper.getModel("PuestoTrabajoJsonModel");
				AppManagementHelper.getModel("PuestoTrabajoJsonModel").setData({
					PuestosTrabajo: aPuestoTrabajo
				});
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Arbpl", "")
			}).catch((e) => {
				console.log(e)
			})

			//this.openOrdenesDialogHelper();
		},

		loadPuestoTrabajo: async function (region) {
			let aPuestoTrabajo = await LicenseService.getPuestoTrabajo(region)
			return aPuestoTrabajo;
		},

		openOrdenesDialogHelper: function () {
			OrdenesDialogHelper.openDialog("", this.getView());
		},

		equipoSelected: function (evt) {
			var obj = evt.getParameter("selectedItem").getBindingContext("EquiposJsonModel").getObject();
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Ingrp", obj.Ingrp)
			var sEquipo = obj.CodigoEquipo;
			var oModelLim = AppManagementHelper.getModel("LimitacionesJsonModel");
			var aLimitaciones = oModelLim.getData().Limitaciones;
			//GQ
			if (!aLimitaciones) return obj
			// Filtrar el array
			var aFilteredLim = aLimitaciones.filter(function (limitacion) {
				return limitacion.Equipo === sEquipo;
			});
			var sMensaje = `El equipo ${sEquipo}, tiene activas las siguientes Limitaciones técnicas:\n`;
			if (aFilteredLim && aFilteredLim.length > 0) {
				aFilteredLim.forEach(function (limitacion) {
					sMensaje += `- ${limitacion.Idlimitacion}\n`;
				});
			} else {
				sMensaje += "No hay limitaciones técnicas activas.";
			}
			//	MessageBoxHelper.showMessage(sMensaje);

			return obj;
		},

		horariosSemanaVisibility: function (sPeriod) {
			var currentDate = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solbeg");
			var stopDate = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solend");
			var timeFrom = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timbeg");
			var timeTo = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Timend");
			var Period = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Period");

			if (Period === 'D') {
				if (currentDate !== null && stopDate !== null && timeFrom !== null && timeTo !== null) {
					//AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/enabled", false);
					//AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "D");

					//AppManagementHelper.getModel("LicenseJsonModel").refresh(true);
					AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "D");
					//AppManagementHelper.getModel("DisableControlsJsonModel").refresh();
					//AppManagementHelper.getModel("DisableControlsJsonModel").refresh(true);

					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}

			//if( this.timesSelected() ){
			//AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Period", "D");
			//}

		},

		includeCammesa: function () {
			LicenseService.toggleIncludeCammesa();
		},

		OTSelected: function (evt) {
			//let OT = evt.getParameter("selectedItem").getBindingContext("OrdenesJsonModel").getObject();
			//	let model = this.getView().getModel("LicenseJsonModel");
			//model.setProperty("/Solbeg", OT.Inicio);
			//model.setProperty("/Solend", OT.Fin);
			//model.setProperty("/Arbpl", OT.Puestotr);
			//model.setProperty("/Solicitante", OT.Solicitante);
			//model.setProperty("/Equstatnocam", OT.Estadoeq); comento esta linea porque hace que cuando salga de la licencia y vuelva a entrar desaparezca el campo "Estado Equipo/s a intervenir"
			//	model.setProperty("/Tplnr", OT.Et);
			//TODO transformar codigo de ET en estacion
			//	EquiposService.loadEquipos(OT.Et, OT.Eq);
			//model.setProperty("/Equnr", OT.Eq);
			//	model.setProperty("/Jefe", OT.Jefe);
			//devuelve un objeto con {Solbeg, Solend, Arbpl,
			// Solicitante, Equstatnocam, Tplnr, Equnr, Jefe}
		},

		estadoEntregaDia: function (specialDates, selectedDate) {
			let enabled = "greenBackground";
			let disabled = "redBackground";
			let conditioned = "yellowBackground";
			if (!selectedDate || !specialDates) {
				this.removeStyleClass(enabled);
				this.removeStyleClass(disabled);
				this.removeStyleClass(conditioned);
				return "";
			}
			let fechaEncontrada = specialDates.find(x => new Date(x.Fecha).setHours(0, 0, 0, 0) === new Date(selectedDate).setHours(0, 0, 0,
				0));

			if (fechaEncontrada) {
				if (fechaEncontrada.Estado === "CC") {
					this.addStyleClass(conditioned);
					this.removeStyleClass(disabled);
					this.removeStyleClass(enabled);
				} else {
					this.addStyleClass(disabled);
					this.removeStyleClass(conditioned);
					this.removeStyleClass(enabled);
				}

				return "";
			} else {
				this.addStyleClass(enabled);
				this.removeStyleClass(conditioned);
				this.removeStyleClass(disabled);
				return "";
			}
		},

		handleDialogStatus: function (oEvent) {

			let oModel = sap.ui.getCore().byId(oEvent.target.id).getBindingContext("DeliveryTableJsonModel").getObject();
			let dDevolution = oModel.Datelicencia;
			let oSpecialDate = this.getModel("EspecialDatesTramitacion").getData().Fechas;
			for (let i = 0; i < oSpecialDate.length; i++) {
				if (new Date(oSpecialDate[i].Fecha).setHours(0, 0, 0, 0) === new Date(dDevolution).setHours(0, 0, 0, 0)) {
					if (oSpecialDate[i].Estado === "NA" || oSpecialDate[i].Estado === "AS") {
						var sComment = oSpecialDate[i].Observaciones;
						var sState = oSpecialDate[i].Estado;
						break;
					} else {
						var sComment = oSpecialDate[i].Observaciones;
						var sState = oSpecialDate[i].Estado;
					}
				}
			}

			if (sComment === "" || !sComment) {
				sComment = "No hay comentarios";
			}

			switch (sState) {
				case "CC":
					sState = "Condicionado";
					break;
				case "AS":
					sState = "Anulada por el Solicitante";
					break;
				case "NA":
					sState = "No Autorizada";
					break;
				default:
					sState = "Sin Estado";
					break;
			}
			if (sState !== "Sin Estado") {
				let DialogStatus = new sap.m.Dialog({
					title: "Estado Diario",
					content: [
						new sap.m.VBox({
							justifyContent: "Center",
							alignItems: "Center",
							items: [
								new sap.m.Text({
									text: 'Comentario: ' + sComment
								}),
								new sap.m.Text({
									text: 'Estado: ' + sState
								})
							]
						})
					],
					endButton: [
						new sap.m.Button({
							text: "Cerrar",
							press: function () {
								DialogStatus.destroy();
							}
						}).addStyleClass("buttonInverted")
					]
				});
				DialogStatus.open();
			}
		},

		handleJobCondStatus: function (UsuarioEncontrado, Jobcond) {
			if (UsuarioEncontrado) {
				return Jobcond ? Jobcond !== "01" : false;
			} else {
				return false
			}

		},

		tipoSegunEstado: function (Status) {
			if (Status == "CC") {
				return sap.ui.unified.CalendarDayType.Type01;
			} else {
				return sap.ui.unified.CalendarDayType.Type02;
			}

		},

		setCancelacionDefEnabledDependsPeriod: function (Period, Substatus) {
			if (Period === "C") {
				return false;
			} else if (Period === "D") {
				return true;
			}
		},

		MedidasSeg_TCTfieldsEnabledFormatter: function (Jobcond) {
			if (Jobcond === '04' || Jobcond === '05') {
				return true
			} else {
				this.cleanTCTFields();
				return false
			}
		},

		cleanTCTFields: function () {
			var LicenseJsonModelData = this.getView().getModel("LicenseJsonModel").getData();
			LicenseJsonModelData.Bloqueorecierretxt = "";
			LicenseJsonModelData.Intnooperar = "";
		},

		showAllContent: function (oEvent) {
			//debugger;
		},

		CausaNoFormatter: function (causaNo) {
			if (causaNo === "ALTA") {
				return "Alta Demanda"
			}
			if (causaNo === "COND") {
				return "Condiciones Climatidas Adversas"
			}
			if (causaNo === "DEF1") {
				return "Deficit de Generacion por combustible"
			}
			if (causaNo === "DEF2") {
				return "Deficit de Generacion por indisponibilidad de Maquinas"
			}
			if (causaNo === "ELEV") {
				return "Elavada Transmision de Potencia"
			}
			if (causaNo === "LAPE") {
				return "Limites Adicionales a los declarados en la programacion estacional"
			}
			if (causaNo === "LIPE") {
				return "Limites de Programacion estacional"
			}
			if (causaNo === "SEGS") {
				return "Por Seguridad del SADI"
			}
			if (causaNo === "SUPE") {
				return "Superposicion de Mantenimientos"
			}
			if (causaNo === "TRAN") {
				return "Imposibilidad de Transferncia por problemas tecnicos"
			}
		},

		/* ESTO ES POR HACER LAS COSAS MAL */
		getVersionesActualesArray: function (aData) {
			let aNewVersions = [];
			for (let oData of aData) {
				let aUnifilares = oData.results;
				let oVersion = aUnifilares[0];
				if (oVersion) {
					aNewVersions.push(oVersion);
				}
			}
			return aNewVersions;
		},

		validateUnifilarVersions: function (aUnifilaresFromOldLicense, aActualVersions) {
			let aUnifilaresToCreate = [];
			for (let oUnifilarFromOldLicense of aUnifilaresFromOldLicense) {
				let oUnifilarNewVersion = aActualVersions.find(e => e.Centro === oUnifilarFromOldLicense.Region && e.Et ===
					oUnifilarFromOldLicense.Et && e.TipoUnifilar === oUnifilarFromOldLicense.TipoUnifilar);
				if (oUnifilarNewVersion) {
					if (oUnifilarFromOldLicense.NumVersion !== oUnifilarNewVersion.NumVersion) {
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

		handleRecursiveUnifilarCreation: function (sId, aUnifilares, sLicenseAnio, aMessages, fnCallBack) {
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
							// Set nuevo año
							e.Anio = sLicenseAnio;
							// Set nro de licencia
							e.Numerolicencia = sId;
						});
						oData.marcadoresnorel_nav = aData[1] ? aData[1].results ? aData[1].results : [] : [];
						oData.marcadoresnorel_nav.forEach(e => {
							// Set nuevo año
							e.Anio = sLicenseAnio;
							// Set nro de licencia
							e.Numerolicencia = sId;
						});

						oData.areasseguras_nav = [];
						oData.Numerolicencia = sId;

						// Set nuevo año
						oData.Anio = sLicenseAnio;

						LicenseService.createUnifilar(oData).then((data) => {
							this.handleRecursiveUnifilarCreation(sId, aUnifilares, sLicenseAnio, aMessages, fnCallBack);
						}).catch(() => {
							this.handleRecursiveUnifilarCreation(sId, aUnifilares, sLicenseAnio, aMessages, fnCallBack);
						})
					}).catch(() => {
						this.handleRecursiveUnifilarCreation(sId, aUnifilares, sLicenseAnio, aMessages, fnCallBack);
					})
				} else {
					this.handleRecursiveUnifilarCreation(sId, aUnifilares, sLicenseAnio, aMessages, fnCallBack);
				}
			} else {
				fnCallBack();
			}
		},
		// Issue # 539
		// Formatter para que los combos muestren el texto completo en el tooltip
		// Se debe pasar: SelectedKey del combo, Modelo y atributo en donde estan los items del combo( separados por "_"), ID del campo clave en el Modelo , ID Campo texto 
		// en el modelo
		formatComboTooltip: function (sValue, sModel, sKeyField, sTextField) {

			//	Hago un split por si el array con los textos no esta en la raiz del json
			var aStrings = sModel.split("_");
			var sModelName = aStrings[0];
			var sAttrName = (aStrings[1]) ? aStrings[1] : "";
			var oModel = AppManagementHelper.getModel(sModelName);
			if (sAttrName) {
				// Sino esta en la raiz hago un getProperty
				var aData = oModel.getProperty("/" + sAttrName)
			} else {
				// Si esta en la raiz hago un get Data
				aData = oModel.getData();
			}
			// Busco el texto usando  los campos sKeyfield y sTextField pasados por parametros
			if (aData) {
				if (aData.length > 0) {
					var aTextFound = aData.filter((oElement) => oElement[sKeyField] === sValue);
					// Si encuentro un valor lo devuelvo
					return (aTextFound.length > 0) ? sValue + " " + aTextFound[0][sTextField] : "";
				}
			} else {
				return "";
			}

		},
		//Issue 562 - Jefes de Trabajo habilitados para TcT
		//Se borro el binding de la vista para los campos Jefe de trabajo y Jefe de trabajo Suplente  ya que se determina dinamicamente al valor del combo Condiciones de trabajo
		onSelectionChangeCond: function (oEvent) {

			sap.ui.getCore().byId("JefeTrabajoCombo").setSelectedKey("")
			sap.ui.getCore().byId("JefeTrabajoSupComb").setSelectedKey("")

			sap.ui.getCore().byId("jefeLabel").setText("Jefe de trabajo");
			sap.ui.getCore().byId("jefeSupLabel").setText("Jefe de trabajo suplente");

			jefeSupLabel
			if (oEvent.getParameter("selectedItem")) {
				var sKey = oEvent.getParameter("selectedItem").getKey();
				var oTemplate = new sap.ui.core.Item({
					key: "{PersonalHabilitadoModel>Legajo}",
					text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
				});
				if (sKey === "04" || sKey === "05") {
					sap.ui.getCore().byId("JefeTrabajoCombo").bindAggregation("items", "PersonalHabilitadoModel>/JefeDeTrabajoTct", oTemplate);
					sap.ui.getCore().byId("JefeTrabajoSupComb").bindAggregation("items", "PersonalHabilitadoModel>/JefeDeTrabajoTct", oTemplate);
					sap.ui.getCore().byId("jefeTrabTrComb").bindAggregation("items", "PersonalHabilitadoModel>/JefeDeTrabajoTct", oTemplate);


				} else if (sKey) {
					sap.ui.getCore().byId("JefeTrabajoCombo").bindAggregation("items", "PersonalHabilitadoModel>/JefeDeTrabajo", oTemplate);
					sap.ui.getCore().byId("JefeTrabajoSupComb").bindAggregation("items", "PersonalHabilitadoModel>/JefeDeTrabajo", oTemplate);
					sap.ui.getCore().byId("jefeTrabTrComb").bindAggregation("items", "PersonalHabilitadoModel>/JefeDeTrabajo", oTemplate);


				}
			} else {
				sap.ui.getCore().byId("JefeTrabajoCombo").unbindAggregation("items");
				sap.ui.getCore().byId("JefeTrabajoSupComb").unbindAggregation("items");
				sap.ui.getCore().byId("jefeTrabTrComb").unbindAggregation("items");

			}

		},
		// Funcion callback llamada luego de cargar el modelo json que tendra los datos de la vista 
		//En este caso lo utilizo para determinar dinamicamente el binding de algunos campos
		findSuccess: async function (oLicence) {
  this.bindJefes(oLicence);
  

			
		},

		//Issue 562 - Jefes de Trabajo habilitados para TcT
		//Se borro el binding de la vista para los campos Jefe de trabajo y Jefe de trabajo Suplente  ya que se determina dinamicamente al valor del combo Condiciones de trabajo

		bindJefes(oLicence) {
			if (oLicence) {

				var sValue = oLicence.Jobcond;
				var oTemplate = new sap.ui.core.Item({
					key: "{PersonalHabilitadoModel>Legajo}",
					text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
				});
				if (sValue === "04" || sValue === "05") {
					(sap.ui.getCore().byId("JefeTrabajoCombo")) ? sap.ui.getCore().byId("JefeTrabajoCombo").bindAggregation("items",
						"PersonalHabilitadoModel>/JefeDeTrabajoTct", oTemplate) : "";
					(sap.ui.getCore().byId("JefeTrabajoSupComb")) ? sap.ui.getCore().byId("JefeTrabajoSupComb").bindAggregation("items",
						"PersonalHabilitadoModel>/JefeDeTrabajoTct", oTemplate) : "";
					(sap.ui.getCore().byId("jefeTrabTrComb")) ? sap.ui.getCore().byId("jefeTrabTrComb").bindAggregation("items",
						"PersonalHabilitadoModel>/JefeDeTrabajoTct", oTemplate) : "";
				} else if (sValue) {
					(sap.ui.getCore().byId("JefeTrabajoCombo")) ? sap.ui.getCore().byId("JefeTrabajoCombo").bindAggregation("items",
						"PersonalHabilitadoModel>/JefeDeTrabajo", oTemplate) : "";
					(sap.ui.getCore().byId("JefeTrabajoSupComb")) ? sap.ui.getCore().byId("JefeTrabajoSupComb").bindAggregation("items",
						"PersonalHabilitadoModel>/JefeDeTrabajo", oTemplate) : "";

					(sap.ui.getCore().byId("jefeTrabTrComb")) ? sap.ui.getCore().byId("jefeTrabTrComb").bindAggregation("items",
						"PersonalHabilitadoModel>/JefeDeTrabajo", oTemplate) : "";
				} else {
					(sap.ui.getCore().byId("JefeTrabajoCombo")) ? sap.ui.getCore().byId("JefeTrabajoCombo").unbindAggregation("items") : "";
					(sap.ui.getCore().byId("JefeTrabajoCombo")) ? sap.ui.getCore().byId("JefeTrabajoSupComb").unbindAggregation("items") : "";
					(sap.ui.getCore().byId("JefeTrabajoCombo")) ? sap.ui.getCore().byId("jefeTrabTrComb").unbindAggregation("items") : "";
				}
			} else {
				(sap.ui.getCore().byId("JefeTrabajoCombo")) ? sap.ui.getCore().byId("JefeTrabajoCombo").unbindAggregation("items") : "";
				(sap.ui.getCore().byId("JefeTrabajoCombo")) ? sap.ui.getCore().byId("JefeTrabajoSupComb").unbindAggregation("items") : "";
				(sap.ui.getCore().byId("JefeTrabajoCombo")) ? sap.ui.getCore().byId("jefeTrabTrComb").unbindAggregation("items") : "";
			}

		},
		validarHabilit: function (oLicence, aHabilitaciones) {
			if (oLicence) {
				if (!this.checkHab("JefeTrabajo", oLicence.Jefe, aHabilitaciones)) {
					oLicence.Jefe = "";
				}

				if (!this.checkHab("JefeTrabajoSuplente", oLicence.JefeSuplente, aHabilitaciones)) {
					oLicence.JefeSuplente = "";
				}
				if (!this.checkHab("Solicitante", oLicence.Solicitante, aHabilitaciones)) {
					oLicence.Solicitante = "";
				}
				if (!this.checkHab("SolicitanteSuplente", oLicence.SolSuplente, aHabilitaciones)) {
					oLicence.SolSuplente = "";
				}
				if (!this.checkHab("SolicitanteSuplenteAuxiliar", oLicence.SolSuplenteAux, aHabilitaciones)) {
					oLicence.SolSuplenteAux = "";
				}
				//     this.checkHab("TejtCD",oLicence.SolSuplenteAux,aHabilitaciones);
			}

		},
		checkHab: function (sType, sLegajo, aHabilitaciones) {
			var oHab = aHabilitaciones.find((oHab) => {
				return oHab.Legajo == sLegajo;
			});
			if (oHab.Estado != "H") {

				var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
				if (sType === "Solicitante") {
					this.setErrorState("/SolicitanteValueState", "/SolicitanteValueStateText", sWarningText)

				}
				if (sType === "JefeTrabajo") {
					this.setErrorState("/JefeTrabajoValueState", "/JefeTrabajoValueStateText", sWarningText)
				}
				if (sType === "JefeTrabajoSuplente") {
					this.setErrorState("/JefeTrabajoSuplenteValueState", "/JefeTrabajoSuplenteValueStateText", sWarningText)
				}
				if (sType === "SolicitanteSuplente") {
					this.setErrorState("/SolicitanteSuplenteValueState", "/SolicitanteSuplenteValueStateText", sWarningText)
				}
				if (sType === "SolicitanteSuplenteAuxiliar") {
					this.setErrorState("/SolicitanteSuplenteAuxValueState", "/SolicitanteSuplenteAuxValueState", sWarningText)
				}
				if (sType === "TejtCD") {
					this.setErrorState("/TejtCancelacionDefValueState", "/TejtCancelacionDefValueStateText", sWarningText)
				}
				return false;
			}
			return true;

		},
		updateJefeLabelText: function (oEvent) {
			const oComboBox = oEvent.getSource();
			const sSelectedKey = oComboBox.getSelectedKey();
			const oModel = this.getView().getModel("PersonalHabilitadoModel");
			const aItems = oModel.getProperty("/JefeDeTrabajo");

			const oJefe = aItems.find(item => item.Legajo === sSelectedKey);
			const sTipoHab = oJefe?.TipoHab;
			const aGuiados = ["M03", "M07", "M11", "M15", "M19", "M23", "M27"];


			const oLicenseModel = this.getView().getModel("LicenseJsonModel");
			const sJobCond = oLicenseModel?.getProperty("/Jobcond");

			const oLabel = sap.ui.getCore().byId("jefeLabel");
			if (oLabel) {
				if (sJobCond === "06" && aGuiados.includes(sTipoHab)) {
					oLabel.setText("Jefe de trabajo guiado");
				} else {
					oLabel.setText("Jefe de trabajo");
				}
			}
		},

		updateJefeSupLabelText: function (oEvent) {
			const oComboBox = oEvent.getSource();
			const sSelectedKey = oComboBox.getSelectedKey();
			const oModel = this.getView().getModel("PersonalHabilitadoModel");
			const aItems = oModel.getProperty("/JefeDeTrabajo");

			const oJefe = aItems.find(item => item.Legajo === sSelectedKey);
			const sTipoHab = oJefe?.TipoHab;
			const aGuiados = ["M03", "M07", "M11", "M15", "M19", "M23", "M27"];

			const oLicenseModel = this.getView().getModel("LicenseJsonModel");
			const sJobCond = oLicenseModel?.getProperty("/Jobcond");


			const oLabel = sap.ui.getCore().byId("jefeSupLabel");
			if (oLabel) {
				if (sJobCond === "06" && aGuiados.includes(sTipoHab)) {
					oLabel.setText("Jefe de trabajo suplente guiado");
				} else {
					oLabel.setText("Jefe de trabajo suplente");
				}
			}
		},


		setErrorState: function (sValueStateProperty, sValueStateTextProperty, sTextForValueState) {
			var oModelLegacyValidation = AppManagementHelper.getModel("LegacyValidationJsonModel");
			oModelLegacyValidation.setProperty(sValueStateProperty, "Error");
			oModelLegacyValidation.setProperty(sValueStateTextProperty, sTextForValueState);
		},
		changeLicenTypeCopyTBA: function () {
			// Si el usuario es solicitante transener
			if (AppManagementHelper.getModel("UserJsonModel").getData().roles.some((oElement) => oElement === "ope_solic-lic_transener")) {
				// Remplazo el tipo de licencia de la original por "Programada"
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Tipolicencia", "N");
			}

		}

	});
});