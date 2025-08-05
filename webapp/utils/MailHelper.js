sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatterHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (FormatterHelper, FormatHelper, AppManagementHelper) {
	"use strict";

	return {
		// RL: Cancela por multiples includes
		getToken: function () {
			return new Promise((resolve, reject) => {
				$.ajax({
				//	url: this._getWorkflowRuntimeBaseURL() + "/bpmworkflowruntime/rest/v1/xsrf-token",
					url: this._getWorkflowRuntimeBaseURL() + "/xsrf-token",
					method: "GET",
					headers: {
						"X-CSRF-Token": "Fetch"
					},
					success: function (result, xhr, data) {
						let token = data.getResponseHeader("X-CSRF-Token");
						resolve(token);
					},
					error: reject
				});
			});
		},

		// RL: Cancela por multiples includes
		_getWorkflowRuntimeBaseURL: function () {
			//var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appId = AppManagementHelper.getModel("appId").getData()
			var appPath = appId.replaceAll(".", "/");
			var appModulePath = jQuery.sap.getModulePath(appPath);

			return appModulePath + "/bpmworkflowruntime/v1";
			//return appModulePath 
	
		},

		formatMailsARO: function (aMails) {
			var sMails = [];
			aMails.map(function (item) {
				sMails.push(item.Mail);
			});
			return sMails.toString();
		},

		sendEmail: function (...params) {
			var that = this;
			return new Promise((resolve, reject) => {
				this.getToken().then((token) => {
					$.ajax({
						url: this._getWorkflowRuntimeBaseURL() + "/workflow-instances",
						//url: "/bpmworkflowruntime/rest/v1/workflow-instances",
						method: "POST",
						async: false,
						contentType: "application/json",
						headers: {
							"X-CSRF-Token": token
						},
						data: JSON.stringify({
							definitionId: "wrfltsendmails",
							context: prepareContext(...params)
						}),
						success: resolve,
						error: reject
					});
				}, reject);

			});

			function prepareContext(licencia, usuariosAsignados, destinatario, mailEt, infAdicional, esAnulacion, MotivoDeAnulacion,
				ObservacionDeAnulacion, fechaAnulacion, vieneDeTramitacion, vieneDeObservacion,vieneDeCalendarioTramitacion, comentObserCoord, nameLegacyObservator,
				vieneDeCoordinacion, vieneDeCancelacion, nameLegacyCoordinator, nameLegacyTramitador, MotivoObservacion, ComentarioObservacion,
				MotivoNoAut, ComentariosNoAut) {

				var those = that;
				let workPlaces = AppManagementHelper.getModel("WorkPlacesJsonModel").getProperty("/WorkPlaces");
				let equipos = AppManagementHelper.getModel("EquiposJsonModel").getProperty("/Equipos");
				let estaciones = AppManagementHelper.getModel("EstacionesJsonModel").getProperty("/Estaciones");
				let tiemposReposicion = AppManagementHelper.getModel("RepositionTimes").getProperty("/RepositionTimes");
				let tiempo = tiemposReposicion.find(x => x.Valkey == licencia.Tiemporep);
				let tiempoDesc = tiempo && tiempo.Valtext;
				let context = Object.assign({}, licencia);
				let workPlace = workPlaces.find(x => x.Arbpl == licencia.Arbpl);
				let workPlaceDescription = workPlace ? workPlace.Ktext : "";
				let descEquipo = '';
				let estacion = estaciones && estaciones.find(x => x.Codigo == licencia.Tplnr);
				let descEstacion = estacion ? estacion.Descripcion : "";
				let timbeg = licencia.Timbeg.ms ? licencia.Timbeg.ms : licencia.Timbeg;
				let timend = licencia.Timend.ms ? licencia.Timend.ms : licencia.Timend;

				if (timbeg[0] && timbeg[0] == "P") {
					timbeg = timbeg.replace(/PT(\d+)H(\d+)M(\d+)S/, (match, $1, $2) => {
						let str = ($1.length > 1 ? $1 : "0" + $1) + ":" + ($2.length > 1 ? $2 : "0" + $2);
						return str;
					});
				} else {
					if (timbeg.ms === 0) {
						timbeg = new Date().setHours("21", "00", "00", "00");
					}
					timbeg = FormatHelper.getTimeString(timbeg);
				}

				if (timend[0] && timend[0] == "P") {
					timend = timend.replace(/PT(\d+)H(\d+)M(\d+)S/, (match, $1, $2) => {
						let str = ($1.length > 1 ? $1 : "0" + $1) + ":" + ($2.length > 1 ? $2 : "0" + $2);
						return str;
					});
				} else {
					if (timend.ms === 0) {
						timend = new Date().setHours("21", "00", "00", "00");
					}
					timend = FormatHelper.getTimeString(timend);
				}

				var mailsARO = "";
				if (AppManagementHelper.getModel("MailsAROModel").getData().Mails && AppManagementHelper.getModel("MailsAROModel").getData().Mails.length !== 0 && licencia.Licstat !== "30") {
					mailsARO = those.formatMailsARO(AppManagementHelper.getModel("MailsAROModel").getData().Mails);
				}

				context.Destinatario = destinatario;
				//context.Destinatario = "guillermo.quattrocchi@altromondo.com.ar";

				// Si viene de anulacion
				if (esAnulacion === true) {
					licencia.Licstat = '03';
					context.MotivoDeAnulacionTITLE = 'Motivo de Anulación: ';
					context.ObservacionDeAnulacionTITLE = 'Observación de Anulación: ';
					context.FechaAnulacionTITLE = 'Fecha y Hora de Anulación: ';
					context.MotivoDeAnulacion = MotivoDeAnulacion;
					context.ObservacionDeAnulacion = ObservacionDeAnulacion;
					context.FechaAnulacion = fechaAnulacion;
				} else {
					context.MotivoDeAnulacionTITLE = '';
					context.ObservacionDeAnulacionTITLE = '';
					context.FechaAnulacionTITLE = '';
					context.MotivoDeAnulacion = '';
					context.ObservacionDeAnulacion = '';
					context.FechaAnulacion = '';
				}

				// Si viene de tramitacion
				if (vieneDeTramitacion === true) {
					if (licencia.Licstat === '07' || licencia.Licstat === '01' || licencia.Licstat === '23' || licencia.Licstat === '06') { //Si se esta tramitando por primera vez el estado llega como coordinada 07
						var estadoSegunTramitaciones = AppManagementHelper.getModel("TramitacionStatusModel").getData().StatusText;
						if (estadoSegunTramitaciones === 'Trámite Autorizado') {
							licencia.Licstat = '01';
						} else if (estadoSegunTramitaciones === 'Trámite No Autorizado') {
							licencia.Licstat = '06';
						} else if (estadoSegunTramitaciones === 'En Trámite') {
							licencia.Licstat = '23';
						}
					}
				}
						// Si viene de tramitacion
						if (vieneDeCalendarioTramitacion === true) {
							if (licencia.Licstat === '07' || licencia.Licstat === '01' || licencia.Licstat === '23' || licencia.Licstat === '06') { //Si se esta tramitando por primera vez el estado llega como coordinada 07
								var estadoSegunTramitaciones = AppManagementHelper.getModel("TramitacionStatusModel").getData().StatusText;
								if (estadoSegunTramitaciones === 'Trámite Autorizado') {
									licencia.Licstat = '01';
								} else if (estadoSegunTramitaciones === 'Trámite No Autorizado') {
									licencia.Licstat = '06';
								} else if (estadoSegunTramitaciones === 'En Trámite') {
									licencia.Licstat = '23';
								}
							}
						}

				// Si viene de Observacion
				if (vieneDeObservacion) {
					licencia.Licstat = '02';
				}

				if (vieneDeCoordinacion) {
					licencia.Licstat = '07';
				}

				if (vieneDeCancelacion) {
					licencia.Licstat = '11';
				}

				if (licencia.Licstat === "23") {
					context.AccionText = 'está ' + FormatterHelper.getStatusName(licencia.Licstat);
				} else {
					context.AccionText = 'ha sido ' + FormatterHelper.getStatusName(licencia.Licstat);
				}

				if (licencia.Tipo === 'L') {
					context.SolOLicAsunto = 'Licencia';
					context.SolOLicCuerpo = 'Licencia de trabajo';
					context.TipoDeSolicitudTITLE = 'Tipo de Licencia:';
					context.TipoLic = FormatterHelper.getTipoLicencia(licencia.Tipolicencia);
				} else {
					context.SolOLicAsunto = 'Solicitud';
					context.SolOLicCuerpo = 'Solicitud';
					context.TipoDeSolicitudTITLE = '';
					context.TipoLic = '';
				}

				context.ModalidadTrabajo = licencia.Period === "C" ? "Continua" : "Diaria";
				context.MailET = mailEt;
				context.MailAro = licencia.Aro === "X" ? mailsARO : "";
				context.MailAro = licencia.Licstat === "01" || licencia.Licstat === "07" ? context.MailAro : "";
				context.Licstat = licencia.Licstat;
				context.Estado = FormatterHelper.getStatusName(licencia.Licstat);
				context.Desde = FormatHelper.formatDate(licencia.Solbeg) + " " + timbeg;
				context.Hasta = FormatHelper.formatDate(licencia.Solend) + " " + timend;
				context.Instalacion = workPlaceDescription;
				context.Trabajo = licencia.Descripcion;
				context.Ubicacion = licencia.Tplnr;
				context.UbDescript = descEstacion;
				context.Equipo = licencia.Equnr || "";
				context.EqDescript = descEquipo;
				context.InfAdicional = infAdicional || "";
				context.Equinterv = licencia.Equiinterv;
				context.Calendario = "Prueba de calendario"

				// nuevos
				context.EstadoEQCamm = licencia.Equstat === "N" ? "" : licencia.Equstat === "X" ? "E/S" : "F/S";
				context.EstadoEQNOCamm = licencia.Equstatnocam === "N" ? "" : licencia.Equstatnocam === "X" ? "E/S" : "F/S";
				context.EstadoSemanal = "";
				context.ComentariosCammesa = "";
				context.ComentariosObserSol = licencia.Licstat === "02" ? comentObserCoord : "";
				context.ComentariosAnulSol = licencia.Licstat === "03" ? MotivoDeAnulacion : "";

				// nuevoslic
				context.MotivoObservacion = licencia.Licstat === "02" ? MotivoObservacion : "";
				context.ComentarioObservacion = licencia.Licstat === "02" ? ComentarioObservacion : "";
				context.MotivoNoAut = licencia.Licstat === "06" ? MotivoNoAut : "";
				context.ComentariosNoAut = licencia.Licstat === "06" ? ComentariosNoAut : "";
				context.Aro = licencia.Aro === "X" ? "Si" : "No";
				context.AroComent = licencia.Sindivi;
				context.TiempoRepo = tiempoDesc || "";
				context.Creador = usuariosAsignados.Creador || "";
				context.Solicitante = usuariosAsignados.Solicitante || "";
				context.SolicitanteSuplente = usuariosAsignados.SolicitanteSuplente || "";
				context.SolSupAux = usuariosAsignados.SolSuplenteAux || "";
				context.Jefe = usuariosAsignados.Jefe || "";
				context.JefeSuplente = usuariosAsignados.JefeSuplente || "";

				context.Observador = licencia.Licstat === "02" ? nameLegacyObservator : "";
				context.Anulador = licencia.Licstat === "03" ? licencia.Anulador : "";
				context.Coordinador = licencia.Licstat === "11" || licencia.Licstat === "07" || licencia.Licstat === "03" || licencia.Licstat === "01" || licencia.Licstat === "06" ? nameLegacyCoordinator || "" : "";
				context.Tramitador = (licencia.Licstat === "01" || licencia.Licstat === "06" || licencia.Licstat === "03" || licencia.Licstat === "11") ? nameLegacyTramitador || "" : "";

				context.RecepOper = usuariosAsignados.RecepOper || "";
				context.UrlToLicense = "https://" + window.location.host + window.location.hash.split("&")[0] + "&/" + licencia.Id + ":" + licencia.Tipo + ":" + licencia.Empresa + ":" + licencia.Anio;
				context.society = context.Empresa === "100" ? "TRANSENER" : "TRANSBA";
				context.WorkflowRoad = "";

				return context;
			}
		},
	}
});