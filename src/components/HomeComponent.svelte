<script>
  import { onMount, getContext, setContext } from "svelte";
    import createAuth0Client from '@auth0/auth0-spa-js';
  import { executeGraphql } from "../helpers.js";
  import {location, querystring, link} from 'svelte-spa-router';
  import AutoComplete from "simple-svelte-autocomplete";

  import { claims } from '../stores.js';
	import {
		Auth0Context,
		authError,
		authToken,
		isAuthenticated,
		isLoading,
		login,
		logout,
		userInfo
  } from '@dopry/svelte-auth0';

  
     export let loading;
     export let hasura_userID;

     export let ingredient, selected, quantity;
     export let quantity_measurement = "Quantity Measurement";
     export let ingredients;
     export let recipes = [];
     export let possible_ingredients = [], recipes_count, ingredients_count;
     export let categories = [];
     export let category;
     export let filteredCommunityRecipes = {};
     export let viewingRecipes, viewingMyRecipes, communityRecipe, viewingCommunityRecipe, viewingCommunityRecipes, viewingFilteredCommunityRecipes, viewingInventory, viewingIngredients, enteringInventory, enteringRecipe, enteringIngredient;
     export let communityRecipeIngredients, new_recipe_name, new_ingredient_name, new_ingredient_brand, new_recipe_ingredients = [], new_recipe_ingredients_final = [], new_recipe_ingredient_quantity, new_ingredient_measurement, new_recipe_directions_1, new_recipe_ingredient_shareable;
     export let existing_ingredient, enteringRecipeIngredient2, enteringRecipeIngredient3;
     export let enteringRecipeIngredient = true;
    
    export let user_level, user_code;

    async function checkUser() {
      hasura_userID = $userInfo['https://hasura.io/jwt/claims']['x-hasura-user-id'];
      let q = `
          {
            users(where: {x_hasura_user_id: {_eq: "` + hasura_userID + `"}}) {
              id
              Onboarding_Level
              Onboarding_Code
            }
          }
      `
      let temp = await executeGraphql(q, $claims);  
      if (temp.data.users.length == 0) {
        console.log("new user detected!")
        q = `
            mutation {
              insert_users_one(object: {x_hasura_user_id: "` + hasura_userID + `", Onboarding_Level: 1, Onboarding_Code: "Apprentice"}) {
                id
              }
            }
            `
        temp = await executeGraphql(q, $claims);
        console.log("new level 1 user created in database!")
        user_level = 1;
        user_code = "Apprentice";

        q = `
            {
              ingredients(where: {Base_Ingredient: {_eq: true}}) {
                id
                Quantity_Measurement
              }
            }
            `
        temp = await executeGraphql(q, $claims);
        let base_ingredients = temp.data.ingredients
        for (var i = 0; i < base_ingredients.length; i++) {
          q = `
              mutation {
                insert_users_ingredients_one(object: {IngredientID: ` + base_ingredients[i].id + `, Quantity_Measurement: "` + base_ingredients[i].Quantity_Measurement + `"}) {
                  id
                }
              }
              `
          temp = await executeGraphql(q, $claims);
        }
        getPossibleIngredients();
      } else {
        user_level = temp.data.users[0].Onboarding_Level;
        user_code = temp.data.users[0].Onboarding_Code;
      }    
    }

    async function viewRecipes() {
      viewingRecipes = true;
      viewingInventory = false;
      viewingIngredients = false;
    }

    async function viewMyRecipes() {
      viewingMyRecipes = true;
      enteringRecipe = false;
    }

    async function viewCommunityRecipes() {
      viewingCommunityRecipes = true; 
      viewingFilteredCommunityRecipes = false;
      viewingMyRecipes = false;
      enteringRecipe = false;      
      viewingCommunityRecipe = false;
    }

   async function filterCommunityRecipes(parent_category) {
      viewingFilteredCommunityRecipes = true;
      if (["Lunch or Dinner", "Breakfast", "Snacks", "Drinks"].includes(parent_category)) {
        let category_subcategory = {
          "Lunch or Dinner": [
            {"American":{"category": "LD_American", "count": 1}}, 
            {"Italian":{"category": "LD_Italian", "count":1}},
            {"Mexican":{"category": "LD_Mexican", "count":1}}
            ],
          "Breakfast": [
            {"Mexican":{"category": "B_Mexican", "count":1}}
            ],
          "Snacks": [
            {"American":{"category": "S_American", "count":1}},
            {"Chinese":{"category": "S_Chinese", "count":1}}
            ],
          "Drinks": [
            {"Smoothies":{"category": "D_Smoothies", "count":1}}
          ]
        };
        filteredCommunityRecipes = category_subcategory[parent_category];
        for (var i = 0; i < filteredCommunityRecipes.length; i++) {
        }
      } else if (["LD_American", "LD_Italian", "LD_Mexican", "B_Mexican", "S_American", "S_Chinese", "D_Smoothies"].includes(parent_category)) {
        let subcategory_subcategory = {
          "LD_American": [
            {"Fried Fish": {"category":6, "count":1}}
          ],
          "LD_Italian": [
            {"Pizza": {"category":6, "count":1}}
          ],
          "LD_Mexican": [
            {"Burrito": {"category":4, "count":1}}
          ],
          "B_Mexican": [
            {"Frittata": {"category":2, "count":1}},
          ],
          "S_American": [
            {"French Fries": {"category":5, "count":1}},
          ],
          "S_Chinese": [
            {"Green Onion Pancake": {"category":1, "count":1}},
          ],
          "D_Smoothies": [
            {"Vegetable Smoothie": {"category":3, "count":1}},
          ]
        }
        filteredCommunityRecipes = subcategory_subcategory[parent_category];
      } else {
        let q = `
                {
                  users_recipes_by_pk(id: ` + parent_category + `) {
                    recipes {
                      Directions
                      Recipe
                    }
                  }
                }
                `;
        let temp = await executeGraphql(q, $claims);
        viewingFilteredCommunityRecipes = false;
        viewingCommunityRecipe = true;
        viewingCommunityRecipes = false;
        communityRecipe = temp.data.users_recipes_by_pk.recipes;
        q = `
            {
              ingredients_recipes(where: {UserRecipeID: {_eq: ` + parent_category + `}}) {
                Quantity
                Quantity_Measurement
                user_ingredients {
                  ingredients {
                    Ingredient
                  }
                }
              }
            }
        `
        temp = await executeGraphql(q, $claims);
        communityRecipeIngredients = temp.data.ingredients_recipes;
      }
    }

    async function viewIngredients() {
      viewingIngredients = true;
      viewingRecipes = false;
      viewingInventory = false;
    }

    async function getPossibleIngredients() {
        let q = `
                {
                  ingredients(order_by: {Ingredient: asc}) {
                    id
                    Brand
                    Ingredient
                    Quantity_Measurement
                  }
                }
                `
        let temp_ingredients = await executeGraphql(q, $claims); 
        temp_ingredients = temp_ingredients.data.ingredients;
        possible_ingredients = [];
        for (var i = 0; i < temp_ingredients.length; i++) {
          possible_ingredients.push({"value": "", "id": temp_ingredients[i].id, "Ingredient": temp_ingredients[i].Ingredient, "Brand": temp_ingredients[i].Brand, "Quantity_Measurement": temp_ingredients[i].Quantity_Measurement});
        }
        possible_ingredients = possible_ingredients;
        // q  = `
        //       {
        //         users_ingredients_aggregate {
        //           aggregate {
        //             count
        //           }
        //         }
        //       }
        //   `;
        // let temp_ingredients_count = await executeGraphql(q, c); 
        // ingredients_count = temp_ingredients_count.data.users_ingredients_aggregate.aggregate.count;
        // console.log("set the ingredients count");
        // console.log(ingredients_count);
    }

    async function getPossibleRecipes() {
      // let q = `
      // {
      //   recipes_aggregate {
      //     aggregate {
      //       count
      //     }
      //   }
      // }
      // `
      let c = $claims;
      // let temp_recipes = await executeGraphql(q, c); 
      // recipes_count = temp_recipes.data.recipes_aggregate.aggregate.count;

      let q = `
      {
        users_recipes {
          recipes {
            Recipe
            id
          }
        }
      }

      `
      let temp = await executeGraphql(q, c); 
      recipes = temp.data.users_recipes;
  }

    async function addNewRecipeIngredients(n_r_i) {
      console.log(n_r_i);
      console.log(new_recipe_ingredients);
    }

    async function findNewRecipeIngredient() {
      console.log("STARTING finding the new recipe ingredient!");
      new_recipe_ingredients_final = [];
      for (var i = 0; i < new_recipe_ingredients.length; i++) {
        let q =   `
                {
                  users_ingredients(where: {IngredientID: {_eq: ` + new_recipe_ingredients[i] + `}}) {
                    Quantity_Measurement
                    ingredients {
                      Ingredient
                    }
                  }
                }
              `
        let temp = await executeGraphql(q, $claims);
        new_recipe_ingredients_final.push(temp.data.users_ingredients);
      }
      console.log(new_recipe_ingredients_final);
    }

    async function addNewRecipe(name) {
      let q = `
        mutation {
          insert_recipes_one(object: {Recipe: " ` + name + `", Directions: "` + new_recipe_directions_1 +  `"}) {
            id
            }
        }
       `
      let temp = await executeGraphql(q, $claims);
      let new_recipeID = temp.data.insert_recipes_one.id;
      console.log(new_recipeID);

      q = `
          mutation {
            insert_users_recipes(objects: {RecipeID: ` + new_recipeID + `}) {
              returning {
                id
                recipes {
                  Recipe
                }
              }
            }
          }
       `
      temp = await executeGraphql(q, $claims);
      let new_users_recipe_id = temp.data.insert_users_recipes.returning[0].id;
      console.log(new_users_recipe_id);
      console.log("STARTING INGREDIENTS_RECIPES INSERT")
      for (var i = 0; i < new_recipe_ingredients.length; i++) {
        console.log(new_recipe_ingredients[i].value)
        let user_quantity = new_recipe_ingredients[i].value;
        let temp_user_ingredient_id = new_recipe_ingredients[i].id;
        q = `
            mutation {
              insert_ingredients_recipes_one(object: {Quantity: ` + user_quantity + `, Quantity_Measurement: "` + new_recipe_ingredients[i].Quantity_Measurement + `", UserIngredientID: ` + temp_user_ingredient_id + `, UserRecipeID: ` + new_users_recipe_id + `}) {
                ingredients {
                  Ingredient
                }
                user_recipes {
                  recipes {
                    Recipe
                  }
                }
              }
            }
            `;
        temp = await executeGraphql(q, $claims);
        let result = temp.data;
        console.log(result);
      }
      new_recipe_ingredients = [];
      name = "";
      new_recipe_directions_1 = "";
      new_recipe_ingredient_shareable = null;

      userLevelUp();
      console.log("new recipe added!")

      getPossibleRecipes();
    }

    async function getCategories() {
        let q = `{
                    inventory(where: {Quantity: {_gt: 0.1}}) {
                        ingredient_inventory_2 {
                            category {
                                category
                                iconURL
                            }
                        }
                    }
                }
                `  
        let c = $claims;
        let temp_categories = await executeGraphql(q, c); 
        temp_categories = temp_categories.data.inventory;
        let unique_categories = [];
        for (var i = 0; i < temp_categories.length; i++) {
            if (!unique_categories.some(e => e.category == temp_categories[i].ingredient_inventory_2.category.category))  {
                unique_categories.push({"category": temp_categories[i].ingredient_inventory_2.category.category, "iconURL": temp_categories[i].ingredient_inventory_2.category.iconURL});
            }
        }
        categories = unique_categories;
        console.log(categories);
    }

 async function addInventoryIngredient(ingredientID, l, qua, q_m) {
    let q = `mutation {
        insert_inventory_one(object: 
            {IngredientID: ` + ingredientID + `
            , Location: "` + l + `"
            , Quantity: ` + qua + `
            , Quantity_Measurement: "` + q_m + `"
            }) {
            Location
        }
        }    
        `
    let success = await executeGraphql(q, $claims);
    ingredient = null;
    ingredient = ingredient;
    selected = null;
    quantity = null; 
    quantity_measurement = "Not determined";

    document.getElementById("Ingredient").removeChild;
    document.getElementById("Quantity").removeChild;
    document.getElementById("Quantity_Measurement").removeChild;
    
}


  async function addNewIngredient(new_ing_name, brand, q_m) {
    let q = `
            mutation {
              insert_ingredients_one(object: {Brand: "` + brand + `", Ingredient: "` + new_ing_name + `", Quantity_Measurement: "` + q_m + `"}) {
                id
              }
            }
            `;
    let temp = await executeGraphql(q, $claims);
    let newIngredientID = temp.data.insert_ingredients_one.id;

    userLevelUp();

    new_ingredient_name = null;
    document.getElementById("Ingredient").removeChild;
    document.getElementById("Brand").removeChild;
    new_ingredient_brand = null;
    document.getElementById("Quantity_Measurement").removeChild;  
    getPossibleIngredients();
    document.getElementByClass("menu").focus();

  }
 
  // async function selectCategory(cat) {
  //     if (cat == null) {
  //       //   categories = [];
  //           category = null;
  //         getCategories();
  //     }
  //     let q = ` query
  //       {
  //         inventory(where: {ingredient_inventory_2: {Category: {_eq: "` + cat + `"}}}) {
  //           ingredient_inventory_2 {
  //             Category
  //             Ingredient
  //           }
  //           IngredientID
  //           Quantity
  //           Quantity_Measurement
  //         }
  //       }
  //     `; 
  //   console.log($claims);
  //   let temp = await executeGraphql(q, $claims)
  //   // let temp = await executeGraphql(q, $claims).data.inventory[0].ingredient_inventory_2.Cstegory;
  //   ingredients = temp.data.inventory;
  //   if (ingredients.length > 0) {
  //       category = temp.data.inventory[0].ingredient_inventory_2.Category;
  //   }
  // }

  async function enterInventory() {
    enteringInventory = true;
  }

  async function enterRecipe() {
    viewingMyRecipes = false;
    enteringRecipe = true;
  }

  async function enterIngredient() {
    enteringIngredient = true;
  }

  async function enterRecipeIngredient2() {
    enteringRecipeIngredient = false;
    enteringRecipeIngredient2 = true;
  }

  async function updateQM(ingredientID, new_ingredient_number) {
    console.log("updating QM!");
    console.log(ingredientID);
    let q = ` {
              users_ingredients(where: {IngredientID: {_eq: ` + ingredientID + `}}) {
                Quantity_Measurement
              }
            }
            `
    let temp = await executeGraphql(q, $claims)
    console.log(temp.data);
    if (new_ingredient_number == 1) {
      new_recipe_ingredrient_quantity_measurement_1 = temp.data.users_ingredients[0].Quantity_Measurement;
    } else if (new_ingredient_number == 2) {
      new_recipe_ingredrient_quantity_measurement_2 = temp.data.users_ingredients[0].Quantity_Measurement;
    }
    console.log(new_recipe_ingredrient_quantity_measurement_1);
  }


  export let locations = ["Pantry", "Fridge", "Freezer", "Spice Cabinet"]

