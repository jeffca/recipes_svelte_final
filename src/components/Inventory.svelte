<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'


  export let ingredients = [];

  onMount(async () => {
  fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `
      {
      inventory(order_by: {ingredient_inventory_2: {Ingredient: asc}}) {
        ingredient_inventory_2 {
          Ingredient
        }
        IngredientID
        Quantity
        Quantity_Measurement
      }
    }
    `
    })
  })
    .then(res => res.json())
    .then(res => {
      ingredients = res.data.inventory;
      console.log(res.data);
  });     

  });

</script>

<h1 class="text-center">Your Kitchen is <em>98</em>% full!</h1>

<button class="btn btn-lg btn-secondary">Add New Grocery Items</button>
<br />

<h1 class="text-center">Current Inventory</h1>
<br />

<table class="table table-light">
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

