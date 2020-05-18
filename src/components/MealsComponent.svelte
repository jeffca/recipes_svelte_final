<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'

  export let recipes = [];

  onMount(async () => {
  fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ recipes { id Recipe Meal BootstrapClass } }' })
  })
    .then(res => res.json())
    .then(res => {
      recipes = res.data.recipes;
      console.log(res.data);
  });     

  });

</script>

<div class="row">
  <a href="/meals/history" use:link class="btn btn-lg btn-warning float-right mealsHistory"><img class="svg" src="/open-iconic-master/svg/project.svg" alt="mealhistory"> &nbsp;See Meal History <img class="svg" src="/open-iconic-master/svg/pie-chart.svg" alt="piechart"></a>
</div>

<h1 class="text-center">Cook a Meal</h1>
<table class="table table-light">
  <legend>Breakfast</legend>
  <thead>
  </thead>

  <tbody>
    {#each recipes as rec }
    {#if rec.Meal == 'Breakfast' }
        <tr class="{rec.BootstrapClass}">     
        <td class="recipeBtnColumn"><a href="/recipes/{rec.id}" use:link><button class="btn btn-lg btn-light recipeBtn"><img class="svg" src="/open-iconic-master/svg/book.svg" alt='book'>&nbsp; Recipe</button></a>
        <td class="recipe">{rec.Recipe}</td>
        <td class="iCookedThisBtnColumn"><a class="btn btn-lg btn-success iCookedThisBtn" use:link href="/recipes/{rec.id}/cooking">I Cooked This &nbsp;<img class="svg" src="/open-iconic-master/svg/task.svg" alt='task'></a></td>
        </tr>
    {/if}
  {/each}
  </tbody>
</table>

<br />

<table class="table table-light">
  <legend>Lunch/Dinner</legend>
  <thead>
  </thead>

  <tbody>
    {#each recipes as rec }
    {#if rec.Meal == 'Lunch, Dinner' }
        <tr class="{rec.BootstrapClass}">     
        <td class="recipeBtnColumn"><a href="/recipes/{rec.id}" use:link><button class="btn btn-lg btn-light recipeBtn"><img class="svg" src="/open-iconic-master/svg/book.svg" alt='book'>&nbsp; Recipe</button></a>
        <td class="recipe">{rec.Recipe}</td>
        <td class="iCookedThisBtnColumn"><button class="btn btn-lg btn-success iCookedThisBtn">I Cooked This &nbsp;<img class="svg" src="/open-iconic-master/svg/task.svg" alt='task'></button></td>
        </tr>

    {/if}
  {/each}
  </tbody>
</table>

<br />

<table class="table table-light">
  <legend>Snacks</legend>
  <thead>
  </thead>

  <tbody>
    {#each recipes as rec }
    {#if rec.Meal == 'Snack' }
        <tr class="{rec.BootstrapClass}">     
        <td class="recipeBtnColumn"><a href="/recipes/{rec.id}" use:link><button class="btn btn-lg btn-light recipeBtn"><img class="svg" src="/open-iconic-master/svg/book.svg" alt='book'>&nbsp; Recipe</button></a>
        <td class="recipe">{rec.Recipe}</td>
        <td class="iCookedThisBtnColumn"><button class="btn btn-lg btn-success iCookedThisBtn">I Cooked This &nbsp;<img class="svg" src="/open-iconic-master/svg/task.svg" alt='task'></button></td>
        </tr>

    {/if}
  {/each}
  </tbody>
</table>

<br />

<table class="table table-light">
  <legend>Smoothies</legend>
  <thead>
  </thead>

  <tbody>
    {#each recipes as rec }
    {#if rec.Meal == 'Smoothie' }
        <tr class="{rec.BootstrapClass}">     
        <td class="recipeBtnColumn"><a href="/recipes/{rec.id}" use:link><button class="btn btn-lg btn-light recipeBtn"><img class="svg" src="/open-iconic-master/svg/book.svg" alt='book'>&nbsp; Recipe</button></a>
        <td class="recipe">{rec.Recipe}</td>
        <td class="iCookedThisBtnColumn"><button class="btn btn-lg btn-success iCookedThisBtn">I Cooked This &nbsp;<img class="svg" src="/open-iconic-master/svg/task.svg" alt='task'></button></td>
        </tr>
    {/if}
  {/each}
  </tbody>
</table>

<br />

<table class="table table-light">
  <legend>Dessert</legend>
  <thead>
  </thead>

  <tbody>
    {#each recipes as rec }
    {#if rec.Meal == 'Dessert' }
        <tr class="{rec.BootstrapClass}">     
        <td class="recipeBtnColumn"><a href="/recipes/{rec.id}" use:link><button class="btn btn-lg btn-light recipeBtn"><img class="svg" src="/open-iconic-master/svg/book.svg" alt='book'>&nbsp; Recipe</button></a>
        <td class="recipe">{rec.Recipe}</td>
        <td class="iCookedThisBtnColumn"><button class="btn btn-lg btn-success iCookedThisBtn">I Cooked This &nbsp;<img class="svg" src="/open-iconic-master/svg/task.svg" alt='task'></button></td>
        </tr>
    {/if}
  {/each}
  </tbody>
</table>

<h1 class="text-center">Add a New Meal</h1>
<button class="btn btn-lg btn-secondary">Add Meal</button>
