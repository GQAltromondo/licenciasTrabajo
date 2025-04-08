jQuery.sap.require("Transener/Operaciones/LicenciasTrabajo/libs/xlsx");
jQuery.sap.require("Transener/Operaciones/LicenciasTrabajo/libs/jszip");
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	//services
	"Transener/Operaciones/LicenciasTrabajo/services/ganttService/GanttService",
	"Transener/Operaciones/LicenciasTrabajo/services/RegionesService",
	"Transener/Operaciones/LicenciasTrabajo/services/TipoEquipoService",
	"Transener/Operaciones/LicenciasTrabajo/services/RepositionTimeService",
	"Transener/Operaciones/LicenciasTrabajo/services/ganttService/WorkConditionService",
	"Transener/Operaciones/LicenciasTrabajo/services/StatusService",
	"Transener/Operaciones/LicenciasTrabajo/services/ganttService/ReportesService",
	"Transener/Operaciones/LicenciasTrabajo/services/ganttService/PersonalHabilitadoService",
	"Transener/Operaciones/LicenciasTrabajo/services/ganttService/TiposIntervencionService",

	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/Gantt/GanttHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/DateHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/BusyDialogHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/Gantt/formatter",
	"Transener/Operaciones/LicenciasTrabajo/utils/Gantt/ModelHelper"
], function (Controller, GanttService, RegionesService, TipoEquipoService, RepositionTimeService, WorkConditionService, StatusService,
	ReportesService, PersonalHabilitadoService, TiposIntervencionService, FioriHelper, GanttHelper, DateHelper, BusyDialogHelper, formatter,
	ModelHelper) {
	"use strict";

	return Controller.extend("Transener.Operaciones.LicenciasTrabajo.views.Main.Gantt.Gantt", {

		onInit: function () {

			var search = location.hash.split("?")[1];
			var url = new URL(location.origin + "?" + search);
			this.empresa = url.searchParams.get("Empresa"); //TODO sacar este hardcodeo, esto es solo para probar la app localmente
			//this.empresa = "100"; // TODO dejar la linea de arriba antes de commitear
			const oTreeTable = this.byId("ganntTable")

			var filtersModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(filtersModel, "filters");

		},
		onAfterRendering: function () {
			this.prepareSelectsModel();
			this.loadListModels();
			this.loadRegiones(this.empresa);
			PersonalHabilitadoService.getPersonalPromise(this.empresa)
			TiposIntervencionService.getPromise()
			TipoEquipoService.loadTipoEquipo(this.empresa)
			ModelHelper.getModel("PersonalHabilitadoModel", this.getView())
			ModelHelper.getModel("TransenerIntervention", this.getView())
			ModelHelper.getModel("TipoEquipo", this.getView())
			ModelHelper.getModel("TempSeleccionado", this.getView())
			this.loadLicStatus();
		},
		goToHome: function () {
			this.getOwnerComponent().getRouter().navTo("Licencias");
		},

		onRowSelection: function (oEvent) {
			var oTable = this.byId("ganntTable");

			var iSelectedIndex = oTable.getSelectedIndex();
			if (iSelectedIndex !== -1) {
				var oContext = oTable.getContextByIndex(iSelectedIndex);
				var oSelectedRowData = oContext.getObject();
				var oTempSelectionModel = new sap.ui.model.json.JSONModel();
				oTempSelectionModel.setData([oSelectedRowData]);
				this.getView().setModel(oTempSelectionModel, "TempSeleccionado");

			} else {
				sap.m.MessageToast.show("No row selected.");
			}
		},

		loadLicStatus: function () {

			let oModel = new sap.ui.model.json.JSONModel();
			oModel.setSizeLimit(9999);
			oModel.setData(StatusService.get());
			this.getView().setModel(oModel, "Licstat");

		},
		loadRegiones: function (empresa) {
			//Hago esto porque no tiene sentido llamar a un servicio como en licencias si despues le metemos las options...
			var aRegiones = [];
			if (empresa == "100") {
				aRegiones.push({
					Name1: "Norte",
					Werks: "103"
				}, {
					Name1: "Reg. Metropolitana",
					Werks: "102"
				}, {
					Name1: "Sur",
					Werks: "104"
				});
			} else {
				aRegiones.push({
					Name1: "Norte",
					Werks: "113"
				}, {
					Name1: "Sur",
					Werks: "114"
				});
			}

			let oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				results: aRegiones
			});
			this.getView().setModel(oModel, "Regiones");
		},
		onFormatRectangle: function (inicio, fin) {
			if (inicio && fin) {
				var dif = fin.getTime() - inicio.getTime();

				if (dif !== 0) {
					return true;
				}
				return false;
			} else {
				return false;
			}
		},
		getGanttData: function () {
			//	this.getView().byId("FilterPanel").setProperty("expanded", false);

			let SolicitanteModel = this.getView().getModel("PersonalHabilitadoModel").getData().Solicitante
			let JefeTrabajoModel = this.getView().getModel("PersonalHabilitadoModel").getData().JefeDeTrabajo
			// let SolicitanteModel = this.getView().getModel("PersonalHabilitadoModel").getData()
			// let JefeTrabajoModel = this.getView().getModel("PersonalHabilitadoModel").getData()
			let IntervencionesModel = this.getView().getModel("TransenerIntervention").getData()
			let empresa = this.empresa;
			let filtersData = this.getView().getModel("filters").getData();
			let semana = filtersData.week || "01";
			let anio = filtersData.year || new Date().getFullYear();
			let tipo = filtersData.Codigo || "";
			let region = filtersData.Region || "";
			let aStat = filtersData.Licstat || [];
			BusyDialogHelper.open("Cargando...");
			GanttService.getGanttData(empresa, semana, anio, tipo, region, aStat).then((data) => {
				BusyDialogHelper.close();
				let oModel = new sap.ui.model.json.JSONModel();
				data = data.results;
				var dataSoloLosQueTenganFechas = GanttHelper.getDataOnlyWithDates(data);
				GanttHelper.formatData(dataSoloLosQueTenganFechas); //modifica los datos
				// Para que funcionen todos los filtros de la sap.ui.table necesito que los campos que usan formatters tengan un campo adicional 
				// que tenga como valor el texto del mismo ( para que funcionen los filtros ) caso contrario el usuario usa el texto para buscar
				// y al comparar contra el campo tec nico no trae valores
				for (let data of dataSoloLosQueTenganFechas) {
					data.TiemporepText = this.fixedValuesListFormatter(this.getView().getModel("repositionTimesModel").getData(),
						(data.Tiemporep) ? data.Tiemporep : "");

					data.CondtrabajoText = this.fixedValuesListFormatter(this.getView().getModel("workConditionsModel").getData(),
						(data.Condtrabajo) ? data.Condtrabajo : "");

					data.StatLicenciaText = this.licenseStatusFormatter(data.StatLicencia);

					data.JefeTrabajo = this.fixedPersonalFormatter(JefeTrabajoModel, (data.JefeTrabajo) ? data.JefeTrabajo : "")
					data.Solicitante = this.fixedPersonalFormatter(SolicitanteModel, (data.Solicitante) ? data.Solicitante : "")
					data.Tipointerv = this.fixedTipoIntervencionFormatter(IntervencionesModel, data.Tipointerv ? data.Tipointerv :
						"")
				}

				console.log(dataSoloLosQueTenganFechas)
				// const groupedData = dataSoloLosQueTenganFechas.reduce((acc, item) => {
				// 	const existingGroup = acc.find(group => group.EquipoSoli === item.EquipoSoli);
				// 	if (existingGroup) {
				// 		existingGroup.children.push(item);
				// 	} else {
				// 		acc.push({
				// 			EquipoSoli: item.EquipoSoli,
				// 			//	DescEquipo: item.DescEquipo, // Any other relevant information for the parent node
				// 			children: [item]
				// 		});
				// 	}

				// 	return acc;
				// }, []);

				// console.log("Grupo", groupedData)
				oModel.setData({
					data: dataSoloLosQueTenganFechas
				});

				this.getView().setModel(oModel, "RequerimentsModel");
				let timeConfig = GanttHelper.getTimeLineOptions();
				let inicio = DateHelper.getDateOfWeek(semana, anio); //"20191229000000";
				let fin = new Date(inicio.getTime() + 7 * 24 * 60 * 60 * 1000); //inicio mas 8 dias
				let axisTimeStrategy = this.byId("ganttView").getAxisTimeStrategy();
				let axisTimeStrategy2 = this.byId("ganttView2").getAxisTimeStrategy();
				let ZoomLevel = axisTimeStrategy.getZoomLevel();
				ZoomLevel = 1;
				GanttHelper.configAxisTimeStrategy(axisTimeStrategy, timeConfig, inicio, fin, ZoomLevel);
				GanttHelper.configAxisTimeStrategy(axisTimeStrategy2, timeConfig, inicio, fin, ZoomLevel);
			}).catch((err) => {
				//			console.error("error trying to get gantt data", err);
				BusyDialogHelper.close();
				sap.m.MessageBox.alert("Error al cargar los datos del gantt", {
					title: "Alert"
				});
			});
		},

		formatFill: function (EnServicio) {

			if (EnServicio === "") {
				return "#34e531";
			} else {
				return "#e54431";
			}
		},
		prepareSelectsModel: function () {
			//var sPath = FioriHelper.getAppPath();
			let selects = {
				weeks: [],
				years: []
			};

			for (let i = 1; i <= 53; i++) {
				let stringNumber = i.toString();
				if (stringNumber.length === 1) {
					stringNumber = 0 + stringNumber;
				}
				selects.weeks.push({
					code: stringNumber,
					text: i.toString()
				});
			}
			let currentYear = new Date().getFullYear();
			for (let i = 2019; i <= currentYear; i++) {
				selects.years.push({
					code: i.toString(),
					text: i.toString()
				});
			}

			var selectsModel = new sap.ui.model.json.JSONModel(selects);
			//selectsModel.loadData(sPath + "model/selects.json", "", false);
			this.getView().setModel(selectsModel, "selects");
		},

		loadListModels: function () {
			let promises = [RepositionTimeService.getPromise(), WorkConditionService.getPromise()];
			Promise.all(promises).then(res => {
				let repositionTimes = res[0];
				let workConditions = res[1];
				let repositionTimesModel = new sap.ui.model.json.JSONModel(repositionTimes.results);
				let workConditionsModel = new sap.ui.model.json.JSONModel(workConditions.results);
				this.getView().setModel(repositionTimesModel, "repositionTimesModel");
				this.getView().setModel(workConditionsModel, "workConditionsModel");
			});
		},

		fixedValuesListFormatter: function (list, code) {
			if (!list) return "";
			let found = list.find(el => el.Valkey === code);
			return found ? found.Valtext : "";
		},
		fixedPersonalFormatter: function (list, code) {
			if (!list) return "";
			let found = list.find(el => el.Legajo === code);
			return found ? found.Legajo + " - " + found.Nombre : "";
		},
		fixedTipoIntervencionFormatter: function (list, code) {
			if (!list) return "";
			let found = list.find(el => el.Clave === code);
			return found ? found.Descripcion : "";
		},
		licenseStatusFormatter: function (status) {
			return formatter.getStatusName(status);
		},
		/*regionesNameFormatter: function(name){
			var nameSinEmpresa = name.split(" - ")[1] ? name.split(" - ")[1] : name;
			if( nameSinEmpresa === "Reg Metropolitana"){
				return "Reg. Metropolitana";
			}
			else if( nameSinEmpresa === "Reg Norte" ){
				return "Norte"
			}
			else if( nameSinEmpresa === "Reg Sur" ){
				return "Sur"
			}
			else {
				return nameSinEmpresa;
			}
			
		},*/
		showRowFormatter: function (x) {
			console.log(x);
			return true;
		},
		onFastSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("newValue");
			var aFilters = [
				new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter({
							path: "EquipoSoli",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sQuery
						}),
						new sap.ui.model.Filter({
							path: "DescEquipo",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sQuery
						}),
						new sap.ui.model.Filter({
							path: "IdLicencia",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sQuery
						}),
						new sap.ui.model.Filter({
							path: "StatLicencia",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sQuery
						}),
						new sap.ui.model.Filter({
							path: "JefeTrabajo",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sQuery
						}),
						new sap.ui.model.Filter({
							path: "Tipointerv",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sQuery
						}),
						new sap.ui.model.Filter({
							path: "Condtrabajo",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sQuery
						}),
						new sap.ui.model.Filter({
							path: "Comentarios",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sQuery
						}),
						new sap.ui.model.Filter({
							path: "Solicitante",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sQuery
						})
					],
					and: false
				})
			];

			this.getView().byId("ganntTable").getBinding("rows").filter(aFilters);

		},

		// Funcionalidad Export Excel
		onExport: function (oEvent) {

			var oTable = this.getView().byId("ganntTable");
			console.log(oTable)
			var oRows = oTable.getSelectedIndices();

			console.log(oRows)
			var aData = [];
			for (let oRow of oRows) {
				aData.push(oTable.getContextByIndex(oRow).getObject().IdLicencia);
			}
			if (aData.length === 0) {
				sap.m.MessageToast.show("Debe seleccionar las licencias a exportar");
				return;
			}
			BusyDialogHelper.open("Exportando...");
			let filtersData = this.getView().getModel("filters").getData();
			let semana = filtersData.week || "01";
			let anio = filtersData.year || new Date().getFullYear();

			let inicio = DateHelper.getDateOfWeek(semana, anio); //"20191229000000";
			let fin = new Date(inicio.getTime() + 7 * 24 * 60 * 60 * 1000); //inicio mas 8 dias

			var daysInBetWeen = {
				fechadesde: inicio,
				fechahasta: fin
			}

			var iMonthDesde = daysInBetWeen.fechadesde.getMonth() + 1;
			var iMonthHasta = daysInBetWeen.fechahasta.getMonth() + 1;

			var fechahasta = daysInBetWeen.fechahasta.getFullYear().toString() + iMonthHasta.toString().padStart(2,
				"00") + daysInBetWeen.fechahasta.getDate().toString().padStart(2,"00");
			var fechadesde = daysInBetWeen.fechadesde.getFullYear().toString() + iMonthDesde.toString().padStart(2,
				"00") + daysInBetWeen.fechadesde.getDate().toString().padStart(2,"00");
			this.reporteSemanalCammesa(fechadesde, fechahasta, this.empresa, daysInBetWeen, aData).then((oMessage) => {
				BusyDialogHelper.close();
				sap.m.MessageToast.show(
					oMessage.message);
			}).catch((oMessage) => sap.m.MessageBox.error(
				oMessage.message));

		},
		reporteSemanalCammesa: function (fechadesde, fechahasta, society, daysInBetWeen, aData) {

			console.log("Reporte", aData)
			return new Promise((resolve, reject) => {
				ReportesService.semanalCamesa(fechadesde, fechahasta, society, aData).then((data) => {
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
							var sDate = formatter.formatDateLicense(currentDate);
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
							Id: "Num. Licencia",
							Werks: "Región",
							Equnr: "Equipo",
							Descequipo: "Descripcion",
							ComentariosCammesa: "Comentarios CAMMESA",
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
							this.setComments(e);
							let ID = e.Id;
							e.Id = e.Tipo === 'S' ? 'ST' + ID.slice(1) : 'L' + ID.slice(1);
							e.Werks = formatter.getRegionesDescriptionByCode(e.Werks);
							e.ComentariosCammesa = formatter.buildCommentCamesa(e);
							e.ComentariosSolic = this.getCommentsFromSol(e);
							e.Rdisparo = e.Rdisparo === "X" ? "SI" : "NO";
							e.Tipo = e.Tipo === "L" ? "Licencias" : "Solicitudes";
							e.Tiemporep = formatter.getTiempoReposicionDesc(e.Tiemporep, this.getView().getModel("repositionTimesModel").getData());
							e.Timbeg = e.Period === "D" ? formatter.getTimeString(e.Timbeg.ms) : "Continua";
							e.Timend = e.Period === "D" ? formatter.getTimeString(e.Timend.ms) : "Continua";
						});

						aData.forEach((e) => {
							for (var oData of dateArray) {
								var sDate = oData.stringDate;
								e[sDate] = "";
							}
							this.setEquipmentStatus(e);
						});

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
						let name = `Reporte Gantt.xlsx`;
						XLSX.writeFile(Workbook, name, {
							cellStyles: true
						});
						resolve({
							message: "Archivo generado satisfactoriamente"
						});
					} else {
						resolve({
							message: "No se encontraron datos."
						});
					}

				}).catch(reject)
			})
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
		getDateFormat: function (sDate) {
			var year = sDate.substr(0, 4);
			var month = sDate.substr(4, 2);
			var day = sDate.substr(6);

			var dDate = new Date(year + "-" + month + "-" + day);
			var withUtc = new Date(dDate.getTime() + dDate.getTimezoneOffset() * 60 * 1000);
			return withUtc;
		},
		setComments: function (oLicense) {
			if (oLicense.Comments === "") {
				let sValue = "";
				sValue += oLicense.R500kv === "X" ? " Requiere calle 500 kV abierta: Si, " : "";
				sValue += oLicense.Bloqueo === "X" ? " Bloqueo de recierre: Si, " : "";
				sValue += oLicense.Barrafs === "X" ? " Requiere Barra F/S: Si, Barra Especificada: " + oLicense.Barrafstx + " " : "";
				let oDate = formatter.formatDate(oLicense.Solend);
				sValue = sValue + " Equipo a Intervenir: " + oLicense.Equiinterv + " ";
				sValue = sValue + " Trabajo a realizar " + oLicense.Descripcion + " ";
				sValue = sValue + " Finaliza:" + oDate + " LT Nº " + oLicense.Id + " ";
				oLicense.Comments = sValue;
			}
		},
		setEquipmentStatus: function (license) {
			var aDaysIntervalFromLicense = this.getDayIntervalsOfLicense(license.Solbeg, license.Solend);
			for (var attr in license) {
				license[attr] = this.findDate(attr, aDaysIntervalFromLicense, license, license[attr]);
			}
		},
		findDate: function (attr, aDays, license, value) {
			var sDateFound = aDays.find((oDate) => {
				return oDate.stringDate === attr;
			})
			if (sDateFound) {
				var enserv = "";
				enserv = license.Equstat === "" ? "F/S" : "E/S";
				enserv = license.Jobcond === "04" || license.Jobcond === "05" ? "TcT" : enserv;
				return enserv;
			} else {
				return value;
			}
		},
		getDayIntervalsOfLicense: function (solbeg, solend) {
			var dateArray = [];
			var currentDate = solbeg;
			var stopDate = solend;
			currentDate.setHours(0, 0, 0, 0);
			stopDate.setHours(0, 0, 0, 0);
			while (currentDate <= stopDate) {
				var sDate = formatter.formatDateLicense(currentDate)
				dateArray.push({
					stringDate: sDate
				});
				currentDate = new Date(currentDate);
				currentDate.setDate(currentDate.getDate() + 1);
			}
			return dateArray;
		},
		// fin funcionalidad export
	});
});