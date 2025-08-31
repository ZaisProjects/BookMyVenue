const express = require('express');
const router = express.Router({mergeParams : true});


router.get("/contactus", (req, res) => {
  res.render("policies/contactus");
});

router.get("/cancelandrefund", (req, res) => {
  res.render("policies/cancelandrefund");
});

router.get("/privacy", (req, res) => {
  res.render("policies/privacy");
});

router.get("/terms", (req, res) => {
  res.render("policies/terms");
});

router.get("/shipping", (req, res) => {
  res.render("policies/shipping");
});

module.exports = router;