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



<table class="table table-light">
  <thead>
    <th>Recipe</th>
    <th>Meal</th>
  </thead>

  <tbody>
    {#each recipes as rec }
    <tr class="{rec.BootstrapClass}">     
      <td><a href='/recipes/{rec.id}' use:link>{rec.Recipe}</a></td>
      <td>{rec.Meal}</td>
    </tr>
  {/each}


  </tbody>
</table>

