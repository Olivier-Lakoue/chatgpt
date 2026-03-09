

/*

1️⃣ Ordre des définitions

D’abord utils

Ensuite vectors (qui utilise utils)

Enfin trendyways (qui utilise utils et vectors)

2️⃣ Exposition globale

Chaque module (utils, vectors, trendyways) est exposé sur window


Exemple :

window.TrendyWaysUtils = { ... }
window.TrendyWaysVectors = { ... }
window.TrendyWays = { ... }


*/



//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

/*
src/utils.js

*/


//"use strict";

		/**
		 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
		 * @param {object} objects list
		 * @param {attrs} list of attributes to look for
		 * @return {value} object attribute
		 */
		var resolveParam = function (obj, attrs) {
		  for (var i = 0; i < attrs.length; i++) {
			var field = attrs[i]
			if (obj[field] != undefined)
			  return obj[field]
			else
			  return obj
		  }
		  throw new Error( "No valid (" + attrs + ") found in obj");
		}
		//module.exports.resolveParam = resolveParam

		/**
		 * @description returns the given value if the object is undefined
		 * @param {obj} object to check
		 * @param {val} value to return
		 */
		var valueIfUndef = function (obj, val) {
		  return isUndef(obj) ? val : obj;
		}
		//module.exports.valueIfUndef = valueIfUndef

		var isUndef = function (obj) {
		  return typeof obj === "undefined";
		}
		//module.exports.isUndef = isUndef;

		var reverseAppend = function (refList, addList, field) {
		  if (isUndef(field))
			throw new Error ("Unable to append values, no field given")
		  if (typeof refList[0] !== "object") {
			return addList;
		  }
		  addList.forEach (function (add, i) {
			refList[refList.length-addList.length+i][field] = add[field] ? add[field] : add;
		  })
		  return refList;
		}
		//module.exports.reverseAppend = reverseAppend

		var flat = function (list, attr) {
		  return list.map (function (i) {
			return isUndef(i[attr]) ? 0 : i[attr];
		  });
		}
		//module.exports.flat = flat

		var fill = function (list, attr, defaultValue) {
		  list.forEach(function(l) {
			if (isUndef(l[attr]))
			  l[attr] = defaultValue;
		  });
		}
		
		//module.exports.fill = fill

		/**
		 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
		 * @param {array} values values array
		 * @param {value} value size of the window
		 * @param {function} fun function to apply on each chunk
		 * @return {array} values returned by the given function in each chunck
		 */
		var windowOp = function (values, value, fun, targetAttr) {
		  var result = new Array();
		  for (var i = value; i <= values.length; i++)
		  {
			var windowVal = fun (values.slice(i-value, i), targetAttr);
			result.push (windowVal);
		  }
		  return result;
		}
		
		
		
		//module.exports.windowOp = windowOp



			window.TrendyWaysUtils = {
			  resolveParam: resolveParam,
			  valueIfUndef: valueIfUndef,
			  isUndef: isUndef,
			  reverseAppend: reverseAppend,
			  flat: flat,
			  fill: fill,
			  windowOp: windowOp
			};




//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//====================statitics==============================	





			/**
			 * @description Max value in a series
			 * @param{array} values array of numerical values
			 * @returns {value} the max element in the series
			 */
			var max = function (values) {
			  var ret = Number.MIN_VALUE
			  for (var i = 0; i < values.length; i++) {
				if (values[i] > ret) {
				  ret = values[i];
				}
			  }
			  return ret;
			}
			
			//module.exports.max = max

			//////////////////////////////////////////////////////////

			/**
			 * @description Min value in a series
			 * @param {array} values array of numerical values
			 * @returns {value} min value in the series
			 */
			var min = function (values) {
			  var ret = Number.MAX_VALUE
			  for (var i = 0; i < values.length; i++) {
				if (values[i] < ret) {
				  ret = values[i];
				}
			  }
			  return ret;
			}
			
			//module.exports.min = min

			//////////////////////////////////////////////////////////

			/**
			 * @description Mean of values in a serie
			 * @param {array} values array of numerical values
			 * @return {value} mean of the series
			 */
			var mean = function (values, targetAttr) {
			  var mean = 0;
			  if (values.length == 0)
				return mean;
			  for (var i = 0; i < values.length; i++) {
				  mean += isUndef(targetAttr) ? values[i] : values[i][targetAttr]
			  }
			  return mean/values.length;
			}
			
			//module.exports.mean = mean

			//////////////////////////////////////////////////////////

			/**
			 * @description Standar deviation of values in a serie.
			 * @param {array} values array of numerical values
			 * @return {value} standard deviation of the series values.
			 */
			var sd = function (values, targetAttr) {
			  var meanVal = mean(values, targetAttr);
			  var sqrSum = 0;
			  for (var i = 0; i < values.length; i++) {
				var value = isUndef(targetAttr) ? values[i] : values[i][targetAttr]
				sqrSum += Math.pow(value-meanVal, 2);
			  }
			  return Math.sqrt (sqrSum/values.length);
			}
			
			//module.exports.sd = sd

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the MSE error of two series
			 * @param{array} series1 values array
			 * @param{array} series2 values array
			 * @return{value} the mse error
			 */
			var mse = function (series1, series2)
			{
			  return avgVector (powVector (diffVectors(series1, series2)));
			}
			
			//module.exports.mse = mse;

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the RMSE error (squared MSE)
			 * @param{array} series1 values array
			 * @param{array} series2 values array
			 * @return{value} the RMSE error
			 */
			var rmse = function (series1, series2)
			{
			  return Math.sqrt (mse(series1, series2));
			}
			
			//module.exports.rmse = rmse;

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the MAE erro (mean absolute error)
			 * @param{array} series1 values array
			 * @param{array} series2 values array
			 * @return{value} the mae error
			 */
			var mae = function (series1, series2)
			{
			  return avgVector(absVector(diffVectors(series1, series2)));
			}
			
			//module.exports.mae = mae;

//====================Classe TextLookup==============================	

		window.TrendyWaysStats = {
		  max: max,
		  min: min,
		  mean: mean,
		  sd: sd,
		  mse: mse,
		  rmse: rmse,
		  mae: mae
		};	





