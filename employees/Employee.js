/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

var Class = require("../Class.js");
var employees_AccountRole = require("../employees/AccountRole");
var base_Reference = require("../base/Reference");

  /**
  * @constructor
  * @memberof employees
  */
  Employee = Class.create( {
    /**
    * Initialize the values for this.
    * @memberof employees.Employee
    * @private
    */
    initialize: function() {
      this._class_ = Employee;
      this.id = undefined;
      this.name = undefined;
      this.nickname = undefined;
      this.customId = undefined;
      this.email = undefined;
      this.inviteSent = undefined;
      this.claimedTime = undefined;
      this.deletedTime = undefined;
      this.pin = undefined;
      this.unhashedPin = undefined;
      this.role = undefined;
      this.roles = undefined;
      this.isOwner = undefined;
      this.shifts = undefined;
      this.payments = undefined;
      this.orders = undefined;
    },

    /**
    * Set the field value
    * Unique identifier
    *
    * @memberof employees.Employee
    * @param {String} id 
    */
    setId: function(id) {
      this.id = id;
    },

    /**
    * Get the field value
    * Unique identifier
    * @memberof employees.Employee
    * @return {String} 
    */
    getId: function() {
      return this.id;
    },

    /**
    * Set the field value
    * Full name of the employee
    *
    * @memberof employees.Employee
    * @param {String} name 
    */
    setName: function(name) {
      this.name = name;
    },

    /**
    * Get the field value
    * Full name of the employee
    * @memberof employees.Employee
    * @return {String} 
    */
    getName: function() {
      return this.name;
    },

    /**
    * Set the field value
    * Nickname of the employee (shows up on receipts)
    *
    * @memberof employees.Employee
    * @param {Null|String} nickname 
    */
    setNickname: function(nickname) {
      this.nickname = nickname;
    },

    /**
    * Get the field value
    * Nickname of the employee (shows up on receipts)
    * @memberof employees.Employee
    * @return {Null|String} 
    */
    getNickname: function() {
      return this.nickname;
    },

    /**
    * Set the field value
    * Custom ID of the employee
    *
    * @memberof employees.Employee
    * @param {Null|String} customId 
    */
    setCustomId: function(customId) {
      this.customId = customId;
    },

    /**
    * Get the field value
    * Custom ID of the employee
    * @memberof employees.Employee
    * @return {Null|String} 
    */
    getCustomId: function() {
      return this.customId;
    },

    /**
    * Set the field value
    * Email of the employee (optional)
    *
    * @memberof employees.Employee
    * @param {Null|String} email 
    */
    setEmail: function(email) {
      this.email = email;
    },

    /**
    * Get the field value
    * Email of the employee (optional)
    * @memberof employees.Employee
    * @return {Null|String} 
    */
    getEmail: function() {
      return this.email;
    },

    /**
    * Set the field value
    * Returns true if this employee was sent an invite to activate their account
    *
    * @memberof employees.Employee
    * @param {Boolean} inviteSent 
    */
    setInviteSent: function(inviteSent) {
      this.inviteSent = inviteSent;
    },

    /**
    * Get the field value
    * Returns true if this employee was sent an invite to activate their account
    * @memberof employees.Employee
    * @return {Boolean} 
    */
    getInviteSent: function() {
      return this.inviteSent;
    },

    /**
    * Set the field value
    * Timestamp of when this employee claimed their account
    *
    * @memberof employees.Employee
    * @param {Number} claimedTime must be a long integer
    */
    setClaimedTime: function(claimedTime) {
      this.claimedTime = claimedTime;
    },

    /**
    * Get the field value
    * Timestamp of when this employee claimed their account
    * @memberof employees.Employee
    * @return {Number} must be a long integer
    */
    getClaimedTime: function() {
      return this.claimedTime;
    },

    /**
    * Set the field value
    * Timestamp of when this employee was deleted
    *
    * @memberof employees.Employee
    * @param {Number} deletedTime must be a long integer
    */
    setDeletedTime: function(deletedTime) {
      this.deletedTime = deletedTime;
    },

    /**
    * Get the field value
    * Timestamp of when this employee was deleted
    * @memberof employees.Employee
    * @return {Number} must be a long integer
    */
    getDeletedTime: function() {
      return this.deletedTime;
    },

    /**
    * Set the field value
    * Employee PIN (hashed)
    *
    * @memberof employees.Employee
    * @param {String} pin 
    */
    setPin: function(pin) {
      this.pin = pin;
    },

    /**
    * Get the field value
    * Employee PIN (hashed)
    * @memberof employees.Employee
    * @return {String} 
    */
    getPin: function() {
      return this.pin;
    },

    /**
    * Set the field value
    * Employee PIN
    *
    * @memberof employees.Employee
    * @param {String} unhashedPin 
    */
    setUnhashedPin: function(unhashedPin) {
      this.unhashedPin = unhashedPin;
    },

    /**
    * Get the field value
    * Employee PIN
    * @memberof employees.Employee
    * @return {String} 
    */
    getUnhashedPin: function() {
      return this.unhashedPin;
    },

    /**
    * Set the field value
    * Employee System Role
    *
    * @memberof employees.Employee
    * @param {employees.AccountRole} role 
    */
    setRole: function(role) {
      this.role = role;
    },

    /**
    * Get the field value
    * Employee System Role
    * @memberof employees.Employee
    * @return {employees.AccountRole} 
    */
    getRole: function() {
      return this.role;
    },

    /**
    * Set the field value
    * @memberof employees.Employee
    * @param {Array.<base.Reference>} roles An array of 
    */
    setRoles: function(roles) {
      this.roles = roles;
    },

    /**
    * Get the field value
    * @memberof employees.Employee
    * @return {Array.<base.Reference>} An array of 
    */
    getRoles: function() {
      return this.roles;
    },

    /**
    * Set the field value
    * Returns true if this employee is the owner account for this merchant
    *
    * @memberof employees.Employee
    * @param {Boolean} isOwner 
    */
    setIsOwner: function(isOwner) {
      this.isOwner = isOwner;
    },

    /**
    * Get the field value
    * Returns true if this employee is the owner account for this merchant
    * @memberof employees.Employee
    * @return {Boolean} 
    */
    getIsOwner: function() {
      return this.isOwner;
    },

    /**
    * Set the field value
    * This employee's shifts
    *
    * @memberof employees.Employee
    * @param {Array.<base.Reference>} shifts An array of 
    */
    setShifts: function(shifts) {
      this.shifts = shifts;
    },

    /**
    * Get the field value
    * This employee's shifts
    * @memberof employees.Employee
    * @return {Array.<base.Reference>} An array of 
    */
    getShifts: function() {
      return this.shifts;
    },

    /**
    * Set the field value
    * This employee's payments
    *
    * @memberof employees.Employee
    * @param {Array.<base.Reference>} payments An array of 
    */
    setPayments: function(payments) {
      this.payments = payments;
    },

    /**
    * Get the field value
    * This employee's payments
    * @memberof employees.Employee
    * @return {Array.<base.Reference>} An array of 
    */
    getPayments: function() {
      return this.payments;
    },

    /**
    * Set the field value
    * This employee's orders
    *
    * @memberof employees.Employee
    * @param {Array.<base.Reference>} orders An array of 
    */
    setOrders: function(orders) {
      this.orders = orders;
    },

    /**
    * Get the field value
    * This employee's orders
    * @memberof employees.Employee
    * @return {Array.<base.Reference>} An array of 
    */
    getOrders: function() {
      return this.orders;
    },

    /**
    * @memberof employees.Employee
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

Employee._meta_ =  {fields:  {}};
Employee._meta_.fields["id"] = {};
Employee._meta_.fields["id"].type = String;
Employee._meta_.fields["name"] = {};
Employee._meta_.fields["name"].type = String;
Employee._meta_.fields["nickname"] = {};
Employee._meta_.fields["nickname"].type = String;
Employee._meta_.fields["customId"] = {};
Employee._meta_.fields["customId"].type = String;
Employee._meta_.fields["email"] = {};
Employee._meta_.fields["email"].type = String;
Employee._meta_.fields["inviteSent"] = {};
Employee._meta_.fields["inviteSent"].type = Boolean;
Employee._meta_.fields["claimedTime"] = {};
Employee._meta_.fields["claimedTime"].type = Number;
Employee._meta_.fields["deletedTime"] = {};
Employee._meta_.fields["deletedTime"].type = Number;
Employee._meta_.fields["pin"] = {};
Employee._meta_.fields["pin"].type = String;
Employee._meta_.fields["unhashedPin"] = {};
Employee._meta_.fields["unhashedPin"].type = String;
Employee._meta_.fields["role"] = {};
Employee._meta_.fields["role"].type = employees_AccountRole;
Employee._meta_.fields["roles"] = {};
Employee._meta_.fields["roles"].type = Array;
Employee._meta_.fields["roles"].elementType = base_Reference;
Employee._meta_.fields["isOwner"] = {};
Employee._meta_.fields["isOwner"].type = Boolean;
Employee._meta_.fields["shifts"] = {};
Employee._meta_.fields["shifts"].type = Array;
Employee._meta_.fields["shifts"].elementType = base_Reference;
Employee._meta_.fields["payments"] = {};
Employee._meta_.fields["payments"].type = Array;
Employee._meta_.fields["payments"].elementType = base_Reference;
Employee._meta_.fields["orders"] = {};
Employee._meta_.fields["orders"].type = Array;
Employee._meta_.fields["orders"].elementType = base_Reference;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = Employee;
}

