/*creado por hector zea 04/04/2017*/
sap.ui.jsview("Transener.Operaciones.LicenciasTrabajo.views.Main.NotFound.NotFound", {

	getControllerName: function() {
		return "Transener.Operaciones.LicenciasTrabajo.views.Main.NotFound.NotFound";
	},

	createContent: function(oController) {
		var oMainView = new sap.m.MessagePage({
			showHeader: false,
			text: "La licencia a la que quieres acceder no fué encontrada",
			description: "Contacte con el administrador para mas informacion",
			customDescription: [
				new sap.m.Link({
					text: "Volver al listado de licencias de trabajo",
					press: [oController.goToHome, oController]
				})
			]
		});
		return oMainView;
	}
});