//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//====================vectors==============================	
/*



*/




	//var utils = require ("./utils");
	//var stats = require ("./statistics");
	var utils = window.TrendyWaysUtils;
	var stats = window.TrendyWaysStats;
	
	
	
			/**
			 * @description Alternative forEach for all those browsers like IE8 and below
			 * @param {function} function to apply to each element
			 * @param {scope} scope
			 */
			if ( !Array.prototype.forEach ) {
			  Array.prototype.forEach = function(fn, scope)
			  {
				for(var i = 0, len = this.length; i < len; ++i)
				{
				  if (i in this)
				  {
					fn.call(scope, this[i], i, this);
				  }
				}
			  };
			}

			////////////////////////////////////////////////////////

			/**
			 * @description Returns a vector containing the difference of the parameters.
			 * @param {array} series1 first values array
			 * @param {array} series2 second values array
			 * @return {array} series1 - series2
			 */
			var diffVectors = function (series1, series2, targetAttr)
			{
			  var size = stats.max([series1.length, series2.length])
			  var result = [];
			  var s1Size = series1.length;
			  var s2Size = series2.length;
			  for (var i = 0; i < size; i++)
			  {
				var itemS1 = 0;
				var itemS2 = 0;
				if (s1Size > i)
				{
				  itemS1 = utils.isUndef(targetAttr) ? series1[i] : series1[i][targetAttr];
				}
				if (s2Size > i)
				{
				  itemS2 = utils.isUndef(targetAttr) ? series2[i] : series2[i][targetAttr];
				}
				result.push (itemS1 - itemS2);
			  }
			  return result;
			}
			//module.exports.diffVectors = diffVectors

			////////////////////////////////////////////////////////

			/**
			 * @description Returns a vector to the 2nd power
			 * @param {array} serie values array
			 * @return {array} values array ^ 2
			 */
			var powVector = function (serie)
			{
			  var result = [];
			  var pow = function (x) {
				result.push (Math.pow(x, 2));
			  };
			  serie.forEach (pow);
			  return result;
			}
			//module.exports.powVector = powVector

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the sum of all elements in a vector
			 * @param {array} vector values array
			 * @returns {value} the sum of all elements
			 */
			var sumVector = function (values, targetAttr)
			{
			  var result = 0;
			  var sum = function (x) {
				if (utils.isUndef(x[targetAttr]))
				  result += x
				else
				  result += x[targetAttr]
			  }
			  values.forEach (sum);
			  return result;
			}
			//module.exports.sumVector = sumVector;
			////////////////////////////////////////////////////////

			/**
			 * @description Returns the average of the sum of all vector elements
			 * @param {array} vector values array
			 * @returns {value} the average of the all elements
			 */
			var avgVector = function (vector, targetAttr)
			{
			  var result = vectors.sumVector (vector, targetAttr);
			  
			  if (!vector.length)
				return 0;
			  else
				return result / vector.length;
			}
			//module.exports.avgVector = avgVector
			
			
			////////////////////////////////////////////////////////

			/**
			 * @description Returns the vector containing absolutes values of the input
			 * @param {array} vector values array
			 * @return {array} the absolute values of the given array
			 */
			var absVector = function (vector)
			{
			  var result = [];
			  vector.forEach (function ab(x)
			  {
				result.push(Math.abs(x));
			  });
			  return result;
			}
			//module.exports.absVector = absVector
			
			
			////////////////////////////////////////////////////////

			/**
			 * @description Returns the values of the first vector divided by the second
			 * @param {array} v1 values array
			 * @param {array} v2 values array
			 * @return {array} v1 / v2
			 */
			var divVector = function (v1, v2)
			{
			  var result = [];
			  for (var i = 0; i < v1.length; i++)
			  {
				result.push (v1[i] / v2[i]);
			  }
			  return result;
			}
			//module.exports.divVector = divVector
			////////////////////////////////////////////////////////

			/**
			 * @description Combine two vectors using the provided function.
			 * Both series must have the same length.
			 * @param {array} serie1
			 * @param {array} serie2
			 * @param {function} fun
			 * @return {array} values fun(serie1, serie2)
			 */
			var combineVectors = function (serie1, serie2, fun)
			{
			  if (serie1.length != serie2.length || serie1.length + serie2.length < 2)
			  {
				return [-1];
			  }
			  else
			  {
				var result = [];
				for (var i = 0; i < serie1.length; i++)
				{
				  result.push (fun(serie1[i], serie2[i]));
				}
				return result;
			  }
			}
			//module.exports.combineVectors = combineVectors



		window.TrendyWaysVectors = {
		  diffVectors: diffVectors,
		  powVector: powVector,
		  sumVector: sumVector,
		  avgVector: avgVector,
		  absVector: absVector,
		  divVector: divVector,
		  combineVectors: combineVectors
		};




//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//====================vectors==============================	



		//var utils = require ("./utils")
		//var vectors = require ("./vectors")

var utils = window.TrendyWaysUtils;
var vectors = window.TrendyWaysVectors;



				/*
				 * Moving Average: 
				 * also known as simple moving average, rolling average, moving mean
				 * and a million of similar combinations
				 */
				var ma = function (values, order, targetAttr, outputAttr) {
				  targetAttr = utils.valueIfUndef(targetAttr, ["c"]);
				  outputAttr = utils.valueIfUndef(outputAttr, "ma");
				  var sumWindow = function (serie) {
					var sum = 0;
					for (var init = 0; init < serie.length; init++) {
					  sum += utils.resolveParam(serie[init], targetAttr);
					}
					return (sum/serie.length);
				  };
				  var newVal = utils.windowOp (values, order, sumWindow);
				  return utils.reverseAppend(values, newVal, outputAttr);
				}
				//module.exports.ma = ma;

				///////////////////////////////////////////////////////

				/**
				 * Exponential moving average
				 */
				 
				 
				var ema = function (serie, period, targetAttr, newAttr) 
				{
				  if (typeof serie[0] == "object" && !targetAttr)
					throw new Error("targetAttr not provided");
				  newAttr = utils.valueIfUndef (newAttr, "ema");
				  var emaValues = new Array();
				  var k = (2/(period+1));
				  var initSlice = serie.slice (0, period);
				  var previousDay = vectors.avgVector (initSlice, targetAttr);
				  emaValues.push(previousDay);
				  var emaSlice = serie.slice (period);
				  emaSlice.forEach (function (elem)
				  {
					var value = utils.isUndef(targetAttr) ? elem : elem[targetAttr]
					previousDay = value * k + previousDay * (1-k)
					emaValues.push (previousDay);
				  });
				  var newSerie = serie.slice();
				  return utils.reverseAppend(newSerie, emaValues, newAttr);
				}
				//module.exports.ema = ema;

				///////////////////////////////////////////////////////

				/**
				 * Weighted moving average.
				 * The order of the mean (the number of elements to sum) is based on the weight's length.
				 * The sum of weights should be 1.
				 */
				var wma = function (series, weights, targetAttr)
				{
				  targetAttr = utils.valueIfUndef(targetAttr, ["c"]);
				  var sumWindow = function (elems) {
					var sum = 0;
					elems.forEach(function(elem,i) {
					  sum = sum + (utils.resolveParam(elem, targetAttr) * weights[i]);
					});
					return (sum/elems.length);
				  };
				  var wmaValues = utils.windowOp (series, weights.length, sumWindow);
				  return utils.reverseAppend(series, wmaValues, "wma");
				};
				//module.exports.wma = wma;




window.TrendyWaysAverages = {
  ma: ma,
  ema: ema,
  wma: wma
};




			//var Avg = require ("./averages")




//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


//====================trendways==============================	

