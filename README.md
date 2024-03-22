### Install
```bash
yarn install
```
### Start the server
```bash
yarn run dev
```
### Use it
Open Chrome and javascript console, and go to `http://localhost:4000` in your browser.
See this:  
```

       !
       !
       ^                  %cWelcome to the Explorer!%c
      / \\                 Here are some common reasons for connection issues: 
     /___\\            
    |=   =|            
    |     |               %cConnection Refused:%c
    |  %cA%c  |               - Is your GraphQL endpoint served at /graphql or /api/graphql?
    |  %cP%c  |               - Is your server running at ${url}? 
    |  %cO%c  |                
    |  %cL%c  |               %cCORS Errors:%c 
    |  %cL%c  |               - Is your endpoint sending CORS headers for studio.apollographql.com?
    |  %cO%c  |                
    |     |               %cAuthentication:%c
    |     |               - Does your endpoint require authentication?/|##!##|\\              
  / |##!##| \\              
 /  |##!##|  \\
 |  / ^ | ^ \\  |
 | /  %c(%c | %c)%c  \\ |
 |/   %c(%c | %c)%c   \\|
      %c(%c(   )%c)
    (%c(%c  :%c  )%c)
    (%c(%c  :%c  )%c)
      (%c(   )%c)
       (%c( )%c)%c
           ( )
    `   
```
