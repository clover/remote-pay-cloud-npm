/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../Class.js");
var base_Reference = require("../base/Reference");

  /**
  * @constructor
  * @memberof device
  */
  SwapRequestEvent = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof device.SwapRequestEvent
    * @private
    */
    initialize: function() {
      this._class_ = SwapRequestEvent;
      this.id = undefined;
      this.type = undefined;
      this.serialNumber = undefined;
      this.createdTime = undefined;
      this.merchant = undefined;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof device.SwapRequestEvent
    * @param {String} id 
    */
    setId: function(id) {
      this.id = id;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof device.SwapRequestEvent
    * @return {String} 
    */
    getId: function() {
      return this.id;
    },

    /**
    * Set the field value
    * @memberof device.SwapRequestEvent
    * @param {String} type 
    */
    setType: function(type) {
      this.type = type;
    },

    /**
    * Get the field value
    * @memberof device.SwapRequestEvent
    * @return {String} 
    */
    getType: function() {
      return this.type;
    },

    /**
    * Set the field value
    * @memberof device.SwapRequestEvent
    * @param {String} serialNumber 
    */
    setSerialNumber: function(serialNumber) {
      this.serialNumber = serialNumber;
    },

    /**
    * Get the field value
    * @memberof device.SwapRequestEvent
    * @return {String} 
    */
    getSerialNumber: function() {
      return this.serialNumber;
    },

    /**
    * Set the field value
    * @memberof device.SwapRequestEvent
    * @param {Number} createdTime must be a long integer
    */
    setCreatedTime: function(createdTime) {
      this.createdTime = createdTime;
    },

    /**
    * Get the field value
    * @memberof device.SwapRequestEvent
    * @return {Number} must be a long integer
    */
    getCreatedTime: function() {
      return this.createdTime;
    },

    /**
    * Set the field value
    * @memberof device.SwapRequestEvent
    * @param {base.Reference} merchant 
    */
    setMerchant: function(merchant) {
      this.merchant = merchant;
    },

    /**
    * Get the field value
    * @memberof device.SwapRequestEvent
    * @return {base.Reference} 
    */
    getMerchant: function() {
      return this.merchant;
    },

    /**
    * @memberof device.SwapRequestEvent
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

SwapRequestEvent._meta_ =  {fields:  {}};
SwapRequestEvent._meta_.fields["id"] = {};
SwapRequestEvent._meta_.fields["id"].type = String;
SwapRequestEvent._meta_.fields["type"] = {};
SwapRequestEvent._meta_.fields["type"].type = String;
SwapRequestEvent._meta_.fields["serialNumber"] = {};
SwapRequestEvent._meta_.fields["serialNumber"].type = String;
SwapRequestEvent._meta_.fields["createdTime"] = {};
SwapRequestEvent._meta_.fields["createdTime"].type = Number;
SwapRequestEvent._meta_.fields["merchant"] = {};
SwapRequestEvent._meta_.fields["merchant"].type = base_Reference;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = SwapRequestEvent;
}

