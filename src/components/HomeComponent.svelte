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
     export let loggingIn = false;
     export let ingredient1 = {"id": 0};
     export let ingredient2 = {"id": 0};
     export let new_recipe_ingredrient_quantity_measurement_1 = "Quantity Measurement";
     export let new_recipe_ingredrient_quantity_measurement_2 = "Quantity Measurement";
     export let new_recipe_ingredrient_quantity_1;
     export let new_recipe_ingredrient_quantity_2;
     export let new_recipe_directions_1;
     export let ingredient, selected, quantity;
     export let quantity_measurement = "Quantity Measurement";
     export let ingredients;
     export let recipes = [];
     export let possible_ingredients = [], recipes_count, ingredients_count;
     export let categories = [];
     export let category;
     export let enteringInventory, enteringRecipe, enteringIngredient;
     export let new_recipe_name, new_ingredient_name, new_ingredient_brand, new_recipe_ingredients = [], new_recipe_ingredients_final = [], new_recipe_ingredient_quantity, new_ingredient_measurement, new_recipe_ingredient_shareable;
     export let existing_ingredient, enteringRecipeIngredient2, enteringRecipeIngredient3;
     export let enteringRecipeIngredient = true;
    
    export let user_level, user_code;

    authToken.subscribe(value => {
      console.log("auth token changed!")
      loggingIn = true;
      console.log($authToken);
    })
    claims.subscribe(v => {
      if ($claims) {
        console.log("claims should be ready!");
        const c = checkUser();
        const res = getCategories();
        const res2 = getPossibleIngredients();
        const res3 = getPossibleRecipes();
        loading = false;
      } 
    })

    async function checkUser() {
      let hasura_userID = $userInfo['https://hasura.io/jwt/claims']['x-hasura-user-id'];
      console.log(hasura_userID);
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
      console.log(temp.data); 
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

    async function getPossibleIngredients() {
        let q = `
                {
                  users_ingredients(order_by: {ingredients: {Ingredient: asc}}) {
                    id
                    ingredients {
                      id
                      Brand
                      Ingredient
                    }
                    Quantity_Measurement
                  }
                }
                `
        let c = $claims;
        let temp_ingredients = await executeGraphql(q, c); 
        temp_ingredients = temp_ingredients.data.users_ingredients;
        console.log(temp_ingredients);
        possible_ingredients = [];
        for (var i = 0; i < temp_ingredients.length; i++) {
          console.log("added an ingredient to the users list!");
          possible_ingredients.push({"value": "", "id": temp_ingredients[i].id, "Ingredient": temp_ingredients[i].ingredients.Ingredient, "Brand": temp_ingredients[i].ingredients.Brand, "Quantity_Measurement": temp_ingredients[i].Quantity_Measurement});
        }
        console.log(possible_ingredients);
        possible_ingredients = possible_ingredients;

        q  = `
              {
                users_ingredients_aggregate {
                  aggregate {
                    count
                  }
                }
              }
          `;
        let temp_ingredients_count = await executeGraphql(q, c); 
        ingredients_count = temp_ingredients_count.data.users_ingredients_aggregate.aggregate.count;
        console.log("set the ingredients count");
        console.log(ingredients_count);
    }

    async function getPossibleRecipes() {
      let q = `
      {
        recipes_aggregate {
          aggregate {
            count
          }
        }
      }
      `
      let c = $claims;
      let temp_recipes = await executeGraphql(q, c); 
      recipes_count = temp_recipes.data.recipes_aggregate.aggregate.count;

      q = `
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
      console.log(new_recipe_ingredients);
      for (var i = 0; i < new_recipe_ingredients.length; i++) {
        console.log(new_recipe_ingredients[i].value);
      }
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
                user_ingredients {
                  ingredients {
                    Ingredient
                  }
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

    q = `
        mutation {
          insert_users_ingredients_one(object: {IngredientID: ` + newIngredientID + `, Quantity_Measurement: "` + q_m + `"}) {
            id
          }
        }
        `
    temp = await executeGraphql(q, $claims);
    let newUserIngredientID = temp.data.insert_users_ingredients_one.id;

    new_ingredient_name = "";
    document.getElementById("Ingredient").removeChild;
    document.getElementById("Brand").removeChild;
    new_ingredient_brand = "";
    document.getElementById("Quantity_Measurement").removeChild;  
    getPossibleIngredients();
    document.getElementById("Ingredient").focus();

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

{#if user_level}

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

<h1>Welcome, {$userInfo["nickname"]}!</h1>
<h5>Chef Level: <b>{user_level} ({user_code})</b></h5>

<div class="card">
  <div class="card-body">
    <div>
    {#if recipes_count > 0}
        <h3 class="title">Recipes</h3> <span class="badge badge-success">Complete</span>
    {:else}
        <span class="badge badge-danger">Missing</span> <h2 class="title">Recipes</h2>
    {/if}
    </div>
    <div class="row">
      <p>&nbsp;</p>
    </div>
     <div class="row">
      <p>You have {recipes_count} recipes.</p>
    </div>
  </div>
<button on:click="{() => enterRecipe()}" class="btn btn-md btn-secondary">Add New Recipe</button>
<button on:click="{() => enterRecipe()}" class="btn btn-md btn-light">Learn a Community Recipe</button>
</div>


{#if enteringRecipe}

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

<form on:submit|preventDefault> 
<h2>Add New Recipe</h2>
    <div class="form-group row">
      <label for="new_recipe_name" class="col-sm-2 col-form-label">Recipe Name</label>
      <div class="col-sm-10">
        <input id="new_recipe_name" class="form-control" bind:value={new_recipe_name} type="text" />    
      </div>
    </div>              
  <h3>Ingredients</h3>

    <div class="form-group newRecipeIngredients">
      <div class="form-check">

        {#each possible_ingredients as pos}
          <input class="form-check-input" type="checkbox" value="{pos}" bind:group={new_recipe_ingredients} id="checkbox_{pos.id}">
            <label class="form-check-label" for="checkbox_{pos.id}">
              {pos.Ingredient}
          </label>
        {/each}
      </div>
    </div>

    <p><b>* Add new ingredients below if you do not see your ingredient listed.</b></p>

  <h3>Measurements</h3>
    <div class="form-group row">
    {#each new_recipe_ingredients as nri, i}
     <label for={nri.id} class="col-sm-2 col-form-label">{nri.Ingredient} ({nri.Brand})</label>
     <div class="col-sm-10">
      <input id={nri.id} class="form-control" type="text" bind:value={nri.value} /> <strong>{nri.Quantity_Measurement}</strong>
     </div>
    {/each}
    </div> 

    <!-- <div class="row">
      <button class="btn btn-md btn-primary" on:click="{() => addNewRecipeIngredients(new_recipe_ingredients)}">Add Ingredients and Measurements</button>
    </div> -->

  <h3>Directions</h3>
    <div class="form-group row">
            <label for="new_recipe_directions_1">Use periods to differentiate steps.</label>
      <input id="new_recipe_directions_1" class="form-control" bind:value={new_recipe_directions_1} type="textarea" />
    </div>    

    <div class="form-check row">
      <input id="share" class="form-check-input" type="checkbox" bind:value={new_recipe_ingredient_shareable}> <label class="form-check-label" for="share">Share with Community?</label>
    </div>
    <br />

    <button class="btn btn-lg btn-success" on:click="{() => addNewRecipe(new_recipe_name)}">Add Recipe to Recipe Book</button>  
    
</form>

{/if}
<hr />

<p> <button class="btn btn-md btn-primary" on:click="{() => enterInventory()}">Input Your Inventory</button><span class="badge badge-danger">Missing</span> You must enter your current food inventory to get started.</p>

{#if enteringInventory}
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
<hr />
<p><button class="btn btn-md btn-primary">Create a meal plan</button><span class="badge badge-danger">Missing</span> Plan your meals for the week. </p>

<hr />
{#if ingredients_count > 0}
<p><button on:click="{() => enterIngredient()}" class="btn btn-md btn-secondary">Add ingredients</button><span class="badge badge-success">Complete</span> You have {ingredients_count} ingredients. </p>
{:else}
<p><button on:click="{() => enterIngredient()}" class="btn btn-md btn-success">Add ingredients</button><span class="badge badge-danger">Missing</span> You have {ingredients_count} ingredients. </p>
{/if}

{#if enteringIngredient}
<form on:submit|preventDefault> 
<table class="table-responsive">
    <legend>Add New Ingredient</legend>
    <tr>
            <td>Ingredient: <input id="Ingredient" placeholder="Pineapple" bind:value={new_ingredient_name} type="text" />
            <!-- <td>Ingredient: <AutoComplete items={possible_ingredients} labelFieldName="Ingredient" bind:selectedItem={new_ingredient_name} /></td> -->
            <td>Brand: <input id="Brand" placeholder="Dole" bind:value={new_ingredient_brand} type="text" /></td>
            <td><label>How Do You Measure the Quantity?<select bind:value={new_ingredient_measurement} id="Quantity_Measurement">
              <option>Each</option>
              <option>Oz</option>
              <option>Lb</option>
              <option>Grams</option>
              <option>Slices</option>
              <option>Cups</option>
              <option>Tablespoons</option>
              <option>Teaspoons</option>
            </select></label>
            </td>
            <td><button class="btn btn-lg btn-primary" on:click="{() => addNewIngredient(new_ingredient_name, new_ingredient_brand, new_ingredient_measurement)}">Add</button></td>
    </tr>

</table>
</form>
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

<h1 class="text-center">My Recipes</h1>

<table class="table-light">
  {#each recipes as rec}
    <tr class="row-success">  
      <td>{rec.recipes.Recipe}</td>
    </tr>
  {/each}
</table>

<br />



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
