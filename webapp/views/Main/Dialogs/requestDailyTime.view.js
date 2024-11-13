sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.requestDailyTime", {

	getControllerName: function () {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.requestDailyTime";
	},
	idCount: 0,
	createContent: function (oController) {
		//page
		return new sap.m.VBox({
			items: [
				new sap.m.Panel({
					content: [
						new sap.m.HBox({
							items: [
								new sap.m.Label({
									text: "Fecha",
									layoutData: new sap.m.FlexItemData({
										growFactor: 1,
										baseSize: "0"
									})
								}).addStyleClass("center"),
								new sap.m.DatePicker({
									width: "auto",
									dateValue: "{newDay>/date}",
									displayFormat: "dd-MM-yyyy",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado"
										],
										formatter: oController.rolStatusEdition("header/")
									},
									layoutData: new sap.m.FlexItemData({
										growFactor: 9,
										baseSize: "0"
									})
								})
							]
						}),
						new sap.m.HBox({
							items: [
								new sap.m.Label({
									text: "Hora Desde",
								}).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop"),
								new sap.m.TimePicker({
									displayFormat: "HH:mm",
									dateValue: "{newDay>/timeFrom}",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado"
										],
										formatter: oController.rolStatusEdition("header/")
									},
									layoutData: new sap.m.FlexItemData({
										growFactor: 2,
										baseSize: "0"
									})
								}),
								new sap.m.Label({
									text: "Hora Hasta",
								}).addStyleClass("sapMediumMarginBegin "),
								new sap.m.TimePicker({
									displayFormat: "HH:mm",
									dateValue: "{newDay>/timeTo}",
									enabled: {
										parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
											"PermisosJsonModel>/UsuarioEncontrado"
										],
										formatter: oController.rolStatusEdition("header/")
									},
									layoutData: new sap.m.FlexItemData({
										growFactor: 6,
										baseSize: "0"
									})
								}).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTop")
							]
						}),
						new sap.m.Button({
							text: "Aceptar",
							press: [oController.onAddDate, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							}
						}).addStyleClass("sapUiTinyMarginBeginEnd").addStyleClass("buttonInverted"),
						new sap.m.Button({
							text: "Cancelar",
							press: [oController.onCancel, oController],
							enabled: {
								parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
									"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
								],
								formatter: oController.rolStatusEdition("header/")
							}
						}).addStyleClass("buttonInverted")
					]
				}),
				new sap.m.Panel({
					content: [
						new sap.m.Table({
							columns: [
								new sap.m.Column({
									header: new sap.m.Text({
										text: "Fecha"
									})
								}),
								new sap.m.Column({
									header: new sap.m.Text({
										text: "Hora Desde"
									})
								}),
								new sap.m.Column({
									header: new sap.m.Text({
										text: "Hora Hasta"
									})
								}),
								new sap.m.Column({
									visible: "{DisableNoAuthModel>/visible}",
									header: new sap.m.Text({
										text: ""
									})
								}),
							],
							items: {
								sorter: new sap.ui.model.Sorter("Fecha"),
								path: "LicenseJsonModel>/HorariosPorLicencia_nav",
								template: new sap.m.ColumnListItem({
									cells: [
										new sap.m.Text({
											text: {
												path: "LicenseJsonModel>Fecha",
												formatter: $.proxy(oController.validateDaysFromEdition, oController)
											}
										}),
										new sap.m.Text({
											text: {
												path: "LicenseJsonModel>Horainicio",
												formatter: $.proxy(oController.validateHoursFromEdition, oController)
											}
										}),
										new sap.m.Text({
											text: {
												path: "LicenseJsonModel>Horafin",
												formatter: $.proxy(oController.validateHoursFromEdition, oController)
											}
										}),
										new sap.m.Button({
											icon: "sap-icon://delete",
											press: [oController.onDeleteDate, oController],
											enabled: {
												parts: ["LicenseJsonModel>/Licstat", "UserJsonModel>/roles", "statusModel>/", "LicenseJsonModel>/Werks",
													"PermisosJsonModel>/UsuarioEncontrado", "DisableControlsJsonModel>/enabledForProgrammer"
												],
												formatter: oController.rolStatusEdition("header/")
											}
										}).addStyleClass("buttonInverted")
									]
								})
							}
						})
					]
				})
			]
		}).addStyleClass("requestDailyTimePage");
	}

});