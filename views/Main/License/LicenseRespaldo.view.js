sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.License.License", {

	getControllerName: function () {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.License.License";
	},

	createContent: function (oController) {
		//page
		var oTransferTemplate = new sap.m.HBox({
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
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
								formatter: oController.rolStatusEdition("transferencia/")
							},
							items: {
								// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
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
						new sap.m.Label({
							text: "TE que informó",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
								formatter: oController.rolStatusEdition("transferencia/")
							},
							selectedKey: "{TransferListJsonModel>Teinformo}",
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: {
								templateShareable: false,
								// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
								path: "PersonalHabilitadoModel>/Solicitante",
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
								indent: "L1"
							})
						}),
						new sap.m.ComboBox({
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
						}),
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
								"DisableControlsJsonModel>/visibleLic",
								"PermisosJsonModel>/UsuarioEncontrado"
							],
							formatter: oController.rolStatusEdition("tramitacion/")
						},
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"DisableControlsJsonModel>/visibleLic",
								"PermisosJsonModel>/UsuarioEncontrado"
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
									"DisableControlsJsonModel>/visibleLic",
									"PermisosJsonModel>/UsuarioEncontrado"
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
									"DisableControlsJsonModel>/visibleLic",
									"PermisosJsonModel>/UsuarioEncontrado"
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
								path: "SelectModel>/FixedValuesSet",
								filters: [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_OP_TRALIC"),
									new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "ESTADO")
								],
								template: new sap.ui.core.Item({
									key: "{SelectModel>Valkey}",
									text: "{SelectModel>Valtext}"
								})
							}

						}),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DisableControlsJsonModel>/visibleLic",
									"PermisosJsonModel>/UsuarioEncontrado", "TramitacionListJsonModel>Enabled"
								],
								formatter: oController.rolStatusEdition("tramitacion/")
							},
							selectedKey: "{TramitacionListJsonModel>CausaNo}",
							items: {
								templateShareable: false,
								path: "SelectModel>/MotivoNoAutorizacionSet",
								template: new sap.ui.core.Item({
									key: "{SelectModel>Status}",
									text: "{SelectModel>Descripcion}"
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
							text: {
								path: "TramitacionListJsonModel>Avisoprog",
								formatter: $.proxy(oController.handleUserName, oController)
							}
						}),
						/*	new sap.m.Text({
								text: "{TramitacionListJsonModel>Trascot}"
							}),*/
						new sap.m.Input({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DisableControlsJsonModel>/visibleLic",
									"PermisosJsonModel>/UsuarioEncontrado", "TramitacionListJsonModel>Enabled"
								],
								formatter: oController.rolStatusEdition("tramitacion/")
							},
							value: "{TramitacionListJsonModel>MotivoNo}"
						}),
						new sap.m.Button({
							visible: {
								path: "TramitacionListJsonModel>Estado",
								formatter: function (sEstado) {
									return sEstado === "01"
								}
							},
							icon: "sap-icon://appointment-2",
							//icon: "sap-icon://appointment",
							//text: "Estado diario",
							press: [oController.openTramitacionCalendarDialog, oController]
						}).addStyleClass("buttonInverted"),
						new sap.m.Button({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DisableControlsJsonModel>/visibleLic",
									"PermisosJsonModel>/UsuarioEncontrado"
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

		var oDevolucionTable = new sap.m.Table({
			width: "100%",
			inset: false,
			fixedLayout: false,
			enableBusyIndicator: true,
			noDataText: "No hay devoluciones",
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
						text: "Personal del turno"
					})
				}),
				new sap.m.Column({
					width: "350px",
					header: new sap.m.Text({
						text: "TE/JT/JTG"
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
				})
			],
			items: {
				path: "DevolutionTableJsonModel>/Devolutions",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.DatePicker({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DevolutionTableJsonModel>enabled",
									"DevolutionTableJsonModel>enabledContinua", "DevolutionTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{DevolutionTableJsonModel>Datelicencia}",
							minDate: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							displayFormat: "dd-MM-yyyy"
						}),
						/*new sap.m.Text({
							text: {
								path: "DevolutionTableJsonModel>Datelicencia",
								formatter: $.proxy(oController.formatDateLicence, oController)
							}
						}),*/
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
							text: {
								path: "DevolutionTableJsonModel>Personal",
								formatter: $.proxy(oController.handleUserName, oController)
							}
						}),
						new sap.m.ComboBox({
							width: "100%",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DevolutionTableJsonModel>enabled",
									"DevolutionTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							selectedKey: "{DevolutionTableJsonModel>Tejt}",
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
									"DevolutionTableJsonModel>enabled",
									"DevolutionTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							value: "{DevolutionTableJsonModel>Commen}"
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
					width: "45px",
					header: new sap.m.Text({
						text: ""
					})
				}),
				new sap.m.Column({
					width: "145px",
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
					width: "130px",
					header: new sap.m.Text({
						text: "COT/COTDT"
					})
				}),
				new sap.m.Column({
					width: "200px",
					header: new sap.m.Text({
						text: "TE/JT/JTG"
					})
				}),
				new sap.m.Column({
					width: "60px",
					header: new sap.m.Text({
						text: "Folio"
					})
				}),
				new sap.m.Column({
					width: "200px",
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
							change: [oController.handleDateChange, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation"
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
							/*enabled: {
								parts: ["DeliveryTableJsonModel>Motivono"],
								formatter: function(motivoNo){
									if(motivoNo!==''){
										return false;
									}else {
										return true;
									}
								}
							},*/
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							dateValue: "{DeliveryTableJsonModel>Time}",
							displayFormat: "HH:mm"
						}),
						new sap.m.Text({
							text: {
								path: "DeliveryTableJsonModel>Cot",
								formatter: $.proxy(oController.handleUserName, oController)
							}
						}),
						new sap.m.ComboBox({
							width: "100%",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							selectedKey: "{DeliveryTableJsonModel>Tejt}",
							items: {
								templateShareable: false,
								path: "PersonalHabilitadoModel>/Todos",
								template: new sap.ui.core.Item({
									key: "{PersonalHabilitadoModel>Legajo}",
									text: "{PersonalHabilitadoModel>Nombre} {PersonalHabilitadoModel>Legajo}"
								})
							}
						}),
						new sap.m.Input({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							value: "{DeliveryTableJsonModel>Folio}"
						}),
						new sap.m.ComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation"
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
									"DeliveryTableJsonModel>sameDayValidation"
								],
								formatter: oController.rolStatusEdition("entregas/")
							},
							value: "{DeliveryTableJsonModel>Commen}"
						}),
						new sap.m.Button({
							text: "Entrega",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"DeliveryTableJsonModel>enabled",
									"DeliveryTableJsonModel>sameDayValidation"
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
							value: "{CoordinationTableJsonModel>Coordination}"
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
								// new sap.m.Button({
								// 	icon: "sap-icon://delete",
								// 	press: $.proxy(oController.onDeleteFromTable, oController, "CoordinationTableJsonModel")
								// }).addStyleClass("buttonInverted")
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
									"ObservationTableJsonModel>Obsindex",
									"PermisosJsonModel>/UsuarioEncontrado"
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
							maxLength: 255,
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"ObservationTableJsonModel>Obsindex",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("observacion/", oController.validateToSend.bind(oController,
									"ObservationTableJsonModel"))
							},
							value: "{ObservationTableJsonModel>Observation}"
						}).addStyleClass("combo-table"),
						new sap.m.HBox({
							items: [
								new sap.m.Button({
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado"
										],
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
							displayFormat: "HH:mm"
						}),
						new sap.m.Text({
							text: {
								path: "DeliveryTableJsonModel>Cot",
								formatter: $.proxy(oController.handleUserName, oController)
							}
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
							value: "{SuspensionTableJsonModel>Commen}"
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
						text: ""
					})
				})
			],
			items: {
				path: "ReanudationTableJsonModel>/Reanudations",
				template: new sap.m.ColumnListItem({
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
							displayFormat: "HH:mm"
						}),
						new sap.m.Text({
							text: {
								path: "DeliveryTableJsonModel>Cot",
								formatter: $.proxy(oController.handleUserName, oController)
							}
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
							items: {
								templateShareable: false,
								path: "PersonalHabilitadoModel>/Todos",
								template: new sap.ui.core.Item({
									key: "{PersonalHabilitadoModel>Legajo}",
									text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
								})
							}
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
						press: [oController.exportLicense, oController]
					}).addStyleClass("buttonInverted"),
				],
				contentRight: [
					//la anulacion puede ser realizada por cualquiera y en cualquier estado. 
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
							formatter: oController.rolStatusEdition("botones/AnnulateButton")
						},
						text: "Anular",
						press: [oController.dialogAnnulateLicense, oController]
					}).addStyleClass("buttonInverted"),
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"DisableControlsJsonModel>/visibleSol"
							],
							formatter: oController.rolStatusEdition("botones/ButtonEditSol")
						},
						icon: "sap-icon://create",
						enabled: {
							parts: [
								"LicenseJsonModel>/Solbeg",
								"LicenseJsonModel>/Timend",
								"LicenseJsonModel>/Solend",
								"LicenseJsonModel>/Timbeg",
								"LicenseJsonModel>/Arbpl",
								"LicenseJsonModel>/Solicitante",
								"LicenseJsonModel>/Equstatnocam",
								"LicenseJsonModel>/Jobcond",
								"LicenseJsonModel>/Equiinterv",
								"LicenseJsonModel>/Descripcion",
								"LicenseJsonModel>/R500kv",
								"LicenseJsonModel>/Barrafs",
								"LicenseJsonModel>/Bloqueo",
								//nuevas,
								"LicenseJsonModel>/Rdisparo",
								"LicenseJsonModel>/Equnr",
								"LicenseJsonModel>/Equstat",
								"LicenseJsonModel>/Tplnr",
								"LicenseJsonModel>/Tiemporep",
								"PermisosJsonModel>/UsuarioEncontrado",
								"LicenseJsonModel>/Barrafstx",
								"LicenseJsonModel>/Werks",
								"LicenseJsonModel>/Tipinterv",
								"LicenseJsonModel>/Perestac",
								"LicenseJsonModel>/Solictext"
							],
							formatter: $.proxy(oController.SolIsValid, oController)
						},
						iconFirst: true,
						text: "{FilterSelectionJsonModel>/textFlowSol}",
						//text: "Generar Solicitud",
						tooltip: "{FilterSelectionJsonModel>/textFlowSol}",
						press: $.proxy(oController.handleSolLic, oController, "Solicitud")
					}).addStyleClass("buttonInverted"),
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"PermisosJsonModel>/UsuarioEncontrado"
							],
							formatter: oController.rolStatusEdition("botones/ButtonEditLicense")
						},
						enabled: {
							parts: [
								"LicenseJsonModel>/Solbeg",
								"LicenseJsonModel>/Timend",
								"LicenseJsonModel>/Solend",
								"LicenseJsonModel>/Timbeg",
								"LicenseJsonModel>/Arbpl",
								"LicenseJsonModel>/Solicitante",
								"LicenseJsonModel>/Equstatnocam",
								"LicenseJsonModel>/Jobcond",
								"LicenseJsonModel>/Equiinterv",
								"LicenseJsonModel>/Descripcion",
								"LicenseJsonModel>/R500kv",
								"LicenseJsonModel>/Barrafs",
								"LicenseJsonModel>/Bloqueo",
								"LicenseJsonModel>/Rdisparo",
								"LicenseJsonModel>/Werks",
								"LicenseJsonModel>/Aufnr",
								"LicenseJsonModel>/SolSuplente",
								"LicenseJsonModel>/Jefe",
								"LicenseJsonModel>/JefeSuplente",
								"LicenseJsonModel>/Tipinterv",
								"LicenseJsonModel>/Perestac",
								"LicenseJsonModel>/Solictext",
								//medidas de seguridad
								"LicenseJsonModel>/Aro",
								// "LicenseJsonModel>/Sindivi",
								"LicenseJsonModel>/Senalninguna",
								"LicenseJsonModel>/Precaucionesok",
								"LicenseJsonModel>/Senalestados",
								"LicenseJsonModel>/Senalalarmas",
								"LicenseJsonModel>/Senalmedicion",
								"LicenseJsonModel>/Senalafect",
								"LicenseJsonModel>/Interabier",
								"LicenseJsonModel>/Seleccionad",
								"LicenseJsonModel>/Intercerr",
								"LicenseJsonModel>/Patadic",
								"LicenseJsonModel>/Equimov",
								//"LicenseJsonModel>/Intnooperar",
								//"LicenseJsonModel>/Bloqueorecierretxt",
								"LicenseJsonModel>/Precauciones",
								"LicenseJsonModel>/Tipolicencia",
								"LicenseJsonModel>/Equnr",
								"LicenseJsonModel>/Tplnr",
								"LicenseJsonModel>/Equstat"
							],
							formatter: $.proxy(oController.enableValidLicense, oController)
						},
						icon: "sap-icon://create",
						iconFirst: true,
						//text: "Generar Licencia",
						text: "{FilterSelectionJsonModel>/textFlow}",
						tooltip: "{i18n>AddRequest}",
						press: $.proxy(oController.handleSolLic, oController, "Licencia")
					}).addStyleClass("buttonInverted"),
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"DisableControlsJsonModel>/visibleLic",
								"PermisosJsonModel>/UsuarioEncontrado", "EnviarCoordModel>/visibleEnviarCoord"
							],
							formatter: oController.rolStatusEdition("botones/ButtonEditLicense")
						},
						enabled: {
							parts: [
								"LicenseJsonModel>/Solbeg",
								"LicenseJsonModel>/Timend",
								"LicenseJsonModel>/Solend",
								"LicenseJsonModel>/Timbeg",
								"LicenseJsonModel>/Arbpl",
								"LicenseJsonModel>/Solicitante",
								"LicenseJsonModel>/Equstatnocam",
								"LicenseJsonModel>/Jobcond",
								"LicenseJsonModel>/Equiinterv",
								"LicenseJsonModel>/Descripcion",
								"LicenseJsonModel>/R500kv",
								"LicenseJsonModel>/Barrafs",
								"LicenseJsonModel>/Bloqueo",
								"LicenseJsonModel>/Rdisparo",
								"LicenseJsonModel>/Werks",
								"LicenseJsonModel>/Aufnr",
								"LicenseJsonModel>/SolSuplente",
								"LicenseJsonModel>/Jefe",
								"LicenseJsonModel>/JefeSuplente",
								"LicenseJsonModel>/Tipinterv",
								"LicenseJsonModel>/Perestac",
								"LicenseJsonModel>/Solictext",
								//medidas de seguridad
								"LicenseJsonModel>/Aro",
								// "LicenseJsonModel>/Sindivi",
								"LicenseJsonModel>/Senalninguna",
								"LicenseJsonModel>/Precaucionesok",
								"LicenseJsonModel>/Senalestados",
								"LicenseJsonModel>/Senalalarmas",
								"LicenseJsonModel>/Senalmedicion",
								"LicenseJsonModel>/Senalafect",
								"LicenseJsonModel>/Interabier",
								"LicenseJsonModel>/Seleccionad",
								"LicenseJsonModel>/Intercerr",
								"LicenseJsonModel>/Patadic",
								"LicenseJsonModel>/Equimov",
								//"LicenseJsonModel>/Intnooperar",
								//"LicenseJsonModel>/Bloqueorecierretxt",
								"LicenseJsonModel>/Precauciones",
								"LicenseJsonModel>/Tipolicencia",
								"LicenseJsonModel>/Equnr",
								"LicenseJsonModel>/Tplnr",
								"LicenseJsonModel>/Equstat"
							],
							formatter: $.proxy(oController.enableValidLicense, oController)
						},
						icon: "sap-icon://create",
						iconFirst: true,
						//text: "Generar Licencia",
						text: "Enviar a Coordinación",
						tooltip: "Enviar a coordinacion",
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
				new sap.m.HBox({
					visible: {
						parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "DisableControlsJsonModel>/visibleSol"],
						formatter: oController.rolStatusEdition("botones/ButtonAddReportSemanalCammesa")
					},
					items: [
						new sap.m.CheckBox({
							text: "Incluir en reporte semanal Cammesa",
							tooltip: "Incluir en reporte semanal Cammesa",
							selected: "{LicenseJsonModel>/HabilitadoGestion}",
							select: [oController.includeCammesa, oController]
						}),
						new sap.m.Label({
							text: {
								path: "LicenseJsonModel>/HabilitadoGestionFechaModificacion",
								formatter: oController.formatDateWithoutGMT
							}
						}).addStyleClass("margin15")
					]
				}),

				new sap.m.HBox({
					items: [
						new sap.m.Text({
							text: "Solicitud * "
						}).addStyleClass("solicitudText sapUiSmallMarginBegin"),
						new sap.m.Text({
							text: "Licencia * "
						}).addStyleClass("LicenciaText sapUiMediumMarginBegin"),
						new sap.m.Text({
							text: "Nota * : Asegurese de completar todos los campos relacionados a la licencia para poder generarla."
						}).addStyleClass("LicenciaText sapUiMediumMarginBegin")
					]
				}).addStyleClass("sapUiSmallMarginTop"),
				new sap.ui.layout.form.SimpleForm({
					layout: "ResponsiveGridLayout",
					editable: true,
					content: [
						new sap.m.Label({
							textAlign: sap.ui.core.TextAlign.Left,
							design: sap.m.LabelDesign.Bold,
							text: "Inicio"
						}).addStyleClass("solicitudText"),
						new sap.m.DatePicker({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									/*"DisableControlsJsonModel>/enabled", */
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								//el usuario que puede editar la observacion es el mismo que crea la licencia/solicitud
								formatter: oController.rolStatusEdition("header/")
							},
							dateValue: "{LicenseJsonModel>/Solbeg}",
							maxDate: "{LicenseJsonModel>/Solend}",
							change: [oController.onWorkDateChanged, oController],
							displayFormat: "dd-MM-yyyy",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.TimePicker({
							displayFormat: "HH:mm",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									/*"DisableControlsJsonModel>/enabled", */
									"PermisosJsonModel>/UsuarioEncontrado"
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
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.RadioButtonGroup({
							select: [oController.handlePeriod, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "PermisosJsonModel>/UsuarioEncontrado"
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
							text: "Puesto de Trabajo",
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12"
							})
						}).addStyleClass("center solicitudText"),
						new sap.m.isComboBox({
							//change: [oController.onWorkStationChange, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							width: "100%",
							selectedKey: "{LicenseJsonModel>/Arbpl}",
							valueState: "{LicenseJsonModel>/ArbplState}",
							valueStateText: "{LicenseJsonModel>/ArbplStateMessage}",
							items: {
								//filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
								path: "WorkPlacesJsonModel>/FilteredWorkPlaces",
								template: new sap.ui.core.Item({
									key: "{WorkPlacesJsonModel>Arbpl}",
									text: "{WorkPlacesJsonModel>Ktext}"
								})
							},
							//enabled: false,
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							})
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Fin",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("solicitudText"),
						new sap.m.DatePicker({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									/*"DisableControlsJsonModel>/enabled", */
									"PermisosJsonModel>/UsuarioEncontrado"
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
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.TimePicker({
							displayFormat: "HH:mm",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									/*"DisableControlsJsonModel>/enabled", */
									"PermisosJsonModel>/UsuarioEncontrado"
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
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Button({
							enabled: "{DisableControlsJsonModel>/HorariosSemanaEnabled}",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
							text: "Horarios Semana",
							press: [oController.onDailyDialogOpen, oController]
						}),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Solicitante",
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12"
							})
						}).addStyleClass("solicitudText"),
						new sap.m.isComboBox({
							width: "100%",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							selectedKey: "{LicenseJsonModel>/Solicitante}",
							valueState: "{LicenseJsonModel>/SolicitanteState}",
							valueStateText: "{LicenseJsonModel>/SolicitanteStateMessage}",
							items: {
								// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
								path: "PersonalHabilitadoModel>/Solicitante",
								template: new sap.ui.core.Item({
									key: "{PersonalHabilitadoModel>Legajo}",
									text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
								})
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							})
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							visible: "{EnviarCoordModel>/visibleTipoLicencia}",
							textAlign: sap.ui.core.TextAlign.Left,
							design: sap.m.LabelDesign.Bold,
							text: "Tipo de licencia"
						}).addStyleClass("solicitudText solicitudInputBorder"),
						new sap.m.Select({
							visible: "{EnviarCoordModel>/visibleTipoLicencia}",
							selectedKey: "{LicenseJsonModel>/Tipolicencia}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "EnviarCoordModel>/visibleTipoLicencia"
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
								span: "L2 M12 S12"
							})
						}).addStyleClass("solicitudInputBorder"),
						new sap.ui.core.HTML({
							layoutData: new sap.ui.layout.GridData({
								span: "L12 M12 S12"
							}),
							content: "<hr/>"
						}),

						new sap.m.VBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							}),
							items: [
								new sap.m.Label({
									design: sap.m.LabelDesign.Bold,
									linebreak: true,
									text: "Estado Equipo/s a intervenir"
								}).addStyleClass("center solicitudText"),
								new sap.m.ComboBox({
									width: "100%",
									height: "45px",
									selectedKey: "{LicenseJsonModel>/Equstatnocam}",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado", "PermisosJsonModel>/UsuarioEncontrado"
										],
										formatter: oController.rolStatusEdition("header/")
									},
									items: {
										path: "HardCodeModel>/Equstatnocam",
										template: new sap.ui.core.Item({
											key: "{HardCodeModel>key}",
											text: "{HardCodeModel>value}"
										})
									}
								}).addStyleClass("solicitudInputBorder"),
							]
						}),
						new sap.m.VBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							}),
							items: [
								new sap.m.Label({
									design: sap.m.LabelDesign.Bold,
									linebreak: true,
									text: "Condiciones de trabajo",
								}).addStyleClass("center solicitudText"),
								new sap.m.isComboBox({
									width: "100%",
									height: "45px",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado"
										],
										formatter: oController.rolStatusEdition("header/")
									},
									selectedKey: "{LicenseJsonModel>/Jobcond}",
									valueState: "{LicenseJsonModel>/JobcondState}",
									valueStateText: "{LicenseJsonModel>/JobcondStateMessage}",
									/*items: {
										path: "SelectModel>/FixedValuesSet",
										filters: [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_LICENCIAS"),
											new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "JOBCOND")
										],
										template: new sap.ui.core.Item({
											key: "{SelectModel>Valkey}",
											text: "{SelectModel>Valtext}"
										})
									},*/
									items: [
										new sap.ui.core.Item({
											key: "01",
											text: "Consignación"
										}),
										/*new sap.ui.core.Item({
											key: "02",
											text: "Trabajo sin Tensión con PaT"
										}),
										new sap.ui.core.Item({
											key: "03",
											text: "Trabajo con Tensión de Retorno"
										}),*/
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
								}).addStyleClass("solicitudInputBorder"),
							]
						}),
						new sap.m.VBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L6 M12 S12"
							}),
							items: [
								new sap.m.Label({
									design: sap.m.LabelDesign.Bold,
									text: "Equipo/s a Intervenir",
								}).addStyleClass("solicitudText"),
								new sap.m.TextArea({
									width: "100%",
									height: "45px",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado"
										],
										formatter: oController.rolStatusEdition("header/")
									},
									value: "{LicenseJsonModel>/Equiinterv}",
									valueState: "{LicenseJsonModel>/EquiintervState}",
									valueStateText: "{LicenseJsonModel>/EquiintervStateMessage}",
								}).addStyleClass("solicitudInputBorder")
							]
						}),
						new sap.ui.core.HTML({
							layoutData: new sap.ui.layout.GridData({
								span: "L12 M12 S12"
							}),
							content: "<hr/>"
						}),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "E.T",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("solicitudText"),
						new sap.m.isComboBox({
							width: "100%",
							change: $.proxy(oController.changeUbicacion, oController, "Licencia"),
							//change: [oController.changeUbicacion, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("header/ET")
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
						}).addStyleClass("solicitudInputBorder"),
						// new sap.m.Label({
						// 	design: sap.m.LabelDesign.Bold,
						// 	text: "Equipo Solicitado CAMMESA",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L2 M12 S12",
						// 		linebreak: true
						// 	})
						// }).addStyleClass("solicitudText"),
						// new sap.m.isComboBox({
						// 	selectedKey: "{LicenseJsonModel>/Equnr}",
						// 	enabled: {
						// 		parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/","LicenseJsonModel>/Werks",
						// 			"LicenseJsonModel>/Licstat", "CurrentUser>/Legajo", "LicenseJsonModel>/Solicitante",
						// 			"FilterSelectionJsonModel>/enabledEquipos"
						// 		],
						// 		formatter: oController.rolStatusEdition("header/", oController.verifySameUserObservation)
						// 	},
						// 	items: {
						// 		path: "EquiposJsonModel>/Equipos",
						// 		template: new sap.ui.core.Item({
						// 			key: "{EquiposJsonModel>CodigoEquipo}",
						// 			text: "{EquiposJsonModel>DescEquipo}"
						// 		})
						// 	},
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L2 M12 S12"
						// 	})
						// }).addStyleClass("solicitudInputBorder"),

						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Estado Equipo CAMMESA",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("solicitudText"),
						new sap.m.isComboBox({
							change: [oController.onCammesaStateChange, oController],
							selectedKey: "{LicenseJsonModel>/Equstat}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							items: [
									new sap.ui.core.Item({
										key: "X",
										text: "En Servicio"
									}),
									new sap.ui.core.Item({
										key: "Y",
										text: "Fuera de Servicio"
									})
								]
								/*{
																path: "SelectModel>/FixedValuesSet",
																filters: [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_LICENCIAS"),
																	new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "EQUSTAT")
																],
																template: new sap.ui.core.Item({
																	key: "{SelectModel>Valkey}",
																	text: "{SelectModel>Valtext}"
																})
															}*/
								,
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Riesgo de disparo",
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12"
							})
						}).addStyleClass("solicitudText"),
						new sap.m.Select({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("header/")
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12",
							}),
							forceSelection: false,
							selectedKey: "{LicenseJsonModel>/Rdisparo}",
							items: [
								new sap.ui.core.Item({
									key: "NS",
									text: ""
								}),
								new sap.ui.core.Item({
									key: "X",
									text: "SI"
								}),
								new sap.ui.core.Item({
									key: "Y",
									text: "NO"
								})
							]
						}).addStyleClass("solicitudInputBorder"),
						/*	new sap.m.CheckBox({
								selected: {
									path: "LicenseJsonModel>/Rdisparo",
									formatter: function (sRdisparo) {
										return sRdisparo === "X";
									}
								},
								enabled: {
									parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
										"PermisosJsonModel>/UsuarioEncontrado"
									],
									formatter: oController.rolStatusEdition("header/")
								},
								select: [oController.handleShootRange, oController],
								text: "Riesgo de disparo",
								layoutData: new sap.ui.layout.GridData({
									span: "L2 M12 S12",
									indent: "L2"
								})
							}).addStyleClass("checkBoxSolicitudColor"),*/
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Equipo Solicitado CAMMESA",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("solicitudText"),
						new sap.m.isComboBox({
							selectedKey: "{LicenseJsonModel>/Equnr}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"FilterSelectionJsonModel>/enabledComboEQUIPO", "PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("header/Equnr")
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
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Tiempo de reposición",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
							})
						}).addStyleClass("solicitudText"),
						new sap.m.isComboBox({
							width: "100%",
							selectedKey: "{LicenseJsonModel>/Tiemporep}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
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
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.IconTabBar({
							headerMode: sap.m.IconTabHeaderMode.InLine,
							layoutData: new sap.ui.layout.GridData({
								span: "L12 M12 S12"
							}),
							items: [
								new sap.m.IconTabFilter({
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://activity-2",
									visible: {
										parts: ["UserJsonModel>/roles", "permisosModel>/"],
										formatter: oController.rolVisualization("general/")
									},
									text: "General",
									content: [
										new sap.ui.layout.form.SimpleForm({
											layout: "ResponsiveGridLayout",
											editable: true,
											content: [
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Requiere calle de 500kV abierta",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}).addStyleClass("solicitudText"),
												new sap.m.isComboBox({
													width: "100%",
													selectedKey: "{LicenseJsonModel>/R500kv}",
													items: {
														path: "SelectModel>/FixedValuesSet",
														filters: [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_LICENCIAS"),
															new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "R500KV")
														],
														template: new sap.ui.core.Item({
															key: "{SelectModel>Valkey}",
															text: "{SelectModel>Valtext}"
														})
													},
													layoutData: new sap.ui.layout.GridData({
														span: "L1 M12 S12"
													}),
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													}
												}).addStyleClass("solicitudInputBorder"),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Requiere alguna Barra F/S",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}).addStyleClass("solicitudText"),
												new sap.m.isComboBox({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													width: "100%",
													change: [oController.enableEspecifyBarra, oController],
													selectedKey: "{LicenseJsonModel>/Barrafs}",
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
												}).addStyleClass("solicitudInputBorder"),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Especificar Barra",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}).addStyleClass("center solicitudText"),
												new sap.m.Input({
													maxLength: 255,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"LicenseJsonModel>/Barrafs", "PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/", oController.enableEspecificarBarra)
													},
													value: "{LicenseJsonModel>/Barrafstx}",
													layoutData: new sap.ui.layout.GridData({
														span: "L1 M12 S12"
													})
												}).addStyleClass("solicitudInputBorder"),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Bloqueo de recierres",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}).addStyleClass("center solicitudText"),
												new sap.m.isComboBox({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
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
												}).addStyleClass("solicitudInputBorder"),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Región/Distrito",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12",
														linebreak: true
													})
												}).addStyleClass("solicitudText"),
												new sap.m.isComboBox({
													//Busy: "{TiposOrdenes>/Busy}",
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/Werks")
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
												}).addStyleClass("solicitudInputBorder"),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "OT",
													layoutData: new sap.ui.layout.GridData({
														span: "L1 M12 S12"
													})
												}).addStyleClass("center LicenciaText"),
												new sap.m.ComboBox({
													busy: "{OrdenesJsonModel>/Busy}",
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado", "LicenseJsonModel>/Werks"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													selectionChange: [oController.OTSelected, oController],
													selectedKey: "{LicenseJsonModel>/Aufnr}",
													layoutData: new sap.ui.layout.GridData({
														span: "L3 M12 S12"
													}),
													items: {
														path: "OrdenesJsonModel>/Ordenes",
														template: new sap.ui.core.Item({
															key: "{OrdenesJsonModel>Orden}",
															text: "{OrdenesJsonModel>Orden} - {OrdenesJsonModel>Descripcion}"
														})
													}
												}).addStyleClass("licenseInputBorder"),
												/*new sap.m.Input({
													maxLength: 12,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													type: sap.m.InputType.Number,
													value: "{LicenseJsonModel>/Aufnr}",
													layoutData: new sap.ui.layout.GridData({
														span: "L1 M12 S12"
													})
												}).addStyleClass("licenseInputBorder"),*/
												new sap.m.Label({
													visible: {
														parts: ["LicenseJsonModel>/Licstat", "LicenseJsonModel>/Tipo", "LicenseJsonModel>/Id"],
														formatter: function (sLicStat, sTipo, Id) {
															if (sLicStat === "30" && sTipo === "S" && Id) {
																return true;
															} else {
																return sLicStat !== "30";
															}
														}
													},
													design: sap.m.LabelDesign.Bold,
													text: "Fecha y Hora de Generación",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M2 S12"
													})
												}),
												//
												new sap.m.Text({
													visible: {
														parts: ["LicenseJsonModel>/Licstat", "LicenseJsonModel>/Tipo", "LicenseJsonModel>/Id"],
														formatter: function (sLicStat, sTipo, Id) {
															if (sLicStat === "30" && sTipo === "S" && Id) {
																return true;
															} else {
																return sLicStat !== "30";
															}
														}
													},
													text: {
														path: "LicenseJsonModel>/Gdate",
														formatter: $.proxy(oController.formatDateWithoutGMT, oController)
													},
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}),
												//bien2

												new sap.m.VBox({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12",
														linebreak: true
													}),
													items: [
														new sap.m.Label({
															design: sap.m.LabelDesign.Bold,
															text: "Solicitante suplente",
														}).addStyleClass("center LicenciaText"),
														new sap.m.isComboBox({
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																	"PermisosJsonModel>/UsuarioEncontrado"
																],
																formatter: oController.rolStatusEdition("general/")
															},
															width: "100%",
															selectedKey: "{LicenseJsonModel>/SolSuplente}",
															items: {
																// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
																path: "PersonalHabilitadoModel>/Solicitante",
																template: new sap.ui.core.Item({
																	key: "{PersonalHabilitadoModel>Legajo}",
																	text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
																})
															},
														}).addStyleClass("licenseInputBorder"),
													]
												}),
												new sap.m.VBox({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													items: [
														new sap.m.Label({
															design: sap.m.LabelDesign.Bold,
															text: "Jefe de trabajo",
														}).addStyleClass("center LicenciaText"),
														new sap.m.isComboBox({
															width: "100%",
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																	"PermisosJsonModel>/UsuarioEncontrado"
																],
																formatter: oController.rolStatusEdition("general/")
															},
															selectedKey: "{LicenseJsonModel>/Jefe}",
															items: {
																// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
																path: "PersonalHabilitadoModel>/JefeDeTrabajo",
																template: new sap.ui.core.Item({
																	key: "{PersonalHabilitadoModel>Legajo}",
																	text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
																})
															},
														}).addStyleClass("licenseInputBorder"),
													]
												}),
												new sap.m.VBox({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													items: [
														new sap.m.Label({
															design: sap.m.LabelDesign.Bold,
															text: "Jefe de trabajo suplente",
														}).addStyleClass("center LicenciaText"),
														new sap.m.isComboBox({
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																	"PermisosJsonModel>/UsuarioEncontrado"
																],
																formatter: oController.rolStatusEdition("general/")
															},
															width: "100%",
															selectedKey: "{LicenseJsonModel>/JefeSuplente}",
															items: {
																// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
																path: "PersonalHabilitadoModel>/JefeDeTrabajo",
																template: new sap.ui.core.Item({
																	key: "{PersonalHabilitadoModel>Legajo}",
																	text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
																})
															},
														}).addStyleClass("licenseInputBorder")
													]
												}),

												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Tipo de intervencion",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}).addStyleClass("center LicenciaText solicitudText"),
												new sap.m.isComboBox({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Tipinterv}",
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
												}).addStyleClass("solicitudInputBorder"),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Periodo del Estacional / Estacional Pendiente",
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													})
												}).addStyleClass("center LicenciaText solicitudText"),
												new sap.m.Input({
													maxLength: 255,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Perestac}",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}).addStyleClass("solicitudInputBorder"),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Descripción del trabajo a realizar",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12",
														linebreak: true
													})
												}).addStyleClass("solicitudText"),
												new sap.m.TextArea({
													maxLength: 255,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Descripcion}",
													height: "200px",
													layoutData: new sap.ui.layout.GridData({
														span: "L10 M12 S12"
													})
												}).addStyleClass("solicitudInputBorder"),
												new sap.m.Label({
													design: sap.m.LabelDesign.Bold,
													text: "Comentarios del solicitante",
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12",
														linebreak: true
													})
												}).addStyleClass("solicitudText"),
												new sap.m.TextArea({
													maxLength: 255,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Solictext}",
													width: "100%",
													layoutData: new sap.ui.layout.GridData({
														span: "L10 M12 S12"
													})
												}).addStyleClass("solicitudInputBorder")
											]
										}).addStyleClass("notPaddingForm")
									]
								}),
								new sap.m.IconTabFilter({
									visible: {
										parts: ["UserJsonModel>/roles", "permisosModel>/"],
										formatter: oController.rolVisualization("medidasSeguridad/")
									},
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://shield",
									text: "Medidas de seguridad",
									content: [
										new sap.ui.layout.form.SimpleForm({
											layout: "ResponsiveGridLayout",
											editable: true,
											content: [
												new sap.m.Button({
													enabled: {
														parts: ["FilterSelectionJsonModel>/visible"],
														formatter: function (visible) {
															return visible
														}
													},
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12",
														indent: "L10"
													}),
													iconFirst: true,
													text: "Esquema Unifilar",
													press: [oController.openUnifilarSchemaList, oController]
												}).addStyleClass("buttonInverted"),
												new sap.m.Text({
													text: "Medidas de seguridad / Codigo de Equipo",
													layoutData: new sap.ui.layout.GridData({
														span: "L12 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													text: "Interruptores Abiertos y en Local / Extraidos"
												}),
												new sap.m.TextArea({
													maxLength: 500,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Interabier}",
													layoutData: new sap.ui.layout.GridData({
														span: "L8 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													text: "Seccionadores Abiertos, Bloqueados y Trabados"
												}).addStyleClass("center"),
												new sap.m.TextArea({
													maxLength: 500,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Seleccionad}",
													layoutData: new sap.ui.layout.GridData({
														span: "L8 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													text: "Seccionadores de PaT Cerrados"
												}).addStyleClass("center"),
												new sap.m.TextArea({
													maxLength: 500,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Intercerr}",
													layoutData: new sap.ui.layout.GridData({
														span: "L8 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													text: "PaT Adicionales(especificar lugar de conexión)"
												}).addStyleClass("center"),
												new sap.m.TextArea({
													maxLength: 500,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Patadic}",
													layoutData: new sap.ui.layout.GridData({
														span: "L8 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													text: "Equipos a Mover / Pruebas Funcionales a Realizar"
												}).addStyleClass("center"),
												new sap.m.TextArea({
													maxLength: 500,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Equimov}",
													layoutData: new sap.ui.layout.GridData({
														span: "L8 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													text: "Bloqueo de Recierres"
												}).addStyleClass("center"),
												new sap.m.TextArea({
													maxLength: 255,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													editable: {
														path: "LicenseJsonModel>/Jobcond",
														formatter: function (Jobcond) {
															if (Jobcond === '01' || Jobcond === '02' || Jobcond === '06') {
																return true
															} else {
																return false
															}
														}
													},
													value: "{LicenseJsonModel>/Bloqueorecierretxt}",
													layoutData: new sap.ui.layout.GridData({
														span: "L8 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													text: "Interruptores que no deben Operarse (sólo para TcT)"
												}).addStyleClass("center"),
												new sap.m.TextArea({
													maxLength: 500,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													editable: {
														path: "LicenseJsonModel>/Jobcond",
														formatter: function (Jobcond) {
															if (Jobcond === '01' || Jobcond === '02' || Jobcond === '06') {
																return true
															} else {
																return false
															}
														}
													},
													value: "{LicenseJsonModel>/Intnooperar}",
													layoutData: new sap.ui.layout.GridData({
														span: "L8 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L4 M12 S12"
													}),
													text: "Otras Precauciones de Seguridad"
												}).addStyleClass("center"),
												new sap.m.TextArea({
													maxLength: 500,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Precauciones}",
													layoutData: new sap.ui.layout.GridData({
														span: "L8 M12 S12"
													})
												}),
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
												}).addStyleClass("center"),
												new sap.m.Select({
													forceSelection: false,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
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
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													}),
													text: "Comentarios"
												}).addStyleClass("center"),
												new sap.m.TextArea({
													maxLength: 2000,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Sindivi}",
													layoutData: new sap.ui.layout.GridData({
														span: "L7 M12 S12"
													})
												}),
												new sap.m.Label({
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													}),
													text: "Señales Afectadas"
												}).addStyleClass("center"),
												new sap.m.CheckBox({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
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
															"PermisosJsonModel>/UsuarioEncontrado"
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
															"PermisosJsonModel>/UsuarioEncontrado"
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
															"PermisosJsonModel>/UsuarioEncontrado"
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
															"PermisosJsonModel>/UsuarioEncontrado"
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
												}).addStyleClass("center"),
												new sap.m.Input({
													maxLength: 2000,
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("general/")
													},
													value: "{LicenseJsonModel>/Senalafect}",
													layoutData: new sap.ui.layout.GridData({
														span: "L10 M12 S12"
													})
												}),
											]
										})
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
													visible: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
														formatter: oController.rolStatusEdition("observacion/botonVerAnulacion")
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
											justifyContent: sap.m.FlexJustifyContent.End,
											items: [
												new sap.m.Text({
													text: "Resultado de la tramitación:"
												}).addStyleClass("sapUiTinyMarginEnd"),
												/*new sap.m.Select({
													forceSelection: false,
													change: [oController.changeStatusTramitacion, oController],
													selectedKey: "{TramitacionStatusModel>/Status}",
													enabled: {
														path: "LicenseJsonModel>/Licstat",
														formatter: function (Licstat) {
															if (Licstat === "07") { // Coordinada
																return false;
															}
															if (Licstat === "06") { // NO Autorizada
																return true;
															}
															if (Licstat === "01") { // Autorizada
																return true;
															}
															if (Licstat === "23") { // En tramite
																return true;
															}
															return false;
														}
													},
													items: [
														new sap.ui.core.Item({
															key: "TA",
															text: "Trámite Autorizado"
														}),
														new sap.ui.core.Item({
															key: "TN",
															text: "Trámite No Autorizado"
														}),
														new sap.ui.core.Item({
															key: "ET",
															text: "En Trámite"
														})
													]
												})*/

												new sap.m.Input({
													value: {
														path: "TramitacionStatusModel>/StatusText"
													},
													enabled: false
												}).addStyleClass("sapUiTinyMarginEnd"),

												new sap.m.Button({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
															"DisableControlsJsonModel>/visibleLic",
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
															"DisableControlsJsonModel>/visibleLic",
															"PermisosJsonModel>/UsuarioEncontrado"
														],
														formatter: oController.rolStatusEdition("tramitacion/")
													},
													text: "Finalizar Tramitación",
													press: [oController.finishTramitacion, oController]
												}).addStyleClass("buttonInverted")
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
													})
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
													})
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
													})
												}),
												new sap.ui.unified.FileUploader({
													enabled: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
														formatter: oController.rolStatusEdition("comentarios/")
													},
													change: [oController.uploadFiles, oController],
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
													layoutData: new sap.ui.layout.GridData({
														span: "L2 M12 S12"
													})
												}).addStyleClass("buttonInverted"),
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
									/*visible: {
										parts: ["UserJsonModel>/roles", "permisosModel>/", "DisableControlsJsonModel>/tabVisibility"],
										formatter: oController.rolVisualization("entregasDevoluciones/")
									},*/
									design: sap.m.IconTabFilterDesign.Horizontal,
									icon: "sap-icon://paper-plane",
									text: "Entregas/Cancelaciones",
									content: [
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
														new sap.m.CheckBox({
															enabled: {
																parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
																	"LicenseJsonModel>/Period"
																],
																formatter: oController.rolStatusEdition("entregas/", oController.setCancelacionDefEnabledDependsPeriod)
															},
															select: [oController.handleFinalCancelation, oController],
															selected: "{= ${LicenseJsonModel>/Period} === 'C' }",
															text: "Cancelación Definitiva",
															layoutData: new sap.ui.layout.GridData({
																span: "L2 M12 S12",
																indent: "L2"
															})
														}),
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