// DESARROLLADO POR  ING HECTOR ZEA 
sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.Main", {

			getControllerName: function () {
				return "Transener.Operaciones.LicenciasTrabajo.views.Main.Main";
			},

			createContent: function (oController) {
				//pagedd
				var oLicenseTable = new sap.m.Table({
					sticky: [sap.m.Sticky.ColumnHeaders],
					id: this.createId("auditTable"),
					itemPress: [oController.handleItemPress, oController],
					fixedLayout: false,
					noDataText: "{i18n>NoAuditoriaDataAvailable}",
					busy: "{LicenciaData>/Busy}",
					growing: true,
					growingThreshold: 20,
					growingScrollToLoad: false,
					mode: sap.m.ListMode.MultiSelect,
					busyIndicatorDelay: 0,
					visible: {
						parts: [{
							path: "Device>/system"
						}],
						formatter: function (deviceSystem) {
							return (deviceSystem.desktop);
						}
					},
					columns: [
						new sap.m.Column({
							width: "250px",
							header: new sap.m.Text({
								text: "N°"
							}),
						}),
						new sap.m.Column({
							width: "50px"
						}),
						new sap.m.Column({
							width: "90px",
							hAlign: sap.ui.core.TextAlign.Center,
							header: new sap.m.Text({
								text: "{i18n>ET}"
							})
						}),
						new sap.m.Column({
							width: "180px",
							hAlign: sap.ui.core.TextAlign.Center,
							header: new sap.m.Text({
								text: "Eq. Sol. CAMMESA"
							})
						}),
						new sap.m.Column({
							width: "160px",
							hAlign: sap.ui.core.TextAlign.Center,
							header: new sap.m.Text({
								text: "Est. Eq. CAMMESA"
							})
						}),
						new sap.m.Column({
							width: "120px",
							hAlign: sap.ui.core.TextAlign.Center,
							header: new sap.m.Text({
								text: "B. Recierre"
							})
						}),
						new sap.m.Column({
							width: "400px",
							hAlign: sap.ui.core.TextAlign.Center,
							header: new sap.m.Text({
								text: "Puesto de Trabajo"
							})
						}),
						new sap.m.Column({
							hAlign: sap.ui.core.TextAlign.Center,
							header: new sap.m.Text({
								text: "Fecha Inicio"
							})
						}).setStyleClass("W10Percent"),
						new sap.m.Column({
							hAlign: sap.ui.core.TextAlign.Center,
							header: new sap.m.Text({
								text: "Fecha Fin"
							})
						}).setStyleClass("W10Percent"),
						new sap.m.Column({
							width: "150px",
							hAlign: sap.ui.core.TextAlign.Center,
							header: new sap.m.Text({
								text: "Diario / Continuo"
							})
						}),
						new sap.m.Column({
							width: "170px",
							hAlign: sap.ui.core.TextAlign.Center,
							header: new sap.m.Text({
								text: "Estado"
							})
						}),
						new sap.m.Column({})
					],
					items: {
						path: "LicencesListJsonModel>/Licenses",
						factory: function (sId, oContext) {
						  var oItem = new sap.m.ColumnListItem({
							highlight:"{LicencesListJsonModel>highlight}",
							type: sap.m.ListType.Navigation,
							press: [oController.onSelect, oController],
							cells: [
							  new sap.m.Text({ text: "{LicencesListJsonModel>Id}" }),
					  
							  new sap.ui.core.Icon({
								src: {
								  path: "LicencesListJsonModel>Tipo",
								  formatter: function (sTipoDoc) {
									if (sTipoDoc === "L") {
									  this.addStyleClass("isLicense");
									  this.removeStyleClass("isRequest");
									  return "sap-icon://form";
									} else {
									  this.addStyleClass("isRequest");
									  this.removeStyleClass("isLicense");
									  return "sap-icon://request";
									}
								  }
								}
							  }),
					  
							  new sap.m.Text({
								textAlign: sap.ui.core.TextAlign.Center,
								text: "{LicencesListJsonModel>Tplnr}"
							  }),
							  new sap.m.Text({
								textAlign: sap.ui.core.TextAlign.Center,
								text: "{LicencesListJsonModel>Equnr}"
							  }),
							  new sap.m.Text({
								textAlign: sap.ui.core.TextAlign.Center,
								text: "{LicencesListJsonModel>EqustatText}"
							  }),
							  new sap.m.Text({ text: "{LicencesListJsonModel>BloqueoText}" }),
							  new sap.m.Text({ text: "{LicencesListJsonModel>ArbplDesc}" }),
					  
							  new sap.m.Text({
								text: {
								  parts: ["LicencesListJsonModel>Solbeg", "LicencesListJsonModel>Timbeg"],
								  formatter: $.proxy(oController.formatDate, oController)
								}
							  }),
					  
							  new sap.m.Text({
								text: {
								  parts: ["LicencesListJsonModel>Solend", "LicencesListJsonModel>Timend"],
								  formatter: $.proxy(oController.formatDate, oController)
								}
							  }),
					  
							  new sap.m.Text({ text: "{LicencesListJsonModel>PeriodoText}" }),
					  
							  new sap.m.Text({
								text: {
								  parts: ["LicencesListJsonModel>Licstat", "LicencesListJsonModel>Substatus"],
								  formatter: oController.setStatusColor
								}
							  }),
					  
							  new sap.m.HBox({
								items: [
								  new sap.m.Button({
									tooltip: {
									  path: "LicencesListJsonModel>Tipo",
									  formatter: function (sTipo) {
										return sTipo === "S" ? "Entrar Solicitud" : "Entrar Licencia";
									  }
									},
									icon: "sap-icon://arrow-right",
									press: [oController.goToEdit, oController]
								  }).addStyleClass("buttonInverted sapUiTinyMarginEnd"),
					  
								  new sap.m.Button({
									visible: {
									  parts: ["LicencesListJsonModel>ValidForDuplicate"],
									  formatter: (bValid) => bValid
									},
									tooltip: "Duplicar",
									icon: "sap-icon://duplicate",
									press: [oController.duplicateLicense, oController]
								  }).addStyleClass("buttonInverted")
								]
							  })
							]
						  });
					  
						  // 👉 Estilo condicional para toda la fila
						  var sHighlight = oContext.getProperty("highlight");
						  if (sHighlight === "Warning") {
							oItem.addStyleClass("rowHighlightWarning");
						  } else if (sHighlight === "Error") {
							oItem.addStyleClass("rowHighlightError");
						  } else if (sHighlight === "Success") {
							oItem.addStyleClass("rowHighlightSuccess");
						  }
					  
						  return oItem;
						}
					  }
					  
				}).addStyleClass("customTable shortTable");
				oController.setLicenseTable(oLicenseTable);

				var mainPage = new sap.m.Page({
							title: "{i18n>title}",
							floatingFooter: false,
							enableScrolling: false,
							showHeader: false,
							footer: new sap.m.Bar({
								contentLeft: [
									new sap.m.MenuButton({
										text: "Reportes",
										menu: new sap.m.Menu({
											items: [
												new sap.m.MenuItem({
													icon: "sap-icon://doc-attachment",
													text: "Solicitud de acuerdo",
													press: [oController.solicitudAcuerdoExport, oController]
												}),
												new sap.m.MenuItem({
													icon: "sap-icon://excel-attachment",
													text: "Programación semanal (reunion CAMMESA)",
													press: [oController.handleSemanalCammesa, oController]
												}),
												new sap.m.MenuItem({
													icon: "sap-icon://excel-attachment",
													text: "Comparación de licencias.",
													press: [oController.reportLicenseComparison, oController]
												}),
												new sap.m.MenuItem({
													icon: "sap-icon://pdf-attachment",
													text: "Parte Diario de LT autorizadas.",
													press: [oController.handleDiaryPartLT, oController]
												}),
												new sap.m.MenuItem({
													icon: "sap-icon://excel-attachment",
													text: "Parte de Trabajos Diario y Semanal.",
													press: [oController.handleWorkReportCammesa, oController]
												}),
												new sap.m.MenuItem({
													icon: "sap-icon://pdf-attachment",
													text: "Reporte de Licencias.",
													press: [oController.downloadLicenses, oController]
												}),
												new sap.m.MenuItem({
													icon: "sap-icon://pdf-attachment",
													text: "Exportar Solicitudes y Licencias",
													press: [oController.exportMultipleLics, oController]
												})
											]
										})
									}).addStyleClass("buttonInverted"),
									new sap.m.Button({
										iconFirst: true,
										text: "{i18n>goToGantt}",
										press: [oController.goToGantt, oController]
									}).addStyleClass("buttonInverted"),
									new sap.m.SegmentedButton({
										items: [
											new sap.m.SegmentedButtonItem({
												text: "Vista Original",
												key: "0",
												press: [oController.makeFilters, oController]
											}).addStyleClass("buttonInverted"),
											new sap.m.SegmentedButtonItem({
												text: "LTs de Equipos de EETT",
												key: "1",
												press: [oController.makeFilters, oController]
											}).addStyleClass("buttonInverted"),
											new sap.m.SegmentedButtonItem({
												text: "Salidas y Líneas",
												key: "2",
												press: [oController.makeFilters, oController]
											}).addStyleClass("buttonInverted")
										]
									}).addStyleClass("buttonInverted")
								],
								contentRight: [
									new sap.m.Button({
										visible: {
											parts: ["UserJsonModel>/roles", "permisosModel>/", "CurrentUser>/Region"],
											//uso el mismo que el boton del listado principal
											formatter: oController.rolVisualization("listado/BotonSolicitudListado")
										},
										customData: {
											key: "type",
											value: "S"
										},
										icon: "sap-icon://create",
										iconFirst: true,
										text: "Crear Solicitud",
										tooltip: "Crear Solicitud",
										press: [oController.handleViewType, oController]
									}).addStyleClass("buttonInverted"),
									new sap.m.Button({
										enabled: {
											parts: ["UserJsonModel>/roles", "permisosModel>/"],
											//uso el mismo que el boton del listado principal
											formatter: oController.rolVisualization("listado/BotonLicenciaListado")
										},
										customData: {
											key: "type",
											value: "L"
										},
										icon: "sap-icon://create",
										iconFirst: true,
										text: "Crear Licencia",
										tooltip: "Crear Licencia",
										press: [oController.handleViewType, oController]
									}).addStyleClass("buttonInverted"),
									new sap.m.Button({
										icon: "sap-icon://create-form",
										iconFirst: true,
										text: "Tramitacion Masiva",
										tooltip: "Tramitacion Masiva",
										enabled: {
											parts: ["UserJsonModel>/roles", "permisosModel>/"],
											//uso el mismo que el boton del listado principal
											formatter: oController.rolEdition("listado/tramitacionMasiva")
										},
										visible: {
											parts: ["UserJsonModel>/roles", "permisosModel>/"],
											//uso el mismo que el boton del listado principal
											formatter: oController.rolVisualization("listado/tramitacionMasiva")
										},
										press: [oController.openMassiveTramitationAddCompanyDialog, oController]
									}).addStyleClass("buttonInverted")

								]
							}),
							content: [
								new sap.m.VBox({
									height: "100%",
									items: [
										new sap.m.Panel({
												headerToolbar: new sap.m.Toolbar({
														content: [
															new sap.ui.core.Icon({
																src: "sap-icon://filter"
															}),
															new sap.m.Text({
																text: "Filtrar licencias",
																customData: {
																	Type: "sap.ui.core.CustomData",
																	key: "colorFiltrar",
																	value: {
																		parts: ["ColorModel>/Color"],
																		formatter: function (Color) {
																			return Color;
																		}
																	},
																	writeToDom: true
																}
															}).addStyleClass("textJaja"),
															new sap.m.ToolbarSpacer(),
															new sap.m.Text({
																text: "Sociedad: {AlternativeLabel>/Sociedad} ID UT: {AlternativeLabel>/AlternativeLabel}"
															})]
														}).addStyleClass("filterToolbar"),
													expandable: true,
													content: [
														new sap.ui.layout.form.SimpleForm({
															layout: "ResponsiveGridLayout",
															editable: true,
															content: [
																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "Región",
																	layoutData: new sap.ui.layout.GridData({
																		span: "L2 M12 S12"
																	})
																}),
																new sap.m.ComboBox({
																	placeholder: "Región",
																	selectedKey: "{FiltersJsonModel>/Werks/value}",
																	items: {
																		path: "RegionesJsonModel>/Regiones",
																		template: new sap.ui.core.Item({
																			key: "{RegionesJsonModel>Werks}",
																			text: "{RegionesJsonModel>Name1}"
																		})
																	},
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12"
																	}),
																	selectionChange: oController.loadGrupoPlanificador
																}).addStyleClass("colorIconBlue"),
																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "Fecha desde",
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12",
																		indent: "L1"
																	})
																}),
																new sap.m.DatePicker({
																	//enabled: "{= !${LocalFilterJsonModel>/WeekNumber}}"
																	enabled: {
																		parts: ["LocalFilterJsonModel>/WeekNumber", "LocalFilterJsonModel>/Solbeg2"],
																		formatter: function (WeekNumber, Solbeg2) {
																			if (WeekNumber || Solbeg2) {
																				return false;
																			} else {
																				return true;
																			}
																		}
																	},
																	dateValue: "{LocalFilterJsonModel>/Solbeg}",
																	id: "dPSolbeg",
																	displayFormat: "dd-MM-yyyy",
																	placeholder: "Desde",
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12"
																	})
																}).addStyleClass("colorIconBlue"),
																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "E.T",
																	layoutData: new sap.ui.layout.GridData({
																		linebreak: true,
																		span: "L2 M12 S12"
																	})
																}),
																new sap.m.MultiComboBox({
																	selectionChange: [oController.changeUbicacion, oController],
																	selectedKeys: "{FiltersJsonModel>/Tplnr/value}",
																	items: {
																		path: "EstacionesJsonModel>/Estaciones",
																		template: new sap.ui.core.Item({
																			key: "{EstacionesJsonModel>Codigo}",
																			text: "{EstacionesJsonModel>Codigo} - {EstacionesJsonModel>Descripcion}"
																		})
																	},
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12"
																	})
																}).addStyleClass("colorIconBlue"),
																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "Fecha hasta",
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12",
																		indent: "L1"
																	})
																}),
																new sap.m.DatePicker({
																	enabled: {
																		parts: ["LocalFilterJsonModel>/WeekNumber", "LocalFilterJsonModel>/Solbeg2"],
																		formatter: function (WeekNumber, Solbeg2) {
																			if (WeekNumber || Solbeg2) {
																				return false;
																			} else {
																				return true;
																			}
																		}
																	},
																	dateValue: "{LocalFilterJsonModel>/Solend}",
																	displayFormat: "dd-MM-yyyy",
																	id: "dPSolend",
																	placeholder: "Hasta",
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12"
																	})
																}).addStyleClass("colorIconBlue"),
																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "Equipo Solicitado CAMMESA",
																	layoutData: new sap.ui.layout.GridData({
																		linebreak: true,
																		span: "L2 M12 S12"
																	})
																}),
																new sap.m.ComboBox({
																	enabled: {
																		parts: ["EnabledFilterLicstat>/enabled", "FilterSelectionJsonModel>/enabledComboEQUIPO"],
																		formatter: function (enabled, ComboEquipo) {
																			return enabled && ComboEquipo
																		}
																	},
																	selectedKey: "{FiltersJsonModel>/Equnr/value}",
																	items: {
																		path: "EquiposJsonModel>/Equipos",
																		template: new sap.ui.core.Item({
																			key: "{EquiposJsonModel>CodigoEquipo}",
																			text: "{EquiposJsonModel>CodigoEquipo} - {EquiposJsonModel>DescEquipo}"
																		})
																	},
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12"
																	})
																}).addStyleClass("colorIconBlue"),
																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "Semana",
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12",
																		indent: "L1"
																	})
																}),
																new sap.m.Input({
																	enabled: {
																		parts: ["LocalFilterJsonModel>/Solbeg", "LocalFilterJsonModel>/Solend", "LocalFilterJsonModel>/Solbeg2",
																			"EnabledFilterLicstat>/enabled"
																		],
																		formatter: function (fechaInicio, fechaFin, fechaInicio2, enabled) {
																			if (fechaInicio || fechaFin || fechaInicio2) {
																				return false;
																			} else {
																				return true && enabled;
																			}
																		}
																	},
																	value: "{LocalFilterJsonModel>/WeekNumber}",
																	type: sap.m.InputType.Number,
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12"
																	})
																}),
																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "Estado Equipo CAMMESA",
																	layoutData: new sap.ui.layout.GridData({
																		linebreak: true,
																		span: "L2 M12 S12",
																	})
																}),
																new sap.m.ComboBox({
																	selectedKey: "{FiltersJsonModel>/Equstat/value}",
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
																}).addStyleClass("colorIconBlue"),
																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "Año",
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12",
																		indent: "L1"
																	})
																}),
																new sap.m.Input({
																	enabled: "{= !${LocalFilterJsonModel>/Solbeg2} && ${EnabledFilterLicstat>/enabled} }",
																	value: "{FiltersJsonModel>/Anio/value}",
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12"
																	})
																}),

																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "Estado",
																	layoutData: new sap.ui.layout.GridData({
																		linebreak: true,
																		span: "L2 M12 S12"
																	})
																}),
																new sap.m.MultiComboBox({
																	selectionChange: [oController.blockFilters, oController],
																	width: "100%",
																	selectedKeys: "{FiltersJsonModel>/Licstat/value}",
																	items: {
																		path: "StatusModel>/statuses",
																		//o lo llevamos a un archivo separado
																		template: new sap.ui.core.Item({
																			key: "{StatusModel>key}",
																			text: "{StatusModel>text}"
																		})
																	},
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12"
																	})
																}).addStyleClass("colorIconBlue"),
																new sap.m.Label({
																	design: sap.m.LabelDesign.Bold,
																	text: "Fecha de Inicio",
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12",
																		indent: "L1"
																	})
																}),
																new sap.m.DatePicker({
																	enabled: {
																		parts: [
																			"LocalFilterJsonModel>/Solbeg", "LocalFilterJsonModel>/Solend", "LocalFilterJsonModel>/WeekNumber",
																			"FiltersJsonModel>/Anio/value", "EnabledFilterLicstat>/enabled"
																		],
																		formatter: function (Solbeg, Solend, WeekNumber, Anio, enabled) {
																			if (Solbeg || Solend || WeekNumber || Anio) {
																				return false;
																			} else {
																				return true && enabled;
																			}
																		}
																	},
																	dateValue: "{LocalFilterJsonModel>/Solbeg2}",
																	displayFormat: "dd-MM-yyyy",
																	placeholder: 'Seleccionar Fecha',
																	layoutData: new sap.ui.layout.GridData({
																		span: "L3 M12 S12"
																	})
																}).addStyleClass("colorIconBlue"),
																new sap.m.Button({
																	enabled: "{EnabledFilterLicstat>/enabled}",
																	icon: "sap-icon://add-filter",
																	text: "Filtros avanzados",
																	tooltip: "Filtros avanzados",
																	press: [oController.openAdvancedFilters, oController],
																	layoutData: new sap.ui.layout.GridData({
																		linebreak: true,
																		span: "L2 M2 S12",
																		indent: "L10"
																	})
																}).addStyleClass("buttonInverted")
															]
														})
													]
												}).addStyleClass("FilterPanel"),
											new sap.m.HBox({
												alignContent: sap.m.FlexAlignContent.SpaceAround,
												items: [
													new sap.m.HBox({
														width: "50%",
														items: [
															new sap.ui.core.Icon({
																src: "sap-icon://request",
															}).addStyleClass("mTop15 floatRightBefore isRequest"),
															new sap.m.CheckBox({
																text: "Solicitudes",
																selected: "{FilterSelectionJsonModel>/checkedSol}",
																select: [oController.changedChecks, oController],
																layoutData: new sap.ui.layout.GridData({
																	span: "L1 M1 S12"
																})
															}).addStyleClass("bold paddingLeftMinus25 overflowVisible"),
															new sap.ui.core.Icon({
																src: "sap-icon://form",
																layoutData: new sap.ui.layout.GridData({
																	span: "L1 M1 S12"
																})
															}).addStyleClass("mTop15 floatRightBefore isLicense sapUiSmallMarginBegin"),
															new sap.m.CheckBox({
																text: "Licencias",
																selected: "{FilterSelectionJsonModel>/checkedLic}",
																select: [oController.changedChecks, oController],
																layoutData: new sap.ui.layout.GridData({
																	span: "L1 M1 S12"
																})
															}).addStyleClass("bold paddingLeftMinus25 overflowVisible"),
															new sap.m.Input({
																liveChange: [oController.fastSearch, oController],
																placeholder: "Busqueda rapida",
																value: "{RapidSearchJsonModel>/searchCriteria}"
															}).addStyleClass("sapUiTinyMarginBegin licenseInputBorder"),
															new sap.m.Button({
																icon: {
																	path: "OrderNumberJsonModel>/Odering",
																	formatter: function (Odering) {
																		return Odering === "up" ? "sap-icon://arrow-top" : "sap-icon://arrow-bottom";
																	}
																},
																press: [oController.sorterLicenses, oController],
																layoutData: new sap.ui.layout.GridData({
																	span: "L2 M2 S12"
																})
															}).addStyleClass("btnOrdenNumber")
														]
													}).addStyleClass("sapUiTinyMarginBegin"),
													new sap.m.HBox({
														justifyContent: sap.m.FlexJustifyContent.End,
														width: "50%",
														items: [
															new sap.m.Button({
																id: "searchButtonMain",
																icon: "sap-icon://search",
																text: "{i18n>Search}",
																tooltip: "{i18n>Search}",
																press: [oController.makeFilters, oController],
																layoutData: new sap.ui.layout.GridData({
																	span: "L2 M2 S12"
																})
															}).addStyleClass("buttonInverted sapUiTinyMarginEnd"),
															new sap.m.Button({
																icon: "sap-icon://clear-filter",
																text: "Limpiar Filtros",
																tooltip: "Limpiar Filtros",
																type: sap.m.ButtonType.Emphasized,
																press: [oController.onCleanFilters, oController],
																layoutData: new sap.ui.layout.GridData({
																	span: "L2 M2 S12"
																})
															}).addStyleClass("buttonInverted"),
															new sap.m.Button({
																icon: "sap-icon://refresh",
																tooltip: "Refrescar",
																type: sap.m.ButtonType.Emphasized,
																press: [oController.makeFilters, oController],
																layoutData: new sap.ui.layout.GridData({
																	span: "L2 M2 S12"
																})
															}).addStyleClass("buttonInverted sapUiTinyMarginBeginEnd")
														]
													})
												]
											}).addStyleClass("sapUiTinyMarginTopBottom"),
											new sap.m.ScrollContainer({
												vertical: true,
												height: "100%",
												layoutData: new sap.m.FlexItemData({
													growFactor: 5,
													baseSize: "0",
													styleClass: "overflowAuto"
												}),
												content: [
													oLicenseTable
												]
											}).addStyleClass("tableContainer"),
											new sap.m.Panel({
												busy: "{FilterSelectionJsonModel>/busyData}",
												layoutData: new sap.m.FlexItemData({
													growFactor: 3,
													baseSize: "0",
													styleClass: "overflowAuto"
												}),
												id: this.createId("jobDescriptionPanel"),
												content: [
													new sap.m.Text({
														text: "Detalle: "
													}).addStyleClass("sapUiTinyMarginTopBottom titleColor"),
													new sap.m.Text({
														text: "{LicenseIdModel>/Id}"
													}).addStyleClass("sapUiTinyMarginBegin titleColor"),
													new sap.m.HBox({
														id: this.createId("jobDescriptionPanelHBox")
													}),
													new sap.m.Text({
														text: "Entregas y Devoluciones"
													}).addStyleClass("sapUiTinyMarginTopBottom titleColor"),
													new sap.m.Table({
														noDataText: "No hay entregas y devoluciones",
														columns: [
															new sap.m.Column({
																header: new sap.m.Text({
																	text: "Fecha Entrega"
																})
															}),
															new sap.m.Column({
																header: new sap.m.Text({
																	text: "Hora Entrega"
																})
															}),
															new sap.m.Column({
																header: new sap.m.Text({
																	text: "Fecha Devolución"
																})
															}),
															new sap.m.Column({
																header: new sap.m.Text({
																	text: "Hora Devolución"
																})
															})
														],
														items: {
															path: "DeliveryDevolutionTable>/DeliveryDevolutions",
															template: new sap.m.ColumnListItem({
																cells: [
																	new sap.m.Text({
																		text: {
																			path: "DeliveryDevolutionTable>FechaEntrega",
																			formatter: function (date) {
																				if (date) {
																					var tempDate = new Date(date.getTime() - 3 * 3600 * 1000);
																					return tempDate.toISOString().slice(0, 10);
																				}
																			}
																		}
																	}),
																	new sap.m.Text({
																		text: {
																			path: "DeliveryDevolutionTable>HoraEntrega",
																			formatter: $.proxy(oController.formatTime, oController)
																		}
																	}),
																	new sap.m.Text({
																		text: {
																			path: "DeliveryDevolutionTable>FechaDevolucion",
																			formatter: function (date) {
																				if (date) {
																					var tempDate = new Date(date.getTime() - 3 * 3600 * 1000);
																					return tempDate.toISOString().slice(0, 10);
																				}
																			}
																		}
																	}),
																	new sap.m.Text({
																		text: {
																			path: "DeliveryDevolutionTable>HoraDevolucion",
																			formatter: $.proxy(oController.formatTime, oController)
																		}
																	})
																]
															})
														}
													}),
													new sap.m.Text({
														text: "Horarios"
													}).addStyleClass("sapUiTinyMarginTopBottom titleColor"),
													new sap.m.Table({
														visible: "{= ${LicenseJsonModel>/HorariosPorLicencia_nav/length} !== 0}",
														columns: [
															new sap.m.Column({
																header: new sap.m.Text({
																	text: "Fecha"
																})
															}),
															new sap.m.Column({
																header: new sap.m.Text({
																	text: "Hora Inicio"
																})
															}),
															new sap.m.Column({
																header: new sap.m.Text({
																	text: "Hora Fin"
																})
															})
														],
														items: {
															path: "LicenseJsonModel>/HorariosPorLicencia_nav",
															template: new sap.m.ColumnListItem({
																cells: [
																	new sap.m.Text({
																		text: {
																			path: "LicenseJsonModel>Fecha",
																			formatter: function (date) {
																				if (date) {
																					var tempDate = new Date(date.getTime() - 3 * 3600 * 1000);
																					return tempDate.toISOString().slice(0, 10);
																				}
																			}
																		}
																	}),
																	new sap.m.Text({
																		text: {
																			path: "LicenseJsonModel>Horainicio",
																			formatter: $.proxy(oController.formatTimeWithoutUtc, oController)
																		}
																	}),
																	new sap.m.Text({
																		text: {
																			path: "LicenseJsonModel>Horafin",
																			formatter: $.proxy(oController.formatTimeWithoutUtc, oController)
																		}
																	})
																]
															})
														}
													}),
													new sap.m.HBox({
														visible: "{= ${LicenseJsonModel>/HorariosPorLicencia_nav/length} === 0}",
														justifyContent: sap.m.FlexJustifyContent.SpaceAround,
														items: [
															new sap.m.Label({
																text: "Desde:"
															}),
															new sap.m.Text({
																text: {
																	parts: ["LicenseJsonModel>/Solbeg", "LicenseJsonModel>/Timbeg"],
																	formatter: oController.formatDateTime
																}
															}),
															new sap.m.Label({
																text: "Hasta:"
															}),
															new sap.m.Text({
																text: {
																	parts: ["LicenseJsonModel>/Solend", "LicenseJsonModel>/Timend"],
																	formatter: oController.formatDateTime
																}
															})
														]
													})
												]
											})

										]
									}).addStyleClass("sapUiTinyMargin")]
							});
						return mainPage;
					},

					_getFiltersControls: function (oController) {
						return [
							new sap.ui.layout.form.FormElement({
								label: new sap.m.Label({
									text: "{i18n>ValidityDate}",
									layoutData: new sap.ui.layout.GridData({
										span: "L6 M6 S12",
										visibleOnSmall: false
									})
								}),
								fields: [
									new sap.m.DatePicker({
										dateValue: "{AuditoriaFilters>/DocumentDateFrom}",
										displayFormat: "dd/MM/yyyy",
										placeholder: "{i18n>From}",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M3 S6"
										})
									})
								]
							}),
							new sap.ui.layout.form.FormElement({
								fields: [
									new sap.m.DatePicker({
										dateValue: "{AuditoriaFilters>/DocumentDateTo}",
										displayFormat: "dd/MM/yyyy",
										placeholder: "{i18n>To}",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M3 S6"
										})
									})
								]
							}),
							new sap.ui.layout.form.FormElement({
								label: new sap.m.Label({
									text: "{i18n>DocumentNumber}",
									layoutData: new sap.ui.layout.GridData({
										span: "L6 M6 S12",
										visibleOnSmall: false
									})
								}),
								fields: [
									new sap.m.Input({
										value: "{AuditoriaFilters>/DocumentNumber}",
										placeholder: "{i18n>Code}",
										layoutData: new sap.ui.layout.GridData({
											span: "L6 M6 S12"
										}),
										change: [oController.onFilterChange, oController]
									})
								]
							}),
							new sap.ui.layout.form.FormElement({
								label: new sap.m.Label({
									text: "{i18n>Company}",
									layoutData: new sap.ui.layout.GridData({
										span: "L6 M6 S12",
										visibleOnSmall: false
									})
								}),
								fields: [
									new sap.m.ComboBox({
										placeholder: "{i18n>Company}",
										busy: "{Companies>/Busy}",
										busyIndicatorDelay: 0,
										selectedKey: "{PaymentCalendarFilters>/CompanyGroupCode}",
										selectionChange: [oController.onFilterChange, oController],
										items: {
											path: "Companies>/Companies",
											template: new sap.ui.core.Item({
												key: "{Companies>CompanyCode}",
												text: "{Companies>CompanyName}"
											})
										},
										layoutData: new sap.ui.layout.GridData({
											span: "L6 M6 S12"
										})
									}),
									new sap.m.Button({
										icon: "sap-icon://search",
										iconFirst: true,
										text: "{i18n>Search}",
										tooltip: "{i18n>Search}",
										press: [oController.onSearch, oController],
										layoutData: new sap.ui.layout.GridData({
											span: "L2 M2 S12",
											indent: "L8 M8 S0"
										})
									}),
									new sap.m.Button({
										icon: "sap-icon://download",
										iconFirst: true,
										text: "{i18n>Download}",
										tooltip: "{i18n>Download}",
										press: [oController.downloadLicenses, oController],
										layoutData: new sap.ui.layout.GridData({
											span: "L2 M2 S12"
										})
									})
								]
							})
						];
					}

			});