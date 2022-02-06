<script>
  import { onMount } from "svelte";
  import { markDone, executeGraphql } from "../helpers.js";
  import {link} from 'svelte-spa-router'
  import { claims } from '../stores.js';

  export let items = [];
  export let remainingItems = [];

  onMount(async () => {


  let q = `
  {
    grocerylist(where: {Done: {_eq: "No"}}) {
        Item
    }
  }
  `;
  let temp = await executeGraphql(q, $claims); 

  items = temp.data.grocerylist;

  });

</script>


<div class="container-fluid">
<table class="table table-responsive table-light" id="groceryList">
  <legend>Grocery List</legend>
  <thead>
    <!-- <th>Grocery List</th> -->
  </thead>

  <tbody>
    {#each items as ite }
    <tr class='row-danger'>     
      <td class="groceryListItem">{ite.Item}
      <!-- <div class="input-group mb-3"> -->
        <!-- <div class="input-group-prepend"> -->
         <!-- <div class="input-group-text"> -->
        <button on:click={markDone(ite.Item, this.parentElement.parentElement, $claims)} class="btn btn-lg btn-light markDone">&nbsp; <img class="svg" src="/open-iconic-master/svg/cart.svg" alt="cart"> <img class="svg" src="/open-iconic-master/svg/circle-check.svg" alt='circle-check' id="markDone"></button>
          <!-- </div> -->
        <!-- </div> -->
        <!-- </div> -->
      <!-- <label for="done{ite.Item}"><input type="checkbox" id="done{ite.Item}"/>Done</label></td> -->
      </td>
    </tr>
  {/each}


  </tbody>

</table>
</div>
<br />

<button on:click={() => location.reload()} class="btn btn-lg btn-primary float-right">Refresh</button>