sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/services/oDataService",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BatchOperationsHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/LicenceHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FileDownloadHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MailHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatterHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/LibroGuardiasService",
	"Transener/Operaciones/LicenciasTrabajo/services/EtMailService",
	"Transener/Operaciones/LicenciasTrabajo/utils/LegacyValidationHelper",
], function (oDataService, MessageBoxHelper, FormatHelper, AppManagementHelper, BusyDialogHelper, BatchOperationsHelper, LicenceHelper,
	FileDownloadHelper, MailHelper, FormatterHelper, LibroGuardiasService, EtMailService, LegacyValidationHelper) {
	"use strict";
	return {
		rolCoordinador: "Coordinador_Mantenimiento",
		rolTramitador: "Tramitador",
		nullId: "0000000000",
		nullLegajo: "00000000",

		_expandProperties: "HorariosPorLicencia_nav,CoordinacionesLicencia_nav,ObservacionesLicencia_nav,TramitacionesLicencia_nav," +
			"HabilitacionRecierre_nav,InhibicionRecierre_nav,RetiroPAT_nav,ColocacionPAT_nav,TurnosLicencias_nav," +
			"SuspensionLicencia_nav,ReanudacionLicencia_nav,TransferenciaJefeTrabajo_nav,DevolucionLicencia_nav,EntregasLicencia_nav,AttachmentXLicencia_nav,EsquemaUnifilar_nav",

		PostDaysLicence: function (oLicenseData) {
			return new Promise((resolve, reject) => {
				var entity = "/LicenciaTrabajoSet";
				oDataService.getModel("TransenerOperaciones").create(entity, oLicenseData, {
					success: function () {
						resolve();
					},
					error: function () {
						reject();
					}
				});
			});
		},

		deleteNavProperties: function (oObject) {
			delete oObject.HorariosPorLicencia_nav;
			delete oObject.CoordinacionesLicencia_nav;
			delete oObject.ObservacionesLicencia_nav;
			delete oObject.TramitacionesLicencia_nav;
			delete oObject.SuspensionLicencia_nav;
			delete oObject.TransferenciaJefeTrabajo_nav;
			delete oObject.DevolucionLicencia_nav;
			delete oObject.EntregasLicencia_nav;
			delete oObject.ReanudacionLicencia_nav;
			delete oObject.AttachmentXLicencia_nav;
			delete oObject.EsquemaUnifilar_nav;
			delete oObject.HabilitacionRecierre_nav;
			delete oObject.InhibicionRecierre_nav;
			delete oObject.RetiroPAT_nav;
			delete oObject.ColocacionPAT_nav;
			delete oObject.TurnosLicencias_nav;
		},

		getDiccionarioClase: function (society) {
			return new Promise((resolve, reject) => {
				let aFilters = []
				aFilters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, society));
				oDataService.getModel("SelectModel").read("/DiccionarioCategoriasSet", {
					filters: aFilters,
					success: function (data) {
						resolve(data.results);
					},
					error: function (error) {
						reject(error);
					}
				});
			})
		},

		getPropiedadesEquipos: function (society, desde) {
			let aFilters = [];
			//	aFilters.push(new sap.ui.model.Filter("Desde", sap.ui.model.FilterOperator.EQ, desde));
			aFilters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, society));
			return new Promise((resolve, reject) => {
				// Issue 504: se cambio el read de la entidad "PropiedadesEquiposSet" a la nueva entidad "ParteDiarioSemanalSet".
				oDataService.getModel("SelectModel").read("/ParteDiarioSemanalSet", {
					filters: aFilters,
					success: function (data) {
						resolve(data.results);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},

		getEstacionCode: function (sTplnr) {
			return new Promise((resolve, reject) => {
				oDataService.getModel("SelectModel").read("/EstacionesSet", {
					success: function (data) {
						var oData = data.results.find(function (e) {
							return e.Codigo === sTplnr;
						})
						resolve(oData);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},

		getEstacionesCodes: function (aTplnr) {
			let aDataPromise = [];
			for (let sTplnr of aTplnr) {
				aDataPromise.push(this.getEstacionCode(sTplnr));
			}
			return new Promise((resolve, reject) => {
				Promise.all(aDataPromise).then((aEstaciones) => {
					resolve(aEstaciones)
				}).catch((e) => {
					reject(e)
				})
			});
		},

		getJobCond: function () {
			return new Promise((resolve, reject) => {

				let aFilters = [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_LICENCIAS"),
				new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "JOBCOND")
				]
				oDataService.getModel("TransenerOperaciones").read("/FixedValuesSet", {
					filters: aFilters,
					success: function (data) {
						resolve(data.results);
					},
					error: function (error) {
						reject();
					}
				});
			})
		},

		GETTipoLicenciaCatalog: function () {
			var oModelBlockEnviarCoord = AppManagementHelper.getModel("EnviarCoordModel");
			oModelBlockEnviarCoord.setProperty("/visibleEnviarCoord", true);
			oModelBlockEnviarCoord.setProperty("/visibleTipoLicencia", false);
			var aRoles = AppManagementHelper.getModel("UserJsonModel").getData().roles;
			var oModel = AppManagementHelper.getModel("TipoLicenciaCatalogModel");
			var aData = [];

			var bJefeTurnoCOT = aRoles.find((r) => {
				//return r === "Jefe_Turno_COT" || r === "Jefe_Turno_COTDT"
				return r === "ope_jefe_turno_cot" || r === "ope_jefe_turno_cotdt"
			});

			var bProgramacion = aRoles.find((r) => {
				//return r === "Programacion_COT" || r === "Programacion_COTDT"
				 return r === "ope_programacion_cot" || r === "ope_programacion_cotdt"
			});

			var bOperador = aRoles.find((r) => {
				//return r === "Operador_COT" || r === "Operador_COTDT"
				 return r === "ope_oper-turno_cot" || r === "ope_oper-turno_cotdt"
			});

			var bSolicitanteLicTBA = aRoles.find(sRol => {
				//return sRol === "Solicitante_Lic_TBA"
				 return sRol === "ope_solic-lic_transba" 

			})

			if (bJefeTurnoCOT) {
				oModelBlockEnviarCoord.setProperty("/visibleEnviarCoord", false);
				oModelBlockEnviarCoord.setProperty("/visibleTipoLicencia", true);
				aData = [{
					key: "N",
					descripcion: "Licencia Programada"
				}, {
					key: "EM",
					descripcion: "Licencia de emergencia"
				}, {
					key: "TE",
					descripcion: "Licencia de terceros"
				}]
			}

			// #Issue 131 se agrega licencia de emergencia.
			if (bProgramacion || bOperador) {
				oModelBlockEnviarCoord.setProperty("/visibleEnviarCoord", false);
				oModelBlockEnviarCoord.setProperty("/visibleTipoLicencia", true);
				aData = [{
					key: "N",
					descripcion: "Licencia Programada"
				}, {
					key: "TE",
					descripcion: "Licencia de terceros"
				}, {
					key: "EM",
					descripcion: "Licencia de emergencia"
				}]
			}

			if (bSolicitanteLicTBA) {
				oModelBlockEnviarCoord.setProperty("/visibleTipoLicencia", true);
				aData = [{
					key: "N",
					descripcion: "Licencia Programada"
				}, {
					key: "EM",
					descripcion: "Licencia de emergencia"
				}, {
					key: "TE",
					descripcion: "Licencia de terceros"
				}]
			}

			var oModelFilters = AppManagementHelper.getModel("TipoLicFiltersModel");
			var aDataFilter = [{
				key: "N",
				descripcion: "Licencia Programada"
			}, {
				key: "EM",
				descripcion: "Licencia de emergencia"
			}, {
				key: "TE",
				descripcion: "Licencia de terceros"
			}];

			oModelFilters.setData({
				TipoLic: aDataFilter
			});

			oModel.setData({
				TipoLic: aData
			});

			return aData && aData[0] && aData[0].key;

		},

		POSTUnifilarSchema: function (oUnifilar) {
			var entity = "/EsquemaUnifilarSet";
			oDataService.getModel("TransenerOperaciones").create(entity, oUnifilar, {
				success: $.proxy(this.successPOSTUnifilar, this),
				error: $.proxy(this.errorPOSTUnifilar, this)
			});
		},

		successPOSTUnifilar: function () {
			this.PUT(false);
			//	MessageBoxHelper.showAlert("Alerta", "Esquema unifilar guardado con exito", $.proxy(this.refreshLicense, this))
		},

		refreshLicense: function () {
			BusyDialogHelper.close();
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			this.FIND(oLicence);
		},

		errorPOSTUnifilar: function () {
			MessageBoxHelper.showAlert("Error", "Se ha producido un error al guardar el esquema unifilar")
		},

		PUTDayPromise: function (oDay) {
			return new Promise((resolve, reject) => {
				let entity = "/HorariosLicenciaSet";
				oDay.Horainicio = FormatHelper.getTimeStringSAPFormat(oDay.Horainicio);
				oDay.Horafin = FormatHelper.getTimeStringSAPFormat(oDay.Horafin);
				oDataService.getModel("TransenerOperaciones").update(entity + "(Id='" + oDay.Id + "',Modif='" + oDay.Modif + "')",
					oDay, {
					success: function () {
						resolve()
					},
					error: function (error) {
						reject(error)
					}
				});
			});
		},

		PUTDay: function (oDay) {
			this.PUTDayPromise(oDay).then($.proxy(this.onSuccessPutDay, this)).catch($.proxy(this.onErrorPutDay, this));
		},

		onSuccessPutDay: function () {
			var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
			var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha realizado el estado diario para este dia de manera correcta", $.proxy(this.FIND, this,
				license));
		},

		onErrorPutDay: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha producido un error al realizar el estado diario");
		},

		deliveryHasBeenMade: function () {
			let aDeliveries = AppManagementHelper.getModel("DeliveryTableJsonModel").getData().Deliveries
			return aDeliveries.some(e => e.Entindex && e.Entindex !== "" && e.Motivono === "");
		},

		deliveryLicence: function (oDelivery) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			this.bMotivoNo = oDelivery.Motivono !== "";
			licenseClone.Substatus = oDelivery.Motivono !== "" ? "" : "E";
			//this is for the final.
			if (this.bMotivoNo && licenseClone.Period === "C") {
				if (this.deliveryHasBeenMade()) {
					licenseClone.Licstat = "11"
				} else {
					licenseClone.Licstat = "01"
					licenseClone.Substatus = "";
				}

			}

			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceDelivery, this, oDelivery),
				error: $.proxy(this.errorPUTLicenceDelivery, this)
			});

		},

		//Warning this method modifies the license
		updateLicense: function (license, options) {
			var entity = "/LicenciaTrabajoSet";
			FormatHelper.formatTimes(license);
			this.deleteNavProperties(license);
			if (license.Rdisparo === "Y") license.Rdisparo = "";
			if (license.Equstat === "Y") license.Equstat = "";
			oDataService.getModel("TransenerOperaciones").update(entity + "(Empresa='" + license.Empresa + "',Id='" + license.Id + "',Tipo='" +
				license.Tipo + "',Anio='" + license.Anio + "')", license, options);
		},

		updateLicenciaPromise: function (oLicencia) {
			return new Promise((resolve, reject) => {
				FormatHelper.formatTimes(oLicencia);
				this.deleteNavProperties(oLicencia);
				if (oLicencia.Rdisparo === "Y") oLicencia.Rdisparo = "";
				if (oLicencia.Equstat === "Y") oLicencia.Equstat = "";

				let sEntity = "/LicenciaTrabajoSet";
				let sEntryId = "(Empresa='" + oLicencia.Empresa + "',Id='" + oLicencia.Id + "',Tipo='" + oLicencia.Tipo + "',Anio='" + oLicencia.Anio +
					"')";
				oDataService.getModel("TransenerOperaciones").update(sEntity + sEntryId, oLicencia, {
					success: () => {
						resolve();
					},
					error: (oError) => {
						reject();
					}
				});
			});
		},

		successPUTLicenceDelivery: function (oDelivery, data) {
			var entity = "/EntregasLicenciaSet";
			oDelivery.Datelicencia = FormatHelper.getUTCdate(oDelivery.Datelicencia);
			oDataService.getModel("TransenerOperaciones").create(entity, oDelivery, {
				success: $.proxy(this.successPOSTDelivery, this),
				error: $.proxy(this.errorPOSTDelivery, this)
			});
		},

		successPOSTDelivery: function (data) {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var fechaRepresentante = FormatHelper.formatDatesGMT(data.Datelicencia)
			fechaRepresentante.setHours(data.Time.getHours())
			fechaRepresentante.setMinutes(data.Time.getMinutes())
			console.log(fechaRepresentante);
			// Issue 542  Registrar automáticamente en el Libro de Guardia la Novedad "NO Entrega de LT"
			// Se debe enviar las No entregas tambien, se agrego condicion para determinar tipo de novedad
			var sTNovedad = (this.bMotivoNo) ? "NE" : "E";
			if (!this.bMotivoNo) {
				var sNovedad = `Numero de licencia ${oLicense.Id}, Trabajo a realizar: ${oLicense.Descripcion}`;
			} else {
				var sMotivNoT = AppManagementHelper.getModel("HardCodeModel").getProperty("/Motivono").filter((oElement) => oElement.key === data.Motivono)[
					0].value;

				sNovedad =
					`Numero de licencia ${oLicense.Id}, Trabajo a realizar: ${oLicense.Descripcion}, Motivo: ${sMotivNoT}, Comentario: ${data.Commen} `;

			}

			var oLibroGuardia = {
				"Fechahora": fechaRepresentante,
				"Equipo": oLicense.Equnr,
				"Lugar": oLicense.Tplnr,
				"Novedad": sNovedad,
				"Tiponovedad": FormatterHelper.getNovedadType(sTNovedad),
				"Empresa": oLicense.Empresa
			};
			// if (this.bMotivoNo) {
			// 	BusyDialogHelper.close();
			// 	var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
			// 	var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
			// 	MessageBoxHelper.showAlert("Alert", `Se ha realizado la ${ this.bMotivoNo ? "NO Entrega" : "Entrega"} de manera exitosa`, $.proxy(
			// 		this.FIND, this, license));
			// } else {
			LibroGuardiasService.POSTLibroGuardia(oLibroGuardia).then(() => {
				BusyDialogHelper.close();
				var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
				var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
				MessageBoxHelper.showAlert("Alert", `Se ha realizado la ${this.bMotivoNo ? "NO Entrega" : "Entrega"} de manera exitosa`, $.proxy(
					this.FIND, this, license));
			}).catch((e) => {
				BusyDialogHelper.close();
				console.error(e)
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear guardia")
			})
			// }
		},

		errorPOSTDelivery: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha producido un error al crear el registro de entrega");
		},

		errorPUTLicenceDelivery: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha producido un error al modificar la licencia para la entrega");
		},

		cancelacionDefinitivaLicence: function (oCC) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			this.statGuardBook = "CC";
			// Antes era 11 y 28, con el ticket 66 el 28 pasa a ser 01 (autorizada) de nuevo.
			licenseClone.Licstat = "11";
			// Si se finaliza como continua finaliza literal, sinó pasa de nuevo a entregada para que se repita el ciclo.
			licenseClone.Substatus = "";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceCancelacion, this, oCC),
				error: $.proxy(this.errorPUTLicenceCancelacion, this)
			});
		},

		successPUTLicenceCancelacion: function (data) {
			//GUARDAR EL FECHA Y HORA DE LA ENTREGA SUSPENCION Y REANUDACION. DEVOLUCION
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();

			// Issue #487
			// var fechaRepresentante = FormatHelper.formatDatesGMT(data.Datelicencia);
			var fechaRepresentante = data.Datelicencia;
			fechaRepresentante.setHours(data.Time.getHours());
			fechaRepresentante.setMinutes(data.Time.getMinutes());
			console.log(fechaRepresentante);
			var oLibroGuardia = {
				"Fechahora": fechaRepresentante,
				"Equipo": oLicense.Equnr,
				"Lugar": oLicense.Tplnr,
				"Novedad": `Numero de licencia ${oLicense.Id}, Trabajo a realizar: ${oLicense.Descripcion}, TE/JT/JTG: ${data.Tejt} - ${FormatterHelper.getPersonalHabilitadoName(data.Tejt)}`,
				"Tiponovedad": FormatterHelper.getNovedadType(this.statGuardBook),
				"Empresa": oLicense.Empresa
			};
			LibroGuardiasService.POSTLibroGuardia(oLibroGuardia).then(() => {

				this.postCancelacionDefinitiva(data).then(() => {

					let promises = [this.getPermisos(oLicense)];
					promises.push(EtMailService.getPromise(oLicense.Empresa, oLicense.Tplnr, this.getSelectionArea(oLicense.Tipo, "01")));
					Promise.all(promises).then(res => {
						var currentUser = AppManagementHelper.getModel("CurrentUser").getData();
						let emails = [];
						let hashPermisos = {};
						let permisos = res[0];
						var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
						var currentEmail = oUserJson.email;
						var currentName = oUserJson.nombre + ", " + oUserJson.apellido;

						permisos.forEach(permiso => {
							hashPermisos[permiso.Rol] = permiso
						});

						emails = [hashPermisos["Creador"], hashPermisos["ope_solic-lic_transener"], hashPermisos["Solicitante_Suplente"],
						hashPermisos["Jefe_Trabajo"], hashPermisos["Jefe_Trabajo_Suplente"], hashPermisos["Solicitante_Suplente_Auxiliar"]
						].map(permiso => permiso && permiso.Mail || "juan.marone@transener.com.ar");

						let usuariosAsignados = {
							Coordinador: currentUser.Legajo + ", " + currentName,
							Creador: hashPermisos["Creador"] ? hashPermisos["Creador"].Legajo + ", " + hashPermisos["Creador"].Nombre : "",
							Solicitante: hashPermisos["ope_solic-lic_transener"] ? hashPermisos["ope_solic-lic_transener"].Legajo + ", " + hashPermisos["ope_solic-lic_transener"].Nombre : "",
							SolicitanteSuplente: hashPermisos["Solicitante_Suplente"] ? hashPermisos["Solicitante_Suplente"].Legajo + ", " +
								hashPermisos["Solicitante_Suplente"].Nombre : "",
							Jefe: hashPermisos["Jefe_Trabajo"] ? hashPermisos["Jefe_Trabajo"].Legajo + ", " + hashPermisos["Jefe_Trabajo"].Nombre : "",
							JefeSuplente: hashPermisos["Jefe_Trabajo_Suplente"] ? hashPermisos["Jefe_Trabajo_Suplente"].Legajo + ", " + hashPermisos[
								"Jefe_Trabajo_Suplente"].Nombre : "",
							SolSuplenteAux: hashPermisos["Solicitante_Suplente_Auxiliar"].Legajo + ", " + hashPermisos["Solicitante_Suplente_Auxiliar"]
								.Nombre
						};

						let sEmailEt = res[1].results && res[1].results !== 0 ? res[1].results.map(e => (e.Mail)).join(",") : "";
						let stringEmails = emails.join(",");
						var sInfAdicional = "";
						var esAnulacion = false;
						var MotivoDeAnulacion = '';
						var ObservacionDeAnulacion = '';
						var fechaAnulacion = '';
						var vieneDeTramitacion = false;
						var vieneDeObservacion = false;
						var comentObserCoord = "";
						var nameLegacyObservator = "";
						var vieneDeCoordinacion = false;
						var vieneDeCancelacion = true;
						var nameLegacyCoordinator = this.getLastCoordinator();
						var nameLegacyTramitador = oLicense.Tramitador;
						var MotivoObservacion = "";
						var ComentarioObservacion = "";
						var MotivoNoAut = "";
						var ComentariosNoAut = "";

						MailHelper.sendEmail(oLicense, usuariosAsignados, stringEmails, sEmailEt, sInfAdicional, esAnulacion, MotivoDeAnulacion,
							ObservacionDeAnulacion, fechaAnulacion, vieneDeTramitacion, vieneDeObservacion, comentObserCoord, nameLegacyObservator,
							vieneDeCoordinacion, vieneDeCancelacion, nameLegacyCoordinator, nameLegacyTramitador, MotivoObservacion,
							ComentarioObservacion, MotivoNoAut, ComentariosNoAut
						).then(() => {
							BusyDialogHelper.close();
							var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
							var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
							MessageBoxHelper.showAlert(
								"Alert",
								"Se ha realizado la cancelación definitiva de manera exitosa",
								$.proxy(this.FIND, this, license)
							);
						}).catch((e) => {
							console.error(e);
							MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail.", $.proxy(this.goToHome, this));
						});
					}).catch((e) => {
						BusyDialogHelper.close();
						console.error(e);
						MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear guardia");
					});

				}).catch((e) => {
					BusyDialogHelper.close();
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear la cancelacion definitiva.");
				});

			}).catch((e) => {
				BusyDialogHelper.close();
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear guardia");
			});
		},

		errorPUTLicenceCancelacion: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha producido un error al modificar la licencia para la cancelación definitiva");
		},

		postCancelacionDefinitiva: function (oCancelacionDef) {
			return new Promise((resolve, reject) => {
				let oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();

				let oDate = oCancelacionDef.Datelicencia;
				oDate.setHours(oCancelacionDef.Time.getHours());
				oDate.setMinutes(oCancelacionDef.Time.getMinutes());

				// format time:
				let oFormatTime = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "PThh'H'mm'M'ss'S'"
				});

				let oEntry = {
					Empresa: oLicense.Empresa,
					Id: oLicense.Id,
					Tipo: oLicense.Tipo,
					Anio: oLicense.Anio,
					CancFecha: oDate,
					CancHora: oFormatTime.format(oCancelacionDef.Time),
					CotCotdt: AppManagementHelper.getUserLegacy().Legajo,
					JefeTrab: oCancelacionDef.Tejt,
					Tecet: oCancelacionDef.TecET
				};

				oDataService.getModel("TransenerOperaciones").create("/CancelacionDefinitivaSet", oEntry, {
					success: resolve,
					error: reject,
					async: true
				});
			});
		},

		devolutionLicence: function (oDevolution) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			this.statGuardBook = "D";
			// Antes era 11 y 28, con el ticket 66 el 28 pasa a ser 01 (autorizada) de nuevo.
			licenseClone.Licstat = "01";
			// Si se finaliza como continua finaliza literal, sinó pasa de nuevo a entregada para que se repita el ciclo.
			licenseClone.Substatus = "";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceDevolution, this, oDevolution),
				error: $.proxy(this.errorPUTLicenceDevolution, this)
			});
		},

		successPUTLicenceDevolution: function (oDevolution) {
			// TODO: sacar esto para issue 513
			// delete oDevolution.TecET;

			var entity = "/DevolucionLicenciaSet";
			oDevolution.Datelicencia = FormatHelper.getUTCdate(oDevolution.Datelicencia);
			oDataService.getModel("TransenerOperaciones").create(entity, oDevolution, {
				success: $.proxy(this.successPOSTDevolution, this),
				error: $.proxy(this.errorPOSTDevolution, this)
			});
		},

		successPOSTDevolution: function (data) {
			//GUARDAR EL FECHA Y HORA DE LA ENTREGA SUSPENCION Y REANUDACION. DEVOLUCION
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var fechaRepresentante = FormatHelper.formatDatesGMT(data.Datelicencia)
			fechaRepresentante.setHours(data.Time.getHours())
			fechaRepresentante.setMinutes(data.Time.getMinutes())
			console.log(fechaRepresentante);
			var oLibroGuardia = {
				"Fechahora": fechaRepresentante,
				"Equipo": oLicense.Equnr,
				"Lugar": oLicense.Tplnr,
				"Novedad": `Numero de licencia ${oLicense.Id}, Trabajo a realizar: ${oLicense.Descripcion}`,
				"Tiponovedad": FormatterHelper.getNovedadType(this.statGuardBook),
				"Empresa": oLicense.Empresa
			};
			LibroGuardiasService.POSTLibroGuardia(oLibroGuardia).then(() => {
				BusyDialogHelper.close();
				var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
				var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
				MessageBoxHelper.showAlert("Alert", "Se ha realizado la devolución de manera exitosa", $.proxy(this.FIND, this, license));
			}).catch((e) => {
				console.error(e);
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear guardia")
			})
		},

		errorPOSTDevolution: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha producido un error al crear el registro de devolucion");
		},

		errorPUTLicenceDevolution: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha producido un error al modificar la licencia para la devolucion");
		},

		transferLicence: function (oTransfer) {
			// #513 -> "Que la Transferencia no pise el jefe titular."
			//
			// var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			// var licenseClone = LicenceHelper.cloneLicense(oLicence);
			// licenseClone.Jefe = oTransfer.Jefetra;
			// this.updateLicense(licenseClone, {
			// 	success: $.proxy(this.successPUTLicenceTransfer, this, oTransfer),
			// 	error: $.proxy(this.errorPUTLicenceTransfer, this)
			// });
			//
			this.successPUTLicenceTransfer(oTransfer);
		},

		successPUTLicenceTransfer: function (oTransfer) {
			var entity = "/TransferenciaJefeTrabajoSet";
			oDataService.getModel("TransenerOperaciones").create(entity, oTransfer, {
				success: $.proxy(this.successPOSTTransfer, this),
				error: $.proxy(this.errorPOSTTransfer, this)
			});

		},

		successPOSTTransfer: function (data) {
			var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
			var sCurrentUserMail = oUserJson.email;
			var sCurrentUserName = oUserJson.nombre + ", " + oUserJson.apellido;
			var oDataLicencia = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var sLicenseId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
			var sAnio = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio")
			var aPromises = [];
			var oPromiseJT = this.PostPromesa(sAnio, "L", sLicenseId, oDataLicencia.Jefe, FormatterHelper.getJefeName(oDataLicencia.Jefe),
				"", oDataLicencia.Empresa, "Jefe_Trabajo");
			aPromises.push(oPromiseJT);
			Promise.all(aPromises).then(() => {
				BusyDialogHelper.close();
				var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
				var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
				MessageBoxHelper.showAlert("Alert", "Se ha transferido al jefe de trabajo de manera exitosa", $.proxy(this.FIND, this, license));
			}).catch((e) => {
				console.error(e);
				MessageBoxHelper.showAlert("Alert", "Error al transferir al jefe de trabajo", $.proxy(this.goToHome, this));
				BusyDialogHelper.close();
			})

		},

		errorPOSTTransfer: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha producido un error al realizar el registro de transferencia");
		},

		errorPUTLicenceTransfer: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha producido un error al realizar la modificacion para la transferencia");
		},

		// proceso de coordinacion de licencia 
		// primero se hace un post a coordinacion 
		// luego se hace un put a la entidad licencias de trabajo
		// licstat 09 = generada
		// licstat 07 coordinada

		HabilitacionLicence: function (oHabilitacion) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			//licenseClone.Licstat = "07";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceHab, this, oHabilitacion, licenseClone),
				error: $.proxy(this.errorPUTLicenceHab, this)
			});
		},
		successPUTLicenceHab: function (oHabilitacion, licenseClone) {
			var entity = "/HabilitacionRecierreSet";
			oHabilitacion.Datehab = FormatHelper.getUTCdate(oHabilitacion.Datehab);
			oDataService.getModel("TransenerOperaciones").create(entity, oHabilitacion, {
				success: $.proxy(this.successPOSTHabilitacion, this, oHabilitacion, licenseClone),
				error: $.proxy(this.errorPOSTHabilitacion, this)
			});
		},
		successPOSTHabilitacion: function (data) {
			BusyDialogHelper.close();
			var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
			MessageBoxHelper.showAlert("Alerta", "Se ha realizado la habilitación de manera correcta", $.proxy(this.FIND, this, license));
		},

		errorPOSTHabilitacion: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear el registro de habilitación");
		},
		InhibicionLicence: function (oInhibicion) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			//	licenseClone.Licstat = "07";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceInhib, this, oInhibicion, licenseClone),
				error: $.proxy(this.errorPUTLicenceHab, this)
			});
		},
		successPUTLicenceInhib: function (oInhibicion, licenseClone) {
			var entity = "/InhibicionRecierreSet";
			oInhibicion.Datehab = FormatHelper.getUTCdate(oInhibicion.Datehab);
			oDataService.getModel("TransenerOperaciones").create(entity, oInhibicion, {
				success: $.proxy(this.successPOSTInhibicion, this, oInhibicion, licenseClone),
				error: $.proxy(this.errorPOSTInhibicion, this)
			});
		},
		successPOSTInhibicion: function (data) {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			BusyDialogHelper.close();
			var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
			var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
			MessageBoxHelper.showAlert("Alerta", "Se ha realizado la colocacion de manera correcta", $.proxy(this.FIND, this, license));

		},

		errorPOSTInhibicion: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear el registro de colocacion");
		},

		ColocacionPATLicence: function (oColocacionPAT) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			//licenseClone.Licstat = "07";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceColocacionPAT, this, oColocacionPAT, licenseClone),
				error: $.proxy(this.errorPUTLicenceColocacionPAT, this)
			});
		},
		successPUTLicenceColocacionPAT: function (oColocacionPAT, licenseClone) {
			var entity = "/ColocacionPATSet";
			oColocacionPAT.Datehab = FormatHelper.getUTCdate(oColocacionPAT.Datehab);
			oDataService.getModel("TransenerOperaciones").create(entity, oColocacionPAT, {
				success: $.proxy(this.successPOSTColocacionPAT, this, oColocacionPAT, licenseClone),
				error: $.proxy(this.errorPOSTColocacionPAT, this)
			});
		},
		successPOSTColocacionPAT: function (data) {
			BusyDialogHelper.close();
			var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
			MessageBoxHelper.showAlert("Alerta", "Se ha realizado la colocacion de manera correcta", $.proxy(this.FIND, this, license));

		},

		errorPOSTColocacionPAT: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear el registro de colocacion");
		},

		RetiroPATLicence: function (oRetiroPAT) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			//licenseClone.Licstat = "07";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceRetiroPAT, this, oRetiroPAT, licenseClone),
				error: $.proxy(this.errorPUTLicenceRetiroPAT, this)
			});
		},
		successPUTLicenceRetiroPAT: function (oRetiroPAT, licenseClone) {
			var entity = "/RetiroPATSet";
			oRetiroPAT.Datehab = FormatHelper.getUTCdate(oRetiroPAT.Datehab);
			oDataService.getModel("TransenerOperaciones").create(entity, oRetiroPAT, {
				success: $.proxy(this.successPOSTRetiroPAT, this, oRetiroPAT, licenseClone),
				error: $.proxy(this.errorPOSTRetiroPAT, this)
			});
		},
		successPOSTRetiroPAT: function (data) {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			BusyDialogHelper.close();
			var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
			var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
			MessageBoxHelper.showAlert("Alerta", "Se ha realizado el Retiro de manera correcta", $.proxy(this.FIND, this, license));

		},

		errorPOSTRetiroPAT: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear el registro de retiro");
		},
		coordinateLicence: function (oCoordination) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			licenseClone.Licstat = "07";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceCoord, this, oCoordination, licenseClone),
				error: $.proxy(this.errorPUTLicenceCoord, this)
			});
		},
		successPUTLicenceCoord: function (oCoordination, licenseClone) {
			var entity = "/CoordinacionesLicenciaSet";
			oDataService.getModel("TransenerOperaciones").create(entity, oCoordination, {
				success: $.proxy(this.successPOSTCoordination, this, oCoordination, licenseClone),
				error: $.proxy(this.errorPOSTCoordination, this)
			});
		},

		getSolicitantesEmails: function (aPermisos) {
			var aEmailsSolic = [];
			var oSolicitante = aPermisos.find(e => e.Rol === "ope_solic-lic_transener")
			if (oSolicitante)
				aEmailsSolic.push(oSolicitante.Mail);
			var oSolicitanteSup = aPermisos.find(e => e.Rol === "Solicitante_Suplente")
			if (oSolicitanteSup)
				aEmailsSolic.push(oSolicitanteSup.Mail);
			var oSolicitanteSupAux = aPermisos.find(e => e.Rol === "Solicitante_Suplente_Auxiliar")
			if (oSolicitanteSupAux)
				aEmailsSolic.push(oSolicitanteSupAux.Mail);
			return aEmailsSolic;
		},

		successPOSTCoordination: function (oCoordination, licenseClone) {
			var oLicence = licenseClone;
			this.getPermisos(oLicence).then((aPermisos) => {
				var {
					Anio,
					Id,
					Empresa,
					Tipo
				} = oLicence;

				var aEmails = [];

				var oCreador = aPermisos.find(oPermiso => {
					return oPermiso.Rol === "Creador";
				});

				var hashPermisos = {};
				aPermisos.forEach(permiso => {
					hashPermisos[permiso.Rol] = permiso
				});

				if (Tipo === "L") {
					aEmails = [hashPermisos["Creador"], hashPermisos["ope_solic-lic_transener"], hashPermisos["Solicitante_Suplente"], hashPermisos[
						"Jefe_Trabajo"], hashPermisos["Jefe_Trabajo_Suplente"], hashPermisos["Solicitante_Suplente_Auxiliar"]].map(permiso => permiso &&
							permiso.Mail || "juan.marone@transener.com.ar");
				} else {
					aEmails = [hashPermisos["Creador"], hashPermisos["ope_solic-lic_transener"]].map(permiso => permiso && permiso.Mail ||
						"juan.marone@transener.com.ar");
				}

				var sEmails = aEmails.join(",");
				var sInfAdicional = oCoordination.Coordination;
				var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
				var sCurrentUserMail = oUserJson.email;
				var sCurrentUserName = oUserJson.nombre + ", " + oUserJson.apellido;
				var oCurrentUser = AppManagementHelper.getModel("CurrentUser").getData();
				var oUsuariosAsignados = {
					Coordinador: oCurrentUser.Legajo + ", " + sCurrentUserName,
					Creador: oCreador.Legajo + ", " + oCreador.Nombre
				};
				oUsuariosAsignados.Solicitante = hashPermisos["ope_solic-lic_transener"].Legajo + ", " + hashPermisos["ope_solic-lic_transener"].Nombre;
				oUsuariosAsignados.SolicitanteSuplente = hashPermisos["Solicitante_Suplente"].Legajo + ", " + hashPermisos["Solicitante_Suplente"]
					.Nombre;
				oUsuariosAsignados.Jefe = hashPermisos["Jefe_Trabajo"].Legajo + ", " + hashPermisos["Jefe_Trabajo"].Nombre;
				oUsuariosAsignados.JefeSuplente = hashPermisos["Jefe_Trabajo_Suplente"].Legajo + ", " + hashPermisos["Jefe_Trabajo_Suplente"].Nombre;
				oUsuariosAsignados.SolSuplenteAux = hashPermisos["Solicitante_Suplente_Auxiliar"].Legajo + ", " + hashPermisos[
					"Solicitante_Suplente_Auxiliar"].Nombre;

				var aPromises = [];
				aPromises.push(EtMailService.getPromise(Empresa, oLicence.Tplnr));
				Promise.all(aPromises).then((responses) => {
					var sType = oLicence.Tipo === "S" ? "Solicitud" : "Licencia";
					let sEmailEt = responses[0].results && responses[0].results !== 0 ? responses[0].results.map(e => (e.Mail)).join(",") : "";
					var esAnulacion = false;
					var MotivoDeAnulacion = '';
					var ObservacionDeAnulacion = '';
					var fechaAnulacion = '';
					var vieneDeTramitacion = false;
					var vieneDeObservacion = false;
					var comentObserCoord = "";
					var nameLegacyObservator = "";
					var vieneDeCoordinacion = true;
					var vieneDeCancelacion = false;
					var nameLegacyCoordinator = oCoordination.Coouser;
					var nameLegacyTramitador = "";
					var MotivoObservacion = "";
					var ComentarioObservacion = "";
					var MotivoNoAut = "";
					var ComentariosNoAut = "";

					// #581 LT - cambiar destinatarios de mail en SOLICITUDES Coordinadas 
					if (Tipo !== "L" && responses[0].results) {
						var aCoordinadores = responses[0].results.filter(e => e.Area === "COORD");
						if (aCoordinadores.length)
							aEmails.push(...aCoordinadores.map(e => e.Mail));
					}

					MailHelper.sendEmail(oLicence, oUsuariosAsignados, sEmails, sEmailEt, sInfAdicional, esAnulacion,
						MotivoDeAnulacion,
						ObservacionDeAnulacion, fechaAnulacion, vieneDeTramitacion, vieneDeObservacion, comentObserCoord, nameLegacyObservator,
						vieneDeCoordinacion, vieneDeCancelacion, nameLegacyCoordinator, nameLegacyTramitador,
						MotivoObservacion,
						ComentarioObservacion,
						MotivoNoAut,
						ComentariosNoAut
					).then(() => {
						BusyDialogHelper.close();
						var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
						var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
						MessageBoxHelper.showAlert("Alert", "Se ha coordinado la " + sType + " de manera correcta", $.proxy(this.handleCoordinationSuccess,
							this,
							license));
					}).catch((e) => {
						console.error(e);
						MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail para la coordinacion.", $.proxy(this.goToHome,
							this));
					});
				}).catch((e) => {
					console.error(e);
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail para la coordinacion.", $.proxy(
						this.goToHome,
						this));
				})
			}).catch((e) => {
				console.error(e);
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al obtener permisos", $.proxy(this.goToHome, this));
			})
		},

		handleCoordinationSuccess: function (license) {
			this.FIND(license);
			var aRoles = AppManagementHelper.getModel("UserJsonModel").getData().roles
			var bCoordinateRole = aRoles.find((sRole) => {
				return sRole === "Supervisor_Mantenimiento";
			})
			if (bCoordinateRole) {
				AppManagementHelper.getAppRouter().navTo("Licencias");
			}
		},

		errorPOSTCoordination: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alert", "Se ha producido un error al agregar coordinacion");
		},

		errorPUTLicenceCoord: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al modificar esta licencia");
		},

		successPUTLicence: function () {
			BusyDialogHelper.close();
			var sIdInterno = AppManagementHelper.getModel("LicenceJsonModel").getProperty("/Id");
			MessageBoxHelper.showAlert("Alerta", "Licencia Coordinada con Exito", $.proxy(this.FIND, this, sIdInterno));
		},
		// fin del proceso de coordinacion

		// inicio proceso de coordinacion masiva
		/*handleMassiveCoordination: function () {
			this.aItems = AppManagementHelper.getModel("ItemsJsonModel").getData().Items;
			this.oCoordination = AppManagementHelper.getModel("CoordinacionModel").getData();
			this.successPutLicences = [];
			this.errorPutLicences = [];
			this.errorPOSTCoordinations = [];
			this.successPOSTCoordinations = [];
			this.handleRecursiveMassiveCoordination();
		},*/

		handleUploadFile: function (aFiles) {
			this.aSuccessFiles = [];
			this.aErrorFiles = [];
			this.aFilesToUpload = aFiles
			this.uploadRecursiveFiles();
		},

		removeSelectedFile: function (sAttindex, sId, empresa, Anio) {
			// Se pasa la data de cada Documento
			//TODO preguntar a demian si está implementado el delete para esta entidad /AttachmentLicenciasSet
			// en el caso de que no esté implementado el tiene que agregarlo.
			// que te deje hacer la eliminacion con los campos clave de dicha tentidad
			//<PropertyRef Name="Anio"/><PropertyRef Name="Empresa"/><PropertyRef Name="Id"/><PropertyRef Name="Attindex"/>
			// /AttachmentLicenciasSet(Anio='2020',Empresa='100',Id="12121212",AttIndex="123123")
			// oDataservice.remove("/AttachmentLicenciasSet(Anio='2020',Empresa='100',Id="12121212",AttIndex="123123")", { success: () => {}, error: () => {}})

			return new Promise((resolve, reject) => {
				var entity = "/AttachmentLicenciasSet(Id='" + sId + "',Attindex='" + sAttindex + "',Empresa='" + empresa + "',Anio='" + Anio +
					"')";
				//var sEntity = `/AttachmentLicenciasSet(Id='${sId} bla bla bla bla`;
				oDataService.getModel("TransenerOperaciones").remove(entity, {
					success: function (data) {
						resolve(data);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},

		uploadFilePromise: function (oPayload) {
			return new Promise((resolve, reject) => {
				let entity = "/AttachmentLicenciasSet";
				oDataService.getModel("TransenerOperaciones").create(entity, oPayload, {
					success: function (data) {
						resolve();
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},

		findFilePromise: function (sAttindex, sId, empresa, Anio) { //Obtiene el archivo para descargar

			return new Promise((resolve, reject) => {
				var entity = "/AttachmentLicenciasSet(Id='" + sId + "',Attindex='" + sAttindex + "',Empresa='" + empresa + "',Anio='" + Anio +
					"')";
				oDataService.getModel("TransenerOperaciones").read(entity, {
					success: function (data) {
						resolve(data);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},

		diaryPartReport: function (solbeg, Empresa) {
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("Solbeg", sap.ui.model.FilterOperator.LE, solbeg));
			aFilters.push(new sap.ui.model.Filter("Solend", sap.ui.model.FilterOperator.GE, solbeg));
			aFilters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, Empresa));
			return new Promise((resolve, reject) => {
				var entity = "/ReporteLTAutorizadasSet";
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: aFilters,
					success: function (data) {
						resolve(data.results);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},

		//TODO revisar, pero ya no se usa
		GETTramitaciones: function (empresa) {
			var aFilters = [];

			aFilters.push(new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, empresa));

			var entity = "/CatalogoTramitacionSet";
			oDataService.getModel("TransenerOperaciones").read(entity, {
				filters: aFilters,
				success: function (data) {
					var oModel = AppManagementHelper.getModel("TramitacionesCatalogoJsonModel")
					oModel.setData({
						Tramitaciones: data.results
					})
				},
				error: function (error) {
					console.log(error);
				}
			});
		},

		getPuestoTrabajo: function (Region) {
			return new Promise((resolve, reject) => {
				if (Region) {
					let aFilters = [new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, Region)]
					oDataService.getModel("TransenerOperaciones").read("/PuestoTrabajoSet", {
						filters: aFilters,
						success: function (data) {
							resolve(data.results);
						},
						error: function (error) {
							reject();
						}
					});
				} else {
					resolve([]);
				}
			})
		},
		getPuestosTrabajo: function (empresa) {
			return new Promise((resolve, reject) => {
				let aValues = []; // Definir la variable aValues fuera de los bloques condicionales

				// Asignar valores según la empresa
				if (empresa === "100") {
					aValues = ["103", "102", "104", "105"];
				} else if (empresa === "300") {
					aValues = ["111", "112", "113", "114", "115", "116"];
				} else {
					resolve([]); // Si no es '100' ni '300', devolver un array vacío
					return; // Salir de la función
				}

				let aPromises = []; // Array para almacenar todas las promesas

				// Iterar por cada valor y crear una solicitud OData independiente
				aValues.forEach(value => {
					aPromises.push(new Promise((res, rej) => {
						oDataService.getModel("TransenerOperaciones").read("/PuestoTrabajoSet", {
							filters: [new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, value)],
							success: function (data) {
								res(data.results); // Resolver con los resultados
							},
							error: function (error) {
								rej(error); // Rechazar si hay error
							}
						});
					}));
				});

				// Ejecutar todas las promesas y combinar resultados
				Promise.all(aPromises)
					.then(results => {
						// Combinar los arrays de resultados
						let aCombinedResults = results.flat();
						resolve(aCombinedResults); // Resolver con los resultados combinados
					})
					.catch(error => {
						reject(error); // Rechazar si alguna solicitud falla
					});
			});
		}
		,


		findLicenseFile: function (sDocumentId, sId, empresa, Anio) {
			this.findFilePromise(sDocumentId, sId, empresa, Anio).then($.proxy(this.successFindFile, this)).catch($.proxy(this.errorFindFile,
				this));
		},

		successFindFile: function (data) {
			var binary = atob(data.Attachment);
			FileDownloadHelper.saveBinaryFile(binary, data.Doctype, data.Filename);
		},

		errorFindFile: function (error) {

		},

		uploadRecursiveFiles: function () {
			if (this.aFilesToUpload.length !== 0) {
				var oFile = this.aFilesToUpload.shift();
				var oPayload = {
					Anio: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio"),
					Doctype: oFile.type,
					Id: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id"),
					Empresa: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Empresa"),
					Attindex: "",
					Filename: oFile.name
				}
				var reader = new FileReader();
				reader.onloadend = () => {
					oPayload.Attachment = btoa(reader.result);
					this.uploadFilePromise(oPayload).then($.proxy(this.successUploadDocument, this)).catch($.proxy(this.errorUploadDocument, this))
				}
				reader.readAsBinaryString(oFile);
			} else {
				var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
				var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
				var iSuccess = this.aSuccessFiles.length;
				var iError = this.aErrorFiles.length;

				var commentsTEMPmodel = AppManagementHelper.getModel("commentsTEMP");
				commentsTEMPmodel.setData({
					Comments: license.Comments,
					Tdtcomments: license.Tdtcomments,
					Prgcomments: license.Prgcomments
				});

				MessageBoxHelper.showAlert("Alerta", "Archivos subidos de manera exitosa: " + iSuccess + "\n" + "Archivos con error: " + iError, $
					.proxy(
						this.FIND, this, license));

			}
		},

		successUploadDocument: function () {
			this.aSuccessFiles.push({});
			this.uploadRecursiveFiles();
		},

		errorUploadDocument: function (error) {
			console.log(error);
			this.aErrorFiles.push({});
			this.uploadRecursiveFiles();
		},

		observateLicence: function (oObservation) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			licenseClone.Licstat = "02";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceObs, this, oObservation, licenseClone),
				error: $.proxy(this.errorPUTLicenceObs, this)
			});
		},

		successPUTLicenceObs: function (oObservation, licenseClone) {
			var entity = "/ObservacionesLicenciaSet";
			oDataService.getModel("TransenerOperaciones").create(entity, oObservation, {
				success: $.proxy(this.successPOSTObservation, this, oObservation, licenseClone),
				error: $.proxy(this.errorPOSTObservation, this)
			});
		},

		successPOSTObservation: function (observation, licenseClone) {
			var licencia = licenseClone;
			let promises = [this.getPermisos(licencia)];
			var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
			var currentEmail = oUserJson.email;
			var currentName = oUserJson.nombre + ", " + oUserJson.apellido;
			var currentUser = AppManagementHelper.getModel("CurrentUser").getData();
			var licenseId = licencia.Id;
			var sAnio = licencia.Anio;

			promises.push(this.PostPromesa(sAnio, "L", licenseId, currentUser.Legajo, currentName, currentEmail, currentUser.Empresa,
				"COORDINADOR"));
			promises.push(EtMailService.getPromise(licencia.Empresa, licencia.Tplnr, this.getSelectionArea(licencia.Tipo, "02")));

			Promise.all(promises).then(res => {
				let emails = [];
				let hashPermisos = {};
				let permisos = res[0];
				permisos.forEach(permiso => {
					hashPermisos[permiso.Rol] = permiso;
				});

				//soolo para saber el coordinó del template
				var nameLegacyObservator = "";
				if (res[1].Legajo) {
					var aPersonalTodo = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Todos;
					var oPersonal = aPersonalTodo.find(e => e.Legajo === res[1].Legajo);
					if (oPersonal) {
						nameLegacyObservator = `${oPersonal.Legajo} - ${oPersonal.Nombre} `
					}
				}

				var sEmailEt = "";
				if (licencia.Tipo === "S") {
					emails = [hashPermisos["Creador"], hashPermisos["ope_solic-lic_transener"]].map(permiso => permiso && permiso.Mail ||
						"juan.marone@transener.com.ar");
					sEmailEt = "";
				} else {
					emails = [hashPermisos["Creador"], hashPermisos["ope_solic-lic_transener"], hashPermisos["Solicitante_Suplente"], hashPermisos["Jefe_Trabajo"],
					hashPermisos["Jefe_Trabajo_Suplente"], hashPermisos["Solicitante_Suplente_Auxiliar"]
					].map(permiso => permiso && permiso.Mail || "juan.marone@transener.com.ar");
					sEmailEt = res[2].results && res[2].results !== 0 ? res[2].results.map(e => (e.Mail)).join(",") : "";
				}

				let usuariosAsignados = {
					Coordinador: currentUser.Legajo + ", " + currentName,
					Creador: hashPermisos["Creador"] ? hashPermisos["Creador"].Legajo + ", " + hashPermisos["Creador"].Nombre : "",
					Solicitante: hashPermisos["ope_solic-lic_transener"] ? hashPermisos["ope_solic-lic_transener"].Legajo + ", " + hashPermisos["ope_solic-lic_transener"].Nombre : "",
					SolicitanteSuplente: hashPermisos["Solicitante_Suplente"] ? hashPermisos["Solicitante_Suplente"].Legajo + ", " + hashPermisos[
						"Solicitante_Suplente"].Nombre : "",
					Jefe: hashPermisos["Jefe_Trabajo"] ? hashPermisos["Jefe_Trabajo"].Legajo + ", " + hashPermisos["Jefe_Trabajo"].Nombre : "",
					JefeSuplente: hashPermisos["Jefe_Trabajo_Suplente"] ? hashPermisos["Jefe_Trabajo_Suplente"].Legajo + ", " + hashPermisos[
						"Jefe_Trabajo_Suplente"].Nombre : "",
					SolSuplenteAux: hashPermisos["Solicitante_Suplente_Auxiliar"].Legajo + ", " + hashPermisos["Solicitante_Suplente_Auxiliar"].Nombre
				};

				if (observation) {
					if (observation.Observation) {
						var comentarioObservacion = ' / Comentario: ' + observation.Observation;
					} else {
						var comentarioObservacion = '';
					}
					if (observation.Obscause) {
						if (observation.Obscause === 'MSEG') {
							var formattedMotivo = 'Modificación de medidas de seguridad';
						} else if (observation.Obscause === 'FECH') {
							var formattedMotivo = 'Modificación de las fechas y horarios'
						} else if (observation.Obscause === 'CAMP') {
							var formattedMotivo = 'Modificación de otros campos';
						} else {
							var formattedMotivo = observation.Obscause;
						}
						var motivoObservacion = 'Motivo: ' + formattedMotivo;
					} else {
						var motivoObservacion = '';
					}
					var infAdicional = motivoObservacion + comentarioObservacion;
				} else {
					var infAdicional = '';
				}
				let stringEmails = emails.join(",");

				var esAnulacion = false;
				var MotivoDeAnulacion = '';
				var ObservacionDeAnulacion = '';
				var fechaAnulacion = '';
				var vieneDeTramitacion = false;
				var vieneDeObservacion = true;
				var comentObserCoord = observation.Observation;
				var nameLegacyObservator = observation.Obsuser;
				var vieneDeCoordinacion = false;
				var vieneDeCancelacion = false;
				var nameLegacyCoordinator = "";
				var nameLegacyTramitador = "";
				var MotivoObservacion = formattedMotivo;
				var ComentarioObservacion = "";
				var MotivoNoAut = "";
				var ComentariosNoAut = "";

				MailHelper.sendEmail(licencia, usuariosAsignados, stringEmails, sEmailEt, infAdicional, esAnulacion, MotivoDeAnulacion,
					ObservacionDeAnulacion, fechaAnulacion, vieneDeTramitacion, vieneDeObservacion, comentObserCoord, nameLegacyObservator,
					vieneDeCoordinacion, vieneDeCancelacion, nameLegacyCoordinator, nameLegacyTramitador, MotivoObservacion,
					ComentarioObservacion, MotivoNoAut, ComentariosNoAut).then(() => {
						var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
						var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
						var stipo = license.Tipo === "S" ? "Solicitud" : "Licencia";
						MessageBoxHelper.showAlert("Alerta", "Se ha observado la " + stipo + " de manera correcta", $.proxy(this.handleSuccesObservation,
							this));
					}).catch((e) => {
						console.error(e);
						MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail.", $.proxy(this.goToHome, this));
					});
			}, (err) => {
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail.", $.proxy(this.goToHome, this));
			});
		},

		handleSuccesObservation: function () {
			this.goToHome();
		},

		errorPOSTObservation: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al observar esta licencia");
		},

		errorPUTLicenceObs: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al modificar esta licencia para la observacion");
		},

		// fin observado de licencia
		annulateLicense: function (oAnulatePayload) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			this.sMessageAnnulate = oLicence.Tipo === "S" ? `Se ha anulado la solicitud de manera exitosa` :
				`Se ha anulado la licencia de manera exitosa`;
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			licenseClone.Licstat = "03";
			licenseClone.Anulador = AppManagementHelper.getStringUserLegacy();
			licenseClone.Causaanulado = oAnulatePayload.Causaanulado;
			oAnulatePayload.Anulador = AppManagementHelper.getStringUserLegacy();
			licenseClone.Obscausa = oAnulatePayload.Obscausa;
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenseAnnul, this, oAnulatePayload, licenseClone),
				error: $.proxy(this.errorPUTLicenseAnnul, this)
			});
		},

		errorPUTLicenseAnnul: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al modificar esta licencia para la anulación");
		},

		successPUTLicenseAnnul: function (oAnulatePayload, licenseClone) {
			this.successPOSTAnnul(oAnulatePayload, licenseClone);
		},

		successPOSTAnnul: function (oAnulatePayload, licenseClone) {
			var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
			var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
			license.Licstat = licenseClone.Licstat;
			license.Anulador = licenseClone.Anulador;

			let promises = [];
			promises.push(this.getPermisos(license));
			promises.push(EtMailService.getPromise(license.Empresa, license.Tplnr));
			Promise.all(promises).then(res => {
				let sEmailEt = res[1].results && res[1].results !== 0 ? res[1].results.map(e => (e.Mail)).join(",") : "";
				let permisos = res[0];
				let hashPermisos = {};
				permisos.forEach(permiso => {
					hashPermisos[permiso.Rol] = permiso;
				});
				let causaAnulado = FormatterHelper.getMotivoAnulDesc(license.Causaanulado);
				let infAdicional = causaAnulado + "\n" + license.Obscausa;
				let stringEmails = "";

				stringEmails = [hashPermisos["Creador"], hashPermisos["ope_solic-lic_transener"]].map(permiso => permiso && permiso.Mail ||
					"juan.marone@transener.com.ar").join(",");

				var usuariosAsignados = {
					Coordinador: hashPermisos["COORDINADOR"] ? hashPermisos["COORDINADOR"].Legajo + ", " + hashPermisos["COORDINADOR"].Nombre : "",
					Creador: hashPermisos["Creador"] ? hashPermisos["Creador"].Legajo + ", " + hashPermisos["Creador"].Nombre : "",
					Solicitante: hashPermisos["ope_solic-lic_transener"].Legajo + ", " + hashPermisos["ope_solic-lic_transener"].Nombre,
					SolicitanteSuplente: hashPermisos["Solicitante_Suplente"].Legajo + ", " + hashPermisos["Solicitante_Suplente"].Nombre,
					Jefe: hashPermisos["Jefe_Trabajo"].Legajo + ", " + hashPermisos["Jefe_Trabajo"].Nombre,
					JefeSuplente: hashPermisos["Jefe_Trabajo_Suplente"].Legajo + ", " + hashPermisos["Jefe_Trabajo_Suplente"].Nombre,
					SolSuplenteAux: hashPermisos["Solicitante_Suplente_Auxiliar"].Legajo + ", " + hashPermisos["Solicitante_Suplente_Auxiliar"].Nombre
				};
				var esAnulacion = true;
				var MotivoDeAnulacion = oAnulatePayload.Obscausa;
				var ObservacionDeAnulacion = FormatterHelper.getMotivoAnulacionText(oAnulatePayload.Causaanulado);
				var fechaAnulacion = FormatHelper.formatDateLicenseWithoutUtc(new Date());
				var vieneDeTramitacion = false;
				var vieneDeObservacion = false;
				var comentObserCoord = "";
				var nameLegacyObservator = "";
				var vieneDeCoordinacion = false;
				var vieneDeCancelacion = false;
				var nameLegacyCoordinator = this.getLastCoordinator();
				var nameLegacyTramitador = license.Tramitador;
				var MotivoObservacion = "";
				var ComentarioObservacion = "";
				var MotivoNoAut = "";
				var ComentariosNoAut = "";

				MailHelper.sendEmail(license, usuariosAsignados, stringEmails, sEmailEt, infAdicional, esAnulacion, MotivoDeAnulacion,
					ObservacionDeAnulacion, fechaAnulacion, vieneDeTramitacion, vieneDeObservacion, comentObserCoord, nameLegacyObservator,
					vieneDeCoordinacion, vieneDeCancelacion, nameLegacyCoordinator, nameLegacyTramitador, MotivoObservacion,
					ComentarioObservacion, MotivoNoAut, ComentariosNoAut).then(() => {
						BusyDialogHelper.close();
						MessageBoxHelper.showAlert("Alerta", this.sMessageAnnulate, $.proxy(this.goToHome, this, license));
					}, () => {
						BusyDialogHelper.close();
						MessageBoxHelper.showAlert("Alerta", "Error al enviar email al usuario", $.proxy(this.goToHome, this, license));
					});
			});
		},

		getFechaAnulacion: function () {
			var date = new Date();
			var dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			var mes = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
			var ano = date.getFullYear();
			var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
			var hora = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();

			return dia + '-' + mes + '-' + ano + ' ' + hora + ':' + min
		},

		errorPOSTAnul: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al anular esta licencia");
		},

		errorPUTLicenseAnul: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al modificar esta licencia para la anulación");
		},

		reanudateLicence: function (oReanudation) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			// si está aprobada se le agrega el en tramite, sinó anulada
			licenseClone.Licstat = "01";
			licenseClone.Substatus = "E";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceReanudation, this, oReanudation),
				error: $.proxy(this.errorPUTLicenceReanudation, this)
			});
		},

		successPUTLicenceReanudation: function (oReanudation, data) {
			var entity = "/ReanudacionLicenciaSet";
			oDataService.getModel("TransenerOperaciones").create(entity, oReanudation, {
				success: $.proxy(this.successPOSTReanudation, this),
				error: $.proxy(this.errorPOSTTReanudation, this)
			});
		},

		successPOSTReanudation: function (data) {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var fechaRepresentante = FormatHelper.formatDatesGMT(data.Datelicencia)
			fechaRepresentante.setHours(data.Time.getHours())
			fechaRepresentante.setMinutes(data.Time.getMinutes())
			console.log(fechaRepresentante);
			var oLibroGuardia = {
				"Fechahora": fechaRepresentante,
				"Equipo": oLicense.Equnr,
				"Lugar": oLicense.Tplnr,
				"Novedad": `Numero de licencia ${oLicense.Id}, Trabajo a realizar: ${oLicense.Descripcion}`,
				"Tiponovedad": FormatterHelper.getNovedadType("R"),
				"Empresa": oLicense.Empresa
			};
			LibroGuardiasService.POSTLibroGuardia(oLibroGuardia).then(() => {
				BusyDialogHelper.close();
				var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
				var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
				MessageBoxHelper.showAlert("Alerta", "Se ha reanudado la licencia de manera correcta", $.proxy(this.FIND, this, license));
			}).catch((e) => {
				console.error(e);
				BusyDialogHelper.close();
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear guardia")
			})

		},

		errorPOSTTReanudation: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear el registro de reanudacion");
		},

		errorPUTLicenceReanudation: function () {
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al modificar esta licencia para la observacion");
		},
		//
		cancelTramitacion: function () {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			licenseClone.Licstat = "07";

			// Issue #519
			licenseClone.LastTramiteAvisoprog = AppManagementHelper.getStringUserLegacy();
			licenseClone.LastTramiteFecha = FormatHelper.customFormat("yyyy-MM-ddTHH:mm:ss", new Date());
			licenseClone.LastTramiteHora = FormatHelper.customFormat("PTHH'H'mm'M'ss'S'", new Date());

			this.updateLicense(licenseClone, {
				success: $.proxy(this.successCancelTramitacion, this),
				error: $.proxy(this.errorCancelTramitacion, this)
			});
		},

		successCancelTramitacion: function () {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			this.getPermisos(oLicence).then((aPermisos) => {
				let sInfAdicional = "";
				let emails = [];
				let hashPermisos = {};

				aPermisos.forEach(permiso => {
					hashPermisos[permiso.Rol] = permiso;
				});
				//MOMENTANEO
				hashPermisos["COORDINADOR"] = hashPermisos["COORDINADOR"] || "";

				emails = [hashPermisos["Creador"], hashPermisos["ope_solic-lic_transener"], hashPermisos["Solicitante_Suplente"], hashPermisos[
					"Solicitante_Suplente_Auxiliar"], hashPermisos[
				"TRAMITADOR"],
				hashPermisos["Jefe_Trabajo"], hashPermisos["Jefe_Trabajo_Suplente"], hashPermisos["COORDINADOR"]
				].map(permiso => permiso && permiso.Mail || "pgotelli@inclusion.cloud");

				//emails = "hzea@inclusion.cloud"

				var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
				var sCurrentUserMail = oUserJson.email;
				var sCurrentUserName = oUserJson.nombre + ", " + oUserJson.apellido;
				var oCurrentUser = AppManagementHelper.getModel("CurrentUser").getData()
				var sLicenseId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
				var sAnio = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio");
				var aPromises = [];
				let stringEmails = aPermisos.map(permiso => {
					hashPermisos[permiso.Rol] = permiso;
					return permiso.Mail
				}).join(",");
				var oUsuariosAsignados = {
					Coordinador: hashPermisos["COORDINADOR"] ? hashPermisos["COORDINADOR"].Legajo + ", " + hashPermisos["COORDINADOR"].Nombre : "",
					Creador: hashPermisos["Creador"] ? hashPermisos["Creador"].Legajo + ", " + hashPermisos["Creador"].Nombre : "",
					Solicitante: hashPermisos["ope_solic-lic_transener"] ? hashPermisos["ope_solic-lic_transener"].Legajo + ", " + hashPermisos["ope_solic-lic_transener"].Nombre : "",
					SolicitanteSuplente: hashPermisos["Solicitante_Suplente"] ? hashPermisos["Solicitante_Suplente"].Legajo + ", " + hashPermisos[
						"Solicitante_Suplente"].Nombre : "",
					Jefe: hashPermisos["Jefe_Trabajo"] ? hashPermisos["Jefe_Trabajo"].Legajo + ", " + hashPermisos["Jefe_Trabajo"].Nombre : "",
					JefeSuplente: hashPermisos["Jefe_Trabajo_Suplente"] ? hashPermisos["Jefe_Trabajo_Suplente"].Legajo + ", " + hashPermisos[
						"Jefe_Trabajo_Suplente"].Nombre : "",
					SolSuplenteAux: hashPermisos["Solicitante_Suplente_Auxiliar"].Legajo + ", " + hashPermisos[
						"Solicitante_Suplente_Auxiliar"].Nombre,
					Tramitador: hashPermisos["TRAMITADOR"].Legajo + ", " + hashPermisos[
						"TRAMITADOR"].Nombre,
				};
				aPromises.push(EtMailService.getPromise(oLicence.Empresa, oLicence.Tplnr));
				Promise.all(aPromises).then((res) => {
					let sEmailEt = res[0].results[0] && res[0].results[0].Mail;
					var vieneDeTramitacion = false;
					var esAnulacion = false;
					var MotivoDeAnulacion = '';
					var ObservacionDeAnulacion = '';
					var fechaAnulacion = '';
					oLicence.Licstat = '07';
					MailHelper.sendEmail(oLicence, oUsuariosAsignados, stringEmails, sEmailEt, sInfAdicional, esAnulacion, MotivoDeAnulacion,
						ObservacionDeAnulacion, fechaAnulacion, vieneDeTramitacion).then(() => {
							MessageBoxHelper.showAlert("Alerta", "Se ha cancelado la tramitación de manera exitosa", $.proxy(this.goToHome, this));
						}).catch((e) => {
							BusyDialogHelper.close();
							console.error(e);
							MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail para la coordinacion.", $.proxy(this.goToHome,
								this));
						});
				}).catch((e) => {
					BusyDialogHelper.close();
					console.error(e);
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail para la coordinacion.", $.proxy(
						this.goToHome,
						this));
				})
			}).catch((e) => {
				BusyDialogHelper.close();
				console.error(e);
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al obtener permisos", $.proxy(this.goToHome, this));
			})
		},

		errorCancelTramitacion: function () {
			MessageBoxHelper.showAlert("Alerta", "se ha producido un error al cancelar la tramitacion", $.proxy(this.goToHome, this));
		},

		tramitLicence: function (aTramites, bFinishTramitacion, bFromSelect, sStatusFromSelect) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			oLicence.Tramitador = AppManagementHelper.getStringUserLegacy();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			var EstadoGeneralSegunTramites = "";

			// Si viene de Guardar o finalizar tramitacion
			if (!bFromSelect) {
				var bValid = LicenceHelper.getIsFinish(oLicence.Licstat);
				if (bValid) {
					// Se debería aplicar SOLO si se finalizó la tramitación anteriormente
					EstadoGeneralSegunTramites = LicenceHelper.getTramitStatus(aTramites);
				}

				if (bFinishTramitacion === false) {
					// Si viene del boton "GUARDAR" la tramitacion
				} else {
					// (oTramite.Estado === "01") ? "06" : "01";
					licenseClone.Licstat = bFinishTramitacion ? LicenceHelper.getTramitStatus(aTramites) : "07";
				}
			} else {
				if (sStatusFromSelect === "TA") {
					// Autorizada
					licenseClone.Licstat = "01"
					//TN
				} else {
					// No autorizada
					licenseClone.Licstat = "06"
				}
			}

			// Si viene del boton ? "Finalizar tramitacion" : "Guardar tramitacion"
			var sMessage = bFinishTramitacion ? "Se ha realizado la tramitación de manera exitosa" :
				"Se ha guardado la tramitación de manera exitosa";
			this.stateOfTramit = licenseClone.Licstat;
			licenseClone.Tramitador = AppManagementHelper.getStringUserLegacy();

			// Issue #519
			licenseClone.LastTramiteAvisoprog = AppManagementHelper.getStringUserLegacy();
			licenseClone.LastTramiteFecha = FormatHelper.customFormat("yyyy-MM-ddTHH:mm:ss", new Date());
			licenseClone.LastTramiteHora = FormatHelper.customFormat("PTHH'H'mm'M'ss'S'", new Date());

			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceTramit, this, bFinishTramitacion, sMessage, aTramites, licenseClone),
				error: $.proxy(this.errorPUTLicenceTramit, this)
			});
		},

		successPUTLicenceTramit: function (bFinishTramitacion, sMessage, aTramites, licenseClone) {
			var aCalendarDates = aTramites.map((oTramite) => {
				return oTramite.CalendarDates;
			});

			var aTramitePromises = this.handleTramitePromises(aTramites);
			Promise.all(aTramitePromises).then((aResponses) => {
				var aPromisesCalendarPost = this.getCalendarDatesPromises(aResponses, aCalendarDates, aTramites);
				Promise.all(aPromisesCalendarPost).then(() => {
					this.successPOSTTramitacion(bFinishTramitacion, sMessage, licenseClone);
				});
			}).catch((e) => {
				console.error(e);
				BusyDialogHelper.close();
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error tramitar", $.proxy(this.goToHome, this));
			})

		},

		toggleIncludeCammesa: function () {
			BusyDialogHelper.open();
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceIncludeCammesa, this),
				error: $.proxy(this.errorPUTLicenceIncludeCammesa, this)
			});
		},

		getTramitePromise: function (oTramite) {
			delete oTramite.CalendarDates;
			if (oTramite.Traindex === "") {
				return new Promise((resolve, reject) => {
					var entity = "/TramitacionesSet";
					oDataService.getModel("TransenerOperaciones").create(entity, oTramite, {
						success: resolve,
						error: reject
					});
				});
			} else {
				delete oTramite.LicenciaEstadoDiarioSet;
				return new Promise((resolve, reject) => {
					var entity = "/TramitacionesSet";
					oDataService.getModel("TransenerOperaciones").update(entity + "(Anio='" + oTramite.Anio +
						"',Empresa='" + oTramite.Empresa + "',Id='" + oTramite.Id +
						"',Traindex='" + oTramite.Traindex + "')",
						oTramite, {
						success: resolve,
						error: reject
					});
				});
			}
		},

		getCalendarPostTramitacion: function (oResponse, oCalendar, dDate) {
			var oPayload = {
				Anio: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio"),
				Id: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id"),
				Empresa: oResponse.Empresa,
				Traindex: oResponse.Traindex,
				Fecha: dDate,
				Estado: oCalendar.Estado,
				Observaciones: oCalendar.Observaciones
			};
			return new Promise((resolve, reject) => {
				var entity = "/LicenciaEstadoDiarioSet";
				oDataService.getModel("TransenerOperaciones").create(entity, oPayload, {
					success: resolve,
					error: reject
				});
			});
		},

		postCalendarTramitationDate: function (oPayload) {
			return new Promise((resolve, reject) => {
				var entity = "/LicenciaEstadoDiarioSet";
				oDataService.getModel("TransenerOperaciones").create(entity, oPayload, {
					success: resolve,
					error: reject
				});
			});
		},

		getCalendarDatesPromises: function (aResponses, aCalendarDates, aTramites) {
			var aPromises = [];
			for (var i = 0; i < aResponses.length; i++) {
				for (var oCalendarDate of aCalendarDates[i]) {
					if (!aResponses[i]) {
						aPromises.push(this.getCalendarPostTramitacion(aTramites[i], oCalendarDate, oCalendarDate.Fecha));
					} else {
						aPromises.push(this.getCalendarPostTramitacion(aResponses[i], oCalendarDate, oCalendarDate.Fecha));
					}
				}
			}
			return aPromises;
		},

		handleTramitePromises: function (aTramites) {
			var aPromises = [];
			for (var oTramite of aTramites) {
				aPromises.push(this.getTramitePromise(oTramite));
			}
			return aPromises;
		},

		getDatesFromTramitacion: function (oTramite) {
			var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read("/TramitacionesSet" + "(Anio='" + oTramite.Anio + "',Empresa='" + oTramite.Empresa +
					"',Id='" + sId +
					"',Traindex='" + oTramite.Traindex + "')/LicenciaEstadoDiarioSet", {
					success: resolve,
					error: reject
				});
			})
		},

		errorPOSTTramitacion: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al tramitar esta licencia");
		},

		successPUTLicenceIncludeCammesa: function (sMessage, aTramites, data) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha guardado el cambio correctamente");
			this.goToHome.bind(this)();
		},

		errorPUTLicenceIncludeCammesa: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al incluir la solicitud en el reporte cammesa");
			this.goToHome.bind(this)();
		},

		getLastCoordinator: function () {
			var aCoordinations = AppManagementHelper.getModel("CoordinationTableJsonModel").getData().Coordinations;
			var aCoordinationsMade = aCoordinations.filter(e => e.Cooindex !== "");
			if (aCoordinationsMade.length > 0) {
				return aCoordinationsMade[aCoordinationsMade.length - 1].Coouser;
			}
			return "";
		},

		sendLicenciaEmail: function (oLicence) {
			return new Promise((resolve, reject) => {
				this.getPermisos(oLicence).then((aPermisos) => {
					let sInfAdicional = "";
					let emails = [];
					let hashPermisos = {};

					aPermisos.forEach(permiso => {
						hashPermisos[permiso.Rol] = permiso;
					});
					hashPermisos["COORDINADOR"] = hashPermisos["COORDINADOR"] || "";
					emails = [hashPermisos["Creador"], hashPermisos["ope_solic-lic_transener"], hashPermisos["Solicitante_Suplente"], hashPermisos[
						"Solicitante_Suplente_Auxiliar"], hashPermisos["Jefe_Trabajo"], hashPermisos["Jefe_Trabajo_Suplente"]].map(permiso => permiso &&
							permiso.Mail || "juan.marone@transener.com.ar").join(",");

					var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
					var sCurrentUserMail = oUserJson.email;
					var sCurrentUserName = oUserJson.nombre + ", " + oUserJson.apellido;
					var oCurrentUser = AppManagementHelper.getModel("CurrentUser").getData();
					var sLicenseId = oLicence.Id;
					var sAnio = oLicence.Anio;
					var aPromises = [];
					var oPromiseCoord = this.PostPromesa(sAnio, "L", sLicenseId, oCurrentUser.Legajo, sCurrentUserName, sCurrentUserMail,
						oCurrentUser.Empresa, "TRAMITADOR");
					aPromises.push(oPromiseCoord);

					var oUsuariosAsignados = {
						Coordinador: hashPermisos["COORDINADOR"] ? hashPermisos["COORDINADOR"].Legajo + ", " + hashPermisos["COORDINADOR"].Nombre : "",
						Creador: hashPermisos["Creador"] ? hashPermisos["Creador"].Legajo + ", " + hashPermisos["Creador"].Nombre : "",
						Solicitante: hashPermisos["ope_solic-lic_transener"] ? hashPermisos["ope_solic-lic_transener"].Legajo + ", " + hashPermisos["ope_solic-lic_transener"].Nombre : "",
						SolicitanteSuplente: hashPermisos["Solicitante_Suplente"] ? hashPermisos["Solicitante_Suplente"].Legajo + ", " + hashPermisos[
							"Solicitante_Suplente"].Nombre : "",
						Jefe: hashPermisos["Jefe_Trabajo"] ? hashPermisos["Jefe_Trabajo"].Legajo + ", " + hashPermisos["Jefe_Trabajo"].Nombre : "",
						JefeSuplente: hashPermisos["Jefe_Trabajo_Suplente"] ? hashPermisos["Jefe_Trabajo_Suplente"].Legajo + ", " + hashPermisos[
							"Jefe_Trabajo_Suplente"].Nombre : "",
						SolSuplenteAux: hashPermisos["Solicitante_Suplente_Auxiliar"].Legajo + ", " + hashPermisos["Solicitante_Suplente_Auxiliar"].Nombre
					};
					aPromises.push(EtMailService.getPromise(oLicence.Empresa, oLicence.Tplnr, this.getSelectionArea(oLicence.Tipo, "01")));

					Promise.all(aPromises).then((res) => {
						var sEmailEt = "";
						// issue 514 - Se deben enviar correos a los tecnicos incluyendo no autorizados "06"
						//		if (this.stateOfTramit === "06") {
						//			sEmailEt = "";
						//		} else {
						sEmailEt = sEmailEt = res[1].results && res[1].results !== 0 ? res[1].results.map(e => (e.Mail)).join(",") : "";
						//		}

						var esAnulacion = false;
						var MotivoDeAnulacion = '';
						var ObservacionDeAnulacion = '';
						var fechaAnulacion = '';
						var vieneDeTramitacion = false;
						var vieneDeObservacion = false;
						var comentObserCoord = "";
						var nameLegacyObservator = "";
						var vieneDeCoordinacion = false;
						var vieneDeCancelacion = false;
						var nameLegacyCoordinator = this.getLastCoordinator();
						var nameLegacyTramitador = oLicence.Tramitador;
						var MotivoObservacion = "";
						var ComentarioObservacion = "";
						var MotivoNoAut = "";
						var ComentariosNoAut = "";

						MailHelper.sendEmail(oLicence, oUsuariosAsignados, emails, sEmailEt, sInfAdicional, esAnulacion, MotivoDeAnulacion,
							ObservacionDeAnulacion, fechaAnulacion, vieneDeTramitacion, vieneDeObservacion, comentObserCoord, nameLegacyObservator,
							vieneDeCoordinacion, vieneDeCancelacion, nameLegacyCoordinator, nameLegacyTramitador, MotivoObservacion,
							ComentarioObservacion, MotivoNoAut, ComentariosNoAut).then(() => {
								resolve();
							}).catch((e) => {
								console.error(e);
								reject();
							});
					});
				});
			});
		},

		successPOSTTramitacion: function (bFinishTramitacion, sMessage, licenseClone) {
			var oLicence = licenseClone;
			this.getPermisos(oLicence).then((aPermisos) => {
				let sInfAdicional = "";
				let emails = [];
				let hashPermisos = {};

				aPermisos.forEach(permiso => {
					hashPermisos[permiso.Rol] = permiso;
				});

				// MOMENTANEO
				hashPermisos["COORDINADOR"] = hashPermisos["COORDINADOR"] || "";
				emails = [hashPermisos["Creador"], hashPermisos["ope_solic-lic_transener"], hashPermisos["Solicitante_Suplente"], hashPermisos[
					"Solicitante_Suplente_Auxiliar"], hashPermisos["Jefe_Trabajo"], hashPermisos["Jefe_Trabajo_Suplente"]].map(permiso => permiso &&
						permiso.Mail || "juan.marone@transener.com.ar").join(",");

				var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
				var sCurrentUserMail = oUserJson.email;
				var sCurrentUserName = oUserJson.nombre + ", " + oUserJson.apellido;
				var oCurrentUser = AppManagementHelper.getModel("CurrentUser").getData();
				var sLicenseId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
				var sAnio = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio");
				var aPromises = [];
				var oPromiseCoord = this.PostPromesa(sAnio, "L", sLicenseId, oCurrentUser.Legajo, sCurrentUserName, sCurrentUserMail, oCurrentUser
					.Empresa, "TRAMITADOR");
				aPromises.push(oPromiseCoord);
				var oUsuariosAsignados = {
					Coordinador: hashPermisos["COORDINADOR"] ? hashPermisos["COORDINADOR"].Legajo + ", " + hashPermisos["COORDINADOR"].Nombre : "",
					Creador: hashPermisos["Creador"] ? hashPermisos["Creador"].Legajo + ", " + hashPermisos["Creador"].Nombre : "",
					Solicitante: hashPermisos["ope_solic-lic_transener"] ? hashPermisos["ope_solic-lic_transener"].Legajo + ", " + hashPermisos["ope_solic-lic_transener"].Nombre : "",
					SolicitanteSuplente: hashPermisos["Solicitante_Suplente"] ? hashPermisos["Solicitante_Suplente"].Legajo + ", " + hashPermisos[
						"Solicitante_Suplente"].Nombre : "",
					Jefe: hashPermisos["Jefe_Trabajo"] ? hashPermisos["Jefe_Trabajo"].Legajo + ", " + hashPermisos["Jefe_Trabajo"].Nombre : "",
					JefeSuplente: hashPermisos["Jefe_Trabajo_Suplente"] ? hashPermisos["Jefe_Trabajo_Suplente"].Legajo + ", " + hashPermisos[
						"Jefe_Trabajo_Suplente"].Nombre : "",
					SolSuplenteAux: hashPermisos["Solicitante_Suplente_Auxiliar"].Legajo + ", " + hashPermisos["Solicitante_Suplente_Auxiliar"].Nombre
				};

				aPromises.push(EtMailService.getPromise(oLicence.Empresa, oLicence.Tplnr, this.getSelectionArea(oLicence.Tipo, "01")));
				Promise.all(aPromises).then((res) => {
					var sEmailEt = "";
					// Issue 514 - Se deben enviar correos a los tecnicos incluyendo status 06	
					//	if (this.stateOfTramit === "06") {
					//		sEmailEt = "";
					//	} else {
					sEmailEt = res[1].results && res[1].results !== 0 ? res[1].results.map(e => (e.Mail)).join(",") : "";
					//	}

					var esAnulacion = false;
					var MotivoDeAnulacion = '';
					var ObservacionDeAnulacion = '';
					var fechaAnulacion = '';
					var vieneDeTramitacion = true;
					var vieneDeObservacion = false;
					var comentObserCoord = "";
					var nameLegacyObservator = "";
					var vieneDeCoordinacion = false;
					var vieneDeCancelacion = false;
					var nameLegacyCoordinator = this.getLastCoordinator();
					var nameLegacyTramitador = oLicence.Tramitador;
					var MotivoObservacion = "";
					var ComentarioObservacion = "";
					var MotivoNoAut = "";
					var ComentariosNoAut = "";

					if (!bFinishTramitacion) {
						this.logTramitationChange(sCurrentUserName).then(() => {
							BusyDialogHelper.close();
							var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
							var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
							MessageBoxHelper.showAlert("Alerta", sMessage, $.proxy(this.goToHome, this));
						}).catch((e) => {
							BusyDialogHelper.close();
							console.error(e);
							MessageBoxHelper.showAlert("Alerta", "Se ha guardado correctamente los cambios, pero ha habido un error en el logueo.", $.proxy(
								this.goToHome, this));
						});
					} else {
						if (this.stateOfTramit === "23") {
							this.logTramitationChange(sCurrentUserName).then(() => {
								BusyDialogHelper.close();
								var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
								var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
								MessageBoxHelper.showAlert("Alerta", sMessage, $.proxy(this.goToHome, this));
							}).catch((e) => {
								BusyDialogHelper.close();
								console.error(e);
								MessageBoxHelper.showAlert("Alerta", "Se ha guardado correctamente los cambios, pero ha habido un error en el logueo.", $.proxy(
									this.goToHome, this));
							});
						} else {
							MailHelper.sendEmail(oLicence, oUsuariosAsignados, emails, sEmailEt, sInfAdicional, esAnulacion, MotivoDeAnulacion,
								ObservacionDeAnulacion, fechaAnulacion, vieneDeTramitacion, vieneDeObservacion, comentObserCoord, nameLegacyObservator,
								vieneDeCoordinacion, vieneDeCancelacion, nameLegacyCoordinator, nameLegacyTramitador,
								MotivoObservacion,
								ComentarioObservacion,
								MotivoNoAut,
								ComentariosNoAut).then(() => {
									this.logTramitationChange(sCurrentUserName).then(() => {
										BusyDialogHelper.close();
										var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
										var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
										MessageBoxHelper.showAlert("Alerta", sMessage, $.proxy(this.goToHome, this));
									}).catch((e) => {
										BusyDialogHelper.close();
										console.error(e);
										MessageBoxHelper.showAlert("Alerta", "Se ha guardado correctamente los cambios, pero ha habido un error en el logueo.",
											$.proxy(this.goToHome, this));
									});
								}).catch((e) => {
									BusyDialogHelper.close();
									console.error(e);
									MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail para la coordinacion.", $.proxy(this.goToHome,
										this));
								});
						}
					}
				}).catch((e) => {
					BusyDialogHelper.close();
					console.error(e);
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail para la coordinacion.", $.proxy(this.goToHome,
						this));
				})
			}).catch((e) => {
				BusyDialogHelper.close();
				console.error(e);
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al obtener permisos", $.proxy(this.goToHome, this));
			})
		},

		errorPUTLicenceTramit: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al modificar esta licencia para la tramitacion");
		},

		suspendLicence: function (oSuspension) {
			var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var licenseClone = LicenceHelper.cloneLicense(oLicence);
			// si está aprobada se le agrega el en tramite, sinó anulada
			licenseClone.Substatus = "S";
			this.updateLicense(licenseClone, {
				success: $.proxy(this.successPUTLicenceSuspend, this, oSuspension),
				error: $.proxy(this.errorPUTLicenceSuspend, this)
			});
		},

		errorPUTLicenceSuspend: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al modificar esta licencia para la suspension");
		},

		successPUTLicenceSuspend: function (oSuspension, data) {
			var entity = "/SuspensionLicenciaSet";
			// oSuspension.Time = FormatHelper.formatDateTimePickerTime(oSuspension.Time);
			oDataService.getModel("TransenerOperaciones").create(entity, oSuspension, {
				success: $.proxy(this.successPOSTSuspention, this, oSuspension),
				error: $.proxy(this.errorPOSTSuspention, this)
			});
		},

		successPOSTSuspention: function (oSuspension, data) {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var fechaRepresentante = FormatHelper.formatDatesGMT(data.Datelicencia)
			fechaRepresentante.setHours(data.Time.getHours())
			fechaRepresentante.setMinutes(data.Time.getMinutes())
			console.log(fechaRepresentante);
			var oLibroGuardia = {
				"Fechahora": fechaRepresentante,
				"Equipo": oLicense.Equnr,
				"Lugar": oLicense.Tplnr,
				"Novedad": `Numero de licencia ${oLicense.Id}, Trabajo a realizar: ${oLicense.Descripcion}`,
				"Tiponovedad": FormatterHelper.getNovedadType("S"),
				"Empresa": oLicense.Empresa
			};
			LibroGuardiasService.POSTLibroGuardia(oLibroGuardia).then(() => {
				BusyDialogHelper.close();
				var sId = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id");
				var license = AppManagementHelper.getModel("LicenseJsonModel").getData();
				MessageBoxHelper.showAlert("Alerta", "Se ha suspendido la licencia de manera correcta", $.proxy(this.FIND, this, license));
			}).catch((e) => {
				console.error(e)
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear guardia")
			})
		},

		errorPOSTSuspention: function (error) {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear el registro de suspension");
		},

		checkFilterLogic: function (aFilters) {
			var aComplete = $.extend([], true, aFilters);
			let oRemoved = _.remove(aComplete, (e) => {
				if (e.sPath === "Equstat" || e.sPath === "Equstatnocam") {
					if (e.oValue1 === "N") {
						return false;
					}
					if (e.oValue1 === "") {
						//FIX GQ 26-12
						e.oValue1 = "N"
						return true
						//return false;
					}
				}
				return true;
			})
			return oRemoved;
		},

		formatLicstatValues: function (sValue) {
			switch (sValue) {
				case "90":
					return "1E";
				case "10":
					return "1S";
				default:
					return sValue;
			}
		},

		validateLicStatFilters: function (aFilters) {
			var oLicstatFilter = aFilters.find(e => e._bMultiFilter && e.aFilters.length > 0 && e.aFilters[0].sPath === "Licstat")
			if (oLicstatFilter) {
				oLicstatFilter.aFilters.forEach(e => {
					e.oValue1 = this.formatLicstatValues(e.oValue1)
				});
			}
		},

		validateAroBloqueoRdisparoFilters: function (aFilters) {
			var aComplete = $.extend([], true, aFilters);
			let oRemoved = _.remove(aComplete, (e) => {
				if (e.sPath === "Rdisparo" || e.sPath === "Bloqueo") {
					if (e.oValue1 === "N") {
						return false;
					}
					return true;
				}
				if (e.sPath === "Aro") {
					if (e.oValue1 === "Z") {
						return false;
					}
					return true;
				}
				return true;
			})
			return oRemoved;

		},

		GETWithFilters: function (aFilters, bDontSort) {
			var aFiltersFound = this.checkFilterLogic(aFilters);
			this.validateChecks(aFiltersFound);
			this.validateLicStatFilters(aFiltersFound);
			var aWithoutAroBloqueoRdisparo = this.validateAroBloqueoRdisparoFilters(aFiltersFound);
			BusyDialogHelper.open("", "");
			var entity = "/LicenciaTrabajoSet";
			oDataService.getModel("TransenerOperaciones").read(entity, {
				filters: aWithoutAroBloqueoRdisparo,
				urlParameters: {
					"$top": 60
				},
				/*urlParameters: {
					"$expand": "HorariosPorLicencia_nav"
				},*/
				success: function (bDontSort, oData) {
					sap.m.MessageToast.show("Se han recuperado las ultimas 60 licencias/solicitudes, las demas estaran disponibles en breve");
					this.successGET(bDontSort, oData);
				}.bind(this, bDontSort),
				error: $.proxy(this.errorGET, this)
			});
			oDataService.getModel("TransenerOperaciones").read(entity, {
				filters: aWithoutAroBloqueoRdisparo,

				/*urlParameters: {
					"$expand": "HorariosPorLicencia_nav"
				},*/
				success: function (bDontSort, oData) {
					sap.m.MessageToast.show("Se han recuperado todas las licencias/solicitudes");
					this.successGET(bDontSort, oData);
				}.bind(this, bDontSort),
				//$.proxy(this.successGET, this, bDontSort),
				error: $.proxy(this.errorGET, this)
			});
		},

		GETLicenses: function (filters) {
			let entity = "/LicenciaTrabajoSet";
			oDataService.getModel("TransenerOperaciones").read(entity, {
				filters: filters,
				sorter: [{
					path: 'Anio',
					descending: false
				}, {
					path: 'Id',
					descending: false
				}],
				success: function (data) {
					sap.m.MessageToast.show("Se han recuperado todas las licencias/solicitudes");
					this.successGET(false, data);
				}.bind(this),
				error: function (error) {
					this.errorGET(error);
				}.bind(this)
			});
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: filters,
					sorter: [{
						path: 'Anio',
						descending: false
					}, {
						path: 'Id',
						descending: false
					}],
					urlParameters: {
						"$top": 60
					},
					success: function (data) {
						sap.m.MessageToast.show("Se han recuperado las ultimas 60 licencias/solicitudes, las demas estaran disponibles en breve");
						resolve(data);
					},
					error: function (error) {
						reject(error)
					}
				});

			})
		},

		getCammesaComments: function (oLicense) {
			let aFilters = [];

			let sId = "";
			let sType = "";

			sType = oLicense.Tipo;
			sId = oLicense.Id;

			aFilters.push(new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, sId));
			aFilters.push(new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, sType));
			aFilters.push(new sap.ui.model.Filter("Anio", sap.ui.model.FilterOperator.EQ, oLicense.Anio));
			aFilters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, oLicense.Empresa));
			//aFilters.push(new sap.ui.model.Filter("Semana", sap.ui.model.FilterOperator.EQ, oLicense.Semana));

			oDataService.getModel("TransenerOperaciones").read("/LTComentariosCammesaSet", {
				filters: aFilters,
				success: (data) => {
					data.results.forEach((e) => {
						e.EstadoSemanal = this.getEstadoSemanal(e.EstadoSemanal);
					});
					let oModel = AppManagementHelper.getModel("CammesaCommentsModel")
					oModel.setData({
						Comments: data.results
					})
				},
				error: (e) => {
					console.log(e)
				}
			});
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

		getEstadoSemanal: function (sIdEstadoSemanal) {
			var aEstados = AppManagementHelper.getModel("EstadosModel").getData().estados;
			var oEstado = aEstados.find(e => e.DomvalueL === sIdEstadoSemanal)
			return oEstado ? oEstado.Ddtext : "";
		},

		validateColor: function () {
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

		GET: function (filters) {
			AppManagementHelper.getModel("OrderNumberJsonModel").setData({
				Odering: "down"
			});
			this.validateChecks(filters);
			AppManagementHelper.getModel("ColorModel").setProperty("/Color", this.validateColor());
			BusyDialogHelper.open("", "");
			this.GETLicenses(filters).then(this.successGET.bind(this, false)).catch($.proxy(this.errorGET, this));
		},

		FIND: function (license, fnCallback, fnCallbackError) {
			this.fnCallbackSuccess = fnCallback;
			this.fnCallbackError = fnCallbackError;
			var entity = "/LicenciaTrabajoSet";
			var key = entity + "(Empresa='" + license.Empresa + "',Id='" + license.Id + "',Tipo='" + license.Tipo + "',Anio='" + license.Anio +
				"')";
			let urlParameters = {};
			if (license.Tipo === "L") {
				urlParameters.$expand = this._expandProperties;
			} else {
				urlParameters.$expand = "HorariosPorLicencia_nav,CoordinacionesLicencia_nav,ObservacionesLicencia_nav";
			}
			oDataService.getModel("TransenerOperaciones").read(key, {
				urlParameters: urlParameters,
				success: $.proxy(this.successFIND, this),
				error: $.proxy(this.errorFIND, this)
			});
		},

		getPromise: function (license, expand) {
			return new Promise((resolve, reject) => {
				var entity = "/LicenciaTrabajoSet";
				var key = entity + "(Empresa='" + license.Empresa + "',Id='" + license.Id + "',Tipo='" +
					license.Tipo + "',Anio='" + license.Anio + "')";
				let urlParameters = {};
				if (expand) {
					urlParameters.$expand = expand;
				}
				oDataService.getModel("TransenerOperaciones").read(key, {
					urlParameters: urlParameters,
					success: resolve,
					error: reject
				});
			})
		},

		deleteUnifilar: function (sId) {
			return new Promise((resolve, reject) => {
				var oData = AppManagementHelper.getModel("LicenseJsonModel").getData();
				var entity = "/EsquemaUnifilarMarcadorSet(Idunifilar='" + sId + "',Numerolicencia='" + oData.Idunifilar + "',Empresa='" + oData.Empresa +
					"',Anio='" + oData.Anio + "')";
				oDataService.getModel("TransenerOperaciones").remove(entity, {
					success: () => {
						resolve();
					},
					error: () => {
						reject();
					}
				});
			});
		},

		getIndividualUnifilar: function (Anio, Empresa, Idunifilar, Numerolicencia, navigation) {
			//TODO TRAER EMPRESA Y NUMEROLICENCIA Y ANIO EN BASE AL ESQUEMA Y NO A LA LICENCIA
			var sNavigation = navigation ? navigation : ""
			return new Promise((resolve, reject) => {
				var oData = AppManagementHelper.getModel("LicenseJsonModel").getData();
				var entity = "/EsquemaUnifilarMarcadorSet(Idunifilar='" + Idunifilar + "',Numerolicencia='" + Numerolicencia + "',Empresa='" +
					Empresa +
					"',Anio='" + Anio + "')" + sNavigation;
				oDataService.getModel("TransenerOperaciones").read(entity, {
					success: function (data) {
						resolve(data)
					},
					error: function (e) {
						console.log(e)
						reject();
					}
				});
			})
		},

		getUnifilarCount: function (oLicense) {
			return new Promise((resolve, reject) => {
				var aFilters = [
					new sap.ui.model.Filter({
						path: "Empresa",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: oLicense.Empresa
					}),
					new sap.ui.model.Filter({
						path: "Anio",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: oLicense.Anio
					}),
					new sap.ui.model.Filter({
						path: "Numerolicencia",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: oLicense.Idunifilar
					})
				]
				var entity = "/EsquemaUnifilarMarcadorSet/$count";
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: aFilters,
					success: (data) => {
						resolve(parseInt(data));
					},
					error: (e) => {
						reject(e)
					}
				});
			})
		},

		checkUnifilarByJobCond: function (oLicense) {
			return new Promise((resolve, reject) => {
				if (oLicense.Tipo === "L") {
					if (oLicense.Jobcond === "01") {
						var aFilters = [
							new sap.ui.model.Filter({
								path: "Empresa",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: oLicense.Empresa
							}),
							new sap.ui.model.Filter({
								path: "Anio",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: oLicense.Anio
							}),
							new sap.ui.model.Filter({
								path: "Numerolicencia",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: oLicense.Idunifilar
							})
						]
						var entity = "/EsquemaUnifilarMarcadorSet/$count";
						oDataService.getModel("TransenerOperaciones").read(entity, {
							filters: aFilters,
							success: (data) => {
								if (data) {
									var bValid = parseInt(data) !== 0;
									resolve(bValid);
								}
								reject();
							},
							error: (e) => {
								reject(e)
							}
						});
					} else {
						resolve(true)
					}
				} else {
					resolve(true)
				}

			});
		},

		getUnifilarVersion: function (oUnifilar) {
			return new Promise((resolve, reject) => {
				var aFilters = [];
				//TODO MAPEAR CENTRO LICENCIA this.Centro 102
				var centerFilter = new sap.ui.model.Filter({
					path: "Centro", //a
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oUnifilar.Region //d
				});
				//TODO MAPEAR CENTRO LICENCIA this.ET AB
				var ETFilter = new sap.ui.model.Filter({
					path: "Et", //a
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oUnifilar.Et //d
				});

				var TipoFilter = new sap.ui.model.Filter({
					path: "TipoUnifilar", //a
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oUnifilar.TipoUnifilar //d
				});

				var EstadoFilter = new sap.ui.model.Filter({
					path: "Estado",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "1"
				});

				aFilters.push(EstadoFilter);
				aFilters.push(centerFilter);
				aFilters.push(ETFilter);
				aFilters.push(TipoFilter);

				var oModelOperaciones = oDataService.getModel("TransenerOperaciones");
				oModelOperaciones.read("/LTUnifilaresFileSet", {
					filters: aFilters,
					success: (data) => {
						resolve(data)
					},
					error: (e) => {
						reject(e)
					}
				})
			})
		},

		createUnifilar: function (oPayload) {
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").create("/EsquemaUnifilarMarcadorSet", oPayload, {
					success: (data) => {
						resolve(data);
					},
					error: (e) => {
						reject(e);
					}
				})
			})
		},

		getUnifilares: function (license, fnCallback, fnError, oParameter) {
			var aFilters = [
				new sap.ui.model.Filter({
					path: "Empresa",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: license.Empresa
				}),
				new sap.ui.model.Filter({
					path: "Anio",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: license.Anio
				}),
				new sap.ui.model.Filter({
					path: "Numerolicencia",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: license.Idunifilar
				})
			];
			var entity = "/EsquemaUnifilarMarcadorSet";
			oDataService.getModel("TransenerOperaciones").read(entity, {
				filters: aFilters,
				urlParameters: oParameter ? oParameter : {
					"$select": "Nombre,Idunifilar,NumVersion,Region,TipoUnifilar,Et,Empresa,Anio,Region,IntAbLe,SecAbBt,SecPatCr,PatAdic,Numerolicencia"
				},
				success: fnCallback,
				error: fnError
			});
		},

		getUnifilarFiles: function (aFilters) {
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read("/LTUnifilaresFileSet", {
					filters: aFilters,
					urlParameters: {
						"$select": "Et,Descripcion,TipoUnifilar,IdUnifilar"
					},
					success: (data) => {
						resolve(data)
					},
					error: (e) => {
						reject(e)
					}
				});
			});
		},

		postDay: function (oDay) {
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").create("/HorariosLicenciaSet", oDay, {
					success: resolve,
					error: reject,
				})
			});
		},

		putDayHorarios: function (oDay) {
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").update("/HorariosLicenciaSet" + "(Tipo='" + oDay.Tipo + "',Empresa='" + oDay.Empresa +
					"',Id='" +
					oDay.Id +
					"',Modif='" + oDay.Modif + "',Anio='" + oDay.Anio + "')", oDay, {
					success: resolve,
					error: reject
				});
			});
		},

		findHorarios: function (oLicense) {

			var aFilters = [];

			aFilters.push(new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, oLicense.Id));
			aFilters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, oLicense.Empresa));
			aFilters.push(new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, oLicense.Tipo));
			aFilters.push(new sap.ui.model.Filter("Anio", sap.ui.model.FilterOperator.EQ, oLicense.Anio))

			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").read("/HorariosLicenciaSet", {
					success: resolve,
					filters: aFilters,
					error: reject
				});
			});
		},

		deleteDay: function (oDay) {
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").remove("/HorariosLicenciaSet" + "(Tipo='" + oDay.Tipo + "',Empresa='" + oDay.Empresa +
					"',Id='" +
					oDay.Id +
					"',Modif='" + oDay.Modif + "',Anio='" + oDay.Anio + "')", {
					success: resolve,
					error: reject
				});
			});
		},

		removeTramitacion: function (oTramitacion) {
			return new Promise((resolve, reject) => {
				oDataService.getModel("TransenerOperaciones").remove("/TramitacionesSet" + "(Empresa='" + oTramitacion.Empresa +
					"',Id='" +
					oTramitacion.Id +
					"',Traindex='" + oTramitacion.Traindex + "',Anio='" + oTramitacion.Anio + "')", {
					success: resolve,
					error: reject
				});
			});
		},

		refreshLicenceList: function () {
			var aFilters = this.generateAdvancedFilters();
			aFilters.push(new sap.ui.model.Filter({
				path: "Empresa",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Empresa")
			}));
			this.GETWithFilters(aFilters);
		},

		getDeleteDatePromise: function (oCalendarPayload, aDifferenceToDelete) {
			var aPromise = [];
			for (var oDifference of aDifferenceToDelete) {
				var sDate = oDifference.Fecha.toISOString().split("T")[0] + "T00:00:00"
				aPromise.push(new Promise((resolve, reject) => {
					oDataService.getModel("TransenerOperaciones").remove("/LicenciaEstadoDiarioSet" + "(Anio='" + oCalendarPayload.Anio +
						"',Empresa='" + oCalendarPayload.Empresa +
						"',Id='" +
						oCalendarPayload.Id +
						"',Traindex='" + oCalendarPayload.Traindex + "',Fecha=datetime'" + sDate + "')", {
						success: resolve,
						error: reject
					});
				}));
			}
			return aPromise;
		},

		removeDates: function (oCalendarPayload, aDifferenceToDelete) {
			var aPromisesDates = this.getDeleteDatePromise(oCalendarPayload, aDifferenceToDelete);
			return Promise.all(aPromisesDates);
		},

		getPermisos: function (oLicense) {
			var aFilters = [];

			aFilters.push(new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, oLicense.Id));
			aFilters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, oLicense.Empresa));
			aFilters.push(new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, oLicense.Tipo));
			aFilters.push(new sap.ui.model.Filter("Anio", sap.ui.model.FilterOperator.EQ, oLicense.Anio));

			return new Promise((resolve, reject) => {
				var entity = "/PermisosLicenciaSet";
				oDataService.getModel("TransenerOperaciones").read(entity, {
					filters: aFilters,
					success: function (data) {
						resolve(data.results);
					},
					error: function (error) {
						reject(error);
					}
				});
			});

		},

		handleUserPermission: function (aUserPermissions, sTipo, sLicStat) {
			//array creacion, observacion

			//para complentar dps
			var aRolesForCreation = ["Creador", "Jefe_Trabajo", "Jefe_Trabajo_Suplente", "ope_solic-lic_transener", "Solicitante_Suplente"]
			//coordinacion y observacion. 
			var aRolesForCoordinationObservation = ["COORDINADOR"];
			var aRolesForTramitation = ["TRAMITADOR"];

			var oModelPermisos = AppManagementHelper.getModel("PermisosJsonModel")
			var sCurrentUserLegajo = AppManagementHelper.getModel("CurrentUser").getData().Legajo;
			if (sCurrentUserLegajo === "") sCurrentUserLegajo = this.nullLegajo;
			//lo seteo en un array vacio para evitar problemas en etapas de desarrollo
			var sSelectedArray = [];

			switch (sLicStat) {
				case "02":
				case "30":
					sSelectedArray = aRolesForCreation;
					break;
				case "07":
					sSelectedArray = aRolesForTramitation;
					break;
				case "09":
					sSelectedArray = aRolesForCoordinationObservation;
					break;

			}
			//ROLES CORRESPONDIENTES AL ESTADO
			var bFound = aUserPermissions.some((oUser) => {
				if (sSelectedArray.includes(oUser.Rol)) {
					return oUser.Legajo === sCurrentUserLegajo;
				} else {
					return false;
				}
			});

			// SI VOY A REALIZAR PROCESOS POR PRIMERA VEZ Y NO EXISTO.
			if (!bFound) {
				//MAPEAMOS LOS ROLES DEL USUARIO AL ARRAY DE AUSERPERMISSIONS
				var aRoles = aUserPermissions.map(oUser => {
					return oUser.Rol;
				});
				bFound = !aRoles.some(sRol => sSelectedArray.includes(sRol))
			}

			var oModelPermisos = AppManagementHelper.getModel("PermisosJsonModel").setProperty("/UsuarioEncontrado", bFound);
		},

		findEquipoById: function (sTplnr) {
			let aData = AppManagementHelper.getModel("EstacionesJsonModel").getProperty("/Estaciones");
			var oFiltered = aData.find((e) => {
				return e.Codigo === sTplnr
			});

			if (oFiltered !== undefined) {
				var DescripcionETJsonModel = AppManagementHelper.getModel("DescripcionETJsonModel");
				DescripcionETJsonModel.setData({
					Descripcion: oFiltered.Descripcion
				});
			}
		},

		getStatusTramitacion: function (sLicStat) {
			if (sLicStat === "01") { // Autorizada
				return "TA";
			}
			if (sLicStat === "06") { // NO Autorizada
				return "TN";
			}
			if (sLicStat === "23") { // En tramite
				return "ET";
			}
			return "";
		},

		loadSpecialDatesTramitacion: function (sAnio, sId, Empresa, sPeriod) {
			var aFilters = [];

			aFilters.push(new sap.ui.model.Filter("Empresa", sap.ui.model.FilterOperator.EQ, Empresa));
			aFilters.push(new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, sId));
			aFilters.push(new sap.ui.model.Filter("Anio", sap.ui.model.FilterOperator.EQ, sAnio));

			var entity = "/LicenciaEstadoDiarioSet";
			oDataService.getModel("TransenerOperaciones").read(entity, {
				filters: aFilters,
				success: function (data) {
					//issue 190 ya no importa si es diaria o continua
					//TODO on hold
					var oDataFechas = sPeriod === "D" ? LicenceHelper.handleSpecialDatesTramitacion(data.results) : {
						Fechas: []
					};
					var oDataFechas = LicenceHelper.handleSpecialDatesTramitacion(data.results)
					oDataFechas = LicenceHelper.getOrderSpecialDate(oDataFechas);
					var oModelTramitacionDates = AppManagementHelper.getModel("EspecialDatesTramitacion");
					oModelTramitacionDates.setData(oDataFechas);
					BusyDialogHelper.close();
				},
				error: function (error) {
					console.log(error);
				}
			});

		},

		successFIND: function (data) {
			var oData = FormatHelper.removeResults(data);
			var oLicense = oData;
			this.findEquipoById(oLicense.Tplnr);
			this._observedStatus = oLicense.Licstat === "02";
			var sTipo = oLicense.Tipo;
			this.getPermisos(oLicense).then((dataPermisos) => {
				var licenseJsonModel = AppManagementHelper.getModel("LicenseJsonModel");
				this.loadSpecialDatesTramitacion(oLicense.Anio, oLicense.Id, oLicense.Empresa, oLicense.Period);
				this.handleUserPermission(dataPermisos, sTipo, oLicense.Licstat);
				var aLicences = [];
				aLicences.push(oData);
				BusyDialogHelper.close();
				AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/visible", true);
				var oModelTramitacionStatus = AppManagementHelper.getModel("TramitacionStatusModel");

				oModelTramitacionStatus.setProperty("/Status", this.getStatusTramitacion(oLicense.Licstat));
				oModelTramitacionStatus.setProperty("/StatusText", FormatterHelper.getStatusTramitacionText(oLicense.Licstat));

				FormatHelper.formatTimesFromGetLicenses(aLicences);
				oLicense.Timbeg = FormatHelper.formaTimesToShow(oLicense.Timbeg);
				oLicense.Timend = FormatHelper.formaTimesToShow(oLicense.Timend);
				var horarios = oLicense.HorariosPorLicencia_nav;
				var miliSecondsOffset = new Date().getTimezoneOffset() * 60 * 1000; //offset en segundos
				horarios.forEach(function (dia) {
					dia.Fecha = new Date(dia.Fecha.getTime() + miliSecondsOffset);
				});
				oLicense.Solbeg = FormatHelper.formatDatesGMT(oLicense.Solbeg);
				oLicense.Solend = FormatHelper.formatDatesGMT(oLicense.Solend);
				oLicense.SolSuplente = oLicense.SolSuplente === this.nullLegajo ? "" : oLicense.SolSuplente;
				oLicense.Jefe = oLicense.Jefe === this.nullLegajo ? "" : oLicense.Jefe;
				oLicense.JefeSuplente = oLicense.JefeSuplente === this.nullLegajo ? "" : oLicense.JefeSuplente;

				if (oLicense.AttachmentXLicencia_nav.length) {
					AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/visibleFiles", true);
				} else {
					AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/visibleFiles", false);
				}

				AppManagementHelper.setNavigationProperties(oLicense);
				LicenceHelper.generateDeliveryDevolution(oLicense);
				LicenceHelper.generatePlacementRemoval(oLicense);
				LicenceHelper.generateTurno(oLicense);
				LicenceHelper.generateInhibicionHabilitacion(oLicense);
				LicenceHelper.setPersonalHabilitadoParaCboEntraga(oLicense);
				LicenceHelper.setPersonalHabilitadoParaCboDevolucion(oLicense);
				LicenceHelper.setPersonalHabilitadoParaCboCancelacion(oLicense);

				LicenceHelper.generateSuspentionReanudation(oLicense);

				if (oLicense.Rdisparo === "") oLicense.Rdisparo = "Y";

				LicenceHelper.setComments(oLicense);
				licenseJsonModel.setData(oLicense);

				this.handleCoordinationTableDataByUserRole();
				this.handleObservationTableDataByUserRole();
				this.handleTransfers();
				this.enableSpecifyBarraControl(oLicense.Barrafs);

				BusyDialogHelper.close();
				AppManagementHelper.getModel("FilterSelectionJsonModel").setProperty("/busyData", false);
				LegacyValidationHelper.checkLegacies();
				if (AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Period") === 'C') {
					AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/enabled", true);
					AppManagementHelper.getModel("DisableControlsJsonModel").setProperty("/HorariosSemanaEnabled", false);
				}

				if (this.fnCallbackSuccess) {
					this.fnCallbackSuccess(oLicense);
				}

				this.getFullTramitacionesWithCalendarDates();

			}).catch((e) => {
				console.error("ACA",e);
				BusyDialogHelper.close();
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al obtener permisos")
			})

		},

		enableSpecifyBarraControl: function (sKey) {
			var oLicenseJsonModel = AppManagementHelper.getModel("LicenseJsonModel");
			var oFilterSelecitonJsonModel = AppManagementHelper.getModel("FilterSelectionJsonModel");
			if (sKey === "N") {
				oFilterSelecitonJsonModel.setProperty("/enabledEspecifyBarra", false);
				oLicenseJsonModel.setProperty("/Barrafstx", "");
			} else {
				oFilterSelecitonJsonModel.setProperty("/enabledEspecifyBarra", true);
			}
		},

		handleTransfers: function () {
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			var sType = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Tipo");
			var aTransfers = sType === "L" ? AppManagementHelper.getModel("TransferListJsonModel").getData().Transfers : []
			LegacyValidationHelper.validateLegaciesTransfer(oLicense, aTransfers);
			aTransfers.push({
				Anio: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio"),
				Id: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id"),
				Empresa: empresa,
				Jefetra: "",
				Time: new Date(),
				Autcot: "",
				Teinformo: "",
				TeinformoValueState: "Success",
				TeinformoValueStateText: "",
				JefetraValueState: "Success",
				JefetraValueStateText: ""
			});
			aTransfers.forEach((e) => {
				e.enabledCombo = e.Trjindex === undefined || e.Trjindex === "";
			})
			AppManagementHelper.getModel("TransferListJsonModel").refresh(true);
		},

		handleCoordinationTableDataByUserRole: function () {
			//TODO TAR PENDIENTE CON ESTA FUNC
			var empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			var aRoles = AppManagementHelper.getModel("UserJsonModel").getData().roles
			var bLicenseWithGenerateStatus = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Licstat") === "09";
			var sType = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Tipo");
			var aCoordinations = AppManagementHelper.getModel("CoordinationTableJsonModel").getData().Coordinations;
			aCoordinations.push({
				Id: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id"),
				Anio: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio"),
				Tipo: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Tipo"),
				Empresa: empresa,
				Cooindex: "",
				CreationDate: new Date(),
				CreationTime: "PT00H00M00S",
				Coouser: AppManagementHelper.getStringUserLegacy(),
				Coordination: ""
			})
			AppManagementHelper.getModel("CoordinationTableJsonModel").refresh(true);
			//}
		},

		handleObservationTableDataByUserRole: function () {
			var empresa = AppManagementHelper.getModel("UtilsJsonModel").getProperty("/empresa");
			var aRoles = AppManagementHelper.getModel("UserJsonModel").getData().roles
			var bLicenseWithGenerateStatus = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Licstat") === "09";
			var sType = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Tipo");
			var aObservations = AppManagementHelper.getModel("ObservationTableJsonModel").getData().Observations
			aObservations.push({
				Id: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Id"),
				Anio: AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Anio"),
				Empresa: empresa,
				Obsindex: "",
				CreationDate: new Date(),
				CreationTime: "PT00H00M00S",
				Obsuser: AppManagementHelper.getStringUserLegacy(),
				Observation: ""
			});
			AppManagementHelper.getModel("ObservationTableJsonModel").refresh(true);
		},

		errorFIND: function (error) {
			if (this.fnCallbackError) this.fnCallbackError(error);
		},

		getArbplDesc: function (sArbpl) {

			//GQ 18/12 var aWorkPlaces = AppManagementHelper.getModel("WorkPlacesJsonModel").getData().WorkPlaces;
			var aWorkPlaces = AppManagementHelper.getModel("PuestosTrabajoJsonModel").getData().PuestosTrabajo;
			var oWorkPlace = aWorkPlaces.find((e) => {
				return e.Arbpl === sArbpl
			})
			//GQ 18/12 return oWorkPlace ? oWorkPlace.KtextUp : "";
			return oWorkPlace ? oWorkPlace.Ktext : "";

		},

		getEqustatText: function (sEqustat) {
			return (sEqustat === "X") ? "E/S" : "F/S";
		},

		getBloqueoText: function (sBloqueo) {
			return (sBloqueo === "X") ? "SI" : "NO";
		},

		getPeriodoText: function (sPeriod) {
			return (sPeriod === "D") ? "Diaria" : "Continua";
		},

		getStatusText: function (status, substatus) {
			if (status === "01") {
				return FormatterHelper.getApprovalSubstatus(status, substatus)
			} else {
				return FormatterHelper.getStatusName(status);
			}
		},

		rolesForDuplication: function (type, region) {
			let sRegion = AppManagementHelper.getModel("CurrentUser").getData().Region;
			var aUserRoles = $.extend([], AppManagementHelper.getModel("UserJsonModel").getData().roles);
			var aPermisosForDuplication = AppManagementHelper.getModel("permisosModel").getData()["listado"]["!BotonSolicitudListado"];

			let sRegionFormat = FormatterHelper.centroToRegion(sRegion);

			if (sRegionFormat) {
				aUserRoles = aUserRoles.map(role => role.replace("_" + sRegionFormat, ""));
			}

			if (type === "L") {
				var oCoordinateFound = aUserRoles.find(e => e === "Coordinador_Mantenimiento");
				return !oCoordinateFound
			} else {
				return !aUserRoles.some(r => aPermisosForDuplication.includes(r))
			}
		},

		validateChecks: function (aFilters) {
			var oModelCheckData = AppManagementHelper.getModel("FilterSelectionJsonModel").getData();
			if (oModelCheckData.checkedLic && oModelCheckData.checkedSol) {

			} else if (oModelCheckData.checkedLic) {
				aFilters.push(new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "L"));
			} else if (oModelCheckData.checkedSol) {
				aFilters.push(new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "S"));
			}
		},

		successGET: function (bDontSort, data) {
			var aLicenses = FormatHelper.removeResults(data);
			FormatHelper.formatTimesFromGetLicenses(aLicenses);
			aLicenses.forEach((oLicense) => {
				oLicense.ArbplDesc = this.getArbplDesc(oLicense.Arbpl);
				oLicense.EqustatText = this.getEqustatText(oLicense.Equstat);
				oLicense.BloqueoText = this.getBloqueoText(oLicense.Bloqueo);
				oLicense.PeriodoText = this.getPeriodoText(oLicense.Period);
				oLicense.StatusText = this.getStatusText(oLicense.Licstat, oLicense.Substatus);
				oLicense.ValidForDuplicate = this.rolesForDuplication(oLicense.Tipo, oLicense.Werks);
			});

			//	var aLicensesWithCheck = this.validateChecks(aLicensesOrdered);
			// Issue 548 - Para las vistas  LTs de equipos y Salidas y Lineas la info viene ya ordenada de back end y no se debe reordenar
			// para estas llamadas el parametro dontSort vendra en true
			if (bDontSort !== true) {
				var aLicensesOrdered = _.orderBy(aLicenses, ['Anio', "Id"], ["desc", "desc"])
			} else {
				aLicensesOrdered = aLicenses;
			}

			AppManagementHelper.getModel("LicencesListJsonModel").setData({
				Licenses: aLicensesOrdered
			});
			BusyDialogHelper.close();
		},

		errorGET: function (error) {
			var sError = FormatHelper.parseJsonError(error);
			if (sError === "No se encontraron datos") {
				AppManagementHelper.getModel("LicencesListJsonModel").setData({
					Licenses: []
				});
			}
			MessageBoxHelper.showAlert("Alert", sError);
			BusyDialogHelper.close();
		},

		// Para los casos de cot y programacion este combo se va a ver y posteriormente se selecciona o nada o emergencia o terceros.
		getLicStatByRol: function (sTipoLic, sLicStat) {
			var sLicStatAux = sLicStat;
			// Issue #518 -> Agregar lógica para setear el estado de una licencia con el nuevo rol: ope_solic-lic_transba
			var aRoles = AppManagementHelper.getModel("UserJsonModel").getData().roles;
			var inputEnabled = AppManagementHelper.getModel("EnviarCoordModel").getProperty("/visibleTipoLicencia");
			if (inputEnabled && (sTipoLic === "N" || sTipoLic === "EM" || sTipoLic === "TE")) {
				AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Gdate", new Date());
				sLicStat = "07";

				// Si el usuario tiene el nuevo rol -> ope_solic-lic_transba
				//	var bSolicitanteLicTBA = aRoles.find(sRol => sRol === "ope_solic-lic_transba");

				var bSolicitanteLicTBA = aRoles.some(sRol => sRol === "ope_solic-lic_transba" || sRol === "Solicitante_Lic_TBA");

				// Issue # 545 - Solo se debe cambiar el estatus si se uso el boton "Generar Licencia" , si se creo usando el boton "Crear Borrador Licencia"
				// se debe mantener el estado 30 "Creada"
				if (bSolicitanteLicTBA && sLicStatAux === "09") {
					switch (sTipoLic) {
						case "N":
							sLicStat = "09";
							break;
						case "EM":
							sLicStat = "07";
							break;
						case "TE":
							sLicStat = "09";
							break;
					}
				} else if (bSolicitanteLicTBA && sLicStatAux === "30") {
					sLicStat = "30";
				}
			}

			return sLicStat;
		},

		POSTLicense: function (bIsSol) {
			return new Promise((resolve, reject) => {
				BusyDialogHelper.open();
				let oLicenseData = LicenceHelper.cloneLicense(AppManagementHelper.getModel("LicenseJsonModel").getData());
				oLicenseData.Licstat = this.getLicStatByRol(oLicenseData.Tipolicencia, oLicenseData.Licstat);
				FormatHelper.formatTimes(oLicenseData);
				FormatHelper.formatDayArrayTimes(oLicenseData);
				FormatHelper.deleteNavPropertiesByPeriod(oLicenseData, oLicenseData.Period);
				let entity = "/LicenciaTrabajoSet";
				if (oLicenseData.Rdisparo === "Y") oLicenseData.Rdisparo = "";
				if (oLicenseData.Equstat === "Y") oLicenseData.Equstat = "";

				// Issue #486 - Fix siempre que voy a crear una licencia se crea con el campo Comments vacío.
				oLicenseData.Comments = "";

				console.log(oLicenseData);
				oDataService.getModel("TransenerOperaciones").create(entity, oLicenseData, {
					success: function (data) {
						console.log(data);
						var oResponse = {
							bIsSol: bIsSol,
							responseData: data,
							licence: oLicenseData
						};
						resolve(oResponse);
					},
					error: function () {
						reject();
					}
				});
			})
		},

		POST: function (oResponse) {
			BusyDialogHelper.open();
			this.POSTLicense(oResponse).then($.proxy(this.successPOST, this)).catch($.proxy(this.errorPOST, this));
		},

		getTimeFormatted: function () {
			var dDate = new Date();
			let dDateFormatted = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
			let d = new Date(dDateFormatted);
			var sString = d.toISOString().split("T")[1].substr(0, 8);
			return sString.split(":").join("");
		},

		PostPromesa: function (sAnio, sTipoSol, sLicense, sLegajo, sName, sMail, sEmpresa, sRol) {
			var oPayload = {
				Empresa: sEmpresa,
				Id: sLicense,
				Anio: sAnio,
				Tipo: sTipoSol,
				Rol: sRol,
				Legajo: sLegajo,
				Nombre: sName,
				Mail: sMail,
				Fecha: new Date(),
				Hora: this.getTimeFormatted()
			};
			return new Promise((resolve, reject) => {
				var entity = "/PermisosLicenciaSet";
				oDataService.getModel("TransenerOperaciones").create(entity, oPayload, {
					success: resolve,
					error: reject
				});
			})
		},
		//for the sake of order i will left this method alive, but it does the same as the PostPromesa
		PutPromise: function (sAnio, sTipoSol, sLicense, sLegajo, sName, sMail, sEmpresa, sRol) {
			var oPayload = {
				Anio: sAnio,
				Empresa: sEmpresa,
				Id: sLicense,
				Tipo: sTipoSol,
				Rol: sRol,
				Legajo: sLegajo,
				Nombre: sName,
				Mail: sMail,
				Fecha: new Date(),
				Hora: this.getTimeFormatted()
			};
			return new Promise((resolve, reject) => {
				var entity = "/PermisosLicenciaSet";
				//hacemos un create en vez de un update 
				oDataService.getModel("TransenerOperaciones").create(entity, oPayload, {
					success: resolve,
					error: reject
				});
			});
		},

		editLicense: function () {
			return new Promise((resolve, reject) => {
				var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
				var licenseClone = LicenceHelper.cloneLicense(oLicence);
				this.updateLicense(licenseClone, {
					success: resolve(licenseClone),
					error: reject
				});
			});
		},

		editComments: function () {
			return new Promise((resolve, reject) => {
				var oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
				var licenseClone = LicenceHelper.cloneLicense(oLicence);
				this.updateLicense(licenseClone, {
					success: resolve(licenseClone),
					error: reject
				});
			});
		},

		handlePromisePermisos: function (sAnio, sTipoSol, sLicense, sLegajo, sName, sMail, sEmpresa, sMode, sRol) {
			if (sMode === "CREATION") {
				return this.PostPromesa(sAnio, sTipoSol, sLicense, sLegajo, sName, sMail, sEmpresa, sRol)
			}
			if (sMode === "EDITION") {
				return this.PutPromise(sAnio, sTipoSol, sLicense, sLegajo, sName, sMail, sEmpresa, sRol)
			}
		},

		getPermisosPOSTArray: function (oLicense, sTipoSol, sId, oCurrentUser, oUserRoles) {
			var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
			var sCurrentUserMail = oUserJson.email;
			var sCurrentUserName = oUserJson.nombre + ", " + oUserJson.apellido;
			var aPromises = [];
			let solicitanteNombre = FormatterHelper.getSolicitanteName(oLicense.Solicitante);
			let solicitanteSuplenteNombre = FormatterHelper.getSolicitanteName(oLicense.SolSuplente);
			let JefeNombre = FormatterHelper.getJefeName(oLicense.Jefe);
			let JefeSuplenteNombre = FormatterHelper.getJefeName(oLicense.JefeSuplente);
			let solSuplenteAuxNombre = FormatterHelper.getSolicitanteName(oLicense.SolSuplenteAux);
			aPromises.push(
				this.handlePromisePermisos(oLicense.Anio, sTipoSol, sId, oCurrentUser.Legajo, sCurrentUserName, sCurrentUserMail, oCurrentUser.Empresa,
					"CREATION",
					"Creador"),
				this.handlePromisePermisos(oLicense.Anio, sTipoSol, sId, oLicense.Solicitante, solicitanteNombre, "", oCurrentUser.Empresa,
					"CREATION",
					"ope_solic-lic_transener"),
				this.handlePromisePermisos(oLicense.Anio, sTipoSol, sId, oLicense.SolSuplente, solicitanteSuplenteNombre, "", oCurrentUser.Empresa,
					"CREATION",
					"Solicitante_Suplente"),
				this.handlePromisePermisos(oLicense.Anio, sTipoSol, sId, oLicense.SolSuplenteAux, solSuplenteAuxNombre, "", oCurrentUser.Empresa,
					"CREATION",
					"Solicitante_Suplente_Auxiliar"),
				this.handlePromisePermisos(oLicense.Anio, sTipoSol, sId, oLicense.Jefe, JefeNombre, "", oCurrentUser.Empresa, "CREATION",
					"Jefe_Trabajo"),
				this.handlePromisePermisos(oLicense.Anio, sTipoSol, sId, oLicense.JefeSuplente, JefeSuplenteNombre, "", oCurrentUser.Empresa,
					"CREATION",
					"Jefe_Trabajo_Suplente")
			)
			return aPromises;
		},

		getPermisosPUTArray: function (oLicencia, sTipoSol, sLicenceId, oCurrentUser, oUserRoles) {
			var sYear = oLicencia.Anio;
			var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
			var sCurrentUserMail = oUserJson.email;
			var sCurrentUserName = oUserJson.nombre + ", " + oUserJson.apellido;
			var aPromises = [];
			let solicitanteNombre = FormatterHelper.getSolicitanteName(oLicencia.Solicitante);
			let solicitanteSuplenteNombre = FormatterHelper.getSolicitanteName(oLicencia.SolSuplente);
			let JefeNombre = FormatterHelper.getJefeName(oLicencia.Jefe);
			let JefeSuplenteNombre = FormatterHelper.getJefeName(oLicencia.JefeSuplente);
			let solSuplenteAuxNombre = FormatterHelper.getSolicitanteName(oLicencia.SolSuplenteAux);
			aPromises.push(
				this.handlePromisePermisos(sYear, sTipoSol, sLicenceId, oCurrentUser.Legajo, sCurrentUserName, sCurrentUserMail, oCurrentUser.Empresa,
					"EDITION", "Creador"),
				this.handlePromisePermisos(sYear, sTipoSol, sLicenceId, oLicencia.Solicitante, solicitanteNombre, "", oCurrentUser.Empresa,
					"EDITION",
					"ope_solic-lic_transener"),
				this.handlePromisePermisos(sYear, sTipoSol, sLicenceId, oLicencia.SolSuplente, solicitanteSuplenteNombre, "", oCurrentUser.Empresa,
					"EDITION", "Solicitante_Suplente"),
				this.handlePromisePermisos(sYear, sTipoSol, sLicenceId, oLicencia.SolSuplenteAux, solSuplenteAuxNombre, "", oCurrentUser.Empresa,
					"EDITION", "Solicitante_Suplente_Auxiliar"),
				this.handlePromisePermisos(sYear, sTipoSol, sLicenceId, oLicencia.Jefe, JefeNombre, "", oCurrentUser.Empresa, "EDITION",
					"Jefe_Trabajo"),
				this.handlePromisePermisos(sYear, sTipoSol, sLicenceId, oLicencia.JefeSuplente, JefeSuplenteNombre, "", oCurrentUser.Empresa,
					"EDITION",
					"Jefe_Trabajo_Suplente")
			)
			return aPromises;
		},

		getMailsByPermisos: function (aPermisos, sRol) {
			/*var oCoordinado = aPermisos.find(oPermiso => {
				return oPermiso.Rol === sRol;
			});
			return [oCoordinado.Mail];*/

			var oParticipant = aPermisos.find(oPermiso => {
				return oPermiso.Rol === sRol;
			});
			return oParticipant ? [oParticipant.Mail] : [""];

		},

		PUTPermisosLicencia: function (responseData, bIsSol, oLicencia, oCurrentUser, oUserRoles) {
			//var tipo = oLicencia.Idsolicitud === this.nullId ? "Solicitud" : "Licencia";
			var tipo = oLicencia.Tipo === "S" ? "Solicitud" : "Licencia";
			var sTipoSol = bIsSol ? responseData.Tipo : oLicencia.Tipo
			var sLicenceId = bIsSol ? responseData.id : oLicencia.Idsolicitud === this.nullId ? oLicencia.Id : oLicencia.Idsolicitud;
			var aPermisos = this.getPermisosPUTArray(oLicencia, sTipoSol, sLicenceId, oCurrentUser, oUserRoles);
			Promise.all(aPermisos).then(() => {
				var sMessage = "";
				if (oLicencia.Licstat === "30" || oLicencia.Licstat === "02") {
					if (bIsSol)
						sMessage = "Edición exitosa, esta solicitud se ha convertido en licencia";
					else
						sMessage = `${tipo} modificada de manera exitosa`;
					BusyDialogHelper.close();
					MessageBoxHelper.showAlert("Alerta", sMessage, $.proxy(this.goToHome, this));
					return;
				}

				var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
				var sCurrentUserName = oUserJson.nombre + ", " + oUserJson.apellido;
				var sMessage = "";
				//PROCESO MAIL
				var aPromises = [];
				var oUsuariosAsignados = {
					Coordinador: "",
					Creador: oCurrentUser.Legajo + ", " + sCurrentUserName
				}
				aPromises.push(this.getPermisos(oLicencia));
				//TODO OJO MAIL TMB=???
				aPromises.push(EtMailService.getPromise(oLicencia.Empresa, oLicencia.Tplnr, this.getSelectionArea(oLicencia.Tipo, oLicencia.Licstat)));
				Promise.all(aPromises).then((aResPromises) => {
					var aEmails = [];
					var aPermisos = aResPromises[0];
					let hashPermisos = {};
					aPermisos.forEach(oPermiso => {
						hashPermisos[oPermiso.Rol] = oPermiso;
					});

					var sEmailEt = aResPromises[1].results && aResPromises[1].results !== 0 ? aResPromises[1].results.map(e => (e.Mail)).join(",") :
						""

					if (oLicencia.Tipo === "L") {
						var aEmailsPermisos = [hashPermisos["ope_solic-lic_transener"], hashPermisos["Solicitante_Suplente"], hashPermisos[
							"Solicitante_Suplente_Auxiliar"], hashPermisos["Jefe_Trabajo"], hashPermisos["Jefe_Trabajo_Suplente"]].map(permiso =>
								permiso &&
								permiso.Mail ||
								"juan.marone@transener.com.ar")
					} else {
						var aEmailsPermisos = []
					}

					aEmails = aEmails.concat(aEmailsPermisos);

					oUsuariosAsignados.Solicitante = hashPermisos["ope_solic-lic_transener"].Legajo + ", " + hashPermisos["ope_solic-lic_transener"].Nombre;
					oUsuariosAsignados.SolicitanteSuplente = hashPermisos["Solicitante_Suplente"].Legajo + ", " + hashPermisos[
						"Solicitante_Suplente"].Nombre;
					oUsuariosAsignados.Jefe = hashPermisos["Jefe_Trabajo"].Legajo + ", " + hashPermisos["Jefe_Trabajo"].Nombre;
					oUsuariosAsignados.JefeSuplente = hashPermisos["Jefe_Trabajo_Suplente"].Legajo + ", " + hashPermisos["Jefe_Trabajo_Suplente"]
						.Nombre;
					oUsuariosAsignados.SolSuplenteAux = hashPermisos["Solicitante_Suplente_Auxiliar"].Legajo + ", " + hashPermisos[
						"Solicitante_Suplente_Auxiliar"].Nombre;
					var sEmails = aEmails.join(",");
					//	var sEmailEt = "";
					var sInfAdicional = ""

					if (oLicencia.Licstat === "30") {
						sEmails = "";
						sEmailEt = "";
					}

					MailHelper.sendEmail(oLicencia, oUsuariosAsignados, sEmails, sEmailEt, sInfAdicional).then(() => {
						if (bIsSol) {
							sMessage = "Edición exitosa, esta solicitud se ha convertido en licencia";
						} else {
							if (oLicencia.Licstat === '09') {
								sMessage = `La ${tipo} se generó exitosamente`;
							} else {
								sMessage = `${tipo} modificada de manera exitosa`;
							}
						}
						BusyDialogHelper.close();
						MessageBoxHelper.showAlert("Alerta", sMessage, $.proxy(this.goToHome, this));
					}).catch((e) => {
						console.error(e);
						MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail.", $.proxy(this.goToHome, this));
					});
				}, (err) => {
					console.error(e);
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail.", $.proxy(this.goToHome, this));
				})

			}).catch((e) => {
				console.error(e);
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al editar los permisos", $.proxy(this.goToHome, this));
			});
		},

		getMailsByRole: function (sRole) {
			return new Promise((resolve, reject) => {
				if (sRole === "") {
					resolve([])
				} else {
					//var role = "Portal_Proveedores_Gestion";
					var cUrl = sap.ui.getCore().getModel("appCurrentInfo").appUrl + "/IAS/service/scim/Users/?filter=groups eq '" + sRole + "'"
					//var destination = "/destinations/Examinadores_PT15/";
					$.get(cUrl, function (res) {
						var users = res.Resources;
						var emails = users.map(function (user) {
							return user.emails[0].value;
						});
						resolve(emails);
						//resolve(["hzea@inclusion.cloud"])
					}).fail(reject);
				}

			});
		},

		/*getSchemaPromise: function (Id, Tipo, Anio, Empresa) {
			var aPromise = [];
			var aData = AppManagementHelper.getModel("UnifilarListModel").getData().Unifilares
			if (aData) {
				aData.forEach(e => {
					e.Id = Id
					e.Tipo = Tipo
					e.Anio = Anio
					e.Empresa = Empresa
				});
				for (var oData of aData) {
					aPromise.push(new Promise((resolve, reject) => {
						oDataService.getModel("TransenerOperaciones").create("/EsquemaUnifilarSet", oData, {
							success: resolve,
							error: reject
						});
					}));
				}
			}
			return aPromise;
		},*/

		getSelectionArea: function (Tipo, sLicstat) {
			var sVal = "";
			if (Tipo === "S") {
				if (sLicstat === "09") {
					sVal = "COORD"
				}
			} else {
				// Issue 514 - Para los status 09 y 02 se deben enviar a ambos tecnico y coord
				//				if (sLicstat === "09" || sLicstat === "02")
				//				sVal = "COORD"
				//		}
				// Issue 514 - Se agregaron nuevos status a la condicion
				if (sLicstat === "01" || sLicstat === "11" || sLicstat === "07" || sLicstat === "06" || sLicstat === "04" || sLicstat === "03") {
					sVal = "TECNICO"
				}
			}
			return sVal;
		},

		POSTPermisosLicencias: function (responseData, bIsSol, oLicencia, oCurrentUser, oUserRoles) {
			var sTipoSol = bIsSol ? responseData.Tipo : "L"
			var sLicenceId = responseData.Id;
			var aPermisos = this.getPermisosPOSTArray(oLicencia, sTipoSol, sLicenceId, oCurrentUser, oUserRoles);
			//var aSchemas = this.getSchemaPromise(sLicenceId, responseData.Tipo, responseData.Anio, responseData.Empresa);
			//	aPermisos = aPermisos.concat(aSchemas);
			Promise.all(aPermisos).then(() => {
				var sMessage = "";
				//PROCESO MAIL
				var aPromises = [];
				aPromises.push(this.getPermisos(responseData));
				var oUserJson = AppManagementHelper.getModel("UserJsonModel").getData();
				var sCurrentUserName = oUserJson.nombre + ", " + oUserJson.apellido;
				var oUsuariosAsignados = {
					Coordinador: "",
					Creador: oCurrentUser.Legajo + ", " + sCurrentUserName
				}
				//TODO Creador
				switch (oLicencia.Licstat) {
					case "30":
						if (bIsSol) {
							sMessage = "Solicitud Nº " + sLicenceId + " creada con exito";
							AppManagementHelper.getModel("LicenciaClonadaID");
							AppManagementHelper.getModel("LicenciaClonadaID").setData({
								"IdClonada": sLicenceId
							});
						} else {
							sMessage = "Licencia Nº" + sLicenceId + " creada con exito";
							AppManagementHelper.getModel("LicenciaClonadaID");
							AppManagementHelper.getModel("LicenciaClonadaID").setData({
								"IdClonada": sLicenceId
							});
						}
						//	BusyDialogHelper.close();
						//	MessageBoxHelper.showAlert("Alerta", sMessage, $.proxy(this.goToHome, this));
						//	return;
						aPromises.push(this.getMailsByRole(""));
						break;
					case "09":
						//se hace pero no uso esto 460 461
						aPromises.push(this.getMailsByRole(this.rolCoordinador + "_" + FormatterHelper.centroToRegion(oLicencia.Werks)));
						break;
					case "07":
						oUsuariosAsignados.RecepOper = oUsuariosAsignados.Creador;
						aPromises.push(this.getMailsByRole(this.rolTramitador));
						break;
				}

				aPromises.push(EtMailService.getPromise(oLicencia.Empresa, oLicencia.Tplnr, this.getSelectionArea(oLicencia.Tipo, oLicencia.Licstat)));
				Promise.all(aPromises).then((aResPromises) => {
					// var aEmails = ["hzea@inclusion.cloud"];
					var aEmails = [];

					let sEmailEt = aResPromises[2].results && aResPromises[2].results !== 0 ? aResPromises[2].results.map(e => (e.Mail)).join(",") :
						"";
					var sInfAdicional = "";
					var aPermisos = aResPromises[0];
					let hashPermisos = {};
					aPermisos.forEach(oPermiso => {
						hashPermisos[oPermiso.Rol] = oPermiso;
					});

					if (oLicencia.Tipo === "L") {
						var aEmailsPermisos = [hashPermisos["ope_solic-lic_transener"], hashPermisos["Solicitante_Suplente"], hashPermisos[
							"Solicitante_Suplente_Auxiliar"], hashPermisos["Jefe_Trabajo"], hashPermisos["Jefe_Trabajo_Suplente"]].map(permiso =>
								permiso &&
								permiso.Mail ||
								"juan.marone@transener.com.ar")
					} else {
						// Issue 581 - Se debe enviar correo al Solicitante ,  Creador y Coordinador de Mantenimiento cuando se genere una solicitud
						var aEmailsPermisos = [hashPermisos["ope_solic-lic_transener"], hashPermisos["Creador"]].map(permiso =>
							permiso &&
							permiso.Mail);
						// Los coordinadores de Mantenimientos se obtuvieron  en un paso anterior
						// aEmailsPermisos = aEmailsPermisos.concat(aResPromises[1]);

						// #581 LT - cambiar destinatarios de mail en SOLICITUDES Coordinadas 
						aEmailsPermisos = (aResPromises[2].results && aResPromises[2].results.length !== 0) ? aEmailsPermisos.concat(aResPromises[2].results
							.map(e => e.Mail)) : aEmailsPermisos;
					}

					aEmails = aEmails.concat(aEmailsPermisos);
					var sEmails = aEmails.join(",");

					oUsuariosAsignados.Solicitante = hashPermisos["ope_solic-lic_transener"].Legajo + ", " + hashPermisos["ope_solic-lic_transener"].Nombre;
					oUsuariosAsignados.SolicitanteSuplente = hashPermisos["Solicitante_Suplente"].Legajo + ", " + hashPermisos[
						"Solicitante_Suplente"].Nombre;
					oUsuariosAsignados.Jefe = hashPermisos["Jefe_Trabajo"].Legajo + ", " + hashPermisos["Jefe_Trabajo"].Nombre;
					oUsuariosAsignados.JefeSuplente = hashPermisos["Jefe_Trabajo_Suplente"].Legajo + ", " + hashPermisos["Jefe_Trabajo_Suplente"]
						.Nombre;
					oUsuariosAsignados.SolSuplenteAux = hashPermisos["Solicitante_Suplente_Auxiliar"].Legajo + ", " + hashPermisos[
						"Solicitante_Suplente_Auxiliar"].Nombre;

					//blanquear todo para estado CREADA, no debe llegarle a nadie.460 461
					if (oLicencia.Licstat === "30") {
						sEmails = "";
						sEmailEt = "";
					}

					MailHelper.sendEmail(responseData, oUsuariosAsignados, sEmails, sEmailEt, sInfAdicional).then(() => {
						if (bIsSol)
							sMessage = "Solicitud Nº " + sLicenceId + " creada con exito";
						else
							sMessage = "Licencia Nº " + sLicenceId + " creada con exito";
						AppManagementHelper.getModel("LicenciaClonadaID");
						AppManagementHelper.getModel("LicenciaClonadaID").setData({
							"IdClonada": sLicenceId
						});
						BusyDialogHelper.close();
						MessageBoxHelper.showAlert("Alerta", sMessage, $.proxy(this.goToHome, this));
					}).catch((e) => {
						console.error(e);
						MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail.", $.proxy(this.goToHome, this));
					});
				}, (err) => {
					console.error(err);
					MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al enviar mail.", $.proxy(this.goToHome, this));
				})
			}, (err) => {
				console.error(err);
				MessageBoxHelper.showAlert("Alerta", "Se ha producido un error al crear los permisos", $.proxy(this.goToHome, this));
			});

		},

		successPOST: function (oResponse) {
			var oCurrentUserData = AppManagementHelper.getModel("CurrentUser").getData();
			var oUserRoles = AppManagementHelper.getModel("UserJsonModel").getData();
			this.POSTPermisosLicencias(oResponse.responseData, oResponse.bIsSol, oResponse.licence, oCurrentUserData, oUserRoles);
		},

		goToHome: function () {
			AppManagementHelper.getModel("refreshSearch").setData({
				"data": true
			});
			AppManagementHelper.getAppRouter().navTo("Licencias");
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
				default:
					return object.value !== "";
			}
		},

		generateAdvancedFilters: function () {
			var oFilterData = AppManagementHelper.getModel("FiltersJsonModel").getData();
			var aFilters = [];
			// RECORRIDO DE ATRIBUTOS 
			for (var atribute in oFilterData) {
				// en el recorrido del model de filtros, evaluamos los arrays para creacion de filtros multiples
				if (oFilterData[atribute]["value"] !== null && oFilterData[atribute]["value"].constructor === Array) {
					var aValues = oFilterData[atribute]["value"];
					if (aValues.length !== 0) {
						var aMultipleFilter = [];
						for (var value in aValues) {
							var oFilterValues = this.getFilterObject(aValues[value]);
							aMultipleFilter.push(new sap.ui.model.Filter(oFilterValues.attribute, sap.ui.model.FilterOperator[oFilterData[atribute][
								"operator"
							]], oFilterValues.value));
						}
						var oMultipleFilter = new sap.ui.model.Filter({
							filters: aMultipleFilter,
							and: false
						});
						aFilters.push(oMultipleFilter);
					}
				} else {
					if (this.acceptEmptyValues(atribute, oFilterData[atribute])) {
						// casos fechas null, no es vacio, porque el date tiene que ser null para presetarse sin nada.
						if (oFilterData[atribute]["value"] !== null) {
							// si es atributo fecha hora tratamiento especial
							if (atribute === "Solbeg" || atribute === "Solend") {
								//var oFormattedDate = moment(oFilterData[atribute]["value"].setHours(0, 0, 0, 0)).toDate();
								aFilters.push(new sap.ui.model.Filter(atribute, sap.ui.model.FilterOperator[oFilterData[atribute]["operator"]], oFilterData[
									atribute]["value"]));
							} else {
								// pusheado normal de todos los demas atributos con su filter operator y su valor tranca
								aFilters.push(new sap.ui.model.Filter(atribute, sap.ui.model.FilterOperator[oFilterData[atribute]["operator"]], oFilterData[
									atribute]["value"]));
							}
						}
					}
				}
			}

			return aFilters;
		},

		getFilterObject: function (sValue) {
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
					oObject.attribute = "Ninguna";
					oObject.value = "X";
					break;
			}
			return oObject;

		},

		errorPOST: function (error) {
			BusyDialogHelper.close();
			var sError = FormatHelper.parseJsonError(error);
			MessageBoxHelper.showAlert("Alert", sError);
		},

		PUTPromise: function (bSolChanged) {
			return new Promise((resolve, reject) => {
				let oLicence = AppManagementHelper.getModel("LicenseJsonModel").getData();
				var licenseClone = LicenceHelper.cloneLicense(oLicence);
				licenseClone.Licstat = this.getLicStatByRol(licenseClone.Tipolicencia, licenseClone.Licstat)
				let entity = "/LicenciaTrabajoSet";
				FormatHelper.formatTimes(licenseClone);
				this.deleteNavProperties(licenseClone);
				if (licenseClone.Rdisparo === "Y") licenseClone.Rdisparo = "";
				if (licenseClone.Equstat === "Y") licenseClone.Equstat = "";
				oDataService.getModel("TransenerOperaciones").update(entity + "(Empresa='" + licenseClone.Empresa + "',Id='" + licenseClone.Id +
					"',Tipo='" + licenseClone.Tipo + "',Anio='" + licenseClone.Anio + "')", licenseClone, {
					success: function (data) {
						var oResponse = {
							bIsSol: bSolChanged,
							responseData: data,
							licence: licenseClone
						}
						resolve(oResponse);
					},
					error: function () {
						reject(error);
					}
				});
			});
		},

		PUT: function (bSolChanged) {
			BusyDialogHelper.open();
			this.PUTPromise(bSolChanged).then($.proxy(this.successPUT, this)).catch($.proxy(this.errorPUT, this))
		},

		successPUT: function (oResponse) {
			var oCurrentUserData = AppManagementHelper.getModel("CurrentUser").getData();
			var oUserRoles = AppManagementHelper.getModel("UserJsonModel").getData();
			this.PUTPermisosLicencia(oResponse.responseData, oResponse.bIsSol, oResponse.licence, oCurrentUserData, oUserRoles);
		},

		errorPUT: function () {
			BusyDialogHelper.close();
			MessageBoxHelper.showAlert("Alerta", "Error al modificar");
		},

		logTramitationChange: function (tramitador) {
			return new Promise((resolve, reject) => {
				let entitySet = "/RegistroFechaTramitacionSet";
				let license = AppManagementHelper.getModel("LicenseJsonModel").getData();
				let toSave = {
					Empresa: license.Empresa,
					Id: license.Id,
					Tipo: license.Tipo,
					Anio: license.Anio,
					Fecha: new Date(),
					Tramitador: tramitador
				};
				oDataService.getModel("TransenerOperaciones").create(entitySet, toSave, {
					success: resolve,
					error: reject
				});
			});

		},

		getFullTramitacionesWithCalendarDates: function () {
			var aTramitaciones = AppManagementHelper.getModel("TramitacionListJsonModel") ? AppManagementHelper.getModel(
				"TramitacionListJsonModel").getData().Tramitaciones : [];
			var aPromises = [];

			aTramitaciones.map((oTramitacion) => {
				aPromises.push(this.getDatesFromTramitacion(oTramitacion));
			});

			Promise.all(aPromises).then((aCalendarDates) => {

				aTramitaciones.map((Tramit, index) => {
					aCalendarDates.map((oCalendarDates) => {
						Tramit.CalendarDates = aCalendarDates[index].results;
					});
					AppManagementHelper.getModel("TramitacionListJsonModel").setProperty("/CalendarDates", Tramit.CalendarDates);
				});

			});
		}

	};
});