<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'
//   import { addToGroceryList, addAllItemsToGroceryList } from "../helpers.js";
  export let params;
  export let ingredients;
  export let meal;

  onMount(async () => {
        
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 
            `{
                ingredients_meals(where: {MealID: {_eq: 1}}) {
                    Quantity
                    Quantity_Measurement
                    ingredients_meals {
                    id
                    Brand
                    Ingredient
                    }
                }
            }`
        })
    })
        .then(res => res.json())
        .then(res => {
        ingredients = res.data.ingredients_meals;
        console.log(res.data);
    });

    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 
            `{
                meals_by_pk(id: ` + params.id + `) {
                    meals_recipes {
                    Recipe
                    }
                    Date
                    Cost
                    Notes
                }
            }`
        })
    })
        .then(res => res.json())
        .then(res => {
        meal = res.data.meals_by_pk;
        console.log(res.data);
    });

  });

</script>


{#if meal}
<h1 class="text-center">{meal.meals_recipes.Recipe}</h1>
<h2 class="text-center">{meal.Date}</h2>
<h4 class="text-center">${meal.Cost}</h4>
<h4 class="text-center"><em>{meal.Notes}</em></h4>
<br />
{/if}

<h2>Ingredients</h2>

{#if ingredients}
<table class="table">
	<thead>
	</thead>
	<tbody>
    {#each ingredients as ing }
		<tr>
			<td class="text-center"><strong>{ing.Quantity} {ing.Quantity_Measurement}</strong> </td>
			<td class="text-center"><a href='/ingredients/{ing.ingredients_meals.id}' use:link class="btn btn-lg btn-secondary">{ing.ingredients_meals.Brand} {ing.ingredients_meals.Ingredient}</a></td>
            <td><em>$0.53</em></td>
        </tr>
    {/each}
	</tbody>
</table>

{/if}