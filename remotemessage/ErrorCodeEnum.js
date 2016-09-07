/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../Class.js");
var remotemessage_ErrorCode = require("../remotemessage/ErrorCode");

  /**
  * @constructor
  * @memberof remotemessage
  */
  ErrorCodeEnum = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof remotemessage.ErrorCodeEnum
    * @private
    */
    initialize: function() {
      this._class_ = ErrorCodeEnum;
      this.errorCode = undefined;
    },

    /**
    * Set the field value
    * @memberof remotemessage.ErrorCodeEnum
    * @param {remotemessage.ErrorCode} errorCode 
    */
    setErrorCode: function(errorCode) {
      this.errorCode = errorCode;
    },

    /**
    * Get the field value
    * @memberof remotemessage.ErrorCodeEnum
    * @return {remotemessage.ErrorCode} 
    */
    getErrorCode: function() {
      return this.errorCode;
    },

    /**
    * @memberof remotemessage.ErrorCodeEnum
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

ErrorCodeEnum._meta_ =  {fields:  {}};
ErrorCodeEnum._meta_.fields["errorCode"] = {};
ErrorCodeEnum._meta_.fields["errorCode"].type = remotemessage_ErrorCode;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = ErrorCodeEnum;
}

