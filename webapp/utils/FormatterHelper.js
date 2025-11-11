sap.ui.define([
	//helpers
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper"
], function (AppManagementHelper) {
	"use strict";

	return {

		FormatTiempoRepText: function (sTiempoRepCode) {
			var aTiempoRepData = AppManagementHelper.getModel("RepositionTimes").getData().RepositionTimes;
			var oRepositionTime = aTiempoRepData.find(e => e.Valkey === sTiempoRepCode);
			return oRepositionTime.Valtext;
		},

		getNovedadType: function (sProccess) {
			switch (sProccess) {
				case "E":
					return "ENTR";
				case "D":
					return "DEVU";
				case "R":
					return "REAN";
				case "S":
					return "SUSP";
				case "CC":
					return "CANC";
				// Issue 542 - Registrar automáticamente en el Libro de Guardia la Novedad "NO Entrega de LT
				// Se agrega novedad "No Entrega"
				case "NE":
					return "NENT";
			}
		},

		getLicenseUrl: function (oLicense) {
			return oLicense.Id + ":" + oLicense.Tipo + ":" + oLicense.Empresa + ":" + oLicense.Anio;
		},

		findMotivoNoAut: function (sCausaAnulado) {
			var aData = AppManagementHelper.getModel("MotivoNoAutorizacionJsonModel").getData().Motivos;
			var oData = aData.find(e => {
				return e.key === sCausaAnulado
			});
			return oData ? oData.text : "";
		},

		getApprovalSubstatus: function (status, substatus) {
			if (substatus === "") {
				return "Autorizada"
			} else if (substatus === "E") {
				return "Entregada"
			} else if (substatus === "D") {
				return "Aprobada y devuelta"
			} else if (substatus === "R") {
				//return "Aprobada y reanudada"
				return "Autorizada"
			} else if (substatus === "S") {
				return "Suspendida"
			} else if (substatus === "F") {
				return "Cancelada"
			}
		},

		getStatusName: function (status) {
			if (status == "01") {
				return "Autorizada";
			} else if (status == "28") {
				//antes era Normalizada.
				return "Normalizada";
			} else if (status == "06") {
				return "NO Autorizada";
			} else if (status == "03") {
				return "Anulada";
			} else if (status == "23") {
				return "En Trámite";
			} else if (status == "02") {
				return "Observada";
			} else if (status == "08") {
				return "Entregada";
			} else if (status == "09") {
				return "Generada";
			} else if (status == "30") {
				return "Creada";
			} else if (status == "10") {
				return "Suspendida";
			} else if (status == "05") {
				return "Tramitada";
			} else if (status == "07") {
				return "Coordinada";
			} else if (status == "11") {
				return "Cancelada";
			} else if (status == "90") {
				return "Entregada";
			} else if (status == "91") {
				return "Aprobada y devuelta";
			} else if (status == "92") {
				//return "Aprobada y reanudada";
				return "Autorizada";
			} else if (status == "93") {
				return "Suspendida"
			}
			return status;
		},

		getMotivoAnulacionText: function (k) {
			var aData = AppManagementHelper.getModel("MotivoNoAutorizacionJsonModel").getData().Motivos
			var oData = aData.find(e => e.key === k);
			if (oData) {
				return oData.text
			}
			return "";
		},

		getPerestac: function (key) {
			var aPerestac = AppManagementHelper.getModel("EstacionalListSet").getData().EstacionalListSet
			var oPerestac = aPerestac.find(k => k.Codigo === key)
			return oPerestac ? oPerestac.Descripcion : "";
		},

		getTipoIntervencion: function (key) {
			var aIntervenciones = AppManagementHelper.getModel("TiposIntervencion").getData().TiposIntervencion;
			var oInterv = aIntervenciones.find(k => k.Clave === key)
			return oInterv ? oInterv.Descripcion : "";
		},

		getTiempoReposicionDesc: function (key) {
			let tiempos = AppManagementHelper.getModel("RepositionTimes").getProperty("/RepositionTimes");

			for (let i = 0; i < tiempos.length; i++) {
				let tiempo = tiempos[i];
				if (tiempo.Valkey == key) return tiempo.Valtext;
			}

			return key;
			//TODO this should search the model for the key/description data, but the current is an odatamodel so unnaccesible
		},

		getStatusTramitacionText: function (sLicStat) {
			if (sLicStat === "01") { // Autorizada
				return "Trámite Autorizado";
			}
			if (sLicStat === "06") { // NO Autorizada
				return "Trámite No Autorizado";
			}
			if (sLicStat === "23") { // En tramite
				return "En Trámite";
			}
			return "";
		},

		getMotivoAnulDesc: function (key) {
			if (key == "COND") {
				return "COND - Condiciones climáticas adversas";
			} else if (key == "FALT") {
				return "FALT - Falta de recursos operativos";
			} else if (key == "CONV") {
				return "CONV - Conveniencia de Mantenimientos";
			} else if (key == "ERRO") {
				return "ERRO - LLTT confeccionada por Error";
			} else if (key == "ALTE") {
				return "ALTE -Trabajo alternativo";
			} else if (key == "HLIM") {
				return "HLIM -Aviso de autorización fuera del horario de limite indicado";
			}

			return key;
		},

		getSolicitanteName: function (legajo) {
			let solicitantes = AppManagementHelper.getModel("PersonalHabilitadoModel").getProperty("/Solicitante");
			for (let i = 0; i < solicitantes.length; i++) {
				let solicitante = solicitantes[i];
				if (solicitante.Legajo == legajo) return solicitante.Nombre;
			}
			return "";
		},

		getPersonalHabilitadoName: function (legajo) {
			let personales = AppManagementHelper.getModel("PersonalHabilitadoModel").getProperty("/Todos");
			for (let i = 0; i < personales.length; i++) {
				let personal = personales[i];
				if (personal.Legajo == legajo) return personal.Nombre;
			}
			return "";
		},
		getTipoHabName: function (tipoHab) {
			const get = AppManagementHelper.getModel.bind(AppManagementHelper);


			let habilitaciones = get("HabPersonalModel")?.getData() || [];
			let found = habilitaciones.find(h => h.TipoHab === tipoHab);
			if (found) return found.Descripcion;


			let habilitacionesTCT = get("HabPersonalTCTModel")?.getData() || [];
			found = habilitacionesTCT.find(h => h.TipoHab === tipoHab);
			if (found) return found.Descripcion;


			return "";
		},


		getJefeName: function (legajo) {
			let jefes = AppManagementHelper.getModel("PersonalHabilitadoModel").getProperty("/JefeDeTrabajo");
			for (let i = 0; i < jefes.length; i++) {
				let jefe = jefes[i];
				if (jefe.Legajo == legajo) return jefe.Nombre;
			}
			return "";
		},

		getTipoLicencia: function (code) {
			if (code == "EM") {
				return "Licencia de emergencia";
			} else if (code == "TE") {
				return "Licencia de terceros"
			} else if (code == "N") {
				return "Licencia Programada"
			}
			return code;
		},

		centroToRegion: function (key) {
			let regions = AppManagementHelper.getModel("centroToRegion").getData();
			return regions[key] || key;
		},

		getDescEstacion: function (key) {
			let estaciones = AppManagementHelper.getModel("EstacionesJsonModel").getProperty("/Estaciones");
			let oEstacion = estaciones.find(x => x.Codigo == key);
			if (oEstacion) {
				return oEstacion.Descripcion ? oEstacion.Descripcion : ""
			}
			return "";
		},

		msTohoursSeconds: function (ms) {
			let date = new Date(ms);
			let hours = date.getHours().toString();
			hours = hours.length === 1 ? "0" + hours : hours;

			let minutes = date.getMinutes().toString();
			minutes = minutes.length === 1 ? "0" + minutes : minutes;
			return hours + ":" + minutes;
		},

		msToHoursMinutesWithTimeZoneOffset: function (ms) {
			if (typeof ms !== "number") {
				console.log("Error: El parametro enviado a la funcion msToHoursMinutesWithTimeZoneOffset debe ser un numero!");
				return ''
			} else {
				var HoursMins = this.msTohoursSeconds(new Date(new Date(ms).getTime() + new Date(ms).getTimezoneOffset() * 60 * 1000));

				return HoursMins;
			}
		},

		getPuestoDescription: function (key) {
			//let estaciones = AppManagementHelper.getModel("WorkPlacesJsonModel").getProperty("/WorkPlaces");
			let estaciones = AppManagementHelper.getModel("PuestosTrabajoJsonModel").getProperty("/PuestosTrabajo");
			var Ktext = estaciones.find(x => x.Arbpl == key) ? estaciones.find(x => x.Arbpl == key).Ktext : "";
			return Ktext
		},

		getEmpTramitaDescription: function (key) {
			let empresasTramita = AppManagementHelper.getModel("TramitacionesCatalogoJsonModel").getProperty("/Tramitaciones");
			return empresasTramita.find(x => x.Codigo == key).Nombre
		},

		getDescripcionEstadoDiario: function (key) {
			switch (key) {
				case "NA":
					return "No Autorizada";
				case "CC":
					return "Condicionada";
				case "AS":
					return "Anulada por el solicitante";
				default:
					return key;
			}
		},

		getText: function (value, campo) {
			if (campo === 'Equstatnocam') {
				if (value === 'X') {
					return 'F/S' // Fuera de servicio
				} else {
					return 'E/S' // En servicio
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
			if (campo === 'R500kv') {
				if (value === 'X') {
					return 'SI'
				} else if (value === 'N') {
					return 'NO'
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
					// return 'Reg. Metropolitana'INI MOD - TRNS81
					return 'Región Centro Este' //FIN MOD - TRNS81
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
				} else if (value === 'N') {
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
		},

	};
});