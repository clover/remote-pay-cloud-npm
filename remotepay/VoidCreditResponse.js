/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../Class.js");
var remotepay_ResultStatus = require("../remotepay/ResultStatus");
var payments_Credit = require("../payments/Credit");

  /**
  * @constructor
  * @memberof remotepay
  */
  VoidCreditResponse = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof remotepay.VoidCreditResponse
    * @private
    */
    initialize: function() {
      this._class_ = VoidCreditResponse;
      this.requestId = undefined;
      this.status = undefined;
      this.credit = undefined;
    },

    /**
    * Set the field value
    * Identifier for the request
    *
    * @memberof remotepay.VoidCreditResponse
    * @param {String} requestId 
    */
    setRequestId: function(requestId) {
      this.requestId = requestId;
    },

    /**
    * Get the field value
    * Identifier for the request
    * @memberof remotepay.VoidCreditResponse
    * @return {String} 
    */
    getRequestId: function() {
      return this.requestId;
    },

    /**
    * Set the field value
    * @memberof remotepay.VoidCreditResponse
    * @param {remotepay.ResultStatus} status 
    */
    setStatus: function(status) {
      this.status = status;
    },

    /**
    * Get the field value
    * @memberof remotepay.VoidCreditResponse
    * @return {remotepay.ResultStatus} 
    */
    getStatus: function() {
      return this.status;
    },

    /**
    * Set the field value
    * The credit that was voided
    *
    * @memberof remotepay.VoidCreditResponse
    * @param {payments.Credit} credit 
    */
    setCredit: function(credit) {
      this.credit = credit;
    },

    /**
    * Get the field value
    * The credit that was voided
    * @memberof remotepay.VoidCreditResponse
    * @return {payments.Credit} 
    */
    getCredit: function() {
      return this.credit;
    },

    /**
    * @memberof remotepay.VoidCreditResponse
    * @private
    */
    getMetaInfo: function(fieldName) {
      var curclass = this._class_;
      do {
        var fieldMetaInfo = curclass._meta_.fields[fieldName];
        if(fieldMetaInfo) {
          return fieldMetaInfo;
        }
        curclass = curclass.superclass;
      } while(curclass);
      return null;
    },

    toString: function() {
      return JSON.stringify(this);
    }

  });

VoidCreditResponse._meta_ =  {fields:  {}};
VoidCreditResponse._meta_.fields["requestId"] = {};
VoidCreditResponse._meta_.fields["requestId"].type = String;
VoidCreditResponse._meta_.fields["status"] = {};
VoidCreditResponse._meta_.fields["status"].type = remotepay_ResultStatus;
VoidCreditResponse._meta_.fields["credit"] = {};
VoidCreditResponse._meta_.fields["credit"].type = payments_Credit;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = VoidCreditResponse;
}

