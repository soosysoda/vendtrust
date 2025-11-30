/*
  paymentService - stub for integrating payment gateway
  Exported functions should be implemented with real provider SDK
*/
exports.chargeInvestor = async (investorId, amount) => {
  // stub
  return { success: true, txnId: 'txn_stub' };
};
