<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'
  import { addToGroceryList, addAllItemsToGroceryList } from "../helpers.js";
  export let params;
  export let recipe;
  export let ingredients;
  export let disabled = false;

  onMount(async () => {
  fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ users_recipes_by_pk(id:' + params.id + ') { id Recipe Directions } }' })
  })
    .then(res => res.json())
    .then(res => {
      recipe = res.data.recipes_by_pk;
      console.log(res.data);
  });     

  fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `
    {
        ingredients_recipes(where: {RecipeID: {_eq: ` + params.id + `}}) {
            ingredients_recipe {
                id
                Ingredient
            }
            Quantity_Measurement
            Quantity
        }
    }
    `})
  })
    .then(res => res.json())
    .then(res => {
      ingredients = res.data.ingredients_recipes;
      console.log(res.data.ingredients_recipes);
  });    

  });

</script>

{#if recipe}
<h1 class="text-center">{recipe.Recipe}</h1>
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
      <span><a href="/ingredients/{ing.ingredients_recipe.id}" use:link class="btn btn-md btn-secondary ingredientsBtn">{ing.ingredients_recipe.Ingredient}</a> ({ing.Quantity} {ing.Quantity_Measurement})</span>
      <span><button on:click={() => addToGroceryList(ing.ingredients_recipe.Ingredient)} class='btn btn-sm btn-success addToGroceryList'><img class="svg" src="/open-iconic-master/svg/cart.svg" alt='cart'> &nbsp;Add to Grocery List</button></span>
    </li>
    {/each}
  </ul>
{/if}


<br />
<h2>Directions</h2>

{#if recipe}
<ul class='list-group'>
    {#each recipe.Directions.split(")") as dir }
      <li class="list-group-item">{dir}</li>
    {/each}
</ul>
{/if}

<br />
<button class="btn btn-lg btn-primary float-right">I Cooked This &nbsp;<img class="svg" src="/open-iconic-master/svg/task.svg" alt='task'></button>