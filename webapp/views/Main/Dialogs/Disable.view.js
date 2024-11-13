sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.Disable", {

	getControllerName: function () {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.Disable";
	},
	idCount: 0,
	createContent: function (oController) {
		//page
		return new sap.ui.layout.Grid({
			content: [
				new sap.m.Label({
					text: "Licencias seleccionadas",
					layoutData: new sap.ui.layout.GridData({
						span: "L2 M12 S12"
					})
				}).addStyleClass("center"),
				new sap.m.List({
					items: {
						path: "ItemsJsonModel>/Items",
						template: new sap.m.CustomListItem({
							content: [
								new sap.m.HBox({
									items: [
										new sap.m.Label({
											text: {
												parts: ["ItemsJsonModel>/Tipo",
													"ItemsJsonModel>/Id",
													"ItemsJsonModel>/Idlicencia"
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
					text: "Fecha",
					layoutData: new sap.ui.layout.GridData({
						span: "L12 M12 S12"
					})
				}).addStyleClass("center"),
				new sap.m.Text({
					layoutData: new sap.ui.layout.GridData({
						span: "L12 M12 S12"
					}),
					text: {
						path: "CoordinacionModel>/CreationDate",
						formatter: function (fecha) {
							if (fecha) {
								var tempDate = new Date(fecha.getTime() - 3 * 3600 * 1000);
								return tempDate.toISOString().slice(0, 10);
							}
						}
					}
				}),
				new sap.m.Label({
					text: "Coordinador",
					layoutData: new sap.ui.layout.GridData({
						span: "L12 M12 S12"
					})
				}),
				new sap.m.Text({
					text: "{CoordinacionModel>/Coouser}",
					layoutData: new sap.ui.layout.GridData({
						span: "L12 M12 S12"
					})
				}),
				new sap.m.Label({
					text: "Comentario"
				}),
				new sap.m.Input({
					value: "{CoordinacionModel>/Coordination}",
					layoutData: new sap.ui.layout.GridData({
						span: "L12 M12 S12"
					})
				})
			]
		}).addStyleClass("processGrid");
	}

});