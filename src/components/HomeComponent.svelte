<script>
  import { onMount, getContext, setContext } from "svelte";
    import createAuth0Client from '@auth0/auth0-spa-js';
  import { executeGraphql } from "../helpers.js";
  import {location, querystring, link} from 'svelte-spa-router';
  import { claims } from '../stores.js';
	import {
		Auth0Context,
		authError,
		authToken,
		isAuthenticated,
		isLoading,
		login,
		logout,
		userInfo
	} from '@dopry/svelte-auth0';
     export let ingredient, selected, quantity, quantity_measurement;
     export let ingredients;
     export let categories = [];
     export let category;
 
    claims.subscribe(value => {
        console.log("claims rdy!")
        const res = getCategories();
    })

    onMount(async () => {
    });

    async function getCategories() {
        let q = `{
                        categories(where: {scope: {_eq: "Inventory"}}) {
                            category
                            iconURL
                        }
                }`  
        let c = $claims;
        console.log("starting to get categories now!!!!!!")
        let temp_categories = await executeGraphql(q, c); 
        categories = temp_categories.data.categories; 
        console.log(categories);         
    }

 async function addInventoryIngredient(ingredientID, l, qua, q_m) {
    let q = `mutation {
        insert_inventory_one(object: 
            {IngredientID: ` + ingredientID + `
            , Location: "` + l + `"
            , Quantity: ` + qua + `
            , Quantity_Measurement: "` + q_m + `"
            }) {
            Location
        }
        }    
        `
    console.log($claims);
    let success = await executeGraphql(q, $claims);
    console.log(success);
}
 
  async function selectCategory(cat) {
      if (cat == null) {
        //   categories = [];
            category = null;
          getCategories();
      }
      let q = ` query
        {
          inventory(where: {ingredient_inventory_2: {Category: {_eq: "` + cat + `"}}}) {
            ingredient_inventory_2 {
              Category
              Ingredient
            }
            IngredientID
            Quantity
            Quantity_Measurement
          }
        }
      `; 
    console.log($claims);
    let temp = await executeGraphql(q, $claims)
    // let temp = await executeGraphql(q, $claims).data.inventory[0].ingredient_inventory_2.Cstegory;
    ingredients = temp.data.inventory;
    if (ingredients.length > 0) {
        category = temp.data.inventory[0].ingredient_inventory_2.Category;
    }
  }
//   console.log(params.state);
  console.log("HI from AUTH");

  export let locations = ["Pantry", "Fridge", "Freezer", "Spice Cabinet"]

</script>

{#if !$claims}
<h1>Hi, Guest!</h1>
{/if}

{#if $claims}

<Auth0Context domain="jeffca.auth0.com" client_id="URjctPE9nuCr4V9rFYWXbfEx04gZ9Faa" callback_url="http://localhost:5000/" logout_url="http://localhost:5000">
<button class="btn btn-sm btn-dark float-right" on:click|preventDefault='{() => logout() }'>Logout</button><br />	
{#if $authError}
<pre>isLoading: {$isLoading}</pre>
<pre>isAuthenticated: {$isAuthenticated}</pre>
<pre>authToken: {$authToken}</pre>
<pre>userInfo: {JSON.stringify($userInfo, null, 2)}</pre> 
<pre>authError: {$authError}</pre> 
{/if}
</Auth0Context>

<h1>Welcome back, {$userInfo["nickname"]}!</h1>
<table class="table-responsive table-light">
    <legend>Record Your Recent Meals</legend>
    <tbody>
        <tr>
            <td>
                <button type="button" class="btn btn-primary">
                Breakfast <span class="badge badge-light">1</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Lunch <span class="badge badge-light">1</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Dinner <span class="badge badge-light">1</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Salad <span class="badge badge-secondary">0</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Snack <span class="badge badge-secondary">0</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Smoothie <span class="badge badge-secondary">0</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Dessert <span class="badge badge-secondary">0</span>
                </button>
            </td>            
        </tr>

    </tbody>
</table>

<form on:submit|preventDefault> 

<table class="table-responsive">
    <legend>Update Your Inventory</legend>
    <tr>
            <td>
                <select bind:value={selected}>
                    {#each locations as loc}
                        <option value={loc}>{loc}</option> 
                    {/each} 
                </select> 
            </td>
            <!-- <td>Location: <input type="text" value={ingredient} /></td> -->
            <td>Ingredient: <input type="text" bind:value={ingredient} /></td>
            <td>Quantity: <input bind:value={quantity} type="text" /></td>
            <td>Quantity Measurement: <input bind:value={quantity_measurement} type="text" /></td>
            <td><button class="btn btn-lg btn-primary" on:click="{() => addInventoryIngredient(ingredient, selected, quantity, quantity_measurement)}">Add</button></td>
    </tr>

</table>
</form>

<h1 class="text-center">Current Inventory</h1>
<br />

{#if categories != []}
{#if !category}
<div class="row">
{#each categories as cat }
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
{/each }
</div>
{/if}
{/if}

{#if category}
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory(null)}" class="btn btn-warning btn-lg category"><img src="/open-iconic-master/svg/arrow-circle-left.svg" class="backArrow"> Back</button>
        </h5>
      </div>
    </div>
  </div>
{/if}
  <!-- <h3>Your {category} is <em>89</em>% stocked.</h3> -->

<table class="table table-responsive table-light">
  <thead>
    <th>Ingredient</th>
    <th>Quantity</th>
  </thead>
    {#if ingredients}
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
  {/if}
</table>

{/if}
