<script>
  import { onMount } from "svelte";
  import { claims } from '../stores.js';
  import {link} from 'svelte-spa-router' 
  import { executeGraphql } from "../helpers.js";
  import { addToGroceryList, addAllItemsToGroceryList } from "../helpers.js";
  export let params;
  export let recipe;
  export let ingredients;
  export let disabled = false;

  async function findRecipe() {
    let q = `
            {   
              recipes_by_pk(id:` + params.id + `) { 
                id 
                Recipe 
                Directions 
              } 
            }
            `;
    let temp = await executeGraphql(q, $claims);
    recipe = temp.data.recipes_by_pk;

    q = `
        {
            ingredients_recipes(where: {UserRecipeID: {_eq: ` + params.id + `}}) {
                ingredients {
                    id
                    Ingredient
                }
                Quantity_Measurement
                Quantity
            }
        }
        `
    let temp2 = await executeGraphql(q, $claims);
    ingredients = temp2.data.ingredients_recipes;
  } 

  claims.subscribe(v => {
    if ($claims) {
      findRecipe();
  }});

</script>

{#if recipe}

<div id="recipeBackground">
  <h1 class="text-center" id="recipeTitle">{recipe.Recipe}</h1>
  <br />

  {#if ingredients}
    <div class="row">
      <div class="ml-auto mr-3">
          <button class="btn btn-lg btn-outline-dark" disabled={disabled} on:click={() =>  disabled = addAllItemsToGroceryList(ingredients, disabled)}><img class="svg" src="/open-iconic-master/svg/cart.svg" alt='cart'> &nbsp;Add All Ingredients to Grocery List</button>
      </div>
    </div>
    <p></p>
    <ul class='list-group'>
      {#each ingredients as ing }
      <li class='list-group-item text-center'>     
        <span><a href="/ingredients/{ing.ingredients.id}" use:link class="ingredientsBtn">{ing.ingredients.Ingredient}</a> ({ing.Quantity} {ing.Quantity_Measurement})</span>
        <span><button on:click={() => addToGroceryList(ing.ingredients.Ingredient)} class='btn btn-sm btn-success addToGroceryList'><img class="svg" src="/open-iconic-master/svg/cart.svg" alt='cart'> &nbsp;Add to Grocery List</button></span>
      </li>
      {/each}
    </ul>
  {/if}


  <br />
  <h2 class="text-center" id="directionsTitle">Directions</h2>

  {#if recipe}
  <ul class='list-group'>
      {#each recipe.Directions.split(".") as dir }
        <li class="list-group-item list-group-item-action list-group-item-dark" id="recipeDirections">{dir}</li>
      {/each}
  </ul>
  {/if}

  <p>&nbsp;</p>

  <div class="text-center">
    <button style="margin-top: 1.5%;" class="btn btn-lg btn-outline-success">I Cooked This &nbsp;<img class="svg" src="/open-iconic-master/svg/task.svg" alt='task'></button>
  </div>

</div>
  <p>&nbsp;</p>
  <a href="/food" use:link class="btn btn-lg btn-outline-dark"><img src="/open-iconic-master/svg/chevron-left.svg" class="icon" alt="back"/> Back</a>
  {/if}
