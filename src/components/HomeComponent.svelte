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
     export let new_recipe_name, new_ingredient_name, new_ingredient_brand, new_recipe_ingredient_quantity, new_ingredient_measurement;
     export let last_ingredientID;
     export let existing_ingredient, enteringRecipeIngredient2, enteringRecipeIngredient3;
     export let enteringRecipeIngredient = true;
    

    authToken.subscribe(value => {
      console.log("auth token changed!")
      console.log($authToken);
    })
    claims.subscribe(v => {
      console.log("claims changed!")
      console.log($claims)
      console.log("claims should be ready!");
      const res = getCategories();
      const res2 = getPossibleIngredients();
      const res3 = getPossibleRecipes();
    })

    async function getPossibleIngredients() {
        let q = `
                {
                  users_ingredients(order_by: {ingredients: {Ingredient: asc}}) {
                    ingredients {
                      id
                      Brand
                      Ingredient
                    }
                  }
                }
                `
        let c = $claims;
        let temp_ingredients = await executeGraphql(q, c); 
        temp_ingredients = temp_ingredients.data.users_ingredients;
        console.log(temp_ingredients);
        for (var i = 0; i < temp_ingredients.length; i++) {
          console.log("added an ingredient to the users list!");
          possible_ingredients.push({"id": temp_ingredients[i].ingredients.id, "Ingredient": temp_ingredients[i].ingredients.Ingredient, "Brand": temp_ingredients[i].ingredients.Brand});
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

    async function addNewRecipe(name) {
      let q = `
        query {
          recipes(order_by: {id: desc_nulls_last}, limit: 1) {
            id
          }
        }
      `
      let temp = await executeGraphql(q, $claims);
      let last_recipeID = temp.data.recipes[0].id;
      console.log(last_recipeID);
      q = `
        mutation {
          insert_recipes_one(object: {id: ` + (last_recipeID + 1) + `, Recipe: " ` + name + `", Directions: "` + new_recipe_directions_1 +  `"}) {
            id
            }
        }
       `
      temp = await executeGraphql(q, $claims);
      let new_recipeID = temp.data.insert_recipes_one.id;
      console.log(new_recipeID);

      q = `
        query {
          users_recipes(order_by: {id: desc_nulls_last}, limit: 1) {
            id
          }
        }
      `
      temp = await executeGraphql(q, $claims);
      let last_users_recipesID = temp.data.users_recipes[0].id;

      q = `
          mutation {
            insert_users_recipes(objects: {RecipeID: ` + new_recipeID + `, id: ` + (last_users_recipesID + 1) + `}) {
              returning {
                recipes {
                  Recipe
                }
              }
            }
          }
       `
      temp = await executeGraphql(q, $claims);
      let new_users_recipe = temp.data.insert_users_recipes.returning[0].recipes.Recipe;
      console.log("counting the new recipe ingredients");

      let new_recipe_ingredient_count = 0;

      console.log(ingredient1.id);
      console.log(ingredient2.id);

      ingredient1.id > 0 ? new_recipe_ingredient_count + 1 : 0;
      ingredient2.id > 0 ? new_recipe_ingredient_count + 1 : 0;

      let new_ingredients = [];

      if (new_recipe_ingredient_count == 2) {
        new_ingredients.push(ingredient1.id);
        new_ingredients.push(ingredient2.id);
      }

      for (var i = 1; i <= new_recipe_ingredient_count; i ++) {
        let vartest = "ingredient" + i.toString();
        console.log(vartest);
        console.log(ingredient1.id);
        q = `
            mutation {
              insert_ingredients_recipes(objects: {IngredientID: ` + new_ingredients[i].id + ` , RecipeID: ` + new_recipeID + `, Quantity_Measurement: "` + new_recipe_ingredrient_quantity_measurement_1 + `", Quantity: ` + new_recipe_ingredrient_quantity_1 + `}) {
                returning {
                  ingredients_recipe_2 {
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

  async function findLastIngredientID() {
    let q = `
      query {
        ingredients(order_by: {id: desc_nulls_last}, limit: 1) {
          id
        }
      }
    `
    let temp = await executeGraphql(q, $claims);
    last_ingredientID = temp.data.ingredients[0].id;
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
    last_ingredientID += 1;

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
    findLastIngredientID();
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

{#if !$claims}
<h1>Hi, Guest!</h1>
{/if}

{#if $claims}

<ul class="nav">
  <li class="nav-item">
    <a class="nav-link " href="/" use:link>Home</a>
  </li>
  <!-- <li class="nav-item">
    <a class="nav-link active" href="/inventory" use:link>Inventory</a>
  </li> -->
  <li class="nav-item">
    <a class="nav-link" href="/meals" use:link>Meals</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/grocerylist" use:link>Grocery List</a>
  </li>
</ul>

<h1>Welcome, {$userInfo["nickname"]}!</h1>

{#if recipes_count > 0}
<p><button on:click="{() => enterRecipe()}" class="btn btn-md btn-secondary">Add recipe</button><span class="badge badge-success">Complete</span> You have {recipes_count} recipes. </p>
{:else}
<p><button on:click="{() => enterRecipe()}" class="btn btn-md btn-success">Add recipe</button><span class="badge badge-danger">Missing</span> You have {recipes_count} recipes. </p>
{/if}

{#if enteringRecipe}
<form on:submit|preventDefault> 
<h2>Add New Recipe</h2>
    <div class="form-group">
      <label for="new_recipe_name">Recipe Name</label>
      <input id="new_recipe_name" class="form-control" bind:value={new_recipe_name} type="text" />
    </div>              
  <h3>Ingredients</h3>
    <div class="form-group row">
      <div class="col-sm-6">
      <label for="new_recipe_ingredient_name"> Ingredient #1</label> 
        <AutoComplete class="form-control input" items={possible_ingredients} valueFieldName="id" labelFieldName="Ingredient" bind:selectedItem={ingredient1} onSelectedItemChanged={updateQM(ingredient1.id, 1)} />
      </div>
      <div class="col-sm-6">
      <label for="new_recipe_ingredrient_quantity_measurement_1" class="col-sm-6">Quantity:</label>
        <input id="new_recipe_ingredrient_quantity_measurement_1" bind:value={new_recipe_ingredrient_quantity_1} type="text" /> (<strong>{new_recipe_ingredrient_quantity_measurement_1}</strong>)
      </div>
    </div>
    <div class="form-group row">
      <div class="col-sm-6">
      <label for="new_recipe_ingredient_name"> Ingredient #2</label> 
        <AutoComplete class="form-control input" items={possible_ingredients} valueFieldName="id" labelFieldName="Ingredient" bind:selectedItem={ingredient2} onSelectedItemChanged={updateQM(ingredient2.id, 2)} />
      </div>
      <div class="col-sm-6">
      <label for="new_recipe_ingredient_quantity" class="col-sm-6">Quantity:</label>
        <input id="new_recipe_ingredient_quantity" bind:value={new_recipe_ingredrient_quantity_2} type="text" /> (<strong>{new_recipe_ingredrient_quantity_measurement_2}</strong>)
      </div>
    </div>    

    <div class="row">
      <button class="btn btn-md btn-primary">Add More Ingredients</button>
    </div>
    <p><b>* Add new ingredients below if you do not see your ingredient listed.</b></p>

  <h3>Directions</h3>
    <div class="form-group row">
            <label for="new_recipe_directions_1">Step One:</label>
      <input id="new_recipe_directions_1" class="form-control" bind:value={new_recipe_directions_1} type="text" />
    </div>    

    <div class="row">
      <button class="btn btn-md btn-primary">Add More Steps</button>
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
