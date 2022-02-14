<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'

  export let menu;
  export let categories;


  import { claims, groceryListCount } from '../stores.js';
  import { executeGraphql, loginAsGuest, countGroceryList } from '../helpers.js';

  let q;

  onMount(async () => {
        
    q =   
            `
            {
              categories(where: {scope: {_eq: "Menu"}}, order_by: {DisplayOrder: asc}) {
                menu {
                  menu {
                    Item
                    Description
                  }
                }
                category,

              }
            }
            `
    let temp = await executeGraphql(q, $claims);
    menu = temp.data.categories;
    categories = [];

    for (var i = 0; i < menu.length; i++) {
        if (!categories.includes(menu[i].category)) {
            categories.push(menu[i].category)
        }
    }
    console.log(categories);

    console.log(menu);

});

</script>

<h1 class="text-center">Menu</h1>

{#if menu }
<table class="table">
    <thead>
    </thead>
    <tbody>
    {#each categories as cat }
        <tr>
            <td><h1><strong>{cat}</strong></h1></td>        
            {#each menu as men }
                {#if men.category == cat}
                    <tr>
                        <h2>{men.menu.menu.Item}</h2>
                    </tr>

                    <tr>
                        <span><em>{men.menu.menu.Description}</em></span>
                    </tr>

                    <tr>
                        <span>&nbsp;</span>
                    </tr>
                {/if}
            {/each}
<!--             <td><a href="/meals/{mea.MealID}" use:link class="btn btn-lg btn-dark">{mea.ingredients_meals_2.meals_recipes.Recipe}</a></td>        
            <td>{mea.ingredients_meals_2.Date}</td>        
 -->
        </tr>
    {/each}
    </tbody>
</table>
{/if}