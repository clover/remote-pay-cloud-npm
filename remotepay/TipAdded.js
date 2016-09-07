/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../Class.js");
var remotepay_BaseResponse = require("../remotepay/BaseResponse");

  /**
  * @constructor
  * @augments remotepay.BaseResponse
  * @memberof remotepay
  */
  TipAdded = Class.create(remotepay_BaseResponse, {
    /**
    * Initialize the values for this.
    * @memberof remotepay.TipAdded
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = TipAdded;
      this.tipAmount = undefined;
    },

    /**
    * Set the field value
    * Tip amount
    *
    * @memberof remotepay.TipAdded
    * @param {Number} tipAmount must be a long integer
    */
    setTipAmount: function(tipAmount) {
      this.tipAmount = tipAmount;
    },

    /**
    * Get the field value
    * Tip amount
    * @memberof remotepay.TipAdded
    * @return {Number} must be a long integer
    */
    getTipAmount: function() {
      return this.tipAmount;
    }
  });

TipAdded._meta_ =  {fields:  {}};
TipAdded._meta_.fields["tipAmount"] = {};
TipAdded._meta_.fields["tipAmount"].type = Number;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = TipAdded;
}

