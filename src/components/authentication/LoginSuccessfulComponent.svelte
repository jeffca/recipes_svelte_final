<script>
  import { onMount } from "svelte";
//   import { markDone } from "../helpers.js";
  import {location, querystring, link} from 'svelte-spa-router';
  export let params;

  console.log(querystring);
//   console.log(params.state);

  console.log("HI from AUTH");

</script>

<h1>Welcome back!</h1>
<small><em>Your encoded JWT token is: {params.code} {params.state} </em></small>
<table class="table-responsive table-light">
    <legend>Record Your Recent Meals</legend>
    <tbody>
        <tr>
            <td>
                <button type="button" class="btn btn-primary">
                Breakfast <span class="badge badge-light">1</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Lunch <span class="badge badge-light">1</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Dinner <span class="badge badge-light">1</span>
                </button>
            </td>
        </tr>

        <tr>
            <td>
                <button type="button" class="btn btn-primary">
                Salad <span class="badge badge-secondary">0</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Snack <span class="badge badge-secondary">0</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Smoothie <span class="badge badge-secondary">0</span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-primary">
                Dessert <span class="badge badge-secondary">0</span>
                </button>
            </td>            
        </tr>

    </tbody>
</table>
