# Service Project Front End

## TODO

- [ ] update api route for deleting a user's opp
- [ ] remove an opp from the service list if a user add's it

- [ ] run AI model on opps

- [ ] validate forms
- [ ] sanitize href for opp's website so it doesnt link back to this one if "https://" is missing
- [ ] stop duplicate opps being created

- [ ] optimize all queries with onError, onSettle, etc...

- [ ] remove `null`s, switch to `undefined`
- [ ] remove console.log
- [ ] OG Tags
- [ ] responsive

### Done

- [x] clean up queries <https://codesandbox.io/s/crimson-leaf-210ju?file=/pages/index.tsx>
- [x] refactor fetches into custom hooks / functions
- [x] refetch opps on rating mutate
- [x] user -> "join" service opp
- [x] user rate service opp
- [x] set up initial user survey

  - [x] create modal
  - [x] only open modal if user hasn't selected anything
  - [x] send data to server

- [x] hook up /admin/create mutation to api

- [x] pass rating value to ServiceOpp
