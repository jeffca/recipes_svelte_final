<script>
	import Inventory from './components/Inventory.svelte';
	import RecipeDetailComponent from './components/RecipeDetailComponent.svelte';
	import RecipeComponent from './components/RecipeComponent.svelte';
	import GroceryListComponent from './components/GroceryListComponent.svelte';
	import MealsComponent from './components/MealsComponent.svelte';
	import MealsCookingComponent from './components/MealsCookingComponent.svelte';
	import MealsHistoryComponent from './components/MealsHistoryComponent.svelte';
	import MealsDetailComponent from './components/MealsDetailComponent.svelte';
	import IngredientsComponent from './components/IngredientsComponent.svelte';

	import Router from 'svelte-spa-router'
	import {link} from 'svelte-spa-router'

	const routes = {
    // Exact path
	'/': Inventory,
	'/inventory': Inventory,
	'/recipes': RecipeComponent,
	'/recipes/:id': RecipeDetailComponent,
	'/recipes/:id/cooking': MealsCookingComponent,
	'/ingredients/:id': IngredientsComponent,
	'/grocerylist': GroceryListComponent,
	'/meals': MealsComponent,
	'/meals/history': MealsHistoryComponent,
	'/meals/:id': MealsDetailComponent,
	}

</script>

<style>

:global(a) {
	color: gray;
	font-weight: 850;
}

:global(.svg) {
	height: 1em;
}

:global(.category) {
	width: 8em;
	text-align: center;
	height: 3em;
	font-size: 20pt;
}

:global(.ingredient) {
	font-size: 18pt;
	color: black;
}

:global(.ingredientsBtn) {
	width: 14em;
}

:global(.recipe) {
	font-size: 20pt;
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', 'Geneva', 'Verdana';
	text-align: center;
}

:global(.recipeBtn) {
	margin-left: 1em;
	margin-right: 1.5em;
	width: 10em;
	height: 2.5em;
}

:global(.recipeBtnColumn) {
	width: 12em;
}

:global(.iCookedThisBtn) {
	float: right;
	margin-right: 3.5em;
	width: 10em;
}

:global(.iCookedThisBtnColumn) {
	width: 12em;
}

:global(.addToGroceryList) {
	float: right;
	width: 12em;
	text-align: center;
}

:global(.markDone) {
	float: right;
	margin-right: 2.5em;
	width: 9em;
}

:global(.groceryListItem) {
	font-size: 24pt;
	font-family: Helvetica;
	font-weight: 400;
	text-align: center;
}

:global(legend) {
	font-size: 36pt;
	font-family: Georgia, 'Times New Roman', Times, serif;
}

</style> 

<ul class="nav">
  <!-- <li class="nav-item">
    <a class="nav-link " href="/" use:link>Home</a>
  </li> -->
  <li class="nav-item">
    <a class="nav-link active" href="/" use:link>Inventory</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/meals" use:link>Meals</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/grocerylist" use:link>Grocery List</a>
  </li>
</ul>
<div class="container-fluid">

    <Router {routes}/>
</div>