/*

	(function(f){
				
		if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tw = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

			"use strict";

*/

			//var utils = require ("./utils")
			//var vectors = require ("./vectors")
			
			var utils = window.TrendyWaysUtils;
			var vectors = window.TrendyWaysVectors;
			
			
			

			/*
			 * Moving Average: 
			 * also known as simple moving average, rolling average, moving mean
			 * and a million of similar combinations
			 */
			var ma = function (values, order, targetAttr, outputAttr) {
			  targetAttr = utils.valueIfUndef(targetAttr, ["c"]);
			  outputAttr = utils.valueIfUndef(outputAttr, "ma");
			  var sumWindow = function (serie) {
				var sum = 0;
				for (var init = 0; init < serie.length; init++) {
				  sum += utils.resolveParam(serie[init], targetAttr);
				}
				return (sum/serie.length);
			  };
			  var newVal = utils.windowOp (values, order, sumWindow);
			  return utils.reverseAppend(values, newVal, outputAttr);
			}
			//module.exports.ma = ma;

			///////////////////////////////////////////////////////

			/**
			 * Exponential moving average
			 */
			var ema = function (serie, period, targetAttr, newAttr) 
			{
			  if (typeof serie[0] == "object" && !targetAttr)
				throw new Error("targetAttr not provided");
			  newAttr = utils.valueIfUndef (newAttr, "ema");
			  var emaValues = new Array();
			  var k = (2/(period+1));
			  var initSlice = serie.slice (0, period);
			  var previousDay = vectors.avgVector (initSlice, targetAttr);
			  emaValues.push(previousDay);
			 
			 var emaSlice = serie.slice (period);
			  emaSlice.forEach (function (elem)
			  {
				var value = utils.isUndef(targetAttr) ? elem : elem[targetAttr]
				previousDay = value * k + previousDay * (1-k)
				emaValues.push (previousDay);
			  });
			  var newSerie = serie.slice();
			  return utils.reverseAppend(newSerie, emaValues, newAttr);
			}
			//module.exports.ema = ema;

			///////////////////////////////////////////////////////

			/**
			 * Weighted moving average.
			 * The order of the mean (the number of elements to sum) is based on the weight's length.
			 * The sum of weights should be 1.
			 */
			var wma = function (series, weights, targetAttr)
			{
			  targetAttr = utils.valueIfUndef(targetAttr, ["c"]);
			  var sumWindow = function (elems) {
				var sum = 0;
				elems.forEach(function(elem,i) {
				  sum = sum + (utils.resolveParam(elem, targetAttr) * weights[i]);
				});
				return (sum/elems.length);
			  };
			  var wmaValues = utils.windowOp (series, weights.length, sumWindow);
			  return utils.reverseAppend(series, wmaValues, "wma");
			};
			
		
			//module.exports.wma = wma;



			//},{"./utils":4,"./vectors":5}],2:[function(require,module,exports){

			/**
			 * @description Max value in a series
			 * @param{array} values array of numerical values
			 * @returns {value} the max element in the series
			 */
			var max = function (values) {
			  var ret = Number.MIN_VALUE
			  for (var i = 0; i < values.length; i++) {
				if (values[i] > ret) {
				  ret = values[i];
				}
			  }
			  return ret;
			}
			//module.exports.max = max

			//////////////////////////////////////////////////////////

			/**
			 * @description Min value in a series
			 * @param {array} values array of numerical values
			 * @returns {value} min value in the series
			 */
			var min = function (values) {
			  var ret = Number.MAX_VALUE
			  for (var i = 0; i < values.length; i++) {
				if (values[i] < ret) {
				  ret = values[i];
				}
			  }
			  return ret;
			}
			//module.exports.min = min

			//////////////////////////////////////////////////////////

			/**
			 * @description Mean of values in a serie
			 * @param {array} values array of numerical values
			 * @return {value} mean of the series
			 */
			var mean = function (values, targetAttr) {
			  var mean = 0;
			  if (values.length == 0)
				return mean;
			  for (var i = 0; i < values.length; i++) {
				  mean += isUndef(targetAttr) ? values[i] : values[i][targetAttr]
			  }
			  return mean/values.length;
			}
			//module.exports.mean = mean

			//////////////////////////////////////////////////////////

			/**
			 * @description Standar deviation of values in a serie.
			 * @param {array} values array of numerical values
			 * @return {value} standard deviation of the series values.
			 */
			var sd = function (values, targetAttr) {
			  var meanVal = mean(values, targetAttr);
			  var sqrSum = 0;
			  for (var i = 0; i < values.length; i++) {
				var value = isUndef(targetAttr) ? values[i] : values[i][targetAttr]
				sqrSum += Math.pow(value-meanVal, 2);
			  }
			  return Math.sqrt (sqrSum/values.length);
			}
			//module.exports.sd = sd

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the MSE error of two series
			 * @param{array} series1 values array
			 * @param{array} series2 values array
			 * @return{value} the mse error
			 */
			var mse = function (series1, series2)
			{
			  return avgVector (powVector (diffVectors(series1, series2)));
			}
			//module.exports.mse = mse;

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the RMSE error (squared MSE)
			 * @param{array} series1 values array
			 * @param{array} series2 values array
			 * @return{value} the RMSE error
			 */
			var rmse = function (series1, series2)
			{
			  return Math.sqrt (mse(series1, series2));
			}
			//module.exports.rmse = rmse;

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the MAE erro (mean absolute error)
			 * @param{array} series1 values array
			 * @param{array} series2 values array
			 * @return{value} the mae error
			 */
			var mae = function (series1, series2)
			{
			  return avgVector(absVector(diffVectors(series1, series2)));
			}
			//module.exports.mae = mae;

			//},{}],3:[function(require,module,exports){

/*
			var utils = require ("./utils")
			var vectors = require ("./vectors")

			"use strict";

*/
			/**
			 * @description Average Directional Index (ADX)
			 * @param {array} list of _ohlc_ values
			 * @return {array} the afx values list
			 *
			 * Source: http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:average_directional_index_adx
			 */
			var adx = function (values) {
				var dmWindow = function (serie) {
					var sum = 0
					var todayMax = serie[1].h - serie[0].h
					var todayMin = serie[0].l - serie[1].l
				var dmPos = 0, dmNeg = 0
					if (todayMax > 0 || todayMin > 0) {
						dmPos = todayMax > todayMin ? Math.abs(todayMax) : 0
						dmNeg = todayMax < todayMin ? Math.abs(todayMin) : 0
					}
					else {
						dmPos = 0;
						dmNeg = 0;
					}
					var tr = Math.max(Math.abs(serie[1].h - serie[1].l), 
						Math.abs(serie[1].h - serie[0].c), 
						Math.abs(serie[1].l - serie[0].c));
					return {dmp:dmPos, dmn:dmNeg, tr:tr}
				}
				var result = utils.windowOp(values, 2, dmWindow);
				result.unshift({dmp:0, dmn:0, tr:0});

				var firstTr14 = vectors.sumVector(result.slice(0, 15), "tr"),
					firstDM14Pos = vectors.sumVector(result.slice(0,15), "dmp"),
					firstDM14Neg = vectors.sumVector(result.slice(0,15), "dmn");
				result[14].tr14 = firstTr14;
				result[14].dmp14 = firstDM14Pos;
				result[14].dmn14 = firstDM14Neg;
				result[14].di14p = 100 * (result[14].dmp14 / result[14].tr14);
				result[14].di14n = 100 * (result[14].dmn14 / result[14].tr14);
				result[14].diff = Math.abs(result[14].di14p - result[14].di14n);
				result[14].sum = result[14].di14p + result[14].di14n;
				result[14].dx = 100 * (result[14].diff / result[14].sum);
				for (var i = 15; i < result.length; i++) {
					result[i].tr14 = result[i-1].tr14 - (result[i-1].tr14/14) + result[i].tr;
					result[i].dmp14 = result[i-1].dmp14 - (result[i-1].dmp14/14) + result[i].dmp;
					result[i].dmn14 = result[i-1].dmn14 - (result[i-1].dmn14/14) + result[i].dmn;

					result[i].di14p = 100 * (result[i].dmp14 / result[i].tr14);
					result[i].di14n = 100 * (result[i].dmn14 / result[i].tr14);
					result[i].diff = Math.abs(result[i].di14p - result[i].di14n);
					result[i].sum = result[i].di14p + result[i].di14n;
					result[i].dx = 100 * (result[i].diff / result[i].sum);
					if (i >= 28) {
						if (i == 28)
							adx = vectors.avgVector(result.slice(i-14, i), "dx")
						else {
							adx = ((result[i-1].adx * 13 ) + result[i].dx)/14
						}
						result[i].adx = adx;
					}
				}
				return result;
			}
			//module.exports.adx = adx;

