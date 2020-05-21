<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'
//   import { addToGroceryList, addAllItemsToGroceryList } from "../helpers.js";
  export let params;
  export let ingredients;
  export let recipe;

  onMount(async () => {
        
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 
            `{
                ingredients_recipes(where: {RecipeID: {_eq: ` + params.id + `}}) {
                    ingredients_recipe {
                    Ingredient
                    }
                    Quantity
                    Quantity_Measurement
                    ingredients_recipe_2 {
                    Recipe
                    }
                }
            }`
        })
    })
        .then(res => res.json())
        .then(res => {
        ingredients = res.data.ingredients_recipes;
        console.log(res.data);
    });

    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 
            `{
                recipes_by_pk(id: 10) {
                    Recipe
                }
            }`
        })
    })
        .then(res => res.json())
        .then(res => {
        recipe = res.data.recipes_by_pk;
        console.log(res.data);
    });

  });

</script>

<h1 class="text-center">Cook a New Meal</h1>

{#if recipe}
<h3>{recipe.Recipe}</h3>
{/if}

{#if ingredients }
<form class="content">
    <table table-responsiveclass="table table-responsivetable-striped">
        <tbody>
        {#each ingredients as ing }
            <tr>
                <td>{ing.ingredients_recipe.Ingredient}</td>
                <td>Quantity
                    <input bind:value={ing.Quantity} type="number" /> </td>                   
                <td>Measurement
                    <input bind:value={ing.Quantity_Measurement} type="text" /></td>                    
            </tr>
        {/each}
        </tbody>
    </table>

    <a href="/meals/submit" use:link class="btn btn-lg btn-success">Submit</a>
</form>
{/if}

