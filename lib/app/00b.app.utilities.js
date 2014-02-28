"use strict";
/*  ================================================================================
#appUtils Application Utility Functions
 ================================================================================  */
window.appUtils = {
	uts: function(ts) { return (typeof(ts) === "number") ? (Math.round(ts / 1000)) : (Math.round((new Date()).getTime() / 1000)); },
	ts: function(uts) { return (typeof(uts) === "number") ? (Math.round(uts * 1000)) : new Date().getTime(); },
	randomString: function(){
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
			length = Math.round((Math.random() * 50)+50),
			str = '';

		for (var i=0; i < length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			str += chars.substring(rnum,rnum+1);
		}
		return str;
	},
	zDate: function(ts) {
		var d = new Date();
		if (typeof(ts) === "number") d.setTime(ts);
		d.setHours(0, 0, 0, 0);
		return d;
	},
	removeFromArray: function(item, array) {
		array.splice(array.indexOf(item), 1);
	},
	inArray: function(item, array) {
		return array.indexOf(item) >= 0;
	},
	arrayDifferences: function(array1, array2) {
		//console.log(['appUtils:arrayDifferences', array1, array2]);
		var differences = {
			new: [],
			removed: []
		};
		array1.sort();
		array2.sort();
		for (var i = 0, l = array1.length; i < l; i++) {
			if (array2.indexOf(array1[i]) < 0) differences.new.push(array1[i]);
		}
		for (var i = 0, l = array2.length; i < l; i++) {
			if (array1.indexOf(array2[i]) < 0) differences.removed.push(array2[i]);
		}
		return differences;
	},
	objectLength: function(obj) {
		var l = 0;
		for (var p in obj) {
			l++;
		}
		return l;
	},
	SpaceToDash: function(str) {
		return str.replace(/\s/g, '-');
	},
	floatOrString: function(value) {
		return isNaN(parseFloat(value)) ? value : parseFloat(value);
	},
	canFloat: function(qty) {
		return !isNaN(parseFloat(qty));
	},
	areDefined: function() {
		//console.log(['appUtils:areDefined', arguments]);
		for (var i = 0, l = arguments.length; i < l; i++) {
			//console.log(['appUtils:areDefined', i, arguments[i]]);
			if (typeof(arguments[i]) == "undefined") return false;
		}
		return true;
	},
	camelCase: function(str) {
		return str.replace(/^.|[ -_].|\../g, function(letter, index) {
			return index == 0 ? letter.toLowerCase() : letter.substr(1).toUpperCase();
		});
	},
	safeString: function(str) {
		return (typeof(str) == "string") ? str : '';
	},
	objectIsEmpty: function(obj) {
		for (var k in obj) { return false; }
		return true;
	},
	empty: function(item) {
		switch (typeof(item)) {
			case 'undefined':
				return true;
			case 'string':
				return item === '';
			case 'boolean':
				return item;
			case 'object':
				return item === null;
		}
	},
	meetsConditions: function(item, conditions) {
		//console.log(['appUtils:meetsConditions:', item, conditions]);

		var condition = null,
			pattern = null,
			defaultModifiers = 'gi';

		for (var i = 0, l = conditions.length; i < l; i++) {

			condition = conditions[i];
			//console.log(['appUtils:meetsConditions:item:', item[condition.name], condition.name, condition]);

			// Test condition property is defined
			if (angular.isUndefined(item[condition.name])) return false;
			//console.log(['appUtils:meetsConditions:item:', condition.name, 'defined', true]);

			// Test for property type
			if (angular.isDefined(condition.type) && (typeof(item[condition.name]) != condition.type)) return false;
			//console.log(['appUtils:meetsConditions:item:', condition.name, condition.type, true]);

			//Test for children length
			if (angular.isDefined(condition.childrenMinimum)) {
				var c = 0;
				for (var prop in item[condition.name]) {
					c++;
					//if (c >= condition.childrenMinimum) break;
				}
				if (c < condition.childrenMinimum) return false;
				//console.log(['appUtils:meetsConditions:childrenMinimum', condition.name, condition.childrenMinimum, c, true]);
			}

			// Validate property value
			if (angular.isDefined(condition.validation)) {
				pattern = new RegExp(
					condition.validation.replace('\\\\', '\\'),
					(angular.isDefined(condition.modifiers) ? condition.modifiers : defaultModifiers)
				);
				if (!pattern.test(item[condition.name])) return false;
				//console.log(['appUtils:meetsConditions:item:', condition.name, condition.validation, true]);
			}

		}

		//console.log(['appUtils:meetsConditions:all conditions met']);
		return true;
	},
	/**
	 * Fetches a url parameter from the window location
	 * @param name
	 * @returns {string}
	 * @constructor
	 */
	URLParameter: function(name) {
		return decodeURIComponent(
			(RegExp(name + '=' + '(.+?)(&|$)', 'i').exec(location.search) || [, ""])[1]
		);
	}
};


