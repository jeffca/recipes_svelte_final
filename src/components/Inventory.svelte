<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'
  import { } from "../helpers.js";

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

  export function selectCategory(cat) {
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
          inventory(where: {ingredient_inventory_2: {Category: {_eq: "` + cat + `"}}}) {
            ingredient_inventory_2 {
              Ingredient
            }
            Quantity
            Quantity_Measurement
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

<h1 class="text-center">Your Kitchen is <em>98</em>% full!</h1>

<button class="btn btn-lg btn-secondary">Add New Grocery Items</button>
<br />

{#if !category }

<h1 class="text-center">Current Inventory</h1>
<br />

<div class="row">
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/produce.png" alt="produce" on:click="{() => selectCategory('Produce')}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Produce')}" class="btn btn-primary btn-lg category">Produce</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/fruit.jpeg" alt="fruit" on:click="{() => selectCategory('Produce')}" />
      <div class="card-body"> 
        <h5 class="card-title text-center">
        <button on:click="{() => selectCategory('Fruit')}" class="btn btn-primary btn-lg category">Fruit</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/dairy.png" alt="dairy" on:click="{() => selectCategory('Produce')}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Dairy')}" class="btn btn-primary btn-lg category">Dairy</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/meat.png" alt="meat" on:click="{() => selectCategory('Produce')}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Meat')}" class="btn btn-primary btn-lg category">Meat</button>
        </h5>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/bread.png" alt="bread" on:click="{() => selectCategory('Produce')}" />
        <h5 class="card-title">
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Bread')}" class="btn btn-primary btn-lg category">Bread</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/condiments.png" alt="produce" on:click="{() => selectCategory('Produce')}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Condiments')}" class="btn btn-primary btn-lg category">Condiments</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/nuts.jpg" alt="nuts" on:click="{() => selectCategory('Produce')}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Nuts')}" class="btn btn-primary btn-lg category">Nuts</button>
        </h5>
      </div>
    </div>
  </div>
</div>
{/if}


{#if category}
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img on:click="{() => selectCategory(null)}" class="card-img-top" src="/open-iconic-master/svg/arrow-circle-left.svg" alt="nuts"/>
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory(null)}" class="btn btn-primary btn-lg category">&larr; Back</button>
        </h5>
      </div>
    </div>
  </div>
<!-- {/if}




{#if ingredients.length != 0 } -->
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

