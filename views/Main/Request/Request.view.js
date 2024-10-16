sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.Request.Request", {
	getControllerName: function () {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.License.License";
	},

	createContent: function (oController) {
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
						new sap.m.Select({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"ObservationTableJsonModel>Obsindex",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("observacion/", oController.validateToSend.bind(oController,
									"ObservationTableJsonModel"))
							},
							selectedKey: "{ObservationTableJsonModel>Obscause}",
							// items: [
							// 	new sap.ui.core.Item({
							// 		key: "CAMP",
							// 		text: "Modificación de otros campos"
							// 	})
							// ],
							editable: false,
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
									return Semana + " / " + Anio;
								}
							}
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
		var requestPage = new sap.m.Page({
			title: "Generar Solicitud",
			showNavButton: true,
			navButtonPress: [oController.onBack, oController],
			backgroundDesign: sap.m.PageBackgroundDesign.Solid,
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
			footer: new sap.m.Bar({
				contentLeft: [
					new sap.m.Button({
						icon: "sap-icon://pdf-attachment",
						text: "Exportar Solicitud",
						press: [oController.exportSolicitud, oController],
					}).addStyleClass("buttonInverted"),
				],
				contentRight: [
					//boton crear solicitud / editar solicitud
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
								"LicenseJsonModel>/Equnr",
								"LicenseJsonModel>/Equstat",
								"LicenseJsonModel>/Tplnr",
								"LicenseJsonModel>/Tiemporep",
								"LicenseJsonModel>/Werks",
								"LicenseJsonModel>/Tipinterv",
								"LicenseJsonModel>/Perestac",
								"LicenseJsonModel>/Solictext",
								"LicenseJsonModel>/Estacional",
								"LicenseJsonModel>/Capex",
								"PermisosJsonModel>/UsuarioEncontrado"
							],
							formatter: $.proxy(oController.validateRequest, oController)
						},
						iconFirst: true,
						text: "{FilterSelectionJsonModel>/textFlowSol}",
						press: $.proxy(oController.handleSolLic, oController, "Solicitud")
					}).addStyleClass("buttonInverted"),
					//boton crear licencia
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"DisableControlsJsonModel>/visibleSol"
							],
							formatter: oController.rolStatusEdition("botones/ButtonCreateLicenceFromRequest")
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
								"LicenseJsonModel>/Equnr",
								"LicenseJsonModel>/Equstat",
								"LicenseJsonModel>/Tplnr",
								"LicenseJsonModel>/Tiemporep",
								"LicenseJsonModel>/Werks",
								"LicenseJsonModel>/Tipinterv",
								"LicenseJsonModel>/Perestac",
								"LicenseJsonModel>/Solictext",
								"LicenseJsonModel>/Estacional",
								"LicenseJsonModel>/Capex",
								"PermisosJsonModel>/UsuarioEncontrado"
							],
							formatter: $.proxy(oController.validateRequest, oController)
						},
						iconFirst: true,
						text: "Crear Licencia",
						press: [oController.navToLicense, oController]
					}).addStyleClass("buttonInverted"),
					//boton anular licencia
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"FilterSelectionJsonModel>/annulateCreatedStatus"
							],
							formatter: oController.rolStatusEdition("botones/AnnulateButton")
						},
						text: "Anular",
						press: [oController.dialogAnnulateLicense, oController]
					}).addStyleClass("buttonInverted"),
					//boton enviar a coordinacion
					new sap.m.Button({
						visible: {
							parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
								"DisableControlsJsonModel>/visibleLic",
								"PermisosJsonModel>/UsuarioEncontrado", "EnviarCoordModel>/visibleEnviarCoord"
							],
							formatter: oController.rolStatusEdition("botones/ButtonEditLicenseRequest")
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
								"LicenseJsonModel>/Equnr",
								"LicenseJsonModel>/Equstat",
								"LicenseJsonModel>/Tplnr",
								"LicenseJsonModel>/Tiemporep",
								"LicenseJsonModel>/Werks",
								"LicenseJsonModel>/Tipinterv",
								"LicenseJsonModel>/Perestac",
								"LicenseJsonModel>/Solictext",
								"LicenseJsonModel>/Estacional",
								"LicenseJsonModel>/Capex",
								"PermisosJsonModel>/UsuarioEncontrado"
							],
							formatter: $.proxy(oController.validateRequest, oController)
						},
						icon: "sap-icon://create",
						iconFirst: true,
						text: "Generar Solicitud",
						tooltip: "Enviar a coordinacion",
						press: [oController.sendRequestToCoordination, oController]
					}).addStyleClass("buttonInverted"),
				],

			}),
			content: [
				new sap.ui.layout.form.SimpleForm({
					layout: "ResponsiveGridLayout",
					editable: true,
					content: [
						// new sap.m.Label({
						// 	design: sap.m.LabelDesign.Bold,
						// 	text: "Semana",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L2 M12 S12",
						// 	})
						// }).addStyleClass("solicitudText"),
						// new sap.m.ComboBox({//sap.m.isComboBox({
						// 	//change: [oController.onWorkStationChange, oController],
						// 	/*	enabled: {
						// 			parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
						// 				"PermisosJsonModel>/UsuarioEncontrado"
						// 			],
						// 			formatter: oController.rolStatusEdition("header/")
						// 		},*/
						// 	enabled: false,
						// 	//TODO LUEGO BINDEAR SEMANA 
						// 	selectedKey: "",
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
						// }).addStyleClass("solicitudInputBorder"),

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
						}).addStyleClass("solicitudText"),
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
						}).addStyleClass("solicitudInputBorder"),
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
							/*	visible: {
									parts: ["LicenseJsonModel>/Id", "LicenseJsonModel>/Idsolicitud"],
									formatter: function (sId, sIdSolic) {
										if (sId === "" && sIdSolic === "") {
											return false
										}
										return sId !== "" && sIdSolic !== ""
									}
								},*/
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
						}).addStyleClass("solicitudText"),
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
						}).addStyleClass("solicitudText"),
						new sap.m.ComboBox({
							//Busy: "{TiposOrdenes>/Busy}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("generalReq/Werks")
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
							text: "Puesto de trabajo",
							layoutData: new sap.ui.layout.GridData({
								span: "L5 M12 S12",
							})
						}).addStyleClass("solicitudText"),
						new sap.m.ComboBox({
							//change: [oController.onWorkStationChange, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/")
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
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							})
						}).addStyleClass("solicitudInputBorder"),

						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "E.T",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							change: $.proxy(oController.changeUbicacion, oController, "Licencia"),
							//change: [oController.changeUbicacion, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/ET")
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
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Solicitante",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								indent: "L1"
							})
						}).addStyleClass("solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							width: "100%",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/")
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
							design: sap.m.LabelDesign.Bold,
							text: "Equipo Solicitado Cammesa",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							selectedKey: "{LicenseJsonModel>/Equnr}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"FilterSelectionJsonModel>/enabledComboEQUIPO", "PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/Equnr")
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
							text: "Estado Equipo CAMMESA",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								indent: "L1"
							})
						}).addStyleClass("center solicitudText"),
						new sap.m.Select({
							change: [oController.onCammesaStateChange, oController],
							selectedKey: "{LicenseJsonModel>/Equstat}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/")
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
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Equipo/s a Intervenir",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true
							})
						}).addStyleClass("solicitudText"),
						new sap.m.TextArea({
							height: "45px",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/")
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							maxLength: 100,
							value: "{LicenseJsonModel>/Equiinterv}",
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Estado Equipo/s a intervenir",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								indent: "L1"
							})
						}).addStyleClass("center solicitudText"),
						new sap.m.Select({
							selectedKey: "{LicenseJsonModel>/Equstatnocam}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/")
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
						}).addStyleClass("solicitudInputBorder"),
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
						}).addStyleClass("solicitudText"),
						new sap.m.TextArea({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("generalReq/")
							},
							value: "{LicenseJsonModel>/Descripcion}",
							height: "120px",
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
							height: "120px",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("generalReq/")
							},
							value: "{LicenseJsonModel>/Solictext}",
							layoutData: new sap.ui.layout.GridData({
								span: "L10 M12 S12"
							})
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							textAlign: sap.ui.core.TextAlign.Left,
							design: sap.m.LabelDesign.Bold,
							text: "Inicio",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("solicitudText"),
						new sap.m.DatePicker({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									/*"DisableControlsJsonModel>/enabled", */
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								//el usuario que puede editar la observacion es el mismo que crea la licencia/solicitud
								formatter: oController.rolStatusEdition("headerReq/")
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
								formatter: oController.rolStatusEdition("headerReq/")
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
							selectedIndex: 0,
							select: [oController.handlePeriod, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/")
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
						}).addStyleClass("solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							selectedKey: "{LicenseJsonModel>/Tiemporep}",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/")
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
								formatter: oController.rolStatusEdition("headerReq/")
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
								formatter: oController.rolStatusEdition("headerReq/")
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
						}).addStyleClass("buttonInverted"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Condiciones de trabajo",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
						}).addStyleClass("center solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							}),
							//	width: "100%",
							//	height: "45px",
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/")
							},
							selectedKey: "{LicenseJsonModel>/Jobcond}",
							valueState: "{LicenseJsonModel>/JobcondState}",
							valueStateText: "{LicenseJsonModel>/JobcondStateMessage}",
							items: {
								path: "SelectModel>/FixedValuesSet",
								filters: [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_LICENCIAS"),
									new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "JOBCOND")
								],
								template: new sap.ui.core.Item({
									key: "{SelectModel>Valkey}",
									text: "{SelectModel>Valtext}"
								})
							},
							/*items: [
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
								
							]*/
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Tipo de intervencion",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
								linebreak: true,
							})
						}).addStyleClass("center LicenciaText solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("generalReq/")
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
						// new sap.m.Label({
						// 	design: sap.m.LabelDesign.Bold,
						// 	text: "Periodo del Estacional / Estacional Pendiente",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L4 M12 S12",
						// 	})
						// }).addStyleClass("center LicenciaText solicitudText"),
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
						// }).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Estacional",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
							})
						}).addStyleClass("center LicenciaText solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("generalReq/")
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
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "CAPEX",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12",
							})
						}).addStyleClass("center LicenciaText solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("generalReq/")
							},
							selectedKey: "{LicenseJsonModel>/Capex}",
							layoutData: new sap.ui.layout.GridData({
								span: "L4 M12 S12"
							}),
							items: [
								new sap.ui.core.Item({
									key: "N",
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
							],
						}).addStyleClass("solicitudInputBorder"),
						// new sap.m.Label({
						// 	design: sap.m.LabelDesign.Bold,
						// 	text: "Comentarios del solicitante",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L2 M12 S12",
						// 		linebreak: true
						// 	})
						// }).addStyleClass("solicitudText"),
						// new sap.m.TextArea({
						// 	height: "120px",
						// 	enabled: {
						// 		parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
						// 			"PermisosJsonModel>/UsuarioEncontrado"
						// 		],
						// 		formatter: oController.rolStatusEdition("generalReq/")
						// 	},
						// 	value: "{LicenseJsonModel>/Solictext}",
						// 	layoutData: new sap.ui.layout.GridData({
						// 		span: "L10 M12 S12"
						// 	})
						// }).addStyleClass("solicitudInputBorder"),
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
						}).addStyleClass("solicitudText"),
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
								formatter: oController.rolStatusEdition("generalReq/")
							}
						}).addStyleClass("solicitudInputBorder"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Requiere alguna Barra F/S",
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12"
							})
						}).addStyleClass("solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("generalReq/")
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
						}).addStyleClass("solicitudInputBorder sapUiSmallMarginBottom"),
						new sap.m.Label({
							design: sap.m.LabelDesign.Bold,
							text: "Riesgo de disparo",
							layoutData: new sap.ui.layout.GridData({
								span: "L2 M12 S12"
							})
						}).addStyleClass("solicitudText"),
						new sap.m.ComboBox({ //sap.m.isComboBox({
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado"
								],
								formatter: oController.rolStatusEdition("headerReq/")
							},
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12"
							}),
							forceSelection: false,
							selectedKey: "{LicenseJsonModel>/Rdisparo}",
							items: [
								new sap.ui.core.Item({
									key: "N",
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
						new sap.m.Label({
							visible: "{FilterSelectionJsonModel>/enabledEspecifyBarra}",
							design: sap.m.LabelDesign.Bold,
							text: "Especificar Barra",
							layoutData: new sap.ui.layout.GridData({
								span: "L3 M12 S12",
								linebreak: true
							})
						}).addStyleClass("solicitudText"),
						new sap.m.Input({
							visible: "{FilterSelectionJsonModel>/enabledEspecifyBarra}",
							maxLength: 255,
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"LicenseJsonModel>/Barrafs", "PermisosJsonModel>/UsuarioEncontrado", "FilterSelectionJsonModel>/enabledEspecifyBarra"
								],
								formatter: oController.rolStatusEdition("generalReq/", oController.enableEspecificarBarra)
							},
							value: "{LicenseJsonModel>/Barrafstx}",
							layoutData: new sap.ui.layout.GridData({
								span: "L1 M12 S12"
							})
						}).addStyleClass("solicitudInputBorder sapUiSmallMarginBottom"),
						new sap.m.IconTabBar({
							visible: "{FilterSelectionJsonModel>/visible}",
							headerMode: sap.m.IconTabHeaderMode.InLine,
							layoutData: new sap.ui.layout.GridData({
								span: "L12 M12 S12"
							}),
							items: [
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
													visible: {
														parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks"],
														formatter: oController.rolStatusEdition("observacion/botonVerAnulacion")
													},
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
							]
						}).addStyleClass("textTabBarWidth sapUiSmallMarginTop")
					]
				})
			]
		});
		return requestPage;
	}

})