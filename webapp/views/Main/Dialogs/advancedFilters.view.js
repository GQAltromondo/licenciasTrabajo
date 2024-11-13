sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.advancedFilters", {

	getControllerName: function () {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.advancedFilters";
	},

	createContent: function (oController) {
		//page
		return new sap.m.VBox({
			items: [
				new sap.ui.layout.form.Form({
					editable: true,
					layout: new sap.ui.layout.form.ResponsiveGridLayout(),
					formContainers: [
						new sap.ui.layout.form.FormContainer({
							formElements: [
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Puesto de trabajo",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({ //sap.m.isComboBox({
											selectedKey: "{FiltersJsonModel>/Arbpl/value}",
											items: {
												path: "WorkPlacesJsonModel>/WorkPlaces",
												template: new sap.ui.core.Item({
													key: "{WorkPlacesJsonModel>Arbpl}",
													text: "{WorkPlacesJsonModel>Ktext}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),

								/*new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Estado Equipo CAMMESA",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.isComboBox({
											selectedKey: "{FiltersJsonModel>/Equstat/value}",
											items: {
												path: "SelectModel>/FixedValuesSet",
												filters: [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_LICENCIAS"),
													new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "EQUSTAT")
												],
												template: new sap.ui.core.Item({
													key: "{SelectModel>Valkey}",
													text: "{SelectModel>Valtext}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),*/
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Solicitante",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({ //sap.m.isComboBox({
											selectedKey: "{FiltersJsonModel>/Solicitante/value}",
											items: {
												// filters: [new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, "10000845")],
												path: "PersonalHabilitadoModel>/Solicitante",
												template: new sap.ui.core.Item({
													key: "{PersonalHabilitadoModel>Legajo}",
													text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Requiere calle de 500kV abierta",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/R500kv/value}",
											items: {
												path: "HardCodeModel>/R500KV",
												template: new sap.ui.core.Item({
													key: "{HardCodeModel>key}",
													text: "{HardCodeModel>value}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											}),
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Requiere alguna Barra F/S",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({ //sap.m.isComboBox({
											width: "100%",
											selectedKey: "{FiltersJsonModel>/Barrafs/value}",
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
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Tiempo de Reposición",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({ //sap.m.isComboBox({
											selectedKey: "{FiltersJsonModel>/Tiemporep/value}",
											items: {
												path: "RepositionTimes>/RepositionTimes",
												template: new sap.ui.core.Item({
													key: "{RepositionTimes>Valkey}",
													text: "{RepositionTimes>Valtext}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Solicitante Suplente",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({ //sap.m.isComboBox({
											selectedKey: "{FiltersJsonModel>/SolSuplente/value}",
											items: {
												path: "PersonalHabilitadoModel>/Solicitante",
												template: new sap.ui.core.Item({
													key: "{PersonalHabilitadoModel>Legajo}",
													text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										}),
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Jefe de Trabajo",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/Jefe/value}",
											items: {
												path: "PersonalHabilitadoModel>/JefeDeTrabajo",
												template: new sap.ui.core.Item({
													key: "{PersonalHabilitadoModel>Legajo}",
													text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Jefe de Trabajo Suplente",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/JefeSuplente/value}",
											items: {
												path: "PersonalHabilitadoModel>/JefeDeTrabajo",
												template: new sap.ui.core.Item({
													key: "{PersonalHabilitadoModel>Legajo}",
													text: "{PersonalHabilitadoModel>Legajo} {PersonalHabilitadoModel>Nombre}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Estado Equipo/s a intervenir",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/Equstatnocam/value}",
											items: {
												path: "HardCodeModel>/Equstatnocam",
												template: new sap.ui.core.Item({
													key: "{HardCodeModel>key}",
													text: "{HardCodeModel>value}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Diario / Continuo",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/Period/value}",
											items: [
												new sap.ui.core.Item({
													text: "Diaria",
													key: "D"
												}),
												new sap.ui.core.Item({
													text: "Continua",
													key: "C"
												})
											],
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),

								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Tipo de equipo",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.MultiComboBox({
											selectedKeys: "{FiltersJsonModel>/Tipoequipo/values}",
											items: {
												path: "TipoEquipoJsonModel>/TipoEquipo",
												template: new sap.ui.core.Item({
													key: "{TipoEquipoJsonModel>Tipo}",
													text: "{TipoEquipoJsonModel>Descripcion}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Tipo de intervencion",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/Tipinterv/value}",
											items: {
												path: "TiposIntervencion>/TiposIntervencion",
												template: new sap.ui.core.Item({
													key: "{TiposIntervencion>Clave}",
													text: "{TiposIntervencion>Descripcion}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Señales Afectadas",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.MultiComboBox({
											selectedKeys: "{FiltersJsonModel>/SenalesC/value}",
											items: [
												new sap.ui.core.Item({
													key: "0",
													text: "Estados"
												}),
												new sap.ui.core.Item({
													key: "1",
													text: "Alarmas"
												}),
												new sap.ui.core.Item({
													key: "2",
													text: "Mediciones"
												}),
												/*
												new sap.ui.core.Item({
													key: "3",
													text: "Precauciones"
												}),
												*/
												new sap.ui.core.Item({
													key: "4",
													text: "Ninguna"
												})
											],
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Tipo de licencia",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/Tipolicencia/value}",
											items: {
												path: "TipoLicFiltersModel>/TipoLic",
												template: new sap.ui.core.Item({
													key: "{TipoLicFiltersModel>key}",
													text: "{TipoLicFiltersModel>descripcion}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Condiciones de trabajo",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/Jobcond/value}",
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
											],
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Coordinado ARO",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/Aro/value}",
											items: {
												path: "HardCodeModel>/Aro",
												template: new sap.ui.core.Item({
													key: "{HardCodeModel>key}",
													text: "{HardCodeModel>value}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Bloqueo de Recierre",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/Bloqueo/value}",
											items: {
												path: "HardCodeModel>/Bloqueo",
												template: new sap.ui.core.Item({
													key: "{HardCodeModel>key}",
													text: "{HardCodeModel>value}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								}),
								new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
										text: "Riesgo de disparo",
										layoutData: new sap.ui.layout.GridData({
											span: "L3 M6 S12",
											visibleOnSmall: false
										})
									}),
									fields: [
										new sap.m.ComboBox({
											selectedKey: "{FiltersJsonModel>/Rdisparo/value}",
											items: {
												path: "HardCodeModel>/Rdisparo",
												template: new sap.ui.core.Item({
													key: "{HardCodeModel>key}",
													text: "{HardCodeModel>value}"
												})
											},
											layoutData: new sap.ui.layout.GridData({
												span: "L3 M2 S12"
											})
										})
									]
								})
							]
						})
					]
				}).addStyleClass("sapUiTinyMarginBottom")
			]
		});
	}

});