"use strict";
/*  ================================================================================
	Filters
================================================================================  */
angular.module('Filters', [])
	/* ================================================================================
	#fraction: Convert a decimal to a fraction
	================================================================================ */
	.filter('fraction', function() {
		return function(num) {
			//log(['Filter:fraction', num]);

			if (typeof (num) === "undefined") {
				return "";
			}

			var str = num.toString(),
				fraction = "",
				decimals = "",
				floorNum = -1,
				pos = str.search(/\./);

			if (pos >= 0) {
				decimals = str.substring(pos, str.length);
				floorNum = Math.floor(num);

				switch (decimals) {
					case ".25":
						fraction = "&frac14;";
						break;
					case ".5":
					case ".50":
						fraction = "&#189;";
						break;
					case ".75":
						fraction = "&frac34;";
						break;
					case ".0":
					case ".00":
						return floorNum;
					default:
						return num;
				}

				if (floorNum !== 0) {
					return floorNum + fraction;
				}
				else { return fraction; }
			}
			else { return num; }
		};
	})
	/* ================================================================================
	#quarter: Convert a decimal to a quarter e.g. .25 .5 .75
	================================================================================ */
	.filter('quarter', function() {
		return function(num) {
			//Log(['Filter:quarter:num', num]);
			num = (Math.round(num * 4) / 4).toFixed(places);
			var str = num.toString(),
				pos = str.search(/\./),
				decimals = str.substring(pos, str.length);
			if (decimals === ".00") {
				return Math.floor(num);
			}
			else { return num; }
		};
	})
	/* ================================================================================
	 #fixed: Convert a number to fixed places
	 ================================================================================ */
	.filter('fixed', function() {
		return function(num, places) {
			if (!appUtils.canFloat(num)) return num;
			var decimals = num - Math.floor(num);
			if (decimals == 0) return Math.floor(num);
			else return num.toFixed(places);
		};
	})
	/* ================================================================================
	#apiGuests: Convert guests object to array for submission to the api
	================================================================================ */
	.filter('apiGuestPax', ['Log', '$filter',
		function(Log, $filter) {
			return function(guestPax) {
				Log.debug(['Filter:apiGuestPax', guestPax]);
				var guests = [];
				angular.forEach(guestPax, function(category) {
					guests = guests.concat(category);
				});
				Log.debug(['Filter:apiGuestPax:guests', guests]);
				return guests;
			};
		}
	])
	/* ================================================================================
	#shorten: Shorten - Shorten a string down to a certain length
	================================================================================ */
	.filter('shorten', function() {
		return function(string, length) {
			var exp = new RegExp(".{" + length + "}[^ .]*");
			return angular.isUndefined(string) ? string : string.match(exp)[0];
		};
	})
	/* ================================================================================
	#subset: Reduce collection to subset
	================================================================================ */
	.filter('subset', ['Log', '$filter',
		function(Log, $filter) {
			return function(collection, start, length) {
				Log.debug(['Filter:subset', collection, toString.call(collection), start, length]);
				switch (toString.call(collection)) {
					case "[object Array]":
					{
						length = angular.isDefined(length) ? (start + length) : collection.length;
						//Log.debug(['Filter:subset:array', collection, start, length, collection.slice(start, length)]);
						return collection.slice(start, length);
					}
					case "[object Object]":
					{
						var subset = {},
							i = 0,
							useLength = angular.isDefined(length);

						angular.forEach(collection, function(item, key) {
							if (useLength && (i >= start) && (i <= (start + length))) subset[key] = item;
							else if (i >= start) subset[key] = item;
							i++;
						});
						return subset;
					}
				}
			};
		}
	])
	/* ================================================================================
	#categories: Returns the objects of defined categories
	================================================================================ */
	.filter('categories', ['Log',
		function(Log) {
			return function(groups, allowedCategories) {
				var filtered = [];
				//Log.debug(['Filter:categories:groups', groups, allowedCategories]);
				//TODO: Keep an eye on the performance of filtering this way
				if ((allowedCategories == null) || !allowedCategories) return groups;
				angular.forEach(groups, function(group) {
					angular.forEach(allowedCategories, function(category) {
						if (group.id == category) filtered.push(group);
					});
				});

				//Log.debug(['Filter:categories:complete', filtered]);
				return filtered;
			};
		}
	])
	/* ================================================================================
	#enabledSteps: Returns enabled steps
	================================================================================ */
	.filter('enabledSteps', ['Log',
		function(Log) {
			return function(steps) {
				var filtered = [];
				//Log.debug(['Filter:categoryOrdersState:category', category, state]);
				//TODO: Keep an eye on the performance of filtering this way
				angular.forEach(steps, function(step) {
					if (step.enabled) filtered.push(step);
				});
				return filtered;
			};
		}
	])
	/* ================================================================================
	#categoryOrdersState: Returns the orders of an order category that have the provided state
	================================================================================ */
	.filter('categoryOrdersState', ['Log',
		function(Log) {
			return function(category, state) {
				var filtered = [];
				//Log.debug(['Filter:categoryOrdersState:category', category, state]);
				//TODO: Keep an eye on the performance of filtering this way
				angular.forEach(category, function(order) {
					//Log.debug(['Filter:ordersReady:order', order]);
					if ((typeof(order) == 'object') && order.conditions[state]) filtered.push(order);
				});
				//Log.debug(['Filter:categoryOrdersReady:complete', filtered]);
				return filtered;
			};
		}
	])
	/* ================================================================================
	#apiDates: format dates into api acceptable format
	================================================================================ */
	.filter('apiDates', ['Log',
		function(Log) {
			return function(dates, format) {
				var filtered = [],
					dateObj = new Date();

				//Log.debug(['Filter:apiDates', dates, format]);
				angular.forEach(dates, function(date) {
					//Log.debug(['Filter:apiDates:date', date]);
					dateObj.setTime(date.ts);
					filtered.push(
						dateObj.toString(format)
					);
				});
				//Log.debug(['Filter:apiDates:complete', filtered]);
				return filtered;
			};
		}
	])
	/* ================================================================================
	#apiDatesToPeriod: format dates period parameters
	================================================================================ */
	.filter('apiDatesToPeriod', ['Log', '$filter',
		function(Log, $filter) {
			return function(dates, format) {
				//Log.debug(['Filter:apiDatesToPeriod', dates, format]);
				var datesArray = $filter('apiDates')(dates, format);
				return {
					usageDate: datesArray[0],
					period: 'days',
					periodValue: datesArray.length
				};
			};
		}
	])
	/* ================================================================================
	#apiPaxes: format paxes into api acceptable format
	TODO: remove this if unused
	================================================================================ */
	.filter('apiPaxes', ['Log',
		function(Log) {
			return function(paxes) {
				var filtered = [],
					dateObj = new Date();

				//Log.debug(['Filter:apiPaxes', paxes]);
				angular.forEach(paxes, function(value, pax) {
					//Log.debug(['Filter:apiDates:pax', pax]);
					filtered.push({
						paxCategory: pax,
						value: value
					});
				});
				//Log.debug(['Filter:apiPaxes:complete', filtered]);
				return filtered;
			};
		}
	])
	/* ================================================================================
	#apiSeats: format seats into api acceptable format
	================================================================================ */
	.filter('apiSeats', ['Log',
		function(Log) {
			return function(seats) {
				var filtered = [];
				angular.forEach(seats, function(seat) {
					filtered.push({seatId: seat.seatId})
				});
				return filtered;
			};
		}
	])
	/* ================================================================================
	#formattedDateRange: Returns the formatted date range from an array of dates
	================================================================================ */
	.filter('formattedDateRange', ['Log', '$filter', 'LanguageSvc',
		function(Log, $filter, LanguageSvc) {
			return function(dates, format) {
				var firstDate = null,
					lastDate = null,
					l = 0,
					dateString = '';

				angular.forEach(dates, function(date) {
					if (l == 0) firstDate = date.ts;
					lastDate = date.ts;
					l++;
				});

				angular.forEach(dates, function(date) {
					dateString = dateString + $filter('date')(date.ts, format) + ', ';
				});

				return dateString.substr(0, dateString.length - 3);


				/*				if (firstDate != lastDate) return $filter('date')(firstDate, format) + ' ' + LanguageSvc.terms.global.to + ' ' + $filter('date')(lastDate, format);
								else return $filter('date')(firstDate, format);*/
			};
		}
	])
	/* ================================================================================
	#jerseyUrlParameter: Format object/string/something into a Jersey url parameter string
	================================================================================ */
	.filter('jerseyUrlParameter', ['Log', '$filter', 'LanguageSvc',
		function(Log, $filter, LanguageSvc) {
			return function(dates, format) {
				var firstDate = null,
					lastDate = null,
					l = 0,
					dateString = '';

				angular.forEach(dates, function(date) {
					if (l == 0) firstDate = date.ts;
					lastDate = date.ts;
					l++;
				});

				angular.forEach(dates, function(date) {
					dateString = dateString + $filter('date')(date.ts, format) + ', ';
				});

				return dateString.substr(0, dateString.length - 3);


				/*				if (firstDate != lastDate) return $filter('date')(firstDate, format) + ' ' + LanguageSvc.terms.global.to + ' ' + $filter('date')(lastDate, format);
								else return $filter('date')(firstDate, format);*/
			};
		}
	])
	/* ================================================================================
	#formatPrice: format price
	================================================================================ */
	.filter('formatPrice', ['Log', 'LanguageSvc',
		function(Log, LanguageSvc) {
			return function(price) {
				if (typeof(price) == 'undefined') return LanguageSvc.terms.global.priceEmpty;
				return  LanguageSvc.terms.global.pricePrefix + parseInt(price) + LanguageSvc.terms.global.priceSuffix;
			};
		}
	])
	/* ================================================================================
	#dateArray: Format date object to array
	================================================================================ */
	.filter('dateArray', ['Log', '$filter',
		function(Log, $filter) {
			return function(dates) {
				var datesArray = [];
				angular.forEach(dates, function(date) {
					datesArray.push(date.ts);
				});
				return datesArray;
			};
		}
	])
	/* ================================================================================
	#parseDate: Format date from date time string
	================================================================================ */
	.filter('parseDate', ['Log', '$filter',
		function(Log, $filter) {
			return function(date) {
				return Date.parse(date);
			};
		}
	])
	/* ================================================================================
	#productsWithOrders: return only products that have active orders
	================================================================================ */
	.filter('productsWithOrders', ['Log', 'OrderSvc',
		function(Log, OrderSvc) {
			return function(date) {
				return Date.parse(date);
			};
		}
	])
	/* ================================================================================
	#dateBlock: Build date block from start and end date
	================================================================================ */
	.filter('dateBlock', ['Log', '$filter',
		function(Log, $filter) {
			return function(startDate, endDate) {
				var dates = {};

				startDate = (typeof(startDate) == 'number') ? new Date(startDate) : new Date($filter('parseDate')(startDate));
				endDate = (typeof(endDate) == 'number') ? new Date(endDate) : new Date($filter('parseDate')(endDate));

				while (startDate.compareTo(endDate) <= 0) {
					dates[startDate.getTime()] = {
						ts: startDate.getTime()
					};
					startDate.addDays(1);
				}

				return dates;

			};
		}
	])
	/* ================================================================================
	#priceCalendarPeriods: Format the price calendar dates
	================================================================================ */
	.filter('priceCalendarPeriods', ['Log', '$filter',
		function(Log, $filter) {
			return function(periods) {
				var groups = {},
					ordered = [];

				angular.forEach(periods, function(period) {
					if (angular.isUndefined(groups[period.periodValue])) groups[period.periodValue] = [];
					groups[period.periodValue].push(period);
				});

				angular.forEach(groups, function(group) {
					ordered.push(group);
				});

				Log.debug(['$filter:priceCalendarPeriods:ordered', ordered]);

				return ordered;
			};
		}
	])
	/* ================================================================================
	#priceCalendarDates: Format the price calendar dates
	================================================================================ */
	.filter('priceCalendarDates', ['Log', '$filter',
		function(Log, $filter) {
			return function(periods, buffer) {
				Log.debug(['$filter:priceCalendarDates', periods, buffer]);
				var datesObj = {},
					dates = [],
					ts;

				angular.forEach(periods, function(period) {
					ts = Date.parse(period.startDate).getTime();
					if (angular.isUndefined(datesObj[ts])) datesObj[ts] = ts;
				});

				for (var i = 0; i < (buffer - 1); i++) {
					ts = ts + 86400000;
					if (angular.isUndefined(datesObj[ts])) datesObj[ts] = ts;
				}

				Log.debug(['$filter:priceCalendarDates:datesObj', datesObj]);

				angular.forEach(datesObj, function(date) {
					dates.push(date);
				});

				Log.debug(['$filter:priceCalendarDates:dates', dates]);

				return dates;
			};
		}
	])

	/* ================================================================================
	#orderDatesObject: Returns the formatted date range from an array of dates
	================================================================================ */
	/*.filter('orderDatesObject', ['Log', '$filter',
		function(Log, $filter) {
			return function(dates, format) {
				var firstDate = null,
					lastDate = null,
					l = 0,
					dateString = '';


				angular.forEach(dates, function(date) {
					if (l == 0) firstDate = date.ts;
					lastDate = date.ts;
					l++;
				});

				angular.forEach(dates, function(date) {
					dateString = dateString + $filter('date')(date.ts, format) +  ', ' ;
				});

				return dateString.substr(0,dateString.length-3);


				*//*				if (firstDate != lastDate) return $filter('date')(firstDate, format) + ' ' + LanguageSvc.terms.global.to + ' ' + $filter('date')(lastDate, format);
								else return $filter('date')(firstDate, format);*//*
			};
		}
	])*/
	/* ================================================================================
	#decodeJsonData: converts json string data to json object and attaches it to the root of the object
	================================================================================ */
	.filter('decodeJsonData', function() {
		return function(items, properties) {

			function processData(item, properties) {
				if (!angular.isDefined(item.jsonData)) return item;

				// Decode the data if its still encoded
				if (typeof (item.jsonData) === 'string') item.jsonData = angular.fromJson(decodeURI(item.jsonData));

				if ((typeof(properties) === "string") && (properties === '*')) {
					angular.forEach(item.jsonData, function(prop, key) {
						item[key] = prop;
					});
				}
				else {
					angular.forEach(properties, function(prop) {
						if (angular.isDefined(item.jsonData[prop])) item[prop] = item.jsonData[prop];
					});
				}

				delete item.jsonData;
				return item;
			}

			if (angular.isArray(items)) {
				angular.forEach(items, function(item) { item = processData(item, properties); });
				return items;
			}
			else return processData(items, properties);
		};
	})
	/* ================================================================================
	 #encodeJsonData: converts provided properties in an object into a json string on the object
	 ================================================================================ */
	.filter('encodeJsonData', function() {
		return function(items, properties) {
			function processData(item, properties) {

				if ((typeof(properties) === "string") && (properties === '*')) {
					var jsonData = {};
					angular.forEach(item, function(prop, key) {
						jsonData[key] = prop;
						delete item[key];
					});
					item.jsonData = jsonData;
				}
				else {
					item.jsonData = {};
					angular.forEach(properties, function(prop) {
						if (angular.isDefined(item[prop])) {
							item.jsonData[prop] = item[prop];
							delete item[prop];
						}
					});
				}

				// Encode the data
				item.jsonData = encodeURI(angular.toJson(item.jsonData));

				return item;
			}

			if (angular.isArray(items)) {
				angular.forEach(items, function(item) { item = processData(item, properties); });
				return items;
			}
			else return processData(items, properties);
		};
	});
