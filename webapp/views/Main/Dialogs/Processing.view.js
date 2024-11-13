sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.Processing", {

	getControllerName: function() {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.Dialogs.Processing";
	},
	idCount: 0,
	createContent: function(oController) {
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
					text: "Empresas",
					layoutData: new sap.ui.layout.GridData({
						span: "L2 M12 S12"
					})
				}).addStyleClass("center"),
				new sap.m.Select({
					width: "100%",
					selectedKey: "{/CompanyToAdd}",
					items: {
						path: "Companies>/Companies",
						template: new sap.ui.core.Item({
							key: "{Companies>text}",
							text: "{Companies>text}" //or whatever
						})
					},
					layoutData: new sap.ui.layout.GridData({
						span: "L4 M12 S12"
					})
				}),
				new sap.m.Button({
					text: "Agregar",
					type: sap.m.ButtonType.Emphasized,
					press: [oController.addCompanyInputs, oController],
					layoutData: new sap.ui.layout.GridData({
						span: "L2 M12 S12"
					})
				}),
				new sap.m.Label({
					text: "Inicio de tramitación",
					layoutData: new sap.ui.layout.GridData({
						span: "L2 M12 S12"
					})
				}).addStyleClass("center"),
				new sap.m.Input({
					enabled: false,
					layoutData: new sap.ui.layout.GridData({
						span: "L2 M12 S12"
					})
				}),
				new sap.ui.core.HTML({
					layoutData: new sap.ui.layout.GridData({
						span: "L12 M12 S12"
					}),
					content: "<hr/>"
				}),
				new sap.m.List({
					layoutData: new sap.ui.layout.GridData({
						span: "L12 M12 S12"
					}),
					mode: sap.m.ListMode.Delete,
					delete: function(oEvent) {
						var oSource = oEvent.getSource();
						var item = oEvent.getParameters().listItem;
						var index = oSource.indexOfItem(item);
						var ListedCompaniesModel = oSource.getModel("ListedCompanies");
						var companies = ListedCompaniesModel.getData().Companies;
						if (index > -1) {
							companies.splice(index, 1);
						}
						ListedCompaniesModel.refresh();
						//oSource.removeItem(oEvent.getParameters().listItem);
					},
					items: {
						path: "ListedCompanies>/Companies",
						template: new sap.m.CustomListItem({
							content: [
								new sap.ui.layout.Grid({
									content: [
										new sap.m.Text({
											layoutData: new sap.ui.layout.GridData({
												span: "L1 M12 S12"
											}),
											text: "{ListedCompanies>companyName}"
										}).addStyleClass("center"),
										new sap.m.Text({
											layoutData: new sap.ui.layout.GridData({
												span: "L1 M12 S12"
											}),
											text: "Estado"
										}).addStyleClass("center"),
										new sap.m.Select({
											width: "100%",
											layoutData: new sap.ui.layout.GridData({
												span: "L2 M12 S12"
											}),
											selectedKey: "{ListedCompanies>CompanyStatus}",
											items:
											/*{
												path: "ProcessingStatus>/ProcessingStatus",
												template: new sap.ui.core.Item({
													text: "{ProcessingStatus>name}",
													key: "{processingStatus>key}"
												})
											}*/
												[
												new sap.ui.core.Item({
													text: "Aceptado",
													key: "1"
												}),
												new sap.ui.core.Item({
													text: "Rechazado",
													key: "2"
												})
											]
										}),
										new sap.m.Text({
											layoutData: new sap.ui.layout.GridData({
												span: "L1 M12 S12"
											}),
											text: "Motivo"
										}).addStyleClass("center"),
										new sap.m.Input({
											layoutData: new sap.ui.layout.GridData({
												span: "L7 M12 S12"
											}),
											value: "{ListedCompanies>Motive}"
										})
									]
								})
							]
						})
					}
				}).addStyleClass("stripedList"),
				new sap.m.List({
					items: {
						path: "ListedCompanies>/Companies",
						template: new sap.m.ColumnListItem({
							mode: sap.m.ListMode.Delete,
							cells: [

							]
						})
					}
				})

			]
		}).addStyleClass("processGrid"); //hack or page layout is broken, crazy things about sapui5
	}

});