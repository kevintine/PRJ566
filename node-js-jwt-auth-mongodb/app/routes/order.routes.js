const orders = require("../controllers/order.controller");
module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    
    app.post("/api/order/send-receipt", orders.sendReceipt);
  };
  