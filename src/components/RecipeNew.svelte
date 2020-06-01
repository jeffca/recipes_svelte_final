<script>
    export let new_recipe_name;
    export let possible_ingredients = [];
    export let new_recipe_ingredients = [];
    export let new_recipe_directions_1;
    export let new_recipe_ingredient_shareable;
    export let new_ingredient_name, new_ingredient_brand, new_ingredient_measurement;
    export let new_recipe_meal_type;
    export let new_recipe_category;
    
    import {link} from 'svelte-spa-router';
    import { executeGraphql } from "../helpers.js";
    import { claims } from '../stores.js';

    claims.subscribe(v => {
      if ($claims) {
        getPossibleIngredients();
      } 
    })

    async function userLevelUp() {
      let levels_codes = {
        1: "Apprentice",
        2: "Prep Cook",
        3: "Sous Chef",
        4: "Executive Chef",
      };
      if (user_level < 4) {
        let new_user_level = user_level + 1;
        let q = `
          mutation {
            update_users(_set: {Onboarding_Level: ` + new_user_level + `, Onboarding_Code: "` + levels_codes[new_user_level] + `"}, where: {x_hasura_user_id: {_eq: "` + hasura_userID + `"}}) {
              returning {
                Onboarding_Code
                Onboarding_Level
              }
            }
          }
          `
        let temp = await executeGraphql(q, $claims);
        user_level = new_user_level;
        user_code = levels_codes[user_level];
      }
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
    }

    async function addNewRecipe(name) {
      let q = `
        mutation {
          insert_recipes_one(object: {Recipe: " ` + name + `", Directions: "` + new_recipe_directions_1 +  `", Meal_Type: "` + new_recipe_meal_type + `", Category: "` + new_recipe_category + `"}) {
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

      console.log("new recipe added!")
      window.location.assign("/#/food");
    }


</script>

<h3 class="text-center">Add one of your favorite recipes.</h3>
<form on:submit|preventDefault> 
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

    <p>
    <button class="btn btn-md btn-outline-info" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
        Add missing ingredient
    </button>
    </p>
    <div class="collapse" id="collapseExample">
    <div class="card card-body">
        <form on:submit|preventDefault> 
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Ingredient</label>
                <div class="col-sm-10">
                <input type="text" bind:value={new_ingredient_name} class="form-control" id="staticEmail">
                </div>
            </div>
            <div class="form-group row">
                <label for="inputPassword" class="col-sm-2 col-form-label">Brand (Optional)</label>
                <div class="col-sm-10">
                <input type="text" bind:value={new_ingredient_brand} class="form-control" id="blah" placeholder="Dave's Famous Bread">
                </div>
            </div>
            <div class="form-group row">
                    <label class="col-sm-2 col-form-label">How Do You Measure the Quantity?</label>
                    <div class="col-sm-10">
                        <select bind:value={new_ingredient_measurement} id="Quantity_Measurement">
                            <option>Each</option>
                            <option>Oz</option>
                            <option>Lb</option>
                            <option>Grams</option>
                            <option>Slices</option>
                            <option>Cups</option>
                            <option>Tablespoons</option>
                            <option>Teaspoons</option>
                        </select>                    
                    </div>
            </div>            
            <div class="text-center">
                <button class="btn btn-lg btn-primary" on:click="{() => addNewIngredient(new_ingredient_name, new_ingredient_brand, new_ingredient_measurement)}">Add New Ingredient</button>
            </div>
        </form>
    </div>
  </div>
  <h3>Measurements</h3>
    <div class="form-group row">
    {#each new_recipe_ingredients as nri, i}
     <label for={nri.id} class="col-sm-2 col-form-label">{nri.Ingredient} ({nri.Brand})</label>
     <div class="col-sm-10">
      <input id={nri.id} class="form-control" type="text" bind:value={nri.value} /> <strong>{nri.Quantity_Measurement}</strong>
     </div>
    {/each}
    </div> 

  <h3>Directions</h3>
    <div class="form-group row">
            <label for="new_recipe_directions_1">Use periods to differentiate steps.</label>
      <textarea id="new_recipe_directions_1" class="form-control" bind:value={new_recipe_directions_1} />
    </div>    

    <h3>Category</h3>
    <div class="row">
        <div class="col-sm-2">
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_category} value="American" id="exampleRadios1">
                <label class="form-check-label" for="exampleRadios1">
                    American
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_category} value="Italian" id="exampleRadios2">
                <label class="form-check-label" for="exampleRadios2">
                    Italian
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_category} value="French" id="exampleRadios3">
                <label class="form-check-label" for="exampleRadios3">
                    French
                </label>
            </div>        
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_category} value="Mexican" id="exampleRadios4">
                <label class="form-check-label" for="exampleRadios4">
                    Mexican
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_category} value="Chinese" id="exampleRadios5">
                <label class="form-check-label" for="exampleRadios5">
                    Chinese
                </label>
            </div>    
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_category} value="Japanese" id="exampleRadios6">
                <label class="form-check-label" for="exampleRadios6">
                    Japanese
                </label>
            </div>    
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_category} value="Thai" id="exampleRadios7">
                <label class="form-check-label" for="exampleRadios7">
                    Thai
                </label>
            </div>                     
        </div>
        <div class="col-sm-2">
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_meal_type} value="Lunch or Dinner" id="xampleRadios1">
                <label class="form-check-label" for="xampleRadios1">
                    Lunch or Dinner
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_meal_type} value="Breakfast" id="xampleRadios2">
                <label class="form-check-label" for="xampleRadios2">
                    Breakfast
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_meal_type} value="Snacks" id="xampleRadios3">
                <label class="form-check-label" for="xampleRadios3">
                    Snack
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" bind:group={new_recipe_meal_type} value="Drinks" id="xampleRadios4">
                <label class="form-check-label" for="xampleRadios4">
                    Drink
                </label>
            </div>     
        </div>        
    </div>

    <p>&nbsp;</p>

    <div class="form-check row">
      <input id="share" class="form-check-input" checked type="checkbox" bind:value={new_recipe_ingredient_shareable}> <label class="form-check-label" for="share">Share with Community?</label>
    </div>
    <br />
    <div class="text-center">
        <button class="btn btn-lg btn-success" on:click="{() => addNewRecipe(new_recipe_name)}">Add Recipe to Recipe Book</button>  
    </div>
    
</form>

<p>&nbsp;</p>
    <a href="/food" use:link class="btn btn-md btn-outline-dark"><img src="/open-iconic-master/svg/chevron-left.svg" class="icon" alt="back"/> Back</a>