/*
			"use strict";

			var utils = require ("./utils")
			var vectors = require ("./vectors")

*/


			/*
			 * Moving Average: 
			 * also known as simple moving average, rolling average, moving mean
			 * and a million of similar combinations
			 */
			var ma = function (values, order, targetAttr, outputAttr) {
			  targetAttr = utils.valueIfUndef(targetAttr, ["c"]);
			  outputAttr = utils.valueIfUndef(outputAttr, "ma");
			  var sumWindow = function (serie) {
				var sum = 0;
				for (var init = 0; init < serie.length; init++) {
				  sum += utils.resolveParam(serie[init], targetAttr);
				}
				return (sum/serie.length);
			  };
			  var newVal = utils.windowOp (values, order, sumWindow);
			  return utils.reverseAppend(values, newVal, outputAttr);
			}
			//module.exports.ma = ma;

			///////////////////////////////////////////////////////

			/**
			 * Exponential moving average
			 */
			var ema = function (serie, period, targetAttr, newAttr) 
			{
			  if (typeof serie[0] == "object" && !targetAttr)
				throw new Error("targetAttr not provided");
			  newAttr = utils.valueIfUndef (newAttr, "ema");
			  var emaValues = new Array();
			  var k = (2/(period+1));
			  var initSlice = serie.slice (0, period);
			  var previousDay = vectors.avgVector (initSlice, targetAttr);
			  emaValues.push(previousDay);
			  var emaSlice = serie.slice (period);
			  emaSlice.forEach (function (elem)
			  {
				var value = utils.isUndef(targetAttr) ? elem : elem[targetAttr]
				previousDay = value * k + previousDay * (1-k)
				emaValues.push (previousDay);
			  });
			  var newSerie = serie.slice();
			  return utils.reverseAppend(newSerie, emaValues, newAttr);
			}
			//module.exports.ema = ema;

			///////////////////////////////////////////////////////

			/**
			 * Weighted moving average.
			 * The order of the mean (the number of elements to sum) is based on the weight's length.
			 * The sum of weights should be 1.
			 */
			var wma = function (series, weights, targetAttr)
			{
			  targetAttr = utils.valueIfUndef(targetAttr, ["c"]);
			  var sumWindow = function (elems) {
				var sum = 0;
				elems.forEach(function(elem,i) {
				  sum = sum + (utils.resolveParam(elem, targetAttr) * weights[i]);
				});
				return (sum/elems.length);
			  };
			  var wmaValues = utils.windowOp (series, weights.length, sumWindow);
			  return utils.reverseAppend(series, wmaValues, "wma");
			};
			//module.exports.wma = wma;



/*
			"use strict";

			var Utils = require ("./utils") 

*/


			//var Avg = require ("./averages")
			
			var averages = window.TrendyWaysAverages;


/*

Donc le flux final pour ton fichier autonome sera :

1️⃣ TrendyWaysUtils → exposé sur window
2️⃣ TrendyWaysStats → exposé sur window
3️⃣ TrendyWaysVectors → exposé sur window
4️⃣ TrendyWaysAverages → exposé sur window
5️⃣ TrendyWays principal :

*/

/*

var utils = window.TrendyWaysUtils;
var vectors = window.TrendyWaysVectors;
var averages = window.TrendyWaysAverages; // <- ici

*/


// début du TrendyWays principal
var utils = window.TrendyWaysUtils;
var vectors = window.TrendyWaysVectors;
var averages = window.TrendyWaysAverages;



			/*
			 * Returns the Bollinger Band values as an object
			 * containing three arrays:
			 *         - the upper values (upperBand),
			 *         - central moving average values (ma),
			 *         - lower band values (lowerBand).
			 *         
			 * Params: list - values
			 *         n - size of the sample window
			 *         k - height of the band (sd multiplier)
			 * Usual values are n = 20 and k = 2 (i.e. the base
			 * moving average is calculated on the previous 20 
			 * elems for a elem and upper and lower bands are
			 * located +2*sd and -2*sd from the central moving average.
			 */
			var bollinger = function (list, n, k, targetAttr) {
			  targetAttr = window.TrendyWaysUtils.valueIfUndef(targetAttr, ["c"])
			  var movingAvg = window.TrendyWaysAverages.ma (list, n, targetAttr);
			  var movingSd = window.TrendyWaysUtils.windowOp (list, n, sd, targetAttr);
			  var upperBand = new Array();
			  var lowerBand = new Array();
			  var movingAvgElem = 0;
			  var movingSdElem = 0;
			  var result = new Array();
			  for (var index = 0; index < movingSd.length; index++) {
				movingAvgElem = movingAvg[index].ma;
				movingSdElem = movingSd[index] * k;
				upperBand.push (movingAvgElem + movingSdElem);
				lowerBand.push (movingAvgElem - movingSdElem);
				result.push({ma: movingAvg[index].ma, ub: movingAvgElem + movingSdElem, lb: movingAvgElem - movingSdElem});
			  }
			  return result;
			}
			//module.exports.bollinger = bollinger;
			
