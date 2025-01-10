sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.License.License", {

	getControllerName: function () {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.License.License";
	},

	createContent: function (oController) {

		var oCommentTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay comentarios CAMMESA",
			columns: [
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Semana"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Estado Semanal"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Comentario"
					})
				})
			],
			items: {
				path: "CammesaCommentsModel>/Comments",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: {
								parts: ["CammesaCommentsModel>Anio", "CammesaCommentsModel>Semana"],
								formatter: function (Anio, Semana) {
									return Semana + " / " + Anio
								}
							},
						}),
						new sap.m.Text({
							text: "{CammesaCommentsModel>EstadoSemanal}"
						}),
						new sap.m.Text({
							text: "{CammesaCommentsModel>Comentario}"
						})
					]
				})
			}
		});
		//page
		var oTransferTemplate = new sap.m.HBox({
			width: '100%',
			items: [
				new sap.ui.layout.form.SimpleForm({
					layout: "ResponsiveGridLayout",
					editable: true,
					content: [
						new sap.m.Label({
							text: "Nuevo JT",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}),
						new sap.m.ComboBox({
							selectedKey: "{TransferListJsonModel>Jefetra}",
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							
							valueState: "{TransferListJsonModel>JefetraValueState}",
							id: "jefeTrabTrComb",
							valueStateText: "{TransferListJsonModel>JefetraValueStateText}",
							change: [oController.handleLegacyValidationTransfers, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"TransferListJsonModel>enabledCombo"
								],
								formatter: oController.rolStatusEdition("transferencia/")
							},
							items: {
								path: "PersonalHabilitadoModel>/JefeDeTrabajo",
								templateShareable: false,
								template: new sap.ui.core.Item({
									key: "{PersonalHabilitadoModel>Legajo}",
									text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
								})
							},
						}),
						new sap.m.Label({
							text: "Fecha y hora",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								indent: "L2"
							})
						}),
						new sap.m.Text({
							text: {
								path: "TransferListJsonModel>Time",
								formatter: $.proxy(oController.formatTimeText, oController)
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}),

						/****** fila 2 *****/
						new sap.m.HBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L12 M12 S12"
							}),
						}),

						new sap.m.Label({
							text: "TE que informó",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"TransferListJsonModel>enabledCombo"
								],
								formatter: oController.rolStatusEdition("transferencia/")
							},
							selectedKey: "{TransferListJsonModel>Teinformo}",
							valueState: "{TransferListJsonModel>TeinformoValueState}",
							valueStateText: "{TransferListJsonModel>TeinformoValueStateText}",
							change: [oController.handleLegacyValidationTransfersTeInformer, oController],
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: {
								path: "PersonalHabilitadoModel>/JefeDeTrabajo",
								templateShareable: false,
								template: new sap.ui.core.Item({
									key: "{PersonalHabilitadoModel>Legajo}",
									text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
								})
							},
						}),
						new sap.m.Label({
							text: "Autorizó en el COT/COTDT",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								indent: "L2"
							})
						}),
						new sap.m.Text({ //Visible en las demas filas
							visible: {
								path: "TransferListJsonModel>Trjindex",
								formatter: function (sTrjindex) {
									if (sTrjindex !== "" && sTrjindex !== undefined) {
										return true
									} else {
										return false
									}
								}
							},
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
								formatter: oController.rolStatusEdition("transferencia/")
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
							width: '160px',
							text: "{TransferListJsonModel>Autcot}"
						}),
						new sap.m.Text({ //Solo visible en la ultima fila
							visible: {
								path: "TransferListJsonModel>Trjindex",
								formatter: function (sTrjindex) {
									return sTrjindex === "" || sTrjindex === undefined;
								}
							},
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
								formatter: oController.rolStatusEdition("transferencia/")
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
							width: '160px',
							text: {
								path: "DeliveryTableJsonModel>Cot",
								formatter: $.proxy(oController.handleUserName, oController)
							}
						}),

						/*new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
								formatter: oController.rolStatusEdition("transferencia/")
							},
							selectedKey: "{TransferListJsonModel>Autcot}",
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12"
							}),
							items: [
								new sap.ui.core.Item({
									text: {
										path: "DeliveryTableJsonModel>Cot",
										formatter: $.proxy(oController.handleUserName, oController)
									},
									key: {
										path: "DeliveryTableJsonModel>Cot",
										formatter: $.proxy(oController.handleUserName, oController)
									}
								})
							]
						}),*/
						/*new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
								formatter: oController.rolStatusEdition("transferencia/")
							},
							selectedKey: "{TransferListJsonModel>Autcot}",
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12"
							}),
							items: [
								new sap.ui.core.Item({
									text: "SI",
									key: "X"
								}),
								new sap.ui.core.Item({
									text: "NO",
									key: "Y"
								})
							]
						}),*/

						new sap.m.Button({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
								formatter: oController.rolStatusEdition("transferencia/")
							},
							visible: {
								path: "TransferListJsonModel>Trjindex",
								formatter: function (sTrjindex) {
									return sTrjindex === "" || sTrjindex === undefined;
								}
							},
							text: "Realizar Transferencia",
							press: [oController.onSendTransfer, oController],
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								indent: "L10"
							})
						}).addStyleClass("buttonInverted")
					]
				})
			]
		});

		var oTramitacionTable = new sap.m.Table({
			// templateShareable: true,
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay tramitaciones",
			columns: [
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Empresa"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Estado de tramitacion"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Causa de NO Autorizacion"
					})
				}),
				/*new sap.m.Column({
					header: new sap.m.Text({
						text: "Aviso al tecnico de la ET"
					})
				}),*/
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Avisó desde programación"
					})
				}),
				/*	new sap.m.Column({
						header: new sap.m.Text({
							text: "Trasmitió COT"
						})
					}),*/
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Motivo de no Autorizacion"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				}),
				new sap.m.Column({
					header: new sap.m.Button({
						press: [oController.onAddTramitacion, oController],
						icon: "sap-icon://add",
						enabled: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"DisableControlsJsonModel>/visibleLic", "ValidateFirstDeliveryJsonModel>/FirstDeliveryHasBeenMade"
							],
							formatter: oController.rolStatusEdition("tramitacion/")
						},
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"DisableControlsJsonModel>/visibleLic"
							],
							formatter: oController.rolStatusEdition("tramitacion/")
						},
					}).addStyleClass("buttonInverted")
				})
			],
			items: {
				path: "TramitacionListJsonModel>/Tramitaciones",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.ComboBox({
							width: "100%",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DisableControlsJsonModel>/visibleLic", "ValidateFirstDeliveryJsonModel>/FirstDeliveryHasBeenMade"
								],
								formatter: oController.rolStatusEdition("tramitacion/")
							},
							selectedKey: "{TramitacionListJsonModel>EmpTramita}",
							items: {
								templateShareable: false,
								path: "EmpresaTramitacionJsonModel>/Empresas",
								template: new sap.ui.core.Item({
									key: "{EmpresaTramitacionJsonModel>Codigo}",
									text: "{EmpresaTramitacionJsonModel>Descripcion} - {EmpresaTramitacionJsonModel>Codigo}"
								})
							}
						}),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DisableControlsJsonModel>/visibleLic", "ValidateFirstDeliveryJsonModel>/FirstDeliveryHasBeenMade"
								],
								formatter: oController.rolStatusEdition("tramitacion/")
							},
							change: [oController.enableCausaNO, oController],
							selectedKey: "{TramitacionListJsonModel>Estado}",
							/*
							items: [
								new sap.ui.core.Item({
									key: "01",
									text: "Trámite Autorizado"
								}),
								new sap.ui.core.Item({
									key: "06",
									text: "Trámite No Autorizado"
								}),
								new sap.ui.core.Item({
									key: "23",
									text: "En Trámite"
								})
							]
							*/
							items: {
								templateShareable: false,
								path: "StatusTramitacion>/Estado",
								filters: [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_OP_TRALIC"),
								new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "ESTADO")
								],
								template: new sap.ui.core.Item({
									key: "{StatusTramitacion>Valkey}",
									text: "{StatusTramitacion>Valtext}"
								})
							}

						}),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DisableControlsJsonModel>/visibleLic", "ValidateFirstDeliveryJsonModel>/FirstDeliveryHasBeenMade",
									"TramitacionListJsonModel>Enabled"
								],
								formatter: oController.rolStatusEdition("tramitacion/")
							},
							selectedKey: "{TramitacionListJsonModel>CausaNo}",
							tooltip: {
								path: "TramitacionListJsonModel>CausaNo",
								formatter: $.proxy(oController.CausaNoFormatter, oController)
							},
							items: {
								templateShareable: false,
								path: "MotivoNoAutorizacion>/",
								template: new sap.ui.core.Item({
									key: "{MotivoNoAutorizacion>Status}",
									text: "{MotivoNoAutorizacion>Descripcion}"
								})
							}
						}),
						/*new sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DisableControlsJsonModel>/visibleLic",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("tramitacion/")
							},
							selectedKey: "{TramitacionListJsonModel>Avisotecet}",
							items: {
								path: "PersonalHabilitadoModel>/Todos",
								template: new sap.ui.core.Item({
									key: "{SelectModel>Legajo}",
									text: "{SelectModel>Legajo} {SelectModel>Nombre}"
								})
							}
						}),*/
						new sap.m.Text({
							/*	text: {
									path: "TramitacionListJsonModel>Avisoprog",
									formatter: $.proxy(oController.handleUserName, oController)
								},*/
							text: "{TramitacionListJsonModel>Avisoprog}"
						}),
						/*	new sap.m.Text({
								text: "{TramitacionListJsonModel>Trascot}"
							}),*/
						new sap.m.Input({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DisableControlsJsonModel>/visibleLic", "ValidateFirstDeliveryJsonModel>/FirstDeliveryHasBeenMade",
									"TramitacionListJsonModel>Enabled"
								],
								formatter: oController.rolStatusEdition("tramitacion/")
							},
							value: "{TramitacionListJsonModel>MotivoNo}",
							tooltip: "{TramitacionListJsonModel>MotivoNo}"
						}),
						new sap.m.Button({
							visible: {
								path: "TramitacionListJsonModel>Estado",
								formatter: function (sEstado) {
									return sEstado === "01"
								}
							},
							icon: "sap-icon://appointment-2",
							//text: "Estado diario",
							press: [oController.openTramitacionCalendarTable, oController],
							customData: {
								Type: "sap.ui.core.CustomData",
								key: "tieneDias",
								value: {
									path: "TramitacionListJsonModel>CalendarDates",
									formatter: function (dates) {
										if (dates.length !== 0) {
											return "true";
										} else {
											return "false";
										}
									}
								},
								writeToDom: true
							}
						}).addStyleClass("buttonInverted estadoDiarioIcon"),
						new sap.m.Button({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DisableControlsJsonModel>/visibleLic", "ValidateFirstDeliveryJsonModel>/FirstDeliveryHasBeenMade"
								],
								formatter: oController.rolStatusEdition("tramitacion/")
							},
							icon: "sap-icon://delete",
							press: $.proxy(oController.onDeleteFromTable, oController, "TramitacionListJsonModel")
						}).addStyleClass("buttonInverted")
					]
				})
			}
		});
		var oTurnoTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay Turnos",
			columns: [
				new sap.m.Column({
					width: "20%",
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					width: "15%",
					header: new sap.m.Text({
						text: "Hora Inicio"
					})
				}),
			],
			items: {
				path: "TurnosTableJsonModel>/Turno",
				template: new sap.m.ColumnListItem({
					visible: "{TurnosTableJsonModel>enabled}",
					cells: [
						new sap.m.Input({
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"ColocacionTableJsonModel>enabled",
							// 		"ColocacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocacion/")
							// },
							value: "{TurnosTableJsonModel>Dateturno}",
							width: "100%"
						}),
						new sap.m.Input({
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"ColocacionTableJsonModel>enabled",
							// 		"ColocacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocacion/")
							// },
							value: "{TurnosTableJsonModel>Turno}",
							width: "100%"
						}),
					]
				})
			}
		});
		var oColocacionTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay colocaciones",
			columns: [
				new sap.m.Column({
					width: "20%",
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					width: "15%",
					header: new sap.m.Text({
						text: "Hora"
					})
				}),
				new sap.m.Column({
					width: "20%",
					header: new sap.m.Text({
						text: "ET"
					})
				}),
				new sap.m.Column({
					width: "40%",
					header: new sap.m.Text({
						text: "Comentarios"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				})
			],
			items: {
				path: "ColocacionTableJsonModel>/Colocacion",
				template: new sap.m.ColumnListItem({
					visible: "{ColocacionTableJsonModel>enabled}",
					cells: [
						new sap.m.DatePicker({
							specialDates: {
								templateShareable: false,
								path: "EspecialDatesTramitacion>/Fechas",
								template: new sap.ui.unified.DateTypeRange({
									startDate: "{EspecialDatesTramitacion>Fecha}",
									type: {
										path: "EspecialDatesTramitacion>Estado",
										formatter: oController.tipoSegunEstado
									}
								})
							},
							change: $.proxy(oController.handleDateChange, oController, "ColocacionTableJsonModel"),
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"ColocacionTableJsonModel>enabled",
							// 		"ColocacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocaciones/")
							// },
							dateValue: "{ColocacionTableJsonModel>Datehab}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							displayFormat: "dd-MM-yyyy"
						}),
						new sap.m.TimePicker({
							change: [oController.handleDateChange, oController],
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"ColocacionTableJsonModel>enabled",
							// 		"ColocacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocacion/")
							// },
							dateValue: "{ColocacionTableJsonModel>Time}",
							displayFormat: "HH:mm"
						}),
						new sap.m.ComboBox({
							width: "100%",
							// enabled: {
							// 	parts: [
							// 		"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"ColocacionTableJsonModel>enabled", "ColocacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocacion/")
							// },
							selectedKey: "{ColocacionTableJsonModel>Tplnr}",
							items: {
								path: "EstacionesJsonModel>/EstacionesPorRegion",
								template: new sap.ui.core.Item({
									key: "{EstacionesJsonModel>Codigo}",
									text: "{EstacionesJsonModel>Codigo} - {EstacionesJsonModel>Descripcion}"
								})
							},
						}),

						new sap.m.Input({
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"ColocacionTableJsonModel>enabled",
							// 		"ColocacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocacion/")
							// },
							value: "{ColocacionTableJsonModel>Coment}",
							width: "100%"
						}),

						new sap.m.Button({
							text: "Agregar ET",
							// enabled: {
							// 	parts: [
							// 		"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"ColocacionTableJsonModel>enabled", "ColocacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocacion/")
							// },
							visible: {
								parts: [{
									path: "ColocacionTableJsonModel>enabled"
								}],
								formatter: function (bEnabled) {
									return bEnabled;
								}
							},
							press: [oController.sendColocacionPAT, oController]
						}).addStyleClass("buttonInverted")
					]
				})
			}
		});
		var oRetiroTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay retiros",
			columns: [
				new sap.m.Column({
					width: "20%",
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					width: "15%",
					header: new sap.m.Text({
						text: "Hora"
					})
				}),
				new sap.m.Column({
					width: "20%",
					header: new sap.m.Text({
						text: "ET"
					})
				}),
				new sap.m.Column({
					width: "40%",
					header: new sap.m.Text({
						text: "Comentarios"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				})
			],
			items: {
				path: "RetiroTableJsonModel>/Retiro",
				template: new sap.m.ColumnListItem({
					// visible: "{RetiroTableJsonModel>enabled}",
					cells: [
						new sap.m.DatePicker({
							specialDates: {
								templateShareable: false,
								path: "EspecialDatesTramitacion>/Fechas",
								template: new sap.ui.unified.DateTypeRange({
									startDate: "{EspecialDatesTramitacion>Fecha}",
									type: {
										path: "EspecialDatesTramitacion>Estado",
										formatter: oController.tipoSegunEstado
									}
								})
							},
							change: $.proxy(oController.handleDateChange, oController, "RetiroTableJsonModel"),
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"RetiroTableJsonModel>enabled",
							// 		"RetiroTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("retiro/")
							// },
							dateValue: "{RetiroTableJsonModel>Datehab}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							displayFormat: "dd-MM-yyyy"
						}),
						new sap.m.TimePicker({
							change: [oController.handleDateChange, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"RetiroTableJsonModel>enabled",
									"RetiroTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
								],
								formatter: oController.rolStatusEdition("retiro/")
							},
							dateValue: "{RetiroTableJsonModel>Time}",
							displayFormat: "HH:mm"
						}),
						new sap.m.ComboBox({

							width: "100%",
							// enabled: {
							// 	parts: [
							// 		"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"RetiroTableJsonModel>enabled", "RetiroTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("retiro/")
							// },
							selectedKey: "{RetiroTableJsonModel>Tplnr}",
							items: {
								path: "EstacionesJsonModel>/EstacionesPorRegion",
								template: new sap.ui.core.Item({
									key: "{EstacionesJsonModel>Codigo}",
									text: "{EstacionesJsonModel>Codigo} - {EstacionesJsonModel>Descripcion}"
								})
							},
						}),

						new sap.m.Input({
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"RetiroTableJsonModel>enabled",
							// 		"RetiroTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("retiro/")
							// },
							value: "{RetiroTableJsonModel>Coment}",
							width: "100%"
						}),

						new sap.m.Button({
							text: "Agregar ET",
							// enabled: {
							// 	parts: [
							// 		"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"RetiroTableJsonModel>enabled", "RetiroTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("retiro/")
							// },
							visible: {
								parts: [{
									path: "RetiroTableJsonModel>enabled"
								}],
								formatter: function (bEnabled) {
									return bEnabled;
								}
							},
							press: [oController.sendRetiroPAT, oController]
						}).addStyleClass("buttonInverted")
					]
				})
			}
		});
		var oInhibicionTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay inhibiciones",
			columns: [
				new sap.m.Column({
					width: "20%",
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					width: "15%",
					header: new sap.m.Text({
						text: "Hora"
					})
				}),
				new sap.m.Column({
					width: "20%",
					header: new sap.m.Text({
						text: "ET"
					})
				}),
				new sap.m.Column({
					width: "40%",
					header: new sap.m.Text({
						text: "Comentarios"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				})
			],
			items: {
				path: "InhibicionTableJsonModel>/Inhibicion",
				template: new sap.m.ColumnListItem({
					visible: "{InhibicionTableJsonModel>enabled}",
					cells: [
						new sap.m.DatePicker({
							specialDates: {
								templateShareable: false,
								path: "EspecialDatesTramitacion>/Fechas",
								template: new sap.ui.unified.DateTypeRange({
									startDate: "{EspecialDatesTramitacion>Fecha}",
									type: {
										path: "EspecialDatesTramitacion>Estado",
										formatter: oController.tipoSegunEstado
									}
								})
							},
							change: $.proxy(oController.handleDateChange, oController, "InhibicionTableJsonModel"),
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"InhibicionTableJsonModel>enabled",
							// 		"InhibicionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("inhibicion/")
							// },
							dateValue: "{InhibicionTableJsonModel>Datehab}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							displayFormat: "dd-MM-yyyy"
						}),
						new sap.m.TimePicker({
							change: [oController.handleDateChange, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"InhibicionTableJsonModel>enabled",
									"InhibicionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
								],
								formatter: oController.rolStatusEdition("inhibicion/")
							},
							dateValue: "{InhibicionTableJsonModel>Time}",
							displayFormat: "HH:mm"
						}),

						new sap.m.ComboBox({
							width: "100%",
							// enabled: {
							// 	parts: [
							// 		"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"InhibicionTableJsonModel>enabled", "InhibicionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("inhibicion/")
							// },

							selectedKey: "{InhibicionTableJsonModel>Tplnr}",
							items: {
								path: "EstacionesJsonModel>/EstacionesPorRegion",
								template: new sap.ui.core.Item({
									key: "{EstacionesJsonModel>Codigo}",
									text: "{EstacionesJsonModel>Codigo} - {EstacionesJsonModel>Descripcion}"
								})
							},
						}),

						new sap.m.Input({
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"InhibicionTableJsonModel>enabled",
							// 		"InhibicionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("inhibicion/")
							// },
							value: "{InhibicionTableJsonModel>Coment}"
						}),

						new sap.m.Button({
							text: "Agregar ET",
							// enabled: {
							// 	parts: [
							// 		"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"InhibicionTableJsonModel>enabled", "InhibicionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("inhibicion/")
							// },
							visible: {
								parts: [{
									path: "InhibicionTableJsonModel>enabled"
								}],
								formatter: function (bEnabled) {
									return bEnabled;
								}
							},
							press: [oController.sendInhibicion, oController]
						}).addStyleClass("buttonInverted")
					]
				})
			}
		});
		var oHabilitacionTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay habilitaciones",
			columns: [
				new sap.m.Column({
					width: "20%",
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					width: "15%",
					header: new sap.m.Text({
						text: "Hora"
					})
				}),
				new sap.m.Column({
					width: "20%",
					header: new sap.m.Text({
						text: "ET"
					})
				}),
				new sap.m.Column({
					width: "40%",
					header: new sap.m.Text({
						text: "Comentarios"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				})
			],
			items: {
				path: "HabilitacionTableJsonModel>/Habilitacion",
				template: new sap.m.ColumnListItem({
					visible: "{HabilitacionTableJsonModel>enabled}",
					cells: [

						new sap.m.DatePicker({
							specialDates: {
								templateShareable: false,
								path: "EspecialDatesTramitacion>/Fechas",
								template: new sap.ui.unified.DateTypeRange({
									startDate: "{EspecialDatesTramitacion>Fecha}",
									type: {
										path: "EspecialDatesTramitacion>Estado",
										formatter: oController.tipoSegunEstado
									}
								})
							},
							change: $.proxy(oController.handleDateChange, oController, "HabilitacionTableJsonModel"),
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"HabilitacionTableJsonModel>enabled",
							// 		"HabilitacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocaciones/")
							// },
							dateValue: "{HabilitacionTableJsonModel>Datehab}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							displayFormat: "dd-MM-yyyy",
							valueFormat: "dd-MM-yyyy"
						}),
						new sap.m.TimePicker({
							change: [oController.handleDateChange, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"HabilitacionTableJsonModel>enabled",
									"HabilitacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
								],
								formatter: oController.rolStatusEdition("colocaciones/")
							},
							dateValue: "{HabilitacionTableJsonModel>Time}",
							displayFormat: "HH:mm",
							valueFormat: "HH:mm"
						}),

						new sap.m.ComboBox({
							width: "100%",
							// enabled: {
							// 	parts: [
							// 		"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"HabilitacionTableJsonModel>enabled", "HabilitacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocaciones/")
							// },
							change: [oController.handleLegacyValidationDeliveries, oController],

							selectedKey: "{HabilitacionTableJsonModel>Tplnr}",
							items: {
								path: "EstacionesJsonModel>/EstacionesPorRegion",
								template: new sap.ui.core.Item({
									key: "{EstacionesJsonModel>Codigo}",
									text: "{EstacionesJsonModel>Codigo} - {EstacionesJsonModel>Descripcion}"
								})
							},
						}),

						new sap.m.Input({
							// enabled: {
							// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"HabilitacionTableJsonModel>enabled",
							// 		"HabilitacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocaciones/")
							// },
							value: "{HabilitacionTableJsonModel>Coment}",

						}),

						new sap.m.Button({
							text: "Agregar ET",
							// enabled: {
							// 	parts: [
							// 		"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
							// 		"HabilitacionTableJsonModel>enabled", "HabilitacionTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
							// 	],
							// 	formatter: oController.rolStatusEdition("colocaciones/")
							// },
							visible: {
								parts: [{
									path: "HabilitacionTableJsonModel>enabled"
								}],
								formatter: function (bEnabled) {
									return bEnabled;
								}
							},
							press: [oController.sendHabilitacion, oController]
						}).addStyleClass("buttonInverted")
					]
				})
			}
		});
		var oDevolucionTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay devoluciones",
			columns: [
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Hora"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "COT/COTDT"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Jefes de Trabajo"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Técnico de ET"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Comentarios"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				})
			],
			items: {
				path: "DevolutionTableJsonModel>/Devolutions",
				template: new sap.m.ColumnListItem({
					visible: "{DevolutionTableJsonModel>enabled}",
					cells: [
						new sap.m.DatePicker({
							specialDates: {
								templateShareable: false,
								path: "EspecialDatesTramitacion>/Fechas",
								template: new sap.ui.unified.DateTypeRange({
									startDate: "{EspecialDatesTramitacion>Fecha}",
									type: {
										path: "EspecialDatesTramitacion>Estado",
										formatter: oController.tipoSegunEstado
									}
								})
							},
							change: $.proxy(oController.handleDateChange, oController, "DevolutionTableJsonModel"),
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DevolutionTableJsonModel>enabled",
									"DevolutionTableJsonModel>enabledContinua", "DevolutionTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{DevolutionTableJsonModel>Datelicencia}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							displayFormat: "dd-MM-yyyy"
						}),
						new sap.m.TimePicker({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DevolutionTableJsonModel>enabled",
									"DevolutionTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{DevolutionTableJsonModel>Time}",
							displayFormat: "HH:mm"
						}),
						new sap.m.Text({
							text: "{DevolutionTableJsonModel>Personal}"
						}),
						new sap.m.HBox({
							items: [
								new sap.m.ComboBox({
									visible: "{= !${DevolutionTableJsonModel>showPrevValue}}",
									width: "100%",
									enabled: {
										parts: [
											"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"DevolutionTableJsonModel>enabled", "DevolutionTableJsonModel>sameDayValidation"
										],
										formatter: oController.rolStatusEdition("entregas/")
									},
									selectedKey: "{DevolutionTableJsonModel>Tejt}",
									valueState: "{DevolutionTableJsonModel>TejtValueState}",
									valueStateText: "{DevolutionTableJsonModel>TejtValueStateText}",
									change: [oController.handleLegacyValidationDevolutions, oController],
									items: {
										templateShareable: false,
										path: "PersonalHabilitadoModel>/CboJefeDevoluciones",
										template: new sap.ui.core.Item({
											key: "{PersonalHabilitadoModel>Legajo}",
											text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
										})
									}
								}),
								new sap.m.Text({
									visible: "{DevolutionTableJsonModel>showPrevValue}",
									text: "{DevolutionTableJsonModel>TejtPrev/Legajo} - {DevolutionTableJsonModel>TejtPrev/Nombre}"
								}),
							]
						}),
						new sap.m.HBox({
							items: [
								new sap.m.ComboBox({
									visible: "{= !${DevolutionTableJsonModel>showPrevValue}}",
									width: "100%",
									enabled: {
										parts: [
											"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"DevolutionTableJsonModel>enabled", "DevolutionTableJsonModel>sameDayValidation"
										],
										formatter: oController.rolStatusEdition("entregas/")
									},
									// valueState: "{DevolutionTableJsonModel>TejtValueState}",
									// valueStateText: "{DevolutionTableJsonModel>TejtValueStateText}",
									// change: [oController.handleLegacyValidationDevolutions, oController],
									selectedKey: "{DevolutionTableJsonModel>TecET}",
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
								new sap.m.Text({
									visible: "{DevolutionTableJsonModel>showPrevValue}",
									text: "{DevolutionTableJsonModel>TecETPrev/Legajo} - {DevolutionTableJsonModel>TecETPrev/Nombre}"
								}),
							]
						}),
						new sap.m.Input({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DevolutionTableJsonModel>enabled",
									"DevolutionTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							value: "{DevolutionTableJsonModel>Commen}",
							tooltip: "{DevolutionTableJsonModel>Commen}"
						}),
						new sap.m.Button({
							text: "Devolucion",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DevolutionTableJsonModel>enabled",
									"DevolutionTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							visible: {
								parts: [{
									path: "DevolutionTableJsonModel>enabled"
								}],
								formatter: function (bEnabled) {
									return bEnabled;
								}
							},

							press: [oController.sendDevolution, oController]
						}).addStyleClass("buttonInverted")
					]
				})
			}
		});
		var oDeliveryTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay entregas",
			columns: [
				new sap.m.Column({
					width: "25px",
					header: new sap.m.Text({
						text: ""
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Hora"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "COT/COTDT"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Jefes de Trabajo"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Técnico de ET"
					})
				}),
				new sap.m.Column({
					width: "60px",
					header: new sap.m.Text({
						text: "Folio"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Motivo de la NO entrega"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Comentarios"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				})
			],
			items: {
				path: "DeliveryTableJsonModel>/Deliveries",
				template: new sap.m.ColumnListItem({
					visible: "{DeliveryTableJsonModel>enabled}",
					cells: [
						new sap.m.Text({
							text: {
								parts: ["EspecialDatesTramitacion>/Fechas", "DeliveryTableJsonModel>Datelicencia"],
								formatter: oController.estadoEntregaDia
							}
						}).attachBrowserEvent("click", oController.handleDialogStatus),
						new sap.m.DatePicker({
							specialDates: {
								templateShareable: false,
								path: "EspecialDatesTramitacion>/Fechas",
								template: new sap.ui.unified.DateTypeRange({
									startDate: "{EspecialDatesTramitacion>Fecha}",
									type: {
										path: "EspecialDatesTramitacion>Estado",
										formatter: oController.tipoSegunEstado
									}
								})
							},
							change: $.proxy(oController.handleDateChange, oController, "DeliveryTableJsonModel"),
						 enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles"
							 		, "statusModel>/", "LicenseJsonModel>/Werks",
								"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{DeliveryTableJsonModel>Datelicencia}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							displayFormat: "dd-MM-yyyy"
						}),
						new sap.m.TimePicker({
							change: [oController.handleDateChange, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{DeliveryTableJsonModel>Time}",
							displayFormat: "HH:mm"
						}),
						new sap.m.Text({
							text: "{DeliveryTableJsonModel>Cot}"
						}),
						new sap.m.HBox({
							items: [
								new sap.m.ComboBox({
									visible: "{= !${DeliveryTableJsonModel>showPrevValue}}",
									width: "100%",
									enabled: {
										parts: [
											"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"DeliveryTableJsonModel>enabled", "DeliveryTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
										],
										formatter: oController.rolStatusEdition("entregas/")
									},
									change: [oController.handleLegacyValidationDeliveries, oController],
									valueState: "{DeliveryTableJsonModel>TejtValueState}",
									valueStateText: "{DeliveryTableJsonModel>TejtValueStateText}",
									selectedKey: "{DeliveryTableJsonModel>Tejt}",
									items: {
										templateShareable: false,
										path: "PersonalHabilitadoModel>/CboJefeEntregas",
										template: new sap.ui.core.Item({
											key: "{PersonalHabilitadoModel>Legajo}",
											text: "{PersonalHabilitadoModel>Nombre} {PersonalHabilitadoModel>Legajo}"
										})
									}
								}),
								new sap.m.Text({
									visible: "{DeliveryTableJsonModel>showPrevValue}",
									text: "{DeliveryTableJsonModel>TejtPrev/Legajo} - {DeliveryTableJsonModel>TejtPrev/Nombre}"
								}),
							]
						}),
						new sap.m.HBox({
							items: [
								new sap.m.ComboBox({
									visible: "{= !${DeliveryTableJsonModel>showPrevValue}}",
									width: "100%",
									enabled: {
										parts: [
											"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"DeliveryTableJsonModel>enabled", "DeliveryTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
										],
										formatter: oController.rolStatusEdition("entregas/")
									},
									//change: [oController.handleLegacyValidationDeliveries, oController],
									// valueState: "{DeliveryTableJsonModel>TejtValueState}",
									// valueStateText: "{DeliveryTableJsonModel>TejtValueStateText}",
									selectedKey: "{DeliveryTableJsonModel>TecET}",
									items: {
										templateShareable: false,
										path: "PersonalHabilitadoModel>/TecnicosEt",
										template: new sap.ui.core.Item({
											key: "{PersonalHabilitadoModel>Legajo}",
											text: "{PersonalHabilitadoModel>Nombre} {PersonalHabilitadoModel>Legajo}"
										}),
										// filters: new sap.ui.model.Filter([
										// 	new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M04"),
										// 	new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M08"),
										// 	new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M12"),
										// 	new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M16"),
										// 	new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M20"),
										// 	new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M24"),
										// 	new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "M28"),
										// 	new sap.ui.model.Filter("TipoHab", sap.ui.model.FilterOperator.EQ, "PE5")
										// ], false)
									}
								}),
								new sap.m.Text({
									visible: "{DeliveryTableJsonModel>showPrevValue}",
									text: "{DeliveryTableJsonModel>TecETPrev/Legajo} - {DeliveryTableJsonModel>TecETPrev/Nombre}"
								}),
							]
						}),
						new sap.m.Input({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							value: "{DeliveryTableJsonModel>Folio}",
							maxLength: 10
						}),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							selectedKey: "{DeliveryTableJsonModel>Motivono}",
							change: [oController.onMotivoNoEntregaChange, oController],
							items: {
								templateShareable: false,
								path: "HardCodeModel>/Motivono",
								template: new sap.ui.core.Item({
									key: "{HardCodeModel>key}",
									text: "{HardCodeModel>value}"
								})
							}
						}),
						new sap.m.Input({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							value: "{DeliveryTableJsonModel>Commen}",
							tooltip: "{DeliveryTableJsonModel>Commen}"
						}),
						new sap.m.Button({
							text: "Entrega",
							enabled: {
								parts: [
									"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled", "DeliveryTableJsonModel>sameDayValidation", "ValidateFirstContModel>/fd"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							visible: {
								parts: [{
									path: "DeliveryTableJsonModel>enabled"
								}],
								formatter: function (bEnabled) {
									return bEnabled;
								}
							},
							press: [oController.sendDelivery, oController]
						}).addStyleClass("buttonInverted")
					]
				})
			}
		});

		var oCoordinateTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay coordinaciones",
			columns: [
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Coordinó"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Comentarios Coordinacion"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				})
			],
			items: {
				path: "CoordinationTableJsonModel>/Coordinations",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: {
								parts: ["CoordinationTableJsonModel>Cooindex", "CoordinationTableJsonModel>CreationDate",
									"CoordinationTableJsonModel>CreationTime"
								],
								formatter: $.proxy(oController.formatDateTimeCoord, oController)
							}
						}),
						new sap.m.Text({
							text: "{CoordinationTableJsonModel>Coouser}"
						}),
						new sap.m.Input({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"CoordinationTableJsonModel>Cooindex"
								],
								formatter: oController.rolStatusEdition("coordinacion/", oController.validateToSend.bind(oController,
									"CoordinationTableJsonModel"))
							},
							value: "{CoordinationTableJsonModel>Coordination}",
							tooltip: "{CoordinationTableJsonModel>Coordination}"
						}),
						new sap.m.HBox({
							items: [
								new sap.m.Button({
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
										formatter: oController.rolStatusEdition("coordinacion/")
									},
									visible: {
										path: "CoordinationTableJsonModel>Cooindex",
										formatter: $.proxy(oController.validateToSend, oController, "CoordinationTableJsonModel")
									},
									text: "Coordinar",
									press: [oController.sendCoordination, oController]
								}).addStyleClass("buttonInverted")
							]
						})
					]
				})
			}
		});

		var oObservationTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay observaciones",
			columns: [
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Observó"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Motivo"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Comentarios de la observación"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				})
			],
			items: {
				path: "ObservationTableJsonModel>/Observations",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: {
								parts: ["ObservationTableJsonModel>Obsindex", "ObservationTableJsonModel>CreationDate",
									"ObservationTableJsonModel>CreationTime"
								],
								formatter: $.proxy(oController.formatDateTimeCoord, oController)
							}
						}),
						new sap.m.Text({
							text: "{ObservationTableJsonModel>Obsuser}"
						}),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"ObservationTableJsonModel>Obsindex"
								],
								formatter: oController.rolStatusEdition("observacion/", oController.validateToSend.bind(oController,
									"ObservationTableJsonModel"))
							},
							selectedKey: "{ObservationTableJsonModel>Obscause}",
							items: {
								templateShareable: false,
								path: "HardCodeModel>/Obscause",
								template: new sap.ui.core.Item({
									key: "{HardCodeModel>key}",
									text: "{HardCodeModel>value}"
								})
							}
						}).addStyleClass("combo-table"),
						new sap.m.TextArea({
							height: "144px",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"ObservationTableJsonModel>Obsindex"
								],
								formatter: oController.rolStatusEdition("observacion/", oController.validateToSend.bind(oController,
									"ObservationTableJsonModel"))
							},
							value: "{ObservationTableJsonModel>Observation}",
							tooltip: "{ObservationTableJsonModel>Observation}"
						}).addStyleClass("combo-table"),
						new sap.m.HBox({
							items: [
								new sap.m.Button({
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
										formatter: oController.rolStatusEdition("observacion/")
									},
									text: "Observar",
									visible: {
										path: "ObservationTableJsonModel>Obsindex",
										formatter: $.proxy(oController.validateAddObservation, oController)
									},
									press: [oController.sendObservation, oController]
								}).addStyleClass("buttonInverted")
								// new sap.m.Button({
								// 	icon: "sap-icon://delete",
								// 	press: $.proxy(oController.onDeleteFromTable, oController, "ObservationTableJsonModel")
								// }).addStyleClass("buttonInverted")
							]
						})
					]
				})
			}
		});

		var oSuspensionTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay suspensiones",
			columns: [
				new sap.m.Column({
					width: "150px",
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					width: "110px",
					header: new sap.m.Text({
						text: "Hora"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "COT/COTDT"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Técnico de ET"
					})
				}),
				new sap.m.Column({
					width: "200px",
					header: new sap.m.Text({
						text: "Comentarios"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				}),
			],
			items: {
				path: "SuspensionTableJsonModel>/Suspensions",
				template: new sap.m.ColumnListItem({
					visible: "{SuspensionTableJsonModel>enabled}",
					cells: [
						new sap.m.DatePicker({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"SuspensionTableJsonModel>enabled"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{SuspensionTableJsonModel>Datelicencia}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							displayFormat: "dd-MM-yyyy",
						}),
						new sap.m.TimePicker({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"SuspensionTableJsonModel>enabled"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{SuspensionTableJsonModel>Time}",
							/*dateValue: {
								path: "SuspensionTableJsonModel>Time",
								formatter: oController.ifEmptyReturnCurrentTime
							},*/
							displayFormat: "HH:mm"
						}),
						new sap.m.Text({
							text: "{SuspensionTableJsonModel>Cot}"
							// path: "DeliveryTableJsonModel>Cot"
							// formatter: $.proxy(oController.handleUserName, oController)

						}),
						new sap.m.ComboBox({
							width: "100%",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"SuspensionTableJsonModel>enabled"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							selectedKey: "{SuspensionTableJsonModel>Tecnicoet}",
							valueState: "{SuspensionTableJsonModel>TecnicoetValueState}",
							valueStateText: "{SuspensionTableJsonModel>TecnicoetValueStateText}",
							change: [oController.handleLegacyValidationSuspention, oController],
							items: {
								templateShareable: false,
								path: "PersonalHabilitadoModel>/Todos",
								template: new sap.ui.core.Item({
									key: "{PersonalHabilitadoModel>Legajo}",
									text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
								})
							}
						}),
						new sap.m.Input({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"SuspensionTableJsonModel>enabled"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							value: "{SuspensionTableJsonModel>Commen}",
							tooltip: "{SuspensionTableJsonModel>Commen}"
						}),
						new sap.m.HBox({
							items: [
								new sap.m.Button({
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"SuspensionTableJsonModel>enabled"
										],
										formatter: oController.rolStatusEdition("entregas/")
									},
									visible: {
										parts: [{
											path: "SuspensionTableJsonModel>enabled"
										}],
										formatter: function (bEnabled) {
											return bEnabled;
										}
									},
									text: "Suspender",
									press: [oController.sendSuspension, oController]
								}).addStyleClass("buttonInverted")
							]
						})
					]
				})
			}
		});

		var oReanudacionTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay reanudaciones",
			columns: [
				new sap.m.Column({
					width: "150px",
					header: new sap.m.Text({
						text: "Fecha"
					})
				}),
				new sap.m.Column({
					width: "110px",
					header: new sap.m.Text({
						text: "Hora"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "COT/COTDT"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Técnico de ET"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: "Comentarios"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Text({
						text: ""
					})
				})
			],
			items: {
				path: "ReanudationTableJsonModel>/Reanudations",
				template: new sap.m.ColumnListItem({
					visible: "{ReanudationTableJsonModel>enabled}",
					cells: [
						new sap.m.DatePicker({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"ReanudationTableJsonModel>enabled"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{ReanudationTableJsonModel>Datelicencia}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							displayFormat: "dd-MM-yyyy"
						}),
						new sap.m.TimePicker({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"ReanudationTableJsonModel>enabled"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{ReanudationTableJsonModel>Time}",
							/*dateValue: {
								path: "ReanudationTableJsonModel>Time",
								formatter: oController.ifEmptyReturnCurrentTime
							},*/
							displayFormat: "HH:mm"
						}),
						new sap.m.Text({
							text: "{ReanudationTableJsonModel>Cot}"
							// formatter: $.proxy(oController.handleUserName, oController)

						}),
						new sap.m.ComboBox({
							width: "100%",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"ReanudationTableJsonModel>enabled"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							selectedKey: "{ReanudationTableJsonModel>Tecnicoet}",
							valueState: "{ReanudationTableJsonModel>TecnicoetValueState}",
							change: [oController.handleLegacyValidationReanudation, oController],
							valueStateText: "{ReanudationTableJsonModel>TecnicoetValueStateText}",
							items: {
								templateShareable: false,
								path: "PersonalHabilitadoModel>/Todos",
								template: new sap.ui.core.Item({
									key: "{PersonalHabilitadoModel>Legajo}",
									text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
								})
							}
						}),
						new sap.m.Input({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"ReanudationTableJsonModel>enabled"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							value: "{ReanudationTableJsonModel>Comentarios}",
							tooltip: "{ReanudationTableJsonModel>Comentarios}"
						}),
						new sap.m.HBox({
							items: [
								new sap.m.Button({
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"ReanudationTableJsonModel>enabled"
										],
										formatter: oController.rolStatusEdition("entregas/")
									},
									visible: {
										parts: [{
											path: "ReanudationTableJsonModel>enabled"
										}],
										formatter: function (bEnabled) {
											return bEnabled;
										}
									},
									text: "Reanudar",
									press: [oController.sendReanudation, oController]
								}).addStyleClass("buttonInverted")
							]
						})
					]
				})
			}
		});

		var mainPage = new sap.m.Page({
			footer: new sap.m.Bar({
				contentLeft: [
					new sap.m.Button({
						icon: "sap-icon://pdf-attachment",
						text: "Exportar Licencia",
						press: [oController.exportLicense, oController],
					}).addStyleClass("buttonInverted"),
				],
				contentRight: [
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"PermisosJsonModel>/UsuarioEncontrado", "LicenseJsonModel>/Substatus", "LicenseJsonModel>/Licstat"
							],
							//	formatter: oController.rolStatusEdition("botones/botonCancelacionDefinitiva", oController.validateSubstatus)
							formatter: oController.rolStatusEdition("botones/botonCancelacionDefinitiva", oController.validateSubstatus.bind())
						},
						text: "Cancelación Definitiva",
						tooltip: "Cancelación Definitiva",
						press: [oController.dialogCancelacionDefinitiva, oController]
					}).addStyleClass("buttonInverted"),
					//la anulacion puede ser realizada por cualquiera y en cualquier estado.
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"FilterSelectionJsonModel>/annulateCreatedStatus"
							],
							formatter: oController.rolStatusEdition("botones/AnnulateButton")
						},
						text: "Anular",
						tooltip: "Anular",
						press: [oController.dialogAnnulateLicense, oController]
					}).addStyleClass("buttonInverted"),
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
							],
							formatter: oController.rolStatusEdition("botones/ButtonEditLicense")
						},
						icon: "sap-icon://create",
						iconFirst: true,
						text: "{FilterSelectionJsonModel>/textFlow}",
						tooltip: "{FilterSelectionJsonModel>/textFlow}",
						press: $.proxy(oController.handleSolLic, oController, "Licencia")
					}).addStyleClass("buttonInverted"),
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"DisableControlsJsonModel>/visibleLic",
								"PermisosJsonModel>/UsuarioEncontrado", "EnviarCoordModel>/visibleEnviarCoord",
							],
							formatter: oController.rolStatusEdition("botones/ButtonEditLicenseSolicitante")
						},
						icon: "sap-icon://create",
						iconFirst: true,
						text: {
							parts: ["UserJsonModel>/roles"],
							formatter: function (aRoles) {
								if (aRoles.includes("ope_solic-lic_transener") || aRoles.includes("Solicitante_Lic_S") || aRoles.includes(
									"ope_solic-lic_transba")) {
									return "Generar Licencia";
								}
								return "Enviar a Coordinación";
							}
						},
						tooltip: {
							parts: ["UserJsonModel>/roles"],
							formatter: function (aRoles) {
								if (aRoles.includes("ope_solic-lic_transener") || aRoles.includes("Solicitante_Lic_S") || aRoles.includes(
									"ope_solic-lic_transba")) {
									return "Generar Licencia";
								}
								return "Enviar a Coordinación";
							}
						},
						press: [oController.sendToCoordination, oController]
					}).addStyleClass("buttonInverted")
				]
			}),
			customHeader: [
				new sap.m.Bar({
					contentLeft: [
						new sap.m.Button({
							icon: "sap-icon://nav-back",
							press: [oController.goToHome, oController]
						}),
						new sap.m.Text({
							visible: "{FilterSelectionJsonModel>/visible}",
							text: {
								parts: ["LicenseJsonModel>/Tipo",
									"LicenseJsonModel>/Id",
									"LicenseJsonModel>/Idlicencia"
								],
								formatter: function (sTipoDoc, Id, sIdLicencia) {
									return (sTipoDoc === "S") ? "Solicitud Nº: " + Id : "Licencia Nº: " + Id;
								}
							}
						}),
						new sap.m.Text({
							visible: "{FilterSelectionJsonModel>/visible}",
							text: {
								parts: ["LicenseJsonModel>/Tipo",
									"LicenseJsonModel>/Id",
									"LicenseJsonModel>/Idlicencia",
									"LicenseJsonModel>/Licstat",
									"LicenseJsonModel>/Substatus",
								],
								formatter: $.proxy(oController.formatStatus, oController)
							}
						}).addStyleClass("sapUiSmallMarginBegin")
					],
					contentMiddle: [
						new sap.m.Text({
							visible: "{FilterSelectionJsonModel>/visible}",
							text: "Equipo solicitado CAMMESA: " + "{LicenseJsonModel>/Equnr}"
						})
					],
					contentRight: [
						new sap.m.Text({
							visible: "{FilterSelectionJsonModel>/visible}",
							text: {
								path: "LicenseJsonModel>/Equstat",
								formatter: function (sEqustat) {
									var sEqustatFormatted = sEqustat === "X" ? "En Servicio" : "Fuera de Servicio";
									return "Estado Equipo CAMMESA: " + sEqustatFormatted
								}
							}
						}).addStyleClass("sapUiLargeMarginEnd"),
						new sap.m.Text({
							visible: "{FilterSelectionJsonModel>/visible}",
							text: "E.T: " + "{DescripcionETJsonModel>/Descripcion}"
						}).addStyleClass("sapUiTinyMarginEnd")
					]
				}).addStyleClass("barTransener")
			],
		content: [
				// new sap.m.HBox({
				// 	visible: {
				// 		parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "DisableControlsJsonModel>/visibleSol"],
				// 		formatter: oController.rolStatusEdition("botones/ButtonAddReportSemanalCammesa")
				// 	},
				// 	items: [
				// 		new sap.m.CheckBox({
				// 			text: "Incluir en reporte semanal Cammesa",
				// 			tooltip: "Incluir en reporte semanal Cammesa",
				// 			selected: "{LicenseJsonModel>/HabilitadoGestion}",
				// 			select: [oController.includeCammesa, oController]
				// 		}),
				// 		new sap.m.Label({
				// 			text: {
				// 				path: "LicenseJsonModel>/HabilitadoGestionFechaModificacion",
				// 				formatter: oController.formatDateWithoutGMT
				// 			}
				// 		}).addStyleClass("margin15")
				// 	]
				// }),
				new sap.ui.layout.form.SimpleForm({
					layout: "ResponsiveGridLayout",
					editable: true,
					content: [
						// new sap.m.Label({
						// 	visible: "{DisableControlsJsonModel>/weekChanger}",
						// 	design: sap.m.LabelDesign.Bold,
						// 	text: "Semana",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L2 M12 S12",
						// 	})
						// }).addStyleClass("LicenciaText"),
						// new sap.m.ComboBox({//sap.m.isComboBox({
						// 	visible: "{DisableControlsJsonModel>/weekChanger}",
						// 	//change: [oController.onWorkStationChange, oController],
						// 	enabled: {
						// 		parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
						// 			"PermisosJsonModel>/UsuarioEncontrado"
						// 		],
						// 		formatter: oController.rolStatusEdition("header/")
						// 	},
						// 	//enabled: "{FilterSelectionJsonModel>/visible}",
						// 	selectedKey: "{LicenseJsonModel>/Semana}",
						// 	items: {
						// 		//filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
						// 		path: "WorkPlacesJsonModel>/FilteredWorkPlaces",
						// 		template: new sap.ui.core.Item({
						// 			key: "{WorkPlacesJsonModel>Arbpl}",
						// 			text: "{WorkPlacesJsonModel>Ktext}"
						// 		})
						// 	},
						// 	//enabled: false,
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L2 M12 S12"
						// 	})
						// }).addStyleClass("licenseInputBorder"),

						new sap.m.Label({
							/*	visible: {
									parts: ["LicenseJsonModel>/Licstat", "LicenseJsonModel>/Tipo", "LicenseJsonModel>/Id"],
									formatter: function (sLicStat, sTipo, Id) {
										if (sLicStat === "30" && sTipo === "S" && Id) {
											return true;
										} else {
											return sLicStat !== "30";
										}
									}
								},*/
							design: sap.m.LabelDesign.Bold,
							text: "Fecha y Hora de Generación",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M2 S12"
							})
						}).addStyleClass("LicenciaText"),
						//
						new sap.m.Input({
							enabled: false,
							/*	visible: {
									parts: ["LicenseJsonModel>/Licstat", "LicenseJsonModel>/Tipo", "LicenseJsonModel>/Id"],
									formatter: function (sLicStat, sTipo, Id) {
										if (sLicStat === "30" && sTipo === "S" && Id) {
											return true;
										} else {
											return sLicStat !== "30";
										}
									}
								},*/
							value: {
								path: "LicenseJsonModel>/Gdate",
								formatter: $.proxy(oController.formatDateWithoutGMT, oController)
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							/*visible: {
								parts: ["LicenseJsonModel>/Id", "LicenseJsonModel>/Idsolicitud"],
								formatter: function (sId, sIdSolic) {
									if (!sId && !sIdSolic) {
										return false
									}
									return sId !== "" && sIdSolic !== ""
								}
							},*/
							customData: {
								Type: "sap.ui.core.CustomData",
								key: "hiddenLabelSolNumber",
								value: {
									parts: ["LicenseJsonModel>/Id", "LicenseJsonModel>/Idsolicitud"],
									formatter: function (sId, sIdSolic) {
										if (!sId && !sIdSolic) {
											return "oculto"
										}
										return sId !== "" && sIdSolic !== "" ? "visibleSol" : "oculto"
									}
								},
								writeToDom: true
							},
							design: sap.m.LabelDesign.Bold,
							text: "Solicitud N°",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M2 S12"
							})
						}).addStyleClass("LicenciaText solicitudNLabel"),
						new sap.m.Link({
							press: [oController.navToSol, oController],
							text: "{LicenseJsonModel>/Idsolicitud}",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M2 S12"
							})
						}),
						new sap.m.Label({
							visible: {
								parts: ["LicenseJsonModel>/Id"],
								formatter: function (sId) {
									return sId ? sId !== "" : false
								}
							},
							design: sap.m.LabelDesign.Bold,
							text: "Creada por",
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M2 S12",
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.Text({
							visible: {
								parts: ["LicenseJsonModel>/Id"],
								formatter: function (sId, sIdSolic) {
									return sId ? sId !== "" : false
								}
							},
							text: {
								parts: ["LicenseJsonModel>/Creador"],
								formatter: (c) => {
									return c
								}
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M2 S12"
							})
						}),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Región",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							selectedKey: "{LicenseJsonModel>/Werks}",
							items: {
								path: "RegionesJsonModel>/Regiones",
								template: new sap.ui.core.Item({
									key: "{RegionesJsonModel>Werks}",
									text: "{RegionesJsonModel>Name1}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
							selectionChange: [oController.searchOrden, oController]
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Puesto de trabajo",
							layoutData: new sap.ui.layout.GridData({
								span: "L5 M12 S12",
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							width: "100%",
							selectedKey: "{LicenseJsonModel>/Arbpl}",
							valueState: "{LicenseJsonModel>/ArbplState}",
							valueStateText: "{LicenseJsonModel>/ArbplStateMessage}",
							items: {
								path: "PuestoTrabajoJsonModel>/PuestosTrabajo",
								template: new sap.ui.core.Item({
									key: "{PuestoTrabajoJsonModel>Arbpl}",
									text: "{PuestoTrabajoJsonModel>Ktext}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "E.T",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({
							change: $.proxy(oController.changeUbicacion, oController, "Licencia"),
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							selectedKey: "{LicenseJsonModel>/Tplnr}",
							items: {
								path: "EstacionesJsonModel>/EstacionesPorRegion",
								template: new sap.ui.core.Item({
									key: "{EstacionesJsonModel>Codigo}",
									text: "{EstacionesJsonModel>Codigo} - {EstacionesJsonModel>Descripcion}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Solicitante",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								indent: "L1"
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({
							width: "100%",
							change: $.proxy(oController.handleLegacyValidation, oController, "Solicitante"),
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							selectedKey: "{LicenseJsonModel>/Solicitante}",
							valueState: "{LegacyValidationJsonModel>/SolicitanteValueState}",
							valueStateText: "{LegacyValidationJsonModel>/SolicitanteValueStateText}",
							tooltip: {
								parts: ["LicenseJsonModel>/Solicitante", "i18n>PersonalHabilitadoModel_Solicitante", "i18n>Legajo", "i18n>Nombre"],
								formatter: $.proxy(oController.formatComboTooltip, oController)
							},
							items: {
								path: "PersonalHabilitadoModel>/Solicitante",
								template: new sap.ui.core.Item({
									key: "{PersonalHabilitadoModel>Legajo}",
									text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							})
						}),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Equipo Solicitado Cammesa",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({
							selectedKey: "{LicenseJsonModel>/Equnr}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							tooltip: {
								parts: ["LicenseJsonModel>/Equnr", "i18n>EquiposJsonModel_Equipos", "i18n>CodigoEquipo", "i18n>DescEquipo"],
								formatter: $.proxy(oController.formatComboTooltip, oController)
							},
							items: {
								path: "EquiposJsonModel>/Equipos",
								template: new sap.ui.core.Item({
									key: "{EquiposJsonModel>CodigoEquipo}",
									text: "{EquiposJsonModel>CodigoEquipo} - {EquiposJsonModel>DescEquipo}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							selectionChange: oController.equipoSelected
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Estado Equipo CAMMESA",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								indent: "L1"
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.Select({
							change: [oController.onCammesaStateChange, oController],
							selectedKey: "{LicenseJsonModel>/Equstat}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							items: {
								path: "HardCodeModel>/EqustatCammesa",
								template: new sap.ui.core.Item({
									key: "{HardCodeModel>key}",
									text: "{HardCodeModel>value}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Equipo/s a Intervenir",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.TextArea({
							height: "45px",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							maxLength: 100,
							value: "{LicenseJsonModel>/Equiinterv}",
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Estado Equipo/s a intervenir",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								indent: "L1"
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.Select({
							selectedKey: "{LicenseJsonModel>/Equstatnocam}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "PermisosJsonModel>/UsuarioEncontrado",
									"DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							items: {
								path: "HardCodeModel>/Equstatnocam",
								template: new sap.ui.core.Item({
									key: "{HardCodeModel>key}",
									text: "{HardCodeModel>value}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							visible: "{EnviarCoordModel>/visibleTipoLicencia}",
							textAlign: sap.ui.core.TextAlign.Left,
							design: sap.m.LabelDesign.Bold,
							text: "Tipo de licencia",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({ //sap.m.Select({
							change: [oController.onChangeTipoLic, oController],
							visible: "{EnviarCoordModel>/visibleTipoLicencia}",
							selectedKey: "{LicenseJsonModel>/Tipolicencia}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "EnviarCoordModel>/visibleTipoLicencia",
									"DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							items: {
								path: "TipoLicenciaCatalogModel>/TipoLic",
								template: new sap.ui.core.Item({
									key: "{TipoLicenciaCatalogModel>key}",
									text: "{TipoLicenciaCatalogModel>descripcion}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
						}).addStyleClass("licenseInputBorder"),
						new sap.ui.core.HTML({
							layoutData: new sap.ui.layout.GridData({
								span: "L12 M12 S12"
							}),
							content: "<hr/>"
						}),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Descripción del trabajo a realizar",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.TextArea({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/")
							},
							value: "{LicenseJsonModel>/Descripcion}",
							height: "120px",
							layoutData: new sap.ui.layout.GridData({
								span: "L10 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Comentarios del solicitante / Descripción de las Condiciones Especiales",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.TextArea({
							required: "{= ${LicenseJsonModel>/Jobcond} === '06' }",
							height: "120px",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/")
							},
							value: "{LicenseJsonModel>/Solictext}",
							layoutData: new sap.ui.layout.GridData({
								span: "L10 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							textAlign: sap.ui.core.TextAlign.Left,
							design: sap.m.LabelDesign.Bold,
							text: "Inicio",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.DatePicker({
							enabled: {
								parts: [
									"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							dateValue: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							change: [oController.onWorkDateChanged, oController],
							displayFormat: "dd-MM-yyyy",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.TimePicker({
							id: this.createId("InputTimbeg"),
							displayFormat: "HH:mm",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									/*"DisableControlsJsonModel>/enabled", */
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							dateValue: "{LicenseJsonModel>/Timbeg}",
							valueState: "{LicenseJsonModel>/TimbegState}",
							valueStateText: "{LicenseJsonModel>/TimbegStateMessage}",
							editable: "{/isDateEditable}",
							change: [oController.onWorkDateChanged, oController],
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.RadioButtonGroup({
							selectedIndex: 0,
							select: [oController.handlePeriod, oController],
							enabled: {
								parts: [
									"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "PermisosJsonModel>/UsuarioEncontrado",
									"DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							columns: 2,
							buttons: [
								new sap.m.RadioButton({
									text: "Diaria",
									selected: {
										path: "LicenseJsonModel>/Period",
										formatter: function (sPeriod) {
											if (sPeriod) {
												return (sPeriod === "D");
											}
										}
									}
								}),
								new sap.m.RadioButton({
									text: "Continua",
									selected: {
										path: "LicenseJsonModel>/Period",
										formatter: function (sPeriod) {
											if (sPeriod) {
												return (sPeriod === "C");
											}
										}
									}
								})
							],
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Tiempo de reposición",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({
							selectedKey: "{LicenseJsonModel>/Tiemporep}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							items: {
								path: "RepositionTimes>/RepositionTimes",
								template: new sap.ui.core.Item({
									key: "{RepositionTimes>Valkey}",
									text: "{RepositionTimes>Valtext}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Fin",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.DatePicker({
							enabled: {
								parts: [
									"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							dateValue: "{LicenseJsonModel>/Solend}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							editable: "{/isDateEditable}",
							change: [oController.onWorkDateChanged, oController],
							displayFormat: "dd-MM-yyyy",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.TimePicker({
							id: this.createId("InputTimend"),
							displayFormat: "HH:mm",
							enabled: {
								parts: [
									"LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							dateValue: "{LicenseJsonModel>/Timend}",
							valueState: "{LicenseJsonModelde>/TimendState}",
							valueStateText: "{LicenseJsonModel>/TimendStateMessage}",
							editable: "{/isDateEditable}",
							change: [oController.onWorkDateChanged, oController],
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Button({
							enabled: "{DisableControlsJsonModel>/HorariosSemanaEnabled}",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
							text: "Horarios Semana",
							press: [oController.onDailyDialogOpen, oController]
						}).addStyleClass("buttonInverted"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Condiciones de trabajo",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
							//	width: "100%",
							//	height: "45px",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},

							selectedKey: {
								path: 'LicenseJsonModel>/Jobcond'
							},
							valueState: "{LicenseJsonModel>/JobcondState}",
							valueStateText: "{LicenseJsonModel>/JobcondStateMessage}",
							selectionChange: $.proxy(oController.onSelectionChangeCond, oController),
							items: {
								path: "JobConditions>/JobConditions",
								template: new sap.ui.core.Item({
									key: "{JobConditions>Valkey}",
									text: "{JobConditions>Valtext}"
								})
							},
							// items: {
							// 	path: "SelectModel>/FixedValuesSet",
							// 	filters: [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_LICENCIAS"),
							// 		new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "JOBCOND")
							// 	],
							// 	template: new sap.ui.core.Item({
							// 		key: "{SelectModel>Valkey}",
							// 		text: "{SelectModel>Valtext}"
							// 	})
							// },
							/*
							items: [
								new sap.ui.core.Item({
									key: "01",
									text: "Consignación"
								}),
								new sap.ui.core.Item({
									key: "04",
									text: "Trabajo con Tensión (TcT)"
								}),
								new sap.ui.core.Item({
									key: "05",
									text: "Trabajo Especiales (TcT)"
								}),
								new sap.ui.core.Item({
									key: "06",
									text: "Condiciones Especiales"
								})
							]
							*/
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Tipo de intervencion",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true,
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/")
							},
							selectedKey: "{LicenseJsonModel>/Tipinterv}",
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: {
								// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
								path: "TiposIntervencion>/TiposIntervencion",
								template: new sap.ui.core.Item({
									key: "{TiposIntervencion>Clave}",
									text: "{TiposIntervencion>Descripcion}"
								})
							}
						}).addStyleClass("licenseInputBorder"),
						// new sap.m.Label({
						// 	design: sap.m.LabelDesign.Bold,
						// 	text: "Periodo del Estacional / Estacional Pendiente",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L4 M12 S12",
						// 	})
						// }).addStyleClass("LicenciaText"),
						// new sap.m.Input({
						// 	maxLength: 255,
						// 	enabled: {
						// 		parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
						// 			"PermisosJsonModel>/UsuarioEncontrado"
						// 		],
						// 		formatter: oController.rolStatusEdition("general/")
						// 	},
						// 	value: "{LicenseJsonModel>/Perestac}",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L2 M12 S12"
						// 	})
						// }).addStyleClass("licenseInputBorder"),

						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Estacional",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/")
							},
							selectedKey: "{LicenseJsonModel>/Estacional}",

							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: {
								path: "EstacionalListSet>/EstacionalListSet",
								template: new sap.ui.core.Item({
									key: "{EstacionalListSet>Codigo}",
									text: "{EstacionalListSet>Descripcion}"
								})
							},
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "CAPEX",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/")
							},
							selectedKey: "{LicenseJsonModel>/Capex}",
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: [
								new sap.ui.core.Item({
									key: "X",
									text: "SI"
								}),
								new sap.ui.core.Item({
									key: "Y",
									text: "NO"
								})
							],
						}).addStyleClass("licenseInputBorder"),
						// new sap.m.Label({
						// 	design: sap.m.LabelDesign.Bold,
						// 	text: "Comentarios del solicitante",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L2 M12 S12",
						// 		linebreak: true
						// 	})
						// }).addStyleClass("LicenciaText"),
						// new sap.m.TextArea({
						// 	height: "120px",
						// 	enabled: {
						// 		parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
						// 			"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
						// 		],
						// 		formatter: oController.rolStatusEdition("general/")
						// 	},
						// 	value: "{LicenseJsonModel>/Solictext}",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L10 M12 S12"
						// 	})
						// }).addStyleClass("licenseInputBorder"),
						new sap.ui.core.HTML({
							layoutData: new sap.ui.layout.GridData({
								span: "L12 M12 S12"
							}),
							content: "<hr/>"
						}),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Requiere calle de 500kV abierta",
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({
							width: "100%",
							selectedKey: "{LicenseJsonModel>/R500kv}",
							items: {
								path: "HardCodeModel>/R500KV",
								template: new sap.ui.core.Item({
									key: "{HardCodeModel>key}",
									text: "{HardCodeModel>value}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/")
							}
						}).addStyleClass("licenseInputBorder"),
						//TODO NUEVO FINO
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Requiere alguna Barra F/S",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/")
							},
							width: "100%",
							change: [oController.enableEspecifyBarra, oController],
							selectedKey: "{LicenseJsonModel>/Barrafs}",
							items: [
								new sap.ui.core.Item({
									text: "",
									key: ""
								}),
								new sap.ui.core.Item({
									text: "SI",
									key: "X"
								}),
								new sap.ui.core.Item({
									text: "NO",
									key: "N"
								})
							],
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Riesgo de disparo",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
							//forceSelection: false,
							selectedKey: "{LicenseJsonModel>/Rdisparo}",
							items: [
								new sap.ui.core.Item({
									key: "X",
									text: "SI"
								}),
								new sap.ui.core.Item({
									key: "Y",
									text: "NO"
								})
							]
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "LAT F/S con Tensión de Retorno",
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							}),
						}).addStyleClass("center LicenciaText sapUiTinyMarginTop sapUiTinyMarginEnd"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/")
							},
							width: "100%",
							//change: [oController.enableEspecifyBarra, oController],
							selectedKey: "{LicenseJsonModel>/Fstensionret}",
							items: [
								new sap.ui.core.Item({
									text: "SI",
									key: "X"
								}),
								new sap.ui.core.Item({
									text: "NO",
									key: "Y"
								}),
								new sap.ui.core.Item({
									text: "NO CORRESPONDE",
									key: "C"
								})
							],
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Bloqueo de recierres",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/")
							},
							selectedKey: "{LicenseJsonModel>/Bloqueo}",
							items: [
								new sap.ui.core.Item({
									text: "SI",
									key: "X"
								}),
								new sap.ui.core.Item({
									text: "NO",
									key: "N"
								})
							],
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),
						new sap.m.Label({
							visible: "{FilterSelectionJsonModel>/enabledEspecifyBarra}",
							design: sap.m.LabelDesign.Bold,
							text: "Especificar Barra",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("LicenciaText"),
						new sap.m.Input({
							visible: "{FilterSelectionJsonModel>/enabledEspecifyBarra}",
							maxLength: 255,
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"LicenseJsonModel>/Barrafs", "PermisosJsonModel>/UsuarioEncontrado", "FilterSelectionJsonModel>/enabledEspecifyBarra",
									"DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("general/", oController.enableEspecificarBarra)
							},
							value: "{LicenseJsonModel>/Barrafstx}",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("licenseInputBorder"),

						// new sap.m.Label({
						// 	design: sap.m.LabelDesign.Bold,
						// 	text: "OT",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L2 M12 S12"
						// 	})
						// }).addStyleClass("LicenciaText"),
						// new sap.m.ComboBox({
						// 	busy: "{OrdenesJsonModel>/Busy}",
						// 	enabled: {
						// 		parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
						// 			"PermisosJsonModel>/UsuarioEncontrado", "LicenseJsonModel>/Werks"
						// 		],
						// 		formatter: oController.rolStatusEdition("general/")
						// 	},
						// 	selectionChange: [oController.OTSelected, oController],
						// 	selectedKey: "{LicenseJsonModel>/Aufnr}",
						// 	width: "100%",
						// 	items: {
						// 		path: "OrdenesJsonModel>/Ordenes",
						// 		template: new sap.ui.core.Item({
						// 			key: "{OrdenesJsonModel>Orden}",
						// 			text: "{OrdenesJsonModel>Orden} - {OrdenesJsonModel>Descripcion}"
						// 		})
						// 	}
						// }).addStyleClass("licenseInputBorder"),
						new sap.m.VBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12",
								linebreak: true
							}),
							items: [
								new sap.m.Label({
									design: sap.m.LabelDesign.Bold,
									text: "Jefe de trabajo"
								}).addStyleClass("center LicenciaText"),
								new sap.m.ComboBox({ //sap.m.isComboBox({
									change: $.proxy(oController.handleLegacyValidation, oController, "JefeTrabajo"),
									valueState: "{LegacyValidationJsonModel>/JefeTrabajoValueState}",
									valueStateText: "{LegacyValidationJsonModel>/JefeTrabajoValueStateText}",
									id: "JefeTrabajoCombo",
									width: "100%",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
										],
										formatter: oController.rolStatusEdition("general/")
									},
									selectedKey: "{LicenseJsonModel>/Jefe}",
									tooltip: {
										parts: ["LicenseJsonModel>/Jefe", "i18n>PersonalHabilitadoModel_JefeDeTrabajo", "i18n>Legajo", "i18n>Nombre"],
										formatter: $.proxy(oController.formatComboTooltip, oController)
									},
									// items: {
									// 	// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
									// 	path: "PersonalHabilitadoModel>/JefeDeTrabajo",
									// 	template: new sap.ui.core.Item({
									// 		key: "{PersonalHabilitadoModel>Legajo}",
									// 		text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
									// 	})
									// },
								})
							]
						}).addStyleClass("sapUiTinyMarginBottom"),
						new sap.m.VBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: [
								new sap.m.Label({
									design: sap.m.LabelDesign.Bold,
									text: "Jefe de trabajo suplente",
								}).addStyleClass("center LicenciaText"),
								new sap.m.ComboBox({ //sap.m.isComboBox({
									change: $.proxy(oController.handleLegacyValidation, oController, "JefeTrabajoSuplente"),
									valueState: "{LegacyValidationJsonModel>/JefeTrabajoSuplenteValueState}",
									valueStateText: "{LegacyValidationJsonModel>/JefeTrabajoSuplenteValueStateText}",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
										],
										formatter: oController.rolStatusEdition("general/")
									},
									width: "100%",
									selectedKey: "{LicenseJsonModel>/JefeSuplente}",
									id: "JefeTrabajoSupComb",
									tooltip: {
										parts: ["LicenseJsonModel>/JefeSuplente", "i18n>PersonalHabilitadoModel_JefeDeTrabajo", "i18n>Legajo",
											"i18n>Nombre"
										],
										formatter: $.proxy(oController.formatComboTooltip, oController)
									},
									// items: {
									// 	// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
									// 	path: "PersonalHabilitadoModel>/JefeDeTrabajo",
									// 	template: new sap.ui.core.Item({
									// 		key: "{PersonalHabilitadoModel>Legajo}",
									// 		text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
									// 	})
									// },
								})
							]
						}),
						new sap.m.VBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: [
								new sap.m.Label({
									design: sap.m.LabelDesign.Bold,
									text: "Solicitante suplente",
								}).addStyleClass("center LicenciaText"),
								new sap.m.ComboBox({ //sap.m.isComboBox({
									change: $.proxy(oController.handleLegacyValidation, oController, "SolicitanteSuplente"),
									valueState: "{LegacyValidationJsonModel>/SolicitanteSuplenteValueState}",
									valueStateText: "{LegacyValidationJsonModel>/SolicitanteSuplenteValueStateText}",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
										],
										formatter: oController.rolStatusEdition("general/")
									},
									width: "100%",
									selectedKey: "{LicenseJsonModel>/SolSuplente}",
									tooltip: {
										parts: ["LicenseJsonModel>/SolSuplente", "i18n>PersonalHabilitadoModel_Solicitante", "i18n>Legajo", "i18n>Nombre"],
										formatter: $.proxy(oController.formatComboTooltip, oController)
									},
									items: {
										// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
										path: "PersonalHabilitadoModel>/Solicitante",
										template: new sap.ui.core.Item({
											key: "{PersonalHabilitadoModel>Legajo}",
											text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
										})
									},
								}),
							]
						}),
						new sap.m.VBox({
							layoutData: new sap.ui.layout.GridData({
								linebreak: true,
								span: "L4 M12 S12"
							}),
							items: [
								new sap.m.Label({
									design: sap.m.LabelDesign.Bold,
									text: "Solicitante suplente auxiliar",
								}).addStyleClass("center LicenciaText"),
								new sap.m.ComboBox({ //sap.m.isComboBox({
									change: $.proxy(oController.handleLegacyValidation, oController, "SolicitanteSuplenteAuxiliar"),
									valueState: "{LegacyValidationJsonModel>/SolicitanteSuplenteAuxValueState}",
									valueStateText: "{LegacyValidationJsonModel>/SolicitanteSuplenteAuxValueStateText}",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
										],
										formatter: oController.rolStatusEdition("general/")
									},
									width: "100%",
									selectedKey: "{LicenseJsonModel>/SolSuplenteAux}",
									tooltip: {
										parts: ["LicenseJsonModel>/SolSuplenteAux", "i18n>PersonalHabilitadoModel_Solicitante", "i18n>Legajo",
											"i18n>Nombre"
										],
										formatter: $.proxy(oController.formatComboTooltip, oController)
									},
									items: {
										// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
										path: "PersonalHabilitadoModel>/Solicitante",
										template: new sap.ui.core.Item({
											key: "{PersonalHabilitadoModel>Legajo}",
											text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
										})
									},
								})
							]
						}),
						new sap.m.VBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: [
								new sap.m.Label({
									width: "100%",
									design: sap.m.LabelDesign.Bold,
									text: "",
								}).addStyleClass("center LicenciaText"),
								new sap.m.Label({
									width: "100%",
									design: sap.m.LabelDesign.Bold,
									text: "",
								}).addStyleClass("center LicenciaText")
							]
						}),
						new sap.m.VBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: [
								new sap.m.Label({
									design: sap.m.LabelDesign.Bold,
									text: "OT"
								}).addStyleClass("center LicenciaText"),
								new sap.m.ComboBox({ //sap.m.isComboBox({
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado", "LicenseJsonModel>/Werks",
											"DisableControlsJsonModel>/enabledForProgrammer"
										],
										formatter: oController.rolStatusEdition("general/")
									},
									selectionChange: [oController.OTSelected, oController],
									selectedKey: "{LicenseJsonModel>/Aufnr}",
									tooltip: {
										parts: ["LicenseJsonModel>/Aufnr", "i18n>OrdenesJsonModel_Ordenes", "i18n>Orden", "i18n>Descripcion"],
										formatter: $.proxy(oController.formatComboTooltip, oController)
									},
									width: "100%",
									items: {
										path: "OrdenesJsonModel>/Ordenes",
										template: new sap.ui.core.Item({
											key: "{OrdenesJsonModel>Orden}",
											text: "{OrdenesJsonModel>Orden} - {OrdenesJsonModel>Descripcion}"
										})
									}
								})
							]
						}),
						//FIN NUEVO FINO
						new sap.m.IconTabBar({
							headerMode: sap.m.IconTabHeaderMode.InLine,
							layoutData: new sap.ui.layout.GridData({
								span: "L12 M12 S12"
							}),
							items: [
								new sap.m.IconTabFilter({
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://shield",
									text: "Medidas de seguridad",
									content: [
										new sap.m.HBox({
											width: "100%",
											items: [

												new sap.m.HBox({
													width: "88%",
													items: [
														new sap.m.Text({
															width: "100%",
															text: "Medidas de seguridad / Codigo de Equipo",
														}),
													]
												}),

												new sap.m.HBox({
													width: "10%",
													items: [
														new sap.m.Button({
															iconFirst: true,
															text: "Esquema Unifilar",
															press: [oController.openUnifilarSchemaList, oController]
														}).addStyleClass("buttonInverted"),
													]
												})

											]
										}),
										new sap.m.HBox({
											width: "100%",
											items: [
												new sap.m.HBox({
													width: "18%",
													items: [
														new sap.m.Text({
															text: "Interruptores Abiertos y en Local / Extraidos"
														}).addStyleClass("LicenciaText"),
													]
												}).addStyleClass("sapUiTinyMarginEnd"),
												new sap.m.HBox({
													width: "85%",
													items: [
														new sap.m.TextArea({
															width: "100%",
															enabled: false,
															rows: 4,
															cols: 190,
															maxLength: 500,
															value: "{LicenseJsonModel>/Interabier}",
														}).addStyleClass("licenseInputBorder"),
													]
												})
											]
										}),
										new sap.m.HBox({
											width: "100%",
											items: [
												new sap.m.HBox({
													width: "18%",
													items: [
														new sap.m.Text({
															text: "Seccionadores Abiertos, Bloqueados y Trabados"
														}).addStyleClass("LicenciaText"),
													]
												}).addStyleClass("sapUiTinyMarginEnd"),
												new sap.m.HBox({
													width: "85%",
													items: [
														new sap.m.TextArea({
															width: "100%",
															enabled: false,
															rows: 4,
															cols: 190,
															maxLength: 500,
															value: "{LicenseJsonModel>/Seleccionad}",
														}).addStyleClass("licenseInputBorder"),
													]
												})
											]
										}),
										new sap.m.HBox({
											width: "100%",
											items: [
												new sap.m.HBox({
													width: "18%",
													items: [
														new sap.m.Text({
															text: "Seccionadores de PaT Cerrados"
														}).addStyleClass("LicenciaText"),
													]
												}).addStyleClass("sapUiTinyMarginEnd"),
												new sap.m.HBox({
													width: "85%",
													items: [
														new sap.m.TextArea({
															width: "100%",
															enabled: false,
															rows: 4,
															cols: 190,
															maxLength: 500,
															value: "{LicenseJsonModel>/Intercerr}",
														}).addStyleClass("licenseInputBorder"),
													]
												})
											]
										}),
										new sap.m.HBox({
											width: "100%",
											items: [
												new sap.m.HBox({
													width: "18%",
													items: [
														new sap.m.Text({
															text: "PaT Adicionales(especificar lugar de conexión)"
														}).addStyleClass("LicenciaText"),
													]
												}).addStyleClass("sapUiTinyMarginEnd"),
												new sap.m.HBox({
													width: "85%",
													items: [
														new sap.m.TextArea({
															width: "100%",
															enabled: false,
															rows: 4,
															cols: 190,
															maxLength: 500,
															value: "{LicenseJsonModel>/Patadic}",
														}).addStyleClass("licenseInputBorder"),
													]
												})
											]
										}),
										new sap.m.HBox({
											width: "100%",
											items: [
												new sap.m.HBox({
													width: "18%",
													items: [
														new sap.m.Text({
															text: "Equipos a Mover / Pruebas Funcionales a Realizar"
														}).addStyleClass("LicenciaText"),
													]
												}).addStyleClass("sapUiTinyMarginEnd"),
												new sap.m.HBox({
													width: "85%",
													items: [
														new sap.m.TextArea({
															width: "100%",
															enabled: false,
															rows: 4,
															cols: 190,
															maxLength: 500,
															value: "{LicenseJsonModel>/Equimov}",
														}).addStyleClass("licenseInputBorder"),
													]
												})
											]
										}),
										new sap.m.HBox({
											width: "100%",
											items: [
												new sap.m.HBox({
													width: "18%",
													items: [
														new sap.m.Text({
															text: "Bloqueo de recierres (Sólo para TCT)"
														}).addStyleClass("LicenciaText"),
													]
												}).addStyleClass("sapUiTinyMarginEnd"),
												new sap.m.HBox({
													width: "85%",
													items: [
														new sap.m.TextArea({
															width: "100%",
															rows: 4,
															cols: 190,
															// Issue 580 - ampliar text box en front - se debe eliminar restriccion de longitud
															maxLength: 255,
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																	"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
																],
																formatter: oController.rolStatusEdition("general/")
															},
															editable: {
																path: "LicenseJsonModel>/Jobcond",
																formatter: $.proxy(oController.MedidasSeg_TCTfieldsEnabledFormatter, oController)
															},
															value: "{LicenseJsonModel>/Bloqueorecierretxt}",
														}).addStyleClass("licenseInputBorder"),
													]
												})
											]
										}),
										new sap.m.HBox({
											width: "100%",
											items: [
												new sap.m.HBox({
													width: "18%",
													items: [
														new sap.m.Text({
															text: "Interruptores que no deben Operarse (sólo para TcT)"
														}).addStyleClass("LicenciaText"),
													]
												}).addStyleClass("sapUiTinyMarginEnd"),
												new sap.m.HBox({
													width: "85%",
													items: [
														new sap.m.TextArea({
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																	"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
																],
																formatter: oController.rolStatusEdition("general/")
															},
															editable: {
																path: "LicenseJsonModel>/Jobcond",
																formatter: $.proxy(oController.MedidasSeg_TCTfieldsEnabledFormatter, oController)
															},
															width: "100%",
															rows: 4,
															cols: 190,
															// Issue 580 - ampliar text box en front - se debe extendio la longitud a 1300 caracteres
															maxLength: 5000,
															value: "{LicenseJsonModel>/Intnooperar}",
														}).addStyleClass("licenseInputBorder"),
													]
												}),
											]
										}),
										new sap.m.HBox({
											width: "100%",
											items: [
												new sap.m.HBox({
													width: "18%",
													items: [
														new sap.m.Text({
															text: "Otras Precauciones de Seguridad"
														}).addStyleClass("LicenciaText"),
													]
												}).addStyleClass("sapUiTinyMarginEnd"),
												new sap.m.HBox({
													width: "85%",
													items: [
														new sap.m.TextArea({
															width: "100%",
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/",
																	"LicenseJsonModel>/Werks",
																	"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
																],
																formatter: oController.rolStatusEdition("general/")
															},
															value: "{LicenseJsonModel>/Precauciones}",
															rows: 4,
															cols: 190,
															maxLength: 5000,
														}).addStyleClass("licenseInputBorder"),
													]
												})
											]
										}),
										new sap.ui.layout.form.SimpleForm({
											layout: "ResponsiveGridLayout",
											editable: true,
											content: [
												new sap.ui.core.HTML({
													layoutData: new sap.ui.layout.GridData({
														span: "L12 M12 S12"
													}),
													content: "<hr/>"
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													}),
													text: "Coordinado con ARO"
												}).addStyleClass("LicenciaText"),
												new sap.m.ComboBox({ //sap.m.isComboBox({
													//forceSelection: false,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													width: "100%",
													selectedKey: "{LicenseJsonModel>/Aro}",
													items: [
														new sap.ui.core.Item({
															text: "SI",
															key: "X"
														}),
														new sap.ui.core.Item({
															text: "NO",
															key: "N"
														})
													],
													layoutData: new sap.ui.layout.GridData({
														span: "L1 M12 S12"
													})
												}).addStyleClass("licenseInputBorder"),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													}),
													text: "Comentarios"
												}).addStyleClass("LicenciaText"),
												new sap.m.TextArea({
													maxLength: 2000,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Sindivi}",
													layoutData: new sap.ui.layout.GridData({
														span: "L7 M12 S12"
													})
												}).addStyleClass("licenseInputBorder"),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													}),
													text: "Señales Afectadas"
												}).addStyleClass("LicenciaText"),
												new sap.m.CheckBox({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													selected: {
														path: "LicenseJsonModel>/Senalninguna",
														formatter: function (sSignal) {
															return (sSignal === "X");
														}
													},
													select: [oController.handleSignal("/Senalninguna"), oController],
													text: "Ninguna",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}),
												new sap.m.CheckBox('removePreca', {
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													selected: {
														path: "LicenseJsonModel>/Precaucionesok",
														formatter: function (sCautions) {
															return (sCautions === "X");
														}
													},
													select: [oController.handleSignal("/Precaucionesok"), oController],
													text: "Precauciones",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}),
												new sap.m.CheckBox({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													selected: {
														path: "LicenseJsonModel>/Senalestados",
														formatter: function (sStates) {
															return (sStates === "X");
														}
													},
													select: [oController.handleSignal("/Senalestados"), oController],
													text: "Estados",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}),
												new sap.m.CheckBox({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													selected: {
														path: "LicenseJsonModel>/Senalalarmas",
														formatter: function (sAlarm) {
															return (sAlarm === "X");
														}
													},
													select: [oController.handleSignal("/Senalalarmas"), oController],
													text: "Alarmas",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}),
												new sap.m.CheckBox({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													selected: {
														path: "LicenseJsonModel>/Senalmedicion",
														formatter: function (sSignal) {
															return (sSignal === "X");
														}
													},
													select: [oController.handleSignal("/Senalmedicion"), oController],
													text: "Medicion",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													}),
													text: "Especificar Señales Afectadas"
												}).addStyleClass("LicenciaText"),
												new sap.m.Input({
													maxLength: 2000,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Senalafect}",
													tooltip: "{LicenseJsonModel>/Senalafect}",
													layoutData: new sap.ui.layout.GridData({
														span: "L10 M12 S12"
													})
												}).addStyleClass("licenseInputBorder"),
											]
										})
									]
								}),
								new sap.m.IconTabFilter({
									visible: "{FilterSelectionJsonModel>/visible}",
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://discussion",
									text: "Comentarios CAMMESA",
									content: [
										oCommentTable
									]
								}),
								new sap.m.IconTabFilter({
									visible: "{DisableControlsJsonModel>/tabVisibility}",
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://activity-individual",
									/*visible: {
										parts: ["UserJsonModel>/roles", "permisosModel>/", "DisableControlsJsonModel>/tabVisibility"],
										formatter: oController.rolVisualization("coordinada/")
									},*/
									text: "Coordinacion",
									content: [
										oCoordinateTable
									]
								}),
								new sap.m.IconTabFilter({
									visible: "{DisableControlsJsonModel>/tabVisibility}",
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://show",
									text: "Observaciones",
									content: [
										new sap.m.HBox({
											alignItems: sap.m.FlexAlignItems.Start,
											justifyContent: sap.m.FlexJustifyContent.End,
											items: [
												new sap.m.Button({
													//Workaround no se debe validar la region en el rol
													// visible: {
													// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
													// 	formatter: oController.rolStatusEdition("observacion/botonVerAnulacion")
													// },
													enabled: {
														path: "LicenseJsonModel>/FechaAnulacion",
														formatter: function (dFechaAnulacion) {
															return dFechaAnulacion ? true : false;
														}
													},
													text: "Causa anulación",
													press: [oController.openPopoverAnulacion, oController]
												}).addStyleClass("buttonInverted")
											]
										}).addStyleClass("sapUiTinyMarginTopBottom"),
										oObservationTable
									]
								}),
								new sap.m.IconTabFilter({
									visible: "{DisableControlsJsonModel>/tabVisibility}",
									/*visible: {
										parts: ["UserJsonModel>/roles", "permisosModel>/", "DisableControlsJsonModel>/tabVisibility"],
										formatter: oController.rolVisualization("tramitadat/")
									},*/
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://travel-expense-report",
									text: "Tramitar",
									content: [
										new sap.m.HBox({
											alignItems: sap.m.FlexAlignItems.Start,
											justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
											items: [
												new sap.m.HBox({
													items: [
														new sap.m.Text({
															visible: "{= ${LicenseJsonModel>/LastTramiteAvisoprog} !== '' }",
															text: "{LicenseJsonModel>/LastTramiteAvisoprog}"
														}).addStyleClass("sapUiSmallMarginEnd"),
														new sap.m.Text({
															visible: "{= ${LicenseJsonModel>/LastTramiteFecha} !== null }",
															text: {
																path: "LicenseJsonModel>/LastTramiteFecha",
																formatter: function (oLastTramiteFecha) {
																	if (!oLastTramiteFecha)
																		return "";

																	let oDateOffset = new Date(oLastTramiteFecha.getTime() + oLastTramiteFecha.getTimezoneOffset() * 60 *
																		1000);
																	let oFormate = sap.ui.core.format.DateFormat.getDateTimeInstance({
																		pattern: "dd/MM/yyyy"
																	});
																	return oFormate.format(oDateOffset);
																}
															}
														}),
														new sap.m.Text({
															visible: {
																parts: [{
																	path: "LicenseJsonModel>/LastTramiteHora"
																}],
																formatter: function (oLastTramiteHora) {
																	if (typeof oLastTramiteHora === "undefined")
																		return false;

																	return oLastTramiteHora.ms > 0;
																}
															},
															text: {
																path: "LicenseJsonModel>/LastTramiteHora",
																formatter: function (oLastTramiteHora) {
																	if (typeof oLastTramiteHora === "undefined")
																		return "";

																	if (oLastTramiteHora.ms > 0) {
																		let oDate = new Date(oLastTramiteHora.ms);
																		let oDateOffset = new Date(oDate.getTime() + oDate.getTimezoneOffset() * 60 * 1000);
																		let oFormate = sap.ui.core.format.DateFormat.getDateTimeInstance({
																			pattern: "HH:mm"
																		});
																		return oFormate.format(oDateOffset);
																	} else {
																		return "";
																	}
																}
															}
														}).addStyleClass("sapUiTinyMarginBegin")
													]
												}),
												new sap.m.HBox({
													items: [
														new sap.m.Text({
															text: "Resultado de la tramitación:"
														}).addStyleClass("sapUiTinyMarginEnd"),
														new sap.m.Input({
															value: {
																path: "TramitacionStatusModel>/StatusText"
															},
															enabled: false
														}).addStyleClass("sapUiTinyMarginEnd"),
														new sap.m.Button({
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																	"DisableControlsJsonModel>/visibleLic", "ValidateFirstDeliveryJsonModel>/FirstDeliveryHasBeenMade",
																	"PermisosJsonModel>/UsuarioEncontrado"
																],
																formatter: oController.rolStatusEdition("tramitacion/")
															},
															text: "Guardar",
															press: [oController.sendTramitacion, oController]
														}).addStyleClass("buttonInverted sapUiTinyMarginEnd sapUiTinyMarginBegin"),
														new sap.m.Button({
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																	"DisableControlsJsonModel>/visibleLic", "ValidateFirstDeliveryJsonModel>/FirstDeliveryHasBeenMade",
																	"PermisosJsonModel>/UsuarioEncontrado"
																],
																formatter: oController.rolStatusEdition("tramitacion/")
															},
															text: "Finalizar Tramitación",
															press: [oController.finishTramitacion, oController]
														}).addStyleClass("buttonInverted"),
														new sap.m.Button({
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																	"DisableControlsJsonModel>/visibleLic", "ValidateFirstDeliveryJsonModel>/FirstDeliveryHasBeenMade",
																	"PermisosJsonModel>/UsuarioEncontrado"
																],
																formatter: oController.rolStatusEdition("botones/CancelarTramitacionButon")
															},
															text: "Cancelar Tramitación",
															press: [oController.cancelTramitacion, oController]
														}).addStyleClass("buttonInverted sapUiTinyMarginBegin")
													]
												}),
											]
										}).addStyleClass("sapUiTinyMarginTopBottom"),
										oTramitacionTable
									]
								}),
								new sap.m.IconTabFilter({
									visible: "{DisableControlsJsonModel>/tabVisibility}",
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://comment",
									text: "Comentarios",
									content: [
										new sap.ui.layout.form.SimpleForm({
											layout: "ResponsiveGridLayout",
											editable: true,
											content: [
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Parte diario CAMMESA",
													layoutData: new sap.ui.layout.GridData({
														span: "L12 M12 S12"
													})
												}),
												new sap.m.TextArea({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
														formatter: oController.rolStatusEdition("comentarios/")
													},
													value: "{LicenseJsonModel>/Comments}",
													width: "100%",
													layoutData: new sap.ui.layout.GridData({
														span: "L12 M12 S12"
													}),
													rows: 6
												}),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Base de programacion COT/COTDT",
													layoutData: new sap.ui.layout.GridData({
														span: "L12 M12 S12"
													})
												}),
												new sap.m.TextArea({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
														formatter: oController.rolStatusEdition("comentarios/")
													},
													value: "{LicenseJsonModel>/Tdtcomments}",
													width: "100%",
													layoutData: new sap.ui.layout.GridData({
														span: "L12 M12 S12"
													}),
													rows: 6
												}),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Comentarios Programación",
													layoutData: new sap.ui.layout.GridData({
														span: "L12 M12 S12"
													})
												}),
												new sap.m.TextArea({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
														formatter: oController.rolStatusEdition("comentarios/")
													},
													value: "{LicenseJsonModel>/Prgcomments}",
													width: "100%",
													layoutData: new sap.ui.layout.GridData({
														span: "L12 M12 S12"
													}),
													rows: 6
												}),
												new sap.ui.unified.FileUploader({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
														formatter: oController.rolStatusEdition("comentarios/")
													},
													change: [oController.uploadFiles, oController],
													fileType: ['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'jpg', 'png', 'csv'],
													multiple: true,
													buttonText: "Examinar",
													placeholder: "Agregue uno o mas documentos",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}),
												new sap.m.Button({
													/*
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
														formatter: oController.rolStatusEdition("comentarios/")
													},*/
													text: "Ver Archivos",
													//visible: "{FilterSelectionJsonModel>/visibleFiles}",
													press: [oController.openFileList, oController],
													icon: "sap-icon://show",
													customData: {
														Type: "sap.ui.core.CustomData",
														key: "tieneArchivos",
														value: {
															path: "FileListJsonModel>/Files",
															formatter: function (aFiles) {
																if (aFiles && aFiles.length !== 0) {
																	return "true";
																} else {
																	return "false";
																}
															}
														},
														writeToDom: true
													},
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}).addStyleClass("buttonInverted estadoArchIcon"),
												new sap.m.HBox({
													items: [
														new sap.m.Text({
															text: "Archivos permitidos: txt, csv, doc, docx, pdf, xls, jpg, png"
														})
													],
													layoutData: new sap.ui.layout.GridData({
														span: "L12 M12 S12"
													})
												}),
												new sap.m.Button({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
														formatter: oController.rolStatusEdition("comentarios/")
													},
													text: "Guardar Comentarios",
													press: [oController.editComments, oController],
													layoutData: new sap.ui.layout.GridData({
														linebreak: true,
														span: "L2 M12 S12",
														indent: "L10"
													})
												}).addStyleClass("buttonInverted")
											]
										})
									]
								}),
								new sap.m.IconTabFilter({
									visible: "{DisableControlsJsonModel>/tabVisibility}",
									// visible: {
									// 	parts: ["UserJsonModel>/roles", "permisosModel>/", "DisableControlsJsonModel>/tabVisibility"],
									// 	formatter: oController.rolVisualization("entregasDevoluciones/")
									// },
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://paper-plane",
									text: "Entregas/Cancelaciones",
									content: [new sap.m.HBox({
										width: "100%",
										justifyContent: "End",

										items: [
											new sap.m.Button({
												iconFirst: true,
												text: "Causa Cancelación",
												// visible: {
												// 	parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
												// 	formatter: oController.rolStatusEdition("observacion/botonVerCancelacion")
												// },
												enabled: {
													path: "LicenseJsonModel>/Licstat",
													formatter: function (dLicStat) {
														return dLicStat === "11" ? true : false
													}
												},
												press: [oController.openPopoverCancelacion, oController]
											}).addStyleClass("buttonInverted")
										]

									}),
									// new sap.m.Panel({
									// 	expandable: true,
									// 	expanded: true,
									// 	headerText: "Turno",
									// 	content: [
									// 		oTurnoTable
									// 	]
									// }),
									// new sap.m.Panel({
									// 	expandable: true,
									// 	expanded: true,
									// 	headerText: "Colocacion y retiro de PAT",
									// 	content: [
									// 		new sap.m.Panel({
									// 			expandable: true,
									// 			expanded: true,
									// 			headerText: "Colocacion",
									// 			content: [
									// 				oColocacionTable
									// 			]

									// 		}),
									// 		new sap.m.Panel({
									// 			expandable: true,
									// 			expanded: true,
									// 			headerText: "Retiro de PAT",
									// 			content: [
									// 				oRetiroTable
									// 			]
									// 		})
									// 	]
									// }),
									// new sap.m.Panel({
									// 	expandable: true,
									// 	expanded: true,
									// 	headerText: "Inhibicion y habilitacion de PAT",
									// 	content: [
									// 		new sap.m.Panel({
									// 			expandable: true,
									// 			expanded: true,
									// 			headerText: "Inhibicion",
									// 			content: [
									// 				oInhibicionTable
									// 			]

									// 		}),
									// 		new sap.m.Panel({
									// 			expandable: true,
									// 			expanded: true,
									// 			headerText: "Habilitacion",
									// 			content: [
									// 				oHabilitacionTable
									// 			]
									// 		})
									// 	]
									// }),
									new sap.m.Panel({
										expandable: true,
										expanded: true,
										headerText: "Entregas y devoluciones",
										content: [
											new sap.m.Panel({
												expandable: true,
												expanded: true,
												headerText: "Entregas",
												content: [
													oDeliveryTable
												]
											}),
											new sap.m.Panel({
												expandable: true,
												expanded: true,
												headerText: "Devoluciones",
												content: [
													oDevolucionTable
												]
											})
										]
									}),
									new sap.m.Panel({
										expandable: true,
										headerText: "Suspension / Reanudacion",
										content: [
											new sap.m.Panel({
												expandable: true,
												headerText: "Suspension",
												content: [
													oSuspensionTable
												]
											}),
											new sap.m.Panel({
												expandable: true,
												headerText: "Reanudacion",
												content: [
													oReanudacionTable
												]
											})
										]
									}),
									new sap.m.Panel({
										visible: "{DisableControlsJsonModel>/tabVisibility}",
										expandable: true,
										headerText: "Transferencia de Jefe de trabajo",
										content: [
											new sap.m.VBox({
												items: {
													path: "TransferListJsonModel>/Transfers",
													template: oTransferTemplate
												}
											})
										]
									})
									]
								})
							]
						}).addStyleClass("textTabBarWidth")
					]
				})
			],
			showNavButton: true,
			navButtonPress: [oController.onBack, oController],
			backgroundDesign: sap.m.PageBackgroundDesign.Solid
		});

		return mainPage;
	}

});