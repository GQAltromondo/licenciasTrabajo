sap.ui.define([
	//utils
	"Transener/Operaciones/LicenciasTrabajo/utils/FioriComponentHelper"
], function (FioriComponentHelper) {
	"use strict";

	return {

		getModel: function () {
			//gets component
			var component = FioriComponentHelper.getComponent();
			//gets model
			var jsonModel = component.byId("App").getModel("HardCodeModel");
			//checks if model exists
			if (!jsonModel) {
				jsonModel = new sap.ui.model.json.JSONModel(this.getData());
				jsonModel.setSizeLimit(9999);
				//sets model
				component.byId("App").setModel(jsonModel, "HardCodeModel");
			}
			return jsonModel;
		},

		getData: function () {
			return {
				Obscause: [{
					key: "CAMP",
					value: "Modificación de otros campos"
				}, {
					key: "MSEG",
					value: "Modificación de medidas de seguridad"
				}, {
					key: "FECH",
					value: "Modificación de las fechas y horarios"
				}],
				Motivono: [{
					key: "COC",
					value: "Suspendida por CAMMESA"
				}, {
					key: "COT/COTD",
					value: "Suspendida por COT / COTDT"
				}, {
					key: "TERC",
					value: "Suspendida por Terceros"
				}, {
					key: "SOLI",
					value: "Suspendida por el Solicitante"
				}, {
					key: "COND",
					value: "Condiciones climaticas adversas"
				}, {
					key: "NOUT",
					value: "Dia no utilizado"
				}],
				Equstatnocam: [{
					key: "N",
					value: ""
				}, {
					key: "",
					value: "Fuera de Servicio"
				}, {
					key: "X",
					value: "En Servicio"
				}],
				Aro: [{
					key: "Z",
					value: ""
				}, {
					key: "N",
					value: "NO"
				}, {
					key: "X",
					value: "SI"
				}],
				Rdisparo: [{
					key: "N",
					value: ""
				}, {
					key: "X",
					value: "SI"
				}, {
					key: "",
					value: "NO"
				}],
				Bloqueo: [{
					key: "N",
					value: ""
				}, {
					key: "X",
					value: "SI"
				}, {
					key: "",
					value: "NO"
				}],
				R500KV: [{
						key: "",
						value: ""
					}, {
						key: "Y",
						value: "NO CORRESPONDE"
					}, {
						key: "X",
						value: "SI"
					}, {
						key: "N",
						value: "NO"
					}

				],
				EqustatCammesa: [{
					key: "N",
					value: ""
				}, {
					key: "",
					value: "Fuera de Servicio"
				}, {
					key: "X",
					value: "En Servicio"
				}]
			};
		}

	};
});