/*			
			"use strict";

			var utils = require ("./utils")
			var vectors = require ("./vectors")
			var averages = require ("./averages")

*/
			/**
			 * @description On-Balance Volume (obv).
			 * @param {array} closeList list of closing prices
			 * @param {array} volumeList list of volumes
			 * @return {array} the OBV values list
			 */
			var obv = function (closeList, volumeList)
			{
			  var result = [];
			  var prevObv = volumeList[0];
			  result.push (prevObv);
			  for (var i = 1; i < closeList.length; i++)
			  {
				if (closeList[i] > closeList[i-1])
				{
				  // bullish
				  result.push (prevObv + volumeList[i]);
				  prevObv += volumeList[i];
				}
				else if (closeList[i] < closeList[i-1])
				{
				  // bearish
				  result.push (prevObv - volumeList[i]);
				  prevObv -= volumeList[i];
				}
				else 
				{
				  result.push (prevObv);
				}
			  }
			  return result;
			}
			//module.exports.obv = obv;

			/**
			 * @description Returns the VPT (Volume-price Trend)
			 * @param {array} closeList list of closing prices
			 * @param {array} volumeList list of volume
			 * @return {array} vpt values array
			 */
			var vpt = function (closeList, volumeList)
			{
			  var result = [];
			  var vpt = volumeList[0]
			  result.push (vpt);
			  for (var i = 1; i < closeList.length; i++)
			  {
				var newVpt = vpt + volumeList[i] * ((closeList[i] - closeList[i-1])/closeList[i-1])
				result.push (newVpt);
				vpt = newVpt;
			  }
			  return result;
			}
			//module.exports.vpt = vpt;

			/**
			 * @description Returns the Money-flow Index
			 * @param {array} highPrices list of high prices
			 * @param {array} lowPrices list of low prices
			 * @param {array} closePrices list of closing prices
			 * @param {array} volumes list of volumes
			 * @return {value} the money-flow index
			 */
			var mfi = function (values)
			{
			  var typicalMoney = [];
			  var moneyFlow = [];
			  for (var i = 0; i < values.length; i++)
			  {
				var tpMoney = (values[i].h + values[i].l + values[i].c) / 3;
				typicalMoney.push(tpMoney);
				moneyFlow.push (tpMoney * values[i].v);
			  }

			  var posMoneyFlow = [];
			  var negMoneyFlow = [];
			  for (var i = 0; i < typicalMoney.length-1; i++)
			  {
				if (typicalMoney[i] <= typicalMoney[i+1])
				{
				  posMoneyFlow.push (moneyFlow[i+1]);
				  negMoneyFlow.push(0);
				}
				else if (typicalMoney[i] > typicalMoney[i+1])
				{
				  posMoneyFlow.push (0);
				  negMoneyFlow.push (moneyFlow[i+1]);
				}
				else // typical money unchanged implies day is discharged
				{
					posMoneyFlow.push(0);
					negMoneyFlow.push(0);
				}
			  }

			  var sumPosFlow = utils.windowOp (posMoneyFlow, 14, sumVector);
			  var sumNegFlow = utils.windowOp (negMoneyFlow, 14, sumVector);
			  var moneyRatio = vectors.divVector (sumPosFlow, sumNegFlow);

			  var mfi = [];
			  moneyRatio.forEach (function (value)
			  {
				mfi.push (100 - (100/(1+value)));
			  });
			  return utils.reverseAppend (values, mfi, "mfi");
			}
			//module.exports.mfi = mfi;

			////////////////////////////////////////////

			/**
			 * @description Returns the MACD
			 * @param {array} closePrices list of closing prices
			 * @return {object} object containing the macd, signal
			 *                  and hist series.
			 */
			var macd = function (closeValues, targetAttr)
			{
			  targetAttr = utils.valueIfUndef(targetAttr, ["c"])
			  var slow = 26;
			  var fast = 12;
			  var signal = 9;
			  var slowEMA = averages.ema (closeValues, slow, targetAttr, "slowema");
			  var fastEMA = averages.ema (closeValues, fast, targetAttr, "fastema");
			  var macdLine = vectors.combineVectors (slowEMA, fastEMA, function (slow,fast) {
				if (slow.slowema == 0 || utils.isUndef(slow.slowema))
				{
				  return ({macd:0}); // avoid div by 0
				};
				return ({macd:100 * ((fast.fastema/slow.slowema) - 1)});
			  });
			  var signalLine = averages.ema (macdLine.slice(25), signal, "macd"); // avoid first 25 (padding)
			  for (var i = 0; i < 25; i++)
			  {
				signalLine.unshift({macd:0}); // append again 25 zeros
			  }
			  var histLine = vectors.diffVectors(macdLine, signalLine, "macd");
			  utils.fill(signalLine, "ema", 0);
			  var macdItems = [];
			  for (var i = 0; i < macdLine.length; i++) {
				macdItems.push({macd:{line:macdLine[i].macd, signal:signalLine[i].ema, hist:histLine[i]}});
			  }
			  var returnList = closeValues.slice()
			  return utils.reverseAppend (returnList, macdItems, "macd");
			}
			//module.exports.macd = macd;

			////////////////////////////////////////////

			/**
			 * @description Returns the Momentum
			 * @param {array} closePrices list of closing prices
			 * @param {value} order order of the momentum 
			 * @returns {array} list containing the momentum series
			 * @example 
			 * var m = momemtum ([12,34,23, 81], 1) 
			 * console.log(m)  // [22, -11, 58]
			 */
			var momentum = function(values, order)
			{
			  var momentumN = function (chunk)
			  {
				return chunk[chunk.length-1].c - chunk[0].c
			  };
			  var returnValues = values.slice()
			  var newValues = utils.windowOp (values, order+1, momentumN);
			  return utils.reverseAppend(returnValues, newValues, "mom")
			}
			//module.exports.momentum = momentum;

			////////////////////////////////////////////

			/**
			 * @description Returns the Rate of Change value (ROC)
			 * @param {array} closePrices list of closing prices
			 * @param {value} order order of the ROC
			 * @returns {array} list containing the ROC series
			 * @example 
			 * var roc = roc ([12, 11, 15, 10], 1) 
			 * console.log(roc)  // [-0.09, 0.36, -0.33]
			 */
			var roc = function(values, order, targetAttr)
			{
			  var rocN = function (chunk)
			  {
				return (chunk[chunk.length-1].c - chunk[0].c) / chunk[0].c;
			  };
			  var returnValues = values.slice()
			  var rocValues = utils.windowOp (values, order+1, rocN);
			  return utils.reverseAppend(returnValues, rocValues, "roc");
			}
			//module.exports.roc = roc;

			////////////////////////////////////////////
			/**
			 * @description Returns the RSI (Relative Strength Index)
			 * @param {array} closePrices list of closing prices
			 * @param {value} order RSI order (typically 14)
			 * @returns {array} list containing the RSI for each period
			 * @example 
			 * var rsi = rsi ([45.34, 44, ..., 42,9, 45.23], 14) 
			 * console.log(rsi)  // [70.53, 66.32, ..., 56.05]
			 */
			var rsi = function (values, order)
			{
			  if (values.length < order+1)
			  {
				return [-1]; // not enough params
			  }
			  var gains = [];
			  var losses = [];
			  for (var i = 0; i < values.length-1; i++)
			  {
				var diff = values[i+1].c - values[i].c;
				if (diff > 0) 
				{
				  gains.push(diff);
				  losses.push(0);
				}
				else if (diff < 0)
				{
				  gains.push(0);
				  losses.push(Math.abs(diff));
				}
				else
				{
				  gains.push(0);
				  losses.push(0);
				}
			  }
			  var result = [];
			  var avgGain = vectors.avgVector (gains.slice(0, order));
			  var avgLoss = vectors.avgVector (losses.slice (0, order));
			  var firstRS = avgGain / avgLoss;
			  result.push (100 - (100 / (1 + firstRS)));
			  for (var i = order; i < values.length-1; i++)
			  {
				var partialCurrentGain = ((avgGain * (order-1)) + gains[i]) / order;
				var partialCurrentLoss = ((avgLoss * (order-1)) + losses[i]) / order;
				var smoothedRS = partialCurrentGain / partialCurrentLoss;
				var currentRSI = 100 - (100 / (1 + smoothedRS))
				result.push(currentRSI);
				avgGain = partialCurrentGain;
				avgLoss = partialCurrentLoss;
			  }
			  var newValues = values.slice()
			  return utils.reverseAppend(newValues, result, "rsi");
			}
			//module.exports.rsi = rsi;

			//////////////////////////////
			/**
			 * @description Returns the ATR (Average True Value). ATR is provided after 14th element.
			 * @param {array} values containing {high,low,close}
			 * @param {number} period, default to 14
			 * @returns {array} list containing {tr,atr} values for each period.
			 * @example 
			 * var atr = atr ([{high:48.7, low:45.3, close:46}, ...])
			 * console.log(atr)  // [{tr:2.4, atr:0}, ... 13 empty atr's, ... ,{atr:_value_, tr:_value_} ]
			 */

			var atr = function (values, p) {
			  p = valueIfUndef(p, 14);
			  var results = [];
			  for (var i = 0; i < values.length; i++) {
				if (i == 0) {
				  results.push({tr:values[i].h - values[i].l, atr:0})
				}
				else {
				  var hl = values[i].h - values[i].l;
				  var hcp = Math.abs(values[i].h - values[i-1].c);
				  var lcp = Math.abs(values[i].l - values[i-1].c);
				  var tr = Math.max(hl,hcp,lcp);
				  var atr = 0;
				  if (i == p-1) {
					atr = tr;
					for (var j = 0; j < results.length; j++) {
					  atr += results[j].tr;
					}
					atr = atr / p;
				  }
				  else if (i > (p-1)) {
					atr = ((results[i-1].atr * (p-1) + tr) / p);
				  }
				  results.push({tr:tr, atr:atr});
				}
			  }
			  var newValues = values.slice()
			  return utils.reverseAppend(newValues, results, "at");
			}
			//module.exports.atr = atr;

			/**
			 * @description Max value in a series
			 * @param{array} values array of numerical values
			 * @returns {value} the max element in the series
			 */
			var max = function (values) {
			  var ret = Number.MIN_VALUE
			  for (var i = 0; i < values.length; i++) {
				if (values[i] > ret) {
				  ret = values[i];
				}
			  }
			  return ret;
			}
			//module.exports.max = max

			//////////////////////////////////////////////////////////

			/**
			 * @description Min value in a series
			 * @param {array} values array of numerical values
			 * @returns {value} min value in the series
			 */
			var min = function (values) {
			  var ret = Number.MAX_VALUE
			  for (var i = 0; i < values.length; i++) {
				if (values[i] < ret) {
				  ret = values[i];
				}
			  }
			  return ret;
			}
			//module.exports.min = min

			//////////////////////////////////////////////////////////

			/**
			 * @description Mean of values in a serie
			 * @param {array} values array of numerical values
			 * @return {value} mean of the series
			 */
			var mean = function (values, targetAttr) {
			  var mean = 0;
			  if (values.length == 0)
				return mean;
			  for (var i = 0; i < values.length; i++) {
				  mean += isUndef(targetAttr) ? values[i] : values[i][targetAttr]
			  }
			  return mean/values.length;
			}
			//module.exports.mean = mean

			//////////////////////////////////////////////////////////

			/**
			 * @description Standar deviation of values in a serie.
			 * @param {array} values array of numerical values
			 * @return {value} standard deviation of the series values.
			 */
			var sd = function (values, targetAttr) {
			  var meanVal = mean(values, targetAttr);
			  var sqrSum = 0;
			  for (var i = 0; i < values.length; i++) {
				var value = isUndef(targetAttr) ? values[i] : values[i][targetAttr]
				sqrSum += Math.pow(value-meanVal, 2);
			  }
			  return Math.sqrt (sqrSum/values.length);
			}
			//module.exports.sd = sd

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the MSE error of two series
			 * @param{array} series1 values array
			 * @param{array} series2 values array
			 * @return{value} the mse error
			 */
			var mse = function (series1, series2)
			{
			  return avgVector (powVector (diffVectors(series1, series2)));
			}
			//module.exports.mse = mse;

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the RMSE error (squared MSE)
			 * @param{array} series1 values array
			 * @param{array} series2 values array
			 * @return{value} the RMSE error
			 */
			var rmse = function (series1, series2)
			{
			  return Math.sqrt (mse(series1, series2));
			}
			//module.exports.rmse = rmse;

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the MAE erro (mean absolute error)
			 * @param{array} series1 values array
			 * @param{array} series2 values array
			 * @return{value} the mae error
			 */
			var mae = function (series1, series2)
			{
			  return avgVector(absVector(diffVectors(series1, series2)));
			}
			//module.exports.mae = mae;
			

