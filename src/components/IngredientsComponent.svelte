<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'
  import { addToGroceryList } from "../helpers.js";
  export let params;
  export let recipes;
  export let ingredient;
  export let meals;
  export let inventory;

  onMount(async () => {
        
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{
            ingredients_by_pk(id: ` + params.id + `) {
                Brand
                Ingredient
                Location
                Notes
                Price
                Quantity
                Quantity_Measurement
                In_Stock
                Calories
                Calories_Serving
                Calories_Serving_Measurement
                id
            }
            }
        `})
    })
        .then(res => res.json())
        .then(res => {
        ingredient = res.data.ingredients_by_pk;
        console.log(res.data);
    }); 

    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{
            ingredients_recipes(where: {IngredientID: {_eq: ` + params.id + `}}) {
                ingredients_recipe_2 {
                id
                Recipe
                }
            }
        }
        `})
    })
        .then(res => res.json())
        .then(res => {
        recipes = res.data.ingredients_recipes;
        console.log(res.data);
    });

    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 
            `{
                ingredients_meals(where: {ingredients_meals: {id: {_eq: ` + params.id + `}}}) {
                    ingredients_meals_2 {
                    Date
                    meals_recipes {
                        Recipe
                    }
                }
                    Quantity
                    Quantity_Measurement
                    MealID
                }
            }`
        })
    })
        .then(res => res.json())
        .then(res => {
        meals = res.data.ingredients_meals;
        console.log(res.data);
    });

    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 
            `{
                inventory(where: {ingredient_inventory_2: {id: {_eq: ` + params.id + `}}}) {
                    Location
                    Quantity
                    Quantity_Measurement
                    Brand
                }
            }`
        })
    })
        .then(res => res.json())
        .then(res => {
        inventory = res.data.inventory;
        console.log(res.data);
    });

  });

</script>

{#if ingredient}
<h1 class="text-center">{ingredient.Ingredient}</h1>
<h2 class="text-center">{ingredient.Brand}</h2>
<h3 class="text-center">${ingredient.Price}</h3>
<h4 class="text-center">{ingredient.Calories} calories per {ingredient.Calories_Serving} {ingredient.Calories_Serving_Measurement}</h4>
<br />
{/if}

{#if inventory }
<h2>Current Inventory</h2>
<table class="table">
	<thead>
	</thead>
	<tbody>
        {#each inventory as inv }
		<tr>
			<td class="text-center">{inv.Quantity} {inv.Quantity_Measurement} in the {inv.Location}</td>
		</tr>
        {/each}
	</tbody>
</table>
{/if}

<br />
{#if ingredient}
<button on:click={() => addToGroceryList(ingredient.Ingredient)} class='btn btn-md btn-success addToGroceryList'><img class="svg" src="/open-iconic-master/svg/cart.svg" alt='cart'> &nbsp;Add to Grocery List</button>
<br />
<h2>Recipes with {ingredient.Ingredient} </h2>
<table class="table">
    <thead>
        <!-- <th>Recipe</th> -->
    </thead>
    {#if recipes}
    <tbody>
        {#each recipes as rec }
        <tr class="table-primary">
            <td class="text-center"><a href="/recipes/{rec.ingredients_recipe_2.id}" use:link>{rec.ingredients_recipe_2.Recipe}</a></td>
        </tr>
        {/each}
    </tbody>
    {/if}
</table>



<h2>Recent Meals with {ingredient.Ingredient}</h2>
{/if}
{#if meals}
<table class="table table-light">
	<thead>
		<!-- <th>Meal</th>
		<th>Date</th> -->
	</thead>
	<tbody>
        {#each meals as mea }
            <tr class="table-info">
                <td class="text-center"><a href="/meals/{mea.MealID}" use:link>{mea.ingredients_meals_2.meals_recipes.Recipe} ({mea.ingredients_meals_2.Date})</a></td>
            </tr>
        {/each}
	</tbody>
</table>

{/if}
<!-- <div class="row">
<div class="ml-auto mr-3">
    <button class="btn btn-lg btn-dark" disabled={disabled} on:click={() =>  disabled = addAllItemsToGroceryList(ingredients, disabled)}>Add All Ingredients to Grocery List <img class="svg" src="/open-iconic-master/svg/cart.svg" alt='cart'></button>
</div>
</div>
<p></p>
<ul class='list-group'>
{#each ingredients as ing }
<li class='list-group-item text-center'>     
    <span>{ing.ingredients_recipe.Ingredient} ({ing.Quantity} {ing.Quantity_Measurement})</span>
    <span><button on:click={() => addToGroceryList(ing.ingredients_recipe.Ingredient)} class='btn btn-sm btn-success addToGroceryList'>Add to Grocery List <img class="svg" src="/open-iconic-master/svg/cart.svg" alt='cart'></button></span>
</li>
{/each}
</ul>
{/if} -->
