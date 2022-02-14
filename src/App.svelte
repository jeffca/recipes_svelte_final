
<style>

</style> 

<script>
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

	import OrderComponent from './components/OrderComponent.svelte';



	import LoginSuccessfulComponent from './components/authentication/LoginSuccessfulComponent.svelte';

	import Router from 'svelte-spa-router'
	import {link} from 'svelte-spa-router'

	export var userNickname  = undefined;

	/* AUTH */

  import { claims, groceryListCount } from './stores.js';
  import { executeGraphql, loginAsGuest, countGroceryList } from './helpers.js';

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
		$claims = $idToken;
		console.log($userInfo);
		if (Object.keys($userInfo).length != 0) {
			userNickname = $userInfo["nickname"];
			console.log("real person!");
		} else {
			userNickname = "Guest";
			console.log("guest!");
		}
		$groceryListCount = await countGroceryList($claims);
	}
	});

	var env;

	if (window.location.href == 'http://localhost:5000/') {
		env = 'http://localhost:5000/';
	} else {
		env = 'https://vigilant-sinoussi-95d5cb.netlify.app/';
	}

 async function preLoginAsGuest() {
 	$idToken = loginAsGuest();
 	$authToken = $idToken;
 	$claims = $idToken;
 }
/* END AUTH */

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
	'/order': OrderComponent,

	//API 
	'/callback': LoginSuccessfulComponent,
	};

</script>

<!-- 			<h1 class="text-center welcome">Welcome to Jeff Cairns' recipe book & more!</h1>
			<h2 class="text-center">Grimp! saves all of your home recipes and allows you to easily share them with friends. Easily manage your grocery list and track your inventory, too.</h2>
			<p>&nbsp;</p>
			<h4 class="text-center">Sign up or login with Google, Facebook or your personal email.</h4>
			<h6 class="text-center"><em>Jeff Cairns will receive your name, email and profile picture if you sign up with Google or Facebook</em></h6>
 -->

	{#if !$idToken }
		<div class="text-left container-fluid">
			<h2 class="text-center" id="title">Order from Chef Jeff</h2>
 			<div class="text-center">
				<Auth0Context domain="jeffca.auth0.com" client_id="URjctPE9nuCr4V9rFYWXbfEx04gZ9Faa" callback_url="{env	}" logout_url="http://localhost:5000">
					<Auth0LoginButton class="btn btn-lg" preserveRoute=true>Login</Auth0LoginButton>
				</Auth0Context>		
			</div>
			<div>&nbsp;</div>
 			<div class="text-center">
					<button class="btn btn-lg btn-primary" on:click|once={preLoginAsGuest}>Continue as Guest</button>
			</div>
		</div>
	{:else}
		<div class="container-fluid">
			<h1 class="text-center welcome"><a href="/" use:link>Welcome, {userNickname}!  </a><img class="menuIcon" src="/open-iconic-master/svg/bell.svg" alt="notifications"><span class="menuIconNotificiation badge badge-light">0</span><a href="/grocerylist" use:link><img class="menuIcon" src="/open-iconic-master/svg/cart.svg" alt="grocery list"><span class="menuIconNotificiation badge badge-light">{$groceryListCount}</span></a></h1>

		<hr />
		<Router {routes}/>
		</div>
	{/if}
<!-- {/if} -->

