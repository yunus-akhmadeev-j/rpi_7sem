const UserAction = {
    UPDATE_TASK: 'UPDATE_TASK',
    ADD_TASK: 'ADD_TASK',
    DELETE_TASK: 'DELETE_TASK',
  };
  
  const UpdateType = {
    PATCH: 'PATCH',
    MINOR: 'MINOR',
    MAJOR: 'MAJOR',
    INIT: 'INIT'
  };
  
  
  const Status = {
    BACKLOG: `backlog`,
    PROCESSING: `processing`,
    DONE: `done`,
    BASKET: `basket`,
  };
  
  const StatusLabel = {
    [Status.BACKLOG]: `Backlog`,
    [Status.PROCESSING]: `In Process`,
    [Status.DONE]: `Done`,
    [Status.BASKET]: `Basket`,
  };
  
  export {Status, StatusLabel, UpdateType , UserAction};