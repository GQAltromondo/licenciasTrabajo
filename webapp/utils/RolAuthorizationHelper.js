sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/utils/FormatterHelper",
], function (FormatterHelper) {
	"use strict";

	return {

		includesAny: function (arr1, arr2) {
			return arr2 && arr1 && arr2.some(function (v) {
				return arr1.indexOf(v) >= 0;
			});
		},
		//el rol edition no toma en cuenta el atributo view dentro de los submodulos
		rolEdition: function (controlPath, callback) {
			var that = this;
			var arr = controlPath.split("/");
			var submodulo = arr[0];
			var notSubmodulo = "!" + submodulo;
			var control = arr[1];
			var notControl = "!" + control;

			function extraData(boolean, callback, ...extra) {
				if (!boolean) return false;
				if (callback) return callback(...extra);
				return extra.every(function (el) {
					return !!el
				});
			}

			return function (roles, permisos, ...extra) {
				if (!permisos) return false;

				if (permisos[submodulo]) {
					if (permisos[submodulo][control] && that.includesAny(permisos[submodulo][control], roles)) {
						return extraData(true, callback, ...extra);
					} else if (permisos[submodulo][notControl] && that.includesAny(permisos[submodulo][notControl], roles)) {
						return false
					}

					if (that.includesAny(permisos[submodulo].all, roles)) {
						return extraData(true, callback, ...extra);
					}

				}
				if (permisos[notSubmodulo] && that.includesAny(permisos[notSubmodulo].all, roles)) {
					return false
				} else {
					return extraData(permisos.default && permisos.default.all &&
						that.includesAny(permisos.default.all, roles), callback, ...extra);
				}
			};
		},
		//el rol visualization toma en cuenta el all
		rolVisualization: function (controlPath, callback) {
			var that = this;
			var arr = controlPath.split("/");
			var submodulo = arr[0];
			var control = arr[1];
			var notSubmodulo = "!" + submodulo;
			var notControl = "!" + control;

			function extraData(boolean, callback, ...extra) {
				if (!boolean) return false;
				if (callback) return callback(...extra);
				return extra.every(function (el) {
					return !!el
				});
			}

			return function (roles, permisos, region, ...extra) {
				if (!permisos) return false;

				let sRegionFormat = FormatterHelper.centroToRegion(region);

				if (sRegionFormat) {
					roles = roles.map(role => role.replace("_" + sRegionFormat, ""));
				}

				if (permisos[submodulo]) {
					if (permisos[submodulo][control] && that.includesAny(permisos[submodulo][control], roles)) {
						return extraData(true, callback, ...extra);
					} else if (permisos[submodulo][notControl] && that.includesAny(permisos[submodulo][notControl], roles)) {
						return false
					}
					if (that.includesAny(permisos[submodulo].all, roles) ||
						that.includesAny(permisos[submodulo].view, roles)
					) {
						return extraData(true, callback, ...extra);
					}
				}
				if (permisos[notSubmodulo] && (that.includesAny(permisos[notSubmodulo].all, roles) ||
					that.includesAny(permisos[notSubmodulo].view, roles))) {
					return false;
				} else {
					return extraData(permisos.default && (that.includesAny(permisos.default.all, roles) || that.includesAny(permisos.default.view,
						roles)), callback, ...extra);
				}
			};

		},


		rolStatusEdition: function (controlPath, callback) {
			var that = this;
			var arr = controlPath.split("/");
			var submodulo = arr[0];
			var control = arr[1];
			var notControl = "!" + control;
			var notSubmodulo = "!" + submodulo;

			function extraData(boolean, callback, ...extra) {
				if (!boolean) return false;
				if (callback) return callback(...extra);
				return extra.every(function (el) {
					return !!el
				});
			}

			return function (status, roles, statuses, region, ...extra) {
				if (!statuses) return false;

				let sRegionFormat = FormatterHelper.centroToRegion(region);

				if (sRegionFormat) {
					roles = roles.map(role => role.replace("_" + sRegionFormat, ""));
				}

				if (statuses[status] && statuses[status][submodulo] && statuses[status][submodulo][control] &&
					that.includesAny(statuses[status][submodulo][control], roles)
				) {
					return extraData(true, callback, ...extra);
				}

				if (statuses[status] && statuses[status][submodulo] && statuses[status][submodulo][notControl] &&
					that.includesAny(statuses[status][submodulo][notControl], roles)
				) {
					return false;
				}

				if (statuses[status] && statuses[status][submodulo] &&
					that.includesAny(statuses[status][submodulo].all, roles)
				) {
					return extraData(true, callback, ...extra);
				}

				if (statuses[status] && statuses[status][notSubmodulo] &&
					that.includesAny(statuses[status][notSubmodulo].all, roles)
				) {
					return false;
				}

				if (statuses[status] && statuses[status].all &&
					that.includesAny(statuses[status].all, roles)
				) {
					return extraData(true, callback, ...extra);
				}

				return extraData(statuses.default && statuses.default.all &&
					that.includesAny(statuses.default.all, roles), callback, ...extra);
			};
		},
		rolStatusEdition2: function (controlPath, callback) {
			var that = this;
			var arr = controlPath.split("/");
			var submodulo = arr[0];
			var control = arr[1];
			var notControl = "!" + control;
			var notSubmodulo = "!" + submodulo;

			function extraData(boolean, callback, ...extra) {
				if (!boolean) return false;
				if (callback) return callback(...extra);
				return extra.every(function (el) {
					return !!el
				});
			}

			return function (status, roles, statuses, region, ...extra) {
				console.log(status)
				if (!statuses) return false;

				let sRegionFormat = FormatterHelper.centroToRegion(region);

				if (sRegionFormat) {
					roles = roles.map(role => role.replace("_" + sRegionFormat, ""));
				}

				if (statuses[status] && statuses[status][submodulo] && statuses[status][submodulo][control] &&
					that.includesAny(statuses[status][submodulo][control], roles)
				) {
					return extraData(true, callback, ...extra);
				}

				if (statuses[status] && statuses[status][submodulo] && statuses[status][submodulo][notControl] &&
					that.includesAny(statuses[status][submodulo][notControl], roles)
				) {
					return false;
				}

				if (statuses[status] && statuses[status][submodulo] &&
					that.includesAny(statuses[status][submodulo].all, roles)
				) {
					return extraData(true, callback, ...extra);
				}

				if (statuses[status] && statuses[status][notSubmodulo] &&
					that.includesAny(statuses[status][notSubmodulo].all, roles)
				) {
					return false;
				}

				if (statuses[status] && statuses[status].all &&
					that.includesAny(statuses[status].all, roles)
				) {
					return extraData(true, callback, ...extra);
				}

				return extraData(statuses.default && statuses.default.all &&
					that.includesAny(statuses.default.all, roles), callback, ...extra);
			};
		}

	};
});