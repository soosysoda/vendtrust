const PoolModel = require('../models/Pool');

exports.createBid = async (user_id, amount, purpose) => {
  return PoolModel.createBid({ user_id, amount, purpose });
};

exports.listOpen = async () => {
  return PoolModel.listOpen();
};