/*			
			"use strict";

			var Utils = require ("./utils")
*/


			/**
			 * Returns the Floor pivot level, three support levels (s1,s2 and s3)
			 * and three resistance levels (r1, r2 and r3) of the
			 * given data series.
			 * These values for a given day are calculated based on the day before
			 * so expect n values as output for a given list of n days.
			 * Note that all three must have the same length.
			 * Params: - higList: list of high values
			 *         - lowList: list of low values
			 *         - cliseList: list of closing values
			 * The result is a list of elements with fields:
			 *         - r3: resistence third level
			 *         - r2: resistance second level
			 *         - r1: resistance first level
			 *         - pl: pivot level
			 *         - s3: support third level
			 *         - s2: support second level
			 *         - s1: support first level
			 */
			var floorPivots = function (values) {
			  var result = new Array();
			  for (var i = 0; i < values.length; i++)
			  {
				var pivotLevel = (values[i].h + values[i].l + values[i].c) / 3;
				var r1 = 2 * pivotLevel - values[i].l;
				var r2 = pivotLevel + values[i].h - values[i].l;
				var r3 = r1 + values[i].h - values[i].l;
				var s1 = 2 * pivotLevel - values[i].h;
				var s2 = pivotLevel - values[i].h + values[i].l;
				var s3 = s1 - values[i].h + values[i].l;
				var elem = {r3:r3, r2:r2, r1:r1, pl: pivotLevel, s1:s1, s2:s2, s3:s3};
				result.push(elem);
			  }
			  return window.TrendyWaysUtils.reverseAppend(values, result, "floor");
			}
			//module.exports.floorPivots = floorPivots;

			////////////////////////////////////////////////////////

			/**
			 * Returns the Tom Demark points, the predicted low and highs
			 * of the period.
			 * These values for a given day are calculated based on the day before
			 * so expect n values as output for a given list of n days.
			 * The result is a list of elements with fields:
			 *         - low: predicted low value.
			 *         - high: predicted high value.
			 */
			var tomDemarksPoints = function (values) {
			  var result = new Array();
			  for (var i = 0; i < values.length; i++)
			  {
				var x = 0;
				if (values[i].c < values[i].o)
				{
				  x = values[i].h + (2 * (values[i].l) + values[i].c);
				}
				if (values[i].c > values[i].o)
				{
				  x = (2 * values[i].h) +  values[i].l + values[i].c;
				}
				if (values[i].c == values[i].o)
				{
				  x = values[i].h + values[i].l + (2 * values[i].c);
				}
				var newHigh = (x/2) - values[i].l;
				var newLow = (x/2) - values[i].h;
				var elem = {l: newLow, h: newHigh};
				result.push(elem);
			  }
			  return utils.reverseAppend(values, result, "tom");
			}
			//module.exports.tomDemarksPoints = tomDemarksPoints;

			////////////////////////////////////////////////////////

			/**
			 * Returns the Woodies points: pivot, supports (s1 and s2) and
			 * resistance values (r1 and r2).
			 * These values for a given day are calculated based on the day before
			 * so expect n values as output for a given list of n days.
			 * The result is a list of elements with fields:
			 *         - pivot: predicted pivot value.
			 *         - s1: predicted support (s1).
			 *         - r1: predicted resistance (r1).
			 *         - r2: predicted secondary resistance (r2).
			 *         - s2: predicted secondary support (s2).
			 */
			var woodiesPoints = function (values) {
			  var result = new Array();
			  for (var i = 0; i < values.length; i++)
			  {
				var x = 0;
				var pivot = (values[i].h + values[i].l + 2 * values[i].c) / 4;
				var r1 = (2 * pivot) - values[i].l;
				var r2 = pivot + values[i].h - values[i].l;
				var s1 = (2 * pivot) - values[i].h;
				var s2 = pivot - values[i].h + values[i].l;
				var elem = {pivot: pivot, r1: r1, s1: s1, s2: s2, r2: r2};
				result.push(elem);   
			  }
			  return utils.reverseAppend (values, result, "wood");
			}
			//module.exports.woodiesPoints = woodiesPoints;

			////////////////////////////////////////////////////////

			/**
			 * Returns the Camarilla points: supports (s1,s2,3 and s4)) and
			 * resistance values (r1, r2, r3 and r4).
			 * The result is a list of elements with fields:
			 *         - s1: predicted s1 support.
			 *         - s2: predicted s2 support.
			 *         - s3: predicted s3 support.
			 *         - s4: predicted s4 support.
			 *         - r1: predicted r1 resistance.
			 *         - r2: predicted r2 resistance.
			 *         - r3: predicted r3 resistance.
			 *         - r4: predicted r4 resistance.
			 */
			var camarillaPoints = function (values) {
			  var result = new Array();
			  for (var i = 0; i < values.length; i++)
			  {
				var diff = values[i].h - values[i].l;
				var r4 = (diff * 1.1) / 2 + values[i].c;
				var r3 = (diff *1.1) / 4 + values[i].c;
				var r2 = (diff * 1.1) / 6 + values[i].c;
				var r1 = (diff * 1.1) / 12 + values[i].c;
				var s1 = values[i].c - (diff * 1.1 / 12);
				var s2 = values[i].c - (diff *1.1 /6);
				var s3 = values[i].c - (diff * 1.1 / 4);
				var s4 = values[i].c - (diff *1.1 / 2);
				var elem = {r4: r4, r3: r3, r2: r2, r1: r1, s1: s1, s2: s2, s3: s3, s4: s4};
				result.push(elem);
			  }
			  return reverseAppend(values, result, "cam");
			}
			//module.exports.camarillaPoints = camarillaPoints;

			////////////////////////////////////////////////////////

			var fibonacciRetrs = function (values, trend)
			{
			  var result = new Array();
			  var retracements = [1, 0.618, 0.5, 0.382, 0.236, 0];
				for (var i = 0; i < values.length; i++) {
				  var diff = values[i].h - values[i].l;
				  var elem = new Array();
				  for (var r = 0; r < retracements.length; r++)
				  {
					var level = 0;
					if (trend == 'DOWNTREND')
					  level = values[i].h - diff * retracements[r];
					else
					  level = values[i].l + diff * retracements[r];
					elem.push(level);
				  }
				  result.push(elem);
				}
			  return result
			}
			//module.exports.fibonacciRetrs = fibonacciRetrs;

			//"use strict";

			/**
			 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
			 * @param {object} objects list
			 * @param {attrs} list of attributes to look for
			 * @return {value} object attribute
			 */
			var resolveParam = function (obj, attrs) {
			  for (var i = 0; i < attrs.length; i++) {
				var field = attrs[i]
				if (obj[field] != undefined)
				  return obj[field]
				else
				  return obj
			  }
			  throw new Error( "No valid (" + attrs + ") found in obj");
			}
			//module.exports.resolveParam = resolveParam

			/**
			 * @description returns the given value if the object is undefined
			 * @param {obj} object to check
			 * @param {val} value to return
			 */
			var valueIfUndef = function (obj, val) {
			  return isUndef(obj) ? val : obj;
			}
			//module.exports.valueIfUndef = valueIfUndef

			var isUndef = function (obj) {
			  return typeof obj === "undefined";
			}
			//module.exports.isUndef = isUndef;

			var reverseAppend = function (refList, addList, field) {
			  if (isUndef(field))
				throw new Error ("Unable to append values, no field given")
			  if (typeof refList[0] !== "object") {
				return addList;
			  }
			  addList.forEach (function (add, i) {
				refList[refList.length-addList.length+i][field] = add[field] ? add[field] : add;
			  })
			  return refList;
			}
			//module.exports.reverseAppend = reverseAppend

			var flat = function (list, attr) {
			  return list.map (function (i) {
				return isUndef(i[attr]) ? 0 : i[attr];
			  });
			}
			//module.exports.flat = flat

			var fill = function (list, attr, defaultValue) {
			  list.forEach(function(l) {
				if (isUndef(l[attr]))
				  l[attr] = defaultValue;
			  });
			}
			//module.exports.fill = fill

			/**
			 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
			 * @param {array} values values array
			 * @param {value} value size of the window
			 * @param {function} fun function to apply on each chunk
			 * @return {array} values returned by the given function in each chunck
			 */
			var windowOp = function (values, value, fun, targetAttr) {
			  var result = new Array();
			  for (var i = value; i <= values.length; i++)
			  {
				var windowVal = fun (values.slice(i-value, i), targetAttr);
				result.push (windowVal);
			  }
			  return result;
			}
			//module.exports.windowOp = windowOp


