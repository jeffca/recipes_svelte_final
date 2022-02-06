
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
		console.log($userInfo);
	}
	});

	var env;

	// console.log(window.location.href);
	if (window.location.href == 'http://localhost:5000/') {
		env = 'http://localhost:5000/';
	} else {
		env = 'https://vigilant-sinoussi-95d5cb.netlify.app/';
	}


	console.log(env);

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

	function loginAsGuest() {
		console.log("guest trying to login");
		$idToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUVXpRMEZFTWpOQ016VkdSVEE1TVRSR05EVkVRVUZDUlVWQk1qSTVNekl5UlVaQlJFSXlOUSJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6Imdvb2dsZS1vYXV0aDJ8MTAzNjE0MzY4Nzg1MDc0MzUwNzU5In0sImdpdmVuX25hbWUiOiJHZW9mZnJleSIsImZhbWlseV9uYW1lIjoiQ2Fpcm5zIiwibmlja25hbWUiOiJnZW9mZnJleWNhaXJuczAiLCJuYW1lIjoiR2VvZmZyZXkgQ2Fpcm5zIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBVFhBSnlxUlNESlFMQXBvd2YwdnNTc21ISWtEdTI0TmJoTGI4Q1owZTRkPXM5Ni1jIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAyMi0wMi0wNlQxNTo1OToxMy43OTdaIiwiZW1haWwiOiJnZW9mZnJleWNhaXJuczBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vamVmZmNhLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMzYxNDM2ODc4NTA3NDM1MDc1OSIsImF1ZCI6IlVSamN0UEU5bnVDcjRWOXJGWVdYYmZFeDA0Z1o5RmFhIiwiaWF0IjoxNjQ0MTYzMTU1LCJleHAiOjE2NDY3NTUxNTUsIm5vbmNlIjoiWjVnaWdRTGU3SlFzUVBnd3BCQ2swbFFhdmxHV0lQdVhzaEZKdVIxOXVISSJ9.ZcRAzpMlMxtcSvdMTCjsqC8fdbWw-TFiLnTjYgixvgCYmv3gclDymy1CkDvGqPOLJcccZuGSQMbnMk_p8Kc9x-W7picsbb6FfbO_C4uTLxCCTZ96SF-vjfiWUHWKOCDyIb_e5DtDE4FDQ3rYy9rRisTVDtciOxyczY9bFentAIQLBPcY4z6WD9mcr61hBWm3W8LpIVGR1Y_4LJ0AKD6CmkeHaLNMPU3Mc-r0rt5xMMXHPtIc00imYjtjcZ-HN7nLbM4hOmS43XrlN4KzGp0g55QJW8ygahlqYMprc-cc8iJtbeaUYa8gA693zKaBvJAj2BsynSX7cCYhxoSBPL7QvQ`;
		$userInfo['nickname'] = 'Guest';
		$claims = $idToken;
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
	{#if !$idToken }
		<div class="text-left container-fluid">
			<h2 class="text-center" id="title">Groceries, Recipes And Meal Prep</h2>
<!-- 			<h1 class="text-center welcome">Welcome to Jeff Cairns' recipe book & more!</h1>
			<h2 class="text-center">Grimp! saves all of your home recipes and allows you to easily share them with friends. Easily manage your grocery list and track your inventory, too.</h2>
			<p>&nbsp;</p>
			<h4 class="text-center">Sign up or login with Google, Facebook or your personal email.</h4>
			<h6 class="text-center"><em>Jeff Cairns will receive your name, email and profile picture if you sign up with Google or Facebook</em></h6>
 -->
 			<div class="text-center">
				<Auth0Context domain="jeffca.auth0.com" client_id="URjctPE9nuCr4V9rFYWXbfEx04gZ9Faa" callback_url="{env	}" logout_url="http://localhost:5000">
					<Auth0LoginButton class="btn btn-lg">Login</Auth0LoginButton>
				</Auth0Context>		
			</div>
			<div>&nbsp;</div>
 			<div class="text-center">
					<a href="/" use:link><button class="btn btn-lg btn-primary" on:click|once={loginAsGuest}>Continue as Guest</button></a>
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

