<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'
//   import { addToGroceryList, addAllItemsToGroceryList } from "../helpers.js";
  export let params;
  export let meals;

  onMount(async () => {
        
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 
            `{
                ingredients_meals(where: {ingredients_meals: {id: {_eq: 70}}}) {
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

  });

</script>

<h1 class="text-center">Meal History</h1>

{#if meals }
<table class="table">
    <thead>
    </thead>
    <tbody>
    {#each meals as mea }
        <tr>
            <td>{mea.Quantity} {mea.Quantity_Measurement}</td>        
            <td><a href="/meals/{mea.MealID}" use:link class="btn btn-lg btn-dark">{mea.ingredients_meals_2.meals_recipes.Recipe}</a></td>        
            <td>{mea.ingredients_meals_2.Date}</td>        
        </tr>
    {/each}
    </tbody>
</table>
{/if}