/*
			var utils = require ("./utils");
			var stats = require ("./statistics");

*/

			/**
			 * @description Alternative forEach for all those browsers like IE8 and below
			 * @param {function} function to apply to each element
			 * @param {scope} scope
			 */
			if ( !Array.prototype.forEach ) {
			  Array.prototype.forEach = function(fn, scope)
			  {
				for(var i = 0, len = this.length; i < len; ++i)
				{
				  if (i in this)
				  {
					fn.call(scope, this[i], i, this);
				  }
				}
			  };
			}

			////////////////////////////////////////////////////////

			/**
			 * @description Returns a vector containing the difference of the parameters.
			 * @param {array} series1 first values array
			 * @param {array} series2 second values array
			 * @return {array} series1 - series2
			 */
			var diffVectors = function (series1, series2, targetAttr)
			{
			  var size = stats.max([series1.length, series2.length])
			  var result = [];
			  var s1Size = series1.length;
			  var s2Size = series2.length;
			  for (var i = 0; i < size; i++)
			  {
				var itemS1 = 0;
				var itemS2 = 0;
				if (s1Size > i)
				{
				  itemS1 = utils.isUndef(targetAttr) ? series1[i] : series1[i][targetAttr];
				}
				if (s2Size > i)
				{
				  itemS2 = utils.isUndef(targetAttr) ? series2[i] : series2[i][targetAttr];
				}
				result.push (itemS1 - itemS2);
			  }
			  return result;
			}
			//module.exports.diffVectors = diffVectors

			////////////////////////////////////////////////////////

			/**
			 * @description Returns a vector to the 2nd power
			 * @param {array} serie values array
			 * @return {array} values array ^ 2
			 */
			var powVector = function (serie)
			{
			  var result = [];
			  var pow = function (x) {
				result.push (Math.pow(x, 2));
			  };
			  serie.forEach (pow);
			  return result;
			}
			//module.exports.powVector = powVector

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the sum of all elements in a vector
			 * @param {array} vector values array
			 * @returns {value} the sum of all elements
			 */
			var sumVector = function (values, targetAttr)
			{
			  var result = 0;
			  var sum = function (x) {
				if (utils.isUndef(x[targetAttr]))
				  result += x
				else
				  result += x[targetAttr]
			  }
			  values.forEach (sum);
			  return result;
			}
			//module.exports.sumVector = sumVector;
			////////////////////////////////////////////////////////

			/**
			 * @description Returns the average of the sum of all vector elements
			 * @param {array} vector values array
			 * @returns {value} the average of the all elements
			 */
			var avgVector = function (vector, targetAttr)
			{
			  var result = module.exports.sumVector (vector, targetAttr);
			  if (!vector.length)
				return 0;
			  else
				return result / vector.length;
			}
			//module.exports.avgVector = avgVector
			////////////////////////////////////////////////////////

			/**
			 * @description Returns the vector containing absolutes values of the input
			 * @param {array} vector values array
			 * @return {array} the absolute values of the given array
			 */
			var absVector = function (vector)
			{
			  var result = [];
			  vector.forEach (function ab(x)
			  {
				result.push(Math.abs(x));
			  });
			  return result;
			}
			//module.exports.absVector = absVector
			////////////////////////////////////////////////////////

			/**
			 * @description Returns the values of the first vector divided by the second
			 * @param {array} v1 values array
			 * @param {array} v2 values array
			 * @return {array} v1 / v2
			 */
			var divVector = function (v1, v2)
			{
			  var result = [];
			  for (var i = 0; i < v1.length; i++)
			  {
				result.push (v1[i] / v2[i]);
			  }
			  return result;
			}
			//module.exports.divVector = divVector
			////////////////////////////////////////////////////////

			/**
			 * @description Combine two vectors using the provided function.
			 * Both series must have the same length.
			 * @param {array} serie1
			 * @param {array} serie2
			 * @param {function} fun
			 * @return {array} values fun(serie1, serie2)
			 */
			var combineVectors = function (serie1, serie2, fun)
			{
			  if (serie1.length != serie2.length || serie1.length + serie2.length < 2)
			  {
				return [-1];
			  }
			  else
			  {
				var result = [];
				for (var i = 0; i < serie1.length; i++)
				{
				  result.push (fun(serie1[i], serie2[i]));
				}
				return result;
			  }
			}
			//module.exports.combineVectors = combineVectors

			//},{"./averages":1,"./statistics":2,"./utils":4,"./vectors":5}],4:[function(require,module,exports){

			//"use strict";

			/**
			 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
			 * @param {object} objects list
			 * @param {attrs} list of attributes to look for
			 * @return {value} object attribute
			 */
			var resolveParam = function (obj, attrs) {
			  for (var i = 0; i < attrs.length; i++) {
				var field = attrs[i]
				if (obj[field] != undefined)
				  return obj[field]
				else
				  return obj
			  }
			  throw new Error( "No valid (" + attrs + ") found in obj");
			}
			//module.exports.resolveParam = resolveParam

			/**
			 * @description returns the given value if the object is undefined
			 * @param {obj} object to check
			 * @param {val} value to return
			 */
			var valueIfUndef = function (obj, val) {
			  return isUndef(obj) ? val : obj;
			}
			//module.exports.valueIfUndef = valueIfUndef

			var isUndef = function (obj) {
			  return typeof obj === "undefined";
			}
			//module.exports.isUndef = isUndef;

			var reverseAppend = function (refList, addList, field) {
			  if (isUndef(field))
				throw new Error ("Unable to append values, no field given")
			  if (typeof refList[0] !== "object") {
				return addList;
			  }
			  addList.forEach (function (add, i) {
				refList[refList.length-addList.length+i][field] = add[field] ? add[field] : add;
			  })
			  return refList;
			}
			//module.exports.reverseAppend = reverseAppend

			var flat = function (list, attr) {
			  return list.map (function (i) {
				return isUndef(i[attr]) ? 0 : i[attr];
			  });
			}
			//module.exports.flat = flat

			var fill = function (list, attr, defaultValue) {
			  list.forEach(function(l) {
				if (isUndef(l[attr]))
				  l[attr] = defaultValue;
			  });
			}
			//module.exports.fill = fill

			/**
			 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
			 * @param {array} values values array
			 * @param {value} value size of the window
			 * @param {function} fun function to apply on each chunk
			 * @return {array} values returned by the given function in each chunck
			 */
			var windowOp = function (values, value, fun, targetAttr) {
			  var result = new Array();
			  for (var i = value; i <= values.length; i++)
			  {
				var windowVal = fun (values.slice(i-value, i), targetAttr);
				result.push (windowVal);
			  }
			  return result;
			}
			//module.exports.windowOp = windowOp

			//},{}],5:[function(require,module,exports){

			//var utils = require ("./utils");
			//var stats = require ("./statistics");
			
			
			
			/**
			 * @description Alternative forEach for all those browsers like IE8 and below
			 * @param {function} function to apply to each element
			 * @param {scope} scope
			 */
			if ( !Array.prototype.forEach ) {
			  Array.prototype.forEach = function(fn, scope)
			  {
				for(var i = 0, len = this.length; i < len; ++i)
				{
				  if (i in this)
				  {
					fn.call(scope, this[i], i, this);
				  }
				}
			  };
			}

			////////////////////////////////////////////////////////

			/**
			 * @description Returns a vector containing the difference of the parameters.
			 * @param {array} series1 first values array
			 * @param {array} series2 second values array
			 * @return {array} series1 - series2
			 */
			var diffVectors = function (series1, series2, targetAttr)
			{
			  var size = stats.max([series1.length, series2.length])
			  var result = [];
			  var s1Size = series1.length;
			  var s2Size = series2.length;
			  for (var i = 0; i < size; i++)
			  {
				var itemS1 = 0;
				var itemS2 = 0;
				if (s1Size > i)
				{
				  itemS1 = utils.isUndef(targetAttr) ? series1[i] : series1[i][targetAttr];
				}
				if (s2Size > i)
				{
				  itemS2 = utils.isUndef(targetAttr) ? series2[i] : series2[i][targetAttr];
				}
				result.push (itemS1 - itemS2);
			  }
			  return result;
			}
			//module.exports.diffVectors = diffVectors

			////////////////////////////////////////////////////////

			/**
			 * @description Returns a vector to the 2nd power
			 * @param {array} serie values array
			 * @return {array} values array ^ 2
			 */
			var powVector = function (serie)
			{
			  var result = [];
			  var pow = function (x) {
				result.push (Math.pow(x, 2));
			  };
			  serie.forEach (pow);
			  return result;
			}
			//module.exports.powVector = powVector

			////////////////////////////////////////////////////////

			/**
			 * @description Returns the sum of all elements in a vector
			 * @param {array} vector values array
			 * @returns {value} the sum of all elements
			 */
			var sumVector = function (values, targetAttr)
			{
			  var result = 0;
			  var sum = function (x) {
				if (utils.isUndef(x[targetAttr]))
				  result += x
				else
				  result += x[targetAttr]
			  }
			  values.forEach (sum);
			  return result;
			}
			//module.exports.sumVector = sumVector;
			////////////////////////////////////////////////////////

			/**
			 * @description Returns the average of the sum of all vector elements
			 * @param {array} vector values array
			 * @returns {value} the average of the all elements
			 */
			var avgVector = function (vector, targetAttr)
			{
			  
			  var result = module.exports.sumVector (vector, targetAttr);
			  
			  
			  if (!vector.length)
				return 0;
			  else
				return result / vector.length;
			}
			//module.exports.avgVector = avgVector
			////////////////////////////////////////////////////////

			/**
			 * @description Returns the vector containing absolutes values of the input
			 * @param {array} vector values array
			 * @return {array} the absolute values of the given array
			 */
			var absVector = function (vector)
			{
			  var result = [];
			  vector.forEach (function ab(x)
			  {
				result.push(Math.abs(x));
			  });
			  return result;
			}
			//module.exports.absVector = absVector
			////////////////////////////////////////////////////////

			/**
			 * @description Returns the values of the first vector divided by the second
			 * @param {array} v1 values array
			 * @param {array} v2 values array
			 * @return {array} v1 / v2
			 */
			var divVector = function (v1, v2)
			{
			  var result = [];
			  for (var i = 0; i < v1.length; i++)
			  {
				result.push (v1[i] / v2[i]);
			  }
			  return result;
			}
			//module.exports.divVector = divVector
			////////////////////////////////////////////////////////

			/**
			 * @description Combine two vectors using the provided function.
			 * Both series must have the same length.
			 * @param {array} serie1
			 * @param {array} serie2
			 * @param {function} fun
			 * @return {array} values fun(serie1, serie2)
			 */
			var combineVectors = function (serie1, serie2, fun)
			{
			  if (serie1.length != serie2.length || serie1.length + serie2.length < 2)
			  {
				return [-1];
			  }
			  else
			  {
				var result = [];
				for (var i = 0; i < serie1.length; i++)
				{
				  result.push (fun(serie1[i], serie2[i]));
				}
				return result;
			  }
			}
			//module.exports.combineVectors = combineVectors

			
			
			
			//},{"./statistics":2,"./utils":4}]},{},[3])(3)
			
			
	
	
	//});


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

