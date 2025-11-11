sap.ui.define([
	//model
	"Transener/Operaciones/LicenciasTrabajo/model/HardCodeModel",
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/services/ReportesService",
	"Transener/Operaciones/LicenciasTrabajo/services/EquiposService",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatterHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/LicenseService",
	"Transener/Operaciones/LicenciasTrabajo/utils/LicenceHelper",
	"sap/ui/core/library"
], function (HardCodeModel, ReportesService, EquiposService, FormatterHelper, FormatHelper, AppManagementHelper, BusyDialogHelper,
	MessageBoxHelper,
	LicenseService, LicenceHelper, library) {
	"use strict";
	var CalendarType = library.CalendarType;

	return {
		oFormatYyyymmdd: null,

		getImageUrl: function (society, fnCallback) {
			var that = this;
			var xhr = new XMLHttpRequest();

			if (society === "100") {
				//Ruta para BAS Desarrollo
				//xhr.open("GET", "images/transener_top.png"), true);
				//Ruta para CF Launchpad
				xhr.open("GET", sap.ui.require.toUrl("Transener/Operaciones/LicenciasTrabajo/images/transener_top.png"), true);

			} else {
				//Ruta para BAS Desarrollo
				//xhr.open("GET", "images/transba_top.png"), true);
				//Ruta para CF Launchpad
				xhr.open("GET", sap.ui.require.toUrl("Transener/Operaciones/LicenciasTrabajo/images/transba_top.png"), true);

			}

			xhr.responseType = "blob";
			xhr.onload = function (e) {

				if (e.srcElement.status >= 400) {
					that.imageUrl = false;
					return;
				}
				var reader = new FileReader();
				reader.onload = function (event) {
					var res = event.target.result;
					that.imageUrl = res;
					fnCallback();
				};
				var file = this.response;
				reader.readAsDataURL(file);
			};
			xhr.send();
		},

		registerDefine: function () {
			jQuery.sap.require("Transener/Operaciones/LicenciasTrabajo/libs/FileSaver");
			jQuery.sap.require("Transener/Operaciones/LicenciasTrabajo/libs/docx");
			if (window.define) {
				var temp = define.amd;
				define.amd = false;
			}
			jQuery.sap.registerModulePath("index", "https://unpkg.com/docx@4.0.0/build/");
			jQuery.sap.require("index.index");
			if (window.define) define.amd = temp;
		},

		exportSolicitudAcuerdo: function (aData, society) {
			var that = this;
			this.registerDefine();
			this.getImageUrl(society, () => {
				var imgTransener = this.imageUrl;
				var aPromises = [];
				for (var oData of aData) {

					var doc = new Document({
						pageNumberStart: 1,
						pageNumberFormatType: PageNumberFormat.DECIMAL,
					});

					doc.Header.createImage(imgTransener, 600, 55);

					doc.createParagraph("DATOS GENERALES").center().heading5();

					var table = doc.createTable(1, 4);
					//row, cell 
					table.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table.getCell(0, 0).CellProperties.setWidth('50', WidthType.PERCENTAGE);
					table.getCell(0, 1).CellProperties.setWidth('50', WidthType.PERCENTAGE);
					table.getCell(0, 2).CellProperties.setWidth('50', WidthType.PERCENTAGE);
					table.getCell(0, 3).CellProperties.setWidth('50', WidthType.PERCENTAGE);

					table.getCell(0, 0).addContent(new Paragraph('EQUIPO'));
					table.getCell(0, 1).addContent(new Paragraph(oData.Equnr));

					table.getCell(0, 2).CellProperties.setShading({
						fill: "#969696"
					});
					table.getCell(0, 2).addContent(new Paragraph('E.T'));
					table.getCell(0, 3).addContent(new Paragraph(oData.Tplnr));

					doc.createParagraph("TRABAJO A REALIZAR").center().heading5();

					var table2 = doc.createTable(1, 1);
					table2.getCell(0, 0).CellProperties.setWidth('100', WidthType.PERCENTAGE);
					// table2.getCell(0, 0).addContent(new Paragraph(FormatHelper.getCommentsFromLicence(oData)));
					table2.getCell(0, 0).addContent(new Paragraph(oData.Descripcion));

					doc.createParagraph("CONDICIÓN DE TRABAJO").center().heading5();

					var table4 = doc.createTable(1, 4);
					table4.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table4.getCell(0, 0).addContent(new Paragraph("Consignación"));
					table4.getCell(0, 1).CellProperties.setShading({
						fill: "#969696"
					});
					table4.getCell(0, 1).addContent(new Paragraph('Condiciones especiales'));
					table4.getCell(0, 2).CellProperties.setShading({
						fill: "#969696"
					});
					table4.getCell(0, 2).addContent(new Paragraph('Trabajo con tensión'));
					table4.getCell(0, 3).CellProperties.setShading({
						fill: "#969696"
					});
					table4.getCell(0, 3).addContent(new Paragraph('Trabajo con tensión especial'));

					var table5 = doc.createTable(1, 4);
					var sintensionpat = oData.Jobcond === "01" ? "X" : "";
					var condesp = oData.Jobcond === "06" ? "X" : "";
					var trabajocontension = oData.Jobcond === "04" ? "X" : "";
					var especial = oData.Jobcond === "05" ? "X" : "";

					table5.getCell(0, 0).addContent(new Paragraph(sintensionpat));
					table5.getCell(0, 1).addContent(new Paragraph(condesp));
					table5.getCell(0, 2).addContent(new Paragraph(trabajocontension));
					table5.getCell(0, 3).addContent(new Paragraph(especial));

					var table6 = doc.createTable(1, 2);
					table6.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table6.getCell(0, 0).addContent(new Paragraph("ESTADO EQUIPO"));
					var estadoequ = oData.Equstat === "" ? "F/S" : "E/S";
					table6.getCell(0, 1).addContent(new Paragraph(estadoequ));

					var table7 = doc.createTable(1, 4);
					table7.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table7.getCell(0, 0).addContent(new Paragraph("DESDE"));
					var desde = FormatHelper.formatDateLicense(oData.Solbeg);
					table7.getCell(0, 1).addContent(new Paragraph(desde));
					table7.getCell(0, 2).CellProperties.setShading({
						fill: "#969696"
					});
					table7.getCell(0, 2).addContent(new Paragraph('HORA	'));
					// var horadesde = FormatHelper.getTimeString(oData.Timbeg) + "HS";
					var horadesde = that.getTimeFormat(oData.Timbeg) + "HS";
					table7.getCell(0, 3).addContent(new Paragraph(horadesde));

					var table8 = doc.createTable(1, 4);
					table8.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table8.getCell(0, 0).addContent(new Paragraph("HASTA"));
					var hastas = FormatHelper.formatDateLicense(oData.Solend);
					table8.getCell(0, 1).addContent(new Paragraph(hastas));
					table8.getCell(0, 2).CellProperties.setShading({
						fill: "#969696"
					});
					table8.getCell(0, 2).addContent(new Paragraph('HORA	'));
					// var horahasta = FormatHelper.getTimeString(oData.Timend) + "HS";
					var horahasta = that.getTimeFormat(oData.Timend) + "HS";
					table8.getCell(0, 3).addContent(new Paragraph(horahasta));

					var table9 = doc.createTable(1, 4);
					table9.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table9.getCell(0, 0).addContent(new Paragraph("MODALIDAD"));
					var modalidad = oData.Period === "C" ? "Continua" : "Diaria";
					table9.getCell(0, 1).addContent(new Paragraph(modalidad));
					table9.getCell(0, 2).CellProperties.setShading({
						fill: "#969696"
					});

					var aTiempoRep = AppManagementHelper.getModel("RepositionTimes").getData().RepositionTimes;
					var oTiempo = aTiempoRep.find((e) => {
						return e.Valkey === oData.Tiemporep
					});

					table9.getCell(0, 2).addContent(new Paragraph('TIEMPO DE REPOSICIÓN	'));
					table9.getCell(0, 3).addContent(new Paragraph(oTiempo.Valtext));

					doc.createParagraph("CONDICIONES DE SEGURIDAD").center().heading5();

					var table10 = doc.createTable(1, 2);
					table10.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					///////////////////////////////////////////////////////////////////////////////////////////////////////
					table10.getCell(0, 0).CellProperties.setWidth('100', WidthType.PERCENTAGE);
					table10.getCell(0, 0).addContent(new Paragraph("Interruptores Abiertos y en Local / Extraídos"));
					table10.getCell(0, 1).addContent(new Paragraph(oData.Interabier));

					var table12 = doc.createTable(1, 2);
					table12.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table12.getCell(0, 0).addContent(new Paragraph("Seccionadores Abiertos, Bloqueados y Trabados"));
					table12.getCell(0, 1).addContent(new Paragraph(oData.Seleccionad));

					var table13 = doc.createTable(1, 2);
					table13.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table13.getCell(0, 0).addContent(new Paragraph("Seccionadores de PaT Cerrados"));
					table13.getCell(0, 1).addContent(new Paragraph(oData.Intercerr));

					var table18 = doc.createTable(1, 2);
					table18.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table18.getCell(0, 0).addContent(new Paragraph("PaT Adicionales(especificar lugar de conexión)"));
					table18.getCell(0, 1).addContent(new Paragraph(oData.Patadic));

					var table17 = doc.createTable(1, 2);
					table17.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table17.getCell(0, 0).addContent(new Paragraph("Equipos a Mover / Pruebas Funcionales a Realizar"));
					table17.getCell(0, 1).addContent(new Paragraph(oData.Equimov));

					var table14 = doc.createTable(1, 2);
					table14.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table14.getCell(0, 0).addContent(new Paragraph("Bloqueo de recierres (Sólo para TCT)"));
					table14.getCell(0, 1).addContent(new Paragraph(oData.Bloqueorecierretxt));

					var table15 = doc.createTable(1, 2);
					table15.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table15.getCell(0, 0).addContent(new Paragraph("Interruptores que no deben Operarse (sólo para TcT)"));
					table15.getCell(0, 1).addContent(new Paragraph(oData.Intnooperar));

					var table16 = doc.createTable(1, 2);
					table16.getCell(0, 0).CellProperties.setShading({
						fill: "#969696"
					});
					table16.getCell(0, 0).addContent(new Paragraph("Otras Precauciones de Seguridad"));
					table16.getCell(0, 1).addContent(new Paragraph(oData.Precauciones));

					/*************************************/

					doc.createParagraph("OBSERVACIONES").center().heading5();

					var table19 = doc.createTable(1, 1);
					table19.getCell(0, 0).CellProperties.setWidth('100', WidthType.PERCENTAGE);
					table19.getCell(0, 0).addContent(new Paragraph(oData.Solictext));

					aPromises.push(this.promisePacker(oData.Id, doc))
				}
				Promise.all(aPromises).then(() => { })
			});

		},

		promisePacker: function (Id, doc) {
			return new Promise((resolve, reject) => {
				var packer = new Packer();
				packer.toBlob(doc).then(blob => {
					saveAs(blob, `Formulario de acuerdo_${Id}.docx`);
					resolve();
				});
			})
		},

		getDateFormat: function (sDate) {
			var year = sDate.substr(0, 4);
			var month = sDate.substr(4, 2);
			var day = sDate.substr(6);

			var dDate = new Date(year + "-" + month + "-" + day);
			var withUtc = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
			return withUtc;
		},

		/*getHoursMinutes: function(fecha){
			var fecha = new Date(fecha);
			var fechaFormated = fecha.getHours() +':'+ fecha.getMinutes();
			return fechaFormated
		},*/

		getTimeFormat: function (date) {
			var withUtc = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
			var hours = withUtc.getHours();
			var minutes = withUtc.getMinutes();
			//var ampm = hours >= 12 ? 'pm' : 'am';
			//hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes;

			return strTime;
		},

		getFechaHora: function (date) {
			if (date !== null) {
				var dDateFormatted = new Date(date.getTime() + date.getTimezoneOffset());
				var d = new Date(dDateFormatted);
				var month = '' + (d.getMonth() + 1);
				var day = '' + d.getDate();
				var year = d.getFullYear();
				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;

				var DaysMonthYears = [day, month, year].join('-');

				var withUtc = new Date(date.getTime() + date.getTimezoneOffset());
				var hours = withUtc.getHours();
				var minutes = withUtc.getMinutes();
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? '0' + minutes : minutes;
				var horasYMinutos = hours + ':' + minutes;
				return DaysMonthYears + ' ' + horasYMinutos;
			} else {
				return 'N/A'
			}
		},

		getHoraMin: function (date) {
			if (date !== null) {
				var dDateFormatted = new Date(date.getTime() + date.getTimezoneOffset());
				var d = new Date(dDateFormatted);
				var month = '' + (d.getMonth() + 1);
				var day = '' + d.getDate();
				var year = d.getFullYear();
				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;

				var DaysMonthYears = [day, month, year].join('-');

				var withUtc = new Date(date.getTime() + date.getTimezoneOffset());
				var hours = withUtc.getHours();
				var minutes = withUtc.getMinutes();
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? '0' + minutes : minutes;
				var horasYMinutos = hours + ':' + minutes;
				return horasYMinutos;
			} else {
				return 'N/A'
			}
		},

		//ticket 578 punto 19
		_getTipificacionObs: function (tipObs) {
			const aObscause = HardCodeModel.getModel().getProperty("/Obscause");
			let obj = aObscause.find(o => o.key === tipObs);
			return obj.value;
		},

		_getHoraMinoDataModel: function (value) {
			if (value) {
				let dDate = new Date(value.ms)
				return dDate.toISOString().substr(11, 8);
			}
			return;
		},

		getSenalesAfectadas: function (Senalalarmas, Senalestados, Senalmedicion, Senalninguna) {
			if (Senalninguna === 'X') {
				return 'Ninguna'
			} else {
				if (Senalalarmas === 'X') {
					var alarmas = 'Alarmas, ';
				} else {
					var alarmas = '';
				}
				if (Senalestados === 'X') {
					var estados = 'Estados, '
				} else {
					var estados = '';
				}
				if (Senalmedicion === 'X') {
					var medicion = 'Medición';
				} else {
					var medicion = '';
				}

				return alarmas + estados + medicion;
			}
		},

		formatStatus: function (sLicStat, Substatus) {
			if (sLicStat === "01") {
				var s = FormatterHelper.getApprovalSubstatus(sLicStat, Substatus)
			} else {
				var s = FormatterHelper.getStatusName(sLicStat);
			}
			return s
		},

		getText: function (value, campo) {
			if (campo === 'Equstatnocam') {
				if (value === 'X') {
					return 'E/S'
				}
				if (value === '') {
					return "F/S"
				}
				if (value === 'N') {
					return ''
				}
			}
			if (campo === 'Equstat') {
				if (value === 'X') {
					return 'E/S' // En servicio
				} else {
					return 'F/S' // Fuera de servicio
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
			//Ticket 578 punto 6
			if (campo === 'R500kv') {
				switch (value) {
					case "X":
						return "SI"
					case "N":
						return "NO"
					case "Y":
						return "NO CORRESPONDE"
					default:
						return ""
				}
			}
			if (campo === 'Barrafs') {
				if (value === 'X') {
					return 'SI'
				} else {
					return 'NO'
				}
			}
			if (campo === 'Autcot') {
				if (value === 'X') {
					return 'NO'
				} else if (value === 'Y') {
					return 'SI'
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
			if (campo === 'Autcot') {
				if (value === 'X') {
					return 'SI'
				} else if (value === 'Y') {
					return 'NO'
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
				} else if (value === 'Y') {
					return 'NO'
				} else if (value === 'C') {
					return 'No Corresponde'
				}
			}
			if (campo === 'Tipo') {
				if (value === 'L') {
					return 'Licencia'
				} else if (value === 'S') {
					return 'Solicitud'
				}
			}
			if (campo === 'Tipolicencia') {
				if (value === '') {
					return ''
				}
				if (value === 'N') {
					return 'Licencia Programada'
				}
				if (value === 'TE') {
					return 'Licencia de terceros'
				}
				if (value === 'EM') {
					return 'Licencia de emergencia'
				}
			}
		},

		SumarizeTramitacionesByROW: function (searchTerm, licenciaID) {
			var aAllFullLicences = this.allFullLicences;
			var licencia = $.grep(aAllFullLicences, function (lic) {
				return lic.Id === licenciaID
			});
			var count = 0;

			if (licencia.length > 0) {
				$.each(licencia[0].TramitacionesLicencia_nav.results, function (i, tramitacion) {
					if (tramitacion.Estado === '02') { //Estado 02 es No autorizada
						/* REFERENCIAS:
						Status: "ALTA", Descripcion: "Alta Demanda",
						Status: "COND", Descripcion: "Condiciones Climatidas Adversas",
						Status: "DEF1", Descripcion: "Deficit de Generacion por combustible",
						Status: "DEF2", Descripcion: "Deficit de Generacion por indisponibilidad de Maquinas",
						Status: "ELEV", Descripcion: "Elavada Transmision de Potencia",
						Status: "LAPE", Descripcion: "Limites Adicionales a los declarados en la programacion estacional",
						Status: "LIPE", Descripcion: "Limites de Programacion estacional",
						Status: "SEGS", Descripcion: "Por Seguridad del SADI",
						Status: "SUPE", Descripcion: "Superposicion de Mantenimientos",
						Status: "TRAN", Descripcion: "Imposibilidad de Transferncia por problemas tecnicos",
						*/
						if (tramitacion.CausaNo === searchTerm) {
							count += 1
						}
					}
				});
			}
			if (count === 0) {
				count = '0'
			}
			return count;
		},

		SumarizeTramitaciones: function (searchTerm, licencias) {
			var count = 0;

			$.each(licencias, function (index, licencia) {
				$.each(licencia.TramitacionesLicencia_nav.results, function (i, tramitacion) {
					if (tramitacion.Estado === '02') { //Estado 02 es No autorizada
						/* REFERENCIAS:
						Status: "ALTA", Descripcion: "Alta Demanda",
						Status: "COND", Descripcion: "Condiciones Climatidas Adversas",
						Status: "DEF1", Descripcion: "Deficit de Generacion por combustible",
						Status: "DEF2", Descripcion: "Deficit de Generacion por indisponibilidad de Maquinas",
						Status: "ELEV", Descripcion: "Elavada Transmision de Potencia",
						Status: "LAPE", Descripcion: "Limites Adicionales a los declarados en la programacion estacional",
						Status: "LIPE", Descripcion: "Limites de Programacion estacional",
						Status: "SEGS", Descripcion: "Por Seguridad del SADI",
						Status: "SUPE", Descripcion: "Superposicion de Mantenimientos",
						Status: "TRAN", Descripcion: "Imposibilidad de Transferncia por problemas tecnicos",
						*/
						if (tramitacion.CausaNo === searchTerm) {
							count += 1
						}
					}
				});
			});

			return count;
		},

		SumarizeEntregasByROW: function (searchTerm, licenciaID) {
			var aAllFullLicences = this.allFullLicences;
			var aLicencia = $.grep(aAllFullLicences, function (lic) {
				return lic.Id === licenciaID
			});
			var licencia = aLicencia[0];
			var count = 0;

			if (aLicencia.length > 0) {
				if (licencia.Licstat === '01') { //Estado  Autorizada
					$.each(licencia.EntregasLicencia_nav.results, function (i, item) {
						if (item.Motivono === searchTerm) {
							/* REFERENCIAS
								'COC' = 'Suspendida por CAMMESA'
								'COT/COTD' = 'Suspendida por COT / COTDT'
								'TERC' = 'Suspendida por Terceros'
								'SOLI' = 'Suspendida por el Solicitante'
								'COND' = 'Condiciones climaticas adversas'
								'NOUT' = 'Dia no utilizado'
								'' = Entregada
							*/
							count += 1
						}

					});
				}
			};
			if (count === 0) {
				count = '0'
			}
			return count;
		},

		SumarizeEntregas: function (searchTerm, licencias) {
			var count = 0;

			$.each(licencias, function (index, licencia) {
				if (licencia.Licstat === '01') { //Estado  Autorizada
					$.each(licencia.EntregasLicencia_nav.results, function (i, item) {
						if (item.Motivono === searchTerm) {
							/* REFERENCIAS
								'COC' = 'Suspendida por CAMMESA'
								'COT/COTD' = 'Suspendida por COT / COTDT'
								'TERC' = 'Suspendida por Terceros'
								'SOLI' = 'Suspendida por el Solicitante'
								'COND' = 'Condiciones climaticas adversas'
								'NOUT' = 'Dia no utilizado'
								'' = Entregada
							*/
							count += 1
						}

					});
				}
			});

			return count;
		},

		SumarizeDiasHabiles: function (searchTerm, licencia) {
			var count = 0;

			//$.each(licencias, function(index, licencia){
			if (licencia.Licstat === '01') { //Estado  Autorizada
				if (licencia.Werks === searchTerm) {
					/* REFERENCIAS
						'102' =
						'103' = 'Norte'
						'104' = ''
						'113' = ''
						'114' = ''
					*/
					var fechaInicio = new Date(FormatHelper.formatDateLicenseYYYYMMDD(licencia.Solbeg)); //new Date('2019-11-30');
					var fechaFin = new Date(FormatHelper.formatDateLicenseYYYYMMDD(licencia.Solend)); //new Date('2019-12-29');

					while (fechaFin.getTime() >= fechaInicio.getTime()) {
						fechaInicio.setDate(fechaInicio.getDate() + 1);

						if (fechaInicio.getDay() === 0 || fechaInicio.getDay() === 6) {
							//No contar si es Sabado o Domingo
						} else {
							count += 1;
						}
					}

				} else {
					count = '0';
				}
			} else {
				count = '0'
			}
			//});

			return count;
		},

		SumarizeDiasSabados: function (searchTerm, licencia) {
			var count = 0;

			if (licencia.Licstat === '01') { //Estado  Autorizada
				if (licencia.Werks === searchTerm) {
					/* REFERENCIAS
						'102' = 'Reg. Metropolitana'
						'103' = 'Norte'
						'104' = ''
						'113' = ''
						'114' = ''
					*/
					var fechaInicio = new Date(FormatHelper.formatDateLicenseYYYYMMDD(licencia.Solbeg)); //new Date('2019-11-30');
					var fechaFin = new Date(FormatHelper.formatDateLicenseYYYYMMDD(licencia.Solend)); //new Date('2019-12-29');

					while (fechaFin.getTime() >= fechaInicio.getTime()) {
						fechaInicio.setDate(fechaInicio.getDate() + 1);

						if (fechaInicio.getDay() === 6) {
							//contar si es Sabado
							count += 1;
						} else { }
					}

				} else {
					count = '0';
				}
			} else {
				count = '0'
			}
			if (count === 0) {
				count = '0'
			}
			return count;
		},

		SumarizeDiasDomingos: function (searchTerm, licencia) {
			var count = 0;

			if (licencia.Licstat === '01') { //Estado  Autorizada
				if (licencia.Werks === searchTerm) {
					/* REFERENCIAS
						'102' = 'Reg. Metropolitana'
						'103' = 'Norte'
						'104' = ''
						'113' = ''
						'114' = ''
					*/
					var fechaInicio = new Date(FormatHelper.formatDateLicenseYYYYMMDD(licencia.Solbeg)); //new Date('2019-11-30');
					var fechaFin = new Date(FormatHelper.formatDateLicenseYYYYMMDD(licencia.Solend)); //new Date('2019-12-29');

					while (fechaFin.getTime() >= fechaInicio.getTime()) {
						fechaInicio.setDate(fechaInicio.getDate() + 1);

						if (fechaInicio.getDay() === 0) {
							//contar si es Domingo
							count += 1;
						} else { }
					}

				} else {
					count = '0';
				}
			} else {
				count = '0'
			}
			if (count === 0) {
				count = '0'
			}
			return count;
		},

		allFullLicences: [],

		createExcelLicencias: function (aData) {
			//Formato de fecha dd/MM/yyyy
			this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
				pattern: "dd/MM/yyyy",
				calendarType: CalendarType.Gregorian
			});

			var that = this;
			ReportesService.getLicenciasFullData(aData).then((data) => {
				that.allFullLicences = data;
				BusyDialogHelper.close();
				make_xlsx_lib(XLSX);
				var newHeader = {
					tipo: "Tipo",
					anio: "Año",
					numlicencia: "Num. Licencia",
					sociedad: "Sociedad",
					fechainicio: "Fecha inicio",
					horainicio: "Hora inicio",
					fechafin: "Fecha fin",
					horafin: "Hora fin",
					diariocontinuo: "Diario / Continuo",
					ptodetrabjo: "Puesto de trabajo",
					solicitante: "Solicitante",
					estadoequipointervenir: "Estado equipo a intervenir",
					condicionestrabajo: "Condiciones de trabajo",
					equiposaintervenir: "Equipo a intervenir",
					tipoDeLicencia: "Tipo de licencia",
					et: "ET",
					equiposoliccammesa: "Equipo Solicitado CAMMESA",
					estadoequipocammesa: "Estado Equipo CAMMESA",
					tiemporeposicion: "Tiempo de reposición",
					riesgodisparo: "Riesgo de disparo",
					requiere500kv: "Requiere calle de 500kV abierta",
					requierealgunabarrafs: "Requiere alguna barra F/S",
					especificarbarra: "Especificar Barra",
					bloqueodereccieres: "Bloqueo de recierres",
					Fstensionret: "F/S con tensión de retorno",
					regiondistrito: "Region / Distrito",
					ot: "OT",
					fechahorageneracion: "Fecha y hora de generacion",
					solicitante: "Solicitante",
					solicitantesup: "Solicitante suplente",
					tipohabJefe: "Tipo Hab. Jefe",
					jefedetrabajo: "Jefe de trabajo",
					tipohabJefeSup: "Tipo Hab. Jefe Sup",
					jefedetrabajosup: "Jefe de trabajo suplente",
					tipointerv: "Tipo de intervencion",
					periodoestacional: "Periodo del Estacional / Estacional Pendiente",
					desctrabajoarealizar: "Descripción del trabajo a realizar",
					comentariossolicitante: "Comentarios del solicitante / Descripcion de las Condiciones Especiales",
					interruptoresabiertos: "Interruptores Abiertos y en Local / Extraídos",
					//seccionadoresabiertos: "Seccionadores Abiertos",
					bloqueadosytrabados: "Seccionadores Abiertos, Bloqueados y Trabados",
					seccionadorespatcerrados: "Seccionadores de PaT Cerrados",
					patadicionales: "PaT Adicionales(especificar lugar de conexión)",
					equiposamover: "Equipos a Mover / Pruebas Funcionales a Realizar",
					bloqueoderecierrestext: "Bloqueo de recierres Comentarios",
					interruptoresquenodebenop: "Interruptores que no deben Operarse(sólo para TcT)",
					otrasprecaucionesdeseguridad: "Otras Precauciones de Seguridad",
					coordinadoaro: "Coordinado con ARO",
					comentariosenmedidasdeseg: "Comentarios(en medida de seguridad)",
					senalesafectadas: "	Señales Afectadas",
					especificarsenalesafec: "Especificar Señales Afectadas",
					partediariocammesa: "Parte diario CAMMESA",
					baseprogramacioncot: "Base de programación COT / COTDT",
					comentariosprogramacion: "Comentarios Programación",
					estadolic: "Estado de la licencia",
					capex: "Capex",
					//Ticket 578 punto 3
					fechaTramitacion: "Tramitador y fecha de tramitación",

					centro102DiasHabiles: "Recuento Autorizada: Centro 102 días hábiles",
					centro102DiasSabados: "Recuento Autorizada: Centro 102 días Sábados",
					centro102DiasDomingos: "Recuento Autorizada: Centro 102 días Domingos",
					centro103DiasHabiles: "Recuento Autorizada: Centro 103 días hábiles",
					centro103DiasSabados: "Recuento Autorizada: Centro 103 días Sábados",
					centro103DiasDomingos: "Recuento Autorizada: Centro 103 días Domingos",
					centro104DiasHabiles: "Recuento Autorizada: Centro 104 días hábiles",
					centro104DiasSabados: "Recuento Autorizada: Centro 104 días Sábados",
					centro104DiasDomingos: "Recuento Autorizada: Centro 104 días Domingos",
					centro113DiasHabiles: "Recuento Autorizada: Centro 113 días hábiles",
					centro113DiasSabados: "Recuento Autorizada: Centro 113 días Sábados",
					centro113DiasDomingos: "Recuento Autorizada: Centro 113 días Domingos",
					centro114DiasHabiles: "Recuento Autorizada: Centro 114 días hábiles",
					centro114DiasSabados: "Recuento Autorizada: Centro 114 días Sábados",
					centro114DiasDomingos: "Recuento Autorizada: Centro 114 días Domingos",

					recNoAutAltaDemanda: "Recuento NO Autorizada: Alta Demanda",
					recNoAutCondicionesClimaticasAdversas: "Recuento NO Autorizada: Condiciones Climáticas Adversas",
					recNoAutDeficitDeGenerPorIndisponDeMaq: "Recuento NO Autorizada: Deficit de Generación por indisponibilidad de Maq.",
					recNoAutElevadaTransmDePot: "Recuento NO Autorizada: Elevada Transmisión de Pot.",
					recNoAutLimiteAdicALosDecEnLaProgEsta: "Recuento NO Autorizada: Límites Adicionales a los declarados en la prog. esta.",
					recNoAutLimitesDeProgEsta: "Recuento NO Autorizada: Límites de Programación Esta.",
					recNoAutPorSeguridadDelSadi: "Recuento NO Autorizada: Por Seguridad del SADI",
					recNoAutSuperposDeMant: "Recuento NO Autorizada: Superposición de Mant.",
					recNoAutImposibiliDeTransm: "Recuento NO Autorizada: Imposibilidad de Transmisión",

					recAutEntregadas: "Recuento Autorizada: entregadas",
					recAutNoEntregadasSuspenPorCAMMesa: "Recuento Autorizada: NO entregadas - Suspendida por CAMMESA",
					recAutNoEntregadasSuspPorCODCOTDT: "Recuento Autorizada: NO entregadas - Suspendida por COD / COTDT",
					recAutNoEntregadasSuspPorTerceros: "Recuento Autorizada: NO entregadas - Suspendida por Terceros",
					recAutNoEntregadasSuspPorElSolic: "Recuento Autorizada: NO entregadas - Suspendida por el solicitante",
					recAutNoEntregadasCondicClimAdver: "Recuento Autorizada: NO entregadas - Condiciones Climáticas adversas",
					recAutNoEntregadasDiaNoUtilizado: "Recuento Autorizada: NO entregadas - Día no utilizado"
				};

				var aDataToExport = aData.map((license, index) => ({
					tipo: that.getText(license.Tipo, 'Tipo'),
					anio: license.Anio,
					numlicencia: license.Id,
					sociedad: that.getText(license.Empresa, 'Empresa'),
					fechainicio: FormatHelper.formatDateLicense(license.Solbeg),
					horainicio: that.getTimeFormat(new Date(license.Timbeg)),
					fechafin: FormatHelper.formatDateLicense(license.Solend),
					horafin: that.getTimeFormat(new Date(license.Timend)),
					diariocontinuo: that.getText(license.Period, 'Period'),
					ptodetrabjo: license.ArbplDesc,
					solicitante: license.Solicitante + ' ' + FormatterHelper.getSolicitanteName(license.Solicitante),
					estadoequipointervenir: that.getText(license.Equstatnocam, 'Equstatnocam'),
					condicionestrabajo: that.getText(license.Jobcond, 'Jobcond'),
					equiposaintervenir: license.Equiinterv,
					tipoDeLicencia: that.getText(license.Tipolicencia, 'Tipolicencia'),
					et: license.Tplnr,
					equiposoliccammesa: license.Equnr,
					estadoequipocammesa: that.getText(license.Equstat, 'Equstat'),
					tiemporeposicion: FormatterHelper.getTiempoReposicionDesc(license.Tiemporep),
					riesgodisparo: that.getText(license.Rdisparo, 'Rdisparo'),
					requiere500kv: that.getText(license.R500kv, 'R500kv'), //Ticket 571 Punto 6
					requierealgunabarrafs: that.getText(license.Barrafs, 'Barrafs'),
					especificarbarra: license.Barrafstx,
					bloqueodereccieres: that.getText(license.Bloqueo, 'Bloqueo'),
					Fstensionret: that.getText(license.Fstensionret, 'Fstensionret'),
					regiondistrito: that.getText(license.Werks, 'Regiones'),
					ot: license.Aufnr,
					fechahorageneracion: that.getFechaHora(license.Gdate),
					solicitantesup: license.SolSuplente + ' ' + FormatterHelper.getSolicitanteName(license.SolSuplente),
					tipohabJefe:license.TipoHabJefe + ' ' + FormatterHelper.getTipoHabName(license.TipoHabJefe),
					jefedetrabajo: license.Jefe + ' ' + FormatterHelper.getPersonalHabilitadoName(license.Jefe), //Ticket 571 punto 5, usamos la property Todos para recuperar el jefe en vez de JefeDeTrabajo
					tipohabJefeSup :license.TipoHabJefeSup + ' ' + FormatterHelper.getTipoHabName(license.TipoHabJefeSup),
					jefedetrabajosup: license.JefeSuplente + ' ' + FormatterHelper.getPersonalHabilitadoName(license.JefeSuplente), //Ticket 571 punto 5, usamos la property Todos para recuperar el jefe suplente en vez de Solicitante
					tipointerv: FormatterHelper.getTipoIntervencion(license.Tipinterv),
					periodoestacional: FormatterHelper.getPerestac(license.Estacional),
					desctrabajoarealizar: license.Descripcion,
					comentariossolicitante: license.Solictext,
					interruptoresabiertos: license.Interabier,
					//seccionadoresabiertos: license.Seleccionad,//Seccionadores Abiertos
					bloqueadosytrabados: license.Seleccionad, //"Bloqueados y Trabados"
					seccionadorespatcerrados: license.Intercerr,
					patadicionales: license.Patadic,
					equiposamover: license.Equimov,
					bloqueoderecierrestext: license.Bloqueorecierretxt,
					interruptoresquenodebenop: license.Intnooperar,
					otrasprecaucionesdeseguridad: license.Precauciones,
					coordinadoaro: that.getText(license.Aro, 'Aro'),
					comentariosenmedidasdeseg: license.Sindivi,
					senalesafectadas: that.getSenalesAfectadas(license.Senalalarmas, license.Senalestados, license.Senalmedicion, license.Senalninguna),
					especificarsenalesafec: license.Senalafect,
					partediariocammesa: license.Comments,
					baseprogramacioncot: license.Tdtcomments,
					comentariosprogramacion: license.Prgcomments,
					estadolic: that.formatStatus(license.Licstat, license.Substatus),
					capex: (license.Capex === "Y") ? "NO" : "SI",
					//Ticket 578 punto 3
					fechaTramitacion: that._getTramitadorFecha(that.allFullLicences[index].LastTramiteAvisoprog, that.allFullLicences[index].LastTramiteFecha,
						that.allFullLicences[index].LastTramiteHora),

					centro102DiasHabiles: that.SumarizeDiasHabiles("102", license),
					centro102DiasSabados: that.SumarizeDiasSabados("102", license),
					centro102DiasDomingos: that.SumarizeDiasDomingos("102", license),
					centro103DiasHabiles: that.SumarizeDiasHabiles("103", license),
					centro103DiasSabados: that.SumarizeDiasSabados("103", license),
					centro103DiasDomingos: that.SumarizeDiasDomingos("103", license),
					centro104DiasHabiles: that.SumarizeDiasHabiles("104", license),
					centro104DiasSabados: that.SumarizeDiasSabados("104", license),
					centro104DiasDomingos: that.SumarizeDiasDomingos("104", license),
					centro113DiasHabiles: that.SumarizeDiasHabiles("113", license),
					centro113DiasSabados: that.SumarizeDiasSabados("113", license),
					centro113DiasDomingos: that.SumarizeDiasDomingos("113", license),
					centro114DiasHabiles: that.SumarizeDiasHabiles("114", license),
					centro114DiasSabados: that.SumarizeDiasSabados("114", license),
					centro114DiasDomingos: that.SumarizeDiasDomingos("114", license),

					recNoAutAltaDemanda: that.SumarizeTramitacionesByROW("ALTA", license.Id),
					recNoAutCondicionesClimaticasAdversas: that.SumarizeTramitacionesByROW("COND", license.Id),
					recNoAutDeficitDeGenerPorIndisponDeMaq: that.SumarizeTramitacionesByROW("DEF2", license.Id),
					recNoAutElevadaTransmDePot: that.SumarizeTramitacionesByROW("ELEV", license.Id),
					recNoAutLimiteAdicALosDecEnLaProgEsta: that.SumarizeTramitacionesByROW("LAPE", license.Id),
					recNoAutLimitesDeProgEsta: that.SumarizeTramitacionesByROW("LIPE", license.Id),
					recNoAutPorSeguridadDelSadi: that.SumarizeTramitacionesByROW("SEGS", license.Id),
					recNoAutSuperposDeMant: that.SumarizeTramitacionesByROW("SUPE", license.Id),
					recNoAutImposibiliDeTransm: that.SumarizeTramitacionesByROW("TRAN", license.Id),

					recAutEntregadas: that.SumarizeEntregasByROW("", license.Id),
					recAutNoEntregadasSuspenPorCAMMesa: that.SumarizeEntregasByROW("COC", license.Id),
					recAutNoEntregadasSuspPorCODCOTDT: that.SumarizeEntregasByROW("COT/COTD", license.Id),
					recAutNoEntregadasSuspPorTerceros: that.SumarizeEntregasByROW("TERC", license.Id),
					recAutNoEntregadasSuspPorElSolic: that.SumarizeEntregasByROW("SOLI", license.Id),
					recAutNoEntregadasCondicClimAdver: that.SumarizeEntregasByROW("COND", license.Id),
					recAutNoEntregadasDiaNoUtilizado: that.SumarizeEntregasByROW("NOUT", license.Id)
				}));

				var aNewData = aDataToExport.map((license) => {
					let obj = {};
					for (let key in newHeader) {
						obj[newHeader[key]] = license[key] || "";
					}
					return obj;
				});

				var ws = XLSX.utils.aoa_to_sheet([

				]);

				//ws["!merges"].push("A5:N5") //TODO si quiero esto tengo que ver la ultima version
				//tambien para anchos de columna
				var sheet = XLSX.utils.sheet_add_json(ws, aNewData, {
					sheet: "Test Excel Book 1",
					origin: "A1"
				});
				let today = new Date();
				var Workbook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(Workbook, sheet, "page1");

				function createSheet(jsonData) {
					var ws = XLSX.utils.aoa_to_sheet([]);
					//ws["!merges"].push("A5:N5") //TODO si quiero esto tengo que ver la ultima version
					//tambien para anchos de columna
					var sheet = XLSX.utils.sheet_add_json(ws, jsonData, {
						sheet: "Test Excel Book 2",
						origin: "A1"
					});

					return sheet;
				}

				var LicenciasToExport = [];

				function getEntregas(aLicencias) {
					var tzoffset = (new Date()).getTimezoneOffset() * 60000;
					LicenciasToExport.push(
						["ENTREGAS"], ["Año", "Num. de Licencia", "Id de evento", "Fecha", "Hora", "COT/COTDT", "Jefes de Trabajo", "Tecnico ET",
						"Folio",
						"Motivo de la NO entrega", "Comentarios"
					]
					);
					for (var oLicencia of aLicencias) {
						var aEntregas = oLicencia.EntregasLicencia_nav.results;
						if (aEntregas.length !== 0) { //Solo agarro las Licencias que tienen Entregas
							for (var Entrega of aEntregas) { // Recorro cada entrega de cada licencia
								var anio = Entrega.Anio;
								var numLic = Entrega.Id;
								var idEvento = Entrega.Entindex;
								var fecha = that.oFormatYyyymmdd.format(new Date(Entrega.Delivereddate.getTime() + tzoffset)); //Ticket 578 ENTREGAS FECHA ANTERIORES 
								// var fecha = Entrega.Delivereddate; // TODO: este campo correcto ???
								var hora = that.getHoraMin(Entrega.Time); // TODO: este campo correcto ???
								var cot = Entrega.Cot;
								var tejt = Entrega.Tejt + " " + FormatterHelper.getJefeName(Entrega.Tejt);
								var folio = Entrega.Folio;
								var motivoNoEnt = Entrega.Motivono;
								var comentarios = Entrega.Commen;
								var sTecnicoEt = Entrega.TecET + " " + FormatterHelper.getPersonalHabilitadoName(Entrega.TecET);
								LicenciasToExport.push([anio, numLic, idEvento, fecha, hora, cot, tejt, sTecnicoEt, folio, motivoNoEnt, comentarios]);
							}
						}
					}
					return LicenciasToExport;
				}

				var Hoja3ToExport = []
				function getColocaciones(aLicencias) {
					Hoja3ToExport.push(
						["COLOCACIONES"], ["Num. de Licencia", "Fecha", "Hora", "ET", "Comentarios"]
					);
					for (var oLicencia of aLicencias) {
						var aColocaciones = oLicencia.ColocacionPAT_nav.results
						if (aColocaciones.length !== 0) {
							for (var Colocacion of aColocaciones) {

								var numLic = Colocacion.Id;
								var fecha = Colocacion.Datehab; // TODO: este campo correcto ???
								var hora = that.getHoraMin(Colocacion.Time); // TODO: este campo correcto ???
								var ET = Colocacion.Tplnr;
								var comentarios = Colocacion.Coment;

								Hoja3ToExport.push([numLic, fecha, hora, ET, comentarios]);
							}
						}
					}
					return Hoja3ToExport;
				}

				function getRetiros(aLicencias) {
					Hoja3ToExport.push(
						[''], ["RETIROS"], ["Num. de Licencia", "Fecha", "Hora", "ET", "Comentarios"]
					);
					for (var oLicencia of aLicencias) {
						var aRetiros = oLicencia.RetiroPAT_nav.results
						if (aRetiros.length !== 0) {
							for (var Retiro of aRetiros) {

								var numLic = Retiro.Id;
								var fecha = Retiro.Datehab; // TODO: este campo correcto ???
								var hora = that.getHoraMin(Retiro.Time); // TODO: este campo correcto ???
								var ET = Retiro.Tplnr;
								var comentarios = Retiro.Coment;

								Hoja3ToExport.push([numLic, fecha, hora, ET, comentarios]);
							}
						}
					}
					return Hoja3ToExport;
				}
				function getHabilitaciones(aLicencias) {
					Hoja3ToExport.push(
						[''], ["HABILITACIONES"], ["Num. de Licencia", "Fecha", "Hora", "ET", "Comentarios"]
					);
					for (var oLicencia of aLicencias) {
						var aHabilitaciones = oLicencia.HabilitacionRecierre_nav.results
						if (aHabilitaciones.length !== 0) {
							for (var Habilitacion of aHabilitaciones) {

								var numLic = Habilitacion.Id;
								var fecha = Habilitacion.Datehab; // TODO: este campo correcto ???
								var hora = that.getHoraMin(Habilitacion.Time); // TODO: este campo correcto ???
								var ET = Habilitacion.Tplnr;
								var comentarios = Habilitacion.Coment;

								Hoja3ToExport.push([numLic, fecha, hora, ET, comentarios]);
							}
						}
					}
					return Hoja3ToExport;
				}
				function getInhibiciones(aLicencias) {
					Hoja3ToExport.push(
						[''], ["INHIBICIONES"], ["Num. de Licencia", "Fecha", "Hora", "ET", "Comentarios"]
					);
					for (var oLicencia of aLicencias) {
						var aInhibiciones = oLicencia.InhibicionRecierre_nav.results
						if (aInhibiciones.length !== 0) {
							for (var Inhibicion of aInhibiciones) {

								var numLic = Inhibicion.Id;
								var fecha = Inhibicion.Datehab; // TODO: este campo correcto ???
								var hora = that.getHoraMin(Inhibicion.Time); // TODO: este campo correcto ???
								var ET = Inhibicion.Tplnr;
								var comentarios = Inhibicion.Coment;

								Hoja3ToExport.push([numLic, fecha, hora, ET, comentarios]);
							}
						}
					}
					return Hoja3ToExport;
				}



				function getDevoluciones(aLicencias) {
					LicenciasToExport.push(
						[" "], ["DEVOLUCIONES"], ["Año", "Num. de Licencia", "Id de evento", "Fecha", "Hora", "TE/JT/JTG", "COT/COTDT", "Tecnico ET",
						"Comentarios"
					]
					);
					for (var oLicencia of aLicencias) {
						var aItems = oLicencia.DevolucionLicencia_nav.results;
						if (aItems.length !== 0) {
							for (var Item of aItems) {
								var anio = Item.Anio;
								var numLic = Item.Id;
								var idEvento = Item.Devindex;
								var fecha = Item.Devolutiondate; // TODO: este campo correcto ???
								var hora = that.getHoraMin(Item.Time); // TODO: este campo correcto ???
								var tejt = Item.Tejt + " " + FormatterHelper.getJefeName(Item.Tejt);
								var comentarios = Item.Commen;
								var sTecnicoEt = Item.TecET + " " + FormatterHelper.getPersonalHabilitadoName(Item.TecET);
								var cot = Item.Personal;

								LicenciasToExport.push([anio, numLic, idEvento, fecha, hora, tejt, cot, sTecnicoEt, comentarios]);
							}
						}
					}
					return LicenciasToExport;
				}

				function getSuspensiones(aLicencias) {
					LicenciasToExport.push(
						[" "], ["SUSPENSIONES"], ["Año", "Num. de Licencia", "Id de evento", "Fecha", "Hora", "COT/COTDT", "Tecnico ET", /* "Folio", "Motivo de la NO entrega",*/
						"Comentarios"
					]
					);
					for (var oLicencia of aLicencias) {
						var aItems = oLicencia.SuspensionLicencia_nav.results;
						if (aItems.length !== 0) {
							for (var Item of aItems) {
								var anio = Item.Anio;
								var numLic = Item.Id;
								var idEvento = Item.Susindex;
								var fecha = Item.Time; // TODO: este campo correcto ???
								var hora = that.getHoraMin(Item.Time); // TODO: este campo correcto ???
								var cot = Item.Cot;
								var tecnicoEt = Item.Tecnicoet + " " + FormatterHelper.getPersonalHabilitadoName(Item.Tecnicoet);
								//var folio		= Item.Folio;
								//var motivoNoEnt = Item.Motivono;
								var comentarios = Item.Commen;

								LicenciasToExport.push([anio, numLic, idEvento, fecha, hora, cot, tecnicoEt, /*folio, motivoNoEnt,*/ comentarios]);
							}
						}
					}
					return LicenciasToExport;
				}

				function getReanudaciones(aLicencias) {
					LicenciasToExport.push(
						[" "], ["REANUDACIONES"], ["Año", "Num. de Licencia", "Id de evento", "Fecha", "Hora", "COT/COTDT", "Tecnico ET"]
					);
					for (var oLicencia of aLicencias) {
						var aItems = oLicencia.ReanudacionLicencia_nav.results;
						if (aItems.length !== 0) {
							for (var Item of aItems) {
								var anio = Item.Anio;
								var numLic = Item.Id;
								var idEvento = Item.Reaindex;
								var fecha = Item.Time;
								var hora = that.getHoraMin(Item.Time);
								var cot = Item.Cot;
								var tecnicoEt = Item.Tecnicoet + " " + FormatterHelper.getPersonalHabilitadoName(Item.Tecnicoet);

								LicenciasToExport.push([anio, numLic, idEvento, fecha, hora, cot, tecnicoEt]);
							}
						}
					}
					return LicenciasToExport;
				}

				function getCancelaciones(aLicencias) {
					LicenciasToExport.push(
						[" "], ["CANCELACIONES"], ["Año", "Num. de Licencia", "Fecha", "Hora", "TE/JT/JTG", "COT/COTDT",
						"Tecnico ET", "Comentarios",
						"Cancelado"
					]
					);
					for (var oLicencia of aLicencias) {
						var anio = oLicencia.Anio;
						var numLic = oLicencia.Id;
						var fecha = oLicencia.CancFecha;
						var hora = oLicencia.CancHora.ms !== 0 ? FormatterHelper.msToHoursMinutesWithTimeZoneOffset(oLicencia.CancHora.ms) : "";
						var tejt = oLicencia.JefeTrab + " " + FormatterHelper.getJefeName(oLicencia.JefeTrab);
						var comentarios = oLicencia.Comments //Item.Commen;
						var cancel = "Si"
						var cot = oLicencia.CotCotdt;
						var sTecnicoEt = oLicencia.Tecet + " " + FormatterHelper.getPersonalHabilitadoName(oLicencia.Tecet);
						if (fecha) {
							LicenciasToExport.push([anio, numLic, fecha, hora, tejt, cot, sTecnicoEt, comentarios, cancel]);
						}
					}
					return LicenciasToExport;
				}

				var TransferenciasToExport = [];

				function getTransferencias(aLicencias) {
					TransferenciasToExport.push(
						["TRANSFERENCIAS"], ["Año", "Num. de Licencia", "Id de evento", "Fecha", "Hora", "COT/COTDT", "Técnico Informó", "Nuevo JT"]
					);
					for (var oLicencia of aLicencias) {
						var aItems = oLicencia.TransferenciaJefeTrabajo_nav.results;
						if (aItems.length !== 0) {
							for (var Item of aItems) {
								var anio = Item.Anio;
								var numLic = Item.Id;
								var idEvento = Item.Trjindex;
								var fecha = Item.Time;
								var hora = that.getHoraMin(Item.Time);
								var Autcot = Item.Autcot;
								var Teinformo = Item.Teinformo + " " + FormatterHelper.getJefeName(Item.Teinformo);
								var NuevoJT = Item.Jefetra + " " + FormatterHelper.getPersonalHabilitadoName(Item.Jefetra);

								TransferenciasToExport.push([anio, numLic, idEvento, fecha, hora, Autcot, Teinformo, NuevoJT]);
							}
						}
					}
					return TransferenciasToExport;
				}

				//Ticket 578 punto 14 //////////////////////////////////////
				var ObsLicenciasToExport = [];

				function getObsLicencias(aLicencias) {
					var tzoffset = (new Date()).getTimezoneOffset() * 60000;
					ObsLicenciasToExport.push(
						["Observaciones de las Licencias"], ["Año", "Num. de Licencia", "Id de evento", "Fecha", "Hora", "Usuario",
						"Tipificación de la obs", "Observación"
					]
					);
					for (let oLicencia of aLicencias) {
						let aItems = oLicencia.ObservacionesLicencia_nav.results;
						if (aItems.length !== 0) {
							for (let Item of aItems) {
								let anio = Item.Anio;
								let numLic = Item.Id;
								let idEvento = Item.Obsindex;
								let fecha = that.oFormatYyyymmdd.format(new Date(Item.CreationDate.getTime() + tzoffset));
								let hora = that._getHoraMinoDataModel(Item.CreationTime);
								let usuario = Item.Obsuser;
								let tipificacionObs = that._getTipificacionObs(Item.Obscause);
								let observacion = Item.Observation;

								ObsLicenciasToExport.push([anio, numLic, idEvento, fecha, hora, usuario, tipificacionObs, observacion]);
							}
						}
					}
					return ObsLicenciasToExport;
				}

				//Ticket 758 punto 15
				var CoordinacionToExport = [];

				function getCoordinacionLicencias(aLicencias) {
					var tzoffset = (new Date()).getTimezoneOffset() * 60000;
					CoordinacionToExport.push(
						["Coordinaciones de las Licencias"], ["Año", "Num. de Licencia", "Id de evento", "Fecha", "Hora", "Usuario", "Observación"]
					);
					for (let oLicencia of aLicencias) {
						let aItems = oLicencia.CoordinacionesLicencia_nav.results;
						if (aItems.length !== 0) {
							for (let Item of aItems) {
								let anio = Item.Anio;
								let numLic = Item.Id;
								let idEvento = Item.Cooindex;
								let fecha = that.oFormatYyyymmdd.format(new Date(Item.CreationDate.getTime() + tzoffset));
								let hora = that._getHoraMinoDataModel(Item.CreationTime);
								let usuario = Item.Coouser;
								let observacion = Item.Coordination;

								CoordinacionToExport.push([anio, numLic, idEvento, fecha, hora, usuario, observacion]);
							}
						}
					}
					return CoordinacionToExport;
				}
				///////////////////////////////////////////////////////////////////////////////////////////////

				var Tab2Content = XLSX.utils.aoa_to_sheet(
					getEntregas(data),
					getDevoluciones(data),
					getSuspensiones(data),
					getReanudaciones(data),
					getCancelaciones(data)
				);
				var Tab3Content = XLSX.utils.aoa_to_sheet(
					getColocaciones(data),
					getRetiros(data),
					getHabilitaciones(data),
					getInhibiciones(data)

				);
				var Tab4Content = XLSX.utils.aoa_to_sheet(
					getTransferencias(data)
				);

				//Ticket 578 punto 14, 15
				var Tab5Content = XLSX.utils.aoa_to_sheet(
					getObsLicencias(data)
				);
				var Tab6Content = XLSX.utils.aoa_to_sheet(
					getCoordinacionLicencias(data)
				);
				///////////////////

				//Solapa 2
				XLSX.utils.book_append_sheet(Workbook, Tab2Content, "Entregas");
				//Solapa 3
				XLSX.utils.book_append_sheet(Workbook, Tab3Content, "Colocacion");
				//Solapa 4
				XLSX.utils.book_append_sheet(Workbook, Tab4Content, "Transferencias");

				//Ticket 578 punto 14 y 15
				//Solapa 5
				XLSX.utils.book_append_sheet(Workbook, Tab5Content, "Observaciones de las Licencias");

				//Solapa 6
				XLSX.utils.book_append_sheet(Workbook, Tab6Content, "Coordinaciones de las Licencias");

				//EXT-MSUELDIA - Solapa 7
				var TramitacionesToExport = [];

				function getTramitaciones(aLicencias) {
					TramitacionesToExport.push(
						["TRAMITACIONES"], ["Sociedad", "Num. de Licencia", "Fecha y Hora de Tramitación", "Empresa", "Estado de la Tramitación",
						"Causa de la NO Autoriza.", "Aviso de programación", "Motivo de la NO Autoriz.", "Estado diario, Fecha",
						"Estado diario, Estado", "Estado diario, Observaciones"
					]
					);
					for (var oLicencia of aLicencias) {
						var aItems = oLicencia.TramitacionesLicencia_nav.results;
						if (aItems.length !== 0) {
							for (var Item of aItems) {
								var Sociedad = Item.Empresa;
								var NumLic = Item.Id;
								var FechaTram = Item.Fechatramitacion;
								var EmpTramita = Item.EmpTramita;
								var EstadoTramita = Item.Estado;
								var CausaNo = Item.CausaNo;
								var Avisoprog = Item.Avisoprog;
								var MotivoNo = Item.MotivoNo;
								//pasar fecha a gmt-3
								var Fechadiaria = "";
								if (Item.Fechadiaria) {
									var diferenciaUtc = 3 * 60;
									var fechaGMT = new Date(Item.Fechadiaria.getTime() + diferenciaUtc * 60000);

									// Obtener día, mes y año
									var dia = fechaGMT.getDate();
									var mes = fechaGMT.getMonth() + 1;
									var anio = fechaGMT.getFullYear();

									// Formatear la cadena con ceros a la izquierda si es necesario
									var diaStr = (dia < 10) ? '0' + dia : dia;
									var mesStr = (mes < 10) ? '0' + mes : mes;

									// Crear la cadena con el formato 'dd/mm/aaaa'
									Fechadiaria = diaStr + '/' + mesStr + '/' + anio;
								}
								var Estaddiario = Item.Estaddiario;
								var Observacionesdiario = Item.Observacionesdiario;

								TramitacionesToExport.push([Sociedad, NumLic, FechaTram, EmpTramita, EstadoTramita, CausaNo, Avisoprog,
									MotivoNo, Fechadiaria, Estaddiario, Observacionesdiario
								]);
							}
						}
					}
					return TramitacionesToExport;
				}
				var Tab6Content = XLSX.utils.aoa_to_sheet(
					getTramitaciones(data)
				);
				XLSX.utils.book_append_sheet(Workbook, Tab6Content, "Tramitación");
				//FIN EXT-MSUELDIA

				///////////////////////

				let name = `REPORTE AMPLIO LICENCIAS.xlsx`
				XLSX.writeFile(Workbook, name, {
					cellStyles: true
				});

			}).catch((e) => {
				BusyDialogHelper.close()
				MessageBoxHelper.showAlert("Error", "Error al llamar licencias.")
			})
		},

		//ticket 578 punto 3
		_getTramitadorFecha: function (Usuario, Fecha, Hora) {
			//zona horaria
			var tzoffset = (new Date()).getTimezoneOffset() * 60000;
			//fecha
			var dFecha = "";
			if (Fecha) {
				dFecha = this.oFormatYyyymmdd.format(new Date(Fecha.getTime() + tzoffset));
			}
			//hora
			var dHora = "";
			if (Hora.ms !== 0) {
				dHora = new Date(Hora.ms).toISOString().substr(11, 8);
			}
			return `${Usuario} ${dFecha} ${dHora}`
		},

		reporteSemanalCammesa: function (fechadesde, fechahasta, society, daysInBetWeen) {
			return new Promise((resolve, reject) => {
				ReportesService.semanalCamesa(society, fechadesde, fechahasta).then(async (data) => {
					var aData = data.results;
					if (aData.length > 0) {
						aData.forEach((e) => {
							e.Solend = this.getDateFormat(e.Solend);
							e.Solbeg = this.getDateFormat(e.Solbeg);
						});

						var minDate = _.minBy(aData, 'Solbeg');
						var maxDate = _.maxBy(aData, 'Solend');

						var dateArray = [];
						var currentDate = daysInBetWeen.fechadesde;
						var stopDate = daysInBetWeen.fechahasta;
						currentDate.setHours(0, 0, 0, 0);
						stopDate.setHours(0, 0, 0, 0);
						while (currentDate <= stopDate) {
							var sDate = FormatHelper.formatDateLicense(currentDate);
							dateArray.push({
								[sDate]: currentDate,
								stringDate: sDate
							});
							currentDate = new Date(currentDate);
							currentDate.setDate(currentDate.getDate() + 1);
						}

						make_xlsx_lib(XLSX);

						var header = {
							Tipo: "Tipo documento",
							Id: "Id documento",
							Werks: "Región",
							Equnr: "Equipo",
							Descequipo: "Descripcion",
							ComentariosCammesa: "Observaciones",
							ComentariosSolic: "Comentarios",
							Rdisparo: "Riesgo disparo",
							Tiemporep: "Tiempo reposición", //TODO fecha inicio del dia
							Timbeg: "Hora inicial", //TODO fecha fin del dia
							Timend: "Hora final",
						};

						for (var oData of dateArray) {
							var sDate = oData.stringDate;
							header[sDate] = sDate
						}

						aData.forEach((e) => {
							LicenceHelper.setComments(e);
							let ID = e.Id;
							e.Id = e.Tipo === 'S' ? 'ST' + ID.slice(1) : 'L' + ID.slice(1);
							e.Werks = FormatHelper.getRegionesDescriptionByCode(e.Werks);
							e.ComentariosCammesa = FormatHelper.buildCommentCamesa(e);
							e.ComentariosSolic = this.getCommentsFromSol(e);
							e.Rdisparo = e.Rdisparo === "X" ? "SI" : "NO";
							e.Tipo = e.Tipo === "L" ? "Licencias" : "Solicitudes";
							e.Tiemporep = FormatterHelper.getTiempoReposicionDesc(e.Tiemporep);
							e.Timbeg = e.Period === "D" ? FormatHelper.getTimeString(e.Timbeg.ms) : "Continua";
							e.Timend = e.Period === "D" ? FormatHelper.getTimeString(e.Timend.ms) : "Continua";
						});

						//INI TRNS99 - obtener dias anulados
						// aData.forEach(async (e) => {
						// 	for (var oData of dateArray) {
						// 		var sDate = oData.stringDate;
						// 		e[sDate] = "";
						// 	}
						// 	this.setEquipmentStatus(e, dateArray);
						// });
						var aDiasAnulados = await this.getDiasAnulados(aData);
						for (var i = 0; i < aData.length; i++) {
							for (var oData of dateArray) {
								var sDate = oData.stringDate;
								aData[i][sDate] = "";
							}

							var aDiasAnuladosAux = aDiasAnulados.filter(e => (e.Empresa === aData[i].Empresa && e.Id === aData[i].Id))

							this.setEquipmentStatus(aData[i], dateArray, aDiasAnuladosAux);
						}
						//FIN TNRS99

						var aNewData = aData.map((license) => {
							let obj = {};
							for (let key in header) {
								obj[header[key]] = license[key] || "";
							}
							return obj;
						});

						var ws = XLSX.utils.aoa_to_sheet([

						]);

						XLSX.utils.sheet_add_aoa(ws, [
							["DESDE"],
							[dateArray[0].stringDate]
						], {
							origin: "H2"
						});

						var sheet = XLSX.utils.sheet_add_json(ws, aNewData, {
							sheet: "Test Excel Book 1",
							origin: "A7"
						});
						let today = new Date();
						var Workbook = XLSX.utils.book_new();
						XLSX.utils.book_append_sheet(Workbook, sheet, "page1");
						let name = `PROGRAMACION SEMANAL (REUNION CAMMESA).xlsx`;
						XLSX.writeFile(Workbook, name, {
							cellStyles: true
						});
						resolve({
							message: "Rerporte completado satisfactoriamente"
						});
					} else {
						resolve({
							message: "No se encontraron datos."
						});
					}

				}).catch(reject)
			})
		},

		_getDateTextFormat: async function (aData, dateArray) {
			let aFormatData = await Promise.all(aData.map(async (e) => {
				let sTipo = e.Tipo === "Licencias" ? "L" : "S";
				let ID = e.Id;
				let sID = sTipo === 'S' ? `${sTipo}${ID.slice(2)}` : `${sTipo}${ID.slice(1)}`;

				let oDataRead = await ReportesService._getHorariosLicencia(e.Empresa, sID, sTipo, e.Anio);
				let aHorariosDeleted = oDataRead.HorariosPorLicencia_nav.results;

				for (var oData of dateArray) {
					var sDate = oData.stringDate;
					e[sDate] = "";
				}

				this.setEquipmentStatus(e, aHorariosDeleted, []);
				return e
			}));

			return aFormatData
		},

		findDate: function (attr, aDays, license, value, horarios, aDiasAnulados) {
			var sDateFound = aDays.find((oDate) => {
				return oDate.stringDate === attr;
			})
			if (sDateFound) {
				const foundDays = horarios.find(element => element.stringDate === sDateFound.stringDate)
				//INI TRNS99 - ver si la fecha esta autorizada o no
				const foundNoAutorizado = aDiasAnulados.find(element => FormatHelper.formatDateLicense(element.Fecha) === sDateFound.stringDate)
				//FIN TNRS99

				//INI - 10/03/2023 - EXT-MSUELDIA - Se agrega validacion segun license.Timend
				//si tiene el valor "Continua" se debe calcular valor de enserv por mas que no encuentre dias
				if ((foundDays || license.Timend === 'Continua') && !foundNoAutorizado) {
					//FIN - 10/03/2023 - EXT-MSUELDIA - Se agrega validacion segun license.Timend
					var enserv = "";
					enserv = license.Equstat === "" ? "F/S" : "E/S";
					enserv = license.Jobcond === "04" || license.Jobcond === "05" ? "TcT" : enserv;
					return enserv;
				} else {
					return "."
				}
			} else {
				return value;
			}
		},

		setEquipmentStatus: async function (license, horarios, aDiasAnulados) {
			var aDaysIntervalFromLicense = this.getDayIntervalsOfLicense(license.Solbeg, license.Solend);
			for (var attr in license) {
				license[attr] = this.findDate(attr, aDaysIntervalFromLicense, license, license[attr], horarios, aDiasAnulados);
			}
		},

		//INI TRNS99 - obtener dias anulados
		getDiasAnulados: function (sLicencia) {
			return new Promise((resolve, reject) => {
				ReportesService.getDiasAnulados(sLicencia).then((data) => {
					resolve(data);
				});
			})
		},
		//FIN TNRS99

		getDayIntervalsOfLicense: function (solbeg, solend) {
			var dateArray = [];
			var currentDate = solbeg;
			var stopDate = solend;
			currentDate.setHours(0, 0, 0, 0);
			stopDate.setHours(0, 0, 0, 0);
			while (currentDate <= stopDate) {
				var sDate = FormatHelper.formatDateLicense(currentDate)
				dateArray.push({
					stringDate: sDate
				});
				currentDate = new Date(currentDate);
				currentDate.setDate(currentDate.getDate() + 1);
			}
			return dateArray;
		},

		getCommentsFromSol: function (license) {
			let aStringParts = [];
			if (license.Solictext) aStringParts.push(license.Solictext);

			// Tipo de interveción
			if (license.Tipinterv !== "") {
				switch (license.Tipinterv) {
					case "1":
						aStringParts.push("Preventivo");
						break;
					case "2":
						aStringParts.push("Correctivo");
						break;
					case "6":
						aStringParts.push("Obra / Mejora");
						break;
					default:
						aStringParts.push(license.Tipinterv);
						break;
				}
			}

			// Estacional
			switch (license.Estacional) {
				case "1":
					aStringParts.push("Estacional Pendiente");
					break;
				case "2":
					aStringParts.push("Estacional Vigente");
					break;
				case "3":
					aStringParts.push("Estacional Adelantado");
					break;
				case "4":
					aStringParts.push("No estacional");
					break;
				default:
					aStringParts.push("No estacional");
					break;
			}

			if (license.R500kv === "X") aStringParts.push("Requiere calle de 500 KV abierta");
			if (license.Capex === "X") aStringParts.push("CAPEX");
			if (license.Barrafs === "X") aStringParts.push("Requiere barra FS / Barra a Especificar: " + license.Barrafstx);
			if (license.Rdisparo === "X") aStringParts.push("Riesgo de disparo");
			if (license.Bloqueo === "X") aStringParts.push("Bloqueo de recierre");
			if (license.Fstensionret === "X") aStringParts.push("F/S con tensión de retorno");

			return aStringParts.join(" / ");

			// var sSolicText = license.Solictext ? license.Solictext + "/" : "";
			// var sTipinterv = license.Tipinterv ? license.Tipinterv + "/" : "";
			//
			// var sEstacional;
			// if (license.Estacional === "1") {
			// 	sEstacional = "Estacional Pendiente  /";
			// } else if (license.Estacional === "2") {
			// 	sEstacional = "Estacional Vigente  /";
			// } else if (license.Estacional === "3") {
			// 	sEstacional = "Estacional Adelantado  /";
			// } else if (license.Estacional === "4") {
			// 	sEstacional = "No estacional  /";
			// }
			//
			// var sBloqueo = license.Bloqueo === "X" ? "Bloqueo de recierre / " : " ";
			// var sRdisparo = license.Rdisparo === "X" ? "Riesgo de disparo / " : " ";
			//
			// var sCapex = license.Capex === 'X' ? license.Capex = 'CAPEX / ' : ' ';
			// var sRequiereCalle = license.R500kv === "X" ? "Requiere calle de 500 KV abierta /" : " ";
			// var sRequiereBarrsFs = license.Barrafs === "X" ? "Requiere barra FS /" + 'Barra a Especificar: ' + license.Barrafstx + "/ " : "  ";
			//
			// // Este mapeo lo cambie...
			// // var sTensionRetorno = license.Barrafs === "X" ? "F/S con tensión de retorno/" : " ";
			// var sTensionRetorno = license.Fstensionret === "X" ? "F/S con tensión de retorno/" : " ";
			//
			// return `${sSolicText}  ${sTipinterv}  ${sEstacional} ${sRequiereCalle} ${sCapex} ${sRequiereBarrsFs} ${sRdisparo} ${sBloqueo}  ${sTensionRetorno}`
		},

		getHeaderObject: function (sheetType) {
			if (sheetType === "L") {
				var oHeader = {
					Solbeg: "Fecha",
					Equnr: "Codigo Equipo",
					DescEstacion: "Descripcion",
					Tension: "Tensión",
					IdEquipo: "Id. Equipo",
					tipoEquipo: 'Tipo de Equipo',
					TrabajoFS: "Trabajo con Equipo F/S",
					TrabajoES: "Trabajo con Equipo E/S",
					Timbeg: "Horario previsto desde",
					Timend: "Horario previsto hasta",
					ClasifTrab: "Clasificación del trabajo",
					Tipinterv: "Tipo de mantenimiento",
					PoseeAcuerdo: "Posee Acuerdo de sus Usuarios ?",
					Tiemporep: "Tiempo de Reposición",
					Rdisparo: "Riesgo de Disparo",
					RestriccionesAsoc: "Restricciones Asociadas",
					Comments: "Obs",
					Id: "N° Licencia"
				}
			}
			if (sheetType === "E") {
				var oHeader = {
					Solbeg: "Fecha",
					Equnr: "Codigo Equipo",
					DescEstacion: "Descripcion",
					Tension: "Tensión",
					IdEquipo: "Id. Equipo",
					tipoEquipo: 'Tipo de Equipo',
					TrabajoFS: "Trabajo con Equipo F/S",
					TrabajoES: "Trabajo con Equipo E/S",
					Timbeg: "Horario previsto desde",
					Timend: "Horario previsto hasta",
					ClasifTrab: "Clasificación del trabajo",
					Tipinterv: "Tipo de mantenimiento",
					PoseeAcuerdo: "Posee Acuerdo de sus Usuarios ?",
					Tiemporep: "Tiempo de Reposición",
					Rdisparo: "Riesgo de Disparo",
					RestriccionesAsoc: "Restricciones Asociadas",
					Comments: "Obs",
					Id: "N° Licencia"
				}
			}
			if (sheetType === "O") {
				var oHeader = {
					Solbeg: "Fecha",
					Equnr: "Codigo Equipo",
					DescEstacion: "Descripcion",
					IdEquipo: "Id. Equipo",
					TrabajoFS: "Trabajo con Equipo F/S",
					TrabajoES: "Trabajo con Equipo E/S",
					Timbeg: "Horario previsto desde",
					Timend: "Horario previsto hasta",
					ClasifTrab: "Clasificación del trabajo",
					Tipinterv: "Tipo de mantenimiento",
					PoseeAcuerdo: "Posee Acuerdo de sus Usuarios ?",
					Tiemporep: "Tiempo de Reposición",
					Rdisparo: "Riesgo de Disparo",
					RestriccionesAsoc: "Restricciones Asociadas",
					Comments: "Obs",
					Id: "N° Licencia"
				}
			}

			// if (sheetType === "E") {
			// 	oHeader.Equnr = "equiposEspeciales"
			// }
			return oHeader;

		},

		createHeaderWithFilteredData: function (aLicenses, sheetType) {
			const categoriasPorTipoEquipo = this.dictionary;
			//Primer del 70, hacer get a nueva entidad filtrado por empresa y matchear con el nuevo diccionario.

			let aFiltered = aLicenses.filter((license) => categoriasPorTipoEquipo[license.Tipoequipo] == sheetType);
			//categoriasPorTipoEquipo[license.Tipoequipo]
			//funcion que retorne objeto especificopara es et o lineas
			var header = this.getHeaderObject(sheetType)

			let mapExcelData = license => {
				if (license.Licstat === "01") {
					license.usersAgreement = "SI";
				} else if (license.Licstat === "06") {
					license.usersAgreement = "NO";
				} else {
					license.usersAgreement = ""
				}

				if (license.Tipolicencia === "EM") {
					license.TipMante = 'De Emergencia';
				} else if (license.Tipolicencia === "N" || license.Tipolicencia === "TE") {
					license.TipMante = 'No Urgente';
				} else {
					license.TipMante = '';
				}
				license.Equnr = license.Equnr;
				license.Solbeg = FormatHelper.formatDateLicenseReportDiary(license.Solbeg);
				license.TrabajoFS = license.Equstat === "" ? "X" : "";
				license.TrabajoES = license.Equstat === "X" ? "X" : "";

				license.Rdisparo === "X" ? license.Rdisparo = "SI" : license.Rdisparo = "NO";
				license.DescEstacion = license.DescEstacion //FormatterHelper.getDescEstacion(license.Tplnr);
				// issue 504 - el campo Tipoequipo trae un valor incorrecto , se remplazo por el campo tipoEquipo
				//	license.tipoEquipo = license.Tipoequipo;
				if (license.tipoEquipo) {
					license.tipoEquipo = license.tipoEquipo;
				} else {
					license.tipoEquipo = license.Tipoequipo;
				}
				license.Tipinterv = this.formatTipinterv(license.Tipinterv);
				license.Tension = license.Tension;
				license.ID = license.Id;
				license.Timbeg = license.Timbeg ? FormatterHelper.msTohoursSeconds(license.Timbeg.ms + 3 * 60 * 60 * 1000) : "";
				license.Timend = license.Timend ? FormatterHelper.msTohoursSeconds(license.Timend.ms + 3 * 60 * 60 * 1000) : "";

				license.Tiemporep = FormatterHelper.getTiempoReposicionDesc(license.Tiemporep)

				let obj = {};
				for (let key in header) {
					obj[header[key]] = license[key] || "";
				}
				return obj;
			};

			return aFiltered.map(mapExcelData);
		},

		formatTipinterv: function (sTpinterv) {
			var sTpintervDesc = "";
			switch (sTpinterv) {
				case "1":
					sTpintervDesc = "PREVENTIVO";
					break;
				case "2":
					sTpintervDesc = "CORRECTIVO";
					break;
				case "6":
					sTpintervDesc = "OBRA / MEJORA";
					break;
				default:
					sTpintervDesc = "";
			}
			return sTpintervDesc;
		},

		getHorarioPrevistoDesdeContinua: function (aLicenseIntervalOfDays, iSolbeg, horaInicio) {
			let index = _.findIndex(aLicenseIntervalOfDays, function (o) {
				return o.Fecha.getTime() === iSolbeg;
			});
			return index === 0 ? horaInicio : {
				ms: new Date().setHours(21, 0, 0, 0),
				__edmType: "Edm.Time"
			};
		},

		getHorarioPrevistoHastaContinua: function (aLicenseIntervalOfDays, iSolbeg, horaFin) {
			let index = _.findIndex(aLicenseIntervalOfDays, function (o) {
				return o.Fecha.getTime() === iSolbeg;
			});
			return index === aLicenseIntervalOfDays.length - 1 ? horaFin : {
				ms: new Date().setHours(20, 59, 59, 0),
				__edmType: "Edm.Time"
			};
		},

		getSemanalData: function (licenses, desde, hasta, aHorariosOfLicense) {
			let aRangeInterval = this.getDatesRangeInterval(desde, hasta);
			let aLicenses = [];
			for (let oLicense of licenses) {
				var aLicenseIntervalOfDays = this.getDatesRangeInterval(oLicense.Solbeg, oLicense.Solend);
				let aIntersection = _.intersectionBy(aLicenseIntervalOfDays, aRangeInterval, (e) => {
					return e.Fecha.getTime()
				});
				var aDataMapped = aIntersection.map((e) => {
					return {
						...oLicense,
						... {
							Solbeg: e.Fecha
						}
					}
				})
				console.log(aDataMapped)
				aLicenses = aLicenses.concat(aDataMapped)
			}
			//TODO SEGUIR MAÑANA CON LAS CONTINUAS
			aLicenses.forEach((license) => {
				if (license.Period === "D") {
					license.Timbeg = this.getHorarioPrevistoDesde(license.Id, license.Solbeg.getTime(), aHorariosOfLicense);
					license.Timend = this.getHorarioPrevistoHasta(license.Id, license.Solbeg.getTime(), aHorariosOfLicense);
				} else {
					license.Timbeg = this.getHorarioPrevistoDesdeContinua(aLicenseIntervalOfDays, license.Solbeg.getTime(), license.Timbeg)
					license.Timend = this.getHorarioPrevistoHastaContinua(aLicenseIntervalOfDays, license.Solbeg.getTime(), license.Timend)
				}
			})

			return aLicenses
		},

		getHorarioPrevistoDesde: function (sId, iSolbeg, aHorariosOfLicense) {
			let oLicenseWithHorarios = aHorariosOfLicense.find(e => e.Id === sId)
			if (oLicenseWithHorarios) {
				let oFechaEncontrada = oLicenseWithHorarios.HorariosSemana.find(e => e.Fecha.getTime() === iSolbeg)
				if (oFechaEncontrada) {
					return {
						ms: oFechaEncontrada.Horainicio.ms,
						__edmType: "Edm.Time"
					}
				}
				return "";
			}
			return "";
		},

		getHorarioPrevistoHasta: function (sId, iSolbeg, aHorariosOfLicense) {
			let oLicenseWithHorarios = aHorariosOfLicense.find(e => e.Id === sId)
			if (oLicenseWithHorarios) {
				let oFechaEncontrada = oLicenseWithHorarios.HorariosSemana.find(e => e.Fecha.getTime() === iSolbeg)
				if (oFechaEncontrada) {
					return {
						ms: oFechaEncontrada.Horafin.ms,
						__edmType: "Edm.Time"
					}
				}
				return "";
			}
			return "";
		},

		getDatesRangeInterval: function (desde, hasta) {
			var dateArray = [];
			var solBeg = desde
			var solEnd = hasta
			var timBeg = new Date();
			var timeEnd = new Date();

			var currentDate = new Date(solBeg.getTime());
			var stopDate = new Date(solEnd.getTime());
			var timeFrom = new Date(timBeg.getTime());
			var timeTo = new Date(timeEnd.getTime());
			currentDate.setHours(0, 0, 0, 0);
			stopDate.setHours(0, 0, 0, 0);
			while (currentDate <= stopDate) {
				dateArray.push({
					Fecha: currentDate,
				});
				currentDate = new Date(currentDate);
				currentDate.setDate(currentDate.getDate() + 1);
			}
			return dateArray
		},

		workReportCammesa: function (society, desde, hasta, anul) {

			function getNumberOfWeek(date) {
				// let firstDayOfYear = new Date(date.getFullYear(), 0, 1);
				// let pastDaysOfYear = (date - firstDayOfYear) / 86400000;
				// return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

				// Issue #507
				let tdt = new Date(date.valueOf());
				let dayn = (date.getDay() + 6) % 7;
				tdt.setDate(tdt.getDate() - dayn + 3);
				let firstThursday = tdt.valueOf();
				tdt.setMonth(0, 1);
				if (tdt.getDay() !== 4) {
					tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
				}
				return 1 + Math.ceil((firstThursday - tdt) / 604800000);
			}

			return new Promise((resolve, reject) => {

				ReportesService.workReportCammesa(society, desde, hasta, anul).then((licenses) => {
					ReportesService.getLicencesWithHorarioSemanal(licenses).then((data) => {
						licenses.forEach(c => {
							let oData = data.find(x => x.Id === c.Id);
							if (oData) {
								c.Tramitaciones = oData.Tramitaciones
							} else {
								c.Tramitaciones = [];
							}
						});

						var aTplnr = licenses.map(e => e.Tplnr);
						LicenseService.getEstacionesCodes(aTplnr).then((aEstaciones) => {
							LicenseService.getPropiedadesEquipos(society, desde).then((aPropiedadesEquipos) => {
								let aEstacionesCodes = aEstaciones.map(x => {
									return {
										Estacion: x.Estacion,
										CodigoTplnr: x.Codigo
									}
								});
								EquiposService.getEquipos(aEstacionesCodes).then((aEquipos) => {
									LicenseService.getDiccionarioClase(society).then((aDictionary) => {
										var dictionary = {};
										aDictionary.forEach((e) => {
											dictionary[e.TipoEquipo] = e.Clase
										});

										this.dictionary = dictionary;

										licenses.forEach(e => {
											let oEquipo = aEquipos.find(eq => eq.CodigoTplnr === e.Tplnr);
											if (oEquipo) {
												let oEquipoDesc = oEquipo.Equipos.find(equip => equip.CodigoEquipo === e.Equnr);
												if (oEquipoDesc) {
													e.DescEstacion = oEquipoDesc.DescEquipo
												} else {
													e.DescEstacion = ""
												}
											} else {
												e.DescEstacion = ""
											}
										});
										licenses.forEach(e => {
											// Issue #504 -> Nuevo mapeo.
											let oPropiedadEquipo = aPropiedadesEquipos.find(x => x.CodigoEquipo === e.Equnr);
											if (oPropiedadEquipo) {
												e.Tension = oPropiedadEquipo.Tension;
												e.IdEquipo = oPropiedadEquipo.IdBde; // Issue #504 -> Nuevo mapeo (Nroequipocammesa -> IdBde).
												e.tipoEquipo = oPropiedadEquipo.TipoEquipo; // Issue #504 -> Nuevo mapeo (Tipoequipo -> TipoEquipo).
											} else {
												e.Tension = "";
												e.IdEquipo = "";
												e.tipoEquipo = "";
											}
										});
										licenses.forEach(e => {
											e.ClasifTrab = this.getClasifTrab(e.Tipolicencia);
										});
										licenses.forEach(e => {
											e.Solbeg = FormatHelper.formatDatesGMT(e.Solbeg);
											e.Solend = FormatHelper.formatDatesGMT(e.Solend);
											e.PoseeAcuerdo = LicenceHelper.getTramitTextStatus(e.Licstat, e.Tramitaciones);
											e.Comments = LicenceHelper.getCommentsReports(e);
										});
										let aHorariosOfLicenses = data;
										console.log(data);
										make_xlsx_lib(XLSX);

										let programa = desde.getTime() === hasta.getTime() ? "Diario" : "Semanal";
										//TODO VER PROCESO CON CALMA
										if (programa === "Semanal") {
											licenses = this.getSemanalData(licenses, desde, hasta, aHorariosOfLicenses);
										} else {
											licenses = this.getDiaryData(licenses, desde, hasta, aHorariosOfLicenses)
										}

										let aOrdered = _.orderBy(licenses, ['Solbeg', 'Equnr'], ['asc', 'asc']);

										let lineas = this.createHeaderWithFilteredData(aOrdered, "L");

										let eT = this.createHeaderWithFilteredData(aOrdered, "E");

										let equiposEspeciales = this.createHeaderWithFilteredData(aOrdered, "O");

										function createSheet(jsonData) {
											var ws = XLSX.utils.aoa_to_sheet([
												["Año-->", desde.getFullYear()],
												["Semana-->", getNumberOfWeek(desde)],
												["Programa-->", programa],
												["Desde/Hasta:", FormatHelper.formatDate(desde), FormatHelper.formatDate(hasta)],
												[
													"Notas:  El solicitante del mantenimiento de un equipo deberá clasificar el trabajo de acuerdo a la importancia e implicancia del mismo en \"NO URGENTE\" o \"DE EMERGENCIA\" siendo ésta una responsabilidad del Transportista / Distribuidor al presentar esta sol"
												]
											]);
											//ws["!merges"].push("A5:N5") //TODO si quiero esto tengo que ver la ultima version
											//tambien para anchos de columna
											var sheet = XLSX.utils.sheet_add_json(ws, jsonData, {
												sheet: "Test Excel Book 1",
												origin: "A7"
											});

											return sheet;
										}

										let today = new Date();
										var Workbook = XLSX.utils.book_new();
										XLSX.utils.book_append_sheet(Workbook, createSheet(equiposEspeciales), "Equipos Especiales");
										XLSX.utils.book_append_sheet(Workbook, createSheet(eT), "Estaciones Transformadoras");
										XLSX.utils.book_append_sheet(Workbook, createSheet(lineas), "Lineas");

										var name = "";

										if (programa === "Semanal") {
											name = `MTSsem${FormatHelper.getWeekNumber(desde)[1]}_${desde.getFullYear().toString().substr(2, 2)}.xlsx`
										} else {
											name = `MTD${FormatHelper.formatDate(desde).split("-").join("")}.xlsx`
										}

										XLSX.writeFile(Workbook, name, {
											cellStyles: true
										});
										resolve();
									}).catch((e) => {
										reject(e)
									})
								}).catch((e) => {
									reject(e)
								})
							})
						})
					}).catch((e) => {
						reject(e)
					})

				}, err => {
					//TODO manejar aca y rejectear
					reject(err)
				});
			});

		},

		getDiaryData: function (licenses, desde, hasta, aHorariosOfLicense) {
			licenses.forEach((license) => {
				var aLicenseIntervalOfDays = this.getDatesRangeInterval(license.Solbeg, license.Solend);
				license.Solbeg = desde;
				if (license.Period === "D") {
					license.Timbeg = this.getHorarioPrevistoDesde(license.Id, license.Solbeg.getTime(), aHorariosOfLicense);
					license.Timend = this.getHorarioPrevistoHasta(license.Id, license.Solbeg.getTime(), aHorariosOfLicense);
				} else {
					license.Timbeg = this.getHorarioPrevistoDesdeContinua(aLicenseIntervalOfDays, license.Solbeg.getTime(), license.Timbeg)
					license.Timend = this.getHorarioPrevistoHastaContinua(aLicenseIntervalOfDays, license.Solbeg.getTime(), license.Timend)
				}
			})
			return licenses;
		},

		findInitTime: function () {

		},
		findEndTime: function () {

		},

		getClasifTrab: function (sTipoLic) {
			if (sTipoLic === "") {
				return "No Urgente";
			} else {
				if (sTipoLic === "N" || sTipoLic === "TE") {
					return "No Urgente"
				}
				if (sTipoLic === "EM") {
					return "De Emergencia"
				}
			}
		},

		findLegajo: function (sKey) {
			var aPersonalSolicitante = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Solicitante;
			var oPersonal = aPersonalSolicitante.find(e => e.Legajo === sKey)
			if (oPersonal) {
				return oPersonal.Nombre
			}
			return "";
		},

		licenseComparison: function (licenses) {
			var that = this;
			//comment
			let data = [];
			let headers = ["LT", "Solicitante", "Region/Area", "ET", "Equipo CAMMESA / Estado Equipo CAMMESA",
				"Equipo a Intervenir / Condiciones del trabajo",
				"Descripción del trabajo", "Continua o Diario",
				"Fecha Inicio / Fecha Fin", "Horario de Trabajo",
				"Interruptores Abiertos y en Local / Extraidos",
				"Seccionadores Abiertos, Bloqueados y Trabados",
				"Seccionadores de PaT Cerrados",
				"PaT Adicionales(especificar lugar de conexión)",
				"Equipos a Mover / Pruebas Funcionales a Realizar",
				"Bloqueo de recierres (Sólo para TCT)",
				"Interruptores que no deben Operarse (sólo para TcT)",
				"Otras Precauciones de Seguridad",
				"Comentarios del solicitante / Descripcion de las Condiciones Especiales"
			];
			headers.forEach((header, index) => data[index] = [header]);

			licenses.forEach((license, index) => {
				let i = 0; //for easier copypaste
				var RequiereCalleAbierta = license.R500kv === "X" ? " / Calle abierta 500kv" : "";
				var RequiereBarraFS = license.Barrafs === "X" ? " / Requiere barra F/S" : "";
				var EspecificarBarra = license.Barrafstx !== "" ? " / Barra a Especificar: " + license.Barrafstx : "";
				var FsConTensionRetorno = license.Fstensionret === "X" ? " / F/S con tensión de retorno" : "";
				var BloqueoDeRecierres = license.Bloqueo === "X" ? " / Bloqueo de recierres" : "";
				var RiesgoDisparo = license.Rdisparo === "X" ? " / Riesgo de disparo" : "";
				var FechaInicio = license.Solbeg ? FormatHelper.formatDateLicense(license.Solbeg).replaceAll("-", "/") : "";
				var FechaFin = license.Solend ? FormatHelper.formatDateLicense(license.Solend).replaceAll("-", "/") : "";
				let horaInicio = FormatHelper.getTimeStringAndConvertTimezone(license.Timbeg);
				let horaFin = FormatHelper.getTimeStringAndConvertTimezone(license.Timend);

				data[i++][index + 1] = license.Id;
				data[i++][index + 1] = this.findLegajo(license.Solicitante);
				data[i++][index + 1] = that.getText(license.Werks, 'Regiones');

				data[i++][index + 1] = license.Tplnr;
				data[i++][index + 1] = license.Equnr + " - " + license.EqustatText;
				data[i++][index + 1] = license.Equiinterv + " / " + FormatterHelper.getText(license.Jobcond, "Jobcond");
				data[i++][index + 1] = license.Descripcion + RequiereCalleAbierta + RequiereBarraFS + EspecificarBarra + FsConTensionRetorno +
					BloqueoDeRecierres + RiesgoDisparo;
				data[i++][index + 1] = license.Period === "C" ? "Continua" : "Diaria";
				data[i++][index + 1] = FechaInicio + " - " + FechaFin;
				data[i++][index + 1] = `${horaInicio} - ${horaFin}`;
				data[i++][index + 1] = license.Interabier;
				data[i++][index + 1] = license.Seleccionad;
				data[i++][index + 1] = license.Intercerr;
				data[i++][index + 1] = license.Patadic;
				data[i++][index + 1] = license.Equimov;
				data[i++][index + 1] = license.Bloqueorecierretxt;
				data[i++][index + 1] = license.Intnooperar;
				data[i++][index + 1] = license.Precauciones;

				data[i++][index + 1] = license.Solictext;
			});

			make_xlsx_lib(XLSX);
			var sheet = XLSX.utils.aoa_to_sheet(data, {
				sheet: "Test Excel Book 1"
			});

			var Workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(Workbook, sheet, "page1");
			XLSX.writeFile(Workbook, "Comparacion de licencias.xlsx", {
				cellStyles: true
			});

		}
	}
});