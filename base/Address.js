/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../Class.js");

  /**
  * @constructor
  * @memberof base
  */
  Address = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof base.Address
    * @private
    */
    initialize: function() {
      this._class_ = Address;
      this.address1 = undefined;
      this.address2 = undefined;
      this.address3 = undefined;
      this.city = undefined;
      this.country = undefined;
      this.phoneNumber = undefined;
      this.state = undefined;
      this.zip = undefined;
    },

    /**
    * Set the field value
    * @memberof base.Address
    * @param {String} address1 
    */
    setAddress1: function(address1) {
      this.address1 = address1;
    },

    /**
    * Get the field value
    * @memberof base.Address
    * @return {String} 
    */
    getAddress1: function() {
      return this.address1;
    },

    /**
    * Set the field value
    * @memberof base.Address
    * @param {String} address2 
    */
    setAddress2: function(address2) {
      this.address2 = address2;
    },

    /**
    * Get the field value
    * @memberof base.Address
    * @return {String} 
    */
    getAddress2: function() {
      return this.address2;
    },

    /**
    * Set the field value
    * @memberof base.Address
    * @param {String} address3 
    */
    setAddress3: function(address3) {
      this.address3 = address3;
    },

    /**
    * Get the field value
    * @memberof base.Address
    * @return {String} 
    */
    getAddress3: function() {
      return this.address3;
    },

    /**
    * Set the field value
    * @memberof base.Address
    * @param {String} city 
    */
    setCity: function(city) {
      this.city = city;
    },

    /**
    * Get the field value
    * @memberof base.Address
    * @return {String} 
    */
    getCity: function() {
      return this.city;
    },

    /**
    * Set the field value
    * @memberof base.Address
    * @param {String} country 
    */
    setCountry: function(country) {
      this.country = country;
    },

    /**
    * Get the field value
    * @memberof base.Address
    * @return {String} 
    */
    getCountry: function() {
      return this.country;
    },

    /**
    * Set the field value
    * @memberof base.Address
    * @param {String} phoneNumber 
    */
    setPhoneNumber: function(phoneNumber) {
      this.phoneNumber = phoneNumber;
    },

    /**
    * Get the field value
    * @memberof base.Address
    * @return {String} 
    */
    getPhoneNumber: function() {
      return this.phoneNumber;
    },

    /**
    * Set the field value
    * @memberof base.Address
    * @param {String} state 
    */
    setState: function(state) {
      this.state = state;
    },

    /**
    * Get the field value
    * @memberof base.Address
    * @return {String} 
    */
    getState: function() {
      return this.state;
    },

    /**
    * Set the field value
    * @memberof base.Address
    * @param {String} zip 
    */
    setZip: function(zip) {
      this.zip = zip;
    },

    /**
    * Get the field value
    * @memberof base.Address
    * @return {String} 
    */
    getZip: function() {
      return this.zip;
    },

    /**
    * @memberof base.Address
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

Address._meta_ =  {fields:  {}};
Address._meta_.fields["address1"] = {};
Address._meta_.fields["address1"].type = String;
Address._meta_.fields["address2"] = {};
Address._meta_.fields["address2"].type = String;
Address._meta_.fields["address3"] = {};
Address._meta_.fields["address3"].type = String;
Address._meta_.fields["city"] = {};
Address._meta_.fields["city"].type = String;
Address._meta_.fields["country"] = {};
Address._meta_.fields["country"].type = String;
Address._meta_.fields["phoneNumber"] = {};
Address._meta_.fields["phoneNumber"].type = String;
Address._meta_.fields["state"] = {};
Address._meta_.fields["state"].type = String;
Address._meta_.fields["zip"] = {};
Address._meta_.fields["zip"].type = String;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = Address;
}