/*

			  var result = module.exports.sumVector (vector, targetAttr);


*/


	// Exposition globale de toutes les fonctions TrendyWays
			window.TrendyWays = {
			  bollinger: bollinger,
			  obv: obv,
			  vpt: vpt,
			  mfi: mfi,
			  macd: macd,
			  momentum: momentum,
			  roc: roc,
			  rsi: rsi,
			  atr: atr,
			  max: max,
			  min: min,
			  mean: mean,
			  sd: sd,
			  mse: mse,
			  rmse: rmse,
			  mae: mae,
			  floorPivots: floorPivots,
			  tomDemarksPoints: tomDemarksPoints,
			  woodiesPoints: woodiesPoints,
			  camarillaPoints: camarillaPoints,
			  fibonacciRetrs: fibonacciRetrs,
			  resolveParam: resolveParam,
			  valueIfUndef: valueIfUndef,
			  isUndef: isUndef,
			  reverseAppend: reverseAppend,
			  flat: flat,
			  fill: fill,
			  windowOp: windowOp,
			  diffVectors: diffVectors,
			  powVector: powVector,
			  sumVector: sumVector,
			  avgVector: avgVector,
			  absVector: absVector,
			  divVector: divVector,
			  combineVectors: combineVectors
			};


/*
Après ça, dans ton HTML ou ton autre JS, tu peux appeler par exemple :

var macdResult = TrendyWays.macd(pricesArray);

*/



//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$



//====================Classe TextLookup==============================	




