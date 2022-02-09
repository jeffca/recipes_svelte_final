import { getContext } from 'svelte';

import { authToken, userInfo, idToken } from '@dopry/svelte-auth0';

import { groceryListCount } from './stores.js';

export {
  addUserRecipe,
  addAllItemsToGroceryList, 
  addToGroceryList, 
  markDone, 
  loginAsGuest,
  executeGraphql,
  countGroceryList,
}

  async function countGroceryList(claims) {
      console.log("Counting the grocery list");
      let q = `
          {
              grocerylist_aggregate(where: {Done: {_eq: "No"}}) {
                  aggregate {
                      count
                  }
              }
          }
      `
      let temp = await executeGraphql(q, claims); 
      console.log(temp.data.grocerylist_aggregate.aggregate.count);
      return temp.data.grocerylist_aggregate.aggregate.count;

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
            countGroceryList(claims)
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

  function loginAsGuest() {
    console.log("guest trying to login");
    userInfo['nickname'] = 'Guest';
    return `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUVXpRMEZFTWpOQ016VkdSVEE1TVRSR05EVkVRVUZDUlVWQk1qSTVNekl5UlVaQlJFSXlOUSJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6Imdvb2dsZS1vYXV0aDJ8MTAzNjE0MzY4Nzg1MDc0MzUwNzU5In0sImdpdmVuX25hbWUiOiJHZW9mZnJleSIsImZhbWlseV9uYW1lIjoiQ2Fpcm5zIiwibmlja25hbWUiOiJnZW9mZnJleWNhaXJuczAiLCJuYW1lIjoiR2VvZmZyZXkgQ2Fpcm5zIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBVFhBSnlxUlNESlFMQXBvd2YwdnNTc21ISWtEdTI0TmJoTGI4Q1owZTRkPXM5Ni1jIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAyMi0wMi0wNlQxNTo1OToxMy43OTdaIiwiZW1haWwiOiJnZW9mZnJleWNhaXJuczBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vamVmZmNhLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMzYxNDM2ODc4NTA3NDM1MDc1OSIsImF1ZCI6IlVSamN0UEU5bnVDcjRWOXJGWVdYYmZFeDA0Z1o5RmFhIiwiaWF0IjoxNjQ0MTYzMTU1LCJleHAiOjE2NDY3NTUxNTUsIm5vbmNlIjoiWjVnaWdRTGU3SlFzUVBnd3BCQ2swbFFhdmxHV0lQdVhzaEZKdVIxOXVISSJ9.ZcRAzpMlMxtcSvdMTCjsqC8fdbWw-TFiLnTjYgixvgCYmv3gclDymy1CkDvGqPOLJcccZuGSQMbnMk_p8Kc9x-W7picsbb6FfbO_C4uTLxCCTZ96SF-vjfiWUHWKOCDyIb_e5DtDE4FDQ3rYy9rRisTVDtciOxyczY9bFentAIQLBPcY4z6WD9mcr61hBWm3W8LpIVGR1Y_4LJ0AKD6CmkeHaLNMPU3Mc-r0rt5xMMXHPtIc00imYjtjcZ-HN7nLbM4hOmS43XrlN4KzGp0g55QJW8ygahlqYMprc-cc8iJtbeaUYa8gA693zKaBvJAj2BsynSX7cCYhxoSBPL7QvQ`;
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
  
