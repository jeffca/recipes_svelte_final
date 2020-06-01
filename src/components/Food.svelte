<script>
  import { onMount } from "svelte";
  import { markDone } from "../helpers.js";
  import {link} from 'svelte-spa-router'
  import { executeGraphql } from "../helpers.js";
  import { claims } from '../stores.js';

    export let hasura_userID;

    export let recipes = [];
    export let possible_ingredients = []
    export let filteredCommunityRecipes = {};
    export let filteredMyRecipes = [];
    export let recipeNames = [];
    export let recipes_ids = [];
    export let viewingMyFilteredRecipes;
    export let viewingMyCategoryFilteredRecipes;
    export let viewingRecipes, viewingMyRecipes, communityRecipe, viewingCommunityRecipe, viewingCommunityRecipes, viewingFilteredCommunityRecipes, viewingInventory, viewingIngredients, enteringRecipe, enteringIngredient;
    export let communityRecipeIngredients;
    export let current_meal_type;
    export let current_category;
    export let unique_meal_types = [];
    export let unique_meal_types_counts = [];
    export let unique_categories = [];
    export let unique_category_counts = [];

    claims.subscribe(v => {
      if ($claims) {
        getPossibleIngredients();
        getPossibleRecipes();
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

    async function viewMyRecipes() {
      viewingMyRecipes = true;
      viewingMyFilteredRecipes = false;
      viewingMyCategoryFilteredRecipes = false;
      unique_categories = [];
      unique_category_counts = [];
    }

    async function filterMyRecipes(parent_meal, parent_category, recipe_name) {
        viewingMyRecipes = false;
        let q = ``;
        if (parent_meal != null && parent_category != null && recipe_name == null) {
            console.log("second level filter!")
            viewingMyCategoryFilteredRecipes = true;
            viewingMyFilteredRecipes = false;
            unique_category_counts = [];
            unique_categories = [];
            recipeNames = [];
            recipeNames = recipeNames;
            recipes_ids = [];
            recipes_ids = recipes_ids;
            q = `
                {
                    users_recipes(where: {recipes: {Meal_Type: {_eq: "` + parent_meal + `"}, Category: {_eq: "` + parent_category + `"}}}) {
                        recipes {
                        Meal_Type
                        Category
                        Recipe
                        }
                        id
                    }
                }
                `;
            current_category = parent_category;
        } else if (parent_category == null && recipe_name == null) {
            console.log("top level filter!")
            viewingMyFilteredRecipes = true;
            viewingMyCategoryFilteredRecipes = false;
            q = `
                {
                    users_recipes(where: {recipes: {Meal_Type: {_eq: "` + parent_meal + `"}}}) {
                        recipes {
                        Meal_Type
                        Category
                        Recipe
                        }
                        id
                    }
                }
                `;
            current_meal_type = parent_meal;
        } else {
            console.log("third level filter! show him the recipe names.")
            q = `

            `
        }
        let temp = await executeGraphql(q, $claims);
        console.log(temp.data.users_recipes);
        filteredMyRecipes = temp.data.users_recipes;
        for (var i = 0; i < filteredMyRecipes.length; i++) {
            recipeNames.push('"' + filteredMyRecipes[i]["recipes"]["Recipe"] + '"');
            let recipe_id_mapping = {}
            recipe_id_mapping[filteredMyRecipes[i]["recipes"]["Recipe"]] = filteredMyRecipes[i]["id"]
            recipes_ids.push(recipe_id_mapping);
            if (!unique_categories.includes(filteredMyRecipes[i]["recipes"]["Category"])) {
                unique_categories.push(filteredMyRecipes[i]["recipes"]["Category"]);
            }
        }
        console.log(recipeNames);
        recipeNames = recipeNames;
        recipes_ids = recipes_ids;
        for (var i = 0; i < unique_categories.length; i ++) {
            q = `
                {
                    recipes_aggregate(where: {Category: {_eq: "` + unique_categories[i] + `"}, Meal_Type: {_eq: "` + parent_meal + `"} Recipe: {_in: [` + recipeNames + `]}}) {
                        aggregate {
                        count
                        }
                    }
                }
                `;
            temp = await executeGraphql(q, $claims);
            let category_count_mapping = {};
            category_count_mapping[unique_categories[i]] = temp.data.recipes_aggregate.aggregate.count;
            unique_category_counts.push(category_count_mapping);
        }
        unique_category_counts = unique_category_counts;
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
        console.log("he wants to pick a sub category from the main categories")
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
    }

    async function getPossibleRecipes() {
      let q = `
      {
        users_recipes(order_by: {recipes: {Meal_Type: asc}}) {
          recipes {
            Recipe
            id
            Meal_Type
            Category
            Subcategory
          }
        }
      }

      `
      let temp = await executeGraphql(q, $claims); 
      recipes = temp.data.users_recipes;
      console.log(recipes);

      let recipeNames = [];
      for (var i = 0; i < recipes.length; i++) {
          console.log("adding unique meal types");
          console.log("adding recipe names to new array");
          if (!unique_meal_types.includes(recipes[i]["recipes"]["Meal_Type"])) {
              unique_meal_types.push(recipes[i]["recipes"]["Meal_Type"])
          }
          recipeNames.push('"' + recipes[i]["recipes"]["Recipe"] + '"');
      }
      console.log(unique_meal_types);
      console.log(recipeNames);
      for (var i = 0; i < unique_meal_types.length; i++) {
        q = `
            {
                recipes_aggregate(where: {Meal_Type: {_eq: "` + unique_meal_types[i] + `"}, Recipe: {_in: [` + recipeNames + `]}}) {
                    aggregate {
                    count
                    }
                }
            }
            `;
        temp = await executeGraphql(q, $claims);
        let meal_type_count_mapping = {};
        meal_type_count_mapping[unique_meal_types[i]] = temp.data.recipes_aggregate.aggregate.count;
        unique_meal_types_counts.push(meal_type_count_mapping);
      }
      console.log(unique_meal_types_counts);
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
 
  async function enterRecipe() {
    viewingMyRecipes = false;
    enteringRecipe = true;
  }

  async function enterIngredient() {
    enteringIngredient = true;
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


  onMount(async () => {
  });

</script>

<div class="row text-center">
  <div class="col-sm-4">
    <button on:click={() => viewingMyRecipes = true} class="btn btn-md btn-outline-success">View My Recipes</button>
  </div>
  <div class="col-sm-4">
    <a href="/food/recipes/new" use:link class="btn btn-md btn-info">Add New Recipe</a>
  </div>
  <div class="col-sm-4">
    <button class="btn btn-md btn-outline-info">Learn a Community Recipe</button>
  </div>
</div>


{#if viewingMyRecipes}
    {#if unique_meal_types_counts.length > 0}
    <ul class="list-group">
        {#each unique_meal_types_counts as umt}
            <li class="list-group-item d-flex justify-content-between align-items-center" on:click={() => filterMyRecipes(Object.keys(umt)[0], null, null)}>
                <label class="recipesNav">{Object.keys(umt)[0]}</label>
                <span class="badge badge-primary badge-pill">{umt[Object.keys(umt)[0]]}</span>
            </li>
        {/each}  
    </ul>
    {:else}
        <p>Add a new recipe to get started. Or learn a Community Recipe!</p>
    {/if}
{/if}

{#if viewingMyFilteredRecipes}
<ul class="list-group">
  {#each unique_category_counts as ucc}
    <li class="list-group-item d-flex justify-content-between align-items-center" on:click={() => filterMyRecipes(current_meal_type, Object.keys(ucc)[0], null) }>
      <label class="recipesNav">{Object.keys(ucc)[0]}</label>
      <span class="badge badge-primary badge-pill">{ucc[Object.keys(ucc)[0]]}</span>
    </li>
  {/each}
</ul>
<p>
    <button class="btn btn-md btn-secondary" on:click={() => viewMyRecipes()}><img class="icon" alt="back" src="/open-iconic-master/svg/chevron-left.svg"> Back</button>
</p>
{/if}

{#if viewingMyCategoryFilteredRecipes}
<ul class="list-group">
  {#each recipes_ids as rn}
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <a href={"/food/recipes/" + rn[Object.keys(rn)[0]]} use:link><label class="recipesNav">{Object.keys(rn)[0]}</label></a>
    </li>
  {/each}
</ul>
<p>
    <button class="btn btn-md btn-secondary" on:click={() => viewMyRecipes()}><img class="icon" alt="back" src="/open-iconic-master/svg/chevron-left.svg"> Back</button>
</p>
{/if}