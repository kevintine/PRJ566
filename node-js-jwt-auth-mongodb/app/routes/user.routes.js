const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", userController.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], userController.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    userController.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
  );

  app.get("/api/auth/history/:userId", userController.history);

  app.put(
    "/api/auth/update",
    [authJwt.verifyToken],
    userController.updateProfile
  );

  app.post("/api/auth/upload", [authJwt.verifyToken], userController.upload);

  app.delete("/api/auth/delete/:userId", userController.deleteUser);
};
