<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'
  import { } from "../helpers.js";

  export let ingredients = [];
  export let categories;
  export let category;

  onMount(async () => {
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
  categories(where: {scope: {_eq: "Inventory"}}) {
    category
    iconURL
  }
}
      `
      })
    })
      .then(res => res.json())
      .then(res => {
        categories = res.data.categories;
        console.log(res.data);
    });     

  });

  export function selectCategory(cat) {
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
  ingredients(where: {category: {scope: {_eq: "` + cat + `"}}}) {
    category {
      category
    }
    Ingredient
    Quantity
    Quantity_Measurement
    Location
    Brand
  }
}
      `
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(cat);
        ingredients = res.data.inventory;
        category = cat;
        console.log(res.data);
    });         
  }

</script>

<h1 class="text-center">Welcome to your kitchen's inventory!</h1>

<button class="btn btn-lg btn-secondary">Add New Grocery Items</button>
<br />

{#if !category }

<h1 class="text-center">Current Inventory</h1>
<br />

{#each categories as cat}
<div class="row">
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
</div>
{/each}


{#if category}
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <!-- <img on:click="{() => selectCategory(null)}" class="card-img-top" src="/open-iconic-master/svg/arrow-circle-left.svg" alt="nuts"/> -->
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory(null)}" class="btn btn-primary btn-lg category">&larr; Back</button>
        </h5>
      </div>
    </div>
  </div>

  <h3>Your <strong>{category}</strong> is <em>89</em>% stocked.</h3>

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
{/if }
{/if }

