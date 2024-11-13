sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.App", {

	getControllerName: function () {
		return "Transener.Operaciones.LicenciasTrabajo.views.App";
	},

	createContent: function (oController) {

		this.setDisplayBlock(true);

		var app = new sap.m.App({
			id: "app",
			pages: [
			//	sap.ui.jsview(this.createId("Main"), "Transener.Operaciones.LicenciasTrabajo.views.Main.Main")
			]
		});
		oController.setApp(app);
		return app;
	}
});