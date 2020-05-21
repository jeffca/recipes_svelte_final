<script>
  import { onMount } from "svelte";
  import { markDone } from "../helpers.js";
  import {link} from 'svelte-spa-router'

  export let items = [];
  export let remainingItems = [];

  onMount(async () => {
  fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query {
    grocerylist(where: {Done: {_eq: "No"}}) {
        Item
    }
}` 
    })
  })
    .then(res => res.json())
    .then(res => {
      items = res.data.grocerylist;
  });     
  items = items;
  });

</script>



<table class="table table-responsive table-light">
  <legend>Grocery List</legend>
  <thead>
    <!-- <th>Grocery List</th> -->
  </thead>

  <tbody>
    {#each items as ite }
    <tr class='table-danger'>     
      <td class="groceryListItem">{ite.Item}
      <!-- <div class="input-group mb-3"> -->
        <!-- <div class="input-group-prepend"> -->
         <!-- <div class="input-group-text"> -->
        <button on:click={markDone(ite.Item, this.parentElement.parentElement)} class="btn btn-lg btn-light markDone">Mark Done &nbsp; <img class="svg" src="/open-iconic-master/svg/circle-check.svg" alt='circle-check'></button>
          <!-- </div> -->
        <!-- </div> -->
        <!-- </div> -->
      <!-- <label for="done{ite.Item}"><input type="checkbox" id="done{ite.Item}"/>Done</label></td> -->
      </td>
    </tr>
  {/each}


  </tbody>
</table>

<br />

<button on:click={() => location.reload()} class="btn btn-lg btn-primary float-right">Refresh</button>