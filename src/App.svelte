
<style>

</style> 

<script>
	/* AUTH */

  import { claims } from './stores.js';

	import {
		Auth0Context,
		Auth0LoginButton,
		authError,
		authToken,
		isAuthenticated,
		isLoading,
		login,
		logout,
		userInfo, 
		idToken
	} from '@dopry/svelte-auth0';

	authToken.subscribe(async token =>  {
	if (token) {
		console.log('user is logged in!');
		$claims = $idToken;
		console.log("claims store is set to @dopry/svelte-auth0's idToken (JWT token from Auth0)!");

	}
	});


/* END AUTH */

	import Home from './components/HomeComponent.svelte';
	import Food from './components/Food.svelte';
	import Recipe_New from './components/RecipeNew.svelte';
	import loading from './components/HomeComponent.svelte';
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
	'/food': Food,
	'/food/recipes/new': Recipe_New,
	'/food/recipes/:id': RecipeDetailComponent,
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


	<!-- {JSON.stringify($userInfo, null, 2)} -->
<!-- 	{$isAuthenticated}
	{$authToken}
	{$idToken} -->

<!-- {#if $isLoading }

	<pre>Loading...</pre>

{:else}
	
	<h1> NOT LOADING!</h1>
 -->
	{#if !$authToken }
		<div class="text-left container-fluid">
			<h1 class="text-center welcome">Welcome to Jeff Cairns' recipe book & more!</h1>
			<h2 class="text-center">Grimp! saves all of your home recipes and allows you to easily share them with friends. Easily manage your grocery list and track your inventory, too.</h2>
			<p>&nbsp;</p>
			<h4 class="text-center">Sign up or login with Google, Facebook or your personal email.</h4>
			<h6 class="text-center"><em>Jeff Cairns will receive your name, email and profile picture if you sign up with Google or Facebook</em></h6>
			<div class="text-center">
				<Auth0Context domain="jeffca.auth0.com" client_id="URjctPE9nuCr4V9rFYWXbfEx04gZ9Faa" callback_url="CALLBACK_URL" logout_url="http://localhost:5000">
					<Auth0LoginButton class="btn">Login</Auth0LoginButton>
				</Auth0Context>		
			</div>
		</div>
	{:else}
		<div class="container-fluid">
			<a href="/" use:link><h1 class="text-center welcome">Welcome, {$userInfo["nickname"]}! <img class="menuIcon" src="/open-iconic-master/svg/bell.svg" alt="notifications"><span class="menuIconNotificiation badge badge-light">0</span> <img class="menuIcon" src="/open-iconic-master/svg/cog.svg" alt="settings"></h1></a>
		<hr />
		<Router {routes}/>
		</div>
	{/if}
<!-- {/if} -->

