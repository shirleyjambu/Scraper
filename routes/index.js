const router = require("express").Router();
const articleRoutes = require("./articleRoutes");

router.use("/", articleRoutes);

module.exports = router;