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

<<<<<<< HEAD
  app.get("/api/auth/history/:userId", userController.history);

=======
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
  app.put(
    "/api/auth/update",
    [authJwt.verifyToken],
    userController.updateProfile
  );

<<<<<<< HEAD
  app.post("/api/auth/upload", [authJwt.verifyToken], userController.upload);

=======
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
  app.delete("/api/auth/delete/:userId", userController.deleteUser);
};
