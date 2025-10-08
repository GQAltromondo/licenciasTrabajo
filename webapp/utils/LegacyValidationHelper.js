sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatHelper",
], function (AppManagementHelper, FormatHelper) {
	"use strict";
	return {
		checkLegacies: function () {
			var aPersonalSolicitante = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Solicitante;
			var aPersonalJefeTrabajo = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().JefeDeTrabajo;
			var solBeg = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solbeg");
			var solEnd = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solend");
			if (solBeg && solEnd) {
				var sSolicitanteLegajo = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Solicitante")
				var oSolicitante = aPersonalSolicitante.find(e => e.Legajo === sSolicitanteLegajo);
				if (oSolicitante) {
					var oData = {
						dateAdded: true,
						date: oSolicitante.Vigencia,
						estado: oSolicitante.Estado
					}
					this.handleLegacyValidation("Solicitante", oData)
				}

				var sJefeTrabajo = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/Jefe")
				var oJefe = aPersonalJefeTrabajo.find(e => e.Legajo === sJefeTrabajo);
				if (oJefe) {
					var oData = {
						dateAdded: true,
						date: oJefe.Vigencia,
						estado: oJefe.Estado
					}
					this.handleLegacyValidation("JefeTrabajo", oData)
				}

				var sJefeTrabajoSuplente = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/JefeSuplente")
				var oJefeSuplente = aPersonalJefeTrabajo.find(e => e.Legajo === sJefeTrabajoSuplente);
				if (oJefeSuplente) {
					var oData = {
						dateAdded: true,
						date: oJefeSuplente.Vigencia,
						estado: oJefeSuplente.Estado
					}
					this.handleLegacyValidation("JefeTrabajoSuplente", oData)
				}

				var sSolSuplente = AppManagementHelper.getModel("LicenseJsonModel").getProperty("/SolSuplente")
				var oSolSuplente = aPersonalSolicitante.find(e => e.Legajo === sSolSuplente);
				if (oSolSuplente) {
					var oData = {
						dateAdded: true,
						date: oSolSuplente.Vigencia,
						estado: oSolSuplente.Estado
					}
					this.handleLegacyValidation("SolicitanteSuplente", oData)
				}

				//validateDeliveryLegacies

			}
		},

		dateBetweenRange: function (oLicense, dateToCheck) {
			var dateToCheckUTC = FormatHelper.formatDatesGMT(dateToCheck);
			var oLicenseData = AppManagementHelper.getModel("LicenseJsonModel").getData();
			var sSolbeg = oLicense ? oLicense.Solbeg : oLicenseData.Solbeg;
			var sSolend = oLicense ? oLicense.Solend : oLicenseData.Solend;
			if (sSolbeg && sSolend && dateToCheckUTC) {
				if (dateToCheckUTC.getTime() > sSolend.getTime()) {
					return {
						valid: true,
						message: ""
					}
				} else {
					return {
						valid: dateToCheckUTC.getTime() <= sSolend.getTime() && dateToCheckUTC.getTime() >= sSolbeg.getTime(),
						message: ""
					}
				}
			} else {
				return {
					valid: true,
					message: ""
				};
			}
		},

		createLegacyComboStateModel: function () {
			var oModel = AppManagementHelper.getModel("LegacyValidationJsonModel");
			oModel.setData({
				SolicitanteValueState: "Success",
				SolicitanteValueStateText: "",
				JefeTrabajoValueState: "Success",
				JefeTrabajoValueStateText: "",
				JefeTrabajoSuplenteValueState: "Success",
				JefeTrabajoSuplenteValueStateText: "",
				SolicitanteSuplenteValueState: "Success",
				SolicitanteSuplenteAuxValueState: "Success",
				SolicitanteSuplenteAuxValueStateText: "",
				SolicitanteSuplenteValueStateText: "",
				TejtCancelacionDefValueState: "Success",
				TejtCancelacionDefValueStateText: ""
			})
		},

		setWarningState: function (sValueStateProperty, sValueStateTextProperty, sTextForValueState) {
			var oModelLegacyValidation = AppManagementHelper.getModel("LegacyValidationJsonModel");
			oModelLegacyValidation.setProperty(sValueStateProperty, "Warning");
			oModelLegacyValidation.setProperty(sValueStateTextProperty, sTextForValueState);
		},
		setErrorState: function (sValueStateProperty, sValueStateTextProperty, sTextForValueState) {
			var oModelLegacyValidation = AppManagementHelper.getModel("LegacyValidationJsonModel");
			oModelLegacyValidation.setProperty(sValueStateProperty, "Error");
			oModelLegacyValidation.setProperty(sValueStateTextProperty, sTextForValueState);
		},

		setSuccessState: function (sValueStateProperty, sValueStateTextProperty, sTextForValueState) {
			var oModelLegacyValidation = AppManagementHelper.getModel("LegacyValidationJsonModel");
			oModelLegacyValidation.setProperty(sValueStateProperty, "Success");
			oModelLegacyValidation.setProperty(sValueStateTextProperty, sTextForValueState);
		},

		validState: function (state) {
			return state === "H";
		},

		validateLegaciesFromDeliveryDevolution: function (oLicense, aData) {
			var aPersonalTodo = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Todos;
			var sTextWarning = "El legajo seleccionado no se encuentra dentro del rango de la fecha inicio y fin de la licencia";
			var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
			for (let oData of aData) {
				var oPersonal = aPersonalTodo.find(e => e.Legajo === oData.Tejt)
				if (oPersonal) {
					var dateVigencia = oPersonal.Vigencia;
					var state = oPersonal.Estado;
					if (dateVigencia) {
						var oDateBetweenRange = this.dateBetweenRange(oLicense, dateVigencia);
						if (oDateBetweenRange.valid) {
							if (this.validState(state)) {
								if (oDateBetweenRange.message === "") {
									oData.TejtValueState = "Success";
									oData.TejtValueStateText = "";
								} else {
									oData.TejtValueState = "Warning";
									oData.TejtValueStateText = "";
								}

							} else {
								oData.TejtValueState = "Warning";
								oData.TejtValueStateText = "";
							}
						} else {
							oData.TejtValueState = "Warning";
							oData.TejtValueStateText = "";
						}
					}
				}
			}
		},
		validateLegaciesFromPlacementRemoval: function (oLicense, aData) {
			var aPersonalTodo = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Todos;
			var sTextWarning = "El legajo seleccionado no se encuentra dentro del rango de la fecha inicio y fin de la licencia";
			var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
			for (let oData of aData) {
				var oPersonal = aPersonalTodo.find(e => e.Legajo === oData.Tejt)
				if (oPersonal) {
					var dateVigencia = oPersonal.Vigencia;
					var state = oPersonal.Estado;
					if (dateVigencia) {
						var oDateBetweenRange = this.dateBetweenRange(oLicense, dateVigencia);
						if (oDateBetweenRange.valid) {
							if (this.validState(state)) {
								if (oDateBetweenRange.message === "") {
									oData.TejtValueState = "Success";
									oData.TejtValueStateText = "";
								} else {
									oData.TejtValueState = "Warning";
									oData.TejtValueStateText = "";
								}

							} else {
								oData.TejtValueState = "Warning";
								oData.TejtValueStateText = "";
							}
						} else {
							oData.TejtValueState = "Warning";
							oData.TejtValueStateText = "";
						}
					}
				}
			}
		},
		validateLegaciesFromInhibitionEnablement: function (oLicense, aData) {
			var aPersonalTodo = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Todos;
			var sTextWarning = "El legajo seleccionado no se encuentra dentro del rango de la fecha inicio y fin de la licencia";
			var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
			for (let oData of aData) {
				var oPersonal = aPersonalTodo.find(e => e.Legajo === oData.Tejt)
				if (oPersonal) {
					var dateVigencia = oPersonal.Vigencia;
					var state = oPersonal.Estado;
					if (dateVigencia) {
						var oDateBetweenRange = this.dateBetweenRange(oLicense, dateVigencia);
						if (oDateBetweenRange.valid) {
							if (this.validState(state)) {
								if (oDateBetweenRange.message === "") {
									oData.TejtValueState = "Success";
									oData.TejtValueStateText = "";
								} else {
									oData.TejtValueState = "Warning";
									oData.TejtValueStateText = "";
								}

							} else {
								oData.TejtValueState = "Warning";
								oData.TejtValueStateText = "";
							}
						} else {
							oData.TejtValueState = "Warning";
							oData.TejtValueStateText = "";
						}
					}
				}
			}
		},

		validateLegaciesTransfer: function (oLicense, aTransfers) {
			var aPersonalTodo = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Todos;
			var sTextWarning = "El legajo seleccionado no se encuentra dentro del rango de la fecha inicio y fin de la licencia";
			var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
			for (let oData of aTransfers) {
				var oPersonal = aPersonalTodo.find(e => e.Legajo === oData.Jefetra)
				if (oPersonal) {
					var dateVigencia = oPersonal.Vigencia;
					var state = oPersonal.Estado;
					if (dateVigencia) {
						var oDateBetweenRange = this.dateBetweenRange(oLicense, dateVigencia);
						if (oDateBetweenRange.valid) {
							if (this.validState(state)) {
								if (oDateBetweenRange.message === "") {
									oData.JefetraValueState = "Success";
									oData.JefetraValueStateText = "";
								} else {
									oData.JefetraValueState = "Warning";
									oData.JefetraValueStateText = "";
								}

							} else {
								oData.JefetraValueState = "Warning";
								oData.JefetraValueStateText = "";
							}
						} else {
							oData.JefetraValueState = "Warning";
							oData.JefetraValueStateText = "";
						}
					}
				}
				var oPersonalInform = aPersonalTodo.find(e => e.Legajo === oData.Teinformo)
				if (oPersonalInform) {
					var dateVigencia = oPersonal.Vigencia;
					var state = oPersonal.Estado;
					if (dateVigencia) {
						var oDateBetweenRange = this.dateBetweenRange(oLicense, dateVigencia);
						if (oDateBetweenRange.valid) {
							if (this.validState(state)) {
								if (oDateBetweenRange.message === "") {
									oData.TeinformoValueState = "Success";
									oData.TeinformoValueStateText = "";
								} else {
									oData.TeinformoValueState = "Warning";
									oData.TeinformoValueStateText = "";
								}

							} else {
								oData.TeinformoValueState = "Warning";
								oData.TeinformoValueStateText = "";
							}
						} else {
							oData.TeinformoValueState = "Warning";
							oData.TeinformoValueStateText = "";
						}
					}
				}
			}
		},

		validateLegaciesFromSuspentionReanudation: function (oLicense, aData) {
			var aPersonalTodo = AppManagementHelper.getModel("PersonalHabilitadoModel").getData().Todos;
			var sTextWarning = "El legajo seleccionado no se encuentra dentro del rango de la fecha inicio y fin de la licencia";
			var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
			for (let oData of aData) {
				var oPersonal = aPersonalTodo.find(e => e.Legajo === oData.Tecnicoet)
				if (oPersonal) {
					var dateVigencia = oPersonal.Vigencia;
					var state = oPersonal.Estado;
					if (dateVigencia) {
						var oDateBetweenRange = this.dateBetweenRange(oLicense, dateVigencia);
						if (oDateBetweenRange.valid) {
							if (this.validState(state)) {
								if (oDateBetweenRange.message === "") {
									oData.TecnicoetValueState = "Success";
									oData.TecnicoetValueStateText = "";
								} else {
									oData.TecnicoetValueState = "Warning";
									oData.TecnicoetValueStateText = "";
								}
							} else {
								oData.TecnicoetValueState = "Warning";
								oData.TecnicoetValueStateText = "";
							}
						} else {
							oData.TecnicoetValueState = "Warning";
							oData.TecnicoetValueStateText = "";
						}
					}
				}
			}
		},

		handleLegacyValidationForDDSR: function (sLegacy, sPath, oModel, ValueStateProp, ValueStateTextProp, sHabProperty) {

			var aPersonalTodo = AppManagementHelper.getModel("PersonalHabilitadoModel").getProperty(sHabProperty);
			var oPersonal = aPersonalTodo.find(e => e.Legajo === sLegacy)
			var sTextWarning = "El legajo seleccionado no se encuentra dentro del rango de la fecha inicio y fin de la licencia";
			var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
			if (oPersonal) {
				var dateVigencia = oPersonal.Vigencia;
				var state = oPersonal.Estado;
				if (dateVigencia) {
					var oDateBetweenRange = this.dateBetweenRange(null, dateVigencia);
					if (oDateBetweenRange.valid) {
						if (this.validState(state)) {
							if (oDateBetweenRange.message === "") {
								oModel.setProperty(sPath + ValueStateProp, "Success")
								oModel.setProperty(sPath + ValueStateTextProp, "")
							} else {
								oModel.setProperty(sPath + ValueStateProp, "Warning")
								oModel.setProperty(sPath + ValueStateTextProp, "")
							}

						} else {
							var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
							oModel.setProperty(sPath + ValueStateProp, "Error");
							oModel.setProperty(sPath + ValueStateTextProp, sWarningText);
						}
					} else {
						if (this.validState(state)) {
							oModel.setProperty(sPath + ValueStateProp, "Warning")
							oModel.setProperty(sPath + ValueStateTextProp, "")
						} else {
							var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
							oModel.setProperty(sPath + ValueStateProp, "Error");
							oModel.setProperty(sPath + ValueStateTextProp, sWarningText);
						}
					}
				} else {
					if (!this.validState(state)) {
						var sWarningText = "El legajo tiene sus habilitaciones SUSPENDIDAS o DESHABILITADAS";
						oModel.setProperty(sPath + ValueStateProp, "Error");
						oModel.setProperty(sPath + ValueStateTextProp, sWarningText);

					}
				}
			}
		},

		// Helper reutilizable
		_getSelectedPropertyFromAnyModel: function (oEvent, prop, modelsOrder) {
			// Caso especial: evento "sintético" con valores directos
			if (oEvent && oEvent.dateAdded) {
				if (prop === "Vigencia") return oEvent.date ?? null;
				if (prop === "Estado") return oEvent.estado ?? null;
			}

			// Obtener el ítem seleccionado robustamente (selectionChange / change / MultiComboBox)
			const src = oEvent && oEvent.getSource ? oEvent.getSource() : null;
			const item = (oEvent && oEvent.getParameter && (
				oEvent.getParameter("selectedItem") ||  // ComboBox/Select
				oEvent.getParameter("changedItem")      // MultiComboBox
			)) || (src && src.getSelectedItem && src.getSelectedItem()) || null;

			if (!item) return null;

			// Orden de búsqueda de modelos (puede extenderse)
			const names = (modelsOrder && modelsOrder.length ? modelsOrder : [
				"JefesPreviewModel",
				"PersonalHabilitadoModel",
				"HabPersonalModel",
				"HabPersonalTCTModel",
				undefined // modelo por defecto de la vista
			]);

			// Intentar leer la propiedad desde el primer contexto que la tenga
			for (const name of names) {
				const ctx = item.getBindingContext(name);
				if (!ctx) continue;

				// 1) vía getProperty (más eficiente)
				const val = ctx.getProperty(prop);
				if (val !== undefined) return val;

				// 2) vía getObject (por si el path no apunta directo a la propiedad)
				const obj = ctx.getObject && ctx.getObject();
				if (obj && Object.prototype.hasOwnProperty.call(obj, prop)) {
					return obj[prop];
				}
			}

			return null;
		},

		// API pública unificada
		getSelectedVigenciaValue: function (oEvent) {
			return this._getSelectedPropertyFromAnyModel(oEvent, "Vigencia");
		},

		getSelectedStateValue: function (oEvent) {
			return this._getSelectedPropertyFromAnyModel(oEvent, "Estado");
		},

		handleLegacyValidation: function (sType, oEvent) {
			var oModelLegacyValidation = AppManagementHelper.getModel("LegacyValidationJsonModel");
			var dateVigencia = this.getSelectedVigenciaValue(oEvent)
			var state = this.getSelectedStateValue(oEvent)
			var sTextSuccess = "";
			var sTextWarning = "El legajo seleccionado no se encuentra dentro del rango de la fecha inicio y fin de la licencia";
			if (dateVigencia) {
				//validacion de fechas, si está mal warning con mensaje de FECHAS
				var oDateBetweenRange = this.dateBetweenRange(null, dateVigencia);
				if (oDateBetweenRange.valid) {
					//si está validada la fecha correctamente hago una validacion de estado donde devuelo mensaje estado warning state
					if (this.validState(state)) {
						if (sType === "Solicitante") {
							if (oDateBetweenRange.message === "")
								this.setSuccessState("/SolicitanteValueState", "/SolicitanteValueStateText", oDateBetweenRange.message)
							else
								this.setWarningState("/SolicitanteValueState", "/SolicitanteValueStateText", "")
						}
						if (sType === "JefeTrabajo") {
							if (oDateBetweenRange.message === "")
								this.setSuccessState("/JefeTrabajoValueState", "/JefeTrabajoValueStateText", oDateBetweenRange.message)
							else
								this.setWarningState("/JefeTrabajoValueState", "/JefeTrabajoValueStateText", "")
						}
						if (sType === "JefeTrabajoSuplente") {
							if (oDateBetweenRange.message === "")
								this.setSuccessState("/JefeTrabajoSuplenteValueState", "/JefeTrabajoSuplenteValueStateText", oDateBetweenRange.message)
							else
								this.setWarningState("/JefeTrabajoSuplenteValueState", "/JefeTrabajoSuplenteValueStateText", "")
						}
						if (sType === "SolicitanteSuplente") {
							if (oDateBetweenRange.message === "")
								this.setSuccessState("/SolicitanteSuplenteValueState", "/SolicitanteSuplenteValueStateText", oDateBetweenRange.message)
							else
								this.setWarningState("/SolicitanteSuplenteValueState", "/SolicitanteSuplenteValueStateText", "")
						}
						if (sType === "SolicitanteSuplenteAuxiliar") {
							if (oDateBetweenRange.message === "")
								this.setSuccessState("/SolicitanteSuplenteAuxValueState", "/SolicitanteSuplenteAuxValueStateText", oDateBetweenRange.message)
							else
								this.setWarningState("/SolicitanteSuplenteAuxValueState", "/SolicitanteSuplenteAuxValueStateText", "")
						}
						if (sType === "TejtCD") {
							if (oDateBetweenRange.message === "")
								this.setSuccessState("/TejtCancelacionDefValueState", "/TejtCancelacionDefValueStateText", oDateBetweenRange.message)
							else
								this.setWarningState("/TejtCancelacionDefValueState", "/TejtCancelacionDefValueStateText", "")
						}
					} else {
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
					}
				} else {
					if (this.validState(state)) {
						if (sType === "Solicitante") {
							this.setWarningState("/SolicitanteValueState", "/SolicitanteValueStateText", "")
						}
						if (sType === "JefeTrabajo") {
							this.setWarningState("/JefeTrabajoValueState", "/JefeTrabajoValueStateText", "")
						}
						if (sType === "JefeTrabajoSuplente") {
							this.setWarningState("/JefeTrabajoSuplenteValueState", "/JefeTrabajoSuplenteValueStateText", "")
						}
						if (sType === "SolicitanteSuplente") {
							this.setWarningState("/SolicitanteSuplenteValueState", "/SolicitanteSuplenteValueStateText", "")
						}
						if (sType === "SolicitanteSuplenteAuxiliar") {
							this.setWarningState("/SolicitanteSuplenteAuxValueState", "/SolicitanteSuplenteValueStateText", "")
						}
						if (sType === "TejtCD") {
							this.setWarningState("/TejtCancelacionDefValueState", "/TejtCancelacionDefValueStateText", "")
						}
					} else {
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

					}
				}
			} else {
				if (!this.validState(state)) {
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

				}
			}
		}

	};
});