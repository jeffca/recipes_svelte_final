import { getContext } from 'svelte';

import { authToken, userInfo, idToken } from '@dopry/svelte-auth0';

export {
  addUserRecipe,
  addAllItemsToGroceryList, 
  addToGroceryList, 
  markDone, 
  executeGraphql
}


function addUserRecipe(recipeId, claims) {
  //Hasura has a column preset to set UserId = logged in user
  fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 
          Accept: 'application/json',
          'Content-Type': 'application/json',
           Authorization: `Bearer ${claims} `
         },
        body: JSON.stringify({ query: `
          mutation {
            insert_users_recipes_one(object: {
              RecipeID: ${recipeId}, 
            }) {
              id
            } 
          }
        `
        })
      })
        .then(res => res.json())
        .then(res => {
            console.log(res.data);
            return res.data;

      });       
}

function addToGroceryList(ingredient, claims) {
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 
          Accept: 'application/json',
          'Content-Type': 'application/json',
           Authorization: `Bearer ${claims} `
         },
        body: JSON.stringify({ query: `
          mutation {
            insert_grocerylist_one(object:{
                GroceryListID: 1,
                Item: "${ingredient}",
                Done: "No"                
            }) {
              Item
            }
          }
          `
        })
      })
        .then(res => res.json())
        .then(res => {
            console.log(res.data);
            return res.data;

      });       
  }

  function addAllItemsToGroceryList(items, disabled) {
    disabled = "disabled";
    console.log(items);
    for (var i = 0; i < items.length; i++) {
      fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `mutation {
              insert_grocerylist_one(object:{
                GroceryListID: 2,
                Item: "${items[i].ingredients_recipe.Ingredient}",
                Done: "No"
              }) {
                Item
              }
            }`
          })
        })
          .then(res => res.json())
          .then(res => {
              console.log(res.data);
              console.log(disabled);
              return disabled;
        });   
    }
  }

  function markDone(ingredient, html_element, claims) {
    html_element.className = 'table-success';
    fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: { 
          Accept: 'application/json',
          'Content-Type': 'application/json' ,
          Authorization: `Bearer ${claims}`
        },
        body: JSON.stringify({ query: `mutation {
            update_grocerylist(where: {Item: { _eq: "${ingredient}"}},
            _set: {
              Done: "Yes"
            }
          ) {
            affected_rows
            returning {
              Item
              Done
            }
          }
        }`
        })
      })
        .then(res => res.json())
        .then(res => {
            console.log(res.data);
            return "success";
      });       
  }



  // async function refreshGroceryList(items) {
  //   items = fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ query: `{
  //           grocerylist(where: {Done: {_eq: "No"}}) {
  //             id
  //             Item
  //           }
  //         }`
  //     })
  //   })
  //     .then(res => res.json())
  //     .then(res => {
  //       console.log(res.data);
  //       items = res.data.grocerylist;
  //       console.log(items);
  //       return items;
  //     })          
  // }

  async function executeGraphql(query, claims) {
    console.log(claims);
        const resp = await fetch("https://graphql-jeffrecipes.herokuapp.com/v1/graphql", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${claims} `,
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ query: query })
          });
          return await resp.json();        

  }
  
