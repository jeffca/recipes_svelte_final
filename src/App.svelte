<script>
	/* AUTH */
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

	authToken.subscribe(async token =>  {
	if (token) {
		console.log('user is logged in!');
	}
	})	


/* END AUTH */

	import Home from './components/HomeComponent.svelte';
	import loading from './components/HomeComponent.svelte';
	import loggingIn from './components/HomeComponent.svelte';
	import Inventory from './components/Inventory.svelte';
	import RecipeDetailComponent from './components/RecipeDetailComponent.svelte';
	import RecipeComponent from './components/RecipeComponent.svelte';
	import GroceryListComponent from './components/GroceryListComponent.svelte';
	import MealsComponent from './components/MealsComponent.svelte';
	import MealsCookingComponent from './components/MealsCookingComponent.svelte';
	import MealsHistoryComponent from './components/MealsHistoryComponent.svelte';
	import MealsDetailComponent from './components/MealsDetailComponent.svelte';
	import IngredientsComponent from './components/IngredientsComponent.svelte';


	import LoginSuccessfulComponent from './components/authentication/LoginSuccessfulComponent.svelte';

	import Router from 'svelte-spa-router'
	import {link} from 'svelte-spa-router'

	const routes = {
    // Exact path
	'/': Home,
	'/inventory': Inventory,
	'/recipes': RecipeComponent,
	'/recipes/:id': RecipeDetailComponent,
	'/recipes/:id/cooking': MealsCookingComponent,
	'/ingredients/:id': IngredientsComponent,
	'/grocerylist': GroceryListComponent,
	'/meals': MealsComponent,
	'/meals/history': MealsHistoryComponent,
	'/meals/:id': MealsDetailComponent,

	//API 
	'/callback': LoginSuccessfulComponent,
	}

</script>

<style>

:global(a) {
	color: gray;
	font-weight: 850;
}

:global(.backArrow) {
	width: 2.8em;

}

:global(.svg) {
	height: 1em;
}

:global(.card .btn) {
	width: 36%;
	float: left;
}

:global(.title) {
	float: left;
	margin-bottom: 2%;
}

:global(.menu) {
	font-size: 24pt;
	font-weight: bold;
	color: #0d52bf;
}

:global(.newRecipeIngredients) {
	height: 12em;
	overflow: scroll;
}

:global(#ingredientsList) {
	height: 16em;
	overflow: scroll;
	margin-bottom: 1.1%;
}

:global(.form-check-label) {
	font-size: 15pt;
	overflow: scroll;
}

:global(.upcomingMeal) {
	height: 16em;
	margin-bottom: 5.8%;
}

:global(.card-body) {
	overflow: scroll;
}

:global(.category) {
	width: 49%;
	text-align: center;
	/* height: em; */
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

:global(#userProfilePicture) {
	width: 8.5em;
	float: left;
}

</style> 

	{#if !$authToken }
	<div class="text-left container-fluid">
		<h1>Welcome new user!</h1>
		<h3>Login with Google, Facebook or your personal email to sign up.</h3>
		<Auth0Context domain="jeffca.auth0.com" client_id="URjctPE9nuCr4V9rFYWXbfEx04gZ9Faa" callback_url="CALLBACK_URL" logout_url="http://localhost:5000">
			<!-- <span>Hi, Guest</span> -->
			<button class="btn btn-lg btn-success" on:click|preventDefault='{() => login() }'>Login</button>
		<!-- {#if $isAuthenticated} -->
		<!-- <pre><span class="float-left">Hi, {$userInfo["nickname"]}</span> -->
		<!-- <img src='{$userInfo["picture"]}' alt='profile_picture' id="userProfilePicture" /> -->
		<!-- </pre> -->
		<!-- <button class="btn btn-sm btn-dark" on:click|preventDefault='{() => logout() }'>Logout</button><br />	 -->
		<!-- {/if} -->
		{#if !authError}
		<pre>isLoading: {$isLoading}</pre>
		<pre>isAuthenticated: {$isAuthenticated}</pre>
		<pre>authToken: {$authToken}</pre>
		<pre>userInfo: {JSON.stringify($userInfo, null, 2)}</pre> 
		<pre>authError: {$authError}</pre> 
		{/if}
		</Auth0Context>
	</div>
	{/if}
<div class="container-fluid">

<Router {routes}/>
</div>

