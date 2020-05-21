<script>
  import { onMount } from "svelte";
  import {link} from 'svelte-spa-router'

  export let recipes = [];
  export let category;

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

  export function selectCategory(cat) {
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
        recipes(where: {Meal: {_eq: "` + cat + `"}}) {
          Recipe
          id
          BootstrapClass
        }
      }
      `
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(cat);
        recipes = res.data.recipes;
        category = cat;
        console.log(res.data);
    });         
  }  

</script>

<div class="row">
  <a href="/meals/history" use:link class="btn btn-lg btn-warning float-right mealsHistory"><img class="svg" src="/open-iconic-master/svg/project.svg" alt="mealhistory"> &nbsp;See Meal History <img class="svg" src="/open-iconic-master/svg/pie-chart.svg" alt="piechart"></a>
</div>

<h1 class="text-center">Cook a Meal</h1>

{#if !category}
<div class="row">
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/breakfast_category.png" alt="produce" on:click="{() => selectCategory('Breakfast')}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Breakfast')}" class="btn btn-primary btn-lg category">Breakfast</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/lunch_category.png" alt="fruit" on:click="{() => selectCategory('Lunch, Dinner')}" />
      <div class="card-body"> 
        <h5 class="card-title text-center">
        <button on:click="{() => selectCategory('Lunch, Dinner')}" class="btn btn-primary btn-lg category">Lunch/Dinner</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/salad_category.png" alt="dairy" on:click="{() => selectCategory('Salad')}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Salad')}" class="btn btn-primary btn-lg category">Salad</button>
        </h5>
      </div>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/snacks_category.png" alt="produce" on:click="{() => selectCategory('Snack')}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Snack')}" class="btn btn-primary btn-lg category">Snack</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/smoothie_category.svg" alt="fruit" on:click="{() => selectCategory('Smoothie')}" />
      <div class="card-body"> 
        <h5 class="card-title text-center">
        <button on:click="{() => selectCategory('Smoothie')}" class="btn btn-primary btn-lg category">Smoothie</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/icons/dessert_category.png" alt="dairy" on:click="{() => selectCategory('Dessert')}" />
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Dessert')}" class="btn btn-primary btn-lg category">Dessert</button>
        </h5>
      </div>
    </div>
  </div>
</div>


<br />
<br />
<br />

<hr />
<hr />
<hr />

<br />
<br />
<br />

<div class="row">
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/open-iconic-master/svg/lock-locked.svg" alt="produce" on:click="{() => selectCategory('Barfood')}" />
      <!-- <img class="card-img-top" src="/icons/barfood_category.png" alt="produce" on:click="{() => selectCategory('Barfood')}" /> -->
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Barfood')}" class="btn btn-primary btn-lg category">Barfood</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/open-iconic-master/svg/lock-locked.svg" alt="produce" on:click="{() => selectCategory('Barfood')}" />
      <!-- <img class="card-img-top" src="/icons/asian_category.svg" alt="fruit" on:click="{() => selectCategory('Asian')}" /> -->
      <div class="card-body"> 
        <h5 class="card-title text-center">
        <button on:click="{() => selectCategory('Asian')}" class="btn btn-primary btn-lg category">Asian</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/open-iconic-master/svg/lock-locked.svg" alt="produce" on:click="{() => selectCategory('Barfood')}" />
      <!-- <img class="card-img-top" src="/icons/italian_category.png" alt="dairy" on:click="{() => selectCategory('Italian')}" /> -->
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Italian')}" class="btn btn-primary btn-lg category">Italian</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/open-iconic-master/svg/lock-locked.svg" alt="produce" on:click="{() => selectCategory('Barfood')}" />
      <!-- <img class="card-img-top" src="/icons/meatlovers_category.png" alt="dairy" on:click="{() => selectCategory('Meat Lovers')}" /> -->
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Meat Lovers')}" class="btn btn-primary btn-lg category">Meat Lovers</button>
        </h5>
      </div>
    </div>
  </div>  
</div>

<div class="row">
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/open-iconic-master/svg/lock-locked.svg" alt="produce" on:click="{() => selectCategory('Barfood')}" />
      <!-- <img class="card-img-top" src="/icons/lowsugar_category.png" alt="produce" on:click="{() => selectCategory('Low Sugar')}" /> -->
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Low Sugar')}" class="btn btn-primary btn-lg category">Low Sugar</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/open-iconic-master/svg/lock-locked.svg" alt="produce" on:click="{() => selectCategory('Barfood')}" />
      <!-- <img class="card-img-top" src="/icons/lowcarb_category.svg" alt="fruit" on:click="{() => selectCategory('Low Carb')}" /> -->
      <div class="card-body"> 
        <h5 class="card-title text-center">
        <button on:click="{() => selectCategory('Low Carb')}" class="btn btn-primary btn-lg category">Low Carb</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/open-iconic-master/svg/lock-locked.svg" alt="produce" on:click="{() => selectCategory('Barfood')}" />
      <!-- <img class="card-img-top" src="/icons/veggielovers_category.png" alt="dairy" on:click="{() => selectCategory('Veggie Lovers')}" /> -->
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('Veggie Lovers')}" class="btn btn-primary btn-lg category">Veggie Lovers</button>
        </h5>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="/open-iconic-master/svg/lock-locked.svg" alt="produce" on:click="{() => selectCategory('Barfood')}" />
      <!-- <img class="card-img-top" src="/icons/highprotein_category.png" alt="dairy" on:click="{() => selectCategory('High Protein')}" /> -->
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory('High Protein')}" class="btn btn-primary btn-lg category">High Protein</button>
        </h5>
      </div>
    </div>
  </div>  
</div>

{/if }

{#if category}

  <div class="col-md-4">
    <div class="card" style="width: 18rem;">
      <img on:click="{() => selectCategory(null)}" class="card-img-top" src="/open-iconic-master/svg/lock-locked.svg" alt="nuts"/>
      <div class="card-body text-center"> 
        <h5 class="card-title">
        <button on:click="{() => selectCategory(null)}" class="btn btn-primary btn-lg category">&larr; Back</button>
        </h5>
      </div>
    </div>
  </div>

  <table class="table-responsive table-light">
    <legend>{category}</legend>
    <thead>
    </thead>

    <tbody>
      {#each recipes as rec }
      <!-- {#if rec.Meal == 'Breakfast' } -->
          <tr class="{rec.BootstrapClass}">     
          <td class="recipe">{rec.Recipe}</td>
          <td class="recipeBtnColumn"><a href="/recipes/{rec.id}" use:link><button class="btn btn-lg btn-light recipeBtn"><img class="svg" src="/open-iconic-master/svg/book.svg" alt='book'>&nbsp; Recipe</button></a>
          <td class="iCookedThisBtnColumn"><a class="btn btn-lg btn-success iCookedThisBtn" use:link href="/recipes/{rec.id}/cooking">I Cooked This &nbsp;<img class="svg" src="/open-iconic-master/svg/task.svg" alt='task'></a></td>
          </tr>
      <!-- {/if} -->
    {/each}
    </tbody>
  </table>

{/if} 

<!-- 
<h1 class="text-center">Add a New Meal</h1>
<button class="btn btn-lg btn-secondary">Add Meal</button> -->

