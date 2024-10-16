sap.ui.define([
	//libs
	"Transener/Operaciones/LicenciasTrabajo/utils/MessageBoxHelper"
], function (MessageBoxHelper) {
	"use strict";

	return {

		saveBinaryFile: function (binary, contentType, filename) {
			try {
				//crea array de bytes
				var bytes = this._getBytes(binary);
				//crea blob a partir de bytes
				var blob = this._createBlob(bytes, contentType);
				//guarda archivo
				this._saveData(blob, filename);
			} catch (ex) {
				MessageBoxHelper.showAlert("Error", "ErrorSavingForm");
			}
		},

		//crea blob a partir de datos binarios
		_sliceSize: 512, //size de array al convertir binary a byte array
		_getBytes: function (binary, sliceSize) {
			sliceSize = sliceSize || this._sliceSize;

			var byteCharacters = binary;

			//carga bytes
			var byteArrays = [];
			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);

				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				var byteArray = new Uint8Array(byteNumbers);

				byteArrays.push(byteArray);
			}
			return byteArrays;
		},

		//crea blob
		_createBlob: function (bytes, contentType) {
			contentType = contentType || '';

			var blob;
			try {
				blob = new Blob(bytes, {
					type: contentType
				});
			} catch (e) {
				window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
				blob = new BlobBuilder();
				blob.append(bytes);
				blob = blob.getBlob();
			}
			return blob;
		},

		//guarda archivo
		_saveData: function (blob, fileName) {
			if (navigator.msSaveBlob) { //IE
				return navigator.msSaveBlob(blob, fileName);
			} else if (navigator.userAgent.indexOf("Chrome") != -1) {
				//chrome
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				url = window.URL.createObjectURL(blob);
				a.href = url;
				a.setAttribute("download", fileName);
				a.download = fileName;
				a.click();
				window.URL.revokeObjectURL(url);
			} else {
				//otros navegadores
				var url = window.URL.createObjectURL(blob);
				window.location.href = url;
			}
		}
	}

});