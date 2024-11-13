sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.Observation", {

	getControllerName: function() {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.Observation";
	},
	idCount: 0,
	createContent: function(oController) {
		//page
		return new sap.ui.layout.Grid({
			content: [
				new sap.m.Label({
					text: "Licencias/Solicitudes seleccionadas",
					layoutData: new sap.ui.layout.GridData({
						span: "L2 M12 S12"
					})
				}).addStyleClass("center"),
				new sap.m.List({
					items: {
						path: "AnulableItemsJsonModel>/AnulableItems",
						template: new sap.m.CustomListItem({
							content: [
								new sap.m.HBox({
									items: [
										new sap.m.Label({
											text: {
												parts: ["AnulableItemsJsonModel>Tipo",
													"AnulableItemsJsonModel>Id",
													"AnulableItemsJsonModel>Idlicencia"
												],
												formatter: function (sTipoDoc, Id, sIdLicencia) {
													return (sTipoDoc === "S") ? "Solicitud Nº: " + Id : "Licencia Nº: " + Id;
												}
											}
										}).addStyleClass("middlePadding"),
										new sap.ui.core.Icon({
											src: "sap-icon://decline",
											press: [oController.deleteListLicense, oController]
										}).addStyleClass("middlePadding blueColor")
									]
								}).addStyleClass("cardBox")
							]
						}).addStyleClass("inline-block")
					},
					layoutData: new sap.ui.layout.GridData({
						span: "L10 M12 S12"
					})
				}),
				new sap.ui.core.HTML({
					layoutData: new sap.ui.layout.GridData({
						span: "L12 M12 S12"
					}),
					content: "<hr/>"
				}),
				new sap.m.Label({
					text: "Causa de observación",
					layoutData: new sap.ui.layout.GridData({
						span: "L4 M12 S12"
					})
				}).addStyleClass("center"),
				new sap.m.Select({
					width: "100%",
					selectedKey: "{ObservacionModel>/causaObservacion}",
					items: {
						path: "SelectModel>/FixedValuesSet",
						filters: [new sap.ui.model.Filter("Tabname", sap.ui.model.FilterOperator.EQ, "ZTAB_LICENCIAS"),
							new sap.ui.model.Filter("Fieldname", sap.ui.model.FilterOperator.EQ, "CAUSAANULADO")
						],
						template: new sap.ui.core.Item({
							key: "{SelectModel>Valkey}",
							text: "{SelectModel>Valtext}"
						})
					},
					layoutData: new sap.ui.layout.GridData({
						span: "L8 M12 S12"
					})
				}),
				new sap.m.TextArea({
					value: "{ObservacionModel>/comentarioObservacion}",
					width: "100%",
					layoutData: new sap.ui.layout.GridData({
						span: "L12 M12 S12"
					})
				})
			]
		}).addStyleClass("processGrid");
	}

});