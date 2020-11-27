# Pathfinding Visualizer

## Content Page
  * [Description](#description)
  * [Algorithms](#algorithms)
  * [Features](#features)
  * [Technologies](#technologies)



### Description

Welcome to my pathfinding visualizer. I built this application to better understand how pathfinding algorithms work and to see them in action !

To check it out, here's the link: [Pathfinding Visualizer](https://pathfind-alv.netlify.app/)

---


### Algorithms

Dijkstra's Algorithm: the father of pathfinding algorithms; guarantees the shortest path

A* Search(without diagonals): A modified version of Dijkstra's Algorithm, it uses heuristics(Manhattan) to guarantee the shortest path much faster than Dijkstra's 
Algorithm

A* Search(with diagonals): Same as above but much faster as it allows diagonal traversals. Uses Euclidean heuristics to guarantee a shorter path. 

---

##### App Demo:

![demo1](misc/casit_1.gif)

![demo2](misc/caseit_2.gif)

1. User sign up/ sign in (Auth)
2. One click add to basket / remove from basket (Using Redux)
3. Redux state persist using redux-persist
4. Live search using Fuse.js
5. Payment enabled using Stripe.js API
6. Database storage of user's order history using Firebase Functions
7. Mobile Responsive 

---

### Features



---


### Technologies

##### ReactJS/Redux

1. React Routers for accessing different pages, i.e. signin/signout page, home page, payment page, checkout page etc.  
2. React Hooks
3. Redux for state management and creating actions such as adding item to basket, removing item from basket, clearing basket

##### Firebase / NodeJS/ Express

1. Firebase for authentication
2. Firestore for items database storage
3. Firebase functions with NodeJS/Express to store user's order history in Firestore. 

##### Misc.

1. Fuse.js (Live keyword search feature)
2. Stripe.js (enable payment for products in basket)
3. Mobile Responsiveness using CSS media queries

---



