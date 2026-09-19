# StreamShelf
Take home test for TWC


Going for unidirectional data flow by separating out presentation, from domain, from data. The presentation layer should only have access to the domain layer. The domain layer should only have access to the data layer. The presentation should never touch files directly in the data layer. 
In presentation we will have screens covering the full views, and components wherever a reusable view can be extracted.
AsyncStateView will be a view that can render states needed during async calls. Loading state, loaded state, empty state, and error state.
This centralizes the different expected states of all the full views, since they pretend to fetch data, and should handle errors similarly.
I will expose props to pass in if we want to change the default loading, empty, or error state that the AsyncStateView already provides.
AsyncStorageProvicer keeps dependencies of persistent libraries out of domain layer, and in data layer. That way if we ever change libraries, it can be done in a centralized location, without affecting other hooks in the domain layer.
catalogDataSource will be hardcoded values for now. If the purpose of the take home was to show full stack, I would have made this a restful API call. That could have gone as far as docker compose to spin up some relational database (eg postgres), and rest API in nodejs server with a formal contract. The model from the contract could have been reused on frontend as shared code, as one of the benefits of nodeJS backend. The idea excites me, but I know it's besides the point of a project geared for CTV + react native :)