</script>

{#if loading}
<h1>Loading...</h1>
{:else}

<!-- <ul class="nav">
  <li class="nav-item">
    <a class="nav-link " href="/" use:link>Home</a>
  </li>
  <li class="nav-item">
    <a class="nav-link active" href="/inventory" use:link>Inventory</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/meals" use:link>Meals</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/grocerylist" use:link>Grocery List</a>
  </li>
</ul> -->

<ul class="nav nav-pills nav-fill">
  <li class="nav-item col-md-6">
    <a href="/food" use:link class="btn btn-lg btn-outline-success">Cook Food</a>
  </li>
<!--   <li class="nav-item col-sm-6">
    <a href="/grocerylist" use:link class="btn btn-lg btn-light">Open Grocery List</a>
  </li>  
 -->
</ul>
    <!-- {#if recipes.length > 0}
      <span class="nav-link menu" on:click={() => viewRecipes()}><button type="button" class="btn btn-lg btn-outline-primary">Recipes</button></span> <span class="badge badge-success">Complete</span>
    {:else}
      <span class="nav-link menu" on:click={() => viewRecipes()}><button type="button" class="btn btn-lg btn-outline-primary">Recipes</button></span> <span class="badge badge-danger">Missing</span>
    {/if}
  </li> -->
  <!-- <li class="nav-item">
    <span class="nav-link menu"><button type="button" class="btn btn-lg btn-outline-primary">Inventory</button></span> <span class="badge badge-warning">Coming Soon</span>
  </li>
  <li class="nav-item">
    <span class="nav-link menu"><button type="button" class="btn btn-lg btn-outline-primary">Meal Plans</button></span> <span class="badge badge-warning">Coming Soon</span>
  </li> -->
  <!-- <li class="nav-item">
    <span class="nav-link menu"><button type="button" class="btn btn-lg btn-outline-primary">Grocery Lists</button></span> <span class="badge badge-success">Complete</span>
  </li> -->
<!-- </ul> -->


{#if viewingRecipes}

<!-- {#if recipes_count == 1}
<div class="row">
  <p>You know {recipes_count} recipe.</p>
</div>
{:else}
<div class="row">
  <p>You know {recipes_count} recipes.</p>
</div>
{/if} -->




<!-- <div class="card category">
  <img class="card-img-top" src="/icons/burrito.jpeg" alt="burrito">
  <div class="card-body">
    <p class="card-text"><button>Learn a Burrito Recipe</button></p>
  </div>
</div>

<div class="card category">
  <img class="card-img-top" src="/icons/salad_category.png" alt="burrito">
  <div class="card-body">
    <p class="card-text"><button>Learn a Salad Recipe</button></p>
  </div>
</div> -->

{#if viewingCommunityRecipes}
{#if !viewingFilteredCommunityRecipes}

{:else}
<ul class="list-group">
  {#each Object.keys(filteredCommunityRecipes) as fcr}
    <li class="list-group-item d-flex justify-content-between align-items-center" on:click={() => filterCommunityRecipes(filteredCommunityRecipes[fcr][Object.keys(filteredCommunityRecipes[fcr])[0]]["category"]) }>
      {Object.keys(filteredCommunityRecipes[fcr])[0]}
      <span class="badge badge-primary badge-pill">{filteredCommunityRecipes[fcr][Object.keys(filteredCommunityRecipes[fcr])[0]]["count"]}</span>
    </li>
  {/each}
</ul>
<button class="btn btn-md btn-secondary" on:click={() => viewCommunityRecipes()}><img class="icon" alt="back" src="/open-iconic-master/svg/chevron-left.svg"> Back</button>
{/if}
{/if}

{#if viewingCommunityRecipe}

  <h2>{communityRecipe.Recipe}</h2>
  <ul class="list-group">
  {#each communityRecipe.Directions.split(".") as dir}
    <li class="list-group-item">{dir}</li>
  {/each}
  </ul>
<button class="btn btn-md btn-secondary" on:click={() => viewCommunityRecipes()}><img class="icon" alt="back" src="/open-iconic-master/svg/chevron-left.svg"> Back</button>

{/if}

{#if enteringInventory}
<p> <button class="btn btn-md btn-primary" on:click="{() => enterInventory()}">Input Your Inventory</button><span class="badge badge-danger">Missing</span> You must enter your current food inventory to get started.</p>

<form on:submit|preventDefault> 
<table class="table-responsive">
    <legend>Update Your Inventory</legend>
    <tr>
            <td>
                <select bind:value={selected}>
                    {#each locations as loc}
                        <option value={loc}>{loc}</option> 
                    {/each} 
                </select> 
            </td>
            <!-- <td>Location: <input type="text" value={ingredient} /></td> -->
            <td>Ingredient: 
                <select id="Ingredient" bind:value={ingredient} onChange={updateQM(ingredient)}>
                    {#each possible_ingredients as ing}
                        <option value={ing.id}>{ing.Ingredient} ({ing.Brand})</option> 
                    {/each} 
                </select> 
            </td>
            <td>Quantity: <input id="Quantity" bind:value={quantity} type="text" /></td>
            <td>(<strong>{quantity_measurement}</strong>)</td>
            <td><button class="btn btn-lg btn-primary" on:click="{() => addInventoryIngredient(ingredient, selected, quantity, quantity_measurement)}">Add</button></td>
    </tr>

</table>
</form>
{/if}

{#if viewingIngredients }

<h1>My Ingredients</h1>

<div id="ingredientsList">
  <table class="table">
    <thead class="thead-light">
      <th scope="col">Ingredient</th>
    </thead>
    <tbody>
      {#each possible_ingredients as pos}
        <tr>
          <td>{pos.Ingredient}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
        <!-- {#each possible_ingredients as pos}
          <input class="form-check-input" type="checkbox" value="{pos}" bind:group={new_recipe_ingredients} id="checkbox_{pos.id}">
            <label class="form-check-label" for="checkbox_{pos.id}">
              {pos.Ingredient}
          </label>
        {/each} -->

<p><button on:click="{() => enterIngredient()}" class="btn btn-md btn-secondary">Add ingredients</button>

{/if}
<hr />

<!--
<hr />
<div class="jumbotron">
    <p class="lead">Your Upcoming Meals</p>
    <hr class="my-4">
    <div class="row">
    <p>Create a meal plan to see today's meals.</p>
     {#each categories as cat } 
     <div class="col-sm-2 category">
        <div class="card upcomingMeal">
        <img class="card-img-top" src="/icons/breakfast_category.png" alt="Breakfast" on:click="{() => selectCategory('Breakfast')}" />
        <div class="card-body text-center"> 
            <h4 class="card-title">Frittata</h4>
            <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-light btn-sm">Recipe</button>
            <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-light btn-sm">Nutrition Info</button>
            <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-success btn-md">I Cooked This <img alt="thumbs_up" class="backArrow" src="/open-iconic-master/svg/thumb-up.svg"></button>
        </div>
        </div>
    </div>
    <div class="col-sm-2 category">
        <div class="card upcomingMeal">
        <img class="card-img-top" src="/icons/burrito.jpeg" alt="Lunch" on:click="{() => selectCategory('Lunch')}" />
        <div class="card-body text-center"> 
            <h4 class="card-title">Burrito
            <button on:click="{() => selectCategory('Lunch')}" class="btn btn-light btn-sm">Recipe</button>
            <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-light btn-sm">Nutrition Info</button>
            <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-success btn-md">I Cooked This <img alt="thumbs_up" class="backArrow" src="/open-iconic-master/svg/thumb-up.svg"></button>
            </h4>
        </div>
        </div>
    </div>
    <div class="col-sm-2 category">
        <div class="card upcomingMeal">
        <img class="card-img-top" src="/icons/dinner_category.png" alt="Dinner" on:click="{() => selectCategory('Dinner')}" />
        <div class="card-body text-center"> 
            <h4 class="card-title">Pepperoni & Artichoke Pizza
            <button on:click="{() => selectCategory('Dinner')}" class="btn btn-light btn-sm">Recipe</button>
            <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-light btn-sm">Nutrition Info</button>
            <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-success btn-md">I Cooked This <img alt="thumbs_up" class="backArrow" src="/open-iconic-master/svg/thumb-up.svg"></button>
            </h4>
        </div>
        </div>
    </div>
    <div class="col-sm-2 category">
        <div class="card upcomingMeal">
        <img class="card-img-top" src="/icons/salad_category.png" alt="Snack" on:click="{() => selectCategory('Snack')}" />
        <div class="card-body text-center"> 
            <h4 class="card-title">Salad
            <button on:click="{() => selectCategory('Snack')}" class="btn btn-light btn-sm">Recipe</button>
            <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-light btn-sm">Nutrition Info</button>
            <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-success btn-md">I Cooked This <img alt="thumbs_up" class="backArrow" src="/open-iconic-master/svg/thumb-up.svg"></button>
            </h4>
        </div>
        </div>
    </div>             
     {/each } 
    </div>
    
        <!-- <p>Today's total calories: <b>2,150</b></p>
        <p>Today's food cost: <b>$13.20</b></p> 

        <p>Today's total calories: <b>TBD</b></p>
        <p>Today's food cost: <b>TBD</b></p>
    
</div>

<hr />
-->
<!-- <div class="jumbotron">
  <p class="lead">Your Grocery List</p>
  <hr />
  <p>Create a meal plan to start a grocery list.</p>
</div> -->

<!-- 
<br />
<br /> -->

<!-- <hr />
<hr />

<br />
<br />
<br /> -->

<!-- <p>Enter your first inventory to get started.</p> -->
<!-- {#if categories != []}
{#if !category}
<div class="row">
{#each categories as cat }
  <div class="col-sm-6 category">
    <div class="card">
      <img class="card-img-top" src="{cat.iconURL}" alt="{cat.category}" on:click="{() => selectCategory(cat.category)}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory(cat.category)}" class="btn btn-primary btn-lg">{cat.category}</button>
        </h5>
      </div>
    </div>
  </div>
{/each }
</div>
{/if}
{/if}

{#if category}
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory(null)}" class="btn btn-warning btn-lg category"><img src="/open-iconic-master/svg/arrow-circle-left.svg"  alt="back_button" class="backArrow"> Back</button>
        </h5>
      </div>
    </div>
  </div>
{/if}
  <!-- <h3>Your {category} is <em>89</em>% stocked.</h3> 
{#if ingredients}
<table class="table table-responsive table-light">
  <thead>
    <th>Ingredient</th>
    <th>Quantity</th>
  </thead>
  <tbody>
    {#each ingredients as ing }
      {#if ing.Quantity > 0 }
        <tr class="table-success">     
          <td><a href='/ingredients/{ing.IngredientID}' use:link class="btn btn-lg btn-secondary">{ing.ingredient_inventory_2.Ingredient}</a></td>
          <td>{ing.Quantity} {ing.Quantity_Measurement}</td>
        </tr>
      {:else }
        <tr class="table-danger">     
          <td><a href='/ingredients/{ing.IngredientID}' use:link class="btn btn-lg btn-secondary">{ing.ingredient_inventory_2.Ingredient}</a></td>
          <td>Out of Stock!</td>
        </tr>        
      {/if}
  {/each}
  </tbody>
</table>
{/if}-->

{/if} 
{/if}
