/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const req = require('express/lib/request');
const { json } = require('express/lib/response');
const { sendOrder } = require('../database');

module.exports = function(router, db) {
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    console.log('/foods', req.session);

    db.getFoodsWithCategories()
      .then(foods => {
        // get category from data
        const categories = [];
        for (let food of foods) {
          if (!categories.includes(food.category)) {
            categories.push(food.category)
          }
        }

        const templateVars = { foods, categories, userID};
        // res.header('token', JSON.stringify({ token: 'token' }));

        res.render("foods", templateVars)
        // res.json(foods);

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // click the food list, pop up modal and show only clicked food info
  router.get("/:id", (req, res) => {
    console.log(req.params.id);

    db.getFoodDetailsWithId(req.params.id)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // pass order data to be saved in database
  router.post("/order", (req, res) => {
    const order = req.body;

    // user_id / cookies
    const user_id = req.session.user_id;

    db.sendOrder(user_id, order);

  })

  return router;
};
