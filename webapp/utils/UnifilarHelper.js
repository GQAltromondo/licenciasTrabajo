sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/services/LicenseService"
], function (AppManagementHelper, LicenseService) {
	"use strict";
	return {

		refreshUnifilar: function () {
			var fResolved, fRejected;
			var oPromiseFinished = new Promise((fResolve, fReject) => {
				fResolved = fResolve;
				fRejected = fRejected;
			});
			var oLicense = AppManagementHelper.getModel("LicenseJsonModel").getData();
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
			} catch (err) {}
			//FIN TRNS126
			LicenseService.getUnifilares(oLicense, (data) => {
				var aUnifilares = data.results.filter(oUnifilar => oUnifilar.Numerolicencia !== "");
				var oModel = AppManagementHelper.getModel("UnifilarListModel");
				oModel.setData({
					Unifilares: aUnifilares,
					index: aUnifilares.length + 1
				});
				var aPromises = this.mapUnifilarData(aUnifilares);
				aPromises = aPromises.concat(this.mapNonRelationatedData(aUnifilares));
				Promise.all(aPromises).then(() => {
					fResolved();
				});

			}, $.proxy(this.onErrorGetUnifilares, this));
			return oPromiseFinished;
		},

		mapUnifilarData: function (aUnifilarHeader) {
			var aPromises = [];
			for (var oData of aUnifilarHeader) {
				aPromises.push(LicenseService.getIndividualUnifilar(oData.Anio, oData.Empresa, oData.Idunifilar, oData.Numerolicencia,
					"/marcadores_nav"));
			}
			Promise.all(aPromises).then((data) => {
				for (var i = 0; i < aUnifilarHeader.length; i++) {
					this.getMarkerByHeaderId(data, aUnifilarHeader[i]);
				}
				this.setDataToLicense(aUnifilarHeader);
			}).catch(() => {
				console.log("error");
			});
			return aPromises;
		},

		//TODO SEGUIR MAÑANA
		getMarkerByHeaderId: function (aData, oUnifilarHeader) {
			for (var oData of aData) {
				var sId = oData.results[0] ? oData.results[0].Idunifilar : ""
				var sNumerolicencia = oData.results[0] ? oData.results[0].Numerolicencia : ""
				if (oUnifilarHeader.Idunifilar === sId && oUnifilarHeader.Numerolicencia === sNumerolicencia) {
					oUnifilarHeader.markers = oData.results;
				}
			}
		},

		mapNonRelationatedData: function (aUnifilarHeader) {
			var aPromises = [];
			for (var oData of aUnifilarHeader) {
				aPromises.push(LicenseService.getIndividualUnifilar(oData.Anio, oData.Empresa, oData.Idunifilar, oData.Numerolicencia,
					"/marcadoresnorel_nav"));
			}
			Promise.all(aPromises).then((data) => {
				for (var i = 0; i < aUnifilarHeader.length; i++) {
					this.getMarkerNonRelationatedByHeaderId(data, aUnifilarHeader[i]);
				}
				this.setDataToLicense(aUnifilarHeader);
			}).catch(() => {
				console.log("error");
			});
			return aPromises;
		},

		getMarkerNonRelationatedByHeaderId: function (aData, oUnifilarHeader) {
			for (var oData of aData) {
				var sId = oData.results[0] ? oData.results[0].Idunifilar : ""
				var sNumerolicencia = oData.results[0] ? oData.results[0].Numerolicencia : ""
				if (oUnifilarHeader.Idunifilar === sId && oUnifilarHeader.Numerolicencia === sNumerolicencia) {
					oUnifilarHeader.NonRelationatedMarkers = oData.results;
				}
			}
		},

		setDataToLicense: function (aUnifilar) {
			//INI TRNS126
			try {
				let unifilaresResumen = AppManagementHelper.getModel("UnifilaresResumenModel").getData();
				for (var i=0; i<aUnifilar.length; i++) {
					//ver si se cargo el unifilar
					if(!unifilaresResumen.unifilares.includes(aUnifilar[i].Idunifilar)){
						unifilaresResumen.unifilares.push(aUnifilar[i].Idunifilar);
						if(!unifilaresResumen.IntAbLe){
							unifilaresResumen.IntAbLe = aUnifilar[i].IntAbLe;
						} else {
							unifilaresResumen.IntAbLe = unifilaresResumen.IntAbLe + ' / ' + aUnifilar[i].IntAbLe;
						}
						if(!unifilaresResumen.SecAbBt){
							unifilaresResumen.SecAbBt = aUnifilar[i].SecAbBt;
						} else {
							unifilaresResumen.SecAbBt = unifilaresResumen.SecAbBt + ' / ' + aUnifilar[i].SecAbBt;
						}
						if(!unifilaresResumen.SecPatCr){
							unifilaresResumen.SecPatCr = aUnifilar[i].SecPatCr;
						} else {
							unifilaresResumen.SecPatCr = unifilaresResumen.SecPatCr + ' / ' + aUnifilar[i].SecPatCr;
						}
						if(!unifilaresResumen.PatAdic){
							unifilaresResumen.PatAdic = aUnifilar[i].PatAdic;
						} else {
							unifilaresResumen.PatAdic = unifilaresResumen.PatAdic + ' / ' + aUnifilar[i].PatAdic;
						}
					}
					const oMarcador = unifilaresResumen.marcadores_nav.find(function (m) {return m.Idunifilar === aUnifilar[i].Idunifilar})
					if(!oMarcador){
						if(aUnifilar[i].markers && aUnifilar[i].markers.length > 0){
							unifilaresResumen.marcadores_nav = unifilaresResumen.marcadores_nav.concat(aUnifilar[i].markers);
						}
					}
					const oMarcadorNr = unifilaresResumen.marcadoresnorel_nav.find(function (mnr) {return mnr.Idunifilar === aUnifilar[i].Idunifilar})
					if(!oMarcadorNr){
						if(aUnifilar[i].NonRelationatedMarkers && aUnifilar[i].NonRelationatedMarkers.length > 0){
							unifilaresResumen.marcadoresnorel_nav = unifilaresResumen.marcadoresnorel_nav.concat(aUnifilar[i].NonRelationatedMarkers);
						}	
					}
				}
				AppManagementHelper.getModel("UnifilaresResumenModel").setData(unifilaresResumen);	
			} catch (err) {}
			//FIN TRNS126
			var sTextoInterruptoresAbiertosTitle = this.getDataText(aUnifilar, "Interabier");
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Interabier", sTextoInterruptoresAbiertosTitle);
			var sTextoSeccionadores = this.getDataText(aUnifilar, "Seleccionad");
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Seleccionad", sTextoSeccionadores);
			var sTextoSeccionadoPatCerrado = this.getDataText(aUnifilar, "Intercerr");
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Intercerr", sTextoSeccionadoPatCerrado);
			var sTextoEquiposAMover = this.getDataText(aUnifilar, "Equimov");
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Equimov", sTextoEquiposAMover);
			var sTextoPatAdicionalesTerceros = this.getDataText(aUnifilar, "Patadic");
			AppManagementHelper.getModel("LicenseJsonModel").setProperty("/Patadic", sTextoPatAdicionalesTerceros);
		},

		getTextoByRadioButtonSelection: function (oUnifilar, aUnifilar, type) {
			switch (type) {
			case "Interabier":
				return this.getInterAbiertos(oUnifilar, aUnifilar);
				break;
			case "Seleccionad":
				return this.getSeccionadoresAbiertos(oUnifilar, aUnifilar);
				break;
			case "Intercerr":
				return this.getSeccionadoresPATCerrados(oUnifilar, aUnifilar);
				break;
			case "Equimov":
				return this.getEquiposAMover(oUnifilar, aUnifilar);
				break;
			case "Patadic":
				return "blank"
				break;
			}
		},

		getDataText: function (aUnifilar, type) {
			var sTitle = ``;
			var sDinamycText = ``;
			var sTotalText = ``;
			var ThirdParty = ``;
			for (var oUnifilar of aUnifilar) {
				sTitle = `${oUnifilar.Et}:`;
				var aMarkers = type === "Patadic" ? oUnifilar.NonRelationatedMarkers ? oUnifilar.NonRelationatedMarkers : [] : oUnifilar.markers ?
					oUnifilar.markers : [];
				sDinamycText = this.getTextoByRadioButtonSelection(oUnifilar, aMarkers, type);
				if (sDinamycText !== "") {
					if (type === "Patadic") {
						var aPatadic = aMarkers.filter(e => e.Tipomarcador === "02");
						var oPatadicTer = oUnifilar.PatAdic;
						//iterar marker y add titls
						if (oPatadicTer !== "" || aPatadic.length !== 0) {
							sTotalText = this.getPatadic(sTotalText, oUnifilar, aPatadic);
						}
					} else {
						var sTitleSSAA = oUnifilar.TipoUnifilar === "S" ? sDinamycText !== "" ? "SSAA: " : "" : "";
						//CAMBIAR ESTO PARA SS AA SOLAMENTE
						sTotalText += sTitleSSAA + sDinamycText;
					}
				}
				console.log(sTotalText);
			}
			return sTotalText;
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

		getInterAbiertos: function (oUnifilar, aMarkers) {
			var sText = ``
			let aData = [];
			for (var oMarker of aMarkers) {
				if (oMarker.Opcionseleccionada === "00") {
					aData.push(oMarker.Clase === "RF" ? `${oMarker.Equipo} (${oMarker.Comentario})` : oMarker.Equipo)
				}
				if (oMarker.Opcionseleccionada === "06") {
					// aData.push(oMarker.Clase === "RF" ? `${oMarker.Equipo} (${oMarker.Comentario})` : oMarker.Equipo)
					aData.push(oMarker.Clase === 'RF' 
					? `${oMarker.Equipo} (${oMarker.Comentario})` : oMarker.Clase === 'IN' 
					? oMarker.Descripcion : oMarker.Equipo )
				}
			}
			sText = aData.join("; ");
			var sSeparator = aData.length === 0 ? "" : " / "
			if (oUnifilar.IntAbLe) {
				sText += `${sSeparator}3ros:${oUnifilar.IntAbLe}`
			}
			sText += sText === "" ? "" : "\n";
			return sText;
		},

		getSeccionadoresAbiertos: function (oUnifilar, aMarkers) {
			var sText = ``
			let aData = [];
			for (var oMarker of aMarkers) {
				if (oMarker.Opcionseleccionada === "01")
					aData.push(oMarker.Clase === "RF" ? `${oMarker.Equipo} (${oMarker.Comentario})` : oMarker.Equipo)
			}
			sText = aData.join("; ");
			var sSeparator = aData.length === 0 ? "" : " / "
			if (oUnifilar.SecAbBt) {
				sText += `${sSeparator}3ros:${oUnifilar.SecAbBt}`
			}
			sText += sText === "" ? "" : "\n";
			return sText;
		},

		getSeccionadoresPATCerrados: function (oUnifilar, aMarkers) {
			var sText = ``
			let aData = [];
			for (var oMarker of aMarkers) {
				if (oMarker.Opcionseleccionada === "02")
					aData.push(oMarker.Equipo)
			}
			sText = aData.join("; ");
			var sSeparator = aData.length === 0 ? "" : " / "
			if (oUnifilar.SecPatCr) {
				sText += `${sSeparator}3ros:${oUnifilar.SecPatCr}`
			}
			sText += sText === "" ? "" : "\n";
			return sText;
		},

		getEquiposAMover: function (oUnifilar, aMarkers) {
			var sText = ``
			let aData = [];
			for (var oMarker of aMarkers) {
				if (oMarker.Opcionseleccionada === "03" || oMarker.Opcionseleccionada === "04" || oMarker.Opcionseleccionada === "05")
					aData.push(oMarker.Clase === "RF" ? `${oMarker.Equipo} (${oMarker.Comentario})` : oMarker.Equipo)
			}
			sText += aData.length === 0 ? "" : aData.join("; ") + "\n";
			return sText;
		},

		getPatadic: function (sTotalText, oUnifilar, aMarkers) {
			sTotalText += oUnifilar.TipoUnifilar === "S" ? `${oUnifilar.Et} SSAA: ` : `${oUnifilar.Et}: `;
			let aPatadic = [];
			for (var i = 0; i < aMarkers.length; i++) {
				aPatadic.push(aMarkers[i].Comentario);
			}
			var sText = aPatadic.join(" / ")

			sTotalText += sText
			var sSeparator = aPatadic.length === 0 ? "" : " / "
			if (oUnifilar.PatAdic) {
				sTotalText += `${sSeparator}3ros: ${oUnifilar.PatAdic}`;
			}
			sTotalText += "\n";
			return sTotalText;
		}
	};
});