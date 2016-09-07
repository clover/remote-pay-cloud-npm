/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../Class.js");
var remotepay_DeviceErrorEventCode = require("../remotepay/DeviceErrorEventCode");
var remotepay_DeviceEventState = require("../remotepay/DeviceEventState");

  /**
  * @constructor
  * @memberof remotepay
  */
  DeviceEventEnum = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof remotepay.DeviceEventEnum
    * @private
    */
    initialize: function() {
      this._class_ = DeviceEventEnum;
      this.deviceErrorEventCode = undefined;
      this.deviceEventState = undefined;
    },

    /**
    * Set the field value
    * @memberof remotepay.DeviceEventEnum
    * @param {remotepay.DeviceErrorEventCode} deviceErrorEventCode 
    */
    setDeviceErrorEventCode: function(deviceErrorEventCode) {
      this.deviceErrorEventCode = deviceErrorEventCode;
    },

    /**
    * Get the field value
    * @memberof remotepay.DeviceEventEnum
    * @return {remotepay.DeviceErrorEventCode} 
    */
    getDeviceErrorEventCode: function() {
      return this.deviceErrorEventCode;
    },

    /**
    * Set the field value
    * @memberof remotepay.DeviceEventEnum
    * @param {remotepay.DeviceEventState} deviceEventState 
    */
    setDeviceEventState: function(deviceEventState) {
      this.deviceEventState = deviceEventState;
    },

    /**
    * Get the field value
    * @memberof remotepay.DeviceEventEnum
    * @return {remotepay.DeviceEventState} 
    */
    getDeviceEventState: function() {
      return this.deviceEventState;
    },

    /**
    * @memberof remotepay.DeviceEventEnum
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

DeviceEventEnum._meta_ =  {fields:  {}};
DeviceEventEnum._meta_.fields["deviceErrorEventCode"] = {};
DeviceEventEnum._meta_.fields["deviceErrorEventCode"].type = remotepay_DeviceErrorEventCode;
DeviceEventEnum._meta_.fields["deviceEventState"] = {};
DeviceEventEnum._meta_.fields["deviceEventState"].type = remotepay_DeviceEventState;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = DeviceEventEnum;
}

