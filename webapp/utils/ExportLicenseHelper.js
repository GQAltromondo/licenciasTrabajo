sap.ui.define([
	"./FormatHelper",
	"./FormatterHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper"
	//helpers
], function (FormatHelper, FormatterHelper, AppManagementHelper, BusyDialogHelper) {
	"use strict";

	return {

		createPdfSimpBody: function (content, licencia, oTextos) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'ET:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Tplnr
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Pto. Resp. De Trabajo:'
				}, {
					width: '*',
					fontSize: 9,
					text: FormatterHelper.getPuestoDescription(licencia.Arbpl)
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Region/Distrito:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Werks, 'Regiones')
				}
					// {
					// 	width: '*',
					// 	fontSize: 9,
					// 	margin: [0, 0, 5, 0],
					// 	bold: true,
					// 	text: 'Solicitante'
					// }, {
					// 	width: '*',
					// 	fontSize: 9,
					// 	text: licencia.Solicitante + ' ' + FormatterHelper.getSolicitanteName(licencia.Solicitante)
					// },
				],
				margin: [0, 0, 0, 10]
			}, {
				columns: [{
					width: '16.6%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Equipo solicitado CAMMESA:'
				}, {
					width: '16.6%',
					fontSize: 9,
					text: licencia.Equnr
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Estado Equipo CAMMESA:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Equstat, 'Equstat')
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: ''
				}, {
					width: '*',
					fontSize: 9,
					text: ''
				}],
				margin: [0, 0, 0, 10]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Equipo/s a intervenir:'
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					text: licencia.Equiinterv //this.getText(licencia.Equstatnocam, 'Equstatnocam')
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Estado Equipo/s a intervenir:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Equstatnocam, 'Equstatnocam')
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Solicitante'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Solicitante + ' ' + FormatterHelper.getSolicitanteName(licencia.Solicitante)
				},

				]
			}, {
				margin: [0, 0, 0, 5],
				columns: [{
					width: '100%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Descripción del trabajo a realizar:'
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '100%',
					fontSize: 9,
					margin: [5, 0, 0, 0],
					text: licencia.Descripcion
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Fecha inicio:'
				}, {
					width: '*',
					fontSize: 9,
					text: FormatHelper.formatDateLicense(licencia.Solbeg)
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Hora inicio:'
				}, {
					width: '*',
					fontSize: 9,
					//text: getHoursMinutes(licencia.Timbeg)
					text: FormatHelper.formatTime(licencia.Timbeg)
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Período:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Period, 'Period')
				},]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '16.6%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Fecha Fin:'
				}, {
					width: '16.6%',
					fontSize: 9,
					text: FormatHelper.formatDateLicense(licencia.Solend)
				}, {
					width: '16.6%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Hora Fin:'
				}, {
					width: '16.6%',
					fontSize: 9,
					//text: getHoursMinutes(licencia.Timend) 
					text: FormatHelper.formatTime(licencia.Timend)
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Tiempo de Reposición:'
				}, {
					width: '*',
					fontSize: 9,
					text: FormatterHelper.getTiempoReposicionDesc(licencia.Tiemporep)
				}]
			});

			// Se agrega Jefe de Trabajo para reporte simplificado

			content.push({
				margin: [0, 0, 0, 10],
				columns: [{
					width: '33.33%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Jefe de trabajo:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Jefe + " - " + FormatterHelper.getPersonalHabilitadoName(licencia.Jefe)
				}]
			},);

			content.push({
				margin: [0, 0, 0, 10],
				columns: [{
					width: '33.33%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Condiciones de Trabajo:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Jobcond, 'Jobcond')
				},]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '33.33%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Requiere calle de 500 kV abierta:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.R500kv, 'R500kv')
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '33.33%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Requiere alguna Barra F/S:'
				}, {
					width: '33.33%',
					fontSize: 9,
					text: this.getText(licencia.Barrafs, 'Barrafs')
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Especificar Barra:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Barrafstx
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '33.33%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Bloqueo de Recierres:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Bloqueo, 'Bloqueo')
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '33.33%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'F/S con tensión de retorno:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Fstensionret, 'Fstensionret')
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '33.33%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Riesgo de Disparo:'
				}, {
					width: '*',
					fontSize: 9,
					bold: this.checkBold(licencia.Rdisparo),
					text: this.getText(licencia.Rdisparo, 'Rdisparo')
				}]
			}, {
				margin: [0, 0, 0, 5],
				columns: [{
					width: '100%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Comentarios del Solicitante:'
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '100%',
					margin: [5, 0, 0, 0],
					fontSize: 9,
					text: licencia.Solictext
				}]
			});

			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "MEDIDAS DE SEGURIDAD / CÓDIGO DE EQUIPOS",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 10]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Interruptores Abiertos y en Local / Extraidos:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Interabier
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Seccionadores Abiertos, Bloqueados y Trabados:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Seleccionad
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Seccionadores de PaT Cerrados:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Intercerr
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'PaT Adicionales(especificar lugar de conexión):'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Patadic
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Equipos a Mover / Pruebas Funcionales a Realizar:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Equimov
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Bloqueo de recierres (Sólo para TCT):'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Bloqueorecierretxt
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Interruptores que no deben Operarse (sólo para TcT):'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Intnooperar
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Otras Precauciones de Seguridad:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Precauciones
				}]
			},);
			return content;
		},
		createNormalPDFBody: function (content, licencia, oTextos, 
			// Colocaciones, Retiros, Habilitaciones, Inhibiciones,
			 Entregas,
			Devoluciones, Suspensiones, Reanudaciones,
			Observaciones, Coordinaciones, Tramitaciones,
			Transferencias) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Region/Distrito:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Werks, 'Regiones')
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Fecha de generacion:'
				}, {
					width: '*',
					fontSize: 9,
					text: FormatHelper.formatDateLicense(licencia.Gdate)
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Hora de generacion:'
				}, {
					width: '*',
					fontSize: 9,
					text: FormatHelper.formatTime(licencia.Gdate)
				},],
				margin: [0, 0, 0, 10]
			},);

			content.push({
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'ET:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Tplnr
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Pto. Resp. De Trabajo:'
				}, {
					width: '*',
					fontSize: 9,
					text: FormatterHelper.getPuestoDescription(licencia.Arbpl)
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Solicitante'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Solicitante + ' ' + FormatterHelper.getSolicitanteName(licencia.Solicitante)
				},],
				margin: [0, 0, 0, 10]
			}, {
				columns: [{
					width: '16.6%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Equipo solicitado CAMMESA:'
				}, {
					width: '16.6%',
					fontSize: 9,
					text: licencia.Equnr
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Estado Equipo CAMMESA:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Equstat, 'Equstat')
				}],
				margin: [0, 0, 0, 10]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '18%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Equipo/s a intervenir:'
				}, {
					width: '32%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					text: licencia.Equiinterv //this.getText(licencia.Equstatnocam, 'Equstatnocam')
				}, {
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Estado Equipo/s a intervenir:'
				}, {
					width: '25%',
					fontSize: 9,
					text: this.getText(licencia.Equstatnocam, 'Equstatnocam')
				}]
			}, {
				margin: [0, 0, 0, 5],
				columns: [{
					width: '100%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Descripción del trabajo a realizar:'
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '100%',
					fontSize: 9,
					margin: [5, 0, 0, 0],
					text: licencia.Descripcion
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Fecha inicio:'
				}, {
					width: '*',
					fontSize: 9,
					text: FormatHelper.formatDateLicense(licencia.Solbeg)
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Hora inicio:'
				}, {
					width: '*',
					fontSize: 9,
					//text: getHoursMinutes(licencia.Timbeg)
					text: FormatHelper.formatTime(licencia.Timbeg)
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Período:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Period, 'Period')
				},]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '16.6%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Fecha Fin:'
				}, {
					width: '16.6%',
					fontSize: 9,
					text: FormatHelper.formatDateLicense(licencia.Solend)
				}, {
					width: '16.6%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Hora Fin:'
				}, {
					width: '16.6%',
					fontSize: 9,
					//text: getHoursMinutes(licencia.Timend) 
					text: FormatHelper.formatTime(licencia.Timend)
				}]
			});

			content.push({
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Tipo de Intervención:'
				}, {
					width: '*',
					fontSize: 9,
					text: oTextos.TipintervText
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Estacional:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Estacional, 'Estacional')
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Capex:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Capex, 'Capex')
				}]
			});

			content.push({
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Condiciones de Trabajo:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Jobcond, 'Jobcond')
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Requiere calle de 500 kV abierta:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.R500kv, 'R500kv')
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Requiere alguna Barra F/S:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Barrafs, 'Barrafs')
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Especificar Barra:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Barrafstx
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Tiempo de Reposición:'
				}, {
					width: '*',
					fontSize: 9,
					text: FormatterHelper.getTiempoReposicionDesc(licencia.Tiemporep)
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Bloqueo de Recierres:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Bloqueo, 'Bloqueo')
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'F/S con tensión de retorno:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Fstensionret, 'Fstensionret')
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Riesgo de Disparo:'
				}, {
					width: '*',
					fontSize: 9,
					text: this.getText(licencia.Rdisparo, 'Rdisparo')
				}]
			}, {
				margin: [0, 0, 0, 5],
				columns: [{
					width: '100%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Comentarios del Solicitante:'
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '100%',
					margin: [5, 0, 0, 0],
					fontSize: 9,
					text: licencia.Solictext
				}]
			});

			content.push({
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'OT:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Aufnr
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Solicitante Suplente:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.SolSuplente + ' ' + FormatterHelper.getSolicitanteName(licencia.SolSuplente)
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Jefe de trabajo:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Jefe + ' ' + FormatterHelper.getJefeName(licencia.Jefe)
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Jefe de trabajo suplente:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.JefeSuplente + ' ' + FormatterHelper.getSolicitanteName(licencia.JefeSuplente)
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Solicitante suplente auxiliar:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.SolSuplenteAux ? this.getText(licencia.SolSuplenteAux, 'SolSuplenteAux') : '' //licencia.SolSuplenteAux ? licencia.SolSuplenteAux + ' ' + FormatterHelper.getSolicitanteName(licencia.SolSuplenteAux) : ''
				}]
			},);

			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "MEDIDAS DE SEGURIDAD / CÓDIGO DE EQUIPOS",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 10]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Interruptores Abiertos y en Local / Extraidos:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Interabier
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Seccionadores Abiertos, Bloqueados y Trabados:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Seleccionad
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Seccionadores de PaT Cerrados:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Intercerr
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'PaT Adicionales(especificar lugar de conexión):'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Patadic
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Equipos a Mover / Pruebas Funcionales a Realizar:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Equimov
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Bloqueo de recierres (Sólo para TCT):'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Bloqueorecierretxt
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Interruptores que no deben Operarse (sólo para TcT):'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Intnooperar
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Otras Precauciones de Seguridad:'
				}, {
					width: '75%',
					fontSize: 9,
					text: licencia.Precauciones
				}]
			},);

			content.push({
				margin: [0, 0, 0, 10],
				columns: [{
					width: '25%',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Coordinado con ARO:'
				}, {
					width: '75%',
					fontSize: 9,
					text: this.getText(licencia.Aro, 'Aro')
				}]
			}, {
				margin: [0, 0, 0, 5],
				columns: [{
					width: '100%',
					fontSize: 9,
					bold: true,
					text: 'Comentarios:'
				}]
			}, {
				margin: [5, 0, 0, 10],
				columns: [{
					width: '100%',
					fontSize: 9,
					text: licencia.Sindivi
				}]
			}, {
				margin: [0, 0, 0, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Señales Afectadas:'
				}]
			}, {
				margin: [10, 0, 10, 10],
				columns: [{
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Alarmas:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Senalalarmas
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Estados:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Senalestados
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Mediciones:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Senalmedicion
				}, {
					width: '*',
					fontSize: 9,
					margin: [0, 0, 5, 0],
					bold: true,
					text: 'Ninguna:'
				}, {
					width: '*',
					fontSize: 9,
					text: licencia.Senalninguna
				}]
			}, {
				margin: [0, 0, 0, 5],
				columns: [{
					width: '100%',
					fontSize: 9,
					bold: true,
					text: 'Especificar Señales Afectadas:'
				}]
			}, {
				margin: [10, 0, 0, 10],
				columns: [{
					width: '100%',
					fontSize: 9,
					text: licencia.Senalafect
				}]
			}, {
				table: {
					pageBreak: 'before',
					widths: ['*'],
					body: [
						[{
							text: "COORDINACIÓN",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 10]
			});

			content = this.createCoordination(Coordinaciones, content);
			content = this.createTramitacion(Tramitaciones, content);
			content = this.createAnulacion(licencia, content);
			content = this.createEntregasDevoluciones(licencia, Entregas, content, Devoluciones);
			// content = this.createColocacionesRetiros(licencia,Colocaciones,content,Retiros)
			//	 content = this.createHabilitacionesInhibiciones(licencia,Habilitaciones,content,Inhibiciones)
			content = this.createSuspensionReanudacion(content, Suspensiones, Reanudaciones,);
			content = this.createCancelacion(licencia, content);
			content = this.createLicTrabAutorizNoEntregEnTiempoReal(content, Entregas);
			content = this.transferenciaJefeTrabajo(Transferencias, content);
			content = this.createObservaciones(Observaciones, content);
			return content;

		},

		createPdfLicense: function (
			data, licencia,
			Colocaciones, Retiros, Habilitaciones, Inhibiciones, Entregas,
			Devoluciones, Suspensiones, Reanudaciones,
			Observaciones, Coordinaciones, Tramitaciones,
			Transferencias, oTextos, bExportType
		) {
			var x = licencia;

			if (window.define) {
				var temp = define.amd;
				define.amd = false;
			}
			jQuery.sap.registerModulePath("index", "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.60/");
			jQuery.sap.require({
				modName: "index.pdfmake"
			});
			jQuery.sap.require({
				modName: "index.vfs_fonts"
			});
			if (window.define) define.amd = temp;

			var numeroLicencia = licencia.Id;
			var tipo = licencia.Tipo == "L" ? "LICENCIA" : "SOLICITUD";
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';

			function ifHasUnifilaresPrintReferenceColorTable(aUnifilares) {
				if (aUnifilares.length) {
					content.push({
						table: {
							widths: ['*'],
							body: [
								[{
									text: "UNIFILARES REFERENCIA DE COLORES",
									alignment: 'center',
									fillColor: tableFillColor
								}]
							]
						},
						margin: [0, 20, 0, 0]
					}, {
						table: {
							widths: ['20%', '*'],
							body: [
								[{
									text: "Color",
									alignment: 'center',
									fontSize: 10,
									fillColor: tableFillColor2
								}, {
									text: "Detalle",
									fontSize: 10,
									alignment: 'center',
									fillColor: tableFillColor2
								},]
							]
						}
					}, {
						layout: 'noBorders',
						table: {
							widths: ['20%', '*'],
							body: [
								[{
									alignment: 'center',
									layout: 'noBorders',
									table: {
										widths: ['*'],
										body: [
											[{
												alignment: 'center',
												width: 25,
												image: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY2OTU5M0M0RUM3QzExRUFCRDBGQTE4NjU5Q0IxQjE5IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY2OTU5M0MzRUM3QzExRUFCRDBGQTE4NjU5Q0IxQjE5IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iQUQ0MUM1NEY0Nzg4M0Q0NzJEMzkyMEYyREREOUEzNUYiIHN0UmVmOmRvY3VtZW50SUQ9IkFENDFDNTRGNDc4ODNENDcyRDM5MjBGMkRERDlBMzVGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAAEuwAABNwAAAUXAAAFOP/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8IAEQgAGQAZAwERAAIRAQMRAf/EAHEAAQEAAAAAAAAAAAAAAAAAAAAJAQEBAQAAAAAAAAAAAAAAAAAACAkQAQAAAAAAAAAAAAAAAAAAAEARAQAAAAAAAAAAAAAAAAAAAEASAQAAAAAAAAAAAAAAAAAAAEATAQAAAAAAAAAAAAAAAAAAAED/2gAMAwEAAhEDEQAAAZ4U/oKAAAAAAAP/2gAIAQEAAQUCB//aAAgBAgABBQIH/9oACAEDAAEFAgf/2gAIAQICBj8CB//aAAgBAwIGPwIH/9oACAEBAQY/Agf/2gAIAQEDAT8hB//aAAgBAgMBPyEH/9oACAEDAwE/IQf/2gAMAwEAAhEDEQAAEP8A/wD/AP8A/wD/AP/aAAgBAQMBPxAH/9oACAECAwE/EAf/2gAIAQMDAT8QB//Z"
											}]
										]
									},
								}, {
									alignment: 'center',
									fontSize: 9,
									margin: [0, 6],
									text: 'Interruptor abierto y en local / extraído'
								}],
								[{
									alignment: 'center',
									layout: 'noBorders',
									table: {
										widths: ['*'],
										body: [
											[{
												alignment: 'center',
												width: 25,
												image: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhDQkVERDQ0RUM3QzExRUFBMkJBRDlENDIzMDU4OTA5IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhDQkVERDQzRUM3QzExRUFBMkJBRDlENDIzMDU4OTA5IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iQUQ0MUM1NEY0Nzg4M0Q0NzJEMzkyMEYyREREOUEzNUYiIHN0UmVmOmRvY3VtZW50SUQ9IkFENDFDNTRGNDc4ODNENDcyRDM5MjBGMkRERDlBMzVGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAAEuwAABNwAAAURAAAFMv/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8IAEQgAGQAZAwERAAIRAQMRAf/EAHEAAQEAAAAAAAAAAAAAAAAAAAAIAQEBAQAAAAAAAAAAAAAAAAAACAkQAQAAAAAAAAAAAAAAAAAAAEARAQAAAAAAAAAAAAAAAAAAAEASAQAAAAAAAAAAAAAAAAAAAEATAQAAAAAAAAAAAAAAAAAAAED/2gAMAwEAAhEDEQAAAYwlPf4AAAAAAAf/2gAIAQEAAQUCB//aAAgBAgABBQIH/9oACAEDAAEFAgf/2gAIAQICBj8CB//aAAgBAwIGPwIH/9oACAEBAQY/Agf/2gAIAQEDAT8hB//aAAgBAgMBPyEH/9oACAEDAwE/IQf/2gAMAwEAAhEDEQAAEAAAAAAAAP/aAAgBAQMBPxAH/9oACAECAwE/EAf/2gAIAQMDAT8QB//Z"
											}]
										]
									},
								}, {
									alignment: 'center',
									fontSize: 9,
									margin: [0, 6],
									text: 'Seccionador abierto bloqueado y trabado'
								}],
								[{
									alignment: 'center',
									layout: 'noBorders',
									table: {
										widths: ['*'],
										body: [
											[{
												alignment: 'center',
												width: 25,
												image: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk4N0RFOUY0RUM3QzExRUE5RDc4OEY0QjI0QkRCMDAyIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk4N0RFOUYzRUM3QzExRUE5RDc4OEY0QjI0QkRCMDAyIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iQUQ0MUM1NEY0Nzg4M0Q0NzJEMzkyMEYyREREOUEzNUYiIHN0UmVmOmRvY3VtZW50SUQ9IkFENDFDNTRGNDc4ODNENDcyRDM5MjBGMkRERDlBMzVGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAAEuwAABNwAAAURAAAFMv/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8IAEQgAGQAZAwERAAIRAQMRAf/EAHEAAQEAAAAAAAAAAAAAAAAAAAAJAQEBAQAAAAAAAAAAAAAAAAAABwkQAQAAAAAAAAAAAAAAAAAAAEARAQAAAAAAAAAAAAAAAAAAAEASAQAAAAAAAAAAAAAAAAAAAEATAQAAAAAAAAAAAAAAAAAAAED/2gAMAwEAAhEDEQAAAbDYA1EAAAAAAAf/2gAIAQEAAQUCB//aAAgBAgABBQIH/9oACAEDAAEFAgf/2gAIAQICBj8CB//aAAgBAwIGPwIH/9oACAEBAQY/Agf/2gAIAQEDAT8hB//aAAgBAgMBPyEH/9oACAEDAwE/IQf/2gAMAwEAAhEDEQAAENtttttttv/aAAgBAQMBPxAH/9oACAECAwE/EAf/2gAIAQMDAT8QB//Z"
											}]
										]
									},
								}, {
									alignment: 'center',
									fontSize: 9,
									margin: [0, 6],
									text: 'Seccionador de PaT cerrado'
								}],
								[{
									alignment: 'center',
									layout: 'noBorders',
									table: {
										widths: ['*'],
										body: [
											[{
												alignment: 'center',
												width: 25,
												image: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdEOEZENzI0RUM3QzExRUE5NzFGQzlCRDc2NTQ3MTUxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdEOEZENzIzRUM3QzExRUE5NzFGQzlCRDc2NTQ3MTUxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iQUQ0MUM1NEY0Nzg4M0Q0NzJEMzkyMEYyREREOUEzNUYiIHN0UmVmOmRvY3VtZW50SUQ9IkFENDFDNTRGNDc4ODNENDcyRDM5MjBGMkRERDlBMzVGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAAEugAABNsAAAUQAAAFMf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8IAEQgAGQAZAwERAAIRAQMRAf/EAHAAAQEAAAAAAAAAAAAAAAAAAAAIAQEBAAAAAAAAAAAAAAAAAAAACBABAAAAAAAAAAAAAAAAAAAAQBEBAAAAAAAAAAAAAAAAAAAAQBIBAAAAAAAAAAAAAAAAAAAAQBMBAAAAAAAAAAAAAAAAAAAAQP/aAAwDAQACEQMRAAABi6VInAAAAAAAH//aAAgBAQABBQIH/9oACAECAAEFAgf/2gAIAQMAAQUCB//aAAgBAgIGPwIH/9oACAEDAgY/Agf/2gAIAQEBBj8CB//aAAgBAQMBPyEH/9oACAECAwE/IQf/2gAIAQMDAT8hB//aAAwDAQACEQMRAAAQAAAAAAAA/9oACAEBAwE/EAf/2gAIAQIDAT8QB//aAAgBAwMBPxAH/9k="
											}]
										]
									},
								}, {
									alignment: 'center',
									fontSize: 9,
									margin: [0, 6],
									text: 'Equipos a mover / pruebas funcionales a realizar'
								}]

							]
						}
					});

				}
			};

			var content = [];

			function getHoursMinutes(fecha) {
				var fecha = new Date(fecha);
				var fechaFormated = FormatterHelper.msTohoursSeconds(fecha.getTime());
				return fechaFormated
			};

			var EmpresaLogo = "";
			if (licencia.Empresa === "100") {
				//TRANSENER
				var EmpresaLogo =
					"data:image/png;base64,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"
			} else {
				//TRANSBA
				var EmpresaLogo =
					"data:image/png;base64,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"
			}

			content.push({
				margin: [0, 0, 0, 20],
				table: {
					widths: ['*', '*', '*',],
					body: [
						[{
							width: 100,
							image: EmpresaLogo,
							alignment: 'center'
						}, {
							text: tipo + ' DE TRABAJO',
							alignment: 'center',
							fontSize: 14,
							margin: [0, 5, 0, 0]
						}, {
							text: 'N° ' + numeroLicencia,
							alignment: 'center',
							fontSize: 14,
							margin: [0, 5, 0, 0]
						}]
					]
				}
			});
			if (!bExportType) {
				content = this.createPdfSimpBody(content, licencia, oTextos);
			} else {
				content = this.createNormalPDFBody(content, licencia, oTextos,
					Entregas,
					Devoluciones, Suspensiones, Reanudaciones,
					Observaciones, Coordinaciones, Tramitaciones,
					Transferencias);
			}
			// Para el PFD Simplificado, retorno el contendio
			if (!bExportType) {
				return content;
			}

			let aImages = [];

			ifHasUnifilaresPrintReferenceColorTable(data.results);
			this.recursiveAddingRotatedImages(licencia, content, data.results, aImages);

		},
		getText: function (value, campo) {
			if (campo === 'Equstatnocam') {
				if (value === 'N') {
					return ''
				} else if (value === '') {
					return 'Fuera de Servicio'
				} else if (value === 'X') {
					return 'En Servicio'
				}
			}
			if (campo === 'Equstat') {
				if (value === 'X') {
					return 'En Servicio'
				} else if (value === 'N') {
					return ''
				} else if (value === '') {
					return 'Fuera de Servicio'
				}
			}
			if (campo === 'Bloqueo') {
				if (value === 'X') {
					return 'SI'
				} else if (value === 'N') {
					return 'NO'
				}
			}
			if (campo === 'Aro') {
				if (value === 'X') {
					return 'SI'
				} else if (value === 'N') {
					return 'NO'
				}
			}
			if (campo === 'R500kv') {
				if (value === 'X') {
					return 'SI'
				} else if (value === 'N') {
					return 'NO'
				} else if (value === 'Y') {
					return 'NO CORRESPONDE'
				} else {
					return ''
				}
			}
			if (campo === 'Barrafs') {
				if (value === 'X') {
					return 'SI'
				}
				if (value === '') {
					return ''
				} else {
					return 'NO'
				}
			}
			if (campo === "Rdisparo") {
				if (value === 'X') {
					return 'SI'
				} else if (value === 'NS') {
					return ''
				} else {
					return "NO"
				}
			}
			if (campo === 'Period') {
				if (value === 'D') {
					return 'Diaria'
				} else if (value === 'C') {
					return 'Continua'
				}
			}
			if (campo === 'Autorizado') {
				if (value === true) {
					return 'SI'
				} else if (value === false) {
					return 'NO'
				}
			}
			if (campo === 'Trascot') {
				if (value === 'X') {
					return 'SI'
				} else if (value === '') {
					return 'NO'
				}
			}
			if (campo === 'Empresa') {
				if (value === '100') {
					return 'TRANSENER S.A.'
				} else if (value === '300') {
					return 'TRANSBA S.A.'
				}
			}
			if (campo === 'Motivono') {
				if (value === 'COC') {
					return 'Suspendida por CAMMESA'
				} else if (value === 'COT/COTD') {
					return 'Suspendida por COT / COTDT'
				} else if (value === 'TERC') {
					return 'Suspendida por Terceros'
				} else if (value === 'SOLI') {
					return 'Suspendida por el Solicitante'
				} else if (value === 'COND') {
					return 'Condiciones climaticas adversas'
				} else if (value === 'NOUT') {
					return 'Dia no utilizado'
				}
			}
			if (campo === 'Regiones') {
				if (value === '103' || value === '113') {
					return 'Norte'
				} else if (value === '102') {
					return 'Reg. Metropolitana'
				} else if (value === '104' || value === '114') {
					return 'Sur'
				} else if (value === '') {
					return ''
				} else if (value === '') {
					return ''
				}
			}
			if (campo === 'Jobcond') {
				if (value === '01') {
					return 'Consignación'
				} else if (value === '02') {
					return 'Trabajo sin Tensión con PaT'
				} else if (value === '03') {
					return 'Trabajo con Tensión de Retorno'
				} else if (value === '04') {
					return 'Trabajo con Tensión (TcT)'
				} else if (value === '05') {
					return 'Trabajo Especiales (TcT)'
				} else if (value === '06') {
					return 'Condiciones Especiales'
				}
			}
			if (campo === 'Obscause') {
				if (value === 'MSEG') {
					return 'Modificacion de medidas de seguridad de LLTT'
				} else if (value === 'FECH') {
					return 'Modificacion de las fechas y horarios de LLTT'
				} else if (value === 'CAMP') {
					return 'Modificacion de otros campos de LLTT'
				}
			}
			if (campo === 'Fstensionret') {
				if (value === 'X') {
					return 'SI'
				} else if (value === 'N') {
					return 'NO'
				} else if (value === 'C') {
					return 'No Corresponde'
				}
			}
			if (campo === 'Estacional') {
				if (value === '1' || value === 'N') {
					return 'Estacional Pendiente'
				} else if (value === '2' || value === 'X') {
					return 'Estacional Vigente'
				} else if (value === '3') {
					return 'Estacional Adelantado'
				} else if (value === '4') {
					return 'No Estacional'
				}
			}
			if (campo === 'Capex') {
				if (value === 'N') {
					return 'N/A'
				} else if (value === 'X') {
					return 'SI'
				} else if (value === 'Y') {
					return 'NO'
				}
			}
			if (campo === 'EstadoDeTramitacion') {
				if (value === '01') {
					return 'Autorizado'
				} else if (value === '02') {
					return 'No Autorizado'
				} else if (value === '03') {
					return 'En Tramite'
				} else {
					return value
				}
			}
			if (campo === 'CausaNo') {
				if (value === 'ALTA') {
					return 'Alta Demanda'
				} else if (value === 'COND') {
					return 'Condiciones Climatidas Adversas'
				} else if (value === 'DEF1') {
					return 'Deficit de Generacion por combustible'
				} else if (value === 'DEF2') {
					return 'Deficit de Generacion por indisponibilidad de Maquinas'
				} else if (value === 'ELEV') {
					return 'Elavada Transmision de Potencia'
				} else if (value === 'LAPE') {
					return 'Limites Adicionales a los declarados en la programacion estacional'
				} else if (value === 'LIPE') {
					return 'Limites de Programacion estacional'
				} else if (value === 'SEGS') {
					return 'Por Seguridad del SADI'
				} else if (value === 'SUPE') {
					return 'Superposicion de Mantenimientos'
				} else if (value === 'TRAN') {
					return 'Imposibilidad de Transferncia por problemas tecnicos'
				} else {
					return value
				}
			}
			if (campo === 'SolSuplenteAux') {
				if (value === '00000000') {
					return ''
				} else {
					return value + ' ' + FormatterHelper.getSolicitanteName(value)
				}
			}

		},
		rotateImage: function (sImageWithoutRotation) {
			return new Promise((resolve, reject) => {
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				var image = new Image();
				image.src = sImageWithoutRotation;
				image.onload = () => {
					canvas.width = image.width;
					canvas.height = image.height;
					ctx.translate(canvas.width / 2, canvas.height / 2);
					ctx.rotate(270 * Math.PI / 180);
					ctx.translate(-canvas.height / 2, -canvas.width / 2);
					ctx.drawImage(image,
						0, 0, image.width, image.height,
						0, 0, image.height, image.width
					);
					var a = canvas.toDataURL();
					resolve(a);
				}
				image.onerror = (e) => {
					reject(e)
				}
			})
		},

		recursiveAddingRotatedImages: function (licencia, content, aUnifilares, aImages) {
			var element = aUnifilares.shift();
			if (element) {
				var oBlankImage = {
					width: 0,
					image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==",
					alignment: 'center'
				}
				let sImageWithoutRotation = element.Doctype + ',' + element.Imagenunifilar;
				this.rotateImage(sImageWithoutRotation).then((sImageWithRotation) => {
					if (element.Region === '103' || element.Region === '113') {
						element.Region = 'Norte'
					} else if (element.Region === '102') {
						element.Region = 'Reg. Metropolitana'
					} else if (element.Region === '104' || element.Region === '114') {
						element.Region = 'Sur'
					}
					aImages.push({
						margin: [0, 0, 0, 0],
						height: 740,
						width: 600,
						image: sImageWithRotation,
						alignment: 'center'
					}, {
						width: '*',
						fontSize: 10,
						margin: [10, 10, 10, 10],
						bold: true,
						alignment: 'left',
						text: 'ESQUEMA UNIFILAR: ' + element.TipoUnifilar + '/ ' + element.Et + '- ' + element.Nombre + '/ ' + element.Region
					})
					this.recursiveAddingRotatedImages(licencia, content, aUnifilares, aImages)
				}).catch(() => {
					this.recursiveAddingRotatedImages(licencia, content, aUnifilares, aImages)
				});
			} else {
				var tableFillColor = '#c4bd96';
				var numeroLicencia = licencia.Id;
				var aImagesRotated = aImages.length === 0 ? [oBlankImage] : aImages;
				content.push({
					margin: [0, 0, 0, 20],
					columns: []

				},
					...aImagesRotated, {
					table: {
						pageBreak: 'before',
						widths: ['*'],
						body: [
							[{
								text: "",
								alignment: 'center',
								fillColor: tableFillColor
							}]
						]
					},
					margin: [0, 0, 0, 10]
				});

				var fileType = licencia.Tipo == "L" ? "L-" : "S-";
				var fileName = fileType + numeroLicencia;

				var docDefinition = {
					header: (currentPage, pageCount) => {
						if (currentPage != 1) {
							return {
								columns: [
									{
										margin: [40, 10, 10, 10],
										text: 'N° ' + licencia.Id,
										fontSize: 15,
										style: { alignment: 'left', color: '#3c3c3c' },
										bold: true,
									},
								]
							}
						}
					},
					content: content
				};

				pdfMake.createPdf(docDefinition).download(fileName);
				BusyDialogHelper.close();
			}
		},

		createEntregasDevoluciones: function (licencia, Entregas, content, Devoluciones) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "ENTREGAS y DEVOLUCIÓNES DE EQUIPO",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 0]
			}, {
				table: {
					widths: ['*', '*'],
					body: [
						[{
							text: "Entrega",
							alignment: 'center',
							fontSize: 10,
							fillColor: tableFillColor2
						}, {
							text: "Devolución",
							alignment: 'center',
							fontSize: 10,
							fillColor: tableFillColor2
						},]
					]
				}
			});
			var entregaTableRow = [
				[{
					text: "Fecha",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Personal del Turno",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "TE/JT/JTG",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Folio ",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Comentarios ",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}]
			];
			var devolucionTableRow = [
				[{
					text: "Fecha",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [true, false, false, false]
				}, {
					text: "Personal del Turno",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "TE/JT/JTG",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Comentarios ",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}]
			];
			$.each(Entregas, function (index, item) {
				if (item.Motivono) return;
				if (!item.Tejt) return;
				if (item.Time) {
					var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
				} else {
					var time = 'N/A';
				}
				entregaTableRow.push(
					[{
						text: FormatHelper.formatDateLicense(item.Datelicencia) + " \n " + time,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Cot,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Tejt + " - " + FormatterHelper.getPersonalHabilitadoName(item.Tejt),
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Folio,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Commen,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}]
				);
			});
			$.each(Devoluciones, function (index, item) {
				if (!item.Tejt) return;
				if (item.Time) {
					var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
				} else {
					var time = 'N/A';
				}
				devolucionTableRow.push(
					[{
						text: FormatHelper.formatDateLicense(item.Datelicencia) + " \n " + time,
						alignment: 'center',
						fontSize: 8,
						border: [true, false, false, false]
					}, {
						text: item.Personal,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Tejt + " - " + FormatterHelper.getPersonalHabilitadoName(item.Tejt),
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Commen,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}]
				);
			});
			content.push({
				columns: [{
					table: {
						widths: ['20%', '20%', '20%', '19%', "21%"],
						body: entregaTableRow
					}
				}, {
					table: {
						widths: ['20%', '40%', '20%', '20%'],
						body: devolucionTableRow
					}

				}],
				margin: [0, 0, 0, 20]
			});
			return content;
		},
		// createColocacionesRetiros: function (licencia, Colocaciones, content, Retiros) {
		// 	var tableFillColor = '#c4bd96';
		// 	var tableFillColor2 = '#2980ba';
		// 	content.push({
		// 		table: {
		// 			widths: ['*'],
		// 			body: [
		// 				[{
		// 					text: "COLOCACION y RETIRO DE PAT",
		// 					alignment: 'center',
		// 					fillColor: tableFillColor
		// 				}]
		// 			]
		// 		},
		// 		margin: [0, 0, 0, 0]
		// 	}, {
		// 		table: {
		// 			widths: ['*', '*'],
		// 			body: [
		// 				[{
		// 					text: "Colocacion",
		// 					alignment: 'center',
		// 					fontSize: 10,
		// 					fillColor: tableFillColor2
		// 				}, {
		// 					text: "Retiro",
		// 					alignment: 'center',
		// 					fontSize: 10,
		// 					fillColor: tableFillColor2
		// 				},]
		// 			]
		// 		}
		// 	});
		// 	var colocacionTableRow = [
		// 		[{
		// 			text: "Fecha",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}, {
		// 			text: "ET",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}, {
		// 			text: "Comentarios ",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}]
		// 	];
		// 	var retiroTableRow = [
		// 		[{
		// 			text: "Fecha",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [true, false, false, false]
		// 		}, {
		// 			text: "ET",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}, {
		// 			text: "Comentarios ",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}]
		// 	];
		// 	$.each(Colocaciones, function (index, item) {
		// 		if (item.Time) {
		// 			var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
		// 		} else {
		// 			var time = 'N/A';
		// 		}
		// 		colocacionTableRow.push(
		// 			[{
		// 				text: FormatHelper.formatDateLicense(item.Datehab) + " \n " + time,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}, {
		// 				text: item.Tplnr,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}, {
		// 				text: item.Coment,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}]
		// 		);
		// 	});
		// 	$.each(Retiros, function (index, item) {
		// 		if (item.Time) {
		// 			var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
		// 		} else {
		// 			var time = 'N/A';
		// 		}
		// 		retiroTableRow.push(
		// 			[{
		// 				text: FormatHelper.formatDateLicense(item.Datehab) + " \n " + time,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [true, false, false, false]
		// 			}, {
		// 				text: item.Tplnr,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}, {
		// 				text: item.Coment,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}]
		// 		);
		// 	});
		// 	content.push({
		// 		columns: [{
		// 			table: {
		// 				widths: ['30%', '30%', '30%'],
		// 				body: colocacionTableRow
		// 			}
		// 		}, {
		// 			table: {
		// 				widths: ['30%', '30%', '30%'],
		// 				body: retiroTableRow
		// 			}

		// 		}],
		// 		margin: [0, 0, 0, 20]
		// 	});
		// 	return content;
		// },
		// createHabilitacionesInhibiciones: function (licencia, Habilitaciones, content, Inhibiciones) {
		// 	var tableFillColor = '#c4bd96';
		// 	var tableFillColor2 = '#2980ba';
		// 	content.push({
		// 		table: {
		// 			widths: ['*'],
		// 			body: [
		// 				[{
		// 					text: "HABILITACION e INHIBICION DE RECIERRE",
		// 					alignment: 'center',
		// 					fillColor: tableFillColor
		// 				}]
		// 			]
		// 		},
		// 		margin: [0, 0, 0, 0]
		// 	}, {
		// 		table: {
		// 			widths: ['*', '*'],
		// 			body: [
		// 				[{
		// 					text: "Habilitacion",
		// 					alignment: 'center',
		// 					fontSize: 10,
		// 					fillColor: tableFillColor2
		// 				}, {
		// 					text: "Inhibicion",
		// 					alignment: 'center',
		// 					fontSize: 10,
		// 					fillColor: tableFillColor2
		// 				},]
		// 			]
		// 		}
		// 	});
		// 	var habilitacionTableRow = [
		// 		[{
		// 			text: "Fecha",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}, {
		// 			text: "ET",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}, {
		// 			text: "Comentarios ",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}]
		// 	];
		// 	var inhibicionTableRow = [
		// 		[{
		// 			text: "Fecha",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [true, false, false, false]
		// 		}, {
		// 			text: "ET",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}, {
		// 			text: "Comentarios ",
		// 			alignment: 'center',
		// 			bold: true,
		// 			fontSize: 8,
		// 			border: [false, false, false, false]
		// 		}]
		// 	];
		// 	$.each(Habilitaciones, function (index, item) {
		// 		if (item.Time) {
		// 			var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
		// 		} else {
		// 			var time = 'N/A';
		// 		}
		// 		habilitacionTableRow.push(
		// 			[{
		// 				text: FormatHelper.formatDateLicense(item.Datehab) + " \n " + time,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}, {
		// 				text: item.Tplnr,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}, {
		// 				text: item.Coment,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}]
		// 		);
		// 	});
		// 	$.each(Inhibiciones, function (index, item) {
		// 		if (item.Time) {
		// 			var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
		// 		} else {
		// 			var time = 'N/A';
		// 		}
		// 		inhibicionTableRow.push(
		// 			[{
		// 				text: FormatHelper.formatDateLicense(item.Datehab) + " \n " + time,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [true, false, false, false]
		// 			}, {
		// 				text: item.Tplnr,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}, {
		// 				text: item.Coment,
		// 				alignment: 'center',
		// 				fontSize: 8,
		// 				border: [false, false, false, false]
		// 			}]
		// 		);
		// 	});
		// 	content.push({
		// 		columns: [{
		// 			table: {
		// 				widths: ['30%', '30%', '30%'],
		// 				body: habilitacionTableRow
		// 			}
		// 		}, {
		// 			table: {
		// 				widths: ['30%', '30%', '30%'],
		// 				body: inhibicionTableRow
		// 			}

		// 		}],
		// 		margin: [0, 0, 0, 20]
		// 	});
		// 	return content;
		// },
		createAnulacion: function (licencia, content) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "ANULACION",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 0]
			});
			var anulacionTableRow = [
				[{
					text: "Fecha y hora de anulación",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Observación de la anulación",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Motivo de anulación",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}]
			];
			if (!licencia) return
			anulacionTableRow.push(
				[{
					text: licencia.FechaAnulacion ? FormatHelper.formatDateLicense(licencia.FechaAnulacion) + " " + FormatHelper.getTimeString(licencia.HoraAnulacion
						.ms) : "",
					alignment: 'center',
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: FormatterHelper.findMotivoNoAut(licencia.Causaanulado),
					alignment: 'center',
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: licencia.Obscausa,
					alignment: 'center',
					fontSize: 8,
					border: [false, false, false, false]
				}]
			)
			content.push({
				columns: [{
					table: {
						widths: ['20%', '40%', '40%'],
						body: anulacionTableRow
					}
				}],
				margin: [0, 0, 0, 20]
			});
			return content;
		},
		createCancelacion: function (licencia, content) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "CANCELACION",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 0]
			}, {

			});
			var cancelacionTableRow = [
				[{
					text: "COT/COTDT",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Jefe de Trabajo",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Tecnico de ET",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Fecha y hora cancelación",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}]
			];
			if (!licencia) return
			cancelacionTableRow.push(
				[{
					text: licencia.CancFecha !== null ? licencia.CotCotdt + " - " + FormatterHelper.getPersonalHabilitadoName(licencia.CotCotdt) : "",
					alignment: 'center',
					fontSize: 8,
					border: [false, false, false, false]
				},
				{
					text: licencia.CancFecha !== null ? licencia.JefeTrab + " - " + FormatterHelper.getJefeName(licencia.JefeTrab) : "",
					alignment: 'center',
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: licencia.CancFecha !== null ? licencia.Tecet + " - " + FormatterHelper.getPersonalHabilitadoName(licencia.Tecet) : "",
					alignment: 'center',
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: licencia.CancFecha !== null ? FormatHelper.formatDateLicense(licencia.CancFecha) + " " + FormatHelper.getTimeString(licencia.CancHora
						.ms) : " ",
					alignment: 'center',
					fontSize: 8,
					border: [false, false, false, false]
				}]
			)
			content.push({
				columns: [{
					table: {
						widths: ['15%', '20%', "20%", "20%"],
						body: cancelacionTableRow
					}
				}],
				margin: [0, 0, 0, 20]
			});
			return content;
		},
		createCoordination: function (Coordinaciones, content) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			$.each(Coordinaciones, function (index, item) {
				var formattedDate = FormatHelper.formatDateLicense(item.CreationDate);
				var time = item.CreationTime ? FormatterHelper.msTohoursSeconds(new Date(new Date(item.CreationTime.ms).getTime() + new Date(item
					.CreationTime.ms).getTimezoneOffset() * 60 * 1000)) : '';
				if (!item.Cooindex) return;
				content.push({
					margin: [0, 0, 0, 10],
					columns: [{
						width: '16.6%',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'Coordinado por GDM:'
					}, {
						width: '16.6%',
						fontSize: 9,
						text: 'SI'
					}]
				});
				content.push({
					margin: [0, 0, 0, 10],
					columns: [{
						width: '16.6%',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'Coordinó de GDM:'
					}, {
						width: '*',
						fontSize: 9,
						text: item.Coouser
					}, {
						width: '*',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'Fecha:'
					}, {
						width: '*',
						fontSize: 9,
						text: formattedDate
					}, {
						width: '*',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'Hora:'
					}, {
						width: '*',
						fontSize: 9,
						text: time
					}]
				});
				content.push({
					margin: [0, 0, 0, 20],
					columns: [{
						width: '*',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'Comentarios de Coordinación (GDM):'
					}, {
						width: '*',
						fontSize: 9,
						text: item.Coordination
					}]
				});

			}.bind(this));
			return content;
		},

		createTramitacion: function (Tramitaciones, content) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "TRAMITACIÓN",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 10]
			});

			$.each(Tramitaciones, function (index, item) {

				if (index === 0) {
					content.push({
						margin: [0, 0, 0, 5],
						alignment: 'center',
						columns: [{
							width: '*',
							fontSize: 9,
							margin: [0, 0, 5, 0],
							bold: true,
							text: 'Empresa'
						},
						/*{
							width: '*',
							fontSize: 9,
							margin: [0, 0, 5, 0],
							bold: true,
							text: 'Transmitió desde COT- Programación'
						}, */
						{
							width: '*',
							fontSize: 9,
							margin: [0, 0, 5, 0],
							bold: true,
							text: 'Estado Tramitación'
						}, {
							width: '*',
							fontSize: 9,
							margin: [0, 0, 5, 0],
							bold: true,
							text: 'Causa No autorización'
						}, {
							width: '*',
							fontSize: 9,
							margin: [0, 0, 5, 0],
							bold: true,
							text: 'Avisó desde Programación'
						}, {
							width: '*',
							fontSize: 9,
							margin: [0, 0, 5, 0],
							bold: true,
							text: 'Motivo de No autorización'
						}
						]
					});
				};

				content.push({
					margin: [0, 0, 0, 15],
					alignment: 'center',
					columns: [{
						width: '*',
						fontSize: 9,
						text: this.getEmpresaNameByCode(item)
					},
					/*{
						width: '*',
						fontSize: 9,
						text: this.getText(item.Trascot, 'Trascot')
					},*/
					{
						width: '*',
						fontSize: 9,
						text: this.getText(item.Estado, 'EstadoDeTramitacion')
					}, {
						width: '*',
						fontSize: 9,
						text: this.getText(item.CausaNo, 'CausaNo')
					}, {
						width: '*',
						fontSize: 9,
						text: item.Avisoprog
					}, {
						width: '*',
						fontSize: 9,
						text: item.MotivoNo
					}
					]
				});
			}.bind(this));

			/*
			var avisoTecETtableRow = [
				[{
					text: "Aviso al Técnico de la ET",
					alignment: 'center',
					fontSize: 9,
					fillColor: tableFillColor2
				}]
			];
			var avisoDesdeProgTableRow = [
				[{
					text: "Avisó desde Programación",
					alignment: 'center',
					fontSize: 9,
					fillColor: tableFillColor2
				}]
			];
			$.each(licencia.TramitacionesLicencia_nav, function (index, item) {
				if (item.Avisotecet === '00000000') {
					var avisoTecnicoTE = ' ';
				} else {
					var avisoTecnicoTE = FormatterHelper.getPersonalHabilitadoName(item.Avisotecet);
				}

				avisoTecETtableRow.push([{
					text: avisoTecnicoTE,
					alignment: 'center',
					fontSize: 9
				}]);
				avisoDesdeProgTableRow.push([{
					text: item.Avisoprog,
					alignment: 'center',
					fontSize: 9
				}]);
			});
			content.push({
				columns: [{
					table: {
						widths: ['*'],
						body: avisoTecETtableRow
					}
				}, {
					table: {
						widths: ['*'],
						body: avisoDesdeProgTableRow
					}

				}],
				margin: [0, 0, 0, 20]
			});
			*/
			return content;
		},
		createSuspensionReanudacion: function (content, Suspensiones, Reanudaciones,) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "SUSPENSIÓN / REANUDACIÓN DE LA LICENCIA DE TRABAJO",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 0]
			}, {
				table: {
					widths: ['*', '*'],
					body: [
						[{
							text: "Suspensión ",
							alignment: 'center',
							fontSize: 10,
							fillColor: tableFillColor2
						}, {
							text: "Reanudación de la licencia de trabajo",
							fontSize: 10,
							alignment: 'center',
							fillColor: tableFillColor2
						},]
					]
				}
			});
			var suspensionTableRow = [
				[{
					text: "Fecha",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Personal del Turno",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Técnico de ET",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Comentarios ",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, true, false]
				}]
			];
			var reanudacionTableRow = [
				[{
					text: "Fecha",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Personal del Turno",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Técnico de ET",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Comentarios ",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}]
			]
			$.each(Suspensiones, function (index, item) {
				if (!item.Time) return;
				if (item.Time) {
					var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
				} else {
					var time = 'N/A';
				}
				suspensionTableRow.push(
					[{
						text: FormatHelper.formatDateLicense(item.Datelicencia) + "\n" + time,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						// text: AppManagementHelper.getUser() ? AppManagementHelper.getUser() : '', //item.Cot,
						text: item.Cot,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Tecnicoet + ' ' + FormatterHelper.getPersonalHabilitadoName(item.Tecnicoet),
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Commen,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, true, false]
					}]
				);
			}.bind(this));
			$.each(Reanudaciones, function (index, item) {
				if (!item.Time) return;
				if (item.Time) {
					var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
				} else {
					var time = 'N/A';
				}
				reanudacionTableRow.push(
					[{
						text: FormatHelper.formatDateLicense(item.Datelicencia) + "\n" + time,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						// text: AppManagementHelper.getUser() ? AppManagementHelper.getUser() : '', //item.Cot,
						text: item.Cot,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Tecnicoet + ' ' + FormatterHelper.getPersonalHabilitadoName(item.Tecnicoet),
						alignment: 'center',
						fontSize: 8,
						border: [false, false, false, false]
					}, {
						text: item.Comentarios,
						alignment: 'center',
						fontSize: 8,
						border: [false, false, true, false]
					}]
				);
			}.bind(this));
			// $.each(Reanudaciones, function (index, item) {
			// 	if (!item.Time) return;
			// 	if (item.Time) {
			// 		var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
			// 	} else {
			// 		var time = 'N/A';
			// 	}
			// 	reanudacionTableRow.push(
			// 		[{
			// 			text: FormatHelper.formatDateLicense(item.Datelicencia) + "\n" + time,
			// 			alignment: 'center',
			// 			fontSize: 8,
			// 			border: [false, false, false, false]
			// 		}, {
			// 			// text: AppManagementHelper.getUser() ? AppManagementHelper.getUser() : '', //item.Cot,
			// 			text: item.Cot,
			// 			alignment: 'center',
			// 			fontSize: 8,
			// 			border: [false, false, false, false]
			// 		}, {
			// 			text: item.Tecnicoet + ' ' + FormatterHelper.getPersonalHabilitadoName(item.Tecnicoet),
			// 			alignment: 'center',
			// 			fontSize: 8,
			// 			border: [false, false, false, false]
			// 		}, {
			// 			text: item.Comentarios,
			// 			alignment: 'center',
			// 			fontSize: 8,
			// 			border: [false, false, false, false]
			// 		}]
			// 	);
			// }.bind(this));
			content.push({
				columns: [{
					width: '50%',
					table: {
						widths: ['20%', '20%', '40%', '20%'],
						body: suspensionTableRow
					}
				}, {
					width: '50%',
					table: {
						widths: ['20%', '20%', '40%', '20%'],
						body: reanudacionTableRow
					}

				}],
				margin: [0, 0, 0, 20]
			});
			return content;
		},

		createLicTrabAutorizNoEntregEnTiempoReal: function (content, Entregas) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "LICENCIA DE TRABAJO AUTORIZADAS NO ENTREGADA EN TIEMPO REAL",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 0]
			}, {

			});
			var entregaTableRow = [
				[{
					text: "Fecha",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Personal del Turno",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "TE/JT/JTG",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Folio ",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Causa ",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}, {
					text: "Comentarios ",
					alignment: 'center',
					bold: true,
					fontSize: 8,
					border: [false, false, false, false]
				}]
			];
			$.each(Entregas, function (index, item) {
				if (item.Motivono !== '') {
					if (item.Time) {
						var time = FormatterHelper.msTohoursSeconds(item.Time.getTime());
					} else {
						var time = 'N/A';
					}
					entregaTableRow.push(
						[{
							text: FormatHelper.formatDateLicense(item.Datelicencia) + " \n " + time,
							alignment: 'center',
							fontSize: 8,
							border: [false, false, false, false]
						}, {
							text: item.Cot,
							alignment: 'center',
							fontSize: 8,
							border: [false, false, false, false]
						}, {
							text: item.Tejt + " - " + FormatterHelper.getPersonalHabilitadoName(item.Tejt),
							alignment: 'center',
							fontSize: 8,
							border: [false, false, false, false]
						}, {
							text: item.Folio,
							alignment: 'center',
							fontSize: 8,
							border: [false, false, false, false]
						}, {
							alignment: 'center',
							fontSize: 8,
							border: [false, false, false, false],
							text: this.getText(item.Motivono, 'Motivono')
						}, {
							text: item.Commen,
							alignment: 'center',
							fontSize: 8,
							border: [false, false, false, false]
						}]
					);
				}
			}.bind(this));
			content.push({
				columns: [{
					table: {
						widths: ['15%', '20%', "20%", '15%', '15%', "15%"],
						body: entregaTableRow
					}
				}],
				margin: [0, 0, 0, 20]
			});
			return content;
		},
		transferenciaJefeTrabajo: function (Transferencias, content) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "TRANSFERENCIA DE JEFE DE TRABAJO",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 10]
			});
			$.each(Transferencias, function (index, item) {
				if (!item.Jefetra) return;
				var formattedDate = FormatHelper.formatDateLicense(item.Time);
				var time = FormatterHelper.msTohoursSeconds(new Date(item.Time).getTime());
				/*var hora = new Date(item.Time).getHours();
				var minutos = new Date(item.Time).getMinutes();*/
				content.push({
					columns: [{
						width: '*',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'Nuevo JT:'
					}, {
						width: '*',
						fontSize: 9,
						text: item.Jefetra + ' ' + FormatterHelper.getPersonalHabilitadoName(item.Jefetra)
					}, {
						width: '*',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'Fecha:'
					}, {
						width: '*',
						fontSize: 9,
						text: formattedDate
					}, {
						width: '*',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'Hora:'
					}, {
						width: '*',
						fontSize: 9,
						text: time
					}],
					margin: [0, 0, 0, 10]
				});
				content.push({
					columns: [{
						width: '*',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'TE que Informó:'
					}, {
						width: '*',
						fontSize: 9,
						text: item.Teinformo + ' ' + FormatterHelper.getPersonalHabilitadoName(item.Teinformo)
					}, {
						width: '*',
						fontSize: 9,
						margin: [0, 0, 5, 0],
						bold: true,
						text: 'Autorizó en el COT/COTDT:'
					}, {
						width: '*',
						fontSize: 9,
						text: item.Autcot
					}],
					margin: [0, 0, 0, 20]
				});
			}.bind(this));
			return content;
		},
		getEmpresaNameByCode: function (tramitacion) {
			if (tramitacion !== undefined) {
				var EmpresasModel = AppManagementHelper.getModel("EmpresaTramitacionJsonModel");
				var EmpTramitaCode = tramitacion.EmpTramita;
				if (EmpresasModel) {
					var Empresas = EmpresasModel.getData().Empresas;
					var Empresa = Empresas.filter(function (item) {
						return item.Codigo === EmpTramitaCode
					});
					var Name = Empresa[0] ? Empresa[0].Descripcion + ' - ' + EmpTramitaCode : '';

					return Name;
				} else {
					return tramitacion.EmpTramita ? tramitacion.EmpTramita : '';
				}

			} else {
				return '';
			}
		},
		createObservaciones: function (Observaciones, content) {
			var tableFillColor = '#c4bd96';
			var tableFillColor2 = '#2980ba';
			content.push({
				table: {
					widths: ['*'],
					body: [
						[{
							text: "OBSERVACIONES",
							alignment: 'center',
							fillColor: tableFillColor
						}]
					]
				},
				margin: [0, 0, 0, 0]
			});
			var observacionesTableRow = [
				[{
					text: "Fecha",
					alignment: 'center',
					bold: true,
					fontSize: 9,
					fillColor: tableFillColor2
				}, {
					text: "Hora",
					alignment: 'center',
					bold: true,
					fontSize: 9,
					fillColor: tableFillColor2
				}, {
					text: "Usuario",
					alignment: 'center',
					bold: true,
					fontSize: 9,
					fillColor: tableFillColor2
				}, {
					text: "Causa de Observación",
					alignment: 'center',
					bold: true,
					fontSize: 9,
					fillColor: tableFillColor2
				}, {
					text: "Comentarios ",
					alignment: 'center',
					bold: true,
					fontSize: 9,
					fillColor: tableFillColor2
				}]
			];
			$.each(Observaciones, function (index, item) {
				if (item.CreationTime) {
					var time = item.CreationTime.ms ? FormatterHelper.msToHoursMinutesWithTimeZoneOffset(item.CreationTime.ms) : '';
				} else {
					var time = 'N/A';
				}

				if (!item.Obsindex) return;
				observacionesTableRow.push(
					[{
						text: FormatHelper.formatDateLicense(item.CreationDate),
						alignment: 'center',
						fontSize: 9
					}, {
						text: time,
						alignment: 'center',
						fontSize: 9
					}, {
						text: item.Obsuser,
						alignment: 'center',
						fontSize: 9
					}, {
						text: this.getText(item.Obscause, 'Obscause'),
						alignment: 'center',
						fontSize: 9
					}, {
						text: item.Observation,
						alignment: 'center',
						fontSize: 9
					}]
				);
			}.bind(this));
			content.push({
				columns: [{
					table: {
						pageBreak: 'before',
						widths: ['20%', '20%', '20%', '20%', '20%'],
						body: observacionesTableRow
					}
				}],
				margin: [0, 0, 0, 20]
			});
			return content;
		},

		checkBold: function (sValue) {
			if (sValue === "X") {
				return true;
			}
			return false;
		}
	};
});