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
              users_recipes_by_pk(id:` + params.id + `) { 
                id 
                recipes {
                  Recipe 
                  Directions 
                }
              } 
            }
            `;
    let temp = await executeGraphql(q, $claims);
    recipe = temp.data.users_recipes_by_pk;

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
<h1 class="text-center">{recipe.recipes.Recipe}</h1>
<br />
{/if}

{#if ingredients}
  <div class="row">
    <div class="ml-auto mr-3">
        <button class="btn btn-lg btn-dark" disabled={disabled} on:click={() =>  disabled = addAllItemsToGroceryList(ingredients, disabled)}><img class="svg" src="/open-iconic-master/svg/cart.svg" alt='cart'> &nbsp;Add All Ingredients to Grocery List</button>
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
<h2>Directions</h2>

{#if recipe}
<ul class='list-group'>
    {#each recipe.recipes.Directions.split(".") as dir }
      <li class="list-group-item">{dir}</li>
    {/each}
</ul>
{/if}

<br />
<button class="btn btn-lg btn-primary float-right">I Cooked This &nbsp;<img class="svg" src="/open-iconic-master/svg/task.svg" alt='task'></button>

<p>&nbsp;</p>
    <a href="/food" use:link class="btn btn-md btn-outline-dark"><img src="/open-iconic-master/svg/chevron-left.svg" class="icon" alt="back"/> Back</a>