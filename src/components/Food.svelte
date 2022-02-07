<script>
  import { onMount } from "svelte";
  import { markDone } from "../helpers.js";
  import {link} from 'svelte-spa-router'
  import { executeGraphql } from "../helpers.js";
  import { claims, groceryListCount } from '../stores.js';
  import { authToken } from '@dopry/svelte-auth0';

    export let hasura_userID;

    export let loadingRecipes = false;

    export let recipes = [];
    export let possible_ingredients = []
    export let filteredCommunityRecipes = {};
    export let filteredMyRecipes = [];
    export let recipeNames = [];
    export let recipes_ids = [];
    export let viewingMyFilteredRecipes;
    export let viewingMyCategoryFilteredRecipes;
    export let viewingRecipes, viewingMyRecipes, communityRecipe, viewingCommunityRecipe, viewingCommunityRecipes, viewingFilteredCommunityRecipes, viewingCommunityCategoryFilteredRecipes, viewingInventory, viewingIngredients, enteringRecipe, enteringIngredient;
    export let communityRecipeIngredients;
    export let current_meal_type;
    export let current_category;
    export let unique_meal_types = [];
    export let unique_meal_types_counts = [];
    export let unique_categories = [];
    export let unique_category_counts = [];

    // claims.subscribe(v => {
    //   if ($claims) {
    //     getPossibleRecipes();
    //   } 
    // })

    async function countGroceryList() {
        console.log("Logging claims from counting grocery list");
        console.log($claims);
        let q = `
            {
                grocerylist_aggregate(where: {Done: {_eq: "No"}}) {
                    aggregate {
                        count
                    }
                }
            }
        `
        let temp = await executeGraphql(q, $claims); 

        $groceryListCount = temp.data.grocerylist_aggregate.aggregate.count;

    }    

    async function viewMyRecipes() {
      loadingRecipes = true;
      viewingMyRecipes = true;
      console.log("SET VIEWING MY RECIPES TO TRUE");
      viewingMyFilteredRecipes = false;
      viewingMyCategoryFilteredRecipes = false;
      viewingCommunityRecipes = false;
      viewingFilteredCommunityRecipes = false;
      viewingCommunityCategoryFilteredRecipes = false; 
      unique_categories = [];
      unique_category_counts = [];
      unique_meal_types = [];
      unique_meal_types_counts = [];
      getPossibleRecipes();
    }

    async function filterMyRecipes(parent_meal, parent_category, recipe_name) {
        viewingMyRecipes = false;
        let q = ``;
        unique_category_counts = [];
        unique_categories = [];
        unique_categories = unique_categories;
        unique_category_counts = unique_category_counts;
        if (parent_meal != null && parent_category != null && recipe_name == null) {
            console.log("second level filter!")
            viewingMyCategoryFilteredRecipes = true;
            viewingMyFilteredRecipes = false;

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
                        id
                        }
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
            recipe_id_mapping[filteredMyRecipes[i]["recipes"]["Recipe"]] = filteredMyRecipes[i]["recipes"]["id"]
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
        viewingMyFilteredRecipes = false;
        viewingMyCategoryFilteredRecipes = false;
        viewingCommunityCategoryFilteredRecipes = false;
        unique_category_counts = [];
        unique_categories = [];
        unique_meal_types = [];
        unique_meal_types_counts = [];
        recipes_ids = [];
        recipes_ids = recipes_ids;
        unique_categories = unique_categories;
        unique_meal_types = unique_meal_types;
        unique_category_counts = unique_category_counts;
        unique_meal_types_counts = unique_meal_types_counts;
        let q = `
                {
                recipes(where: {Shareable: {_eq: true}}, order_by: {Meal_Type: asc}) {
                    Recipe
                    Meal_Type
                    Category
                    id
                }
                }
                `;
        let temp = await executeGraphql(q, $claims);
        let communityRecipes = temp.data.recipes;
        for (var i = 0; i < communityRecipes.length; i++) {
            recipeNames.push('"' + communityRecipes[i]["Recipe"] + '"');
            let recipe_id_mapping = {}
            recipe_id_mapping[communityRecipes[i]["Recipe"]] = communityRecipes[i]["id"]
            recipes_ids.push(recipe_id_mapping);
            if (!unique_meal_types.includes(communityRecipes[i]["Meal_Type"])) {
                unique_meal_types.push(communityRecipes[i]["Meal_Type"]);
                console.log("Adding " + communityRecipes[i]["Meal_Type"] + " as a unique meal type");
            }
        }
        console.log(unique_meal_types);
        for (var i = 0; i < unique_meal_types.length; i ++) {
            q = `
                {
                    recipes_aggregate(where: {Meal_Type: {_eq: "` + unique_meal_types[i] + `"}}) {
                        aggregate {
                        count
                        }
                    }
                }
                `;
            temp = await executeGraphql(q, $claims);
            let category_count_mapping = {};
            category_count_mapping[unique_meal_types[i]] = temp.data.recipes_aggregate.aggregate.count;
            unique_meal_types_counts.push(category_count_mapping);
        }
        unique_meal_types_counts = unique_meal_types_counts;
        recipes_ids = recipes_ids;
        console.log(recipes_ids);
        console.log(unique_meal_types_counts);
    }

    async function filterCommunityRecipes(parent_meal_type, parent_category, recipe_name) {
        recipes_ids = [];
        recipes_ids = recipes_ids;
        viewingCommunityRecipes = false;
        let q = ``;
        let temp;
        console.log(parent_meal_type);
        if (parent_meal_type != null && parent_category == null && recipe_name == null) {
            console.log("top level filter!");
            unique_categories = [];
            unique_category_counts = [];
            unique_meal_types = [];
            unique_meal_types_counts = [];
            unique_categories = unique_categories;
            unique_category_counts = unique_category_counts;
            unique_meal_types = unique_meal_types;
            unique_meal_types_counts = unique_meal_types_counts;

            viewingFilteredCommunityRecipes = true;
            viewingCommunityCategoryFilteredRecipes = false;
            q = `
                {
                recipes(where: {Shareable: {_eq: true}, Meal_Type: {_eq: "` + parent_meal_type + `"}}, order_by: {Category: asc}) {
                    Recipe
                    Meal_Type
                    Category
                    id
                }
                }
              `;
        } else if (parent_meal_type != null && parent_category != null && recipe_name == null) {
            console.log("second level filter!");
            viewingCommunityCategoryFilteredRecipes = true;
            viewingFilteredCommunityRecipes = false;
            q = `
                {
                recipes(where: {Shareable: {_eq: true}, Meal_Type: {_eq: "` + parent_meal_type + `"}, Category: {_eq: "` + parent_category + `"}}, order_by: {Category: asc}) {
                    Recipe
                    Meal_Type
                    Category
                    id
                }
                }
            `
        }
        temp = await executeGraphql(q, $claims);
        temp = temp.data.recipes;

        for (var i = 0; i < temp.length; i++) {
            let recipe_id_mapping = {}
            recipe_id_mapping[temp[i]["Recipe"]] = temp[i]["id"]
            recipes_ids.push(recipe_id_mapping);
            if (!unique_categories.includes(temp[i]["Category"])) {
                unique_categories.push(temp[i]["Category"]);
            }
        }        
        unique_categories = unique_categories;
        recipes_ids = recipes_ids;
        for (var i = 0; i < unique_categories.length; i++) {
            q = `
                {
                    recipes_aggregate(where: {Category: {_eq: "` + unique_categories[i] + `"}, Meal_Type: {_eq: "` + parent_meal_type + `"}}) {
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
        current_meal_type = parent_meal_type;
        unique_category_counts = unique_category_counts;
    }

    async function viewIngredients() {
      viewingIngredients = true;
      viewingRecipes = false;
      viewingInventory = false;
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

      let recipeNames = [];

      for (var i = 0; i < recipes.length; i++) {
          if (!unique_meal_types.includes(recipes[i]["recipes"]["Meal_Type"])) {
              unique_meal_types.push(recipes[i]["recipes"]["Meal_Type"])
          }
          recipeNames.push('"' + recipes[i]["recipes"]["Recipe"] + '"');
      }
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
      unique_meal_types = unique_meal_types;
      unique_meal_types_counts = unique_meal_types_counts;
      loadingRecipes = false;
      console.log(unique_meal_types_counts);
  }

  onMount(async () => {
    countGroceryList();
  });

</script>







<!-- END JAVA SCRIPT -->
<!-- START HTML -->



<div class="row text-center">
  <div class="col-md-5">
    <button on:click={() => viewMyRecipes()} class="btn btn-md btn-outline-success">View My Recipes</button>
  </div>

  <div class="col-md-1">&nbsp;</div>


  <div class="col-sm-5">
    <button on:click={() => viewCommunityRecipes()} class="btn btn-md btn-outline-info">Learn a Community Recipe</button>
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
        {#if loadingRecipes}
            <p class='loading'>Loading... <img src="/open-iconic-master/svg/clock.svg" class="svg" alt="loading"></p>
        {:else}
            <p>Welcome to your first time using Grimp!</p>
            <p><button on:click={() => viewCommunityRecipes()} class="btn btn-lg btn-outline-info">View the Community Recipes</button></p>
        {/if}
    {/if}

    <div class="col-md-2">&nbsp;</div>
  <div class="col-md-3"><a href="/food/recipes/new" use:link><button class="btn btn-lg btn-outline-warning">Create New Recipe</button></a></div>

{/if}

{#if viewingMyFilteredRecipes}
{#if unique_category_counts.length > 0}
<ul class="list-group">
  {#each unique_category_counts as ucc}
    <li class="list-group-item d-flex justify-content-between align-items-center" on:click={() => filterMyRecipes(current_meal_type, Object.keys(ucc)[0], null) }>
      <label class="recipesNav">{Object.keys(ucc)[0]}</label>
      <span class="badge badge-primary badge-pill">{ucc[Object.keys(ucc)[0]]}</span>
    </li>
  {/each}
</ul>
{:else}
    <p class='loading'>Loading... <img src="/open-iconic-master/svg/clock.svg" class="svg" alt="loading"></p>
{/if}
<p>
    <button class="btn btn-md btn-secondary" on:click={() => viewMyRecipes()}><img class="icon" alt="back" src="/open-iconic-master/svg/chevron-left.svg"> Back</button>
</p>
{/if}

{#if viewingMyCategoryFilteredRecipes}
{#if recipes_ids.length > 0}
<ul class="list-group">
  {#each recipes_ids as rn}
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <a href={"/food/recipes/" + rn[Object.keys(rn)[0]]} use:link><label class="recipesNav">{Object.keys(rn)[0]}</label></a>
    </li>
  {/each}
</ul>
{:else}
    <p class='loading'>Loading... <img src="/open-iconic-master/svg/clock.svg" class="svg" alt="loading"></p>
{/if}
<p>
    <button class="btn btn-md btn-secondary" on:click={() => filterMyRecipes(current_meal_type, null, null)}><img class="icon" alt="back" src="/open-iconic-master/svg/chevron-left.svg"> Back</button>
</p>
{/if}



{#if viewingCommunityRecipes}
{#if !viewingMyRecipes}
    {#if unique_meal_types_counts.length > 0}
    <ul class="list-group">
        {#each unique_meal_types_counts as umt}
            <li class="list-group-item d-flex justify-content-between align-items-center" on:click={() => filterCommunityRecipes(Object.keys(umt)[0], null, null)}>
                <label class="recipesNav">{Object.keys(umt)[0]}</label>
                <span class="badge badge-primary badge-pill">{umt[Object.keys(umt)[0]]}</span>
            </li>
        {/each}  
    </ul>
    {:else}
        <p class='loading'>Loading... <img src="/open-iconic-master/svg/clock.svg" class="svg" alt="loading"></p>
    {/if}
{/if}
{/if}

{#if viewingFilteredCommunityRecipes}
    {#if unique_category_counts.length > 0}
    <ul class="list-group">
    {#each unique_category_counts as ucc}
        <li class="list-group-item d-flex justify-content-between align-items-center" on:click={() => filterCommunityRecipes(current_meal_type, Object.keys(ucc)[0], null) }>
        <label class="recipesNav">{Object.keys(ucc)[0]}</label>
        <span class="badge badge-primary badge-pill">{ucc[Object.keys(ucc)[0]]}</span>
        </li>
    {/each}
    </ul>
    {:else}
        <p class='loading'>Loading... <img src="/open-iconic-master/svg/clock.svg" class="svg" alt="loading"></p>
    {/if}
    <p>
        <button class="btn btn-md btn-secondary" on:click={() => viewCommunityRecipes()}><img class="icon" alt="back" src="/open-iconic-master/svg/chevron-left.svg"> Back</button>
    </p>
{/if} 

{#if viewingCommunityCategoryFilteredRecipes}
{#if recipes_ids.length > 0}
<ul class="list-group">
  {#each recipes_ids as rn}
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <a href={"/food/recipes/" + rn[Object.keys(rn)[0]]} use:link><label class="recipesNav">{Object.keys(rn)[0]}</label></a>
    </li>
  {/each}
</ul>
{:else}
    <p class='loading'>Loading... <img src="/open-iconic-master/svg/clock.svg" class="svg" alt="loading"></p>
{/if}
<p>
    <button class="btn btn-md btn-secondary" on:click={() => filterCommunityRecipes(current_meal_type, null, null)}><img class="icon" alt="back" src="/open-iconic-master/svg/chevron-left.svg"> Back</button>
</p>
{/if}