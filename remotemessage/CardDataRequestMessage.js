/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../Class.js");
var remotemessage_Method = require("../remotemessage/Method");
var remotemessage_PayIntent = require("../remotemessage/PayIntent");
var remotemessage_Message = require("../remotemessage/Message");

  /**
  * @constructor
  * @augments remotemessage.Message
  * @memberof remotemessage
  */
  CardDataRequestMessage = Class.create(remotemessage_Message, {
    /**
    * Initialize the values for this.
    * @memberof remotemessage.CardDataRequestMessage
    * @private
    */
    initialize: function($super) {
      $super();
      this._class_ = CardDataRequestMessage;
      this.setMethod(remotemessage_Method["CARD_DATA"]);
      this.payIntent = undefined;
    },

    /**
    * Set the field value
    * The payIntent
    *
    * @memberof remotemessage.CardDataRequestMessage
    * @param {remotemessage.PayIntent} payIntent 
    */
    setPayIntent: function(payIntent) {
      this.payIntent = payIntent;
    },

    /**
    * Get the field value
    * The payIntent
    * @memberof remotemessage.CardDataRequestMessage
    * @return {remotemessage.PayIntent} 
    */
    getPayIntent: function() {
      return this.payIntent;
    }
  });

CardDataRequestMessage._meta_ =  {fields:  {}};
CardDataRequestMessage._meta_.fields["payIntent"] = {};
CardDataRequestMessage._meta_.fields["payIntent"].type = remotemessage_PayIntent;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = CardDataRequestMessage;
}

