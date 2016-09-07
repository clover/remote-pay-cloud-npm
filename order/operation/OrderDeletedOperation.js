/**
 * Autogenerated by Avro
 *
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../../Class.js");

  /**
  * @constructor
  * @memberof order.operation
  */
  OrderDeletedOperation = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof order.operation.OrderDeletedOperation
    * @private
    */
    initialize: function() {
      this._class_ = OrderDeletedOperation;
      this.id = undefined;
    },

    /**
    * Set the field value
    * @memberof order.operation.OrderDeletedOperation
    * @param {String} id
    */
    setId: function(id) {
      this.id = id;
    },

    /**
    * Get the field value
    * @memberof order.operation.OrderDeletedOperation
    * @return {String}
    */
    getId: function() {
      return this.id;
    },

    /**
    * @memberof order.operation.OrderDeletedOperation
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

OrderDeletedOperation._meta_ =  {fields:  {}};
OrderDeletedOperation._meta_.fields["id"] = {};
OrderDeletedOperation._meta_.fields["id"].type = String;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = OrderDeletedOperation;
}
