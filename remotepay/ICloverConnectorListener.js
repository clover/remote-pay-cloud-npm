/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

// Prototype.js required
require("prototype");


 /**
 *  Interface to the Clover remote-pay API.
 *
 *  Defines the interface used to interact with remote pay
 *  adapters.
 */
  /**
  * @constructor
  * @memberof remotepay
  */
  ICloverConnectorListener = Class.create( {
    /**
    * Called when the device disconnects
    * @memberof remotepay.ICloverConnectorListener
    *
    * @return void
    */
    onDisconnected: function() {
    },

    /**
    * Called when the device connects
    * @memberof remotepay.ICloverConnectorListener
    *
    * @return void
    */
    onConnected: function() {
    },

    /**
    * Called when the device is ready to respond to requests.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.MerchantInfo} merchantInfo 
    * @return void
    */
    onReady: function(merchantInfo) {
    },

    /**
    * Will be called when a screen or activity changes on the Mini. The CloverDeviceEvent passed in will contain
  * an event type, a description and a list of available InputOptions.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.CloverDeviceEvent} deviceEvent 
    * @return void
    */
    onDeviceActivityStart: function(deviceEvent) {
    },

    /**
    * Will be called when leaving a screen or activity on the Mini. The CloverDeviceEvent passed in will contain an event type and description. Note: The Start and End events are not guaranteed to process in order, so the event type should be used to make sure the start and end events are paired.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.CloverDeviceEvent} deviceEvent 
    * @return void
    */
    onDeviceActivityEnd: function(deviceEvent) {
    },

    /**
    * Will be called when an error occurs when trying to send messages to the device
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.CloverDeviceErrorEvent} deviceErrorEvent 
    * @return void
    */
    onDeviceError: function(deviceErrorEvent) {
    },

    /**
    * Will be called, one or more times, at the completion of an auth transaction request, with the same results as a SaleResponse. Note: An auth transaction may come back as a final sale, depending on the payment gateway. The AuthResponse has a boolean isAuth to determine if it can still be tip adjusted.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.AuthResponse} response 
    * @return void
    */
    onAuthResponse: function(response) {
    },

    /**
    * Will be called after a tip adjust request and contains the tipAmount if successful
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.TipAdjustAuthResponse} response 
    * @return void
    */
    onTipAdjustAuthResponse: function(response) {
    },

    /**
    * Will be called after a capture pre-auth request and contains the new Amount and TipAmount if successful
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.CapturePreAuthResponse} response 
    * @return void
    */
    onCapturePreAuthResponse: function(response) {
    },

    /**
    * Will be called, passing in the Payment and Signature, if the user provides an on-screen signature, that needs to be accepted or rejected for a payment.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.VerifySignatureRequest} request 
    * @return void
    */
    onVerifySignatureRequest: function(request) {
    },

    /**
    * Will be called, passing in the Payment and Signature, if the user provides an on-screen signature, that needs to be accepted or rejected for a payment.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.ConfirmPaymentRequest} request 
    * @return void
    */
    onConfirmPaymentRequest: function(request) {
    },

    /**
    * Can get called multiple times at various stages. The Reason will contain information about what was successful or what failed.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.CloseoutResponse} response 
    * @return void
    */
    onCloseoutResponse: function(response) {
    },

    /**
    * Will be called, one or more times, at the completion of a sale transaction request, with either a SUCCESS or CANCEL code. A SUCCESS will also have the payment object. The payment object can be the full amount or partial amount of the sale request. Note: A sale transaction my come back as a tip adjustable auth, depending on the payment gateway. The SaleResponse has a boolean isSale to determine if it is final or will be finalized during closeout.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.SaleResponse} response 
    * @return void
    */
    onSaleResponse: function(response) {
    },

    /**
    * Will be called at the completion of a manual refund request, with either a SUCCESS or CANCEL code. If successful, the ManualRefundResponse will have a Credit object associated with the relevant payment information.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.ManualRefundResponse} response 
    * @return void
    */
    onManualRefundResponse: function(response) {
    },

    /**
    * Will be called after a refund payment request and contains the Refund if successful. The Refund contains the original paymentId as reference
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.RefundPaymentResponse} response 
    * @return void
    */
    onRefundPaymentResponse: function(response) {
    },

    /**
    * Will be called when a tip is added on the device screen
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.TipAdded} tipAdded 
    * @return void
    */
    onTipAdded: function(tipAdded) {
    },

    /**
    * Will be called after a void payment request and contains the voided paymentId
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.VoidPaymentResponse} response 
    * @return void
    */
    onVoidPaymentResponse: function(response) {
    },

    /**
    * will be called at the completion of a vault card request, with either a SUCCESS or CANCEL code. If successful, the response will contain a payment with a token value unique for the card and merchant that can be used for future Sale or Auth requests.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.VaultCardResponse} response 
    * @return void
    */
    onVaultCardResponse: function(response) {
    },

    /**
    * Will be called, one or more times, at the complete of a pre-auth transaction request, with
  * the same results as a SaleResponse. Note: The isPreAuth boolean on the PreAuthResponse verifies
  * if CapturePreAuth can be called for the returned payment.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.PreAuthResponse} response 
    * @return void
    */
    onPreAuthResponse: function(response) {
    },

    /**
    * Called in response to a retrievePendingPayment(...) request.
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.RetrievePendingPaymentsResponse} retrievePendingPaymentResponse 
    * @return void
    */
    onRetrievePendingPaymentsResponse: function(retrievePendingPaymentResponse) {
    },

    /**
    * Called in response to a readCardData(...) request
    * @memberof remotepay.ICloverConnectorListener
    *
    * @param {remotepay.ReadCardDataResponse} response 
    * @return {Null} 
    */
    onReadCardDataResponse: function(response) {
      return null;
    }
  });


//
// Expose the module.
//
if ('undefined' !== typeof module) {
module.exports = ICloverConnectorListener;
}

