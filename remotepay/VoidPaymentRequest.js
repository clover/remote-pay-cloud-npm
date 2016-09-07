/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../Class.js");
var remotepay_BaseRequest = require("../remotepay/BaseRequest");

  /**
  * @constructor
  * @augments remotepay.BaseRequest
  * @memberof remotepay
  */
  VoidPaymentRequest = Class.create(remotepay_BaseRequest, {
    /**
    * Initialize the values for this.
    * @memberof remotepay.VoidPaymentRequest
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = VoidPaymentRequest;
      this.orderId = undefined;
      this.paymentId = undefined;
      this.employeeId = undefined;
      this.voidReason = undefined;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof remotepay.VoidPaymentRequest
    * @param {String} orderId 
    */
    setOrderId: function(orderId) {
      this.orderId = orderId;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof remotepay.VoidPaymentRequest
    * @return {String} 
    */
    getOrderId: function() {
      return this.orderId;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof remotepay.VoidPaymentRequest
    * @param {String} paymentId 
    */
    setPaymentId: function(paymentId) {
      this.paymentId = paymentId;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof remotepay.VoidPaymentRequest
    * @return {String} 
    */
    getPaymentId: function() {
      return this.paymentId;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof remotepay.VoidPaymentRequest
    * @param {String} employeeId 
    */
    setEmployeeId: function(employeeId) {
      this.employeeId = employeeId;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof remotepay.VoidPaymentRequest
    * @return {String} 
    */
    getEmployeeId: function() {
      return this.employeeId;
    },

    /**
    * Set the field value
    * Reason for void
    *
    * @memberof remotepay.VoidPaymentRequest
    * @param {String} voidReason 
    */
    setVoidReason: function(voidReason) {
      this.voidReason = voidReason;
    },

    /**
    * Get the field value
    * Reason for void
    * @memberof remotepay.VoidPaymentRequest
    * @return {String} 
    */
    getVoidReason: function() {
      return this.voidReason;
    }
  });

VoidPaymentRequest._meta_ =  {fields:  {}};
VoidPaymentRequest._meta_.fields["orderId"] = {};
VoidPaymentRequest._meta_.fields["orderId"].type = String;
VoidPaymentRequest._meta_.fields["paymentId"] = {};
VoidPaymentRequest._meta_.fields["paymentId"].type = String;
VoidPaymentRequest._meta_.fields["employeeId"] = {};
VoidPaymentRequest._meta_.fields["employeeId"].type = String;
VoidPaymentRequest._meta_.fields["voidReason"] = {};
VoidPaymentRequest._meta_.fields["voidReason"].type = String;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = VoidPaymentRequest;
}

