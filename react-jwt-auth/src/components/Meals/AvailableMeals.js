// Sprint - Ingeol Ko
//PRJ566-Sprint-2/react-jwt-auth/src/components/Meals/AvailableMeals.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import MealItem from "./MealItems/MealItem";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("food");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/food");
        setFoods(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDrinks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/drink");
        setDrinks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFoods();
    fetchDrinks();
  }, []);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const menuItems = selectedMenu === "food" ? foods : drinks;

  const menuItemsList = menuItems.map((item) => (
    <MealItem
      key={item._id}
      id={item._id}
      name={item.name}
      description={item.description}
      price={item.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <div className={classes["menu-buttons"]}>
        <button
          className={selectedMenu === "food" ? classes.active : ""}
          onClick={() => handleMenuClick("food")}
        >
          Foods
        </button>
        <button
          className={selectedMenu === "drink" ? classes.active : ""}
          onClick={() => handleMenuClick("drink")}
        >
          Drinks
        </button>
      </div>
      <h2>{selectedMenu === "food" ? "Foods" : "Drinks"}</h2>
      <ul>{menuItemsList}</ul>
    </section>
  );
};

export default AvailableMeals;
