sap.ui.define([
	"Transener/Operaciones/LicenciasTrabajo/utils/AppManagementHelper",
], function (AppManagementHelper) {
	"use strict";
	return {
		_aFilterData: null,
		aFilters: [],

		valueIsValid: function (value, typeofValue) {
			switch (typeofValue) {
			case "String":
				return value !== "";
			case "Array":
				return value.constructor === Array && value.length > 0;
			case "Date":
				return value !== null;
			}
		},

		setAdvancedFilters: function (aFilters) {
			this.aFilters = aFilters;
		},

		getAdvancedFilters: function () {
			return this.aFilters;
		},

		cleanAdvancedFilters: function () {
			this.aFilters = [];
		},

		generateAdvancedFilters: function () {
			let oFilters = AppManagementHelper.getModel("FiltersJsonModel").getData();
			this._aFilterData = _.values(oFilters);
			let aFilters = [];
			let aFiltersWithMultipleValues = this.getMultipleValueFilters();
			let aSingleValueFilters = this.getSingleValueFilters();
			//let aFiltersWithEmptyValues = this.getfiltersWithEmptyValues();
			//let aLocalFilters = this.getLocalValueFilters();
			aFilters = [...aSingleValueFilters, ...aFiltersWithMultipleValues];
			this.setAdvancedFilters(aFilters);
		},

		getSingleValueFilters: function () {
			let aFilters = [];
			let aFiltersWithSingleValue = this._aFilterData.filter(e => e.typeOfFilter === "Single");
			for (let oFilter of aFiltersWithSingleValue) {
				if (this.valueIsValid(oFilter.value, oFilter.typeOfValue))
					aFilters.push(new sap.ui.model.Filter(oFilter.attribute, sap.ui.model.FilterOperator[oFilter.operator], oFilter.value));
			}
			return aFilters;
		},

		getMultipleValueFilters: function () {
			let aFilters = [];
			let aMultipleFilters = [];
			let aFiltersWithMultipleValue = this._aFilterData.filter(e => e.typeOfFilter === "Multiple");
			for (let oFilter of aFiltersWithMultipleValue) {
				if (this.valueIsValid(oFilter.values, oFilter.typeOfValue)) {
					//todo tener cuidado si cambie el value o values -><-
					for (let oFilterValue of oFilter.values) {
						aMultipleFilters.push(new sap.ui.model.Filter(oFilter.attribute, sap.ui.model.FilterOperator[oFilterValue.operator], oFilterValue));
					}
					var oMultipleFilter = new sap.ui.model.Filter({
						filters: aMultipleFilters,
						and: true
					});
					aFilters.push(oMultipleFilter);
				}
			}
			return aFilters;
		},

	};
});