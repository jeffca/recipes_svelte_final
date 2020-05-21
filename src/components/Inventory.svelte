<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'
  import { selectCategory } from "../helpers.js";

  export let ingredients = [];
  export let category;

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

<div class="row">
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/produce.png" alt="produce" on:click="{category = 'produce'}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{category = 'produce'}" class="btn btn-primary btn-lg category">Produce</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/fruit.jpeg" alt="fruit" on:click="{category = 'fruit'}" />
      <div class="card-body"> 
        <h5 class="card-title text-center">
        <button on:click="{category = 'fruit'}" class="btn btn-primary btn-lg category">Fruit</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/dairy.png" alt="dairy" on:click="{category = 'dairy'}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{category = 'dairy'}" class="btn btn-primary btn-lg category">Dairy</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/meat.png" alt="meat" on:click="{category = 'meat'}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{category = 'meat'}" class="btn btn-primary btn-lg category">Meat</button>
        </h5>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/bread.png" alt="bread" on:click="{category = 'bread'}" />
        <h5 class="card-title">
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{category = 'bread'}" class="btn btn-primary btn-lg category">Bread</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/condiments.png" alt="produce" on:click="{category = 'condiments'}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{category = 'condiments'}" class="btn btn-primary btn-lg category">Condiments</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/nuts.jpg" alt="nuts" on:click="{category = 'nuts'}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{selectCategory()}" class="btn btn-primary btn-lg category">Nuts</button>
        </h5>
      </div>
    </div>
  </div>
</div>









{#if category }
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
{/if }

