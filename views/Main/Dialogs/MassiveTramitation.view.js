sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.MassiveTramitation", {

	getControllerName: function () {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.MassiveTramitation";
	},
	idCount: 0,
	createContent: function (oController) {
		//page
		return new sap.m.VBox({
			items: [
				new sap.m.Table({
					id: this.createId("tramitacionMasivaTable"),
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
						new sap.m.Column({
							header: new sap.m.Text({
								text: "Avisó desde programación"
							})
						}),
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
								//press: oController.onAddTramitacion,
								press: function () {
									oController.onAddTramitacion()
								},
								icon: "sap-icon://add",
							}).addStyleClass("buttonInverted")
						})
					],
					items: {
						path: "TramitacionMasivaListJsonModel>/Tramitaciones",
						template: new sap.m.ColumnListItem({
							cells: [
								new sap.m.ComboBox({
									width: "100%",
									selectedKey: "{TramitacionMasivaListJsonModel>EmpTramita}",
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
									change: [oController.enableCausaNO, oController],
									selectedKey: "{TramitacionMasivaListJsonModel>Estado}",
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
									selectedKey: "{TramitacionMasivaListJsonModel>CausaNo}",
									enabled: "{TramitacionMasivaListJsonModel>Enabled}",
									items: {
										templateShareable: false,
										path: "SelectModel>/MotivoNoAutorizacionSet",
										template: new sap.ui.core.Item({
											key: "{SelectModel>Status}",
											text: "{SelectModel>Descripcion}"
										})
									}
								}),
								new sap.m.Text({
									enabled: "{TramitacionMasivaListJsonModel>Enabled}",
									/*text: {
										path: "TramitacionMasivaListJsonModel>Avisoprog",
										formatter: $.proxy(oController.handleUserName, oController)
									}*/
									text: "{TramitacionMasivaListJsonModel>Avisoprog}"
								}),
								new sap.m.Input({
									enabled: "{TramitacionMasivaListJsonModel>Enabled}",
									value: "{TramitacionMasivaListJsonModel>MotivoNo}"
								}),
								new sap.m.Button({
									visible: {
										path: "TramitacionMasivaListJsonModel>Estado",
										formatter: function (sEstado) {
											return sEstado === "01"
										}
									},
									icon: "sap-icon://appointment-2",
									press: [oController.openTramitacionCalendarDialog, oController]
								}).addStyleClass("buttonInverted"),
								new sap.m.Button({
									icon: "sap-icon://delete",
									press: [oController.onDeleteFromTable, oController]
								}).addStyleClass("buttonInverted")
							]
						})
					}
				})

			]
		}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginEnd");
	}

});